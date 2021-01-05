/**
 * 作者：金冠超
 * 创建日期：2019-07-18
 * 邮件：jingc@itnova.com.cn
 * 文件说明：项目配置-差旅部门设置 所有server数据
 */
import request from '../../../utils/request';
//获取基本表格数据
export function getItemList(param) {
    return request('/microservice/project/departmental_travel_expenses_query', param);
  }
//获取部门下拉列表数据
export function getDeptList(param) {
    return request('/microservice/project/project_common_get_all_pu_department', param);
  }
//添加新信息
export function addNewMessage(param) {
    return request('/microservice/project/departmental_travel_expenses_insert', param);
  }
//删除信息
export function delMessage(param) {
    return request('/microservice/project/departmental_travel_expenses_delete', param);
  }
//详情信息
export function detailsMessage(param) {
    return request('/microservice/project/departmental_travel_expenses_detial_query', param);
  }
//修改信息
export function updateMessage(param) {
  return request('/microservice/project/departmental_travel_expenses_update', param);
}
  
  
  