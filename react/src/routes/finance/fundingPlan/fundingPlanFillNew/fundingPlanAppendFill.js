/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：资金计划追加填报
 */
import React from 'react';
import {connect } from 'dva';
import FundingPlanFill from './fundingPlanFill';
class FundingPlanAppendFill extends React.Component{
  constructor(props){
    super(props)
  }
  render() {
    return (
      <FundingPlanFill  flag='append' dispatch={this.props.dispatch} data={this.props}/>
    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.fundingPlanFillNew,
    ...state.fundingPlanFillNew
  };
}
export default connect(mapStateToProps)(FundingPlanAppendFill);
