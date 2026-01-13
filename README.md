# Resume Builder

## Bug Fixes

### 1. Export Theme Consistency
**Issue:** The exported PDF always used the "Minimal" (or default) theme regardless of the user's selection in the UI.
**Fix:** Updated `ResumeControlBar.tsx` to explicitly call the `update()` function from the `usePDF` hook whenever the `document` prop changes. This ensures that the PDF blob is regenerated with the latest theme settings before download.

### 2. Rover Theme Header Layout
**Issue:** When no profile picture was provided in the Rover theme, the Professional Summary (Objective) appeared on the same line as the name.
**Fix:** Modified `ResumePDFProfile.tsx` for the Rover theme to use a vertical flex layout when no photo is present. The name and contacts are kept in a top row, while the summary is explicitly placed on a new line below them, left-aligned with a top margin.

### 3. Automated Tests
**Verification:** Added Jest unit tests using React Testing Library to verify:
- `ResumePDF` correctly switches themes based on settings.
- Rover theme correctly stacks the summary below the name when no photo is provided.
- Snapshots for Rover theme header in both "with photo" and "no photo" states.
