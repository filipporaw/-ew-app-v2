import { View, Image } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/themes/core/ResumePDFIcon";
import { styles, spacing } from "components/themes/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/themes/core";
import type { ResumeProfile } from "lib/redux/types";
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
  const { name, email, phone, url, summary, location, photo, photoShape: rawPhotoShape } = profile;
  const photoShape = rawPhotoShape ?? "circle";
  const iconProps = { email, phone, location, url };

  // Photo size in points
  const photoSize = 80;
  const photoBorderRadius = photoShape === "circle" ? photoSize / 2 : 0;

  return (
    <ResumePDFSection style={{ marginTop: spacing["4"] }}>
      <View
        style={{
          ...styles.flexRowBetween,
          alignItems: "flex-start",
          marginBottom: spacing["0.5"],
        }}
      >
        <View 
          style={{ 
            ...styles.flexCol,
            flex: 1, 
            marginRight: photo ? spacing["4"] : 0, 
            flexShrink: 1,
            maxWidth: photo ? "calc(100% - 100pt)" : "100%",
            overflow: "hidden",
          } as any}
        >
          <ResumePDFText
            bold={true}
            themeColor={themeColor}
            style={{ 
              fontSize: "20pt",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            } as any}
          >
            {name}
          </ResumePDFText>
          {summary && (
            <ResumePDFText 
              style={{ 
                marginTop: spacing["1"],
                wordBreak: "break-word",
                overflowWrap: "break-word",
              } as any}
            >
              {summary}
            </ResumePDFText>
          )}
        </View>
        {photo && (
          <View style={{ flexShrink: 0 }}>
            {isPDF ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image
                src={photo}
                style={{
                  width: `${photoSize}pt`,
                  height: `${photoSize}pt`,
                  borderRadius: `${photoBorderRadius}pt`,
                }}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */
              <img
                src={photo}
                alt=""
                style={{
                  width: `${photoSize}pt`,
                  height: `${photoSize}pt`,
                  borderRadius: `${photoBorderRadius}pt`,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
          </View>
        )}
      </View>
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: "wrap",
          marginTop: spacing["0.5"],
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType = key as IconType;
          if (key === "url") {
            if (value.includes("github")) {
              iconType = "url_github";
            } else if (value.includes("linkedin")) {
              iconType = "url_linkedin";
            }
          }

          const shouldUseLinkWrapper = ["email", "url", "phone"].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = "";
            switch (key) {
              case "email": {
                src = `mailto:${value}`;
                break;
              }
              case "phone": {
                src = `tel:${value.replace(/[^\d+]/g, "")}`; // Keep only + and digits
                break;
              }
              default: {
                src = value.startsWith("http") ? value : `https://${value}`;
              }
            }

            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                gap: spacing["1"],
                flexShrink: 1,
                maxWidth: "100%",
              }}
            >
              <ResumePDFIcon type={iconType} isPDF={isPDF} />
              <Wrapper>
                <ResumePDFText style={{ flexShrink: 1 }}>{processTextForPDF(value)}</ResumePDFText>
              </Wrapper>
            </View>
          );
        })}
      </View>
    </ResumePDFSection>
  );
};
