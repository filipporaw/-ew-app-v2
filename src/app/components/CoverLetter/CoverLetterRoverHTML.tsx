"use client";
import React from 'react';
import { getPageMarginCss } from "lib/pdf/page-margins";

interface CoverLetterData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    website?: string;
  };
  company: {
    name: string;
    jobTitle: string;
  };
  content: {
    greeting: string;
    body: string[];
    closing: string;
  };
  date: string;
}

export const CoverLetterRoverHTML: React.FC<{ 
  data: CoverLetterData;
  settings: any;
}> = ({ data, settings }) => {
  const { fontSize, fontFamily, themeColor } = settings;
  const fontFamilyValue = fontFamily || 'Inter';
  const fontSizeValue = parseInt(fontSize) || 11;
  const ptToPx = (pt: number) => Math.round(pt * 1.333);
  const pagePadding = getPageMarginCss(settings.documentSize);

  const styles = {
    page: {
      fontFamily: `${fontFamilyValue}, system-ui, sans-serif`,
      fontSize: `${fontSizeValue}pt`,
      color: '#171717',
      backgroundColor: '#ffffff',
      padding: pagePadding,
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: `${ptToPx(30)}px`,
      paddingBottom: `${ptToPx(16)}px`,
    } as React.CSSProperties,
    nameSection: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1',
    } as React.CSSProperties,
    name: {
      fontSize: `${fontSizeValue + 12}pt`,
      fontWeight: '700',
      color: '#171717',
      lineHeight: '1.1',
    } as React.CSSProperties,
    title: {
      fontSize: `${fontSizeValue + 1}pt`,
      color: themeColor,
      marginTop: '4px',
    } as React.CSSProperties,
    contact: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      fontSize: `${fontSizeValue - 2}pt`,
      color: '#404040',
      flex: '0 0 auto',
      gap: '2px',
      textAlign: 'right',
    } as React.CSSProperties,
    divider: {
      height: '1px',
      width: '100%',
      backgroundColor: themeColor,
      marginBottom: `${ptToPx(20)}px`,
    } as React.CSSProperties,
    date: {
      fontSize: `${fontSizeValue - 1}pt`,
      color: '#737373',
      textAlign: 'right',
      marginBottom: `${ptToPx(20)}px`,
    } as React.CSSProperties,
    companyInfo: {
      marginBottom: `${ptToPx(24)}px`,
    } as React.CSSProperties,
    companyName: {
      fontSize: `${fontSizeValue + 1}pt`,
      fontWeight: '700',
      color: '#171717',
      marginBottom: '2px',
    } as React.CSSProperties,
    greeting: {
      fontSize: `${fontSizeValue}pt`,
      fontWeight: '700',
      color: '#171717',
      marginBottom: `${ptToPx(16)}px`,
    } as React.CSSProperties,
    paragraph: {
      fontSize: `${fontSizeValue}pt`,
      lineHeight: '1.6',
      textAlign: 'justify',
      marginBottom: `${ptToPx(12)}px`,
      whiteSpace: 'pre-wrap',
      minHeight: '1.6em',
    } as React.CSSProperties,
    closing: {
      fontSize: `${fontSizeValue}pt`,
      fontWeight: '700',
      color: '#171717',
      marginTop: `${ptToPx(20)}px`,
      marginBottom: '4px',
    } as React.CSSProperties,
    signature: {
      fontSize: `${fontSizeValue + 2}pt`,
      fontWeight: '700',
      color: themeColor,
    } as React.CSSProperties,
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.nameSection}>
          <div style={styles.name}>{data.personal.name}</div>
          {data.personal.title && (
            <div style={styles.title}>{data.personal.title}</div>
          )}
        </div>
        <div style={styles.contact}>
          <div>{data.personal.email}</div>
          <div>{data.personal.phone}</div>
          {data.personal.website && <div>{data.personal.website}</div>}
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.date}>{data.date}</div>

      {data.company.name && (
        <div style={styles.companyInfo}>
          <div style={styles.companyName}>To: {data.company.name}</div>
        </div>
      )}

      <div style={styles.greeting}>{data.content.greeting}</div>
      
      {data.content.body.map((paragraph, index) => (
        <div key={index} style={styles.paragraph}>{paragraph}</div>
      ))}

      <div style={styles.closing}>{data.content.closing}</div>
      <div style={styles.signature}>{data.personal.name}</div>
    </div>
  );
};
