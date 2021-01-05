
var fetch = require('node-fetch');

var expect = require('chai').expect;

var kk = '{"RetVal":"1","RetCode":"1","AuditRetVal":"1","AuditRetCode":"1","DataRows":[{"room_id":"0","room_name":"T007","seatCapacity":"6","type_id":"0"},{"room_id":"1","room_name":"T008","seatCapacity":"6","type_id":"0"},{"room_id":"2","room_name":"T009","seatCapacity":"6","type_id":"0"},{"room_id":"3","room_name":"A201","seatCapacity":"8","type_id":"0"},{"room_id":"4","room_name":"A202","seatCapacity":"8","type_id":"0"},{"room_id":"5","room_name":"A302","seatCapacity":"8","type_id":"0"},{"room_id":"6","room_name":"A401","seatCapacity":"8","type_id":"0"},{"room_id":"7","room_name":"A402","seatCapacity":"8","type_id":"0"},{"room_id":"8","room_name":"B201","seatCapacity":"8","type_id":"0"},{"room_id":"9","room_name":"B202","seatCapacity":"8","type_id":"0"},{"room_id":"10","room_name":"B401","seatCapacity":"8","type_id":"0"},{"room_id":"11","room_name":"B402","seatCapacity":"8","type_id":"0"}]}'

describe('searchoccupy测试', function() {

  it('2017-06-01的预定情况', function() {

    return fetch('http://10.0.209.147/microservice/meet/searchoccupy?arg_typeid=0&&arg_weekday=2017-06-01')

      .then(function(res) {
        // console.log(res);
        // expect(res).to.be.equal(mm);
        return res.json();

      }).then(function(json) {

        // expect(JSON.stringify(json)).to.be.equal(kk);
        expect(json.RetCode).to.be.equal('1');

      });

  });

});
