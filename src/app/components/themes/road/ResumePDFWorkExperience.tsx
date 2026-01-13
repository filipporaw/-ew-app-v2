import { View } from "@react-pdf/renderer";
import type { ResumeWorkExperience } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { RoadBulletList, RoadSection, RoadText } from "./common";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  return (
    <RoadSection heading={heading} themeColor={themeColor}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => (
        <View key={idx} style={idx === 0 ? {} : { marginTop: spacing["4"] }}>
          <View style={{ ...styles.flexRowBetween, gap: spacing["2"] }}>
            <RoadText bold={true} style={{ fontSize: "13pt" }}>
              {company}
            </RoadText>
            <RoadText style={{ textAlign: "right" }}>{date}</RoadText>
          </View>
          {jobTitle ? (
            <RoadText style={{ marginTop: spacing["1"] }}>
              {jobTitle}
            </RoadText>
          ) : null}
          <View style={{ marginTop: spacing["1.5"], paddingLeft: spacing["4"] }}>
            <RoadBulletList items={descriptions} showBulletPoints={showBulletPoints} />
          </View>
        </View>
      ))}
    </RoadSection>
  );
};

