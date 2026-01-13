import { View } from "@react-pdf/renderer";
import type { ResumeProject } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { RoadBulletList, RoadLink, RoadSection, RoadText } from "./common";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  isPDF,
  showBulletPoints,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  isPDF: boolean;
  showBulletPoints: boolean;
}) => {
  return (
    <RoadSection heading={heading} themeColor={themeColor}>
      {projects.map(({ project, date, descriptions }, idx) => {
        const parts = project.split("|").map((x) => x.trim());
        const title = parts[0] ?? "";
        const linkMaybe = parts[1] ?? "";
        const link =
          linkMaybe && (linkMaybe.includes(".") || linkMaybe.includes("/"))
            ? linkMaybe
            : "";
        const linkHref = link
          ? link.startsWith("http")
            ? link
            : `https://${link}`
          : "";

        return (
          <View key={idx} style={idx === 0 ? {} : { marginTop: spacing["4"] }}>
            <View style={{ ...styles.flexRowBetween, gap: spacing["2"] }}>
              <View style={{ ...styles.flexRow, gap: spacing["1"] }}>
                <RoadText bold={true} style={{ fontSize: "13pt" }}>
                  {title || project}
                </RoadText>
                {link ? (
                  <RoadLink src={linkHref} isPDF={isPDF}>
                    <RoadText>{link}</RoadText>
                  </RoadLink>
                ) : null}
              </View>
              <RoadText style={{ textAlign: "right" }}>{date}</RoadText>
            </View>
            <View style={{ marginTop: spacing["1.5"], paddingLeft: spacing["4"] }}>
              <RoadBulletList items={descriptions} showBulletPoints={showBulletPoints} />
            </View>
          </View>
        );
      })}
    </RoadSection>
  );
};

