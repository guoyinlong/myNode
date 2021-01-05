/**
 * 文件说明：人才管理服务
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-09-24
 * */
import request from '../../utils/request';

//人才信息校验查询
export function checkPersonInfo(param){
  return request('/microservice/talent/talent_check_person_info_query',param);
}

//人才信息查询
export function talentQuery(param){
  return request('/microservice/talent/talent_info_query',param);
}

//人才信息个人详情查询
export function talentDetailQuery(param){
  return request('/microservice/talent/talent_person_detail_info_query',param);
}

//人才信息批量导入执行
export function importTalentDataSubmit(param){
  return request('/microservice/talent/talent_import_person_info_submit',param);
}

//人才信息校验回退
export function checkPersonInfoDelete(param){
  return request('/microservice/talent/talent_check_person_info_delete',param);
}

//人才管理员角色查询
export function getRole(param){
  return request('/microservice/talent/talent_role_query',param);
}


