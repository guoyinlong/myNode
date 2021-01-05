
var fetch = require('node-fetch');

var expect = require('chai').expect;

describe('limitSearch测试', function() {

  it('0864957的限制情况', function() {

    return fetch('http://10.0.209.147/microservice/meet/limitSearch?arg_stuffid=0864957')

      .then(function(res) {
        // console.log(res);
        // expect(res).to.be.equal(mm);
        return res.json();

      }).then(function(json) {
        expect(json.totalsum).to.be.not.equal('1');
        // expect(JSON.stringify(json)).to.be.equal(nn);

      });

  });

});
