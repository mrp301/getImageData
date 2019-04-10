const fs = require('fs')
const puppeteer = require('puppeteer')
const pageList = require('./pageList.js')

async function getScreenShot (url,index) {
  const fileData = await getDomain(url)
  await getSavePath(fileData.path)

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try{
    await page.goto(url);
  } catch(e) {
    await throwError('url読み込みエラー', e)
    await browser.close();
    return new Promise((reject) => {
      reject('Error!')
    })
  }

  await page.setViewport({
          width: 1280,
          height: 1000
        });
  try {
    await page.screenshot({ path: fileData.path + fileData.name + '.png', fullPage: true })
  } catch(e) {
    await browser.close();
    await throwError('ファイル書き出しエラー', e)
    return new Promise((reject) => {
      reject('Error!')
    })
  }

  await browser.close();

  return new Promise((resolve) => {
    console.log(index)
    resolve('Done!')
  })
}

async function throwError(message, e) {
  console.log(message)
  console.log(e)
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
    path : 'data/' + filePath
  }
  return fileData
}

async function getSavePath(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}


pageList.item.forEach((url, index) => {
  getScreenShot(url,index).then((result) => {
    console.log(result +':'+ url)
  }).catch((e)=> {
    console.log('Error!:'+ e)
    process.exit(1);
  })
})
