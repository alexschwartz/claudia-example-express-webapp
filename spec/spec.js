var request = require('supertest');

describe('Hello world Ajax express node.js app', function () {
  var server;
  beforeEach(function () {
    server = require('../app');
  });


  it('responds to /', function testSlash(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('responds to /assets/js/sample.js', function testSlash(done) {
    request(server)
      .get('/assets/js/sample.js')
      .expect(200, done);
  });

  it('responds to /assets/css/sample.css', function testSlash(done) {
    request(server)
      .get('/assets/css/sample.css')
      .expect(200, done);
  });

 it('responds to /assets/css/sample2.css', function testSlash(done) {
    request(server)
      .get('/assets/css/sample2.css')
      .expect(200, done);
  });

  it('responds with 404 for everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });

  describe('REST API /rest/api', function () {
    it('responds to /health', function testPath(done) {
      request(server)
        .get('/rest/api/health')
        .expect(200, done)
        .expect('alive and kicking\n');
    });


    describe('REST API /rest/api/s3', function () {

      it('repsons to /rest/api/s3/buckets and serves the list of buckets', function testPath(done) {
        request(server)
          .get('/rest/api/s3/buckets')
          .expect(200, done)
      });

      xit('repsons to /rest/api/s3/buckets/aleschwa-sandbox and serves the list of S3 files', function testPath(done) {
        request(server)
          .get('/rest/api/s3/buckets/aleschwa-sandbox')
          .expect(200, done)
          .expect("nice content");
      });
  
      xit('repsons to /rest/api/s3/buckets/claudia-hello-world-express-20161130/files/sample-folder1/subfolder34/hello.json and serves the file from S3', function testPath(done) {
        request(server)
          .get('/rest/api/s3/buckets/claudia-hello-world-express-20161130/files/sample-folder1/subfolder34/hello.json')
          .expect(200, done)
          .expect("Content-type",/json/);
      });

      xit('repsons to /rest/api/s3/buckets/claudia-hello-world-express-20161130/files/sample.json and serves the file from S3', function testPath(done) {
        request(server)
          .get('/rest/api/s3/buckets/claudia-hello-world-express-20161130/files/sample.json')
          .expect(200, done)
          .expect("Content-type",/json/);
      });
    });
  });


});
