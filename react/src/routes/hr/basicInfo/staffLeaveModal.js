/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-07
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工离职对话框
 */
import React from 'react';
import Cookie from 'js-cookie';
import {Modal,Input,Form,Select,DatePicker} from 'antd';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const Option = Select.Option;
//获取当前日期
let defaultDate;//默认的date
let myDate = new Date();
let year = myDate.getFullYear();
let month = myDate.getMonth()+1;
if(month < 10){
  month = '0' + month;
}
let day = myDate.getDate();
defaultDate = year.toString() + '-' + month.toString() + '-' + day.toString();

// let lastDate;
// let lastMonth = month - 1;
// let lastYear = year;
// if(lastMonth === 0){
//   lastMonth = 12;
//   lastYear = lastYear - 1;
// }
// if(lastMonth < 10){
//   lastMonth = '0' + lastMonth;
// }
// lastDate = lastYear.toString() + '-' + lastMonth.toString() + '-' + '01';


let startDate = year.toString() + '-' + month.toString() + '-' + '01';//当月第一天日期
let nextMonthDayOne = new Date(year,month,1); //下个月的第一天
let minusDate = 1000*60*60*24;
let lastDay = new Date(nextMonthDayOne.getTime()-minusDate).getDate();
let endDate = year.toString() + '-' + month.toString() + '-' + lastDay.toString();//当月最后一天日期
/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-07
 *  功能：实现员工离职功能
 */
class StaffLeaveModal extends React.Component{
  state = {
    visible: false,
    employ_type: '离职人员',
    date: defaultDate
  };
  //显示办理离职对话框
  showModal = (record) => {
    this.setState({
      visible: true,
      username: record.username,
      userid:record.staff_id,
      deptid: record.deptid,
      deptname: record.deptname,
      uuid:record.uuid,
      post_name:record.post_name,
      post_type:record.post_type,
      region_name:record.region_name,
      rank_name:record.rank_name,
      tel:record.tel,
      email:record.email,
      enter_si_time:record.enter_si_time
    });
  };
  //改变用工类型
  handleEmployTypeChange = (value) => { //用工类型：离职人员   离/退休人员
    this.setState({employ_type: value});
  };
  //改变离职日期
  handleDateChange = (date, dateString) => {
    this.setState({date: dateString});
  };
  //确定
  handleOk = () => {
    this.setState({
      visible: false,
    });
    let auth_tenantid = Cookie.get('tenantid');
    let auth_userid = Cookie.get('userid');
    let arg_params = {
      "arg_tenantId": auth_tenantid,
      "arg_userId": this.state.userid,
      "arg_uuid": this.state.uuid,
      "arg_postType": this.state.post_type,
      "arg_leave_si_time": this.state.date,
      "arg_updateby": auth_userid,
      "arg_employType": this.state.employ_type,
      "arg_userName": this.state.username,
      "arg_deptName": this.state.deptname,
      "arg_postName": this.state.post_name,
      "arg_regionName": this.state.region_name,
      "arg_rankName": this.state.rank_name,
      "arg_tel": this.state.tel,
      "arg_email": this.state.email,
      "arg_enter_si_time": this.state.enter_si_time
    };
    const {dispatch} = this.props;
    dispatch({
      type:'staffLeave/staffLeave',
      arg_param:arg_params
    });
  };
  //取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    //日期选择控制
    function disabledDate(current) {
      // 只能选择当月的日期
      /*return current.valueOf() < moment(startDate,dateFormat).valueOf() ||
        current.valueOf() > moment(endDate,dateFormat).valueOf();*/
      return current.valueOf() < moment().month(moment().month() - 1).startOf('month').valueOf() ||
          current.valueOf() > moment().endOf('month').valueOf()
    }

    return (
      <div>
        <Modal
          title="办理离职"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="姓名：" {...formItemLayout}>
              <Input value={this.state.username} disabled/>
            </FormItem>
            <FormItem label="用工类型：" {...formItemLayout}>
              <Select  defaultValue="离职人员" onSelect={this.handleEmployTypeChange}>
                <Option value="离职人员">离职人员</Option>
                <Option value="离/退休人员">离/退休人员</Option>
              </Select>
            </FormItem>
            <FormItem label="离职日期：" {...formItemLayout}>
              <DatePicker allowClear={false} defaultValue={moment(defaultDate,dateFormat)} disabledDate={disabledDate} onChange={this.handleDateChange} />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default StaffLeaveModal;
