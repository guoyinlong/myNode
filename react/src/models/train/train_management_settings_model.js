/**
 * 文件说明: 培训查询导出界面
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-12-04
 **/
import Cookie from "js-cookie";
import * as trainService from "../../services/train/trainService";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
import * as promoteService from "../../services/rankpromote/promoteService";
import {message} from "antd";
import * as hrService from "../../services/hr/hrService";
const auth_ou = Cookie.get('OU');

let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}
const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace: 'trainManagementSettingsModel',
  state: {
    deptList: [],
    trainClassFullData: [],
    trainClassDetailData: [],
    groupList: []
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveGroup(state, { groupList: DataRows }) {
      return { ...state, groupList: DataRows };
    },
  },
  effects: {
    *getGroupList({ arg_param }, { call, put }) {
      let postData_getGruop = {};
      postData_getGruop["arg_state"] = '1';
      const getGroupData = yield call(trainService.getGroupList, postData_getGruop);
      console.log(')))))))))))))))))))');
      console.log(getGroupData);
      console.log(')))))))))))))))))))');
      yield put({
        type: 'saveGroup',
        groupList: getGroupData.DataRows,
      });
    },
    //查询
    *initQuery({query}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          trainManagementData: [],
        }
      });
      let queryParam = {
        arg_type: '0',
        arg_ou_id : Cookie.get('OUID'),

      };
      const fullData = yield call(trainService.trainManagementQuery, queryParam);
      if (fullData.RetCode === '1') {
        if (fullData.DataRows[0]) {
          yield put({
            type: 'save',
            payload: {
              trainManagementData: fullData.DataRows,
            }
          });
        } else {
          message.info("无查询结果！");
        }
      } else {
        message.error('查询出错！');
      }
    },
    *trainManagementQuery({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          trainManagementData: [],
        }
      });
      let queryParam = {
        arg_type: query.arg_type,
        arg_ou_id : Cookie.get('OUID'),
      };
      const fullData = yield call(trainService.trainManagementQuery, queryParam);
      if (fullData.RetCode === '1') {
        if (fullData.DataRows[0]) {
          yield put({
            type: 'save',
            payload: {
              trainManagementData: fullData.DataRows,
            }
          });
        } else {
          message.info("无查询结果！");
        }
      } else {
        message.error('查询出错！');
      }
    },
    *trainManagementUpdate({arg_param}, {call, put}) {
      const updateManageData = yield call(trainService.trainManagementSettings,arg_param);
      console.log('**********************');
      console.log(arg_param);
      console.log('**********************');
      if(updateManageData.RetCode === '1'){
        message.info("修改成功！");
        yield put({
          type: 'initQuery'
        });
      }else{
        message.info(updateManageData.RetVal);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/trainManage/trainManagementSettings') {
          /**培训配置统计查询 */
          dispatch({ type: 'initQuery', query });
        }
      });
    }
  },
}
