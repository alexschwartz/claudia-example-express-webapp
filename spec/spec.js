var request = require('supertest');
describe('Hello world Ajax express node.js app', function () {
  var server;
  beforeEach(function () {
    server = require('../app');
  });
  afterEach(function () {
//    server.close();
  });

  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
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

    it('responds to /simple', function testPath(done) {
      request(server)
        .get('/rest/api/simple')
        .expect(200, done);
    //    .expect("Content-type",/json/);
    });

  });


});
