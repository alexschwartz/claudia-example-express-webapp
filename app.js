'use strict'
const express = require('express')
const app = express()

var AWS = require('aws-sdk');

// GET CSS, js, etc under /assets
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

var aws = require('knox').createClient({
  key: 'image',
  secret: 'my-secret',
  bucket: 'claudia-hello-world-express-20161130'
})

app.get('/image/:id', function (req, res, next) {

  aws.get('/image/' + req.params.id)
  .on('error', next)
  .on('response', function (resp) {
    if (resp.statusCode !== 200) {
      var err = new Error()
      err.status = 404
      next(err)
      return
    }

    res.setHeader('Content-Length', resp.headers['content-length'])
    res.setHeader('Content-Type', resp.headers['content-type'])

    if (req.fresh) {
      res.statusCode = 304
      res.end()
      return
    }

    if (req.method === 'HEAD') {
      res.statusCode = 200
      res.end()
      return
    }

    resp.pipe(res)
  })
})

app.get('/rest/api/health/', (req, res) => {
    res.send('alive and kicking\n')
})

function serveObjectFromS3(params, res) {
    console.log("Serving file '" + params.Key + "' from S3 bucket '" + params.Bucket + "'");
    new AWS.S3().getObject(params, function(err, json_data) {
      if (!err) {
        var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
        res.json(json);
      } else {
        res.status(503).send("problem retrieving object from S3 - " + err);
      }
    })
}

app.get('/rest/api/s3/:bucket', (req, res) => {
    res.send("should serve list of entries in the bucket '" + req.bucket + "' from S3");
})

app.get('/rest/api/s3/:bucket/:filename', (req, res) => {
    serveObjectFromS3({Bucket: req.params.bucket, Key: req.params.filename}, res);
})

app.listen(3000) // <-- comment this line out from your app

module.exports = app // export your app so aws-serverless-express can use it
