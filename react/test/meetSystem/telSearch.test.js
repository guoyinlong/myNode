
var fetch = require('node-fetch');

var expect = require('chai').expect;

describe('telSearch测试', function() {

  it('0864957的电话号码', function() {

    return fetch('http://10.0.209.147/microservice/standardquery/meet/telSearch?transjsonarray=%7B%22property%22:+%7B%22tel%22:%22stufftel%22%7D,%22condition%22:%7B%22stuff_id%22:%220864957%22%7D%7D')

      .then(function(res) {
        // console.log(res);
        // expect(res).to.be.equal(mm);
        return res.json();

      }).then(function(json) {
        // console.log(json);
        var tel = json.DataRows[0].stufftel;
        // console.log(tel);
        expect(tel).to.be.equal('18500296340');

      });

  });

});
