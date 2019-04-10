const fs = require('fs')
const puppeteer = require('puppeteer')
const pageList = require('./pageList.js')

async function getScreenShot (url) {
  const fileData = await getDomain(url)
  await getSavePath(fileData.path)
  console.log(fileData)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
          width: 1280,
          height: 1000
        });
  await page.screenshot({ path: fileData.path + fileData.name + '.png', fullPage: true })
  await browser.close();
  console.log(fileData)

  return new Promise((resolve) => {
    resolve('Done!')
  })
}

async function getDomain(url) {
  //return url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1]
  const data = url.split('/')
  const fileName = data.slice(-2)[0]
  data.shift()
  data.shift()
  data.pop()
  data.pop()
  const filePath = data.reduce((a, b) => a + b +'/', '')
  const fileData = {
    name :  fileName,
    path : filePath
  }
  return fileData
}

async function getSavePath(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  return
}


pageList.item.forEach((url, index) => {
  getScreenShot(url).then((result) => {
    console.log(result +':'+ url)
  }).catch((e)=> {
    console.log('Error!:'+ e)
  })
})
