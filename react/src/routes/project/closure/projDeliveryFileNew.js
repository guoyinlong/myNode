/**
 *  作者: 陈红华
 *  创建日期: 2017-12-01
 *  邮箱：1045825949@qq.com
 *  文件说明：项目结项：项目列表
 */

import React from 'react';
import { Row, Col, Button , Table,Input,Modal,Popconfirm,message,Tooltip,Icon,Spin, Upload, Tag } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import TableStyles from './projTable.less';
import styles from "./proDeliveryFile.less";
import {getUuid} from '../../../components/commonApp/commonAppConst.js';
import { rightControl } from '../../../components/finance/rightControl';
const { TextArea } = Input;
class ProjDeliveryFileNew extends React.Component {
  state={
    reason1:'',
    fileList: [],
    isUploadingFile:false,
    selectedRowKeys:[],
    handle:'',
    fileId:'',
  }

  // 点击确定按钮
  confirmModel=()=>{
    let {record}=this.state;
    let fileList=this.refs.fileuploadComp.getData();
    record[record.fileName].allUrl=[];
    for(let i=0;i<fileList.length;i++){
      record[record.fileName].allUrl.push({
        "file_url":fileList[i].RelativePath,
        "file_name":fileList[i].OriginalFileName,
      })
    }
    if(record[record.fileName].allUrl.length ===0){
      record[record.fileName].allUrl.push({
        "file_url":'',
        "file_name":''
      })
    }

    const {dispatch}=this.props;
    dispatch({
      type:'projDeliveryFileNew/updateData',
      record
    })
    this.setState({ModalVisible:!this.state.ModalVisible});
  }

