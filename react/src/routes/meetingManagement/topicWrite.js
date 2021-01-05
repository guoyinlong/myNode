/**
 * 作者：贾茹
 * 日期：2020-2-13
 * 邮箱：m18311475903@163.com
 * 功能：议题申请页面
 */
import React from 'react';
import {connect } from 'dva'
import { Table, Button, Select,Input,Icon, Radio, message, Modal,Tooltip, Popconfirm} from "antd";
import styles from './meetingTable.less';
import DeptRadioGroup from './deptModal.js';
import FileUpload from './import.js';        //上传上会文件功能组件
import EvidenceFileUpload from './evidenceFile.js';        //上传上会文件功能组件
import PartDept from './partDept.js';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option, OptGroup } = Select;



class TopicWrite extends React.Component{
  state = {
    isUploadingFile: false, // 是否正在上传文件

  };

//预计填报时间
  handleMinute =(e)=>{

    this.props.dispatch({
      type:"topicWrite/handleMinute",
      value: e.target.value
    })


  };

  //议题名称
  handleTopicName =(e)=>{
    this.props.dispatch({
      type:"topicWrite/handleTopicName",
      value: e.target.value
    })
  };

  //获取会议类型id
  getMeetingTypeId = (value)=>{
   /* console.log(value);*/
    this.props.dispatch({
      type:"topicWrite/handleMeetingTypeId",
      value:value
    })
  };

  //三重一大原因传递
  saveSeletedReason = (value)=>{
    /* console.log(value);*/
    this.props.dispatch({
      type:"topicWrite/saveSeletedReason",
      record:value
    })
  };

  //获取汇报人下拉框数据
  displayApplyPerson = (item)=>{
    this.props.dispatch({
      type:"topicWrite/displayApplyPerson",
      item:item
    })
  };

  //三重一大单选框
  onRadioChange = (e)=>{
    this.props.dispatch({
      type:"topicWrite/onRadioChange",
      value: e.target.value
    })
  };

  //三重一大原因：
  handleReasonChange =(e)=>{
    this.props.dispatch({
      type: 'topicWrite/handleReasonChange',
      value: e.target.value
    })
  };

  //前置讨论事项单选框
  onDiscussChange = (e)=>{
    this.props.dispatch({
      type:"topicWrite/onDiscussChange",
      value: e.target.value
    })
  };

  //属于前置讨论事项原因：
  handleDiscussChange =(e)=>{
    this.props.dispatch({
      type: 'topicWrite/handleDiscussChange',
      value: e.target.value
    })
  };

  //填写前置弹框内容
  handleMeetingTopicName = (e)=>{
    this.props.dispatch({
      type: 'topicWrite/handleMeetingTopicName',
      value: e.target.value
    })
  };

  handleMeetingMeetingName = (e)=>{
    this.props.dispatch({
      type: 'topicWrite/handleMeetingMeetingName',
      value: e.target.value
    })
  };

  handleOutMeetingMeetingNameName = (e)=>{
    this.props.dispatch({
      type: 'topicWrite/handleOutMeetingMeetingNameName',
      value: e.target.value
    })
  };
  //待决议事项内容
  handleWaitChange =(e)=>{
    this.props.dispatch({
      type: 'topicWrite/handleWaitChange',
      value: e.target.value
    })
  };

  //是否已征求各部门意见
  onDeptChange= (e)=>{
    this.props.dispatch({
      type:"topicWrite/onDeptChange",
      value: e.target.value
    })
  };

  //上会材料泄密原因说明
  handleMeetingChange = (e)=>{

    this.props.dispatch({
      type:"topicWrite/handleMeetingChange",
      value: e.target.value
    })
  };

  //待决议事项内容
  onMeetingChange =(e)=>{
    this.props.dispatch({
      type: 'topicWrite/onMeetingChange',
      value: e.target.value
    })
  };

  //人员不在模块点击显示弹出框
  showPersonModal = ()=>{
    this.props.dispatch({
      type:'topicWrite/showPersonModal',
    })
  };


  //人员不在模块点击显示弹出框点击取消
  handlePersonCancel = ()=>{
    this.props.dispatch({
      type:'topicWrite/handlePersonCancel',
    })
  };

//点击弹出选择申请单位的框框
  handleDeptModal = ()=>{
    this.props.dispatch({
      type:'topicWrite/handleDeptModal',
    })
  };

//点击弹出选择列席部门的框框
  handlePartDeptModal = ()=>{
    this.props.dispatch({
      type:'topicWrite/handlePartDeptModal',
    })
  };

  //点击取消申请单位弹出框
  handleDeptCancel = ()=>{
    this.props.dispatch({
      type:'topicWrite/handleDeptCancel',
    })
  };

