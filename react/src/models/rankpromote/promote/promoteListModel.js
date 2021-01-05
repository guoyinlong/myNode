/**
 *  作者: 郭西杰
 *  创建日期: 2020-01-07
 *  邮箱：guoxj116@chinaunicom.cn
 *  文件说明：实现职级晋升查询功能
 */
import Cookie from 'js-cookie';
import { message } from 'antd';
import {OU_NAME_CN,OU_HQ_NAME_CN} from '../../../utils/config';
import * as hrService from "../../../services/hr/hrService";
import * as promoteService from "../../../services/rankpromote/promoteService";
import * as contractService from "../../../services/labor/contract/contractService";
import * as staffLeaveService from "../../../services/labor/staffLeave/staffLeaveService";
const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
const auth_ou_id = Cookie.get('OUID');
let auth_ou_flag = auth_ou;
if(auth_ou_flag === OU_HQ_NAME_CN){ //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace:'promoteListModel',
  state:{
    tableDataList: [],
    historyDataList:[],
    selectDataList: [],
    nextPersonList:[],
    ouList:[],
    deptList:[],
    postData:{},
    currentPage:null,
    total:null,
    if_human:true
  },
  reducers:{
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
    * promoteListDefault({}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          tableDataList: [],
          historyDataList:[],
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
      yield put({
        type: 'save',
        payload: {
          total: 0,
          currentPage: 1
        }
      });
      //判断是否是人力资源

      let postDataParam = {};
      postDataParam["arg_user_id"] = Cookie.get('userid');
      postDataParam["arg_post_id"] = '71016a9cb3b311e6a01d02429ca3c6ff';
      const checkData = yield call(contractService.checkIfHumanSpecial, postDataParam);
      console.log("checkData==="+JSON.stringify(checkData));
      if(checkData.DataRows.length>0){
        yield put({
          type: 'save',
          payload: {
            if_human: false
          }
        });
      }
    },
    * promoteSearch({arg_param}, {call, put}) {
      console.log("arg_param===" + JSON.stringify(arg_param));
      let postData = {};
      postData["arg_page_size"] = arg_param.arg_page_size;  //初始化页面显示条数为10
      postData["arg_page_current"] = arg_param.arg_page_current;   //初始化当前页码为1
      postData["arg_ou_id"] = auth_ou_id;
      postData["arg_dept_id"] = arg_param.arg_dept_id;
      postData["arg_person_name"] = arg_param.arg_person_name;
      //默认查询登陆人所属OU下的所有员工
      const basicInfoData = yield call(promoteService.promoteInfoList,postData);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i]['indexID'] = i + 1;
          basicInfoData.DataRows[i]['ID'] = i + 1;
          basicInfoData.DataRows[i].key = i + 1;
          basicInfoData.DataRows[i].rowKey = i + 1;
        }
        yield put({
          type: 'save',
          payload: {
            tableDataList: basicInfoData.DataRows,
            postData: postData,
            total: basicInfoData.RowCount,
            currentPage: postData.arg_page_current
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },
    * promotePersonSearch({arg_user_id}, {call, put}) {
      let basicparam = {};
      basicparam["arg_user_id"] = arg_user_id;
      const basicInfoData = yield call(promoteService.promotePersonListQuery, basicparam);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i]['indexID'] = i + 1;
          basicInfoData.DataRows[i]['ID'] = i + 1;
          basicInfoData.DataRows[i].key = i + 1;
          basicInfoData.DataRows[i].rowKey = i + 1;
        }
        yield put({
          type: 'save',
          payload: {
            historyDataList: basicInfoData.DataRows
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/rankpromote/promoteInfo') {
          dispatch({ type: 'promoteListDefault',query });
        }
      });
    }
  }
}
