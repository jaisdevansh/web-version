import fs from 'fs';
import path from 'path';

const replacements = {
  '1492684223066-81342ee5ff30': '1514525253161-7a46d19cd819',
  '1501281668745-f7f5792203bba': '1516450360452-9312f5e86fc7',
  '1511632765486-a01c80cf8cb4': '1533174072545-7a4b6ad7a6c3',
  '1540039155732-d68f7b7fce8d': '1511192336575-5a79af67a629',
  '1470229722913-7c090be5c560': '1511895426328-dc8714191300',
  '1533174000222-921d7b69cdb9': '1459749411175-04bf5292ceea',
  '1478147424096-70e28f1181f7': '1429962714451-bb934ecdc4ec',
  '1493225457124-a1a2a5f5cb3b': '1470225620780-dba8ba36b745'
};

function processDir(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      processDir(file);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;
      Object.keys(replacements).forEach(badId => {
        const goodId = replacements[badId];
        if (content.includes(badId)) {
          content = content.replace(new RegExp(badId, 'g'), goodId);
          changed = true;
        }
      });
      if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed images in: ' + file);
      }
    }
  });
}

processDir('src');
console.log('All broken images replaced!');
