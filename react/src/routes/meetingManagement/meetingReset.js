/**
 * 作者：韩爱爱
 * 日期：2020-2-19
 * 邮箱：1010788276@qq.com
 * 功能：归档前修改填报议题
 */
import React, {Component} from 'react';
import Cookie from 'js-cookie';
import {connect } from 'dva';
import {Button, Input, Modal, Table,Popconfirm,Upload,Radio} from "antd";
import styles from "./meetingTable.less";
import {routerRedux} from "dva/router";
import MeetingOutReset from './meetingOutReset.js';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
class MeetingReset extends Component{
  constructor(props){
    super(props)
  };
  state = {
    isUploadingFile: false, // 是否正在上传文件
    uploadFile:{
      name: 'filenames',
      multiple: true,
      showUploadList: true,
      action: '/filemanage/fileupload',
      data: {
        argappname: 'writeFileUpdate',
        argtenantid: Cookie.get('tenantid'),
        arguserid: Cookie.get('userid'),
        argyear: new Date().getFullYear(),
        argmonth: new Date().getMonth() + 1,
        argday: new Date().getDate()
      },
      onChange: (info) => {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode === '1') {
            this.updateFilePath(info.file.response);
            //message.success(`${info.file.name} 导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！.`);
          }
        }
      }
    },
    //佐证材料
    uploadFileAll:{
      name: 'filename',
      multiple: true,
      showUploadList: true,
      action: '/filemanage/fileupload',
      data: {
        argappname: 'writeFileUpdate',
        argtenantid: Cookie.get('tenantid'),
        arguserid: Cookie.get('userid'),
        argyear: new Date().getFullYear(),
        argmonth: new Date().getMonth() + 1,
        argday: new Date().getDate()
      },
      onChange: (info) => {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode === '1') {
            this.updateFileAll(info.file.response);
            //message.success(`${info.file.name} 导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！.`);
          }
        }
      }
    }
  };
  //上会材料上传
  updateFilePath = (value) => {
    this.props.dispatch({
      type:"meetingReset/updateFilePath",
      value:value
    })
  };
  //佐证材料上传
  updateFileAll = (value) => {
    this.props.dispatch({
      type:"meetingReset/updateFileAll",
      value:value
    })
  };
  //议题名称
  handleTopicName =(e)=>{
    this.props.dispatch({
      type:"meetingReset/handleTopicName",
      value: e.target.value
    })
  };
  // 待决议事项
  handleTopicContent=(e)=>{
    this.props.dispatch({
      type:"meetingReset/handleTopicContent",
      value: e.target.value
    })
  };
  //上会材料表格
  columns = [
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '文件名称',
      dataIndex: 'upload_name',
      width: '40%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '操作',
      dataIndex: '',
      width: '22%',
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="small"
              onClick={(e) => this.downloadUpload(e,record)}
            >下载
            </Button>
            &nbsp;&nbsp;
            <Popconfirm
              title="确定进行通过操作吗?"
              onConfirm={(e) => this.deleteAddMeetingAll(e,record)}
            >
              <Button type="primary"  size="small">{'删除'}</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  //佐证表格
  materialColumns = [
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '文件名称',
      dataIndex:'upload_name',
      width: '40%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '操作',
      dataIndex: '',
      width: '22%',
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="small"
              onClick={(e) => this.downloadColumns(e,record)}
            >下载
            </Button>
            &nbsp;&nbsp;
            <Popconfirm
              title="确定进行通过操作吗?"
              onConfirm={(e) => this.deleteAddMeeting(e,record)}
            >
              <Button type="primary"  size="small">{'删除'}</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  //上会材料-下载
  downloadUpload=(e,record)=>{
    let url =record.RelativePath;
    window.open(url);
  };
  //上会材料-删除
  deleteAddMeetingAll=(e,record)=>{
    this.props.dispatch({
      type:'meetingReset/deleteAddMeetingAll',
      record:record
    })
  };
  //佐证材料-下载
  downloadColumns=(e,record)=>{
    console.log(record);
    let url =record.RelativePath;
    window.open(url);
  };
  //佐证材料-删除
  deleteAddMeeting =(e,record)=>{
    this.props.dispatch({
      type:'meetingReset/deleteAddMeeting',
      record:record
    })
  };
  //点击弹出选择列席部门的框框
  handlePartDeptModal = ()=>{
    this.props.dispatch({
      type:'meetingReset/handlePartDeptModal',
    })
  };
//点击取消列席弹出框
  handlePartDeptCancel = ()=>{
    this.props.dispatch({
      type:'meetingReset/handlePartDeptCancel',
    })
  };
  //上会材料是否涉密
  SecretChange=(e)=>{
    this.props.dispatch({
      type: 'meetingReset/SecretChange',
      value: e.target.value
    })
  };
//选择列席部门
  handlePartDeptOk =()=>{
    this.props.dispatch({
      type:'meetingReset/handlePartDeptOk',
    })
  };
  //上会材料泄密说明
  secretReasonContent=(e)=>{
    this.props.dispatch({
      type: 'meetingReset/secretReasonContent',
      value: e.target.value
    })
  };
  //点击保存
  saveTopic = ()=>{
    this.props.dispatch({
      type:'meetingReset/saveTopic'
    })
  };
  //点击取消  返回上一级
  cancelTopic = ()=>{
    this.props.dispatch(routerRedux.push({
      pathname:'adminApp/meetManage/meetingConfirm',
    }));
    this.props.dispatch({
      type:'meetingReset/cancelTopic'
    })
  };
  render() {
    const artyCommittee =(
      <div>
        <div style={{marginTop:'20px'}}>
          <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
            是否属三重一大
          </span>
          <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
          <span style={{width:'570px',marginLeft:'10px'}}>
            {this.props.topicImportant ==='0'?'否':'是'}
          </span>
        </div>
        {
          this.props.topicImportant ==='1'?
            <div>
              <div style={{marginTop:'20px'}}>
              <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                三重一大原因
              </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                <span style={{width:'570px',marginLeft:'10px'}}>{this.props.importantReason}</span>
              </div>
              <div style={{marginTop:'20px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right',float:'left'}}>
                  佐证材料
                </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left',float:'left',marginRight:'20px'}}>:</span>
                <Upload {...this.state.uploadFileAll} showUploadList= {false} accept=".doc,.txt,.pdf">
                  <Button type="primary">上传</Button>
                  <i style={{color:"red",marginLeft:'15px'}}>推荐pdf、不能上传压缩包</i>
                </Upload>
                <Table
                  columns={ this.materialColumns }
                  loading={ this.props.loading }
                  dataSource={ this.props.tableMaterial}
                  className={ styles.tableStyle }
                  pagination = { false }
                  style={{marginTop:'10px'}}
                  bordered={ true }
                />
              </div>
            </div>
            :
            null
        }
      </div>
    );
    //总经理办公会
    const  artyManagere = (
      <div>
        <div style={{marginTop:'20px'}}>
          <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
            是否属三重一大
          </span>
          <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
          <span style={{width:'570px',marginLeft:'10px'}}>
            {this.props.topicImportant ==='0'?'否':'是'}
          </span>
        </div>
        {
          this.props.topicImportant ==='1'?
            <div>
              <div style={{marginTop:'20px'}}>
                <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                  三重一大原因
                </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                <span style={{width:'570px',marginLeft:'10px'}}>{this.props.importantReason}</span>
              </div>
              <div style={{marginTop:'20px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right',float:'left'}}>
                  <b style={{color:"red",marginRight:'5px'}}>*</b>
                   佐证材料
                </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left',float:'left',marginRight:'20px'}}>:</span>
                <Upload {...this.state.uploadFileAll} showUploadList= {false} accept=".doc,.txt,.pdf">
                  <Button type="primary">上传</Button>
                  <i style={{color:"red",marginLeft:'15px'}}>推荐pdf、不能上传压缩包</i>
                </Upload>
                <Table
                  columns={ this.materialColumns }
                  loading={ this.props.loading }
                  dataSource={ this.props.tableMaterial }
                  className={ styles.tableStyle }
                  pagination = { false }
                  style={{marginTop:'10px'}}
                  bordered={ true }
                />
              </div>
            </div>
            :
            null
        }
        <div style={{marginTop:'20px'}}>
          <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
            是否需党委会前置讨论
          </span>
          <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
          <span style={{width:'570px',marginLeft:'10px'}}>
             {this.props.topicIfStudy ==='0'?'否':'是'}
          </span>
        {this.props.topicIfStudy === '1' ?
          <span>
            <span style={{float: 'right', marginRight: '10%'}}>
              前置讨论相关议题：
              <span style={{width: '35px'}}>{this.props.topicStudyId}</span>
             </span>
          </span>
          :null
        }
        </div>
      </div>
    );
    return(
      <div style={{background: '#fff',borderRadius: '6px', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
        <div style={{ padding: '8px',margin:'0 auto',width:'800px',}}>
          <div style={{fontSize:'22px',color:'#999',textAlign:'center'}}>
            修改填报议题
          </div>
          <div style={{marginTop:'20px'}}>
            <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
              <b style={{color:"red",marginRight:'5px'}}>*</b>
              议题名称
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
            <Input style={{width:'570px',marginLeft:'10px'}} value={this.props.topicName} onChange={this.handleTopicName}/>
          </div>
          <div style={{marginTop:'20px'}}>
           <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
              申请单位
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
            <span style={{width:'570px',marginLeft:'10px'}}>
              {this.props.topicLevel === '0' ?'院级':'分院级'}
            </span>
          </div>
          <div style={{marginTop:'20px'}}>
           <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
              汇报人
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
            <span style={{width:'570px',marginLeft:'10px'}}>{this.props.topicUserName}</span>
          </div>
          <div style={{marginTop:'20px'}}>
           <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
              汇报单位
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
            <span style={{width:'570px',marginLeft:'10px',display:'inline-flex',}}>
              {
                this.props.deptName.replace(/[,，]/g,"\r\n")
              }
            </span>
          </div>
          <div style={{marginTop:'20px'}}>
            <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
              会议类型
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
            <span style={{minWidth:'300px'}}>{this.props.meetingTypeReset}</span>
            <span style={{float:'right',marginRight:'10%'}}>
                预计汇报时间：
              <span  style={{width:'35px'}}>{this.props.writeMinute}</span>分钟
            </span>
          </div>
          {this.props.meetingTypeReset ==='总经理办公会'? artyManagere : artyCommittee}
          <div style={{marginTop:'10px'}}>
            <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                列席部门
             </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
            <TextArea style={{width:'570px',marginLeft:'10px'}} value={this.props.outInputs} autosize onClick={this.handlePartDeptModal}/>
            <Modal
              title="请重新选择您的列席部门"
              visible={ this.props.partdeptVisible }
              onCancel = { this.handlePartDeptCancel}
              width={'1000px'}
              onOk={this.handlePartDeptOk}
            >
              <div>
                <MeetingOutReset  deptId={this.props.deptId}/>
              </div>
            </Modal>
          </div>
          <div style={{marginTop:'20px'}}>
            <span style={{display:'inline-block', width:'160px',textAlign: 'right',float:'left'}}>
             待决议事项
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',float:'left',marginRight:'20px'}}>:</span>
            <span style={{marginRight:'15px'}}>
              <Input style={{width:'570px'}} value={this.props.topicContent} onChange={this.handleTopicContent}/>
            </span>
          </div>
          <div style={{marginTop:'20px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right',float:'left'}}>
             紧急程度
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',float:'left',marginRight:'20px'}}>:</span>
            <span style={{marginRight:'15px'}}>
              {this.props.topicUrgent === '0'?'一般':'紧急'}
            </span>
          </div>
          {this.props.topicUrgent === '1'?
            <div style={{marginTop:'20px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right',float:'left'}}>
             紧急原因及拟上会时间
             </span>
              <span style={{display:'inline-block', width:'10px',textAlign: 'left',float:'left',marginRight:'20px'}}>:</span>
              <span style={{marginRight:'15px'}}>
               {this.props.urgentReason}
              </span>
            </div>
            :null
          }
          <div style={{marginTop:'20px'}}>
            <span style={{display:'inline-block', width:'160px',textAlign: 'right',float:'left'}}>
              <b style={{color:"red",marginRight:'5px'}}>*</b>
             上会材料是否涉密
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',float:'left',marginRight:'20px'}}>:</span>
            <span style={{marginRight:'15px'}}>
              <RadioGroup onChange={this.SecretChange}  value={this.props.topicSecret} defaultValue={this.props.topicSecret} >
                  <Radio value='1'>是</Radio>
                  <Radio value='0'>否</Radio>
              </RadioGroup>
            </span>
          </div>
          {this.props.topicSecret ==='0'?
            <div style={{marginTop:'20px'}}>
               <span style={{display:'inline-block', width:'160px',textAlign: 'right',float:'left'}}>
                 <b style={{color:"red",marginRight:'5px'}}>*</b>
                 上会材料
              </span>
              <span style={{display:'inline-block', width:'10px',textAlign: 'left',float:'left',marginRight:'20px'}}>:</span>
              <Upload {...this.state.uploadFile} showUploadList= {false} accept=".doc,.txt,.pdf">
                <Button type="primary">上传</Button>
                <i style={{color:"red",marginLeft:'15px'}}>推荐pdf、不能上传压缩包</i>
              </Upload>
              <Table
                columns={ this.columns }
                loading={ this.props.loading }
                dataSource={ this.props.tableUploadFile }
                className={ styles.tableStyle }
                pagination = { false }
                style={{marginTop:'10px'}}
                bordered={ true }
              />
            </div>
            :
            <div style={{marginTop:'20px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right',float:'left'}}>
            上会材料泄密说明
            </span>
              <span style={{display:'inline-block', width:'10px',textAlign: 'left',float:'left',marginRight:'20px'}}>:</span>
              <span style={{marginRight:'15px'}}>
                <Input style={{width:'570px'}} value={this.props.secretReason} onChange={this.secretReasonContent}/>
              </span>
            </div>
          }
          <div style={{width:'170px',height:'20px',margin:'20px auto'}}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" style={{float:'left',display:this.props.buttonDisplay}} onClick={this.saveTopic}>保存</Button>
              <Button type="primary" style={{float:'right'}} onClick={this.cancelTopic}>取消</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function meetingReset (state) {
  return {
    loading: state.loading.models.meetingReset,
    ...state.meetingReset
  };
}
export default connect(meetingReset)(MeetingReset);