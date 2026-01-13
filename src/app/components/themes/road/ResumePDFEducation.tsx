import { View } from "@react-pdf/renderer";
import type { ResumeEducation } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { RoadBulletList, RoadSection, RoadText } from "./common";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  return (
    <RoadSection heading={heading} themeColor={themeColor}>
      {educations.map(({ school, degree, date, gpa, descriptions = [] }, idx) => {
        const bullets = [
          gpa ? `Cumulative GPA: ${gpa}` : "",
          ...descriptions,
        ].filter(Boolean);
        return (
          <View key={idx} style={idx === 0 ? {} : { marginTop: spacing["4"] }}>
            <View style={{ ...styles.flexRowBetween, gap: spacing["2"] }}>
              <RoadText bold={true} style={{ fontSize: "13pt" }}>
                {school}
              </RoadText>
              <RoadText style={{ textAlign: "right" }}>{date}</RoadText>
            </View>
            {degree ? (
              <RoadText style={{ marginTop: spacing["1"] }}>
                {degree}
              </RoadText>
            ) : null}
            <View style={{ marginTop: spacing["1.5"], paddingLeft: spacing["4"] }}>
              <RoadBulletList items={bullets} showBulletPoints={showBulletPoints} />
            </View>
          </View>
        );
      })}
    </RoadSection>
  );
};

