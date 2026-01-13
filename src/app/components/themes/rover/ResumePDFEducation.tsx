import { View } from "@react-pdf/renderer";
import type { ResumeEducation } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { RoverBulletList, RoverSection, RoverText } from "./common";

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
    <RoverSection heading={heading} themeColor={themeColor}>
      {educations.map(({ school, degree, date, gpa, descriptions = [] }, idx) => {
        const bullets = [
          gpa ? `Cumulative GPA: ${gpa}` : "",
          ...descriptions,
        ].filter(Boolean);

        return (
          <View key={idx} style={idx === 0 ? {} : { marginTop: spacing["3"] }}>
            <View style={{ ...styles.flexRowBetween, gap: spacing["2"] }}>
              <RoverText bold={true} style={{ flex: 1 } as any}>
                {degree ? `${school} | ${degree}` : school}
              </RoverText>
              <RoverText style={{ textAlign: "right" }}>{date}</RoverText>
            </View>
            <View style={{ marginTop: spacing["1.5"] }}>
              <RoverBulletList
                items={bullets}
                showBulletPoints={showBulletPoints}
              />
            </View>
          </View>
        );
      })}
    </RoverSection>
  );
};

