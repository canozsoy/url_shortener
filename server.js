require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended: false}));

// Urls

const urls = [];

// Routes

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req, res) => {
  const incomingUrl = req.body.url;
  const regEx = /^(https|http)(:\/\/)/;
  if (!regEx.test(incomingUrl)) {
    res.json({
      error: "invalid url"
    })
  } else {
    urls.push(incomingUrl);
    const index = urls.indexOf(incomingUrl);
    res.json({
      "original_url": incomingUrl,
      "short_url": index
    })
  }
});

app.get("/api/shorturl/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  const url = urls[shortUrl];
  if (!url) {
    res.status(200).json({
      error: "Url not exist"
    })
  } else {
    res.redirect(url);
  }
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
