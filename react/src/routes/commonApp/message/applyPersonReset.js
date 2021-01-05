/**
 * 作者：贾茹
 * 日期：2019-6-21
 * 邮箱：m18311475903@163.com
 * 功能：归档申请人修改议题详情
 */

import React from 'react';
import {connect } from 'dva'
import { Table, Tabs, Button, Select,Input,Icon, Radio, Tooltip, Modal, Popconfirm} from "antd";
import styles from '../../../routes/meetingManagement/meetingTable.less';
import FileUpload from './import.js';        //上传功能组件
import DeptRadioGroup from './deptModal.js';
import PartDept from './partDept.js';
import cookie from 'js-cookie';

import {routerRedux} from "dva/router";
const { TabPane } = Tabs;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option, OptGroup } = Select;



class ApplyPersonReset extends React.Component{
  state = {
    isUploadingFile: false, // 是否正在上传文件

  };

  /*componentDidMount=()=>{
    const info = this.props.location.state.recordValue;
    console.log(info);
  };*/

//预计填报时间
  handleMinute =(e)=>{
    this.props.dispatch({
      type:"applyPersonReset/handleMinute",
      value: e.target.value
    })
  };

  //议题名称
  handleTopicName =(e)=>{
    this.props.dispatch({
      type:"applyPersonReset/handleTopicName",
      value: e.target.value
    })
  };

  //获取会议类型id
  getMeetingTypeId = (i)=>{
    this.props.dispatch({
      type:"applyPersonReset/handleMeetingTypeId",
      i:i
    })
  };


  //获取汇报人下拉框数据
  displayApplyPerson = (item)=>{
    /*console.log(item);*/
    this.props.dispatch({
      type:"applyPersonReset/displayApplyPerson",
      item:item
    })
  };

  //三重一大单选框
  onRadioChange = (e)=>{
    // console.log(e.target.value);
    this.props.dispatch({
      type:"applyPersonReset/onRadioChange",
      value: e.target.value
    })
  };

  //三重一大原因：
  handleReasonChange =(e)=>{
    this.props.dispatch({
      type: 'applyPersonReset/handleReasonChange',
      value: e.target.value
    })
  };

  //前置讨论事项单选框
  onDiscussChange = (e)=>{
    this.props.dispatch({
      type:'applyPersonReset/onDiscussChange',
      value: e.target.value
    })
  };

  //属于前置讨论事项原因：
  handleDiscussChange =(e)=>{
    this.props.dispatch({
      type: 'applyPersonReset/handleDiscussChange',
      value: e.target.value
    })
  };

  //填写前置弹框内容
  handleMeetingTopicName = (e)=>{
    this.props.dispatch({
      type: 'applyPersonReset/handleMeetingTopicName',
      value: e.target.value
    })
  };

  handleMeetingMeetingName = (e)=>{
    this.props.dispatch({
      type: 'applyPersonReset/handleMeetingMeetingName',
      value: e.target.value
    })
  };

  //点击查询前置相关议题的名称
  getTopicMeetingName =()=>{
    this.props.dispatch({
      type:'applyPersonReset/getTopicMeetingName',
    })
  };

  //前置相关议题点击清空
  meetingStudyClear = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/meetingStudyClear',
    })
  };

  //点击前置相关议题modal确定
  discussModalDisplayOk=()=>{
    this.props.dispatch({
      type:'applyPersonReset/okStudyModal',
    })
  };
  //前置弹出框table所需
  meetingRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      /*console.log(selectedRows);*/
      this.props.dispatch({
        type:'applyPersonReset/meetingTypeStudyChecked',
        value:selectedRows
      })
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  //总经理办公会需显示的议题与会议查询
  meetingTypecolumns =[
    {
      title: '会议名称',
      dataIndex: 'note_name',
      width: '200px',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },{
      title: '议题名称',
      dataIndex: 'topic_name',
      width:'150px',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }
  ];

  //点击前置相关议题modal取消
  discussModalDisplayCancel=()=>{
    this.props.dispatch({
      type:'applyPersonReset/cancelStudyModal',
    })
  };

  handleOutMeetingMeetingNameName = (e)=>{
    this.props.dispatch({
      type: 'applyPersonReset/handleOutMeetingMeetingNameName',
      value: e.target.value
    })
  };

  //待决议事项内容
  handleWaitChange =(e)=>{
    this.props.dispatch({
      type: 'applyPersonReset/handleWaitChange',
      value: e.target.value
    })
  };

  //是否已征求各部门意见
  onDeptChange= (e)=>{
    this.props.dispatch({
      type:"applyPersonReset/onDeptChange",
      value: e.target.value
    })
  };

  //上会材料泄密原因说明
  handleMeetingChange = (e)=>{

    this.props.dispatch({
      type:"applyPersonReset/handleMeetingChange",
      value: e.target.value
    })
  };

  //上会材料是否涉密
  onMeetingChange =(e)=>{

    this.props.dispatch({
      type: 'applyPersonReset/onMeetingChange',
      value: e.target.value
    })
  };


  //人员不在模块点击显示弹出框
  showPersonModal = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/showPersonModal',
    })
  };


  //人员不在下拉框弹出框点击确定
  handlePersonOk = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/handlePersonOk',
    })
  };

  //人员不在模块点击显示弹出框点击取消
  handlePersonCancel = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/handlePersonCancel',
    })
  };

