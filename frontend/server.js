const { createServer: https } = require('https');
const { createServer: http } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const app = next();
const handle = app.getRequestHandler();

const ports = {
  http: process.env.HTTP_PORT,
  https: process.env.HTTPS_PORT,
};

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CRT),
};

app.prepare().then(() => {
  http((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(ports.http, (err) => {
    if (err) throw err;
    console.log(`> HTTP: Ready on http://localhost:${ports.http}`);
  });

  https(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(ports.https, (err) => {
    if (err) throw err;
    console.log(`> HTTPS: Ready on https://localhost:${ports.https}`);
  });
});
