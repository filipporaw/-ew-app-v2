"use client";
import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { ThemeSelections } from "components/ResumeForm/ThemeForm/Selection";
import {
  changeSettings,
  DEFAULT_THEME_COLOR,
  selectSettings,
  type GeneralSetting,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";

export const ThemeSelectionTop = () => {
  const settings = useAppSelector(selectSettings);
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  return (
    <BaseForm>
      <div>
        <InputGroupWrapper label="Theme" />
        <ThemeSelections
          themeColor={themeColor}
          selectedTheme={settings.theme}
          handleSettingsChange={handleSettingsChange}
        />
      </div>
    </BaseForm>
  );
};