  // TMO审核是否通过
  projClosingDocumentAudit=(flag)=>{
    const {dispatch}=this.props;
    const {query}=this.props.location;
    dispatch({
      type:'projDeliveryFileNew/projClosingDocumentAudit',
      postData:{
        arg_projId:this.props.location.query.proj_id,
        arg_checkId:Cookie.get('userid'),
        arg_checkName:Cookie.get("username"),
        arg_isPass:flag
      },
      queryData:{
        arg_projType:query.proj_type,
        arg_projId:query.proj_id
      }
    })
  }
  // TMO审核是否通过
  returnReasonCrl=()=>{
    const {dispatch}=this.props;
    let reason=this.state.reason1||'';
    let url = '';
    if (this.state.handle === 'pass'){
      url = 'projDeliveryFileNew/tmoPass';
    }else{
      if(!reason.trim()){
        message.error('请输入退回理由！');
        return
      }
      url = 'projDeliveryFileNew/returnReasonCrl';
    }
    dispatch({
      type:url,
      reason:reason,
    });
    this.setState({ reason1:''});
  };
  // 返回大项目列表页
  goBack=()=>{
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname: 'projectApp/projClosure/projDeliveryList'
    }))
  };
  // 页面初始化查询
  componentDidMount(){
    const {dispatch}=this.props;
    const {query}=this.props.location;
    dispatch({
      type:'projDeliveryFileNew/projDeliveryFileQuery',
      postData:{
        arg_projType:query.proj_type,
        arg_projId:query.proj_id
      }
    })
    dispatch({
      type:'projDeliveryFileNew/pUserhasmodule'
    })
  }
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消
   */
  handleCancel=()=>{
    this.setState({
      visible:false
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框中输入不通过理由
   */
  seasonHandle=(e)=>{console.log(e.target.value);
    this.setState({
      reason1:e.target.value
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框
   */
  showModal=()=>{
    this.setState({
      visible:true,
    })
  };
  //添加同时结项项目，本次不上线
  // openProjectModal =()=>{
  //   console.log('增加结项项目');
  //   const {dispatch}=this.props;
  //   dispatch({
  //     type:'projDeliveryFileNew/changeProjectModal',
  //     flag:'open'
  //   })
  // };
  closeProjectModal =()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'projDeliveryFileNew/changeProjectModal',
      flag:'close'
    });
    this.setState({ selectedRowKeys:[]})
  };
  addTogetherProject =()=>{
    const {dispatch}=this.props;
    const {selectedRowKeys} = this.state;
    if (selectedRowKeys.length>0){
      dispatch({
        type:'projDeliveryFileNew/addTogetherProject',
        selectedRowKeys
      })
    }else{
      this.closeProjectModal();
    }
    this.setState({ selectedRowKeys:[]})
  };
  //4.经费文档部分
  handleBeforUpload = (file, fileList) =>{
    if (fileList.length > 1) {
      message.info('一次最多上传一个文件!');
      fileList.splice(1);
    }
    this.setState({
      isUploadingFile:true,
    });
    //如果文件名称超过 200
    if (file.name.length > 200 ) {
      this.setState({
        isUploadingFile:false,
      });
      message.info('文件名称最大长度为200');
      return false;
    }

    //如果文件大小超过 50兆 = 50 * 1024 * 1024字节
    if (file.name.length > 52428800) {
      this.setState({
        isUploadingFile:false,
      });
      message.info(file.name + ' 不能超过50M!');
      return false;
    }
  };
  /**
   * 作者：杨青
   * 创建日期：2018-07-05
   * 功能：经费文档上传处理
   * @param info 文件信息
   */
  handleChange = (info) => {
    const {fileList } = this.state;
    const status = info.file.status;
    if (status === 'done') {
      if(info.file.response.RetCode === '1'){
        //message.success(`${info.file.name} 上传成功.`);
        const{dispatch} = this.props;
        dispatch({
          type:'projDeliveryFileNew/uploadProjectFile',
          documentId:this.state.fileId,
          file:fileList[0],
          url:info.file.response.filename.RelativePath,
        });
        this.setState({
          isUploadingFile:false
        });
        return true;
      } else if (info.file.response.RetCode === '0') {
        message.error(`${info.file.name} 上传失败.`);
        this.setState({
          isUploadingFile:false
        });
        return false;
      }
    }
  };
  selectTogetherProject =(checkedValues)=>{
    console.log('checkedValues',checkedValues);
    const {dispatch}=this.props;
    dispatch({
      type:'projDeliveryFileNew/changeCheckList',
      checkedValues
    })
  };
  //Tag 浏览器不要执行与事件关联的默认动作
  preventDefault=(e)=>{
    e.preventDefault();
  };
  deleteTogetherProject=(id)=>{console.log('deleteTogetherProject',id);
    const {dispatch}=this.props;
    dispatch({
      type:'projDeliveryFileNew/deleteTogetherProject',
      id
    })
  };
  // 设置输入型框的显示
  setInputShow = (e,condType) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'projDeliveryFileNew/setInputShow',
      key:condType,
      value:e.target.value.trim(),
    });
  };
  onSelectProjectChange = (selectedRowKeys) =>{
    this.setState({selectedRowKeys});
  };
  searchProject = () =>{
    const {dispatch} = this.props;
    dispatch({
      type:'projDeliveryFileNew/searchProject',
    });
  };
  clearSearchProject = () =>{
    const {dispatch} = this.props;
    dispatch({
      type:'projDeliveryFileNew/clearSearchProject',
    });
  };
  openReasonModal = (handle) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'projDeliveryFileNew/changeReasonModal',
      flag:'open',
      handle,
    });
    this.setState({handle})
  };
  closeReasonModal = () =>{
    const {dispatch} = this.props;
    dispatch({
      type:'projDeliveryFileNew/changeReasonModal',
      flag:'close',
    });
  };
  submitConfirm = () =>{
    const {dispatch} = this.props;
    dispatch({
      type:'projDeliveryFileNew/submitConfirm',
    });
  };
  uploadFile =(id)=>{
    this.setState({
      fileId:id,
    })
  };
  //上传附件新增
  uploadFilePops = {
    name: 'filename',
    multiple: false,
    showUploadList: false,
    action: '/filemanage/fileupload',
    data:{
      argappname:'portalFileUpdate',
      argtenantid:'10010',
      arguserid:Cookie.get('userid'),
      argyear:new Date().getFullYear(),
      argmonth:new Date().getMonth()+1,
      argday:new Date().getDate()
    },
    beforeUpload: (file) => {
      this.setState(state => ({
        fileList: [file],
      }));
    },
    //fileList:this.state.fileList,
    // beforeUpload: this.handleBeforUpload,
    onChange: this.handleChange,
  };
  deleteProjectFile =(id)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'projDeliveryFileNew/deleteProjectFile',
      id,
    });
  };
  render() {
    const {projectDetail, role_type, projectVisible, projectName, tmoButtonPermissions, managerButtonPermissions, groupButtonPermissions, paramProject,returnVisible}=this.props;
    const { selectedRowKeys,handle } = this.state;
    let hints = role_type === 1?'过程文档打包上传，大小不超过100M':'验收后一个月内完成结项材料归档，归档压缩包按验收清单目录整理，大小不超过100M';
    let togetherProject = [];
    if (role_type === '0'&&projectDetail.togetherCloseProjects){
      [{key:'projectID1',value:'projectName1'}].map(item =>{
        togetherProject.push(item.value);
      })
    }
    if(projectDetail.documents){
      projectDetail.documents.map((item,index)=>item.key=index);
    }

    let opinion = '';
    if (projectDetail.opinions){
      opinion = projectDetail.opinions.map(item => {
        return(
          <div style={{marginLeft:'20px'}}>{item}</div>
        )
      })
    }
    //同时结项项目，本次不上线
    // let togetherProj = '';
    // if (projectDetail.togetherCloseProjects) {
    //   togetherProj = projectDetail.togetherCloseProjects.map(item=>{
    //     return(
    //       <Tag closable={managerButtonPermissions.displayDel} onClose={e=>{this.preventDefault(e);this.deleteTogetherProject(item.key)}}>{item.value}</Tag>
    //     )
    //   });
    // }

    let columns;
    if((role_type===0 &&  managerButtonPermissions.displayOperate) || (role_type===1 &&  groupButtonPermissions.displayOperate)){
      columns = [
        {
          title: '文档名称',
          dataIndex:'name',
          width: '20%',
        },
        {
          title: '文档说明',
          dataIndex:'description',
          width: '40%',
          render:(text,record,index)=>{
            return (<TextArea disabled value={text} autosize style={{color:'black'}}/>)
          }
        },
        {
          title: '已上传文件',
          width: '20%',
          render:(text,record,index)=>{
            return (
              record.files?
                record.files.map((item,index) =>{
                  return(
                    <div style={{textAlign:"left"}}>
                      <Tag closable={true} onClose={e=>{this.preventDefault(e);this.deleteProjectFile(item.id)}} style={{display:'inlineBlock',marginRight:'10px'}}>
                        <a href={item.url} key={index}>{item.name}</a>
                      </Tag>
                    </div>
                  )
                }):''
            )
          }
        },{
          title: '操作',
          width: '15%',
          render:(text,record,index)=>{
            return (
              <Upload {...this.uploadFilePops}>
                <Button type="primary" onClick={()=>this.uploadFile(record.id)}>
                  {'上传文件'}
                </Button>
              </Upload>)
          }
        }];
    }else{
      columns = [{
        title: '文档名称',
        dataIndex:'name',
        width: '20%',
      },
        {
          title: '文档说明',
          dataIndex:'description',
          width: '40%',
          render:(text,record,index)=>{
            return (<TextArea disabled value={text} autosize style={{color:'black'}}/>)
          }
        },
        {
          title: '已上传文件',
          width: '20%',
          render:(text,record,index)=>{
            return(
              record.files?
                record.files.map((item,index) =>{
                  return(
                    <div style={{display:'inlineBlock',marginRight:'10px',textAlign:"left"}}>
                      <a href={item.url} key={index}>{item.name}</a>
                    </div>
                  )
                }):''
            )
          }
        },];
    }
    let projectColumns = [{
      title: '项目编号',
      dataIndex:'projectCode',
      width:'45%',
    },
      {
        title: '项目名称',
        dataIndex:'projectName',
        width:'50%',
        render:(text,record,index)=>{
          return (<span>{text}</span>)
        }
      }];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectProjectChange,
      getCheckboxProps:record=>({
        disabled:this.props.checkList.indexOf(record.projectId) !== -1
      })
    };
    let expandedColumns = [{
      dataIndex:'name',
      width: '30%',
      render:(text,record,index)=>{
        return (<span style={{display:'inlineBlock',marginRight:'10px'}}>
                      <a href={record.url} key={index}>{record.name}</a>
                           </span>)
      }
    },
      {
        dataIndex:'zipPath',
        width: '70%',
      }];
    const expandedRowTable = (record) =>{
      if (record.files){
        let files = record.files;
        for(let i=0;i<files.length;i++){
          if (files[i].zipFiles){
            files[i].zipPath=files[i].zipFiles.map(item=>{
              return (<Col style={{textAlign:"left"}}>{item.absolutePath}</Col>)
            })
          }
        }
        return (
          <Table
            className={styles.reportInfoTable}
            columns={expandedColumns}
            dataSource={files}
            pagination={false}
            showHeader={false}
          />
        )
      }
    };
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div style={{paddingTop:13,paddingBottom:16,background:'white'}}>
          <div style={{paddingLeft:15,paddingRight:15}}>
            <div><p style={{textAlign:'center',fontSize:'20px',marginBottom:'10px'}}>{projectName}-交付物清单</p></div>
            <Row className={styles.projDeliveryFileInfoC}>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>生产编码：{projectDetail.code}</Col>
              <Col xs={12} sm={12} md={7} lg={7} xl={7}>主建单位：{projectDetail.superDepartmentName}</Col>
              <Col xs={12} sm={12} md={9} lg={9} xl={9}>主建部门：{projectDetail.departmentName}</Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>项目经理：{projectDetail.managerName}</Col>
              <Col xs={12} sm={12} md={7} lg={7} xl={7}>项目类型：{projectDetail.type}</Col>
              <Col xs={12} sm={12} md={9} lg={9} xl={9}>子/主项目：{projectDetail.isPrimary=== 1?'主项目':'子项目'}</Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>项目分类：{projectDetail.category === 0?'项目类':(projectDetail.category === 1?'小组类':'支撑类')}</Col>
              <Col xs={12} sm={12} md={8} lg={8} xl={8}>项目状态：{projectDetail.flowState=== 1?'待审核':(projectDetail.flowState=== 2?'审核通过':(projectDetail.flowState=== 3?'退回':'未提交'))}</Col>
            </Row>
            <div style={{marginTop:'10px'}}>
              <Tooltip placement="right" title={hints}>
                填写说明：<Icon type="question-circle" style={{ fontSize: 16, color: '#08c' }}/>
              </Tooltip>
            </div>
            <div className={styles.projDeliveryFileBtn}>
              {
                role_type === 2?
                  <Popconfirm title="确定进行通过操作吗?" onConfirm={()=>this.openReasonModal('pass')} okText="确定" cancelText="取消">
                    <Button type="primary" disabled={!tmoButtonPermissions.ablePass} >{'通过'}</Button>
                  </Popconfirm>
                  :null
              }
              {
                role_type === 2?
                  <Popconfirm title="确定进行通过操作吗?" onConfirm={()=>this.openReasonModal('return')} okText="确定" cancelText="取消">
                    <Button type="primary" disabled={!tmoButtonPermissions.ableReturn} >{'退回'}</Button>
                  </Popconfirm>
                  :null
              }
              {
                role_type === 0 && managerButtonPermissions.displaySubmit?
                  <Popconfirm title="确定进行通过操作吗?" onConfirm={()=>this.submitConfirm()} okText="确定" cancelText="取消">
                    <Button type="primary" disabled={!managerButtonPermissions.ableSubmit} >{'提交'}</Button>
                  </Popconfirm>
                  :null
              }
              {
                role_type === 1?
                  <Popconfirm title="确定进行通过操作吗?" onConfirm={()=>this.submitConfirm()} okText="确定" cancelText="取消">
                    <Button type="primary" disabled={!groupButtonPermissions.ableSubmit} >{'提交'}</Button>
                  </Popconfirm>
                  :null
              }
              <Button type="primary" onClick={this.goBack}>{'返回'}</Button>
            </div>
            <Table
              className={styles.reportInfoTable}
              bordered={true}
              columns={columns}
              pagination={false}
              dataSource={projectDetail.documents}
              expandedRowRender={expandedRowTable}
            />
            {/*添加同时结项项目，本次不上线*/}
            {/*<div style={{marginTop:'10px'}}>*/}
              {/*<span>{'同时结项项目：'}</span><span>{togetherProj}</span>&nbsp;&nbsp;*/}
              {/*{*/}
                {/*role_type=== 0 && managerButtonPermissions.displayAdd?*/}
                  {/*<Icon*/}
                    {/*type="plus"*/}
                    {/*style={{ fontSize: 16, color: '#08c' }}*/}
                    {/*onClick={this.openProjectModal}/>*/}
                  {/*:*/}
                  {/*null*/}
              {/*}*/}
            {/*</div>*/}
            <div style={{marginTop:'10px'}}>
              {
                projectDetail.opinions?
                  <div><span>退回原因：</span>{opinion}</div>
                  :
                  null
              }
            </div>

            <Modal
              title={handle === 'return'?'退回原因(必填)':"审批意见"}
              visible={returnVisible}
              onCancel={this.closeReasonModal}
              onOk={this.returnReasonCrl}
            >
              <TextArea rows={4} value={this.state.reason1} onChange={this.seasonHandle}/>
            </Modal>

            <Modal
              title="同时结项项目"
              visible={projectVisible}
              onCancel={this.closeProjectModal}
              onOk={this.addTogetherProject}
              width={1000}
            >
              <div>
                {'项目编号：'}<Input style={{width:180}} value={paramProject.projectCode} onChange={(e)=>this.setInputShow(e,'projectCode')}/>&nbsp;&nbsp;
                {'项目名称：'}<Input style={{width:180}} value={paramProject.projectName} onChange={(e)=>this.setInputShow(e,'projectName')}/>&nbsp;&nbsp;
                <Button type="primary" onClick={this.searchProject}>{'查询'}</Button>&nbsp;&nbsp;
                <Button type="primary" onClick={this.clearSearchProject}>{'清空'}</Button>
                <Table
                  className={styles.reportInfoTable}
                  rowSelection={rowSelection}
                  columns={projectColumns}
                  dataSource={this.props.filterProject}
                  style={{marginTop:'5px'}}
                />
              </div>
            </Modal>
          </div>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.projDeliveryFileNew,
    ...state.projDeliveryFileNew
  }
}

export default connect(mapStateToProps)(ProjDeliveryFileNew);
