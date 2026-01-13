import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections, detectPrivacyStatementsFromPDF } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import * as pdfjs from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

const tryParseJson = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const looksLikeCvMakerState = (v: unknown) => {
  if (!isObject(v)) return false;
  return isObject((v as any).resume);
};

const looksLikeCvMakerMarker = (v: unknown) => {
  if (!isObject(v)) return false;
  // Marker shape we write when JSON is too large for subject
  return Boolean((v as any).cvMaker) || typeof (v as any).attachment === "string";
};

const tryReadStateFromAttachmentsWithPdfjs = async (
  fileUrl: string,
  preferredAttachmentName?: string
) => {
  try {
    const pdfFile = await (pdfjs as any).getDocument(fileUrl).promise;
    const attachments = await (pdfFile as any).getAttachments?.();
    if (!attachments) return null;

    const decoder = new TextDecoder("utf-8");
    const candidates = Object.values(attachments) as Array<any>;

    // Prefer a specific attachment if caller tells us one
    if (preferredAttachmentName) {
      const preferred = candidates.find(
        (a) => (a?.filename || "") === preferredAttachmentName
      );
      if (preferred?.content) {
        const text = decoder.decode(preferred.content);
        const parsed = tryParseJson(text);
        if (looksLikeCvMakerState(parsed)) return parsed;
      }
    }

    for (const att of candidates) {
      const filename: string = att?.filename || "";
      const content: Uint8Array | undefined = att?.content;
      if (!content || !filename.toLowerCase().endsWith(".json")) continue;

      const text = decoder.decode(content);
      const parsed = tryParseJson(text);
      if (!parsed) continue;

      // Prefer cv-maker/open-resume attachments, but accept any resume-shaped JSON as fallback.
      if (
        filename.includes("cv-maker") ||
        filename.includes("open-resume") ||
        looksLikeCvMakerState(parsed)
      ) {
        if (looksLikeCvMakerState(parsed)) return parsed;
      }
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Check if PDF contains cv---maker metadata and extract JSON data
 */
/**
 * Check if PDF contains cv---maker metadata and extract JSON data using pdf-lib
 */
const extractMetadataFromPDF = async (fileUrl: string) => {
  try {
    console.log('📄 Attempting to read PDF metadata with pdf-lib...');
    
    // Fetch the PDF file
    const response = await fetch(fileUrl);
    const pdfBytes = await response.arrayBuffer();
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Get metadata
    const title = pdfDoc.getTitle();
    const author = pdfDoc.getAuthor();
    const subject = pdfDoc.getSubject();
    const producer = pdfDoc.getProducer();
    const creator = pdfDoc.getCreator();
    
    console.log('📄 PDF metadata found with pdf-lib:');
    console.log('📄 Title:', title);
    console.log('📄 Author:', author);
    console.log('📄 Subject length:', subject?.length || 0);
    console.log('📄 Subject preview:', subject?.substring(0, 200) || 'No subject');
    console.log('📄 Producer:', producer);
    console.log('📄 Creator:', creator);
    
    // PRIORITÀ ASSOLUTA: Se c'è un subject con contenuto, proviamo a usarlo.
    // NOTA: il subject può essere sia lo state completo, sia un marker che punta all'allegato JSON.
    if (subject && subject.length > 0) {
      console.log("🎯 Found subject field, attempting to parse as JSON");
      const parsedData = tryParseJson(subject);
      if (looksLikeCvMakerState(parsedData)) {
        console.log("🎯 Successfully parsed full state from subject field");
        return parsedData;
      }
      if (looksLikeCvMakerMarker(parsedData)) {
        console.log("🎯 Subject looks like marker; trying attachment fallback");
        const preferredAttachment =
          typeof (parsedData as any)?.attachment === "string"
            ? (parsedData as any).attachment
            : undefined;
        const attachmentData = await tryReadStateFromAttachmentsWithPdfjs(
          fileUrl,
          preferredAttachment
        );
        if (looksLikeCvMakerState(attachmentData)) {
          console.log("🎯 Successfully parsed JSON from PDF attachment via marker");
          return attachmentData;
        }
      } else {
        console.log("📄 Subject field is JSON but not a cv-maker state");
      }

      // Fallback: controlla se è un PDF cv---maker anche senza JSON valido
      if (producer === "cv---maker") {
        console.log("🎯 This is a cv---maker PDF but subject isn't usable; will try attachments");
      }
    }

    // If subject is missing/invalid, try reading embedded JSON attachment (robust for large photos).
    const attachmentData = await tryReadStateFromAttachmentsWithPdfjs(fileUrl);
    if (looksLikeCvMakerState(attachmentData)) {
      console.log('🎯 Successfully parsed JSON from PDF attachment');
      return attachmentData;
    }
    
    // Controllo aggiuntivo per PDF cv---maker con producer corretto
    if (producer === 'cv---maker') {
      console.log('🎯 Found cv---maker producer but no valid JSON in subject');
    }
    
    return null;
  } catch (error) {
    console.log('📄 Error reading PDF metadata with pdf-lib:', error);
    
    // Fallback to pdfjs-dist if pdf-lib fails
    try {
      console.log('📄 Falling back to pdfjs-dist...');
      const pdfFile = await pdfjs.getDocument(fileUrl).promise;
      const metadata = await pdfFile.getMetadata();
      
      console.log('📄 PDF metadata found with pdfjs-dist:', metadata);
      console.log('📄 PDF metadata info:', (metadata.info as any));
      console.log('📄 PDF producer:', (metadata.info as any)?.producer);
      console.log('📄 PDF subject length:', (metadata.info as any)?.subject?.length || 0);
      console.log('📄 PDF subject preview:', (metadata.info as any)?.subject?.substring(0, 200) || 'No subject');
      
      // Try to parse subject as JSON
      const subject = (metadata.info as any)?.subject;
      if (subject && subject.length > 0) {
        console.log('🎯 Found subject field with pdfjs-dist, attempting to parse as JSON');
        const parsedData = tryParseJson(subject);
        if (looksLikeCvMakerState(parsedData)) {
          console.log("🎯 Successfully parsed full state from subject field with pdfjs-dist");
          return parsedData;
        }
        if (looksLikeCvMakerMarker(parsedData)) {
          console.log("🎯 Subject looks like marker with pdfjs-dist; trying attachment fallback");
          const preferredAttachment =
            typeof (parsedData as any)?.attachment === "string"
              ? (parsedData as any).attachment
              : undefined;
          const attachmentData = await tryReadStateFromAttachmentsWithPdfjs(
            fileUrl,
            preferredAttachment
          );
          if (looksLikeCvMakerState(attachmentData)) {
            console.log("🎯 Successfully parsed JSON from PDF attachment via marker (pdfjs-dist)");
            return attachmentData;
          }
        }
      }

      // Try attachments with pdfjs-dist
      const attachmentData = await tryReadStateFromAttachmentsWithPdfjs(fileUrl);
      if (looksLikeCvMakerState(attachmentData)) {
        console.log('🎯 Successfully parsed JSON from PDF attachment with pdfjs-dist');
        return attachmentData;
      }
      
      return null;
    } catch (fallbackError) {
      console.log('📄 Both pdf-lib and pdfjs-dist failed:', fallbackError);
      return null;
    }
  }
};

/**
 * Resume parser util that parses a resume from a resume pdf file
 *
 * Note: The parser algorithm only works for single column resume in English language
 * If the PDF contains cv---maker metadata, it will use that data instead of parsing
 */
export const parseResumeFromPdf = async (fileUrl: string) => {
  console.log('📄 Starting PDF parsing for:', fileUrl);
  
  // PRIORITÀ ASSOLUTA: Controlla prima i metadati del PDF
  console.log('🎯 STEP 1: Checking PDF metadata for JSON data...');
  const metadataData = await extractMetadataFromPDF(fileUrl);
  
  if (metadataData) {
    console.log('🎯 ✅ SUCCESS: Using metadata data instead of parsing PDF');
    console.log('🎯 Metadata contains:', Object.keys(metadataData));
    return {
      resume: metadataData.resume,
      settings: metadataData.settings,
      privacyStatements: metadataData.privacyStatements || { italyPrivacy: false, euPrivacy: false },
    };
  }
  
  console.log('📄 ❌ No metadata found, proceeding with traditional PDF parsing');
  console.log('📄 This means the PDF was not generated by cv---maker or metadata is corrupted');
  
  // Step 1. Read a pdf resume file into text items to prepare for processing
  const textItems = await readPdf(fileUrl);

  // Step 2. Group text items into lines
  const lines = groupTextItemsIntoLines(textItems);

  // Step 3. Group lines into sections
  const sections = groupLinesIntoSections(lines);

  // Step 4. Extract resume from sections
  const resume = extractResumeFromSections(sections);
  
  // Step 5. Detect privacy statements
  const privacyStatements = detectPrivacyStatementsFromPDF(sections);

  return {
    resume,
    settings: null,
    privacyStatements,
  };
};