  //点击取消列席弹出框
  handlePartDeptCancel = ()=>{
    this.props.dispatch({
      type:'topicWrite/handlePartDeptCancel',
    })
  };
  evidenceColumns = [
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      key:'index',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '文件名称',
      dataIndex: 'upload_name',
      key:'key',
      width: '40%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '操作',
      dataIndex: '',
      key:'opration',
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
             /* onConfirm={(e) => this.deleteUpload(e,record)}*/
              onConfirm={(e)=>this.returnModel('deleteEvidenceFile',record)}
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

  columns = [
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      key:'index',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '文件名称',
      dataIndex: 'upload_name',
      key:'key',
      width: '40%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '操作',
      dataIndex: '',
      key:'opration',
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
      console.log(selectedRowKeys);
      this.props.dispatch({
        type:'topicWrite/outPersonChecked',
        value:selectedRows
      })
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  //前置弹出框table所需
  meetingRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      /*console.log(selectedRows);*/
      this.props.dispatch({
        type:'topicWrite/meetingTypeStudyChecked',
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

  //人员不在下拉框
  handleOutSearchPerson=(e)=>{
    this.props.dispatch({
      type:'topicWrite/handleOutSearchPerson',
      value:e.target.value
    })
  };

  //人员不在下拉框弹出框点击确定
  handlePersonOk = ()=>{
    /*console.log('aaa');*/
    this.props.dispatch({
      type:'topicWrite/handlePersonOk',
    })
  };

  //选择申请单位部门
  handleDeptOk =()=>{
    this.props.dispatch({
      type:'topicWrite/handleDeptOk',
    })
  };

  //选择列席部门
  handlePartDeptOk =()=>{
    this.props.dispatch({
      type:'topicWrite/handlePartDeptOk',
    })
  };

//议题填报点击保存
  saveTopic = ()=>{
    this.props.dispatch({
      type:'topicWrite/saveTopic'
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
    if(this.props.writeMinute>30){
      message.info('汇报时间不可大于30分钟')
    }else{
      this.props.dispatch({
        type:'topicWrite/submissionTopic'
      })

    }

  };

  //点击删除附件
  deleteUpload= (e,record)=>{
    /*console.log(record);*/
    this.props.dispatch({
      type:'topicWrite/deleteUpload',
      record:record
    })
  };

  //点击下载附件
  downloadUpload = (e,record) =>{
    let url =record.RelativePath;
    window.open(url);
  };

  //前置相关议题点击清空
  meetingStudyClear = ()=>{
    this.props.dispatch({
      type:'topicWrite/meetingStudyClear',
    })
  };

  //点击查询前置相关议题的名称
  getTopicMeetingName =()=>{
    this.props.dispatch({
      type:'topicWrite/getTopicMeetingName',
    })
  };

  //点击前置相关议题modal确定
  discussModalDisplayOk=()=>{
    this.props.dispatch({
      type:'topicWrite/okStudyModal',
    })
  };

  //点击前置相关议题modal取消
  discussModalDisplayCancel=()=>{
    this.props.dispatch({
      type:'topicWrite/cancelStudyModal',
    })
  };

  //点击查询搜索人员
  searPerson=()=>{
    this.props.dispatch({
      type:'topicWrite/searchOutPerson',
    })
  };

  cancelTopic=()=>{
    this.props.dispatch({
      type:'topicWrite/cancelTopic',
    })
  };


  //点击弹出相关议题modal
  openModal =()=>{
    this.props.dispatch({
      type:'topicWrite/openModal',
    })
  };

  //确定修改是否涉密选项
  seceretIsOk = ()=>{
    this.props.dispatch({
      type:'topicWrite/seceretIsOk',
    })
  };

  //取消修改涉密选项
  seceretIsCancel = ()=>{
    this.props.dispatch({
      type:'topicWrite/seceretIsCancel',
    })
  };

  //是否涉密点击否弹出删除原因的框框
  deleteSecretReason = ()=>{
    this.props.dispatch({
      type:'topicWrite/deleteSecretReason',
    })
  };


  //打开三重一大参考文件
  openImpontant=()=>{
      window.open(this.props.srarchImportant.upload_real_url)
  };

  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'topicWrite/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'topicWrite/'+value,
      })
    }

  };


  render() {
    console.log(this.props.isUrgent,typeof this.props.isUrgent);
    return (
      <div style={{background: '#fff',borderRadius: '6px', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
        <div style={{ padding: '8px',margin:'0 auto',width:'800px',}}>
          <div style={{fontSize:'22px',color:'#999',textAlign:'center',marginTop:'20px'}}>
            议题填报
          </div>

          <div style={{marginTop:'20px'}}>
              <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                议题名称
              </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
            <TextArea style={{width:'570px',marginLeft:'10px'}} value={this.props.topicName} autosize onChange={e =>this.handleTopicName(e)}/>
          </div>
          <div style={{marginTop:'15px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                申请单位
             </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
            <RadioGroup onChange={(e)=>this.returnModel('isDept',e)} value={this.props.isDept}>
              <Radio value={1}>分院级</Radio>
              <Radio value={0}>院级</Radio>
            </RadioGroup>
          </div>
          <div style={{marginTop:'10px'}}>
              <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                汇报单位
              </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
            <TextArea style={{width:'570px',marginLeft:'10px'}} value={this.props.Dept.join('    ')} autosize onClick={this.handleDeptModal}/>
            {/*<Icon type="close-circle" style={{marginLeft:'10px',color:'#ccc'}} onClick={this.iconClear}/>*/}
            <Modal
              title="选择部门"
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
                 <i style={{color:'red',fontSize:'12px',cursor:'pointer'}} onClick={this.showPersonModal}>人员不在其中请选择</i>
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
            <Select style={{minWidth:'300px'}} onChange={this.getMeetingTypeId}>
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
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
            <a onClick={this.openImpontant}>{ this.props.srarchImportant.upload_name }  </a>（参考文件）
          </div>
          <div style={{marginTop:'10px',display: this.props.resonDisplay }} >
            <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
               <b style={{color:"red",marginRight:'5px'}}>*</b>
               三重一大的原因
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
            <Select style={{width:'500px',marginLeft:'10px'}} value={this.props.reasonSelected.reason_name} onChange={this.saveSeletedReason} allowClear={ true }>
              {this.props.importantReason.map((item,index)=>
                  <Option value={JSON.stringify(item)} key={JSON.stringify(item)} title={item.reason_name}>{item.reason_name}</Option>
              )}
            </Select>
          </div>
          {
            this.props.radioValue === 1?
              <div style={{marginTop:'10px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                  <b style={{color:"red",marginRight:'5px'}}>*</b>
                  佐证材料
                 </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                <EvidenceFileUpload dispatch={this.props.dispatch} passFuc = {this.saveData}/>

                <Table
                  columns={ this.evidenceColumns  }
                  loading={ this.props.loading }
                  dataSource={ this.props.evidenceFile }
                  className={ styles.tableStyle }
                  pagination = { false }
                  style={{marginTop:'10px'}}
                  bordered={ true }
                />
              </div>
              :
              null
          }
          {
            this.props.meetingTypeName === "总经理办公会"?
              <div style={{marginTop:'15px'}}>
                <span style={{ width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    是否需党委会前置讨论
                </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                <RadioGroup onChange={this.onDiscussChange} value={this.props.discussRadioValue}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              </div>
              :
              null
          }

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
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
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
                议题名称：<Input style={{borderRadius:'5px',width:'170px'}} value={this.props.meetingTopicName} onChange={this.handleMeetingTopicName} />
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
            <TextArea style={{width:'570px',marginLeft:'10px'}} value={this.props.outDept.join('   ')} autosize onClick={this.handlePartDeptModal}/>
            {/*<Icon type="close-circle" style={{marginLeft:'10px',color:'#ccc'}} onClick={this.iconOutClear}/>*/}
            <Modal
              title="选择部门 (建议选择不超过5个列席部门)"
              visible={ this.props.partdeptVisible }
              onCancel = { this.handlePartDeptCancel}
              width={'1000px'}
              onOk={this.handlePartDeptOk}
            >
              <div>
                <PartDept deptId={this.props.deptId}/>
              </div>
            </Modal>
          </div>
          <div style={{marginTop:'20px'}}>
            <span style={{display:'inline-block', width:'160px',textAlign: 'right',float:'left'}}>
                待决议事项
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px',float:'left'}}>:</span>
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
                紧急程度
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
            <RadioGroup onChange={(e)=>this.returnModel('isUrgent',e)} value={this.props.isUrgent}>
              <Radio value={1}>紧急</Radio>
              <Radio value={0}>一般</Radio>
            </RadioGroup>
          </div>
          {
            this.props.isUrgent=== 1?
              <div style={{marginTop:'10px'}} >
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    紧急原因及拟上会时间
                </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                <Input style={{width:'500px'}} value={this.props.urgentReason} onChange={(e)=>this.returnModel('urgentReason',e)}/>
              </div>
              :
              null
          }
          <div style={{marginTop:'15px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                上会材料是否涉密
            </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
            <RadioGroup onChange={this.onMeetingChange} value={this.props.meetingRadioValue}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
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
              <Button type="primary" style={{float:'left'}} onClick={this.saveTopic}>保存</Button>
              <Button type="primary" style={{marginLeft:'30px'}} onClick={this.submissionTopic}>提交</Button>
              <Button type="primary" style={{float:'right'}} onClick={this.cancelTopic}>取消</Button>
            </div>
          </div>
        </div>

      </div>

    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.topicWrite,
    ...state.topicWrite
  };
}
export default connect(mapStateToProps)(TopicWrite);
