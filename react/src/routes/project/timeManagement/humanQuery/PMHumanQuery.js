/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：项目经理人员查询界面。
 */
import React from 'react';
import {connect } from 'dva';
import HumanQuery from './humanQuery'
/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  功能：部门经理人员查询界面。
 */
class PMHumanQuery extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    const {list,projList,loading,dispatch,tag,DetailList,rowCount,isMgr,DetailList1} = this.props;
    return (
      <HumanQuery list={list} projectList = {projList} DetailList={DetailList} loading={loading} dispatch={dispatch} tag={tag} rowCount={rowCount} isMgr={isMgr} DetailList1={DetailList1}/>
    )
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.humanQuery,
    ...state.humanQuery,
  };
}
export default connect(mapStateToProps)(PMHumanQuery);
