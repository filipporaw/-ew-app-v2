import { View } from "@react-pdf/renderer";
import type { ResumeProject } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { ElegantBulletList, ElegantLink, ElegantSection, ElegantText } from "./common";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  isPDF,
  showBulletPoints,
  headingColor,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  isPDF: boolean;
  showBulletPoints: boolean;
  headingColor: string;
}) => {
  return (
    <ElegantSection heading={heading} themeColor={themeColor} headingColor={headingColor}>
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
                <ElegantText bold={true}>{title || project}</ElegantText>
                {link ? (
                  <ElegantLink src={linkHref} isPDF={isPDF}>
                    <ElegantText style={{ fontStyle: "italic" }}>{link}</ElegantText>
                  </ElegantLink>
                ) : null}
              </View>
              <ElegantText style={{ textAlign: "right" }}>{date}</ElegantText>
            </View>
            <View style={{ marginTop: spacing["1.5"], paddingLeft: spacing["4"] }}>
              <ElegantBulletList items={descriptions} showBulletPoints={showBulletPoints} />
            </View>
          </View>
        );
      })}
    </ElegantSection>
  );
};

