/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 预定查询页面查看详情功能
  */

import React from 'react'
import CheackTabs from '../../../components/meetSystem/checkTags'
import styles from '../../../components/meetSystem/myOrder.less'
import { Modal,  Form,  Button,Row,Col,Tag} from 'antd';
import {timeMap} from '../../../components/meetSystem/meetConst'
const FormItem = Form.Item;

class ModalDetail extends React.Component{

  state = { visible: false }
  showModal = (record) => {
    this.setState({
      visible: true,
      meetid:record.meeting_id,
      meetroomname:record.room_name,
      meetname:record.title,
      stuffname:record.booker_name,
      starttime:record.start_time,
      endtime:record.end_time,
      // weekday:record.weekday,
      numpeople:record.number,
      tel:record.booker_tel,
      type:record.level_name,
      book_detail:record.book_detail,
    });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  getTabsData(time_quantum){
    let abledTags={}
    var res=[]
    if(time_quantum){
      JSON.parse(time_quantum).map((i)=>{
        abledTags[i]='1'
      })
    }
    for(var key in timeMap){
      let item={
        key:key,
        text:timeMap[key],
        checked:abledTags[key]!=='0'?true:false,
        show:abledTags[key]?true:false
      }
      res.push(item)
    }

    return res
  }
  render() {

    // const tabsData= this.getTabsData(this.state.time_quantum)
    const label_half={sm:6,xs:24,className:styles.formLabel}
    const item_half={sm:18,xs:24,className:styles.formItem}
    const label_quarter={sm:6,xs:12,className:styles.formLabel}
    const item_quarter={sm:6,xs:12,className:styles.formItem}
    var listTag = () => {
      if(this.state.book_detail == '' || this.state.book_detail == undefined){
        return;
      }else{
        var tempStaring = this.state.book_detail;
        var bookDetailArr = tempStaring.split(',');
        var res = [];
        for(var i = 0; i < bookDetailArr.length; i++){
          res.push(
            <Tag color="#FA7C5E">{bookDetailArr[i]}</Tag>
          )
        }
        return res
      }
    }
    return (
      <div>

        <Modal
          // title="会议详情"
          title={<div style={{textAlign:'center'}}>会议详情</div>}
          visible={this.state.visible}
          onOk={this.handleOk}
          okText = ""
          onCancel={this.handleCancel}
          footer={<div style={{textAlign:'center'}}><Button onClick={this.handleCancel}>关闭</Button></div>}
        >
          <Row gutter={16} style={{backgroundColor:'#E9F2F7',marginLeft:4,marginRight:4}}>
            <Col {...label_half}>
              会议名称：
            </Col>
            <Col {...item_half}>
              {this.state.meetname}
            </Col>
          </Row>
          <Row gutter={16} style={{backgroundColor:'#ffffff',marginLeft:4,marginRight:4}}>
            <Col {...label_quarter}>
              会议类别：
            </Col>
            <Col {...item_quarter}>
              {this.state.type}
            </Col>
            <Col {...label_quarter}>
              会议人数：
            </Col>
            <Col {...item_quarter}>
              {this.state.numpeople}
            </Col>
          </Row>
          <Row gutter={16} style={{backgroundColor:'#E9F2F7',marginLeft:4,marginRight:4}}>
            <Col {...label_quarter}>
              预定员工：
            </Col>
            <Col {...item_quarter}>
              {this.state.stuffname}
            </Col>
            <Col {...label_quarter}>
              联系电话：
            </Col>
            <Col {...item_quarter}>
              {this.state.tel}
            </Col>
          </Row>
          <Row gutter={16} style={{backgroundColor:'#ffffff',marginLeft:4,marginRight:4}}>
            <Col {...label_half}>
              起止时间：
            </Col>
            <Col {...item_half} style={{lineHeight:'35px',paddingTop:'8px'}}>
              {listTag()}
            </Col>
          </Row>

        </Modal>
      </div>
    );
  }
}

export default ModalDetail;
