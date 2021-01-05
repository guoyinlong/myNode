/**
 * 文件说明: 培训查询导出界面
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-12-04
 **/
import Cookie from "js-cookie";
import * as trainService from "../../services/train/trainService";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
import { message } from "antd";

const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}
const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace: 'trainClassInfoModel',
  state: {
    deptList: [],
    trainClassFullData: [],
    trainClassDetailData: [],
    personList: [],
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    *getDept({ arg_param }, { call, put }) {
      //从服务获取所属OU下的部门列表
      let postData_getDept = {
        arg_ou_id: Cookie.get("OUID"),
      };
      const getDeptData = yield call(trainService.deptDataQuery, postData_getDept);
      if (getDeptData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            deptList: getDeptData.DataRows,
          }
        });
      };

      //从服务获取人群
      let postData_getPersonGroup = {
        arg_state: '1',
        arg_ou_id: Cookie.get("OUID"),
      };
      const getGroupData = yield call(trainService.getGroupList, postData_getPersonGroup);
      if (getGroupData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            personList: getGroupData.DataRows,
          }
        });
      }
    },

    //查询
    *trainClassInfoQuery({ formData }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          trainClassFullData: [],
          trainClassDetailData: []
        }
      });
      let queryParam = {
        arg_ou_id: formData.arg_ou_id,
        arg_curr_year: formData.arg_curr_year,
        arg_dept_id: formData.arg_dept_id,
        arg_type_flag: formData.arg_type_flag,
        arg_person_flag: formData.arg_person_flag,
      };
      const fullData = yield call(trainService.trainPersonalInfoQuery, queryParam);
      if (fullData.RetCode === '1') {
        if (fullData.DataRows[0]) {
          if (formData.arg_type_flag === '0') {
            yield put({
              type: 'save',
              payload: {
                trainClassDetailData: fullData.DataRows,
                trainClassFullData: [],
              }
            });
          } else if (formData.arg_type_flag === '1') {
            yield put({
              type: 'save',
              payload: {
                trainClassDetailData: [],
                trainClassFullData: fullData.DataRows,
              }
            });
          }
        } else {
          message.info("无查询结果！");
        }
      } else {
        message.error('查询出错！');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/trainStatistic/train_class_info') {
          /**培训配置统计查询 */
          dispatch({ type: 'getDept', query });
        }
      });
    }
  },
}
