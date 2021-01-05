/**
 * 作者：贾茹
 * 创建日期：2019-5-9
 * 邮箱：m18311475903@163.com
 * 文件说明：dw服务配置
 */
import request from '../../utils/request';
//erp核心库OU获取
export function dwErp(params) {
  return request('/microservice/cos/get_ou_code_name_list',params);
}

//erp核心库项目名称获取
export function dwErphandleProName(params) {
  return request('/microservice/cos/get_proj_code_name_list',params);
}

//获取erp核心表格数据
export function dwErpTableData(params) {
  return request('/microservice/dw_db/get_dw_db_erp_info',params);
}


//获取报账系统数据
export function dwExpenseTableData(params) {
  return request('/microservice/dw_db/expense_account_list_query',params);
}
