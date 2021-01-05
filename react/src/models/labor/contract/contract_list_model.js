/**
 *  作者: 王福江
 *  创建日期: 2019-09-03
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：实现劳动合同查询功能
 */
import Cookie from 'js-cookie';
import { message } from 'antd';
import {OU_NAME_CN,OU_HQ_NAME_CN} from '../../../utils/config';
import * as hrService from "../../../services/hr/hrService";
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
  namespace:'contract_list_model',
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
    * contractListDefault({}, {call, put}) {
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
      postDataParam["arg_post_id"] = 'abcde12345b311e6a01d02429ca3c6ff';
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
    * contractListSearch({arg_param}, {call, put}) {
      //console.log("arg_param===" + JSON.stringify(arg_param));

      let postData = {};
      postData["arg_page_size"] = arg_param.arg_page_size;  //初始化页面显示条数为10
      postData["arg_page_current"] = arg_param.arg_page_current;   //初始化当前页码为1
      postData["arg_ou_id"] = auth_ou_id;
      postData["arg_dept_id"] = arg_param.arg_dept_id;
      postData["arg_end_time"] = arg_param.arg_end_time;

      //默认查询登陆人所属OU下的所有员工
      const basicInfoData = yield call(contractService.contractListQuery, postData);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
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
    * contractSearch({arg_param}, {call, put}) {
      console.log("arg_param===" + JSON.stringify(arg_param));
      let postData = {};
      postData["arg_page_size"] = arg_param.arg_page_size;  //初始化页面显示条数为10
      postData["arg_page_current"] = arg_param.arg_page_current;   //初始化当前页码为1
      postData["arg_ou_id"] = auth_ou_id;
      postData["arg_dept_id"] = arg_param.arg_dept_id;
      postData["arg_person_name"] = arg_param.arg_person_name;

      //默认查询登陆人所属OU下的所有员工
      const basicInfoData = yield call(contractService.contractQuery, postData);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
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
    * changeSelectList({selectDataList}, {call, put}) {
      //console.log("===" + JSON.stringify(selectDataList));
      yield put({
        type: 'save',
        selectDataList: selectDataList
      });
    },
    * submitPersonList({selDataList}, {call, put}) {
      //console.log("==="+JSON.stringify(selectDataList));
      let postData = {};
      postData["arg_user_id"] = selDataList[0].user_id;
      postData["arg_team_name"] = selDataList[0].team_name;
      postData["arg_dept_name"] = selDataList[0].dept_name;
      //console.log("postData==="+JSON.stringify(postData));
      const basicInfoData = yield call(contractService.personListQuery, postData);
      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextPersonList: basicInfoData.DataRows,
          }
        });
      } else {
        message.error("查询处理人失败！");
      }
    },
    * submitContractContinue({nextstep, nextstepPerson, selectPersonList, contracttime, resolve}, {call, put}) {
      //console.log("nextstep==="+nextstep);
      //console.log("nextstepPerson==="+nextstepPerson);
      //console.log("selectPersonList==="+selectPersonList);

      let param = {
        //离职申请启动工作流标识
        start_type: 'contract_renew',
      };
      const staffLeaveFlowStartResult = yield call(staffLeaveService.leaveFlowStart, param);
      let staffLeaveFlowStartList = [];
      if (staffLeaveFlowStartResult.RetCode === '1') {
        staffLeaveFlowStartList = staffLeaveFlowStartResult.DataRows[0];
      }
      else {
        message.error('Service staffLeaveFlowStart ' + staffLeaveFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      let proc_inst_id = staffLeaveFlowStartList.procInstId;
      let task_id = staffLeaveFlowStartList.taskId;
      let task_name = staffLeaveFlowStartList.actName;

      let flag = true;
      resolve("success");
      try {
        let basicparam = {};
        basicparam["arg_proc_inst_id"] = proc_inst_id;
        basicparam["arg_create_person_id"] = Cookie.get('userid');
        basicparam["arg_create_person_name"] = Cookie.get('username');
        basicparam["arg_task_id"] = task_id;
        basicparam["arg_task_name"] = task_name;

        let completeparam = {};
        if (nextstep === '部门负责人审批') {
          completeparam["form"] = '{if_function:true}';
          basicparam["arg_if_function"] = '1';
        } else {
          completeparam["form"] = '{if_function:false}';
          basicparam["arg_if_function"] = '0';
        }
        completeparam["taskId"] = task_id;
        let listenerSrc = '{contractapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        completeparam["listener"] = listenerSrc;
        //console.log("basicparam==="+JSON.stringify(basicparam));
        const flowCompleteResult = yield call(staffLeaveService.leaveFlowComplete, completeparam);
        let flowCompleteList = {};
        if (flowCompleteResult.RetCode === '1') {
          flowCompleteList = flowCompleteResult.DataRows;
        } else {
          message.error('Service lflowComplete ' + flowCompleteResult.RetVal);
          resolve("false");
          return;
        }
        let task_id_next = flowCompleteList[0] && flowCompleteList[0].taskId;
        let task_name_next = flowCompleteList[0] && flowCompleteList[0].actName;
        basicparam["arg_task_id_next"] = task_id_next;
        basicparam["arg_task_name_next"] = task_name_next;
        basicparam["arg_next_step_person"] = nextstepPerson;
        //合同周期
        basicparam["arg_contract_time"] = contracttime;
        if(contracttime==='0'){
          basicparam["arg_contract_type"] = '永久合同';
        }else{
          basicparam["arg_contract_type"] = '有固定期限';
        }

        const submitApplyResult = yield call(contractService.contractApplySubmit, basicparam);
        if (submitApplyResult.RetCode !== '0') {
          flag= false;
        } else {
          message.error('Service contractApplySubmit ' + submitApplyResult.RetVal);
          resolve("false");
        }
        //console.log("basicparam==="+JSON.stringify(basicparam));

        let personparam = {};
        for (let i=0;i<selectPersonList.length;i++){
          personparam["arg_contract_apply_id"] = submitApplyResult.RetCode;
          personparam["arg_user_id"] = selectPersonList[i].user_id;
          const personUpdateResult = yield call(contractService.contractPersonUpdate, personparam);
          if (personUpdateResult.RetCode !== '1') {
            resolve("false");
            flag= false;
          }
        }
        if(flag===false){
          /* 回滚功能*/
        }
      } catch (e) {
        try {
          /* 回滚功能:数据库 */
          //yield call(staffLeaveService.leaveApplyDelete, postDataDeleteDateBase);
          /* 回滚功能:工作流 */
          //yield call(staffLeaveService.leaveApplyDelete, postDataDeleteFlow);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
        message.error('提交失败');
        resolve("false");
      }
    },

    * contractPersonSearch({arg_user_id}, {call, put}) {
      let basicparam = {};
      basicparam["arg_user_id"] = arg_user_id;
      const basicInfoData = yield call(contractService.contractPersonListQuery, basicparam);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
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
    * contractPersonEffective({arg_user_id}, {call, put}) {
      let basicparam = {};
      basicparam["arg_user_id"] = arg_user_id;
      const basicInfoData = yield call(contractService.contractPersonEffective, basicparam);
      if (basicInfoData.RetCode === '1') {
        message.info("合同解除成功！");
      } else {
        message.error(basicInfoData.RetVal);
      }
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/contractListSearch') {
          dispatch({ type: 'contractListDefault',query });
        }
        if (pathname === '/humanApp/labor/contractSearch') {
          dispatch({ type: 'contractListDefault',query });
        }
      });
    }
  }
}
