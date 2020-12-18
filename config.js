const path = require('path');

const MODE = {
  production: 'production',
  development: 'development',
};

const PROJECT = 'dynamic-busan';
const Type = 'pages';
const DIRECTORY = 'Library';

const HTML_FILE_FROM = 'index.html';
const HTML_FILE_TO = `${DIRECTORY.toLowerCase()}.html`;
const JS_FILE_FROM = 'script.js';
const JS_FILE_TO = `${DIRECTORY.toLowerCase()}.js`;
const CSS_FILE_TO = `${DIRECTORY.toLowerCase()}.css`;

const BUILD_DIR = `${__dirname}/build`;
const STATIC_DIR = 'public';

module.exports.mode = MODE[process.env.NODE_ENV || 'development'];
module.exports.isProduction = this.mode === MODE.production;

module.exports.projectPath = path.resolve(
  __dirname,
  'project',
  PROJECT,
  Type,
  DIRECTORY,
);

module.exports.buildPath = BUILD_DIR;

module.exports.htmlOriginName = HTML_FILE_FROM;
module.exports.jsOriginName = JS_FILE_FROM;

module.exports.htmlPath = path.resolve(this.projectPath, HTML_FILE_FROM);
module.exports.jsPath = path.resolve(this.projectPath, JS_FILE_FROM);
module.exports.staticPath = path.resolve(this.projectPath, STATIC_DIR);

module.exports.htmlName = HTML_FILE_TO;
module.exports.cssName = CSS_FILE_TO;
module.exports.jsName = JS_FILE_TO;
