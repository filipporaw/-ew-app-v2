import { View } from "@react-pdf/renderer";
import type { ResumeProject } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { RoverBulletList, RoverLink, RoverSection, RoverText } from "./common";

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
    <RoverSection heading={heading} themeColor={themeColor}>
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
          <View key={idx} style={idx === 0 ? {} : { marginTop: spacing["3"] }}>
            <View style={{ ...styles.flexRowBetween, gap: spacing["2"] }}>
              <View style={{ ...styles.flexRow, gap: spacing["1"] }}>
                <RoverText bold={true}>{title || project}</RoverText>
                {link ? (
                  <RoverLink src={linkHref} isPDF={isPDF}>
                    <RoverText style={{ fontStyle: "italic" }}>{link}</RoverText>
                  </RoverLink>
                ) : null}
              </View>
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

