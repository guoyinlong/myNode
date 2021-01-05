/**
  * 作者： 卢美娟
  * 创建日期: 2018-05-29
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 预定查询页面-综合部负责人的限制预定功能
  */

import React from 'react'
// import { connect } from 'dva';

import { Modal,  Form,Input,  Button,Select,Slider,Tooltip,  Icon,message} from 'antd';
import {connect } from 'dva';
const FormItem = Form.Item;
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 预定查询页面-综合部负责人的强制取消类
  */
class ModalLimit extends React.Component{
  state = {
     visible: false,
     initialLimitReason:'',
  }
  showModal = (record) => {
    this.setState({
      visible: true,
      meetid : record.meeting_id,
      timequantum:record.time_quantum,
      roomname:record.room_name,
      orderday:record.book_day,
      roomid:record.room_id,
      title:record.title,
      staffid:record.booker_id,
    });
  }
  handleOk = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
    if(this.refs.limitR.value.length >= 50){
      message.info("取消原因不能超过50字")
      return;
    }
    this.props.submitLimit(this.state.meetid,this.refs.limitR.value,this.state.roomid,this.state.roomname,this.state.title,this.state.staffid)
    this.setState({
      initialLimitReason:'',
    })
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  changeLimitReason = (e) => {
    this.setState({
      initialLimitReason: this.refs.limitR.value
    })
  }
  render() {

    return (
      <div>
        <Modal
          title="请填写限制原因"
          visible={this.state.visible}
          onOk={this.handleOk}
          okText = "确定"
          onCancel={this.handleCancel}
        >
        <textarea rows='5' cols='67' ref = "limitR" placeholder="限制原因不超过50字" onChange = {this.changeLimitReason} value = {this.state.initialLimitReason}></textarea>
        </Modal>
      </div>
    );
  }
}



export default ModalLimit;
