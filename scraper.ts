import * as puppeteer from 'puppeteer';

async function getComputedStyle(page: puppeteer.Page, selector: string, properties: string[]) {
  return await page.$$eval(selector, (elements: Element[], props: string[]) => {
    if (elements.length === 0) return null;
    const computedStyle = window.getComputedStyle(elements[0]);
    const style: { [key: string]: string } = {};
    props.forEach((prop: string) => {
      style[prop] = computedStyle.getPropertyValue(prop);
    });
    return style;
  }, properties);
}

async function scrapeShopifyProduct(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle0' });

    const fonts = await page.evaluate(() => {
      const fontDetails: any[] | null = [];

      Array.from(document.styleSheets).forEach(sheet => {
        try {
          if (sheet.href?.includes("fonts.googleapis.com")) { 
            Array.from((sheet as CSSStyleSheet).cssRules).forEach(rule => {
              const fontFace = (rule as CSSFontFaceRule).style;
              fontDetails.push({
                family: fontFace.getPropertyValue("font-family").replace(/["']/g, ""),
                variants: fontFace.getPropertyValue("font-weight"),
                letterSpacings: fontFace.getPropertyValue("letter-spacing") || "normal",
                fontWeight: fontFace.getPropertyValue("font-weight"),
                url: (sheet as CSSStyleSheet).href || ""
              });
            });
          }
        } catch (error) {
          console.warn('Cannot access cssRules of a stylesheet:', sheet.href, error);
        }
      });

      if (fontDetails.length === 0) {
        const bodyFont = window.getComputedStyle(document.body).getPropertyValue("font-family");
        return bodyFont ? [{ family: bodyFont, variants: "normal", letterSpacings: "normal", fontWeight: "400", url: "local" }] : null;
      }

      return fontDetails;
    });

    const buttonStyles = await getComputedStyle(page, 'form[action*="/cart/add"] button', [
      "font-family",
      "font-size",
      "line-height",
      "letter-spacing",
      "text-transform",
      "text-decoration",
      "text-align",
      "background-color",
      "color",
      "border-color",
      "border-width",
      "border-radius"
    ]);

    const result = {
      fonts,
      primaryButton: buttonStyles
    };

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error while scraping:", error);
  } finally {
    await browser.close();
  }
}

const urls = [
  "https://growgrows.com/en-us/products/plentiful-planets-sleepsuit",
  "https://devonandlang.com/products/journey-boxer-brief-puglie",
  "https://www.allbirds.com/products/mens-wool-runners",
  "https://www.gymshark.com/products/gymshark-mens-apex-seamless-leggings-black",
  "https://www.beardbrand.com/products/utility-balm-tree-ranger",
  "https://www.mvmt.com/products/mens-classic-40mm-gunmetal-sandstone",
  "https://www.blenderbottle.com/products/classic-shaker-bottle-28oz",
  "https://mejuri.com/shop/products/small-hoops-gold",
  "https://knix.com/collections/everyday-bras/products/evolution-bra"
];

(async () => {
  for (const url of urls) {
    await scrapeShopifyProduct(url);
  }
})();
