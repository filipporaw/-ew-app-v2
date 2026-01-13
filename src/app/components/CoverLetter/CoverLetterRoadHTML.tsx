"use client";
import React from 'react';
import { getPageMarginCss } from "lib/pdf/page-margins";

interface CoverLetterData {
  personal: {
    name: string;
    email: string;
    phone: string;
    website?: string;
  };
  company: {
    name: string;
  };
  content: {
    greeting: string;
    body: string[];
    closing: string;
  };
  date: string;
}

export const CoverLetterRoadHTML: React.FC<{ 
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
    divider: {
      height: '1px',
      width: '100%',
      backgroundColor: themeColor,
      marginBottom: `${ptToPx(30)}px`,
    } as React.CSSProperties,
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: `${ptToPx(30)}px`,
    } as React.CSSProperties,
    name: {
      fontSize: `${fontSizeValue + 10}pt`,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1.5pt',
      color: '#171717',
      marginBottom: '8px',
    } as React.CSSProperties,
    contactLine: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: '10px',
      fontSize: `${fontSizeValue - 2}pt`,
      color: '#404040',
      textTransform: 'uppercase',
      letterSpacing: '0.5pt',
    } as React.CSSProperties,
    date: {
      fontSize: `${fontSizeValue - 1}pt`,
      color: '#737373',
      marginBottom: `${ptToPx(20)}px`,
    } as React.CSSProperties,
    companyName: {
      fontSize: `${fontSizeValue + 1}pt`,
      fontWeight: '700',
      color: '#171717',
      marginBottom: `${ptToPx(16)}px`,
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
        <div style={styles.name}>{data.personal.name}</div>
        <div style={styles.contactLine}>
          <div>{data.personal.email}</div>
          <div>|</div>
          <div>{data.personal.phone}</div>
          {data.personal.website && (
            <>
              <div>|</div>
              <div>{data.personal.website}</div>
            </>
          )}
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.date}>{data.date}</div>

      {data.company.name && (
        <div style={styles.companyName}>{data.company.name}</div>
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
