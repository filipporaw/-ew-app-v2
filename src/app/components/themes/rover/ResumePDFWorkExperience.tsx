import { View } from "@react-pdf/renderer";
import type { ResumeWorkExperience } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { RoverBulletList, RoverSection, RoverText } from "./common";

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
    <RoverSection heading={heading} themeColor={themeColor}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;

        return (
          <View key={idx} style={idx === 0 ? {} : { marginTop: spacing["3"] }}>
            {!hideCompanyName ? (
              <RoverText bold={true}>{company}</RoverText>
            ) : null}
            <View
              style={{
                ...styles.flexRowBetween,
                gap: spacing["2"],
                marginTop: hideCompanyName ? "-" + spacing["1"] : spacing["1"],
              }}
            >
              <RoverText style={{ flex: 1 } as any}>{jobTitle}</RoverText>
              <RoverText style={{ textAlign: "right" }}>{date}</RoverText>
            </View>
            <View style={{ marginTop: spacing["1.5"] }}>
              <RoverBulletList items={descriptions} showBulletPoints={showBulletPoints} />
            </View>
          </View>
        );
      })}
    </RoverSection>
  );
};

