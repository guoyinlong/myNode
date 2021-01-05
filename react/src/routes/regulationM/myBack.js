/**
  * 作者： 卢美娟
  * 创建日期： 2018-06-13
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 规章制度-我的审批
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon,message ,Input,Button,Row, Col,Card,Spin,Tabs,Modal} from 'antd';
const TabPane = Tabs.TabPane;
import styles from './ruleRegulation/regulationM.less';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import {corp_id, agent_id} from './const.js';

class MyBack extends React.Component{
  state = {
    modalRedeleteVisible: false,
    redeleteReason: '',
    taskid:'',
    itemid:'',
    recordid:'',
  }
  ReDeleteReason = (e) => {
    this.setState({
      redeleteReason: e.target.value
    })
  }
  reDelete = (id,itemid,recordid) => {
    this.setState({
      modalRedeleteVisible: true,
      taskid: id,
      itemid: itemid,
      recordid: recordid,
    })
  }
  handleCancel = () => {
    this.setState({
      modalRedeleteVisible: false,
      redeleteReason: '',
    })
  }
  handleOk = () => {
    const {dispatch} = this.props;
    if(this.state.redeleteReason.replace(/\s/g, "").length == 0){
      message.info("原因不能为空！");
      return;
    }
    var data2 = {
      arg_id: this.state.taskid,
      arg_todo_item_id: this.state.itemid,
      arg_resend_reason: this.state.redeleteReason.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, ''),
      arg_record_id: this.state.recordid,
      arg_corp_id: corp_id,
      arg_agent_id: agent_id,
    }
    dispatch({
      type: 'myBack/delRegulationResendReview',
      data2,
    })
    this.setState({
      modalRedeleteVisible: false,
      redeleteReason: '',
    })
  }
  reUpload = (id,itemid,recordid) => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/regulationM/myUpload/upload',
      query:{arg_id:id,arg_todo_item_id:itemid,arg_record_id:recordid,oriPage:'myBack'},
    }));
  }

  abandonRegulation = (id,item_id,record_id) => {
    const {dispatch} = this.props;
    var data2 = {
      arg_id: id,
      arg_todo_item_id: item_id,
      arg_record_id: record_id,
      arg_corp_id: corp_id,
      arg_agent_id: agent_id,
    }
    dispatch({
      type:'myBack/publishRegulationAbandon',
      data2,
    })
  }

  delRegulationAbandon = (id,item_id,record_id) => {
    const {dispatch} = this.props;
    var data2 = {
      arg_id: id,
      arg_todo_item_id: item_id,
      arg_record_id: record_id,
    }
    dispatch({
      type:'myBack/delRegulationAbandon',
      data2,
    })
  }


  render(){
    const {myPublicRejectList,myDeleteRejectList} = this.props;

    var publicContent = () => {
      var res = [];
      if(myPublicRejectList){
        for(let i = 0; i < myPublicRejectList.length; i++){
          res.push(
            <div>
              <Row key = {i}>
                <Col span = {24}>
                  <Card>
                    <div className = {styles.reviewItem}>
                      退回文件：{myPublicRejectList[i].item_title}
                    </div>
                    <div className = {styles.reviewItem}>
                      退回时间：{myPublicRejectList[i].done_time?myPublicRejectList[i].done_time.split('.')[0]:''}
                    </div>
                    <div className = {styles.reviewItem}>
                      退回原因：{myPublicRejectList[i].reason}
                    </div>
                    <Button type = 'primary'  style = {{float:'right'}} onClick = {()=>this.reUpload(myPublicRejectList[i].item_id,myPublicRejectList[i].id,myPublicRejectList[i].proc_inst_id)}>重新编辑</Button>
                    <Button  style = {{float:'right',marginRight:10}} onClick = {()=>this.abandonRegulation(myPublicRejectList[i].item_id,myPublicRejectList[i].id,myPublicRejectList[i].proc_inst_id)}>作废</Button>
                  </Card>
                </Col>
              </Row>
              <div style = {{height:10}}></div>
            </div>
          )
        }
      }

      return res;
    }
    var deleteContent = () => {
      var res = [];
      if(myDeleteRejectList){
        for(let i = 0; i < myDeleteRejectList.length; i++){
          res.push(
            <div>
              <Row key = {i}>
                <Col span = {24}>
                  <Card>
                    <div className = {styles.reviewItem}>
                      退回文件：{myDeleteRejectList[i].item_title}
                    </div>
                    <div className = {styles.reviewItem}>
                      退回时间：{myDeleteRejectList[i].done_time?myDeleteRejectList[i].done_time.split('.')[0]:''}
                    </div>
                    <div className = {styles.reviewItem}>
                      退回原因：{myDeleteRejectList[i].reason}
                    </div>
                    <Button type = 'primary'  style = {{float:'right'}} onClick = {()=>this.reDelete(myDeleteRejectList[i].item_id,myDeleteRejectList[i].id,myDeleteRejectList[i].proc_inst_id)}>重新删除</Button>
                    <Button  style = {{float:'right',marginRight:10}} onClick = {()=>this.delRegulationAbandon(myDeleteRejectList[i].item_id,myDeleteRejectList[i].id,myDeleteRejectList[i].proc_inst_id)}>作废</Button>
                  </Card>
                </Col>
              </Row>
              <div style = {{height:10}}></div>
            </div>
          )
        }
      }

      return res;
    }
    return(
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className = {styles.pageContainer}>
            <h2 style = {{textAlign:'center'}}>我的退回</h2>
            <div style = {{marginTop:35}} className = {styles.lightInfo}>
              您有 {`${myPublicRejectList?myPublicRejectList.length:'0'}`} 条发布退回， {`${myDeleteRejectList?myDeleteRejectList.length:'0'}`} 条删除退回</div>
            <Tabs defaultActiveKey="1" style = {{marginTop:20}}>
              <TabPane tab={<span><Icon type='mail'/>发布退回 ({myPublicRejectList?myPublicRejectList.length:'0'})</span>} key="1">
                <div style = {{marginTop:10}}>
                  {publicContent()}
                </div>
              </TabPane>
              <TabPane tab={<span><Icon type='mail'/>删除退回({myDeleteRejectList?myDeleteRejectList.length:'0'})</span>} key="2">
                <div style = {{marginTop:10}}>
                  {deleteContent()}
                </div>
                <Modal
                  title="请填写重新删除原因"
                  visible={this.state.modalRedeleteVisible}
                  onOk={this.handleOk}
                  okText = "确定"
                  onCancel={this.handleCancel}
                >
                <textarea rows='5' cols='67' ref = "disagreeR" placeholder="重新删除原因不超过50字"  maxLength='50' onChange = {this.ReDeleteReason} value = {this.state.redeleteReason}></textarea>
                </Modal>
              </TabPane>
            </Tabs>


        </div>
      </Spin>
    );
  }

}

function mapStateToProps (state) {
  const {query,myPublicRejectList,myDeleteRejectList} = state.myBack;  //lumj
  return {
    loading: state.loading.models.myBack,
    query,
    myPublicRejectList,
    myDeleteRejectList,
  };
}


export default connect(mapStateToProps)(MyBack);
