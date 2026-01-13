import { View } from "@react-pdf/renderer";
import { spacing } from "components/themes/styles";
import { RoadBulletList, RoadSection } from "./common";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  custom: { descriptions: string[] };
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  const { descriptions } = custom;
  return (
    <RoadSection heading={heading} themeColor={themeColor}>
      <View style={{ marginTop: spacing["0.5"], paddingLeft: spacing["4"] }}>
        <RoadBulletList items={descriptions} showBulletPoints={showBulletPoints} />
      </View>
    </RoadSection>
  );
};

