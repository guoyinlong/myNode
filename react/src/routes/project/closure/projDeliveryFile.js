/**
 *  作者: 陈红华
 *  创建日期: 2017-12-01
 *  邮箱：1045825949@qq.com
 *  文件说明：项目结项：项目列表
 */

import React from 'react';
import { Row, Col, Button ,Collapse , Table,Input,Modal,Popconfirm,message,Tooltip,Icon,Spin } from 'antd';
const Panel = Collapse.Panel;
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import TableStyles from './projTable.less';
import styles from "./proDeliveryFile.less";
import FileUpload from './fileUpdateDate.js';
import {getUuid} from '../../../components/commonApp/commonAppConst.js';
import { rightControl } from '../../../components/finance/rightControl';
import * as config from './projDeliveryConfig.js';
const { TextArea } = Input;
class ProjDeliveryFile extends React.Component {
  state={ModalVisible:false,showFileList:[],reason1:'',visible:false}
  // 显示上传文件模态框
  showUploadModal=(item)=>{
    let {showFileList}=this.state;
    showFileList=[];
    for(var r=0;r<item[item.fileName].allUrl.length;r++){
      if(item[item.fileName].allUrl[r].file_name){
        showFileList.push(
          {uid: r+1,
          name:item[item.fileName].allUrl[r].file_name,
          status: 'done',
          uuid:item[item.fileName].allUrl[r].file_uuid,
          url:item[item.fileName].allUrl[r].file_url,
          AbsolutePath:item[item.fileName].allUrl[r].file_url,
          RelativePath:item[item.fileName].allUrl[r].file_url,
          OriginalFileName:item[item.fileName].allUrl[r].file_name}
        )
      }
    }
    this.setState({ModalVisible:!this.state.ModalVisible,record:item,showFileList})
  }
  // 关闭模态框
  cancelModel=()=>{
    this.setState({ModalVisible:!this.state.ModalVisible})
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
      type:'projDeliveryFile/updateData',
      record
    })
    this.setState({ModalVisible:!this.state.ModalVisible});
  }
  // 添加备注
  InputOnchange=(e)=>{
    let record=JSON.parse(e.target.name);
    record[record.fileName].reason=e.target.value;
    const {dispatch}=this.props;
    dispatch({
      type:'projDeliveryFile/updateData',
      record
    })
  }
  // TMO审核是否通过
  projClosingDocumentAudit=(flag)=>{
    const {dispatch}=this.props;
    const {query}=this.props.location;
    dispatch({
      type:'projDeliveryFile/projClosingDocumentAudit',
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
    let reason1=this.state.reason1||'';
    const {query}=this.props.location;
    if(!reason1.trim()){
      message.error('请输入不通过理由！');
      return
    }
    dispatch({
      type:'projDeliveryFile/projClosingDocumentAudit',
      postData:{
        arg_projId:this.props.location.query.proj_id,
        arg_checkId:Cookie.get('userid'),
        arg_checkName:Cookie.get("username"),
        arg_isPass:'no',
        arg_reaturn_reason:reason1,
      },
      queryData:{
        arg_projType:query.proj_type,
        arg_projId:query.proj_id
      }
    })
    this.setState({ visible: false,reason1:''});
  };
  // 返回大项目列表页
  goBack=()=>{
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname: 'projectApp/projClosure/projDeliveryList'
    }))
  };
  // 项目经理保存或者提交文件 flag:1提交 0保存
  ProjWebReturnBackAnalysis=(flag)=>{
    const {dispatch,DataRows3,DataList2}=this.props;
    const {query}=this.props.location;
    if(flag=='1'){//提交的时候
      for(let r=0;r<DataRows3.length;r++){
        for(let key in DataRows3[r]){
          let otherFlag=false;//标记key是否为其他里面的文件名
          for(let i=0;i<DataList2['其他'].length;i++){
            if(key==DataList2['其他'][i].fileName){
              otherFlag=true;
              break;
            }
          }
          if(!otherFlag){
            if(DataRows3[r][key].tag === '0'){
              if( DataRows3[r][key].allUrl.length==0 && !DataRows3[r][key].reason ){
                message.info("项目结项-项目总结报告未上传，无法提交！");
                return;
              }else if(DataRows3[r][key].allUrl.length==1 && !DataRows3[r][key].allUrl[0].file_name && !DataRows3[r][key].reason){
                message.info("项目结项-项目总结报告未上传，无法提交！");
                return;
              }
            }
          }
        }
      }
    };
    let DataRows=[];
    for(let i=0;i<DataRows3.length;i++){
      for(let key in DataRows3[i]){
        if(DataRows3[i][key].reason || DataRows3[i][key].allUrl[0].file_name ){
          DataRows.push(DataRows3[i][key]);
        }
      }
    };
    dispatch({
      type:'projDeliveryFile/ProjWebReturnBackAnalysis',
      postData:{
        projId:query.proj_id,
        mgrId:query.mgr_id,
        fileState:flag,
        DataRows3:JSON.stringify(DataRows)
      },
      queryData:{
        arg_projType:query.proj_type,
        arg_projId:query.proj_id
      }
    })
  }
  // 页面初始化查询
  componentDidMount(){
    const {dispatch}=this.props;
    const {query}=this.props.location;
    dispatch({
      type:'projDeliveryFile/projDeliveryFileQuery',
      postData:{
        arg_projType:query.proj_type,
        arg_projId:query.proj_id
      }
    })
    dispatch({
      type:'projDeliveryFile/pUserhasmodule'
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
  seasonHandle=(e)=>{
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
  render() {
    const {query}=this.props.location;
    const {DataRows1,DataList2,hasUploadList,DataRows3,rightCtrl,auditState,DataRows4}=this.props;
    let text='';
    for(let i=0;i<DataRows3.length;i++){
      for(let key in DataRows3[i]){
        if(DataRows3[i][key].hasOwnProperty('return_reason') && DataRows3[i][key].return_reason !== ''){
          text= DataRows3[i][key].return_reason;
        }
      }
    };
    let textTitle =[];
    if(DataRows4 !== undefined){
      for(let i=0;i<DataRows4.length;i++){
        textTitle.push(DataRows4[i].t_instructions);
      }
    }

    let projLabel={'0':'项目类','3':'项目类(纯第三方)','1':'小组类','2':'支撑类'};
    let projState={0:'已保存', 1:'待审核',2:'审核通过',3:'审核退回',4:'未上传'}
    let columns;
    if(query.roleId === '0' || projState[auditState] === '审核通过' || projState[auditState] === '待审核'){
      columns = [
        {
        title: '文档名称',
        dataIndex:'fileName'
        },
        {
        title: '文档说明',
        render:(text,record,index)=>{
          return (<span>{record[record.fileName].document_description}</span>)
        }
        },
        {
        title: '已上传文件',
        render:(text,record,index)=>{
          return (record[record.fileName].allUrl.map((item,indexc)=>
            <span>
              <span style={{display:'inlineBlock',marginRight:'10px'}}>{item.file_name?<a href={item.file_url} key={indexc}>{indexc+1+"."+item.file_name}</a>:''}</span>
            </span>
          ))
        }
      },{
        title: '备注',
        render:(text,record,index)=>{
          return (
            <span>
            <Input disabled value={record[record.fileName].reason} name={JSON.stringify(record)} onChange={this.InputOnchange} />
            </span>
          )
        }
      }];
    }else{
      columns = [{
        title: '文档名称',
        dataIndex:'fileName'
      }, {
        title: '文档说明',
        render:(text,record,index)=>{
          return (<span>{record[record.fileName].document_description}</span>)
        }
      }, {
        title: '已上传文件',
        render:(text,record,index)=>{
            return (record[record.fileName].allUrl.map((item,indexc)=>
              <span>
                <span style={{display:'inlineBlock',marginRight:'10px'}}>{item.file_name?<a href={item.file_url} key={indexc}>{indexc+1+"."+item.file_name}</a>:''}</span>
              </span>
            ))

        }
      },{
        title: '备注',
        render:(text,record,index)=>{
          return (
            <span>
              <Input value={record[record.fileName].reason} name={JSON.stringify(record)} onChange={this.InputOnchange} />
            </span>
          )
        }
      },{
        title: '操作',
        render:(text,record,index)=>{
            return (<Button type="primary" onClick={()=>this.showUploadModal(record)}>上传</Button>)
        }
      }];
    }
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
      <div style={{paddingTop:13,paddingBottom:16,background:'white'}}>
        <div style={{paddingLeft:15,paddingRight:15}}>
          <div><p style={{textAlign:'center',fontSize:'20px',marginBottom:'10px'}}>{query.proj_name}-交付物清单</p></div>
          <Row className={styles.projDeliveryFileInfoC}>
           <Col xs={12} sm={12} md={8} lg={8} xl={8}>生产编码：{query.proj_code}</Col>
           <Col xs={12} sm={12} md={8} lg={8} xl={8}>主建单位：{query.ou}</Col>
           <Col xs={12} sm={12} md={8} lg={8} xl={8}>主建部门：{query.dept_name.includes('-') ?query.dept_name.split('-')[1]:query.dept_name}</Col>
           <Col xs={12} sm={12} md={8} lg={8} xl={8}>项目经理：{query.mgr_name}</Col>
           <Col xs={12} sm={12} md={8} lg={8} xl={8}>项目类型：{query.proj_type}</Col>
           <Col xs={12} sm={12} md={8} lg={8} xl={8}>子/主项目：{query.is_primary=== '0'?'主项目':'子项目'}</Col>
           <Col xs={12} sm={12} md={8} lg={8} xl={8}>项目分类：{projLabel[query.proj_label]}</Col>
           <Col xs={12} sm={12} md={8} lg={8} xl={8}>项目状态：{projState[auditState]}</Col>
          </Row>
          {
            text !== ''?
              '退回原因：'
              :
              null
          }
          <span>{text}</span>
          <div style={{marginTop:'10px'}}>
            <Tooltip placement="right" title={textTitle}>
              填写说明：<Icon type="question-circle" style={{ fontSize: 16, color: '#08c' }}/>
            </Tooltip>
          </div>
          <div className={styles.projDeliveryFileBtn}>
            {
              rightControl(config.ProjClosingDocumentAudit,rightCtrl) ?
                <Popconfirm title="您确定要退回吗?" onConfirm={()=>this.projClosingDocumentAudit('yes')} okText="确定" cancelText="取消">
                  <Button type="primary" disabled={auditState=='1'?false:true} >通过</Button>
                </Popconfirm>
                :
                null
            }
            {
              rightControl(config.ProjClosingDocumentAudit,rightCtrl) ?
                <Button type="primary" disabled={auditState=='1'?false:true} onClick={this.showModal}>退回</Button>
                :
                null
            }
            {
              rightControl(config.ProjWebReturnBackAnalysis,rightCtrl) ?
                <Button type="primary" onClick={()=>this.ProjWebReturnBackAnalysis('0')} disabled={auditState=='0'||auditState=='3'||auditState=='4'?false:true}>保存</Button>
                :
                null
            }
            {
              rightControl(config.ProjWebReturnBackAnalysis,rightCtrl) ?
                <Popconfirm title="确定进行提交操作吗?" onConfirm={()=>this.ProjWebReturnBackAnalysis('1')} okText="确定" cancelText="取消">
                  <Button type="primary"  disabled={auditState=='0'||auditState=='3'||auditState=='4'?false:true}>提交</Button>
                </Popconfirm>
                :
                null
            }
            {
              query.roleId === '0' || projState[auditState] === '审核通过' ?
                <Button type="primary" onClick={this.goBack}>返回</Button>
                :
                  <Popconfirm title="确定返回吗?" onConfirm={this.goBack} okText="确定" cancelText="取消">
                    <Button type="primary" >返回</Button>
                  </Popconfirm>
            }

          </div>
          <Collapse defaultActiveKey={['1']}>
            {
              DataRows1.map((i,index)=>{
              return <Panel header={
                i.process_stage_name==='其他' ?
                  i.process_stage_name+"（已上传"+(DataList2[i.process_stage_name].length-hasUploadList[i.process_stage_name])+"类）"
                  + (DataList2[i.process_stage_name].some((is)=>{
                    return is[is.fileName].tag === '0';
                  })?'必传':'')
                  :
                  i.process_stage_name+"（应上传"+DataList2[i.process_stage_name].length+'类，还需上传'+hasUploadList[i.process_stage_name] +"类）"
                  + (DataList2[i.process_stage_name].some((is)=>{
                    return is[is.fileName].tag === '0';
                  })?'必传':'')
              }
                            key={index+1}>
                <Table className={TableStyles.orderTable+' '+styles.orderTable} bordered={true} columns={columns}
                       pagination={false} dataSource={DataList2[i.process_stage_name]}
                       rowKey="key"/>
              </Panel>
              })
            }
          </Collapse>
          <Modal visible={this.state.ModalVisible} title={this.state.record?this.state.record.fileName+'文件上传':''}
            onCancel={this.cancelModel}
            footer={[
              <Button key="back" size="large" onClick={this.cancelModel}>关闭</Button>,
              <Button key="submit" type="primary" size="large" onClick={this.confirmModel}>确定</Button>
            ]}
            >
            <div style={{minHeight:"200px"}}>
              <span>选择文件：</span>
              <FileUpload ref='fileuploadComp' fileLists={this.state.showFileList} content='上传文件' DataRows3={this.props.DataRows3} fileName={this.state.record?this.state.record.fileName:''}/>
            </div>
          </Modal>
          <Modal
            title="退回原因"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onOk={this.returnReasonCrl}
          >
            <TextArea rows={4} value={this.state.reason1} onChange={this.seasonHandle}/>
          </Modal>
        </div>
      </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.projDeliveryFile,
    ...state.projDeliveryFile
  }
}

export default connect(mapStateToProps)(ProjDeliveryFile);
