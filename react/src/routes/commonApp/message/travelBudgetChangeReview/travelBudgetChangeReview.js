/**
 * 作者：薛刚
 * 创建日期：2018-10-29
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现差旅费预算变更审核页面
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Modal, Input, message, Spin } from 'antd';
import styles from './travelBudgetChangeReview.less';
import TravelBudget from './travelBudgetChange.js';

const TextArea = Input.TextArea;
class travelBudgetChangeReview extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      return_visible: false,
      return_reason: '',
      approval_visible: false,
      approval_reason: '',
    }
  }

  // 显示退回模态框
  showReturnModal = () => {
    this.setState({
      return_visible: true,
    });
  }

  // 隐藏退回模态框
  hideReturnModal = () => {
    this.setState({
      return_visible: false,
    });
  }

  // 设置退回原因
  setReturnReason = (e) => {
    this.setState({
      return_reason: e.target.value
    });
  };

  // 显示审核模态框
  showApprovalModal = () => {
    this.setState({
      approval_visible: true,
    });
  }

  // 隐藏审核模态框
  hideApprovalModal = () => {
    this.setState({
      approval_visible: false,
    });
  }

  // 设置退回原因
  setApprovalReason = (e) => {
    this.setState({
      approval_reason: e.target.value
    });
  };

  onApproval = (proj) => {
    const urlParam = this.props.location.query;
    const task_info = {//待办信息,必传
      arg_task_uuid: urlParam.arg_task_uuid,//待办id,必传
      arg_task_batchid: urlParam.arg_task_batchid,//待办批次id,必传
      arg_task_wf_batchid: urlParam.arg_task_wf_batchid,//待办流程批次id,必传
    };
    const params = {
      arg_approve_reason: this.state.approval_reason,
      arg_proj_id: urlParam.arg_proj_id,//必传
      arg_proj_uid: urlParam.arg_proj_uid,//必传
      arg_proj_name: proj.proj_name,//必传
      arg_pu_dept_id: proj.pu_dept_id,//归口部门id，必传
      arg_bussiness_batchid: proj.bussiness_batchid,//check_form关联id，必传，
      arg_task_info: JSON.stringify(task_info),
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'travelBudgetChangeReview/projTravelBudgetApproval',
      payload: params
    })
  }

  onReturn = (proj) => {
    if(this.state.return_reason.trim() === ''){
      message.error('退回原因不能为空');
      return;
    }
    const urlParam = this.props.location.query
    const task_info = {//待办信息,必传
      arg_task_uuid: urlParam.arg_task_uuid,//待办id,必传
      arg_task_batchid: urlParam.arg_task_batchid,//待办批次id,必传
      arg_task_wf_batchid: urlParam.arg_task_wf_batchid,//待办流程批次id,必传
    };
    const params = {
      arg_return_reason: this.state.return_reason,
      arg_proj_id: urlParam.arg_proj_id,//必传
      arg_proj_uid: urlParam.arg_proj_uid,//必传
      arg_proj_name: proj.proj_name,//必传
      arg_bussiness_batchid: proj.bussiness_batchid,//check_form关联id，必传，
      arg_task_info: JSON.stringify(task_info),
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'travelBudgetChangeReview/projTravelBudgetReturn',
      payload: params
    })
  }

  render() {
    const { projTravelBudgetList, projTravelBudgetHistoryList } = this.props;
    if(projTravelBudgetList.hasOwnProperty('DataRows')) {
      const returnModal = (
        <Modal
          title="退回原因"
          visible={this.state.return_visible}
          onOk={() => this.onReturn(projTravelBudgetList)}
          onCancel={this.hideReturnModal}
          okText="确认"
          cancelText="取消"
          >
          <div className={styles.modal_mark_required}>{"*"}</div>
          <div className={styles.modal_input_textarea}>
          <TextArea
            placeholder="最多输入200字"
            maxLength='200'
            rows={4}
            value={this.state.return_reason}
            onChange={this.setReturnReason}
            />
          </div>
        </Modal>
      );
      const apprvalModal = (
        <Modal
          title="通过备注"
          visible={this.state.approval_visible}
          onOk={() => this.onApproval(projTravelBudgetList)}
          onCancel={this.hideApprovalModal}
          okText="确认"
          cancelText="取消"
          >
          <div className={styles.modal_input_textarea}>
          <TextArea
            placeholder="填写审核备注信息，非必填，最多输入200字"
            maxLength='200'
            rows={4}
            value={this.state.approval_reason}
            onChange={this.setApprovalReason}
            />
          </div>
        </Modal>
      );
      let operations = projTravelBudgetList.DataRows.length > 0 && (
          <div className={styles.button}>
            <Button onClick={this.showReturnModal}>退回</Button>
            {returnModal}
            <Button type="primary" onClick={this.showApprovalModal}>通过</Button>
            {apprvalModal}
          </div>
        );
      const params = this.props.location.query;
      if(params.arg_task_status && params.arg_task_status === '3') {
        operations = null;
      }
      return (
        <Spin spinning={this.props.loading}>
          <TravelBudget
            dataSrc={projTravelBudgetList}
            history={projTravelBudgetHistoryList}
            reviewOpt={operations}
            status={params.arg_task_status}
            projId={params.arg_proj_id}
            dispatch={this.props.dispatch}
            />
        </Spin>
      )
    }
    else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
      loading: state.loading.models.travelBudgetChangeReview,
      ...state.travelBudgetChangeReview
    }
}

export default connect(mapStateToProps)(travelBudgetChangeReview);
