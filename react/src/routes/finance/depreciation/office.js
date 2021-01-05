/**
 * 作者：张楠华
 * 日期：2019-7-15
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：折旧分摊办公软件
 */
import React from 'react';
import { connect } from 'dva';
import Common from './commonNew'
class Office extends React.Component{
  constructor(props){
    super(props)
  }
  render() {
    return (
      <Common state={this.props} loading={this.props.loading} dispatch={this.props.dispatch} modelsSpace = 'office'/>
    );
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.office,
    ...state.office
  };
}
export default connect(mapStateToProps)(Office);
