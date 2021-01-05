/**
  * 作者： 卢美娟
  * 创建日期: 2017-07-27
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 预定查询页面-综合部负责人的强制取消功能
  */

import React from 'react'
// import { connect } from 'dva';

import { Modal,  Form,Input,  Button,Select,Slider,Tooltip, Icon,message} from 'antd';
import {connect } from 'dva';
const FormItem = Form.Item;
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 预定查询页面-综合部负责人的强制取消类
  */
class ModalForce extends React.Component{
  state = { visible: false }
  showModal = (record) => {
    this.setState({
      visible: true,
      meetid : record.meeting_id,
      timequantum:record.time_quantum,
      roomname:record.room_name,
      orderday:record.book_day,
      roomid:record.room_id,
      initialForceReason:'',
    });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    if(this.refs.forceR.value.length >= 50){
      message.info("取消原因不能超过50字")
      return;
    }
    this.props.onCancel(this.state.meetid,this.refs.forceR.value,this.state.roomid)
    this.setState({
      initialForceReason:'',
    })

  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  changeForceReason = (e) => {
    this.setState({
      initialForceReason: this.refs.forceR.value
    })
  }

  render() {
    return (
      <div>
        <Modal
          title="请填写取消原因"
          visible={this.state.visible}
          onOk={this.handleOk}
          okText = "确定"
          onCancel={this.handleCancel}
        >
        <textarea rows='5' cols='67' ref = "forceR" placeholder="取消原因不超过50字"  onChange = {this.changeForceReason} value = {this.state.initialForceReason}></textarea>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { list, query} = state.orderSearch;  //lumj

  return {
    loading: state.loading.models.orderSearch,
    list,
    query
  };
}

// export default connect(mapStateToProps)(ModalForce);

export default ModalForce;
