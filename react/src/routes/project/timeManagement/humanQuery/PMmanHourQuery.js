/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：工时管理普通角色界面。
 */
import React from 'react';
import {connect } from 'dva';
import ManHourQuery from './manHourQuery'
/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  功能：工时管理普通角色界面
 */
class PMmanHourQuery extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <ManHourQuery data={this.props} loading={this.props.loading}/>
    )
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.manHourQuery,
    ...state.manHourQuery,
  };
}
export default connect(mapStateToProps)(PMmanHourQuery);
