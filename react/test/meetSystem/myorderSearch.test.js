
var fetch = require('node-fetch');

var expect = require('chai').expect;

describe('我的预定', function() {

  it('我的一条预定', function() {

    return fetch('http://10.0.209.147/microservice/standardquery/meet/myorderSearch?transjsonarray=%7B%22property%22:+%7B%22meet_id%22:%22meetid%22,%22type_id%22:%22typeid%22,%22stuff_name%22:%22stuffname%22,%22stuff_tel%22:%22stufftel%22,%22num_people%22:%22numpeople%22,%22type%22:%22type%22,%22s_time%22:%22starttime%22,%22e_time%22:%22endtime%22,%22week_day%22:%22weekday%22,%22room_name%22:%22roomname%22,%22cancel_reason%22:%22cancelreason%22,%22conference_title%22:%22conferencetitle%22,%22order_state%22:%22orderstate%22%7D,%22condition%22:%7B%22stuff_id%22:%220864957%22%7D,%22sequence%22:%5B%7B%22s_time%22:%221%22%7D%5D%7D')

      .then(function(res) {
        // console.log(res);
        // expect(res).to.be.equal(mm);
        return res.json();

      }).then(function(json) {
        // console.log(json);
        var onerecordname = json.DataRows[0].stuffname;
        expect(onerecordname).to.be.equal('卢美娟');

      });

  });

});
