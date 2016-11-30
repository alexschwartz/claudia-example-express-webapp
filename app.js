'use strict'
const express = require('express')
const app = express()

var AWS = require('aws-sdk');

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

app.get('/rest/api/health/', (req, res) => {
    res.send('alive and kicking\n')
})

app.get('/rest/api/simple/', (req, res) => {
    var params = { Bucket: 'claudia-hello-world-express-20161130', Key: 'sample.json'}

    new AWS.S3().getObject(params, function(err, json_data) {
      if (!err) {
        var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));
        res.json(json);
      }
      res.send("hello");
    })
})

app.get('/rest/api/sample/', (req, res) => {
   var s3 = new AWS.S3(); 
    var params = { Bucket: 'claudia-hello-world-express', Key: 'sample.json'}

    s3.headObject(params, function (err, data) {
        if (err) {
            // an error occurred
            console.error(err);
            return next();
        }
        var stream = s3.getObject(params).createReadStream();

        // forward errors
        stream.on('error', function error(err) {
            //continue to the next middlewares
            return next();
        });

        //Add the content type to the response (it's not propagated from the S3 SDK)
        res.set('Content-Type', mime.lookup(key));
        res.set('Content-Length', data.ContentLength);
        res.set('Last-Modified', data.LastModified);
        res.set('ETag', data.ETag);

        stream.on('end', () => {
            console.log('Served by Amazon S3: ' + key);
        });
        //Pipe the s3 object to the response
        stream.pipe(res);
    });
})

app.get('/rest/api/hello/', (req, res) => {
    res.sendFile(`${__dirname}/content/hello.json`)
})

// app.listen(3000) // <-- comment this line out from your app

module.exports = app // export your app so aws-serverless-express can use it
