/**
 * 文件说明：题库相关服务
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
import request from '../../utils/request';
//岗位信息查询
export function positionquery(params) {
  return request('/microservice/standardquery/questions/positiontransquery',params);
}
//岗位信息更新
export function positionupdate(params) {
  return request('/microservice/transopts/questions/positiontransupdate',params);
}
//试题类型信息查询
export function typequery(params) {
  return request('/microservice/standardquery/questions/typetransquery',params);
}
//章节信息查询
export function sectionquery(params) {
  return request('/microservice/standardquery/questions/sectiontransquery',params);
}
//难易程度信息查询
export function difficultyquery(params) {
  return request('/microservice/standardquery/questions/difficultytransquery',params);
}
//试题信息查询
export function questionsquery({arg_section,arg_post,arg_type}) {
  return request('/microservice/allexamine/questions/questionselect',{arg_section,arg_post,arg_type});
}
//试题信息抽取
export function questionsextract({arg_post,arg_condition}) {
  return request('/microservice/allexamine/questions/questionrandomextract',{arg_post,arg_condition});
}
//试题信息导出查询
export function questionsextractselect({arg_batch}) {
  return request('/microservice/allexamine/questions/questionexportselect',{arg_batch});
}
//试题可选数量查询
export function questionstoselectcount({arg_post,arg_part,arg_type,arg_difficulty,arg_count}) {
  return request('/microservice/questions/questioncounts',{arg_post,arg_part,arg_type,arg_difficulty,arg_count});
}
//试题状态修改
export function questionstateupdate({arg_param_tag,arg_state,arg_question_uid,arg_partrelate_uid,arg_classifyrelate_uid}) {
  return request('/microservice/questions/switchstate',{arg_param_tag,arg_state,arg_question_uid,arg_partrelate_uid,arg_classifyrelate_uid});
}


