import { type JSX } from "react";
import { Document, Page, View } from "@react-pdf/renderer";
import { styles } from "components/themes/styles";
import { DEFAULT_FONT_COLOR, ShowForm } from "lib/redux/settingsSlice";
import { getPageMarginStyle, normalizeDocumentSize } from "lib/pdf/page-margins";
import { ResumePDFProps } from "components/themes/types";
import { SuppressResumePDFErrorMessage } from "components/themes/core/SuppressResumePDFErrorMessage";
import { ResumePDFPrivacyStatements } from "components/themes/core";
import { loadStateFromLocalStorage } from "lib/redux/local-storage";

import { ResumePDFProfile } from "./ResumePDFProfile";
import { ResumePDFWorkExperience } from "./ResumePDFWorkExperience";
import { ResumePDFEducation } from "./ResumePDFEducation";
import { ResumePDFProject } from "./ResumePDFProject";
import { ResumePDFSkills } from "./ResumePDFSkills";
import { ResumePDFCustom } from "./ResumePDFCustom";

export const ResumePDFElegant = ({
  resume,
  settings,
  themeColor,
  isPDF = false,
  showFormsOrder,
}: ResumePDFProps) => {
  console.log("[ResumePDFElegant] Rendering elegant theme, isPDF:", isPDF);
  
  const { profile, workExperiences, educations, projects, skills, custom } =
    resume;
  const { name } = profile;
  const {
    formToHeading,
    showBulletPoints,
    documentSize,
    fontFamily,
    fontSize,
    privacyStatements,
    sectionHeadingColor,
  } = settings;
  const headingColor =
    settings.theme === "elegant"
      ? sectionHeadingColor === "#000000"
        ? "#000000"
        : "#ffffff"
      : DEFAULT_FONT_COLOR;

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["workExperiences"]}
        headingColor={headingColor}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["educations"]}
        headingColor={headingColor}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading["projects"]}
        projects={projects}
        themeColor={themeColor}
        isPDF={Boolean(isPDF)}
        showBulletPoints={showBulletPoints["projects"]}
        headingColor={headingColor}
      />
    ),
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading["skills"]}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["skills"]}
        headingColor={headingColor}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["custom"]}
        headingColor={headingColor}
      />
    ),
  };

  const stateData = loadStateFromLocalStorage();
  const jsonMetadata = stateData ? JSON.stringify(stateData) : "";

  const normalizedPageSize = normalizeDocumentSize(documentSize);
  const pageMarginStyle = getPageMarginStyle(documentSize);

  const document = (
    <Document
      title={`${name} Resume`}
      author={name}
      producer={"cv---maker"}
      subject={jsonMetadata}
      keywords={`resume, cv, ${name}, cv---maker, json-data`}
      creator={"cv---maker"}
    >
      <Page
        wrap
        size={normalizedPageSize}
        style={{
          ...styles.flexCol,
          ...pageMarginStyle,
          color: DEFAULT_FONT_COLOR,
          fontFamily: fontFamily || "Roboto",
          fontSize: fontSize + "pt",
        }}
      >
        <View style={styles.flexCol}>
          <ResumePDFProfile
            profile={profile}
            themeColor={themeColor}
            isPDF={Boolean(isPDF)}
            headingColor={headingColor}
          />
          {showFormsOrder.map((form) => {
            const Component = formTypeToComponent[form];
            return <Component key={form} />;
          })}
          <ResumePDFPrivacyStatements
            italyPrivacy={privacyStatements.italyPrivacy}
            euPrivacy={privacyStatements.euPrivacy}
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
        </View>
      </Page>
    </Document>
  );

  if (isPDF) {
    return document;
  }

  return (
    <>
      {document}
      <SuppressResumePDFErrorMessage />
    </>
  );
};

