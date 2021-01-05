/**
 * 作者：邓广晖
 * 创建日期：2018-04-10
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：TMO修改已立项的全成本数据后，TMO和审核人查看待办、已办、办结的共用页面,静态查看页面
 */

import React from 'react';
import { connect } from 'dva';
import { Button , Tabs , Breadcrumb , Modal,Spin,Input,message} from 'antd';
import { Link,routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import FullcostModule from './fullcostModule';
import ExamineLinkModule from './examineLinkModule';
import ReturnReasonModule from './returnReasonModule';
import RetreatReasonModule from './retreatReasonModule';
import ApprovalModule from './approvalModule';
import config from '../../../../utils/config';
import {getUuid} from '../../../../components/commonApp/commonAppConst.js';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const { TextArea } = Input;

/**
 * 作者：邓广晖
 * 创建日期：2018-04-10
 * 邮件：denggh6@chinaunicom.cn
 * 功能：审核TMO修改全成本的主页面，包含全成本和审批历史tab
 */
class ProjFullCostView extends React.PureComponent {

  state = {
    reasonModalVisible:false,
    retreatModalVisible:false,
    approvalVisible:false,
    terminateVisible:false,
    terminateValue:'',
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-10
   * 功能：从审批历史具体详情返回时，回到上一个页面，并将tab切换到 审批历史 tab
   */
  goBackCheckTab = () => {
    this.props.dispatch({
      type: 'projFullcostView/changeTabKey',
      payload:{ key:'2'}
    });
    history.back();

  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-10
   * 功能：点击通过按钮，弹出是否上会的弹窗
   */
  showConfirm = () => {
    this.setState({
      approvalVisible:true,
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-10
   * 功能：点击退回按钮，弹出退回原因弹窗
   */
  handleReturnClick = () => {
    this.setState({
      reasonModalVisible:true
    });
  };


  /*
   * 作者：邓广晖
   * 创建日期：2018-04-10
   * 功能：点击修改按钮，进入修改页面
   * */
  jumpModify = () =>{
    const {dispatch,queryData,titleData} = this.props;
    dispatch(routerRedux.push({
      pathname: '/projFullcostReModify',
      query:{
        arg_tag:queryData.arg_tag,
        arg_handle_flag:queryData.arg_handle_flag,
        arg_proj_id:queryData.arg_proj_id,
        arg_proj_uid:queryData.arg_proj_uid,
        arg_task_uuid: queryData.arg_task_uuid,
        arg_task_batchid: queryData.arg_task_batchid,
        arg_task_wf_batchid: queryData.arg_task_wf_batchid,
        arg_check_id: titleData.last_check_id,
/*
        arg_proj_name: titleData.proj_name,
        arg_business_id:titleData.business_id,
        arg_check_id: titleData.last_check_id,

        arg_business_batchid:titleDetail.bussiness_batchid,
        arg_check_batch_id: titleDetail.check_batch_id,
        arg_exe_id: titleDetail.exe_id,
        arg_wf_task_id: titleDetail.wf_task_id,
        arg_link_id: titleDetail.link_id,
        arg_link_name: titleDetail.link_name,
        arg_role_id: titleDetail.role_id,
*/
      }
    }));
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：设置输入型框的值
   * @param e 输入事件
   * @param inputType 输入的类型
   */
  setInputValue = (e,inputType) =>{
    this.state[inputType] = e.target.value;
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-10
   * 功能：tab切换
   */
  switchTab = (key) => {
    this.props.dispatch({
      type: 'projFullcostView/changeTabKey',
      payload:{ key:key}
    });
    //切换到 全成本时 根据情况查询服务，  其他tab默认查询
    if(key === '1'){
      this.props.dispatch({
        type: 'projFullcostView/searchProjFullcostView'
      });
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-08
   * 功能：退回
   * @param flag 确定标志
   */
  hideReturnModal = (flag) => {
    if (flag === 'confirm') {
      if (this.refs.returnReasonModule.state.returnValue.trim() === ''){
        message.error('退回原因不能为空');
        return;
      } else {
        const {dispatch,queryData,titleData,titleDetail} = this.props;
        dispatch({
          type:'projFullcostView/projFullcostReturn',
          payload:{
            arg_proj_id: queryData.arg_proj_id,
            arg_proj_name: titleData.proj_name,
            arg_proj_uid: queryData.arg_proj_uid,
            arg_opt_byid: Cookie.get('userid'),
            arg_opt_byname: Cookie.get('username'),
            arg_opt_content: this.refs.returnReasonModule.state.returnValue.trim(),  //退回原因
            arg_business_batchid:titleDetail.bussiness_batchid,
            arg_check_id: titleData.last_check_id,
            arg_check_batch_id: titleDetail.check_batch_id,
            arg_exe_id: titleDetail.exe_id,
            arg_wf_task_id: titleDetail.wf_task_id,
            arg_link_id: titleDetail.link_id,
            arg_link_name: titleDetail.link_name,
            arg_role_id: titleDetail.role_id,
            arg_task_uuid: queryData.arg_task_uuid,
            arg_task_batchid: queryData.arg_task_batchid,
            arg_task_wf_batchid: queryData.arg_task_wf_batchid,
            arg_cos_submit_byid:titleData.proj_change_byid,
            arg_cos_submit_byname:titleData.proj_change_byname,

            arg_is_email:this.refs.returnReasonModule.state.emailValue,
            arg_return_email:titleData.proj_change_email,
          }
        });
      }
    }
    this.setState({
      reasonModalVisible:false
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-08
   * 功能：通过
   * @param flag 确定标志
   */
  hideApprovalModal = (flag) => {
    if (flag === 'confirm') {
      const {dispatch,queryData,titleData,titleDetail} = this.props;
      dispatch({
        type:'projFullcostView/projChangeApproval',
        payload:{
          arg_proj_id: queryData.arg_proj_id,
          arg_proj_name: titleData.proj_name,
          arg_proj_uid: queryData.arg_proj_uid,
          arg_opt_byid: Cookie.get('userid'),
          arg_opt_byname: Cookie.get('username'),
          arg_business_batchid:titleDetail.bussiness_batchid,
          arg_check_id: titleData.last_check_id,
          arg_check_batch_id: titleDetail.check_batch_id,
          arg_exe_id: titleDetail.exe_id,
          arg_wf_task_id: titleDetail.wf_task_id,
          arg_link_id: titleDetail.link_id,
          arg_link_name: titleDetail.link_name,
          arg_role_id: titleDetail.role_id,
          arg_task_uuid: queryData.arg_task_uuid,
          arg_task_batchid: queryData.arg_task_batchid,
          arg_task_wf_batchid: queryData.arg_task_wf_batchid,
          arg_cos_submit_byid:titleData.proj_change_byid,
          arg_cos_submit_byname:titleData.proj_change_byname,
          arg_is_email:this.refs.approvalModule.state.emailValue,
          arg_return_email:titleData.proj_change_email,
        }
      });
    }
    this.setState({
      approvalVisible:false
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-08
   * 功能：终止流程
   */
  terminate = () => {
    this.setState({
      terminateVisible:true
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-08
   * 功能：终止
   * @param flag 确定标志
   */
  hideTerminateModal = (flag) => {
    if (flag === 'confirm') {
      if (this.state.terminateValue.trim() === ''){
        message.error('终止原因不能为空');
        return;
      } else {
        const {dispatch,queryData,titleData,titleDetail} = this.props;
        dispatch({
          type:'projFullcostView/projFullcostTerminal',
          payload: {
            arg_proj_id: queryData.arg_proj_id,
            arg_proj_name: titleData.proj_name,
            arg_proj_uid: queryData.arg_proj_uid,
            arg_opt_byid: Cookie.get('userid'),
            arg_opt_byname: Cookie.get('username'),
            arg_opt_content: this.state.terminateValue.trim(),   //终止原因
            arg_business_batchid: titleDetail.bussiness_batchid,
            arg_business_id: titleData.business_id,

            arg_check_id: titleData.last_check_id,
            arg_check_batch_id: titleDetail.check_batch_id,
            arg_exe_id: titleDetail.exe_id,
            arg_task_uuid: queryData.arg_task_uuid,
            arg_task_batchid: queryData.arg_task_batchid,
            arg_task_wf_batchid: queryData.arg_task_wf_batchid,

            arg_is_draft: titleData.is_draft,
            arg_draft_batchid: titleData.draft_batchid,
          }
        });
      }
    }
    this.setState({
      terminateVisible:false
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-18
   * 功能：撤回
   */
  showRetreat = () => {
    this.setState({
      retreatModalVisible:true
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-08
   * 功能：撤回
   * @param flag 确定标志
   */
  hideRetreatModal = (flag) => {
    if (flag === 'confirm') {
      if (this.refs.retreatReasonModule.state.retreatValue.trim() === ''){
        message.error('撤回原因不能为空');
        return;
      } else {
        const {dispatch,queryData,titleData,titleDetail} = this.props;
        dispatch({
          type:'projFullcostView/projFullcostRetreat',
          payload:{
            arg_proj_id: queryData.arg_proj_id,
            arg_proj_name: titleData.proj_name,
            arg_proj_uid: queryData.arg_proj_uid,
            arg_opt_byid: Cookie.get('userid'),
            arg_opt_byname: Cookie.get('username'),
            arg_opt_content: this.refs.retreatReasonModule.state.retreatValue.trim(),  //撤回原因
            arg_business_batchid:titleDetail.bussiness_batchid,

            arg_check_id: queryData.arg_check_id,     //此处的check_id是url的
            arg_check_batch_id: titleDetail.check_batch_id,
            arg_task_wf_batchid: queryData.arg_task_wf_batchid,
            arg_is_email:this.refs.retreatReasonModule.state.emailValue,
          }
        });
      }
    }
    this.setState({
      retreatModalVisible:false
    });
  };


  render(){
    const {dispatch,projChangeLog,queryData,titleData,titleDetail} = this.props;
    let operations;
    if(typeof(queryData.arg_task_uuid) !== 'string'){
      //点击审批历史里面的表格进去查看详细时，没有传递 arg_task_uuid
      operations = <div>
        <Button type="primary" style={{marginRight:10}} onClick={this.goBackCheckTab}>返回</Button>
      </div>;
    }else{
      if(queryData.arg_handle_flag === '0') {
        //如果是待办页面
        if (queryData.arg_tag === '4' && typeof(queryData.arg_task_uuid) === 'string') {
          //如果是审核人（arg_tag = 4），arg_task_uuid代表是从待办已办办结进来
          operations = <div>
            <Button type="primary" style={{marginRight:10}} onClick={this.showConfirm}>通过</Button>
            {/*通过时，选择是否给申请人发送邮件*/}
            <Modal visible={this.state.approvalVisible}
                   key={getUuid(20,62)}
                   title={'确认通过'}
                   width={'500px'}
                   onOk={()=>this.hideApprovalModal('confirm')}
                   onCancel={()=>this.hideApprovalModal('cancel')}
            >
              <ApprovalModule
                ref='approvalModule'
              />
            </Modal>
            <Button type="primary" style={{marginRight:10}} onClick={this.handleReturnClick}>退回</Button>
            {/*退回原因*/}
            <Modal visible={this.state.reasonModalVisible}
                   key={getUuid(20,62)}
                   title={'退回原因'}
                   width={'500px'}
                   onOk={()=>this.hideReturnModal('confirm')}
                   onCancel={()=>this.hideReturnModal('cancel')}
            >
              <ReturnReasonModule
                ref='returnReasonModule'
              />
            </Modal>
          </div>;
        } else if (queryData.arg_tag === '3'&& typeof(queryData.arg_task_uuid) === 'string') {
          //如果是申请人（arg_tag = 3）
          operations = <div>
            <Button type="primary" style={{marginRight:10}} onClick={this.terminate}>终止</Button>
            {/*终止流程原因*/}
            <Modal visible={this.state.terminateVisible}
                   key={getUuid(20,62)}
                   title={'终止流程原因'}
                   width={'500px'}
                   onOk={()=>this.hideTerminateModal('confirm')}
                   onCancel={()=>this.hideTerminateModal('cancel')}
            >
              <div>
                <div style={{color:'red',display:'inline-block',verticalAlign:'top',marginRight:5}}>{"*"}</div>
                <div style={{display:'inline-block',width:'97%'}}>
                  <TextArea rows={4} onChange={(e)=>this.setInputValue(e,'terminateValue')} placeholder={'请输入终止流程原因'} maxLength='200'/>
                </div>
              </div>
            </Modal>
            <Button type="primary" style={{marginRight:10}} onClick={this.jumpModify}>修改</Button>
          </div>;
        }
      }else if(queryData.arg_handle_flag === '1'){
        //如果是已办页面
        if ((queryData.arg_tag === '3' || queryData.arg_tag === '5') && typeof(queryData.arg_task_uuid) === 'string' && titleData.handling_show === '1') {
          //如果是申请人（arg_tag = 3）或者 发起人（arg_tag = 5），arg_task_uuid代表是从待办已办办结进来,handling_show 为 1，按钮才显示
          //如果 handling_able = 0，按钮显示，但需要禁用
          operations = <div>
            <Button
              type="primary"
              style={{marginRight:10}}
              onClick={this.showRetreat}
              disabled={titleData.handling_able === '0'}
            >
              <span>{'撤回'}</span>
            </Button>
            {/*撤回原因*/}
            <Modal visible={this.state.retreatModalVisible}
                   key={getUuid(20,62)}
                   title={'撤回原因'}
                   width={'500px'}
                   onOk={()=>this.hideRetreatModal('confirm')}
                   onCancel={()=>this.hideRetreatModal('cancel')}
            >
              <RetreatReasonModule
                ref='retreatReasonModule'
                titleData={titleData}
              />
            </Modal>
          </div>;
        }
      }else{
        operations = <div> </div>;
      }
    }
    return(
      <Spin tip={config.PROCESSING_DATA} spinning={this.props.loading}>
        <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
            <Breadcrumb.Item>
              {typeof(queryData.arg_task_uuid) === 'string' ?
                ( queryData.arg_handle_flag === '0' ?
                  '待办任务详情'
                  :
                  ( queryData.arg_handle_flag === '1' ?
                    '已办任务详情'
                    :
                    (queryData.arg_handle_flag === '3'? '办结任务详情' : '任务详情')))
                :
                '审核环节'}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div style={{textAlign:'center',fontWeight:'bold',fontSize:28,marginBottom:'8px'}}>{titleData.proj_name}</div>
          {queryData.arg_tag === '4'?
            <div style={{fontSize:16,textAlign:'left',marginBottom:'12px',marginTop:'23px'}}>
              <div style={{display:'inline-block'}}>
                <div style={{marginLeft:20}}>
                  <span style={{fontWeight:'bold',fontSize:16}}>变更原因：</span>
                  <TextArea value={titleData.change_reason}
                            rows = {1}
                            style={{width:450,verticalAlign:'middle'}}>
                  </TextArea>
                </div>
              </div>
              <div style={{display:'inline-block',marginBottom:'10px'}}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{fontWeight:'bold',fontSize:16}}>上一环节：</span>
                {titleDetail.pre_link_name}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{fontWeight:'bold',fontSize:16}}>当前环节：</span>
                {titleDetail.link_name}
              </div>
            </div>
            :
            <div style={{fontSize:16,textAlign:'left',marginBottom:'12px',marginTop:'23px'}}>
              <div style={{display:'inline-block'}}>
                {titleDetail.return_reason_flag === '1' ?
                  <div style={{marginLeft:20}}>
                    <span style={{fontWeight:'bold',fontSize:16}}>退回原因：</span>
                    <TextArea value={titleDetail.return_reason}
                              rows = {1}
                              style={{width:450,verticalAlign:'middle'}}
                    >
                  </TextArea>
                  </div>
                  :
                  null
                }
              </div>
              <div style={{display:'inline-block',marginBottom:'10px'}}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{fontWeight:'bold',fontSize:16}}>上一环节：</span>
                {titleDetail.pre_link_name}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{fontWeight:'bold',fontSize:16}}>当前环节：</span>
                {titleDetail.link_name}
              </div>
            </div>
          }
          <Tabs tabBarExtraContent={operations} onTabClick={this.switchTab} activeKey={this.props.tab_key}>
            <TabPane tab={'全成本'} key="1">
              <FullcostModule
                ref="fullcostModule"
                coorpDeptList={this.props.coorpDeptList}
                compBudgetTableData={this.props.compBudgetTableData}
              />
            </TabPane>
            {
              typeof(queryData.arg_task_uuid) === 'string'
                ?
                <TabPane tab={'审批环节'} key="2">
                  <ExamineLinkModule
                    ref="examineLinkModule"
                    dispatch={dispatch}
                    projChangeLog={projChangeLog}
                    arg_proj_id={queryData.arg_proj_id}
                    arg_handle_flag={queryData.arg_handle_flag}
                    arg_tag={queryData.arg_tag}/>
                </TabPane>
                : ''
            }
          </Tabs>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.projFullcostView,
    ...state.projFullcostView
  }
}

export default connect(mapStateToProps)(ProjFullCostView);
