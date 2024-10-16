# Shopify Product Page Scraper API

This project is a web scraper built using TypeScript and Puppeteer. It scrapes Shopify product pages to extract font styles and button styles from each page.

## Features
- Extracts external fonts from `<link>` tags (e.g., Google Fonts).
- Extracts button styles such as font size, color, background color, border radius, etc.
- Loops through multiple Shopify product URLs and collects the required information.

## Prerequisites
Before you can run this project, make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [npm](https://www.npmjs.com/)

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/shopify-scraper-api.git
    cd shopify-scraper-api
    ```

2. **Install dependencies**:
    Install the required Node.js packages:
    ```bash
    npm install
    ```

3. **Create TypeScript configuration** (if `tsconfig.json` doesn’t exist):
    ```bash
    npx tsc --init
    ```

4. **Make sure `tsconfig.json` includes the following options**:
    ```json
    {
      "compilerOptions": {
        "target": "ES2015",
        "module": "commonjs",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "skipLibCheck": true,
        "strict": true,
        "outDir": "./dist"
      },
      "include": ["./scraper.ts"],
      "exclude": ["node_modules"]
    }
    ```

5. **Compile TypeScript to JavaScript**:
    ```bash
    npx tsc scraper.ts
    ```

6. **Run the scraper**:
    The scraper will loop through a predefined set of Shopify product URLs and print the extracted font and button styles to the console.
    ```bash
    node scraper.js
    ```
7. **To recompile and run again**:
    ```bash
    npx tsc
    node scraper.js
    ```

## Example Output

The scraper will output the extracted font and button styles in JSON format, such as:

```json
{
  "fonts": [
    {
      "url": "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
    }
  ],
  "primaryButton": {
    "font-family": "Roboto, sans-serif",
    "font-size": "16px",
    "line-height": "1.5",
    "letter-spacing": "0.01em",
    "text-transform": "uppercase",
    "text-decoration": "none",
    "text-align": "center",
    "background-color": "#000",
    "color": "#fff",
    "border-color": "#000",
    "border-width": "1px",
    "border-radius": "4px"
  }
}
```

# Notes
## Shopify URLs

The scraper uses a list of Shopify product URLs, which you can update in the scraper.ts file by modifying the urls array.
Difficulties Faced

While working on this scraper, one significant issue encountered was the cross-origin restrictions when trying to access the cssRules property of external stylesheets (e.g., Google Fonts). When trying to access these styles, the browser throws a SecurityError due to cross-origin policies.

## To overcome this:

    1. Handling Cross-Origin Restrictions:
        We used a try-catch block to safely access cssRules. If the stylesheet is external and throws a SecurityError, the scraper skips that stylesheet and continues processing others.
        This prevents the scraper from crashing while still capturing as much font information as possible from accessible stylesheets.

    2. Fallback for Local Fonts:
        When no external fonts are found, or when access to external stylesheets is blocked, the scraper falls back to extracting the font-family from the page's body element or other inline styles.
        This ensures that even if no external fonts are used, we can still extract relevant font information (e.g., local or theme-specific fonts).

    3. TypeScript Handling:
        TypeScript type assertions were used to handle type issues, particularly when dealing with link elements for fonts. Type assertions ensure that TypeScript recognizes elements like <link> tags as HTMLLinkElement objects, enabling access to properties such as href.