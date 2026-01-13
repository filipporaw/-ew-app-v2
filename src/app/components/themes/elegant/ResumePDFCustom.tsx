import { View } from "@react-pdf/renderer";
import { spacing } from "components/themes/styles";
import { ElegantBulletList, ElegantSection } from "./common";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
  showBulletPoints,
  headingColor,
}: {
  heading: string;
  custom: { descriptions: string[] };
  themeColor: string;
  showBulletPoints: boolean;
  headingColor: string;
}) => {
  const { descriptions } = custom;
  return (
    <ElegantSection heading={heading} themeColor={themeColor} headingColor={headingColor}>
      <View style={{ marginTop: spacing["0.5"], paddingLeft: spacing["4"] }}>
        <ElegantBulletList items={descriptions} showBulletPoints={showBulletPoints} />
      </View>
    </ElegantSection>
  );
};

