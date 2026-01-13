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
  };
  content: {
    greeting: string;
    body: string[];
    closing: string;
  };
  date: string;
}

export const CoverLetterElegantHTML: React.FC<{ 
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
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: `${ptToPx(20)}px`,
    } as React.CSSProperties,
    name: {
      fontSize: `${fontSizeValue + 10}pt`,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '2.2pt',
      color: '#171717',
      textAlign: 'center',
      width: '100%',
    } as React.CSSProperties,
    title: {
      fontSize: `${fontSizeValue}pt`,
      color: themeColor,
      textTransform: 'uppercase',
      letterSpacing: '1pt',
      textAlign: 'center',
      marginTop: '4px',
    } as React.CSSProperties,
    contactLine: {
      marginTop: '8px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: '10px',
      fontSize: `${fontSizeValue - 2}pt`,
      color: '#404040',
    } as React.CSSProperties,
    thickBar: {
      height: '12px',
      width: '100%',
      backgroundColor: themeColor,
      marginTop: '15px',
      marginBottom: `${ptToPx(20)}px`,
    } as React.CSSProperties,
    date: {
      fontSize: `${fontSizeValue - 1}pt`,
      color: '#737373',
      textAlign: 'center',
      marginBottom: `${ptToPx(24)}px`,
    } as React.CSSProperties,
    companySection: {
      marginBottom: `${ptToPx(24)}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    } as React.CSSProperties,
    companyName: {
      fontSize: `${fontSizeValue + 1}pt`,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1pt',
      color: '#171717',
    } as React.CSSProperties,
    greeting: {
      fontSize: `${fontSizeValue}pt`,
      fontWeight: '700',
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
      marginTop: `${ptToPx(24)}px`,
      marginBottom: '4px',
    } as React.CSSProperties,
    signature: {
      fontSize: `${fontSizeValue + 2}pt`,
      fontWeight: '700',
      color: themeColor,
      textTransform: 'uppercase',
      letterSpacing: '1pt',
    } as React.CSSProperties,
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.name}>{data.personal.name}</div>
        {data.personal.title && (
          <div style={styles.title}>{data.personal.title}</div>
        )}
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

      <div style={styles.thickBar} />

      <div style={styles.date}>{data.date}</div>

      {data.company.name && (
        <div style={styles.companySection}>
          <div style={styles.companyName}>{data.company.name}</div>
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
