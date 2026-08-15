const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
  const result = await page.evaluate(() => {
    const section = document.querySelector('.glance-grid');
    const cards = [...document.querySelectorAll('.glance-card')];
    const styles = section ? getComputedStyle(section) : null;
    const widths = cards.map((card) => Math.round(card.getBoundingClientRect().width));
    const tops = cards.map((card) => Math.round(card.getBoundingClientRect().top));
    return {
      cardCount: cards.length,
      gridTemplateColumns: styles ? styles.gridTemplateColumns : null,
      gap: styles ? styles.gap : null,
      bodyScrollWidth: document.body.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.body.scrollWidth > window.innerWidth,
      widths,
      tops,
      allCardsStacked: cards.length > 1 ? tops.every((top, idx) => idx === 0 || top > tops[idx - 1]) : true,
      sectionWidth: section ? Math.round(section.getBoundingClientRect().width) : null,
      containerPaddingLeft: document.querySelector('.section .container') ? Math.round(document.querySelector('.section .container').getBoundingClientRect().left) : null
    };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
