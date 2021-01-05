/**
 * 作者：李杰双
 * 日期：2017/10/24
 * 邮件：282810545@qq.com
 * 文件说明：问卷调查服务
 */
import request from '../../utils/request';


export function q_ques_query(param) {
  return request('/microservice/welfare/q_ques_query_new',param);
}
export function ques_select(param) {
  return request('microservice/welfare/q_ques_statistics_select',param);
}
export function ques_query_count(param) {
  return request('/microservice/welfare/q_ques_query_count',param);
}
export function statistics_text(param) {
  return request('/microservice/welfare/q_ques_statistics_text',param);
}
export function statistics_answered(param) {
  return request('/microservice/welfare/q_user_statistics_answered_bydept',param);

}

export function question_list_query(param) {
  return request('/microservice/welfare/q_question_list_query',param);
}
export function QuestionSubmit(param) {
  return request('/microservice/allwelfare/questionnaire/QuestionnaireSaveOrSubmit',param);
}
export function statistics_answered_detail(param) {
  return request('/microservice/welfare/q_user_statistics_answered_detail',param);
}
export function statistics_select(param) {
  return request('/microservice/welfare/q_ques_statistics_select',param);
}

export function statistics_select_text(param) {
  return request('/microservice/welfare/q_ques_statistics_select_text',param);
}
