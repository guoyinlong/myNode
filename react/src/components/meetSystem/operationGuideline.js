/**
 *  作者: 卢美娟
 *  创建日期: 2018-05-21
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：操作索引
 */
import React from 'react';
import { Icon, DatePicker,Modal,Popconfirm,message,Tooltip,Button,Input,Upload,Pagination,Form,Cascader,Row,Col } from 'antd';


class GuildlineModal extends React.Component {

  state = {

  }


  confirmGuild = (e) => {
    e.preventDefault();
    const { confirmClick } = this.props;
    confirmClick();
  }

  render(){
    return(
      <Modal visible={this.props.visible} width='930px' height = '600px'  title={'视频会议室操作指引'} onCancel={this.confirmGuild}  footer={<Button type='primary' onClick={this.confirmGuild}>知道了</Button>}>
        <div>
          <div style = {{fontSize:18,color:'black',padding:7,fontWeight:'bold'}}>（一）接入集团视频/与省分公司视频</div>
          <div style = {{padding:4,fontWeight:13}}> 1. 集团视频使用设备为华为设备，总院配置华为设备的会议室为：T005/T001/A101；</div>
          <div style = {{padding:4,fontWeight:13}}> 2. 会议接入不同场景：</div>
          <div style = {{padding:4,fontWeight:13}}> a.直接接入集团公司视频信号，与系统集成公司许坤（18600407738）联系，说明我方会议室接入集团的会议室情况。</div>
          <div style = {{padding:4,fontWeight:13}}> b.与省分公司一对一单点接入，可以直接联系7层前台会服，索要对方的IP地址，或提供我方IP地址，由会服操作接入；</div>
          <div style = {{padding:4,fontWeight:13}}> c.与省分公司一对多接入，需要通过集团公司视频中转（集团A310或B310会议室，集团会议室需要提前一周预定）</div>
        </div>
        <div style = {{marginTop:10}}>
          <div style = {{fontSize:18,color:'black',padding:7,fontWeight:'bold'}}>（二）与分院进行视频会议</div>
          <div style = {{padding:4,fontWeight:13}}> 1. 与分院进行视频会议，使用设备为星澜设备，总院配置星澜设备的会议室为：T005/T002/T010/T011；</div>
          <div style = {{padding:4,fontWeight:13}}> 2. 预定方法：</div>
          <div style = {{padding:4,fontWeight:13}}> a.需要在会议预定时，要进行视频接入端选择；因分院目前仅有一套视频会议设备，建议提前确认分院同一时段只有一个视频会议。</div>
          <div style = {{padding:4,fontWeight:13}}> b.需要在会议开始前半小时/一小时与系统集成公司支撑人员联系：李文静 13683622160，进行会议视频设备提前调测，并提供话筒、投影等资源服务。</div>
          <div style = {{padding:4,fontWeight:13}}> c.如需会议饮用水、会议服务等需要提前与会服人员联系。</div>
          <div style = {{padding:4,fontWeight:13}}> d.晚上的会议没有会服人员、视频调测支撑人员。</div>
        </div>

      </Modal>
    )

  }
}

export default Form.create()(GuildlineModal);
