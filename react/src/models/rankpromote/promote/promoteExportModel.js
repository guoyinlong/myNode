/**
 *  作者: 王福江
 *  创建日期: 2020-02-18
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：员工晋升晋档路径生成导出
 */
import Cookie from 'js-cookie';
import {message} from "antd";
import * as promoteService from "../../../services/rankpromote/promoteService";
import * as trainService from "../../../services/train/trainService";
import moment from 'moment'
const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace:'promoteExportModel',
  state:{
    //职级信息
    searchDataList:[],
    //部门信息
    deptList:[],
    //ou信息
    ouList:[],
    //路径信息
    pathList:[]
  },

  reducers:{
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    * initQuery({query}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          searchDataList: [],
          deptList:[],
          ouList:[],
          pathList:[]
        }
      });
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const getOuData = yield call(trainService.getOuList, postData_getOU);
      if (getOuData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            ouList: getOuData.DataRows
          }
        });
      } else {
        message.error('没有查询内容');
      }
      //部门列表
      let queryParam = {
        arg_ou_id: Cookie.get('OUID'),
      };
      const courtDeptData = yield call(trainService.courtDeptQuery, queryParam);
      if (courtDeptData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            deptList: courtDeptData.DataRows,
          }
        });
      } else {
        message.error('查询部门出错！');
      }
      //路径
      const pathListData = yield call(promoteService.getPathList, queryParam);
      if (pathListData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            pathList: pathListData.DataRows,
          }
        });
      } else {
        message.error('查询部门出错！');
      }

      let arg_param = {
        arg_ou_id: Cookie.get('OUID'),
        arg_dept_id: Cookie.get('dept_id')
      };
      const pathData = yield call(promoteService.promotePathSearch, arg_param);
      if (pathData.RetCode === '1') {
        for (let i = 0; i < pathData.DataRows.length; i++) {
          pathData.DataRows[i]['indexID'] = i + 1;
          pathData.DataRows[i]['ID'] = i + 1;
        }
        yield put({
          type: 'save',
          payload: {
            searchDataList: pathData.DataRows,
          }
        });
      } else {
        message.error('查询晋升路径出错！');
      }
    },
    * PromotePathSearch({arg_param}, {call, put}) {
      let postData = {};
      postData["arg_ou_id"] = arg_param.arg_ou_id;
      postData["arg_dept_id"] = arg_param.arg_dept_id;

      const pathData = yield call(promoteService.promotePathSearch, arg_param);
      if (pathData.RetCode === '1') {
        for (let i = 0; i < pathData.DataRows.length; i++) {
          pathData.DataRows[i]['indexID'] = i + 1;
          pathData.DataRows[i]['ID'] = i + 1;
          /*pathData.DataRows[i]['dept_name'] = pathData.DataRows[i].dept_name.split('-')[0];
          pathData.DataRows[i]['dept_name'] = pathData.DataRows[i].dept_name.split('-')[1];*/
        }
        yield put({
          type: 'save',
          payload: {
            searchDataList: pathData.DataRows,
          }
        });
      } else {
        message.error('查询晋升信息出错！');
      }
    },
    * doPromotePath({arg_param, resolve}, {call, put}) {
      try{
        const pathData = yield call(promoteService.doPromotePath, arg_param);
        console.log("pathData=="+pathData);
        message.info('生成成功！');
        resolve("success");
        return;
      }catch (e) {
        message.info('生成失败！');
        resolve("false");
        return;
      }
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/humanApp/rankpromote/promoteexport') {
          dispatch({type: 'initQuery', query});
        }
      });
    }
  }
};
