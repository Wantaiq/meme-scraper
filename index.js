import * as fs from 'node:fs';
import * as fsAsync from 'node:fs/promises';
import https from 'node:https';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

function fetchImages(urls) {
  try {
    for (let i = 0; i < 10; i++) {
      https.get(urls[i], (response) => {
        const filePath =
          i === 9 ? `./memes/${i + 1}.jpg` : `./memes/0${i + 1}.jpg`;
        const writeStream = fs.createWriteStream(filePath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
        });
      });
    }
    console.log('You can find your dank memes inside of a meme folder!');
  } catch (err) {
    console.log(`We couldn't get your images.`);
  }
}

async function fetchUrls() {
  const url = 'https://memegen-link-examples-upleveled.netlify.app/';
  try {
    const res = await fetch(url);
    const data = await res.text();

    const parsedHtml = cheerio.load(data, null, false);
    const imgData = parsedHtml('a');
    const imgSrc = Object.values(imgData)
      .map((item) => item.attribs)
      .slice(6, 16)
      .map((el) => el.href);

    const imageUrl = imgSrc.map((item) => item.slice(30));
    return imageUrl;
  } catch (err) {
    console.log(err);
  }
}
async function makeDir() {
  try {
    await fsAsync.mkdir('./memes');
    console.log('We created your directory');
  } catch {
    console.log('You already have directory');
  }
}
fetchUrls()
  .then(makeDir())
  .then((imgUrls) => fetchImages(imgUrls))
  .catch(console.log(''));
