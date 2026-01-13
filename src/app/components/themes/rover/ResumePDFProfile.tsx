import { View } from "@react-pdf/renderer";
import type { ResumeProfile } from "lib/redux/types";
import { styles, spacing } from "components/themes/styles";
import { RoverLink, RoverPhoto, RoverText } from "./common";
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

  const contactLines: Array<{ label: string; value?: string; href?: string }> =
    [
      email ? { label: "Email", value: email, href: `mailto:${email}` } : null,
      phone
        ? {
            label: "Mobile",
            value: phone,
            href: `tel:${phone.replace(/[^\d+]/g, "")}`,
          }
        : null,
      url
        ? {
            label: "Website",
            value: url,
            href: url.startsWith("http") ? url : `https://${url}`,
          }
        : null,
      location ? { label: "Location", value: location } : null,
    ].filter(Boolean) as any;

  const photoSize = 80;

  return (
    <View style={{ ...styles.flexCol, marginTop: spacing["2"] }}>
      {/* Layout A: no photo -> match base rover example (name/summary left, contacts right) */}
      {!photo ? (
        <View style={{ ...styles.flexCol }}>
          <View style={{ ...styles.flexRowBetween, alignItems: "flex-start" }}>
            <View style={{ flex: 1, paddingRight: spacing["6"] }}>
              <RoverText
                bold={true}
                style={{
                  fontSize: "24pt",
                  lineHeight: 1.1,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                } as any}
              >
                {name}
              </RoverText>
            </View>

            <View
              style={{
                ...styles.flexCol,
                alignItems: "flex-end",
                gap: spacing["1"],
              }}
            >
              {contactLines.map((c, idx) => {
                const line = (
                  <RoverText style={{ textAlign: "right", lineHeight: 1.25 }}>
                    {`${c.label}: ${processTextForPDF(c.value || '')}`}
                  </RoverText>
                );
                if (c.href) {
                  return (
                    <RoverLink key={idx} src={c.href} isPDF={isPDF}>
                      {line}
                    </RoverLink>
                  );
                }
                return <View key={idx}>{line}</View>;
              })}
            </View>
          </View>
          {summary ? (
            <View style={{ marginTop: spacing["4"] }}>
                <RoverText style={{ lineHeight: 1.25, textAlign: "left" }}>
                {summary}
              </RoverText>
            </View>
          ) : null}
        </View>
      ) : (
        /* Layout B: photo on the left; all content to the right of photo */
        <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
          <View style={{ width: `${photoSize}pt` }}>
            <RoverPhoto
              photo={photo}
              photoShape={photoShape}
              sizePt={photoSize}
              isPDF={isPDF}
            />
          </View>

          <View style={{ ...styles.flexCol, flex: 1, marginLeft: spacing["2"] }}>
            <View>
              <RoverText
                bold={true}
                style={{
                  fontSize: "24pt",
                  lineHeight: 1.1,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                } as any}
              >
                {name}
              </RoverText>
            </View>

            {summary ? (
              <View style={{ marginTop: spacing["1"] }}>
                <RoverText style={{ lineHeight: 1.25 }}>{summary}</RoverText>
              </View>
            ) : null}

            <View style={{ ...styles.flexCol, gap: spacing["1"], marginTop: spacing["2"] }}>
              {contactLines.map((c, idx) => {
                const line = (
                  <RoverText style={{ lineHeight: 1.25 }}>
                    {`${c.label}: ${processTextForPDF(c.value || '')}`}
                  </RoverText>
                );
                if (c.href) {
                  return (
                    <RoverLink key={idx} src={c.href} isPDF={isPDF}>
                      {line}
                    </RoverLink>
                  );
                }
                return <View key={idx}>{line}</View>;
              })}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

