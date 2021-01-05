var fetch = require('node-fetch');
var expect = require('chai').expect;
describe('moduleOpen', function() {

  it('初始状态', function() {
    var transjsonarray='%7B"condition":%7B"tag":"0"%7D%7D'
    var posturl3='http://10.0.209.147/microservice/standardquery/examine/t_module_period_sel'
    return fetch(posturl3+'?transjsonarray='+transjsonarray)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json.RetCode).to.be.equal("1");
        for(var index in json.DataRows){
          expect(json.DataRows[index]).to.include.keys('begin_time','stage_name','end_time','stage_code','id','tag');
        }
      });
  });

  it('修改考核阶段', function() {
    var transjsonarray='%5B%7B"update":%7B"begin_time":"2017-04-18+09:30:00","end_time":"2017-06-09+23:00:00"%7D,"condition":%7B"id":"1"%7D%7D%5D'
    var posturl3='http://10.0.209.147/microservice/transupdate/examine/t_module_period_add'
    return fetch(posturl3+'?transjsonarray='+transjsonarray)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json.RetCode).to.be.equal("1");
        for(var index in json.DataRows){
          expect(json.DataRows[index]).to.include.keys('transsql','transrowsnum');
        }
      });
  });

});
