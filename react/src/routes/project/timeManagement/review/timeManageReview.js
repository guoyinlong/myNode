/**
 * 作者：张楠华
 * 日期：2017-11-21
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现工时审核界面展示
 */
import React from 'react';
import {connect} from 'dva';
import TimeReview from './review'

class TimeManage extends React.Component{
  render(){
    const {list,timeNum,titleList,loading,dispatch,tag,resetStateData,allDetail,titleTime,projInfo} = this.props;
    return (
      <TimeReview list={list} timeNum = {timeNum} titleList={titleList} loading={loading} dispatch={dispatch} tag={tag} resetState={resetStateData} allDetail={allDetail} titleTime={titleTime} projInfo={projInfo}/>
    )
  }
}
function mapStateToProps (state) {
  const {list,timeNum,titleList,tag,resetStateData,allDetail,titleTime,projInfo} = state.review;
  return {
    loading: state.loading.models.review,
    list,
    timeNum,
    titleList,
    tag,
    resetStateData,
    allDetail,
    titleTime,
    projInfo
  };
}
export default connect(mapStateToProps)(TimeManage);
