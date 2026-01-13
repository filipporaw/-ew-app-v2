import { View } from "@react-pdf/renderer";
import type { ResumeProfile } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { ElegantLink, ElegantPhoto, ElegantText } from "./common";
import { processTextForPDF } from "lib/break-long-text";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
  headingColor,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
  headingColor: string;
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

  // Requirement: if image is inserted, it must be smaller than other themes and on same row as name, left.
  const photoSize = 46;

  const contacts: Array<{ text: string; href?: string }> = [
    phone ? { text: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` } : null,
    email ? { text: email, href: `mailto:${email}` } : null,
    location ? { text: location } : null,
    url ? { text: url, href: url.startsWith("http") ? url : `https://${url}` } : null,
  ].filter(Boolean) as any;

  return (
    <View style={{ ...styles.flexCol, marginTop: spacing["2"] }}>
      {/* Name row (with optional small photo on the left, but name remains centered) */}
      <View
        style={{
          ...styles.flexRow,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "relative",
          minHeight: photoSize,
        }}
      >
        {photo ? (
          <View style={{ position: "absolute", left: 0 }}>
            <ElegantPhoto
              photo={photo}
              photoShape={photoShape}
              sizePt={photoSize}
              isPDF={isPDF}
            />
          </View>
        ) : null}
        
        <View style={{ width: "100%" }}>
          <ElegantText
            bold={true}
            style={{
              width: "100%",
              fontSize: "18pt",
              letterSpacing: "2.2pt",
              textTransform: "uppercase",
              textAlign: "center",
            } as any}
          >
            {name}
          </ElegantText>
        </View>
      </View>

      {/* Contact line with separators */}
      {contacts.length > 0 ? (
        <View style={{ marginTop: spacing["2"], ...styles.flexRow, justifyContent: "center", flexWrap: "wrap" } as any}>
          {contacts.map((c, idx) => {
            const node = (
              <ElegantText style={{ fontSize: "9pt" }}>
                {processTextForPDF(c.text)}
              </ElegantText>
            );
            const content = c.href ? (
              <ElegantLink key={idx} src={c.href} isPDF={isPDF}>
                {node}
              </ElegantLink>
            ) : (
              <View key={idx}>{node}</View>
            );

            return (
              <View key={idx} style={{ ...styles.flexRow, alignItems: "center" }}>
                {content}
                {idx < contacts.length - 1 ? (
                  <ElegantText style={{ marginLeft: spacing["2"], marginRight: spacing["2"], fontSize: "9pt", opacity: 0.7 } as any}>
                    {"|"}
                  </ElegantText>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}

      {/* Thin divider like screenshot (not the section bars) */}
      <View
        style={{
          marginTop: spacing["2"],
          height: "1pt",
          width: spacing["full"],
          backgroundColor: themeColor,
        }}
      />

      {/* Summary (objective) shown without the banded title */}
      {summary ? (
        <View style={{ marginTop: spacing["3"] }}>
          <View style={{ marginTop: spacing["1"] }}>
            <ElegantText style={{ lineHeight: 1.3 } as any}>{summary}</ElegantText>
          </View>
        </View>
      ) : null}
    </View>
  );
};

