const express = require('express');
const proxy = require('express-http-proxy');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const config = require('./config');
const url = require('url');
const app = express();
const router = express.Router();

app.use(morgan('combined'));

app.use(
  '/graphql',
  proxy(config.graphql, {
    proxyReqPathResolver: () => '/graphql'
  })
);
app.use(
  '/iam',
  proxy(config.iam, {
    proxyReqPathResolver: req =>
      '/iam' + (url.parse(req.url).path === '/' ? '' : url.parse(req.url).path)
  })
);

app.use(express.static('./dist'));

app.get('*', (req, res) => {
  try {
    const html = fs.readFileSync(path.resolve('./dist/index.html'));
    res.set('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (err) {
    console.error(err.message);
    res.status = 500;
    res.body = {
      error: 'Error while transcribing data'
    };
  }
});

app.get('/status', (req, res) => {
  res.status(200).send('OK');
});

app.listen(8081, () =>
  console.log(`Management console server listening on port 8081`)
);
