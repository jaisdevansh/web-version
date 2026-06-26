import fs from 'fs';
import https from 'https';

function getUrls(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getUrls(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(file, 'utf8');
      const urls = content.match(/https:\/\/images\.unsplash\.com\/[^\"\'\`\s]+/g);
      if (urls) {
        urls.forEach(u => results.push({file, url: u}));
      }
    }
  });
  return results;
}

const urls = getUrls('src');
const uniqueUrlsMap = {};
urls.forEach(u => {
  if (!uniqueUrlsMap[u.url]) uniqueUrlsMap[u.url] = [];
  uniqueUrlsMap[u.url].push(u.file);
});

const uniqueUrls = Object.keys(uniqueUrlsMap);
console.log('Found ' + uniqueUrls.length + ' unique Unsplash URLs.');

async function checkUrl(url) {
  return new Promise(resolve => {
    https.get(url, res => {
      resolve({url, status: res.statusCode});
    }).on('error', e => resolve({url, status: e.message}));
  });
}

async function run() {
  for (const url of uniqueUrls) {
    const res = await checkUrl(url);
    if (res.status === 404 || res.status >= 400) {
      console.log('BROKEN:', res.url);
      uniqueUrlsMap[url].forEach(f => console.log('  in file:', f));
    }
  }
  console.log('Done checking images!');
}

run();
