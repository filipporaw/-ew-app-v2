import { View } from "@react-pdf/renderer";
import type { ResumeSkills } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { RoadBulletList, RoadSection, RoadText } from "./common";

export const ResumePDFSkills = ({
  heading,
  skills,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  skills: ResumeSkills;
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  const { descriptions, featuredSkills } = skills;
  const featuredSkillsWithText = featuredSkills.filter((item) => item.skill);
  const numDots = 5;

  return (
    <RoadSection heading={heading} themeColor={themeColor}>
      {featuredSkillsWithText.length > 0 ? (
        <View style={{ ...styles.flexCol, gap: spacing["1.5"] }}>
          {featuredSkillsWithText.map((fs, idx) => (
            <View key={idx} style={{ ...styles.flexRowBetween, gap: spacing["2"] }}>
              <RoadText style={{ flex: 1 } as any}>{fs.skill}</RoadText>
              <View style={{ ...styles.flexRow, alignItems: "center" }}>
                {[...Array(numDots)].map((_, dotIdx) => (
                  <View
                    key={dotIdx}
                    style={{
                      height: "7pt",
                      width: "7pt",
                      marginLeft: dotIdx === 0 ? 0 : "3pt",
                      borderRadius: 3.5,
                      backgroundColor: fs.rating > dotIdx ? themeColor : "#d9d9d9",
                    }}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <View style={{ marginTop: featuredSkillsWithText.length > 0 ? spacing["2"] : 0, paddingLeft: spacing["4"] }}>
        <RoadBulletList items={descriptions} showBulletPoints={showBulletPoints} />
      </View>
    </RoadSection>
  );
};

