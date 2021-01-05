/**
 * 作者：胡月
 * 创建日期：2017-12-18
 * 邮件：huy61@chinaunicom.cn
 * 文件说明：审核人待办中交付物审核的功能
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button , Tabs , Breadcrumb , Modal, Spin, message,Input} from 'antd';
import { Link } from 'dva/router';
import DeliverableCheck from './deliverableCheck';
import DeliverableModify from './deliverableModify';
import DeliverableExamineLink from './deliverableExamineLink';
import ResonModal from '../taskDetailModal';
import config from '../../../../utils/config';
import {getUuid} from '../../../../components/commonApp/commonAppConst.js';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const { TextArea } = Input;
/**
 * 作者：胡月
 * 创建日期：2017-12-19
 * 功能：交付物管理审核人审核页面
 */
class DeliverableManage extends React.PureComponent {
  constructor(props) {
    super(props);
  }
    state = {
      tab_key:'1',
      terminateValue:'',
      terminateVisible:false,
    };

  /**
   * 作者：胡月
   * 创建日期：2017-12-20
   * 功能：tab切换
   */
  switchTab = (key) => {
    this.setState({
      tab_key: key
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-12-06
   * 功能：申请人，被退回后，可终止流程
   */
  terminate = () => {
    this.setState({
      terminateVisible:true
    });
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
   * 作者：胡月
   * 创建日期：2017-12-20
   * 功能：点击退回按钮，弹出退回原因弹窗
   */
  handleReturnClick = () => {
    const {dispatch} = this.props;
    dispatch({
      type:'deliverableCheck/backShowModal'
    });
  };


  /**
   * 作者：胡月
   * 创建日期：2017-11-23
   * 功能：退回原因弹窗关闭
   */
  handleModalCancelClick =() => {
    const {dispatch} = this.props;
    dispatch({
      type:'deliverableCheck/backHideModal'
    });
  };

  /**
   * 作者：胡月
   * 创建日期：2017-12-20
   * 功能：点击确定按钮，进行退回
   * @param value 原因内容
   */
  handleModalOkClick = (value) => {
    const {dispatch} = this.props;
    dispatch({
      type:'deliverableCheck/deliverableManageReturn',
      payload:{
        arg_proj_id:this.props.projId,
        arg_proj_name:this.props.projName,
        arg_proj_uid:this.props.projUid,
        arg_opt_byid:this.props.userid,
        arg_opt_byname:this.props.username,
        arg_opt_content:value.reson,
        arg_business_batchid:this.props.titleDetail.business_batchid,
        arg_check_id:this.props.checkId,
        arg_check_batch_id:this.props.titleDetail.check_batch_id,
        arg_exe_id:this.props.titleDetail.exe_id,
        arg_wf_task_id:this.props.titleDetail.wf_task_id,
        arg_link_id:this.props.titleDetail.link_id,
        arg_link_name:this.props.titleDetail.link_name,
        arg_role_id:this.props.titleDetail.role_id,
        arg_task_uuid:this.props.taskUuid,
        arg_task_batchid:this.props.taskBatchid,
        arg_task_wf_batchid:this.props.taskWfBatchid,
        arg_mile_submit_byid:this.props.mileSubmitById,
        arg_mile_submit_byname:this.props.mileSubmitByName,
      }
    });
  };

  /**
   * 作者：胡月
   * 创建日期：2017-12-20
   * 功能：点击通过按钮，弹出是否通过的弹窗
   */
  showConfirm = () => {
    let thisMe = this;
    confirm({
      title: '确定通过审核吗？',
      onOk() {
        thisMe.handleApprovalClick();
      }
    });
  };

  /**
   * 作者：胡月
   * 创建日期：2017-12-20
   * 功能：点击确定按钮，审核通过
   */
  handleApprovalClick = () => {
    const {dispatch} = this.props;
    dispatch({
      type:'deliverableCheck/deliverableManageApprove',
      payload:{
        arg_proj_id:this.props.projId,
        arg_proj_name:this.props.projName,
        arg_proj_uid:this.props.projUid,
        arg_opt_byid:this.props.userid,
        arg_opt_byname:this.props.username,
        arg_business_batchid:this.props.titleDetail.business_batchid,
        arg_check_id:this.props.checkId,
        arg_check_batch_id:this.props.titleDetail.check_batch_id,
        arg_exe_id:this.props.titleDetail.exe_id,
        arg_wf_task_id:this.props.titleDetail.wf_task_id,
        arg_link_id:this.props.titleDetail.link_id,
        arg_link_name:this.props.titleDetail.link_name,
        arg_role_id:this.props.titleDetail.role_id,
        arg_task_uuid:this.props.taskUuid,
        arg_task_batchid:this.props.taskBatchid,
        arg_task_wf_batchid:this.props.taskWfBatchid,
        arg_mile_submit_byid:this.props.mileSubmitById,
        arg_mile_submit_byname:this.props.mileSubmitByName,
      }
    });
  };

  //点击返回按钮，返回到待办列表
  goBack = ()=> {
    history.go(-1);
  };

  //退回之后，提交交付物的修改
  submitModify = () => {
    //提交时，先判断交付物类别下是否存在没有文件的交付物
    let {milesList} = this.props;
    let isSubmit = true;     //判断是否让提交
    if(milesList.length){
      for(let i = 0; i < milesList.length; i++){
        let findEmptyFile = false;
        if('deliverables' in milesList[i] && milesList[i].deliverables !== 'NaN'){
          let deliverables = milesList[i].deliverables.replace(/\:\"\[+/g,':[');
          deliverables = JSON.parse(deliverables.replace(/\]\"\}/g,']}'));
          for(let j = 0; j < deliverables.length; j++){
            if(deliverables[j].files === undefined || deliverables[j].files === 'NaN'){
              findEmptyFile = true;
              message.error('交付物必须有文件才能提交');
              break;    //如果交付物文件没有，终止对剩余交付物的循环判断
            }
          }
          //如果交付物存在空文件，终止外层循环
          if(findEmptyFile === true){
            isSubmit = false;
            break;
          }
        }else{
          //里程碑没有交付物类别，不让提交
          message.error('里程碑没有交付物类别，不让提交');
          isSubmit = false;
          break;
        }
      }
    }else{
      isSubmit = false;    //如果里程碑长度为0，则不让提交
    }
    //通过判断后，如果能够提交
    if(isSubmit === true){
      const {dispatch} = this.props;
      dispatch({
        type: 'deliverableCheck/deliverableManageSubmit',
        payload: {
          arg_opt_byid: this.props.userid,
          arg_opt_byname: this.props.username,
          arg_proj_id: this.props.projId,
          arg_proj_name: this.props.projName,
          arg_proj_uid: this.props.projUid,
          arg_business_id: this.props.businessId,
          arg_mile_uid_array: this.props.selectedMiles,
          arg_business_batchid: this.props.titleDetail.business_batchid,
          arg_check_id: this.props.checkId,
          arg_check_batch_id: this.props.titleDetail.check_batch_id,
          arg_exe_id: this.props.titleDetail.exe_id,
          arg_wf_task_id: this.props.titleDetail.wf_task_id,
          arg_link_id: this.props.titleDetail.link_id,
          arg_link_name: this.props.titleDetail.link_name,
          arg_role_id: this.props.titleDetail.role_id,
          arg_task_uuid: this.props.taskUuid,
          arg_task_batchid: this.props.taskBatchid,
          arg_task_wf_batchid: this.props.taskWfBatchid,
        }
      });
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：终止流程
   * @param flag 确定标志位
   */
  hideTerminateModal = (flag) => {
    if (flag === 'confirm') {
      if (this.state.terminateValue.trim() === '') {
        message.error('终止原因不能为空');
        return;
      } else {
        this.props.dispatch({
          type:'deliverableCheck/terminate',
          payload:{
            arg_proj_id:this.props.projId,
            arg_proj_name: this.props.projName,
            arg_proj_uid:this.props.projUid,
            arg_opt_byid:this.props.userid,
            arg_opt_byname:this.props.username,
            arg_opt_content:this.state.terminateValue, //终止流程原因，必传
            arg_business_batchid:this.props.titleDetail.business_batchid,
            arg_business_id:this.props.businessId,
            arg_check_id:this.props.checkId,
            arg_check_batch_id:this.props.titleDetail.check_batch_id,
            arg_exe_id:this.props.titleDetail.exe_id,
            arg_task_uuid:this.props.taskUuid,
            arg_task_batchid:this.props.taskBatchid,
            arg_task_wf_batchid:this.props.taskWfBatchid,
          }
        });
      }
    }
    this.setState({
      terminateVisible:false
    });
  };

  render(){
    const {dispatch,roleTag,projName,mileSubmitByName,preLinkName,linkName,returnReason,
      flag,taskUuid,modalVisible,defaultMilesKey,milesList,projChangeLog,deliveryCategoryList,loading} = this.props;
    let operations;
    if(typeof(taskUuid) !== 'string'){
      operations = <div>
        <Button type="primary" style={{marginRight:10}} onClick={this.goBackCheckTab}>返回</Button>
      </div>;
    }else{
      if(flag === '0') {
        if (roleTag === '4' && typeof(taskUuid) == 'string') {
          operations = <div>
            <Button type="primary" style={{marginRight:10}} onClick={this.showConfirm}>通过</Button>
            <Button type="primary" style={{marginRight:10}} onClick={this.handleReturnClick}>退回</Button>
            <ResonModal okClick={this.handleModalOkClick} cancelClick={this.handleModalCancelClick} isShow={modalVisible}></ResonModal>
          </div>;
        } else if (roleTag == '3'&& typeof(taskUuid) == 'string') {
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
            <Button type="primary" style={{marginRight:10}} onClick={this.submitModify}>提交</Button>
            <Button type="primary" style={{marginRight:10}} onClick={this.goBack}>返回</Button>
          </div>;
        }
      }else{
        operations = <div> </div>;
      }
    }
    return (
      <Spin tip={config.PROCESSING_DATA} spinning={this.props.loading}>
        <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{typeof(taskUuid) == 'string' ? (flag == '0' ? '待办任务详情' : (flag == '1' ? '已办任务详情' : (flag=='3'? '办结任务详情' : '任务详情'))) :'审核环节'}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{textAlign:'center',fontWeight:'bold',fontSize:28,marginBottom:'8px'}}>{projName}</div>
          {roleTag=='4'?
            <div style={{textAlign:'center',fontSize:16,marginBottom:'5px'}}>
              <span>项目经理：{mileSubmitByName}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>上一环节：{preLinkName}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>当前环节：{linkName}</span>
            </div>
            :
            <div style={{textAlign:'center',fontSize:16,marginBottom:'5px'}}>
              {this.props.returnReasonFlag === '1' ?
                <span>退回原因：{returnReason}</span>
                :
                null
              }
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>上一环节：{preLinkName}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>当前环节：{linkName}</span>
            </div>
          }
          <Tabs tabBarExtraContent={operations} onTabClick={this.switchTab} activeKey={this.state.tab_key}>
            <TabPane tab="交付物" key="1">
              {roleTag=='4'?
                <DeliverableCheck ref="deliverableCheck"
                                  dispatch={dispatch}
                                  defaultMilesKey={defaultMilesKey}
                                  milesList={milesList}
                                    />
                  :
                <DeliverableModify ref="deliverableModify"
                                   dispatch={dispatch}
                                   milesList={milesList}
                                   deliveryCategoryList={deliveryCategoryList}
                                   defaultMilesKey={defaultMilesKey}
                                   loading={loading}



                />
              }

            </TabPane>
            <TabPane tab="审批环节" key="2">
                <DeliverableExamineLink ref="deliverableExamineLink"
                                        dispatch={dispatch}
                                        projChangeLog={projChangeLog}

                />
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    );
  }

}
function mapStateToProps(state) {
  return {
    loading:state.loading.models.deliverableCheck,
    ...state.deliverableCheck
  }
}

export default connect(mapStateToProps)(DeliverableManage);
