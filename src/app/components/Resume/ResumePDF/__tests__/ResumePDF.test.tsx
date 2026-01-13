import React from 'react';
import { render } from '@testing-library/react';
import { ResumePDF } from '../index';
import { getTheme } from 'components/themes/lib';

// Mock components
jest.mock('components/themes/lib', () => ({
  getTheme: jest.fn(() => {
    const ThemeMock = ({ resume, settings }: any) => (
      <div data-testid={`theme-${settings.theme}`}>Theme: {settings.theme}</div>
    );
    ThemeMock.displayName = 'ThemeMock';
    return ThemeMock;
  }),
  getAllThemesAvailable: jest.fn(() => ['default', 'minimal', 'rover', 'road', 'elegant']),
}));

jest.mock('components/themes/core/SuppressResumePDFErrorMessage', () => ({
  SuppressResumePDFErrorMessage: () => null,
}));

describe('ResumePDF Theme Selection', () => {
  const mockResume = {
    profile: { name: 'John Doe', summary: '', email: '', phone: '', url: '', location: '', photo: '', photoShape: 'circle' },
    workExperiences: [],
    educations: [],
    projects: [],
    skills: { featuredSkills: [], descriptions: [] },
    custom: { descriptions: [] },
  };

  const mockSettings = {
    theme: 'default',
    themeColor: '#000',
    sectionHeadingColor: '#fff',
    fontFamily: 'Roboto',
    fontSize: '9',
    documentSize: 'Letter',
    coverLetterTheme: 'default',
    formToShow: { workExperiences: true, educations: true, projects: true, skills: true, custom: false },
    formToHeading: { workExperiences: '', educations: '', projects: '', skills: '', custom: '' },
    formsOrder: ['workExperiences' as const, 'educations' as const, 'projects' as const, 'skills' as const, 'custom' as const],
    showBulletPoints: { workExperiences: true, educations: true, projects: true, skills: true, custom: true },
    privacyStatements: { italyPrivacy: false, euPrivacy: false },
  };

  it('renders the correct theme component based on settings', () => {
    const themes = ['minimal', 'rover', 'road', 'elegant'];
    
    themes.forEach(theme => {
      const { getByTestId, unmount } = render(
        <ResumePDF 
          resume={mockResume as any} 
          settings={{ ...mockSettings, theme } as any} 
        />
      );
      
      expect(getByTestId(`theme-${theme}`)).toBeTruthy();
      expect(getTheme).toHaveBeenCalledWith(theme);
      unmount();
    });
  });
});
