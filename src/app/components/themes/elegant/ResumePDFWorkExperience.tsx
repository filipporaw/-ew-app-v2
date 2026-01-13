import { View } from "@react-pdf/renderer";
import type { ResumeWorkExperience } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { ElegantBulletList, ElegantSection, ElegantText } from "./common";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
  showBulletPoints,
  headingColor,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
  showBulletPoints: boolean;
  headingColor: string;
}) => {
  return (
    <ElegantSection heading={heading} themeColor={themeColor} headingColor={headingColor}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => (
        <View key={idx} style={idx === 0 ? {} : { marginTop: spacing["4"] }}>
          <View style={{ ...styles.flexRowBetween, gap: spacing["2"] }}>
            <ElegantText bold={true}>{jobTitle || "Position Title"}</ElegantText>
            <ElegantText style={{ textAlign: "right" }}>{date}</ElegantText>
          </View>
          {company ? (
            <ElegantText style={{ marginTop: spacing["0.5"] }}>{company}</ElegantText>
          ) : null}
          <View style={{ marginTop: spacing["2"], paddingLeft: spacing["4"] }}>
            <ElegantBulletList items={descriptions} showBulletPoints={showBulletPoints} />
          </View>
        </View>
      ))}
    </ElegantSection>
  );
};

