/**
 * 作者：刘东旭
 * 日期：2017-11-23
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：工时管理服务
 */
import request from '../../../utils/request';

//本周工时查询
export function currentWeekSearch(param) {
  return request('/microservice/gongshi/currentweeksearch', param);
}

//用户可用项目列表
export function fillCheckProject(param) {
  return request('/microservice/gongshi/inuseprojectsearch', param);
}

//用户可用项目活动类型
export function fillActivityType(param) {
  return request('/microservice/timesheet/timesheet_search_person_activity', param);
}

// 本周工时查询
export function queryThisWeekDataS(param) {
  return request('/microservice/timesheet/timesheet_fillin_current_week_query', param);
}

// 补录工时查询
export function queryMakeUpDataS(param) {
  return request('/microservice/timesheet/timesheet_makeup_hours_query', param);
}

// 查询全部的活动类型
export function queryAllActivities(param) {
  return request('/microservice/timesheet/timesheet_fillin_activity_query', param);
}

// 查询补录工时的时间列表
export function queryAllTimeList(param) {
  return request('/microservice/timesheet/timesheet_makeup_time_query', param);
}

//保存工时
export function saveTimeS(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetFillinSave', param);
}

//提交工时
export function submitTimeS(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetFillinSubmit', param);
}

// 补录工时保存
export function saveMakeUpTimeS(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetMakeupFillinSave', param);
}

// 补录工时提交
export function submitMakeUpTimeS(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetMakeupFillinSubmit', param);
}

// 工时退回的删除
export function returnTimeDeleteS(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetDelete', param);
}


//补录工时时间周期查询2.1
export function searchMakeUpTime(param) {
  return request('/microservice/timesheet/timesheet_search_makeup_time', param);
}

//补录工时数据查询2.2
export function makeUpWeekSearch(param) {
  return request('/microservice/timesheet/timesheet_search_makeup_hours', param);
}

//退回工时数据查询
export function sendBackSearch(param) {
  return request('/microservice/timesheet/timesheet_search_back_hours', param);
}

// 填报工时退回的数据
export function queryReturnTimeS(param) {
  return request('/microservice/timesheet/timesheet_retract_hours_query', param);
}
//判断是否满足填报工时得条件
export function timesheetCheckQuery(param) {
  return request('/microservice/timesheet/timesheet_fillin_current_week_check_query', param)
}