//点击弹出选择申请单位的框框
  handleDeptModal = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/handleDeptModal',
    })
  };

//点击弹出选择列席部门的框框
  handlePartDeptModal = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/handlePartDeptModal',
    })
  };

  //点击取消申请单位弹出框
  handleDeptCancel = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/handleDeptCancel',
    })
  };

  //点击取消列席弹出框
  handlePartDeptCancel = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/handlePartDeptCancel',
    })
  };

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
              title="确定删除该文件吗?"
              onConfirm={(e) => this.deleteUpload(e,record)}
            >
              <Button
                type="primary"
                size="small"
              >
                删除
              </Button>
            </Popconfirm>


          </div>
        );
      },
    }, ];

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      /*console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);*/
      this.props.dispatch({
        type:'applyPersonReset/outPersonChecked',
        value:selectedRows
      })
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  //人员不在请选择
  outPersonColumns=[
    {
      title: '员工编号',
      dataIndex: 'userid',
      width: '200px',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },{
      title: '姓名',
      dataIndex: 'username',
      width:'150px',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '部门',
      dataIndex: 'deptname',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },
  ];

  //人员不在下拉框
  handleOutSearchPerson=(e)=>{
    this.props.dispatch({
      type:'applyPersonReset/handleOutSearchPerson',
      value:e.target.value
    })
  };

  //选择申请单位部门
  handleDeptOk =()=>{
    this.props.dispatch({
      type:'applyPersonReset/handleDeptOk',
    })
  };

  //选择列席部门
  handlePartDeptOk =()=>{
    this.props.dispatch({
      type:'applyPersonReset/handlePartDeptOk',
    })
  };

  //上传需要
  saveData = (values) => {
    this.setState({
      showData:values,
      importDataLength:values.length,
    })
  };

  //点击提交
  submissionTopic = ()=>{
/*    this.props.dispatch(routerRedux.push({
      pathname:'/taskList',
    }));*/
    this.props.dispatch({
      type:'applyPersonReset/resetSubmissionTopic'
    })
  };

  //点击取消  返回上一级
  cancelTopic = ()=>{
    this.props.dispatch(routerRedux.push({
      pathname:'/taskList',
    }));
  };

  //点击删除附件
  deleteUpload= (e,record)=>{
    /*console.log(record);*/
    if(record.upload_id){
      this.props.dispatch({
        type:'applyPersonReset/deleteUpload',
        record:record
      })
    }else{
      this.props.dispatch({
        type:'applyPersonReset/localDeleteUpload',
        record:record
      })
    }
  };

  //点击下载附件
  downloadUpload = (e,record) =>{
    if(record.upload_id){
      let url =record.upload_url;
      window.open(url);
    }else{
      let url =record.RelativePath;
      window.open(url);
    }
  };

  //审批的table   columns
  judgecolumns=[
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '状态',
      dataIndex: 'state_desc',
      width: '8%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '环节名称',
      dataIndex: 'Approval_link',
      width: '18%',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批人',
      dataIndex: 'list_receive_name',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批类型',
      dataIndex: 'topic_check_state_desc',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批意见',
      dataIndex: 'approval_opinions',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批时间',
      dataIndex: 'update_date',
      width: '12%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },
  ];

  //点击查询搜索人员
  searPerson=()=>{
    this.props.dispatch({
      type:'applyPersonReset/searchOutPerson',
    })
  };

  //点击返回返回待办页面
  return = ()=>{
    this.props. dispatch(routerRedux.push({
      pathname:'/taskList'
    }));
  };

  //申请单位后面点击icon



  //点击弹出相关议题modal
  openModal =()=>{
    this.props.dispatch({
      type:'applyPersonReset/openModal',
    })
  };

  //确定修改是否涉密选项
  seceretIsOk = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/seceretIsOk',
    })
  };

  //取消修改涉密选项
  seceretIsCancel = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/seceretIsCancel',
    })
  };

  //是否涉密点击否弹出删除原因的框框
  deleteSecretReason = ()=>{
    this.props.dispatch({
      type:'applyPersonReset/deleteSecretReason',
    })
  };

  render() {

    /* console.log(this.props.Dept);*/
    /* console.log(info);*/
    /* console.log(this.props.deptInputs);*/
    /*console.log(this.props.radioValue);*/
    console.log(this.props.tableUploadFile);
    /* console.log(this.props.topicName);*/
/*    console.log(this.props.meetingRadioValue);
    console.log(typeof this.props.meetingRadioValue);*/
    return (
      <div style={{background: '#fff',borderRadius: '6px', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',paddingTop:'10px'}}>
        <div style={{margin:'20px auto',width:'800px',textAlign:'center',fontSize:'20px',color:'#777',}}>
          {this.props.addData.topic_name}
        </div>

        <div style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'14px',marginTop:'10px'}}>
          <span style={{marginRight:'20px'}}>
            上一环节：
            {
              this.props.addData.topic_last_state==='0'?
                <span>申请人提交</span>
                :
                this.props.addData.topic_last_state==='-1'?
                  <span>申请人提交</span>
                :
                this.props.addData.topic_last_state!=='0'&& this.props.addData.topic_last_state!== '-1'?
                  <span>{this.props.addData.topic_last_state_desc}</span>
                :
                null
            }
          </span>
          <span>
            当前环节：
            {this.props.addData.topic_check_link
            }
          </span>
        </div>
        <div>
          <Button type="primary" style={{float:'right',marginRight:'50px'}} onClick={this.return}>返回</Button>
          <div style={{clear:'both'}}></div>
        </div>
        <div style={{ padding: '8px',margin:'0 auto'}}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="议题详情" key="1">
              <div style={{margin:'0 auto',width:'900px'}}>
                <div style={{marginTop:'20px',width:'900px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                  <b style={{color:"red",marginRight:'5px'}}>*</b>
                  议题名称
                </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                <Input style={{width:'570px',marginLeft:'10px'}} value={this.props.topicName} onChange={this.handleTopicName}/>
              </div>
                <div style={{marginTop:'10px'}}>
                <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                  <b style={{color:"red",marginRight:'5px'}}>*</b>
                  申请单位
                </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                  <TextArea style={{width:'570px',marginLeft:'10px'}} value={this.props.deptInputs} onClick={this.handleDeptModal} autosize/>
                  {/* <Icon type="close-circle" style={{marginLeft:'10px',color:'#ccc'}} onClick={this.iconClear}/>*/}
                  <Modal
                    title="请重新选择您的申请部门"
                    visible={ this.props.deptVisible }
                    onCancel = { this.handleDeptCancel}
                    width={'1000px'}
                    onOk={this.handleDeptOk}
                  >
                    <div>
                      <DeptRadioGroup/>
                    </div>
                  </Modal>

                </div>
                <div style={{marginTop:'10px'}}>
                <span style={{display:'inline-block', width:'160px',textAlign: 'right'}} >
                  <b style={{color:"red",marginRight:'5px'}}>*</b>
                  汇报人
                </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                  <Select style={{width:'300px',marginLeft:'10px'}} value={this.props.applyReset} onChange={this.displayApplyPerson} allowClear={ true } mode='multiple'>
                    {this.props.applyPersons.map((i,index)=>
                      <OptGroup label={i.deptname} key={index}>
                        {JSON.parse(i.deptperson).map((item)=>
                          <Option value={JSON.stringify(item)} key={JSON.stringify(item)}>{item.username}</Option>
                        )}
                      </OptGroup>
                    )}
                  </Select>

                  <span style={{display:'inline-block',width:'270px',marginLeft:'10px'}}>
                    <Icon type="question-circle" style={{color:'#08c',marginRight:'8px'}}/>
                   <i style={{color:'red',fontSize:'12px'}} onClick={this.showPersonModal}>人员不在其中请选择</i>
                   <Modal
                     title="员工查询"
                     visible={ this.props.visible }
                     width={'700px'}
                     onCancel = { this.handlePersonCancel}
                     onOk={this.handlePersonOk}
                   >

                     <Input placeholder="姓名/员工编号/邮箱前缀/手机" value={this.props.outSearchPerson} onChange={this.handleOutSearchPerson} style={{width:'400px',marginRight:'30px'}}/>
                     <Button type="primary" onClick={this.searPerson}>查询</Button>
                     <Table
                       columns={ this.outPersonColumns }
                       loading={ this.props.loading }
                       dataSource={ this.props.outPersonTableSource }
                       className={ styles.tableStyle }
                       pagination = { false }
                       style={{marginTop:'10px'}}
                       bordered={ true }
                       rowSelection={this.rowSelection}
                     />
                   </Modal>
                </span>
                </div>
                <div style={{marginTop:'10px'}}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      会议类型
                   </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <Select style={{minWidth:'300px'}} onChange={this.getMeetingTypeId} value={this.props.meetingTypeReset}>
                    {this.props.meetingTypes.map((i)=><Option key={i.type_name} value={JSON.stringify(i)}>{i.type_name}</Option>)}
                  </Select>
                  <span style={{float:'right',marginRight:'10%'}}>
                     <b style={{color:"red",marginRight:'5px'}}>*</b>
                      预计汇报时间：
                      <Input style={{width:'35px'}} value={this.props.writeMinute} onChange={this.handleMinute}/>分钟
                    <Tooltip title="汇报时间建议不超过15分钟"><Icon type="question-circle" style={{color:'#08c',marginLeft:'8px'}}/></Tooltip>
                  </span>
                </div>
                <div style={{marginTop:'15px'}}>
                       <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                          <b style={{color:"red",marginRight:'5px'}}>*</b>
                          是否属于三重一大
                       </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <RadioGroup onChange={this.onRadioChange} value={this.props.radioValue}>
                    <Radio value={'1'}>是</Radio>
                    <Radio value={'0'}>否</Radio>
                  </RadioGroup>
                </div>
                <div style={{marginTop:'10px',display: this.props.resonDisplay }} >
                       <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                          <b style={{color:"red",marginRight:'5px'}}>*</b>
                          三重一大的原因
                       </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <Input style={{width:'500px'}} value={this.props.resonValue} onChange={this.handleReasonChange}/>
                </div>
                <div style={{marginTop:'15px',display:this.props.noStarDisplay}}>
                       <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                          <b style={{color:"red",marginRight:'5px'}}>*</b>
                          是否属前置讨论事项
                      </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <RadioGroup onChange={this.onDiscussChange} value={this.props.discussRadioValue}>
                    <Radio value={'1'}>是</Radio>
                    <Radio value={'0'}>否</Radio>
                  </RadioGroup>
                </div>
                <div style={{marginTop:'15px',display:this.props.StarDisplay}}>
                  <span style={{ width:'160px',textAlign: 'right',marginLeft:'10px'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      是否需党委会前置讨论
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <RadioGroup onChange={this.onDiscussChange} value={this.props.discussRadioValue}>
                    <Radio value={'1'}>是</Radio>
                    <Radio value={'0'}>否</Radio>
                  </RadioGroup>
                </div>
                <div style={{marginTop:'10px',display: this.props.discussDisplay }} >
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      前置讨论原因
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <Input style={{width:'500px'}} value={this.props.discussValue} onChange={this.handleDiscussChange}/>
                </div>
                <div style={{marginTop:'10px',display: this.props.reletiveDiscussDisplay }} >
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      前置讨论相关议题
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <Input style={{width:'500px'}} value={this.props.discussValue} onClick={this.openModal}/>
                </div>
                <Modal
                  title="* 请关联党委会前置讨论议题"
                  visible={this.props.discussModalDisplayvisible}
                  onOk={this.discussModalDisplayOk}
                  onCancel={this.discussModalDisplayCancel}
                  width={'700px'}
                >
                  <p style={{marginBottom:'40px'}}>
                <span style={{marginRight:'20px'}}>
                  议题名称：<Input style={{borderRadius:'5px',width:'170px'}} value={this.props.meetingTopicName} onChange={this.handleMeetingTopicName}/>
                </span>
                    <span>
                  会议名称：<Input style={{borderRadius:'5px',width:'170px'}} value={this.props.meetingMeetingName} onChange={this.handleMeetingMeetingName}/>
                </span>
                    <span>
                  <Button type="primary" style={{float:'right'}} onClick={this.meetingStudyClear}>清空</Button>
                  <Button type="primary" style={{float:'right',marginRight:'20px'}} onClick={this.getTopicMeetingName}>查询</Button>
                </span>
                  </p>
                  <Table
                    columns={ this.meetingTypecolumns }
                    loading={ this.props.loading }
                    dataSource={ this.props.tableMeetingType }
                    className={ styles.tableStyle }
                    pagination = { false }
                    style={{marginTop:'10px'}}
                    bordered={ true }
                    rowSelection={this.meetingRowSelection}
                  />
                  <p style={{marginTop:'20px'}}>
                <span>
                  其他议题：<Input style={{borderRadius:'5px',width:'300px'}} value={this.props.outMeetingMeetingName} onChange={this.handleOutMeetingMeetingNameName}/>
                </span>
                  </p>
                </Modal>
                <div style={{marginTop:'10px'}}>
                      <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                          <b style={{color:"red",marginRight:'5px'}}>*</b>
                          列席部门
                      </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                  <TextArea style={{width:'570px',marginLeft:'10px'}} value={this.props.outInputs} autosize onClick={this.handlePartDeptModal}/>
                  {/* <Icon type="close-circle" style={{marginLeft:'10px',color:'#ccc'}} onClick={this.iconOutClear}/>*/}
                  <Modal
                    title="请重新选择您的列席部门"
                    visible={ this.props.partdeptVisible }
                    onCancel = { this.handlePartDeptCancel}
                    width={'1000px'}
                    onOk={this.handlePartDeptOk}
                  >
                    <div>
                      <PartDept/>
                    </div>
                  </Modal>
                </div>
                <div style={{marginTop:'20px'}}>
                      <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>

                          待决议事项
                      </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <TextArea
                    autosize={{ minRows: 4, maxRows: 9}}
                    style={{width:'570px',marginRight:'15px'}}
                    placeholder="议题概述"
                    onChange={this.handleWaitChange}
                    value={this.props.textCont}
                  />

                </div>
                <div style={{marginTop:'15px'}}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      是否已征求各部门意见
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <RadioGroup onChange={this.onDeptChange} value={this.props.deptRadioValue}>
                    <Radio value={'1'}>是</Radio>
                    <Radio value={'0'}>否</Radio>
                  </RadioGroup>
                </div>
                <div style={{marginTop:'15px'}}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      上会材料是否涉密
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                  <RadioGroup onChange={this.onMeetingChange} value={this.props.meetingRadioValue}>
                    <Radio value={'1'}>是</Radio>
                    <Radio value={'0'}>否</Radio>
                  </RadioGroup>
                  <Modal
                    title="请问您确认要修改该选项吗？"
                    visible={this.props.seceretIsVisible}
                    onOk={this.seceretIsOk}
                    onCancel={this.seceretIsCancel}
                  >
                    <p>如果继续，您之前提交的上会材料将会被删除</p>
                  </Modal>
                  <Modal
                    title="请问您确认要修改该选项吗？"
                    visible={this.props.NOseceretIsVisible}
                    onOk={this.deleteSecretReason}
                    onCancel={this.seceretIsCancel}
                  >
                    <p>如果继续，您的泄密原因说明将会被删除</p>
                  </Modal>
                </div>
                <div style={{marginTop:'10px',display: this.props.meetingDisplay }} >
                       <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                          <b style={{color:"red",marginRight:'5px'}}>*</b>
                          上会材料泄密说明
                      </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                  <Input style={{width:'500px'}} value={this.props.meetingValue} onChange={this.handleMeetingChange}/>
                </div>
                <div style={{marginTop:'10px',display: this.props.materialsDisplay }}>
                     <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                          <b style={{color:"red",marginRight:'5px'}}>*</b>
                          上会材料
                     </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <FileUpload dispatch={this.props.dispatch} passFuc = {this.saveData}/>

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
                <div style={{width:'250px',margin:'20px auto'}}>
                  <div style={{margin:'0 auto'}}>
                    {/*<Button type="primary" onClick={this.waitNoReset}>无更改</Button>*/}
                    <Button type="primary" style={{marginLeft:'30px'}} onClick={this.submissionTopic}>提交</Button>
                    <Button type="primary" style={{float:'right'}} onClick={this.cancelTopic}>取消</Button>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="审批环节" key="2">
              <Table
                className = { styles.tableStyle }
                dataSource = { this.props.judgeTableSource }
                columns = { this.judgecolumns }
                style = {{ marginTop: "20px" }}
                bordered={true}
                /*pagination={ false }*/
              />
            </TabPane>
          </Tabs>
        </div>

      </div>

    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.applyPersonReset,
    ...state.applyPersonReset
  };
}
export default connect(mapStateToProps)(ApplyPersonReset);
