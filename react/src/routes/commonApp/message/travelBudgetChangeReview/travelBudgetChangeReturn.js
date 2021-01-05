/**
 * 作者：薛刚
 * 创建日期：2018-10-29
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现差旅费预算变更审核页面
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Modal, Input, message, Spin } from 'antd';
import styles from './travelBudgetChangeReview.less';
import TravelBudget from './travelBudgetChange.js';

const TextArea = Input.TextArea;
class travelBudgetChangeReturn extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      reason: '',
    }
  }

  // 显示终止模态框
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  // 隐藏终止模态框
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  // 设置终止原因
  setTerminateReason = (e) => {
    this.setState({
      reason: e.target.value
    });
  };

  // 终止流程
  onTerminate = (proj) => {
    if(this.state.reason.trim() === ''){
      message.error('终止流程原因不能为空');
      return;
    }

    const urlParam = this.props.location.query;
    const task_info = {//待办信息,必传
      arg_task_uuid: urlParam.arg_task_uuid,//待办id,必传
      arg_task_batchid: urlParam.arg_task_batchid,//待办批次id,必传
      arg_task_wf_batchid: urlParam.arg_task_wf_batchid,//待办流程批次id,必传
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'travelBudgetChangeReview/projTravelBudget' +
      'Terminate',
      payload: {
        arg_terminate_reason: this.state.reason,
        arg_bussiness_batchid: proj.bussiness_batchid,
        arg_proj_id: urlParam.arg_proj_id,
        arg_task_info: JSON.stringify(task_info),
      }
    });
  }

  // 退回修改
  onModify = () => {
    const urlParam = this.props.location.query;
    const task_info = {//待办信息,必传
      arg_task_uuid: urlParam.arg_task_uuid,//待办id,必传
      arg_task_batchid: urlParam.arg_task_batchid,//待办批次id,必传
      arg_task_wf_batchid: urlParam.arg_task_wf_batchid,//待办流程批次id,必传
    };
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: 'travelBudgetChangeReturnModify',
      query: {
        arg_proj_id: urlParam.arg_proj_id,
        arg_check_id: urlParam.arg_check_id,
        arg_task_info: JSON.stringify(task_info),
      }
    }));
  }

  render() {
    const { projTravelBudgetList, projTravelBudgetHistoryList } = this.props;
    if(projTravelBudgetList.hasOwnProperty('DataRows')) {
      const terminateModal = (
        <Modal
          title="终止流程原因"
          visible={this.state.visible}
          onOk={() => this.onTerminate(projTravelBudgetList)}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          >
          <div className={styles.modal_mark_required}>{"*"}</div>
          <div className={styles.modal_input_textarea}>
          <TextArea
            placeholder="最多输入200字"
            maxLength='200'
            rows={4}
            value={this.state.reason}
            onChange={this.setTerminateReason}
            />
          </div>
        </Modal>
      );
      const operations = projTravelBudgetList.DataRows.length > 0 && (
          <div className={styles.operations}>
            <Button type="primary" onClick={this.showModal}>终止流程</Button>
            {terminateModal}
            <Button type="primary" onClick={this.onModify}>修改</Button>
          </div>
        );
      const params = this.props.location.query;
      return (
        <Spin spinning={this.props.loading}>
          <TravelBudget
            dataSrc={projTravelBudgetList}
            history={projTravelBudgetHistoryList}
            returnOpt={operations}
            projId={params.arg_proj_id}
            dispatch={this.props.dispatch}
            />
        </Spin>
      )
    }else {
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

export default connect(mapStateToProps)(travelBudgetChangeReturn);
