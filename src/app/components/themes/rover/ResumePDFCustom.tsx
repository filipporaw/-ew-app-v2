import { View } from "@react-pdf/renderer";
import { spacing } from "components/themes/styles";
import { RoverBulletList, RoverSection } from "./common";

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
    <RoverSection heading={heading} themeColor={themeColor}>
      <View style={{ marginTop: spacing["0.5"] }}>
        <RoverBulletList items={descriptions} showBulletPoints={showBulletPoints} />
      </View>
    </RoverSection>
  );
};

