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

    it('responds to /hello', function testPath(done) {
      request(server)
        .get('/rest/api/hello')
        .expect(200, done);
    });

    describe('REST API /rest/api/s3', function () {
      it('repsons to /rest/api/s3/mybucket and serves the list of S3 files', function testPath(done) {
        request(server)
          .get('/rest/api/s3/mybucket')
          .expect(200, done)
      });
  
      it('repsons to /rest/api/s3/claudia-hello-world-express/sample.json and serves the file from S3', function testPath(done) {
        request(server)
          .get('/rest/api/s3/claudia-hello-world-express/sample.json')
          .expect(200, done)
          .expect("Content-type",/json/);
      });
    });
  });


});
