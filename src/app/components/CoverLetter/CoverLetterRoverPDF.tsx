"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ENGLISH_FONT_FAMILIES } from "components/fonts/constants";
import { getPageMarginStyle, normalizeDocumentSize } from "lib/pdf/page-margins";

interface CoverLetterPDFProps {
  coverLetter: any;
  settings: any;
}

const createRoverStyles = (
  settings: any,
  pageMarginStyle: ReturnType<typeof getPageMarginStyle>
) => {
  const { fontSize, fontFamily, themeColor } = settings;
  const fontFamilyValue = ENGLISH_FONT_FAMILIES.includes(fontFamily) ? fontFamily : "Roboto";
  const fontSizeValue = parseInt(fontSize) || 11;

  return StyleSheet.create({
    page: {
      ...pageMarginStyle,
      fontSize: fontSizeValue,
      fontFamily: fontFamilyValue,
      lineHeight: 1.5,
      color: '#171717',
      backgroundColor: '#ffffff',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 30,
      paddingBottom: 16,
    },
    nameSection: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    name: {
      fontSize: fontSizeValue + 12,
      fontWeight: 'bold',
      color: '#171717',
      lineHeight: 1.1,
    },
    title: {
      fontSize: fontSizeValue + 1,
      color: themeColor,
      marginTop: 4,
    },
    contact: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      fontSize: fontSizeValue - 2,
      color: '#404040',
      flex: '0 0 auto',
      gap: 2,
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: themeColor,
      marginBottom: 20,
    },
    date: {
      fontSize: fontSizeValue - 1,
      color: '#737373',
      textAlign: 'right',
      marginBottom: 20,
    },
    companyInfo: {
      marginBottom: 24,
    },
    companyName: {
      fontSize: fontSizeValue + 1,
      fontWeight: 'bold',
      color: '#171717',
      marginBottom: 2,
    },
    greeting: {
      fontSize: fontSizeValue,
      fontWeight: 'bold',
      color: '#171717',
      marginBottom: 16,
    },
    paragraph: {
      fontSize: fontSizeValue,
      lineHeight: 1.6,
      textAlign: 'justify',
      marginBottom: 12,
      minHeight: fontSizeValue * 1.6,
    },
    closing: {
      fontSize: fontSizeValue,
      fontWeight: 'bold',
      color: '#171717',
      marginTop: 20,
      marginBottom: 4,
    },
    signature: {
      fontSize: fontSizeValue + 2,
      fontWeight: 'bold',
      color: themeColor,
    },
  });
};

export const CoverLetterRoverPDF = ({ coverLetter, settings }: CoverLetterPDFProps) => {
  const normalizedPageSize = normalizeDocumentSize(settings.documentSize);
  const pageMarginStyle = getPageMarginStyle(settings.documentSize);
  const styles = createRoverStyles(settings, pageMarginStyle);
  const { profile, content } = coverLetter;

  const coverLetterData = {
    personal: {
      name: profile.name,
      title: profile.position || "",
      email: profile.email,
      phone: profile.phone,
      website: profile.location || ""
    },
    company: {
      name: profile.company,
      jobTitle: profile.position
    },
    content: {
      greeting: profile.hiringManager || "Dear Hiring Manager,",
      body: content && content.length > 0
        ? content.split(/\r?\n\r?\n/)
        : ["I am writing to express my interest in the " + (profile.position || "position") + " role."],
      closing: profile.closing || "Sincerely,"
    },
    date: profile.date || new Date().toLocaleDateString('it-IT')
  };

  return (
    <Document title={`${coverLetterData.personal.name} - Cover Letter`}>
      <Page wrap size={normalizedPageSize} style={styles.page}>
        <View style={styles.header}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>{coverLetterData.personal.name}</Text>
            {coverLetterData.personal.title && (
              <Text style={styles.title}>{coverLetterData.personal.title}</Text>
            )}
          </View>
          <View style={styles.contact}>
            <Text>{coverLetterData.personal.email}</Text>
            <Text>{coverLetterData.personal.phone}</Text>
            {coverLetterData.personal.website && <Text>{coverLetterData.personal.website}</Text>}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.date}>{coverLetterData.date}</Text>

        {coverLetterData.company.name && (
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>To: {coverLetterData.company.name}</Text>
          </View>
        )}

        <Text style={styles.greeting}>{coverLetterData.content.greeting}</Text>
        
        {coverLetterData.content.body.map((paragraph: string, index: number) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}

        <Text style={styles.closing}>{coverLetterData.content.closing}</Text>
        <Text style={styles.signature}>{coverLetterData.personal.name}</Text>
      </Page>
    </Document>
  );
};
