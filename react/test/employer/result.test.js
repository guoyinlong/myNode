var fetch = require('node-fetch');
var expect = require('chai').expect;

describe('result', function() {

  it('OU查询', function() {
    var arg_tenantid=10010
    var posturl1='http://10.0.209.147/microservice/serviceauth/ps_get_ou'
    return fetch(posturl1+'?arg_tenantid='+arg_tenantid)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json.RetCode).to.be.equal("1");
        expect(json.DataRows[0].OU).to.be.equal('联通软件研究院本部');
        expect(json.DataRows[1].OU).to.be.equal('济南软件研究院');
        expect(json.DataRows[2].OU).to.be.equal('哈尔滨软件研究院');
      });
  });

  it('dept-联通软件研究院本部', function() {
    var arg_ou="联通软件研究院本部"
    var arg_tenantid=10010
    var posturl2='http://10.0.209.147/microservice/project/oudeptquery'
    //if(arg_ou=="联通软件研究院本部"){
      return fetch(posturl2+'?arg_tenantid='+arg_tenantid+'&arg_ou='+encodeURI(encodeURI(arg_ou)))
        .then(function(res) {
          return res.json();
        }).then(function(json) {
          expect(json.RetCode).to.be.equal("1");
          for(var index in json.DataRows){
            expect(json.DataRows[index].deptname).to.include('联通软件研究院');
          }
        });
   // }
  });

  it('dept-济南软件研究院', function() {
    var arg_ou="济南软件研究院"
    var arg_tenantid=10010
    var posturl2='http://10.0.209.147/microservice/project/oudeptquery'
    //if(arg_ou=="联通软件研究院本部"){
    return fetch(posturl2+'?arg_tenantid='+arg_tenantid+'&arg_ou='+encodeURI(encodeURI(arg_ou)))
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json.RetCode).to.be.equal("1");
        for(var index in json.DataRows){
          expect(json.DataRows[index].deptname).to.include('济南软件研究院');
        }
      });
  });

  it('dept-哈尔滨软件研究院', function() {
    var arg_ou="哈尔滨软件研究院"
    var arg_tenantid=10010
    var posturl2='http://10.0.209.147/microservice/project/oudeptquery'
    //if(arg_ou=="联通软件研究院本部"){
    return fetch(posturl2+'?arg_tenantid='+arg_tenantid+'&arg_ou='+encodeURI(encodeURI(arg_ou)))
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json.RetCode).to.be.equal("1");
        for(var index in json.DataRows){
          expect(json.DataRows[index].deptname).to.include('哈尔滨软件研究院');
        }
      });
  });

  it('考核结果', function() {
    var arg_year=new Date().getFullYear().toString()
    var arg_season=Math.floor((new Date().getMonth()+1 + 2) / 3).toString()
    var posturl3='http://10.0.209.147/microservice/examine/ouresultsearch'
    return fetch(posturl3+'?arg_year='+arg_year+'&arg_season='+arg_season)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json.RetCode).to.be.equal("1");
        for(var index in json.DataRows){
          expect(json.DataRows[index]).to.include.keys('rank','staff_id','staff_name','ou','dept_name','post');
        }
      });
  });

});
