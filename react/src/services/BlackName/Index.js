/**
 * 作者：任华维
 * 日期：2017-10-21 
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：黑名单查询服务
 */
import request from '../../utils/request';
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：黑名单查询
 * @param userID 用户手机号
 */
export function query({ userID }) {
  return request(`/api/blackname/${userID}`);
}
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：服务信息查询
 */
export function report() {
  return request(`/api/report`);
}
