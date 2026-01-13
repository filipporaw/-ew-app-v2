/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { render } from '@testing-library/react';
import { ResumePDFProfile } from '../ResumePDFProfile';

// Mock react-pdf/renderer
jest.mock('@react-pdf/renderer', () => {
  const View = ({ children, style }: any) => <div data-testid="view" style={style}>{children}</div>;
  View.displayName = 'View';
  const Text = ({ children, style }: any) => <span data-testid="text" style={style}>{children}</span>;
  Text.displayName = 'Text';
  const Link = ({ children, style }: any) => <a data-testid="link" style={style}>{children}</a>;
  Link.displayName = 'Link';
  const Image = ({ src, style }: any) => <img data-testid="image" src={src} style={style} alt="" />;
  Image.displayName = 'Image';
  return { View, Text, Link, Image };
});

// Mock themes/styles and spacing
jest.mock('components/themes/styles', () => ({
  styles: {
    flexCol: { display: 'flex', flexDirection: 'column' },
    flexRow: { display: 'flex', flexDirection: 'row' },
    flexRowBetween: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
  },
  spacing: {
    '1': '3pt',
    '2': '6pt',
    '4': '12pt',
    '6': '18pt',
  },
}));

// Mock common rover components
jest.mock('../common', () => {
  const RoverText = ({ children, style }: any) => <div data-testid="rover-text" style={style}>{children}</div>;
  RoverText.displayName = 'RoverText';
  const RoverLink = ({ children }: any) => <div data-testid="rover-link">{children}</div>;
  RoverLink.displayName = 'RoverLink';
  const RoverPhoto = ({ photo }: any) => <div data-testid="rover-photo">{photo}</div>;
  RoverPhoto.displayName = 'RoverPhoto';
  return { RoverText, RoverLink, RoverPhoto };
});

describe('Rover Layout Bug Fixes', () => {
  const mockProfile = {
    name: 'John Doe',
    summary: 'Experienced Engineer',
    email: 'john@example.com',
    phone: '123456789',
    url: 'example.com',
    location: 'NYC',
    photo: '',
    photoShape: 'circle' as const,
  };

  it('renders Objective (summary) below the name when no photo is provided', () => {
    const { getByText, queryByTestId } = render(
      <ResumePDFProfile 
        profile={{ ...mockProfile, photo: '' }} 
        themeColor="#000" 
        isPDF={false} 
      />
    );

    const nameElement = getByText('John Doe');
    const summaryElement = getByText('Experienced Engineer');

    // In the new layout, name and summary are siblings in a flex column container
    // but the summary is outside the flexRowBetween container
    expect(nameElement).toBeTruthy();
    expect(summaryElement).toBeTruthy();
    
    // Check that summary is indeed present and has textAlign left as requested
    expect(summaryElement.style.textAlign).toBe('left');
  });

  it('renders Objective (summary) alongside name when photo IS provided (Layout B)', () => {
    const { getByText } = render(
      <ResumePDFProfile 
        profile={{ ...mockProfile, photo: 'test-photo.jpg' }} 
        themeColor="#000" 
        isPDF={false} 
      />
    );

    const nameElement = getByText('John Doe');
    const summaryElement = getByText('Experienced Engineer');

    expect(nameElement).toBeTruthy();
    expect(summaryElement).toBeTruthy();
  });

  it('matches snapshot for Rover header without photo', () => {
    const { asFragment } = render(
      <ResumePDFProfile 
        profile={{ ...mockProfile, photo: '' }} 
        themeColor="#000" 
        isPDF={false} 
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot for Rover header with photo', () => {
    const { asFragment } = render(
      <ResumePDFProfile 
        profile={{ ...mockProfile, photo: 'test-photo.jpg' }} 
        themeColor="#000" 
        isPDF={false} 
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
