var AWS = require('aws-sdk'); 

var s3 = new AWS.S3(); 

 s3.createBucket({Bucket: 'myBucket345345'}, function() {

  var params = { Bucket: 'myBucket345345', Key: 'example.txt', Body: 'Hello!'};

  s3.putObject(params, function(err, data) {

      if (err)       

          console.log(err)     

      else console.log("Successfully uploaded data to myBucket/myKey");   

   });

});
