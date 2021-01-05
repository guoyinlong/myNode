/**
 * 文件说明：培训管理服务
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-10-09
 * */
import request from '../../../utils/request';

//查询具体的统计数据
export function trainStatisticDataQuery(param){
  return request('/microservice/train/train_statistic_data_query',param);
}