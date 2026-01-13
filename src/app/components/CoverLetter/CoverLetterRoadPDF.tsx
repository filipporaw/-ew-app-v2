"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ENGLISH_FONT_FAMILIES } from "components/fonts/constants";
import { getPageMarginStyle, normalizeDocumentSize } from "lib/pdf/page-margins";

interface CoverLetterPDFProps {
  coverLetter: any;
  settings: any;
}

const createRoadStyles = (
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
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: themeColor,
      marginBottom: 30,
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 30,
    },
    name: {
      fontSize: fontSizeValue + 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      color: '#171717',
      marginBottom: 8,
    },
    contactLine: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      fontSize: fontSizeValue - 2,
      color: '#404040',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    date: {
      fontSize: fontSizeValue - 1,
      color: '#737373',
      marginBottom: 20,
    },
    companyName: {
      fontSize: fontSizeValue + 1,
      fontWeight: 'bold',
      color: '#171717',
      marginBottom: 16,
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

export const CoverLetterRoadPDF = ({ coverLetter, settings }: CoverLetterPDFProps) => {
  const normalizedPageSize = normalizeDocumentSize(settings.documentSize);
  const pageMarginStyle = getPageMarginStyle(settings.documentSize);
  const styles = createRoadStyles(settings, pageMarginStyle);
  const { profile, content } = coverLetter;

  const coverLetterData = {
    personal: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      website: profile.location || ""
    },
    company: {
      name: profile.company,
    },
    content: {
      greeting: profile.hiringManager || "Dear Hiring Manager,",
      body: content && content.length > 0
        ? content.split(/\r?\n\r?\n/)
        : ["I am writing to express my interest in this position."],
      closing: profile.closing || "Best Regards,"
    },
    date: profile.date || new Date().toLocaleDateString('it-IT')
  };

  return (
    <Document title={`${coverLetterData.personal.name} - Cover Letter`}>
      <Page wrap size={normalizedPageSize} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{coverLetterData.personal.name}</Text>
          <View style={styles.contactLine}>
            <Text>{coverLetterData.personal.email}</Text>
            <Text>|</Text>
            <Text>{coverLetterData.personal.phone}</Text>
            {coverLetterData.personal.website && (
              <>
                <Text>|</Text>
                <Text>{coverLetterData.personal.website}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.date}>{coverLetterData.date}</Text>

        {coverLetterData.company.name && (
          <Text style={styles.companyName}>{coverLetterData.company.name}</Text>
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
