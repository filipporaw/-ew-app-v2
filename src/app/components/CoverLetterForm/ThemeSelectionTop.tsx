"use client";
import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import {
  changeSettings,
  DEFAULT_THEME_COLOR,
  selectSettings,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";

export const CoverLetterThemeSelectionTop = () => {
  const settings = useAppSelector(selectSettings);
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const coverLetterTheme = settings.coverLetterTheme || "default";
  const dispatch = useAppDispatch();

  const handleCoverLetterThemeChange = (theme: string) => {
    dispatch(changeSettings({ field: "coverLetterTheme", value: theme }));
  };

  return (
    <BaseForm>
      <div>
        <InputGroupWrapper label="Theme" />
        <div className="mt-2 flex flex-wrap gap-3">
          {["default", "minimal", "rover", "road", "elegant"].map((type, idx) => {
            return (
              <div
                key={idx}
                className="flex w-[105px] cursor-pointer items-center justify-center rounded-none border border-gray-300 py-1.5 shadow-none hover:border-gray-400 hover:bg-gray-100 text-center"
                onClick={() => handleCoverLetterThemeChange(type)}
                style={type === coverLetterTheme ? {
                  color: "white",
                  backgroundColor: themeColor,
                  borderColor: themeColor,
                } : {}}
                onKeyDown={(e) => {
                  if (["Enter", " "].includes(e.key)) handleCoverLetterThemeChange(type);
                }}
                tabIndex={0}
              >
                <span className="text-center leading-none capitalize">{type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </BaseForm>
  );
};
