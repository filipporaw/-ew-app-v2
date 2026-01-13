import { View } from "@react-pdf/renderer";
import type { ResumeProfile } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { RoadLink, RoadPhoto, RoadText } from "./common";
import { processTextForPDF } from "lib/break-long-text";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const {
    name,
    summary,
    email,
    phone,
    url,
    location,
    photo,
    photoShape: rawPhotoShape,
  } = profile;
  const photoShape = rawPhotoShape ?? "circle";
  const photoSize = 80;

  const parts: Array<{ text: string; href?: string }> = [
    email ? { text: email, href: `mailto:${email}` } : null,
    phone
      ? { text: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` }
      : null,
    url
      ? {
          text: url,
          href: url.startsWith("http") ? url : `https://${url}`,
        }
      : null,
    location ? { text: location } : null,
  ].filter(Boolean) as any;

  const renderContactLine = () => (
    <View style={{ ...styles.flexRow, flexWrap: "wrap", justifyContent: "center", gap: spacing["2"] } as any}>
      {parts.map((p, idx) => {
        const node = (
          <RoadText
            style={{
              fontSize: "9pt",
              letterSpacing: "0.6pt",
              textTransform: "uppercase",
            }}
          >
            {processTextForPDF(p.text)}
          </RoadText>
        );
        if (p.href) {
          return (
            <RoadLink key={idx} src={p.href} isPDF={isPDF}>
              {node}
            </RoadLink>
          );
        }
        return <View key={idx}>{node}</View>;
      })}
    </View>
  );

  // Keep the header visually centered even when photo exists by adding a left spacer.
  return (
    <View style={{ ...styles.flexCol, marginTop: spacing["2"] }}>
      <View style={{ ...styles.flexRowBetween, alignItems: "flex-start" }}>
        {photo ? <View style={{ width: `${photoSize}pt` }} /> : <View />}

        <View style={{ ...styles.flexCol, flex: 1, alignItems: "center" }}>
          <RoadText
            bold={true}
            style={{
              fontSize: "18pt",
              letterSpacing: "1.6pt",
              textTransform: "uppercase",
              textAlign: "center",
            } as any}
          >
            {name}
          </RoadText>
          <View style={{ marginTop: spacing["2"] }}>{renderContactLine()}</View>
          {summary ? (
            <RoadText style={{ marginTop: spacing["2"], textAlign: "center" } as any}>
              {summary}
            </RoadText>
          ) : null}
        </View>

        {photo ? (
          <View style={{ width: `${photoSize}pt` }}>
            <RoadPhoto
              photo={photo}
              photoShape={photoShape}
              sizePt={photoSize}
              isPDF={isPDF}
            />
          </View>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

