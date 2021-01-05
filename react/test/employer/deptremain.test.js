var fetch = require('node-fetch');
var expect = require('chai').expect;
describe('deptremain', function() {

  it('部门余数查询', function() {
    var transjsonarray='%7B%22condition%22:%7B%22tag%22:%220%22,%22year%22:%222017%22,%22season%22:%223%22%7D,%22sequence%22:%5B%7B%22year%22:%221%22%7D,%7B%22season%22:%221%22%7D,%7B%22dept_name%22:%221%22%7D%5D%7D'
    var posturl3='http://10.0.209.147/microservice/standardquery/examine/distremainquery'
    return fetch(posturl3+'?transjsonarray='+transjsonarray)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json.RetCode).to.be.equal("1");
        for(var index in json.DataRows){
          expect(json.DataRows[index]).to.include.keys('a_remainder','b_remainder','dept_name','c_remainder','d_remainder','year','season','type');
        }
      });
  });

});
