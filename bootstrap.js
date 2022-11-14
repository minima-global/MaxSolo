const axios = require('axios');
const fs = require('fs');
const https = require('https');
const jsdom = require('jsdom');
const path = require('path');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

let appName = '';
const port = 9005;
const mdsPort = port - 2;

let tries = 0;
let command = '';
let appUid = '';
let mdsPassword = '';
const dirname = __dirname;
const baseUrl = `http://localhost:${port}`;

function getAppName() {
  const app = fs.readFileSync(__dirname + '/public/dapp.conf', 'utf-8');
  return JSON.parse(app).name;
}

async function checkMinimaHasLoaded(){
  const balance = await axios.get(`${baseUrl}/balance`);
  const minimaHasLoaded = balance.data.response.find(token => token.tokenid === '0x00' && token.unconfirmed === '0');
  return minimaHasLoaded;
}

async function getMdsPassword(){
  const mds = await axios.get(`${baseUrl}/mds`);
  return mds.data.response.password;
}

async function checkIfAppIsInstalled(){
  const mds = await axios.get(`${baseUrl}/mds`);
  return mds.data.response.minidapps.find(app => app.conf.name === appName);
}

async function removePreviousApps(){
  const mds = await axios.get(`${baseUrl}/mds`);
  const apps = mds.data.response.minidapps.filter(app => app.conf.name === appName);
  for (app of apps) {
    await axios.get(`${baseUrl}/mds action:uninstall uid:${app.uid}`);
  }
}

async function getAppUid(){
  const app = await checkIfAppIsInstalled();
  return app ? app.uid : null;
}

async function getMiniDAppPageUrl(password, uid) {
  return axios({
    url: `https://127.0.0.1:${mdsPort}/login.html`,
    method: 'post',
    data: `password=${password}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    httpsAgent,
  }).then(function (response) {
    let sessionId = '';
    let href = '';
    const document = new jsdom.JSDOM(response.data);
    const anchors = document.window.document.querySelectorAll('a');
    anchors.forEach(function(anchor) {
      if (anchor.href.includes(uid)) {
        href = anchor.href;
        sessionId = anchor.href.match(/(?<==).*/)[0];
      }
    });
    return {
      href,
      sessionId,
    };
  });
}

async function rpc(command) {
  return axios({
    method: 'GET',
    url: `${baseUrl}/${command}`,
  }).then((response) => {
    console.log(response.data);
  });
}

const check = () => {
  checkMinimaHasLoaded().then(function (hasLoaded) {
    if (hasLoaded) {
      console.log('Minima has loaded');
      bootstrap();
    } else {
      console.log('Minima is still loading...');
    }
  });
};

const checker = setInterval(() => {
  if (tries > 10) {
    clearInterval(checker);
    console.log('Minima checks has timed out');
    process.exit(1);
  }

  tries = tries + 1;
  check();
}, 10000);

const getMostRecentFile = (dir) => {
  const files = orderRecentFiles(dir);
  return files.length ? files[0] : undefined;
};

const orderRecentFiles = (dir) => {
  return fs.readdirSync(dir)
    .filter((file) => file !== '.DS_Store')
    .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
    .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};

const bootstrap = async () => {
  appName = getAppName();
  const isAppInstalled = false;
  const { file } = getMostRecentFile(__dirname + '/minidapp');

  if (!process.env.CI) {
    await removePreviousApps();
  }

  if (!isAppInstalled) {
    if (process.env.CI) {
      command = `mds action:install file:/workspace/minidapp/${file} trust:write`;
    } else {
      command = `mds action:install file:${dirname}/minidapp/${file} trust:write`;
    }

    await rpc(command);
  }

  appUid = await getAppUid();
  mdsPassword = await getMdsPassword();
  const app = await getMiniDAppPageUrl(mdsPassword, appUid);

  const session = {
    RPC_URL: `http://localhost:${port}`,
    APP_PAGE_URL: app.href.replace('./', `https://localhost:${mdsPort}/`),
  };

  fs.writeFileSync('./session.json', JSON.stringify(session, null, 2));

  process.exit();
};

check();
