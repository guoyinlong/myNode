/**
 * 文件说明：请假管理-已办查看
 * 作者：郭西杰
 * 邮箱：郭西杰@chinaunicom.cn
 * 创建日期：2020-4-27
 */

import Cookie from "js-cookie";
import * as overtimeService from "../../services/overtime/overtimeService"
import { message } from "antd";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
import * as absenceService from "../../services/absence/absenceService";
import * as hrService from "../../services/hr/hrService";
import * as contractService from "../../services/labor/contract/contractService";
const auth_tenantid = Cookie.get('tenantid');
const auth_ou_id = Cookie.get('OUID');
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}
//导入文件数据整理
function dataFrontDataImportPersonPost(data){
  let frontDataList = [];
  let i = 1;
  for(let item in data){
    let newData = {
      //序号
      rowKey: i,
      deptname: data[item].组织机构,
      user_id: data[item].员工编号,
      user_name: data[item].员工姓名,
      curr_year: data[item].年度,
      work_start_time: data[item].计算工龄开始日期,
      break_used: data[item].已用年假天数,
      break_remain: data[item].剩余年假天数
    };
    frontDataList.push(newData);
    i++;
  }
  return frontDataList;
}
export default {
  namespace: 'year_person_info_model',
  state: {
    yearPersonList:[],
    ouList:[],
    deptList:[],
    postData:{},
    currentPage:null,
    total:null,
    yearImportData:[],
  },
  reducers: {
    save(state,  action) {
      return { ...state, ...action.payload};
    },
    saveInit(state, {deptList: [], postList: []}) {
      return { ...state, deptList: [], postList: []}
    },
    saveOU(state,{ouList: DataRows}) {
      return { ...state, ouList:DataRows};
    },
    saveDept(state,{deptList: DataRows}) {
      return { ...state, deptList:DataRows};
    },
  },
  effects: {
    *yearPersonInfoInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          yearPersonList: [],
          postData: {},
          total: '',
          currentPage: ''
        }
      });
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const {DataRows: getOuData} = yield call(hrService.getOuList, postData_getOU);
      yield put({
        type: 'saveOU',
        ouList: getOuData
      });
      //从服务获取所属OU下的部门列表
      let postData_getDept = {};
      postData_getDept["arg_ou_id"] = auth_ou_id;
      const {DataRows: getDeptData} = yield call(contractService.deptListQuery, postData_getDept);

      let pureDeptData = [];//存储去除前缀后的部门数据
      for (let i = 0; i < getDeptData.length; i++) {
        if (getDeptData[i].deptname.split('-')[0] === auth_ou_flag && getDeptData[i].deptname.split('-')[1]) {
          if (!getDeptData[i].deptname.split('-')[2]) { //纪委去重
            let adddept = {};
            adddept["deptname"] = getDeptData[i].deptname.split('-')[1];
            adddept["deptid"] = getDeptData[i].deptid;
            pureDeptData.push(adddept);
          }
        }
      }
      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });
    },
    *yearPersonInfoSearch({ arg_param }, { call, put }) {
      let postData = {};
      postData["arg_ou_id"] = auth_ou_id;
      postData["arg_dept_id"] = arg_param.arg_dept_id;
      postData["arg_user_id"] = arg_param.arg_user_name;
      //默认查询登陆人所属OU下的所有员工
      const basicInfoData = yield call(absenceService.yearPersonInfoSearch, postData);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i].key = i + 1;
          basicInfoData.DataRows[i].rowKey = i + 1;
        }
        yield put({
          type: 'save',
          payload: {
            yearPersonList: basicInfoData.DataRows,
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },
    *yearCalculate({resolve},{call,put}){
      //调用工作流结下一步
      let projectQueryparams = {
        arg_ou_id:auth_ou_id,
        arg_year_flag:new Date().getFullYear()
      }

      let completeData = yield call(absenceService.yearCalculate,projectQueryparams);
      if (completeData.RetCode==='1') {
        resolve("success");
      }else {
        resolve("false");
      }
    },
    *yearImportData({YearData},{call,put}){
      yield put({
        type: 'save',
        payload: {
          yearImportData: [],
        }
      });
      if(YearData){
        yield put({
          type: 'save',
          payload: {
            yearImportData: dataFrontDataImportPersonPost(YearData),
            haveData: true
          }
        });
      }
    },
    *yearImportSubmit({yearImportData,resolve},{call,put}){
      try {
        let operation_flag = '0';
        for(let i=0;i<yearImportData.length;i++){
           let param = {
             arg_ou_id:auth_ou_id,
             arg_user_id:yearImportData[i].user_id,
             arg_curr_year:yearImportData[i].curr_year,
             arg_work_start_time:yearImportData[i].work_start_time,
             arg_break_used:yearImportData[i].break_used,
             arg_break_remain:yearImportData[i].break_remain
           }

          const saveDataInfo = yield call(absenceService.yearImport, param);
          if (saveDataInfo.RetCode !== '1') {
            message.error('导入失败');
            operation_flag = '1';
            resolve("false");
            return;
          }
        }
        if(operation_flag === '0'){
          message.info('录入成功！');
          resolve("success");
          return;
        }
      } catch (error) {
        resolve("false");
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/absence/yearpersoninfo') {
          dispatch({ type: 'yearPersonInfoInit', query });
        }
      });
    }
  }
};
