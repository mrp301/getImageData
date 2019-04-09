const fs = require('fs')
const puppeteer = require('puppeteer')
const pageList = require('./pageList.js')

async function getScreenShot (url) {
  const domain = await getDomain(url)
  const savePath = await getSavePath(domain)

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
          width: 1280,
          height: 1000
        });
  await page.screenshot({ path: domain +'/'+ domain +'.png', fullPage: true })
  await browser.close();

  return new Promise((resolve) => {
    resolve("Done!")
  })
}

async function getDomain(url) {
  return url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1]
}

async function getSavePath(domain) {
  if (!fs.existsSync(domain)) {
    fs.mkdirSync(domain);
  }
  return
}


pageList.item.forEach((url, index) => {
  getScreenShot(url).then((result) => {
    console.log(result)
  })
})
