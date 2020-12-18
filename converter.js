/* eslint-disable no-console */
const fs = require('fs');
const config = require('./config');

const DEV_CC = {
  '\\[\\[': '[ [', // For Springboot
  '\\]\\]': '] ]', // For Springboot
  '%EMAIL_CERT_SUFFIX%': '', // For Certification Email Suffix
  '%EMAIL_CERT_SUFFIX_KISA%': '@kisa.or.kr', // For Certification KISA Email Suffix
};

const PROD_CC = {
  '\\[\\[': '[ [', // For Springboot
  '\\]\\]': '] ]', // For Springboot
  // 'https://bstatic.mykeepin.com': 'https://static.metadium.biz', // For KISA Static Web Server Link
  'https://bstatic.mykeepin.com': 'https://static.blockchainbusan.kr', // For Static Web Server Link
  'https://svc.mykeepin.com': 'https://svc.blockchainbusan.kr', // For Notice List Api Server Link
  '%EMAIL_CERT_SUFFIX%': '@btp.or.kr', // For Certification Email Suffix
  '%EMAIL_CERT_SUFFIX_KISA%': '@kisa.or.kr', // For Certification KISA Email Suffix
};

function readFile(path, file) {
  return fs.readFileSync(`${path}/${file}`, 'utf8').trim();
}

function editFile(content, cc) {
  return Object.entries(cc).reduce((prev, [from, to]) => {
    console.log(`${from} => ${to}`);
    return prev.replace(RegExp(from, 'g'), to);
  }, content);
}

function writeFile(path, file, content) {
  console.log(`[${file}] => ${path}/${file}`);
  if (!fs.existsSync(path)) fs.mkdirSync(path);
  fs.writeFileSync(`${path}/${file}`, content, { flag: 'w' });
}

function main() {
  const content = readFile(config.buildPath, config.htmlName);

  console.log(`[${config.htmlName}] Start Dev Converting...`);
  const devContent = editFile(content, DEV_CC);
  const devPath = `${config.buildPath}/dev`;
  writeFile(devPath, config.htmlName, devContent);

  console.log(`\n[${config.htmlName}] Start Prod Converting...`);
  const prodContent = editFile(content, PROD_CC);
  const prodPath = `${config.buildPath}/prod`;
  writeFile(prodPath, config.htmlName, prodContent);
}

main();
