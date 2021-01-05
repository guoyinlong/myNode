/**
 *  作者: 胡月
 *  创建日期: 2017-9-11
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：基本信息新增时，把第一次保存和后面保存必须要传递的参数写成两个函数
 */
import Cookie from 'js-cookie';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';

//之后更新时，需要传递flag、info_form_id
export function projInfoTrans(projOldInfo, basicInfoFlag) {
  let converData = {};
  converData.info_form_id = projOldInfo.info_form_id;
  converData.flag = basicInfoFlag;
  return converData;
}

//第一次插入时，需要传项目经理（mgr_name，mgr_id成对出现），flag
export function projInfoFirst(basicInfoFlag) {
  let converData = {};
  converData.createdby_name = Cookie.get('username');
  converData.flag = basicInfoFlag;
  return converData;
}
