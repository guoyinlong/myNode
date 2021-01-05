/**
  * 作者： 卢美娟
  * 创建日期： 2018-06-13
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 规章制度-我的审批
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon ,Input,Button,Row, Col,Card,Modal,Spin,Tabs,message} from 'antd';
const TabPane = Tabs.TabPane;
import moment from 'moment';
import styles from './../ruleRegulation/regulationM.less';
import { routerRedux } from 'dva/router';

const fileAddress = '/filemanage/filedownload?fileIdList=';
import {corp_id, agent_id} from '../const.js';

class MyApproval extends React.Component{

  state = {
    publicvisible:false,
    deletevisible:false,
    disReason:'',
    rebackid:'',
    todoitemid:'',
    recordid:'',
    flag:'0', // 0-发布审批的退回；1-删除审批的退回
  }

  showPublicDisagreeModal = (id,recordid,itemid) =>{
    this.setState({
      publicvisible:true,
      //此处存储退回的规章制度的id,i变成具体的数据
      rebackid:id,
      todoitemid:itemid,
      recordid:recordid,
    })
  }


  showDeleteDisagreeModal = (id,recordid,itemid) => {
    this.setState({
      deletevisible:true,
      //此处存储退回的规章制度的id,i变成具体的数据
      rebackid:id,
      todoitemid:itemid,
      recordid:recordid,
    })
  }

  handleCancel = ()=>{
    this.setState({
      publicvisible:false,
      disReason:'',
    })
  }
  handleCancel2 = ()=>{
    this.setState({
      deletevisible:false,
      disReason:'',
    })
  }
  handleOk = () => {
    const {dispatch} = this.props;
    if(this.state.disReason.replace(/\s/g, "").length == 0){
      message.info("原因不能为空！");
      return;
    }
    var data = {
      arg_id: this.state.rebackid,
      arg_review_result: '0', //不同意发布
      arg_review_content: this.state.disReason.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, ''), //去掉前后端空格
      arg_record_id: this.state.recordid,
      arg_todo_item_id: this.state.todoitemid,
      arg_corp_id: corp_id,
      arg_agent_id: agent_id,
    }
    dispatch({
      type:'myApproval/publishRegulationReview',
      data,
    })

    this.setState({
      publicvisible:false,
      disReason:'',
    })
  }
  handleOk2 = () => {
    const {dispatch} = this.props;
    if(this.state.disReason.replace(/\s/g, "").length == 0){
      message.info("原因不能为空！");
      return;
    }
    var data = {
      arg_id: this.state.rebackid,
      arg_review_result: '0', //不同意删除
      arg_review_content: this.state.disReason.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, ''),
      arg_record_id: this.state.recordid,
      arg_todo_item_id: this.state.todoitemid,
      arg_corp_id: corp_id,
      arg_agent_id: agent_id,
    }

    dispatch({
      type:'myApproval/publishRegulationReview',
      data,
    })
    this.setState({
      deletevisible:false,
      disReason:'',
    })
  }
  disagreeReason = (e) => {
    this.setState({disReason:e.target.value})
  }
  agreepublicApproval = (id,recordId,itemId) => { //同意发布规章制度
    const {dispatch} = this.props;
    var data = {
      arg_id: id,
      arg_review_result: '1', //同意发布
      arg_record_id: recordId,
      arg_todo_item_id: itemId,
      arg_corp_id: corp_id,
      arg_agent_id: agent_id,
    }
    dispatch({
      type:'myApproval/publishRegulationReview',
      data,
    })
  }

  agreeDeleteApproval = (id,recordId,itemId) => { //同意删除规章制度
    const {dispatch} = this.props;
    var data = {
      arg_id: id,
      arg_review_result: '1', //同意发布
      arg_record_id: recordId,
      arg_todo_item_id: itemId,
      arg_corp_id: corp_id,
      arg_agent_id: agent_id,
    }
    dispatch({
      type:'myApproval/delRegulationReview',
      data,
    })
  }

  downloadMainfile = (mainfileId) => {
    let url = fileAddress + mainfileId;
    // window.location.assign(url);
    window.open(url);
  }
  downloadAttach = (attachId) => {
    let url = fileAddress + attachId;
    // window.location.assign(url);
    window.open(url)
  }

  render(){
    const {myPublicReviewList,publicRowCount,myDeleteReviewList,deleteRowCount} = this.props;
    var publicContent = () => {
      var res = [];
      var mainfile,mainfileId;

      if(myPublicReviewList){
        for(let i = 0; i < myPublicReviewList.length; i++){
          var attachments = [];
          var attachmentsId = [];
          var realkeyword = '';
          var  tempkeyword = JSON.parse(myPublicReviewList[i].keywords);
          if(tempkeyword){
            for(let a = 0; a < tempkeyword.length; a++){
              realkeyword = realkeyword + tempkeyword[a].keyword + '  ';
            }
          }
          var itemFiles = JSON.parse(myPublicReviewList[i].item_files);
          if(itemFiles){
            for(let a = 0; a < itemFiles.length; a++){
              if(itemFiles[a].file_type == '0'){//正文
                 mainfile = itemFiles[a].filename;
                 mainfileId = itemFiles[a].fileid;

              }
              else if(itemFiles[a].file_type == '1'){ //附件
                attachments.push(itemFiles[a].filename);
                attachmentsId.push(itemFiles[a].fileid);
              }
            }
          }

          console.log("88888888888");
          console.log(mainfile);
          console.log(mainfileId);

          var subAttachment = (attachments,attachmentsId) => {
            let attachres = [];
            for(let b = 0; b < attachments.length; b++){
              attachres.push(
                <span><a onClick = {()=>{this.downloadAttach(attachmentsId[b])}}>{attachments[b]}</a>&nbsp;&nbsp;&nbsp;</span>
              )
            }
            return attachres;
          }
          res.push(
            <div>
              <Row key = {i}>
                <Col span = {24}>
                  <Card>
                    <div className = {styles.reviewItem}>规章制度名称：{myPublicReviewList[i].item_title}</div>
                    <span className = {styles.reviewItem2}>制度类别：{myPublicReviewList[i].item_category1_name}</span>
                    <span className = {styles.reviewItem2}>级别：{myPublicReviewList[i].item_level_name}</span>
                    <span className = {styles.reviewItem2}>性质：{myPublicReviewList[i].item_kind_name}</span>
                    <span className = {styles.reviewItem2}>密级：{myPublicReviewList[i].is_secret === '0'?'无':'普通商业秘密'}</span>
                    <span className = {styles.reviewItem}>发文文号：{myPublicReviewList[i].item_doc_num}</span>
                    <div className = {styles.reviewItem}>关键字：{realkeyword}</div>
                    <div className = {styles.reviewItem}>摘要：{myPublicReviewList[i].item_summary}</div>
                    <div className = {styles.reviewItem}>正文：<a href = {fileAddress + mainfileId}>{mainfile}</a></div>
                    <div className = {styles.reviewItem}>附件：
                      {subAttachment(attachments,attachmentsId)}
                    </div>

                    <Button type = 'primary'  style = {{float:'right'}} onClick = {()=>this.agreepublicApproval(myPublicReviewList[i].item_id,myPublicReviewList[i].proc_inst_id,myPublicReviewList[i].id)}>同意</Button>
                    <Button style = {{float:'right',marginRight:20}} onClick={()=>this.showPublicDisagreeModal(myPublicReviewList[i].item_id,myPublicReviewList[i].proc_inst_id,myPublicReviewList[i].id)}>退回</Button>
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
      var mainfile,mainfileId;
      var attachments = [];
      var attachmentsId = [];
      if(myDeleteReviewList){
        for(let i = 0; i < deleteRowCount; i++){
          var itemFiles = JSON.parse(myDeleteReviewList[i].item_files);
          if(itemFiles){
            for(let a = 0; a < itemFiles.length; a++){
              if(itemFiles[a].file_type == '0'){//正文
                 mainfile = itemFiles[a].filename;
                 mainfileId = itemFiles[a].fileid;
              }
              else if(itemFiles[a].file_type == '1'){ //附件
                attachments.push(itemFiles[a].filename);
                attachmentsId.push(itemFiles[a].fileid);
              }
            }
          }

          res.push(
            <div>
              <Row key = {i}>
                <Col span = {24}>
                  <Card>
                    <div className = {styles.reviewItem}>规章制度名称：{myDeleteReviewList[i].item_title}</div>
                    <div className = {styles.reviewItem}>正文：<a href = {fileAddress + mainfileId}>{mainfile}</a></div>
                    <div className = {styles.reviewItem}>删除原因：{myDeleteReviewList[i].reason}</div>

                    <Button type = 'primary'  style = {{float:'right'}} onClick = {()=>this.agreeDeleteApproval(myDeleteReviewList[i].item_id,myDeleteReviewList[i].proc_inst_id,myDeleteReviewList[i].id)}>同意</Button>
                    <Button style = {{float:'right',marginRight:20}} onClick={()=>this.showDeleteDisagreeModal(myDeleteReviewList[i].item_id,myDeleteReviewList[i].proc_inst_id,myDeleteReviewList[i].id)}>退回</Button>
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
          <h2 style = {{textAlign:'center'}}>我的审批</h2>
          <div style = {{marginTop:35}} className = {styles.lightInfo}>您有 {publicRowCount} 条发布记录待审批，{deleteRowCount} 条删除记录待审批！</div>

          <Tabs defaultActiveKey="1" style = {{marginTop:20}}>
            <TabPane tab={<span><Icon type='mail'/>发布审批 ({publicRowCount})</span>} key="1">
              <div style = {{marginTop:10}}>
                {publicContent()}
              </div>
            </TabPane>
            <TabPane tab={<span><Icon type='mail'/>删除审批({deleteRowCount})</span>} key="2">
              <div style = {{marginTop:10}}>
                {deleteContent()}
              </div>

            </TabPane>
          </Tabs>

          <Modal
            title="请填写不允许发布原因"
            visible={this.state.publicvisible}
            onOk={this.handleOk}
            okText = "确定"
            onCancel={this.handleCancel}
          >
          <textarea rows='5' cols='67' ref = "disagreeR" placeholder="退回原因不超过50字" maxLength='50' onChange = {this.disagreeReason} value = {this.state.disReason}></textarea>
          </Modal>

          <Modal
            title="请填写不允许删除原因"
            visible={this.state.deletevisible}
            onOk={this.handleOk2}
            okText = "确定"
            onCancel={this.handleCancel2}
          >
          <textarea rows='5' cols='67' ref = "disagreeR" placeholder="退回原因不超过50字" maxLength='50' onChange = {this.disagreeReason} value = {this.state.disReason}></textarea>
          </Modal>

      </div>
      </Spin>
    );
  }

}

function mapStateToProps (state) {
  const {query,myPublicReviewList,publicRowCount,myDeleteReviewList,deleteRowCount} = state.myApproval;  //lumj
  return {
    loading: state.loading.models.myApproval,
    query,
    myPublicReviewList,
    publicRowCount,
    myDeleteReviewList,
    deleteRowCount,
  };
}


export default connect(mapStateToProps)(MyApproval);
