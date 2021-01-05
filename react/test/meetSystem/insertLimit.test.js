
var fetch = require('node-fetch');

var expect = require('chai').expect;

describe('insertLimit测试', function() {

  it('限制0821856吴盛预定会议室', function() {

    return fetch('http://10.0.209.147/microservice/transinsert/meet/insertLimit?transjsonarray=%5B%7B%22stuff_id%22:%220821856%22,+%22stuff_name%22:%22%E5%90%B4%E7%9B%9B%22,%22limit_stime%22:%222017-08-07%22,%22limit_etime%22:%222017-08-17%22+,%22limit_state%22:%220%22%7D%5D')

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
