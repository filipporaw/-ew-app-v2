import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import { TextDecoder, TextEncoder } from "util";

(global as any).TextDecoder = TextDecoder;
(global as any).TextEncoder = TextEncoder;

jest.mock("lib/parse-resume-from-pdf/read-pdf", () => ({
  readPdf: jest.fn(async () => {
    throw new Error("readPdf should not be called in metadata import tests");
  }),
}));

jest.mock("lib/parse-resume-from-pdf/group-text-items-into-lines", () => ({
  groupTextItemsIntoLines: jest.fn(() => []),
}));

jest.mock("lib/parse-resume-from-pdf/group-lines-into-sections", () => ({
  groupLinesIntoSections: jest.fn(() => ({})),
}));

jest.mock("lib/parse-resume-from-pdf/extract-resume-from-sections", () => ({
  extractResumeFromSections: jest.fn(() => ({})),
  detectPrivacyStatementsFromPDF: jest.fn(() => ({
    italyPrivacy: false,
    euPrivacy: false,
  })),
}));

const mockPdfLibDoc = (subject: string | undefined) => ({
  getTitle: () => "t",
  getAuthor: () => "a",
  getSubject: () => subject,
  getProducer: () => "cv---maker",
  getCreator: () => "cv---maker",
});

jest.mock("pdf-lib", () => ({
  PDFDocument: {
    load: jest.fn(async () => mockPdfLibDoc(undefined)),
  },
}));

jest.mock("pdfjs-dist", () => ({
  getDocument: jest.fn(() => ({
    promise: Promise.resolve({
      getAttachments: () => null,
      getMetadata: () =>
        Promise.resolve({
          info: { subject: undefined, producer: "cv---maker" },
        }),
    }),
  })),
}));

describe("parseResumeFromPdf metadata import", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn(async () => ({
      arrayBuffer: async () => new ArrayBuffer(8),
    }));
  });

  it("uses subject JSON when it contains resume/settings", async () => {
    const { PDFDocument } = require("pdf-lib");
    (PDFDocument.load as jest.Mock).mockImplementationOnce(async () =>
      mockPdfLibDoc(
        JSON.stringify({
          resume: { profile: { name: "Alice" } },
          settings: { theme: "default" },
        })
      )
    );

    const result = await parseResumeFromPdf("blob:fake");
    expect(result.resume.profile.name).toBe("Alice");
    expect(result.settings.theme).toBe("default");
  });

  it("uses attachment when subject is marker JSON", async () => {
    const { PDFDocument } = require("pdf-lib");
    (PDFDocument.load as jest.Mock).mockImplementationOnce(async () =>
      mockPdfLibDoc(
        JSON.stringify({
          cvMaker: true,
          version: 1,
          attachment: "cv-maker-state.json",
        })
      )
    );

    const { getDocument } = require("pdfjs-dist");
    (getDocument as jest.Mock).mockImplementationOnce(() => ({
      promise: Promise.resolve({
        getAttachments: () => ({
          "cv-maker-state.json": {
            filename: "cv-maker-state.json",
            content: (global as any).TextEncoder
              ? new (global as any).TextEncoder().encode(
              JSON.stringify({
                resume: { profile: { name: "Bob" } },
                settings: { theme: "rover" },
              })
            )
              : new Uint8Array([]),
          },
        }),
        getMetadata: () =>
          Promise.resolve({
            info: { subject: undefined, producer: "cv---maker" },
          }),
      }),
    }));

    const result = await parseResumeFromPdf("blob:fake");
    expect(result.resume.profile.name).toBe("Bob");
    expect(result.settings.theme).toBe("rover");
  });
});

