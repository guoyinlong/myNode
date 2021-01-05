/**
  * 作者： 卢美娟
  * 创建日期： 2018-06-13
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 规章制度-我的上传
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon, DatePicker,Modal,Popconfirm,message,Tooltip ,Input,Button,Upload,Spin} from 'antd';
import moment from 'moment';;
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import styles from './../ruleRegulation/regulationM.less';
import {corp_id, agent_id} from '../const.js';


class MyUpload extends React.Component{

  state = {
    modalDeleteVisible: false,
    deleteReason: '',
    deleteid: '',
  }

  hideModal = () => {
    this.setState({
      modalDeleteVisible: false,
      deleteReason: '',
    })
  }

  hideConfirm = () => {
    const {dispatch} = this.props;
    if(this.state.deleteReason.replace(/\s/g, "").length == 0){
      message.info("删除原因不能为空！");
      return;
    }
    var data = {
      arg_id: this.state.deleteid,
      arg_reason: this.state.deleteReason.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, ''), //去掉前后端空格
      arg_corp_id: corp_id,
      arg_agent_id: agent_id,
    }
    dispatch({
      type: 'myUpload/deleteRegulationSendReview',
      data,
    })
    this.setState({
      modalDeleteVisible: false,
      deleteReason: '',
    })
  }

  deletePublished = (id) => {
    this.setState({
      modalDeleteVisible: true,
      deleteid: id,
    })
  }

  deleteReason = (e) => {
    this.setState({
      deleteReason: e.target.value,
    })
  }

  disableRegulation = (record) => {
    const {dispatch} = this.props;
    var data = {
      arg_id: record.id,
      arg_enabled: 0,
    }
    dispatch({
      type: 'myUpload/enableRegulation',
      data,
    })
  }

  enableRegulation = (record) => {
    const {dispatch} = this.props;
    var data = {
      arg_id: record.id,
      arg_enabled: 1,
    }
    dispatch({
      type: 'myUpload/enableRegulation',
      data,
    })
  }

  regulationDel = (id) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'myUpload/regulationDel',
      arg_id: id,
    })
  }

  regulationEdit = (id) => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/regulationM/myUpload/upload',
      // query:{arg_id:id, newflag: '0'},
      query:{arg_id:id, newflag: '0',oriPage:'myUpload'},
    }));
  }

  showOperationEff = (record) => {
    if(record.publish_state === '1'){ //审核中
      return (
        <div style = {{display:'inline'}}>
          <a disabled>删除</a>&nbsp;&nbsp;
          <a disabled>使生效</a>
        </div>
      )
    }
    else if(record.publish_state === '0'){ //草稿
      return (
        <div style = {{display:'inline'}}>
          <a onClick = {() => this.regulationDel(record.id)}>删除</a>&nbsp;&nbsp;
          <a onClick = {() => this.regulationEdit(record.id)}><font style = {{color:'#FA7252'}}>编辑</font></a>&nbsp;&nbsp;
        </div>
      )
    }
    else if(record.publish_state === '2'){ //已发布
      if(record.is_deleted == '0') { //未删除
        if(record.is_enabled == '0'){
          return (
            <div style = {{display:'inline'}}>
              <a onClick = {() => this.deletePublished(record.id)}>删除</a>&nbsp;&nbsp;
              <a onClick = {() => this.enableRegulation(record)}><font style = {{color:'red'}}>使生效</font></a>
            </div>
          )
        }else {
          return (
            <div style = {{display:'inline'}}>
              <a onClick = {() => this.deletePublished(record.id)}>删除</a>&nbsp;&nbsp;
              <a onClick = {() => this.disableRegulation(record)}><font style = {{color:'green'}}>使失效</font></a>
            </div>
          )
        }
      }
      else if(record.is_deleted == '1'){
        return (
          <div style = {{display:'inline'}}>
            <a disabled>删除</a>&nbsp;&nbsp;
            <a disabled>使生效</a>
          </div>
        )
      }
    }
  }

  showOperationVis = (record) => {
    if(record === '0'){
      return(
        <div><font style = {{color:'red'}}>● </font>无效</div>
      )
    }else if (record === '1'){
      return(
        <div><font style = {{color:'green'}}>● </font>有效</div>
      )
    }
  }

  showSeceret = (record) => {
    if(record === '0'){
      return(
        <div>无</div>
      )
    }else if (record === '1'){
      return(
        <div>普通商业秘密</div>
      )
    }
  }

  showOperationUS = (record) => {
    if(record.publish_state === '0'){
      return(
        <div>草稿</div>
      )
    }else if (record.publish_state === '1'){
      return(
        <div>审核中</div>
      )
    }else if (record.publish_state === '2'){
      if(record.is_deleted == '0'){ //未删除
        return(
          <div>已发布</div>
        )
      }
      else if(record.is_deleted == '1'){
        return(
          <div>删除中</div>
        )
      }
    }
  }

  gotoUpload = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/regulationM/myUpload/upload',
      query:{newflag: '1',oriPage:'myUpload'},
    }));
  }

  showOperation = (record) => {
    if(record.category2_name){
      return (
        <span>{record.category1_name}-{record.category2_name}</span>
      )
    }
    else{
      return (
        <span>{record.category1_name}</span>
      )
    }
  }

  columns = [
    {
      title: '名称',
      dataIndex: 'title',
      width:250,
    },
    {
      title: '类别',
      width:100,
      render:(record) => this.showOperation(record)
    },
    {
      title: '体系',
      dataIndex: 'sys_name',
      width:100,
    },
    {
      title: '级别',
      dataIndex: 'level_name',
      width:100,
    },
    {
      title: '性质',
      dataIndex: 'kind_name',
      width:100,
    },
    {
      title: '密级',
      dataIndex: 'is_secret',
      render:(record) => this.showSeceret(record),
      width:100,
    },
    {
      title: '上传时间',
      dataIndex: 'update_date',
      width:150,

    },
    {
      title: '是否有效',
      dataIndex: 'is_enabled',
      width: 100,
      render:(record) => this.showOperationVis(record),
    },
    {
      title: '上传状态',
      // dataIndex: 'publish_state',
      width:100,
      render:(record) => this.showOperationUS(record),
    },
    {
      title: '操作',
      width:150,
      render:(record) => this.showOperationEff(record),
    },
  ];
  render(){
    const {myReguList} = this.props;
    return(
      <Spin tip="加载中..." spinning={this.props.loading}>
         <div className = {styles.pageContainer}>
           <h2 style = {{textAlign:'center'}}>我的上传</h2>
           <Button type = 'primary' style = {{marginLeft:'95%'}} onClick = {this.gotoUpload}>新增</Button>
           <div style = {{marginTop:20}}>
              <Table columns={this.columns} dataSource={myReguList} pagination={true} className={styles.orderTable} style = {{marginTop:20}}/>
           </div>

           <Modal
               title="请填写删除原因"
               visible={this.state.modalDeleteVisible}
               onOk={this.hideConfirm}
               okText = "确定"
               cancelText="取消"
               onCancel={this.hideModal}
             >
             <textarea rows='5' cols='67' ref = "disagreeR" placeholder="删除原因不超过50字"  onChange = {this.deleteReason} value = {this.state.deleteReason}></textarea>
           </Modal>
         </div>
      </Spin>
    );
  }

}

function mapStateToProps (state) {
  const {query,myReguList} = state.myUpload;  //lumj
  return {
    loading: state.loading.models.myUpload,
    query,
    myReguList
  };
}


export default connect(mapStateToProps)(MyUpload);
