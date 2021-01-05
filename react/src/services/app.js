/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：主框架服务
 */
import request,{reqwest} from '../utils/request';

// 获取用户访问域名
export async function getUserIPInfo () {
    return request('/auth/getUserIPInfo/get')
}
// 修改密码
export async function modifyPwd (params) {
    //return request('/microservice/serviceauth/user_update_pwd', params)
  return request('/microservice/allserviceauth/serviceauth/UpdatePwd', params)
}
// 重置密码
export async function reset (params) {
  /*
  * 修改：李杰双
  * 说明：密码重置服务替换
  * */
    //return request('/microservice/allserviceauth/serviceauth/UserResetPwdNewPwd', params)
    return request('/microservice/allserviceauth/serviceauth/UserResetPwdSendEmail', params)

}
// 忘记密码
export async function forgot (params) {
    return request('/microservice/allserviceauth/serviceauth/UserResetPwdSendEmailReactor', params)
}
//
export async function getTopSubSystem (params) {
    return request('/microservice/serviceauth/usergettopsubsystem',params)
}
//
export async function getSubSystemAndModule (params) {
    return request('/microservice/serviceauth/usergetsubsystemandmodule',params)
}
// 是否登陆
export async function isLogin () {
    return request('/auth/sessionLogin/isLogin')
}
// 登录
export async function login (params) {
    return request('/auth/relogin/logincheck', params)
}
// 获取用户信息
export async function getinfo (params) {
    return request('/microservice/serviceauth/p_usergetmodules', params)
}
// 登出
export async function logout () {
    return request('/auth/logout')
}
// 锁屏
export async function lock () {
    return request('/auth/logout')
}
// 获取头像列表
export async function getAvatarList (params) {
    return request('/microservice/serviceauth/all_avatar_query', params)
}
// 修改头像
export async function modifyAvatar (params) {
    return request('/microservice/serviceauth/gateway_insert_update', params)
}
// 重置头像
export async function resetAvatar (params) {
    return request('/microservice/serviceauth/reset_auth_avatar', params)
}
// 修改主题
export async function changeTheme (params) {
    return request('/microservice/serviceauth/gateway_insert_update_theme', params)
}
// 上传文件
export async function fileUpload (params) {
    return reqwest('/filemanage/fileupload', params)
}
