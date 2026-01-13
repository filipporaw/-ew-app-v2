import { View } from "@react-pdf/renderer";
import type { ResumeSkills } from "lib/redux/types";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/themes/styles";
import { RoverBulletList, RoverSection, RoverText } from "./common";

const RoverFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <RoverText style={{ marginRight: spacing[0.5] } as any}>
        {skill}
      </RoverText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "7pt",
            width: "7pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
            borderRadius: 3.5,
          }}
        />
      ))}
    </View>
  );
};

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
  const featuredSkillsPair = [
    [featuredSkillsWithText[0], featuredSkillsWithText[3]],
    [featuredSkillsWithText[1], featuredSkillsWithText[4]],
    [featuredSkillsWithText[2], featuredSkillsWithText[5]],
  ];

  return (
    <RoverSection heading={heading} themeColor={themeColor}>
      {featuredSkillsWithText.length > 0 && (
        <View style={{ ...styles.flexRowBetween, marginTop: spacing["0.5"] }}>
          {featuredSkillsPair.map((pair, idx) => (
            <View
              key={idx}
              style={{
                ...styles.flexCol,
              }}
            >
              {pair.map((featuredSkill, idx) => {
                if (!featuredSkill) return null;
                return (
                  <RoverFeaturedSkill
                    key={idx}
                    skill={featuredSkill.skill}
                    rating={featuredSkill.rating}
                    themeColor={themeColor}
                    style={{
                      justifyContent: "flex-end",
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      )}
      <View style={{ ...styles.flexCol }}>
        <RoverBulletList items={descriptions} showBulletPoints={showBulletPoints} />
      </View>
    </RoverSection>
  );
};

