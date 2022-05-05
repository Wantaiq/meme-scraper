import fs from 'node:fs/promises';
import got from 'got';

const targetUrl = 'https://memegen-link-examples-upleveled.netlify.app/';
async function fetchUrls() {
  try {
    const response = await got({
      url: targetUrl,
    });
    const images = response.body
      .replace(/\s/g, '')
      .match(/<img[^>]*src="[^"]*"[^>]*>/gm)
      .map((item) => item.replace(/.*src="([^"]*)".*/, '$1'))
      .slice(0, 10);
    console.log(images);
    return images;
  } catch {
    console.log("We couldn't get your images");
  }
}

async function makeDir() {
  try {
    await fs.mkdir('./memes');

    console.log('We created your directory');
  } catch {
    console.log('You already have directory');
  }
}

makeDir();
fetchUrls();
