/**
 * 作者：薛刚
 * 创建日期：2018-10-29
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现差旅费预算变更审核页面
 */
import React from 'react';
import { connect } from 'dva';
import styles from './travelBudgetChangeReview.less';
import TravelBudget from './travelBudgetChange.js';

class travelBudgetChangeEnd extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const { projTravelBudgetList, projTravelBudgetHistoryList } = this.props;
    const params = this.props.location.query;
    if(projTravelBudgetList.hasOwnProperty('DataRows')) {
      return (
        <TravelBudget
          dataSrc={projTravelBudgetList}
          history={projTravelBudgetHistoryList}
          status={params.arg_task_status}
          projId={params.arg_proj_id}
          dispatch={this.props.dispatch}
          />
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

export default connect(mapStateToProps)(travelBudgetChangeEnd);
