
var fetch = require('node-fetch');

var expect = require('chai').expect;

describe('insertOrder测试', function() {

  it('插入一条记录', function() {

    return fetch('http://10.0.209.147/microservice/transupdate/meet/timeoccupyUpdate?transjsonarray=%5B%7B%22update%22:+%7B%22t2%22:%221%22%7D,%22condition%22:%7B%22room_name%22:%22T007%22,%22day%22:%222017-08-07+%22%7D%7D%5D')

      .then(function(res) {
        // console.log(res);
        // expect(res).to.be.equal(mm);
        return res.json();

      }).then(function(json) {
        // console.log(json);
        expect(json.RetCode).to.be.equal('1');

      });

  });

});
