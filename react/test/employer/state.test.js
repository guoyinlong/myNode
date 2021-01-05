var fetch = require('node-fetch');
var expect = require('chai').expect;
describe('state', function() {

  it('指标填报', function() {
    var arg_year=new Date().getFullYear().toString()
    var arg_season=Math.floor((new Date().getMonth()+1 + 2) / 3).toString()
    var arg_ou="联通软件研究院本部"
    var arg_tenantid=10010
    var posturl3='http://10.0.209.147/microservice/examine/ex_Personal_assessment'
    return fetch(posturl3+'?arg_ou='+encodeURI(encodeURI(arg_ou))+'&arg_year='+arg_year+'&arg_season='+arg_season+'&arg_tenantid'+arg_tenantid)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json.RetCode).to.be.equal("1");
        for(var index in json.DataRows){
          expect(json.DataRows[index]).to.include.keys('deptname','Audited','Pending_audit','allmun','noFill','numdept');
        }
      });
  });

  it('指标评价', function() {
    var arg_year=new Date().getFullYear().toString()
    var arg_season=Math.floor((new Date().getMonth()+1 + 2) / 3).toString()
    var arg_ou="联通软件研究院本部"
    var arg_tenantid=10010
    var posturl3='http://10.0.209.147/microservice/examine/ex_Personal_assessment_all'
    return fetch(posturl3+'?arg_ou='+encodeURI(encodeURI(arg_ou))+'&arg_year='+arg_year+'&arg_season='+arg_season+'&arg_tenantid'+arg_tenantid)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json.RetCode).to.be.equal("1");
        for(var index in json.DataRows){
          expect(json.DataRows[index]).to.include.keys('deptname','allnum','assessment_completed','evaluation_completion','finishperson','pending_evaluation');
          //expect('foobar').to.match(/^foo/);
        }
      });
  });

});
