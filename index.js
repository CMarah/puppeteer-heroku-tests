import puppeteer from 'puppeteer';

const chr_test = (async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  await page.goto('https://developers.google.com/web/');

  // Type into search box.
  await page.type('.devsite-search-field', 'Headless Chrome');

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = '.devsite-suggest-all-results';
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);

  // Wait for the results page to load and display the results.
  const resultsSelector = '.gsc-results .gs-title';
  await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  const links = await page.evaluate(resultsSelector => {
    return [...document.querySelectorAll(resultsSelector)].map(anchor => {
      const title = anchor.textContent.split('|')[0].trim();
      return `${title} - ${anchor.href}`;
    });
  }, resultsSelector);

  // Print all the files.
  console.log(links.join('\n'));

  await browser.close();
  return links.join('\n');
});

import express from 'express';
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const links = await chr_test();
  res.send(links);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
