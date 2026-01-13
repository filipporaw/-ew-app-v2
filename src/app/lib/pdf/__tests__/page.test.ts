import {
  getPageMarginStyle,
  getPagePadding,
  normalizeDocumentSize,
} from "lib/pdf/page-margins";

describe("pdf page helpers", () => {
  it("normalizes supported document sizes", () => {
    expect(normalizeDocumentSize("A4")).toBe("A4");
    expect(normalizeDocumentSize("letter")).toBe("LETTER");
    expect(normalizeDocumentSize("LETTER")).toBe("LETTER");
    // defaults to LETTER when undefined or unexpected input
    expect(normalizeDocumentSize(undefined as unknown as string)).toBe("LETTER");
    expect(normalizeDocumentSize("foo")).toBe("LETTER");
  });

  it("returns 2cm padding for A4 pages", () => {
    const padding = getPagePadding("A4");
    expect(padding).toBeCloseTo(56.69, 2);

    const style = getPageMarginStyle("A4");
    expect(style).toMatchObject({
      paddingTop: `${padding}pt`,
      paddingRight: `${padding}pt`,
      paddingBottom: `${padding}pt`,
      paddingLeft: `${padding}pt`,
    });
  });

  it("returns 0.75in padding for US Letter pages", () => {
    const padding = getPagePadding("LETTER");
    expect(padding).toBeCloseTo(54, 2);
    expect(getPagePadding("Letter")).toBeCloseTo(54, 2);
    expect(getPagePadding("letter")).toBeCloseTo(54, 2);

    const style = getPageMarginStyle("Letter");
    expect(style.paddingLeft).toBe(`${padding}pt`);
    expect(style.paddingTop).toBe(`${padding}pt`);
  });
});
