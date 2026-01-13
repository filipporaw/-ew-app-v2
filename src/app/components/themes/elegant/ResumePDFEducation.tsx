import { View } from "@react-pdf/renderer";
import type { ResumeEducation } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { ElegantBulletList, ElegantSection, ElegantText } from "./common";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints,
  headingColor,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
  showBulletPoints: boolean;
  headingColor: string;
}) => {
  return (
    <ElegantSection heading={heading} themeColor={themeColor} headingColor={headingColor}>
      {educations.map(({ school, degree, date, gpa, descriptions = [] }, idx) => {
        const bullets = [
          gpa ? `GPA: ${gpa}` : "",
          ...descriptions,
        ].filter(Boolean);
        return (
          <View key={idx} style={idx === 0 ? {} : { marginTop: spacing["4"] }}>
            <View style={{ ...styles.flexRowBetween, gap: spacing["2"] }}>
              <ElegantText bold={true}>{school}</ElegantText>
              <ElegantText style={{ textAlign: "right" }}>{date}</ElegantText>
            </View>
            {degree ? (
              <ElegantText style={{ marginTop: spacing["1"] }}>{degree}</ElegantText>
            ) : null}
            <View style={{ marginTop: spacing["1.5"], paddingLeft: spacing["4"] }}>
              <ElegantBulletList items={bullets} showBulletPoints={showBulletPoints} />
            </View>
          </View>
        );
      })}
    </ElegantSection>
  );
};

