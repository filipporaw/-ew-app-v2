/* eslint-disable @next/next/no-img-element */
import { Text, View, Link, Image } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/themes/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";

export const RoverText = ({
  bold = false,
  style = {},
  children,
}: {
  bold?: boolean;
  style?: Style;
  children: React.ReactNode;
}) => {
  return (
    <Text
      style={{
        fontWeight: bold ? "bold" : "normal",
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {children}
    </Text>
  );
};

export const RoverLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none", color: "inherit" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none", color: "inherit", wordBreak: "break-all" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const RoverSection = ({
  heading,
  themeColor,
  style = {},
  children,
}: {
  heading: string;
  themeColor: string;
  style?: Style;
  children: React.ReactNode;
}) => {
  return (
    <View style={{ ...styles.flexCol, gap: spacing["1"], marginTop: spacing["3"], ...style }}>
      <View style={{ ...styles.flexCol, gap: spacing["1"] }}>
        <RoverText
          bold={true}
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.4pt",
            fontSize: "11pt",
          }}
        >
          {heading}
        </RoverText>
        <View
          style={{
            height: "1pt",
            width: spacing["full"],
            backgroundColor: themeColor,
          }}
          debug={DEBUG_RESUME_PDF_FLAG}
        />
      </View>
      {children}
    </View>
  );
};

export const RoverBulletList = ({
  items,
  showBulletPoints = true,
}: {
  items: string[];
  showBulletPoints?: boolean;
}) => {
  const cleaned = items
    .filter((x) => x && x.trim() !== "")
    .map((x) => x.replace(/^\s*•\s?/, ""));
  if (cleaned.length === 0) return null;
  return (
    <View style={{ ...styles.flexCol, gap: spacing["1"], width: "100%" }}>
      {cleaned.map((item, idx) => (
        <View key={idx} style={{ ...styles.flexRow, flexWrap: "nowrap", width: "100%" }}>
          {showBulletPoints ? (
            <Text style={{ width: spacing["4"], lineHeight: 1.15, flexShrink: 0 }}>
              {"•"}
            </Text>
          ) : null}
          <Text style={{ flex: 1, lineHeight: 1.15 }}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

export const RoverPhoto = ({
  photo,
  photoShape,
  sizePt,
  isPDF,
}: {
  photo: string;
  photoShape: "circle" | "square";
  sizePt: number;
  isPDF: boolean;
}) => {
  const borderRadiusPt = photoShape === "circle" ? sizePt / 2 : 0;
  if (isPDF) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return (
      <Image
        src={photo}
        style={{
          width: `${sizePt}pt`,
          height: `${sizePt}pt`,
          borderRadius: `${borderRadiusPt}pt`,
          objectFit: "cover",
        }}
      />
    );
  }

  /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */
  return (
    <img
      src={photo}
      alt="Profile"
      style={{
        width: `${sizePt}pt`,
        height: `${sizePt}pt`,
        borderRadius: `${borderRadiusPt}pt`,
        objectFit: "cover",
        display: "block",
      }}
    />
  );
};

