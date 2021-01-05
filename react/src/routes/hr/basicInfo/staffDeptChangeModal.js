/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-19
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现员工变更部门功能
 */
import React from 'react';
import Cookie from 'js-cookie';
import {Modal,Input,Form,Select,DatePicker,message} from 'antd';
import {OU_HQ_NAME_CN,OU_NAME_CN} from '../../../utils/config';
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

// let startDate = year.toString() + '-' + month.toString() + '-' + '01';//当月第一天日期 
let nextMonthDayOne = new Date(year,month,1);//下个月的第一天
let minusDate = 1000*60*60*24;
let lastDay = new Date(nextMonthDayOne.getTime()-minusDate).getDate();
let endDate = year.toString() + '-' + month.toString() + '-' + lastDay.toString();//当月最后一天日期
let dept_from;//记录变更前的部门名称
/**
 *  作者: 耿倩倩
 *  创建日期: 2017-09-19
 *  功能：实现员工变更部门功能
 */
class StaffDeptChangeModal extends React.Component{
  state = {
    visible: false,
    deptname: null,
    date: defaultDate
  };

  staffDeptDate = (record,dispatch) => {
    let param = {arg_ou:record.deptname.split('-')[0]}
    dispatch({
      type:'staffDeptEdit/staffDeptChangeDate',
      param
    })
  }

  //显示变更部门对话框
  showModal = (record,dispatch) => {
    this.staffDeptDate(record,dispatch)
    this.setState({
      visible: true,
      username: record.username,
      userid: record.staff_id,
      deptid: record.deptid,
      deptname: record.deptname, //院-部门
      uuid: record.uuid,
      defaultDept:record.deptname.split('-')[1] //院
    });
    dept_from = record.deptname; //院-部门
  };

  //变更部门
  handleDeptChange = (value) => {
    this.setState({
      deptname: value,
      defaultDept: value //部门
    });
  };

  //选择变更部门的日期
  handleDateChange = (date, dateString) => {
    this.setState({date: dateString});
  };

  handleOk = () => {
    let auth_tenantid = Cookie.get('tenantid');
    let pre_ou = Cookie.get('OU');
    if(pre_ou === OU_HQ_NAME_CN){
      pre_ou = OU_NAME_CN; //取 联通软件研究院
    }
    let auth_userid = Cookie.get('userid');
    let arg_params = {
      "arg_tenantid": auth_tenantid,
      "arg_userid": this.state.userid,
      "arg_updateby": auth_userid,
      "arg_dept_name": pre_ou + '-' + this.state.defaultDept,
      "arg_dept_from": dept_from,
      "arg_updatetime": this.state.date + ' 08:00:00',
    };

    if(dept_from === this.state.deptname){
      message.warning('部门没有发生变化！');
    } else{
      const {dispatch} = this.props;
      dispatch({
        type:'staffDeptEdit/staffDeptChange',
        arg_param:arg_params
      });
      this.setState({
        visible: false,
        deptname: null,
        defaultDept: null
      });
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      deptname: null,
      defaultDept: null
    });
  };

  render() {
    const {staffDeptChangeDate} = this.props
    let startDate = year.toString() + '-' + month.toString() + '-' + '01';//当月第一天日期
    if (staffDeptChangeDate) {
      if (staffDeptChangeDate[0].total_month.toString() == '12') {
        startDate =(Number(staffDeptChangeDate[0].total_year)+1).toString()+'-'+ '01'+'-'+'01'
      } else {
        startDate =staffDeptChangeDate[0].total_year.toString()+'-'+ (Number(staffDeptChangeDate[0].total_month)+1).toString()+'-'+'01'
      }
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    let deptOptionList;
    if(this.props.deptList){
      deptOptionList = this.props.deptList.map((item) => {
        return (
          <Option key={item}>
            {item}
          </Option>
        )
      });
    }

    //只能选择当月的日期
    function disabledDate(current) {
      return current.valueOf() < moment(startDate,dateFormat).valueOf() ||
        current.valueOf() > moment(endDate,dateFormat).valueOf();
    }

    return (
      <div>
        <Modal
          title="变更部门"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="姓名：" {...formItemLayout}>
              <Input value={this.state.username} disabled/>
            </FormItem>
            <FormItem label="部门：" {...formItemLayout}>
              <Select  value={this.state.defaultDept} onSelect={this.handleDeptChange}>
                {deptOptionList}
              </Select>
            </FormItem>
            <FormItem label="变更日期：" {...formItemLayout}>
              <DatePicker style={{'width':203}} defaultValue={moment(defaultDate,dateFormat)} disabledDate={disabledDate} onChange={this.handleDateChange} />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default StaffDeptChangeModal;
