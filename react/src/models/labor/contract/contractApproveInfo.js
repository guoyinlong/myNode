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
  namespace:'contractApproveInfo',
  state:{
    tableDataList: [],
    selectDataList: [],
    nextPersonList:[],
    ouList:[],
    deptList:[],
    postData:{},
    currentPage:null,
    total:null,
    approvalApplyInfo:[],
    approvalHandInfo:[],
    approvalList:[],
    approvalHiList:[],
    approvalNowList:[],
    dataInfoList:[],
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
    * contractApproveInform({query}, {call, put}) {
      let postData = {};
      postData["arg_contract_apply_id"] = query.task_id;
      const basicInfoData = yield call(contractService.contractApprovalListQuery, postData);
      if (basicInfoData.RetCode==='1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i].key = i + 1;
          basicInfoData.DataRows[i].rowKey = i + 1;
          basicInfoData.DataRows[i].major = 10;
          basicInfoData.DataRows[i].attitude = 10;
          basicInfoData.DataRows[i].quality = 10;
          basicInfoData.DataRows[i].attendence = 10;
          basicInfoData.DataRows[i].description = '';
        }
        yield put({
          type:'save',
          payload:{
            dataInfoList :basicInfoData.DataRows,
          }
        })
      }else{
        message.error("没有合同数据");
      }
      /*合同签约信息查询*/
      let params1 = {
        arg_apply_id:query.task_id,
        arg_apply_type:query.apply_type
      }
      //console.log("900000000000000000000000000");

      //console.log(params1);

      let approvalinfo = yield call(staffLeaveService.leaveApprovalInfoQuery,params1);

      //console.log("queryinfo.DataRows==="+JSON.stringify(approvalinfo.DataRows) );
      if (approvalinfo.RetCode==='1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0;i<approvalinfo.DataRows.length;i++) {
          if(approvalinfo.DataRows[i].task_type_id==='1'){
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          }else{
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type:'save',
          payload:{
            approvalList :approvalinfo.DataRows,
            approvalHiList:approvalHiList,
            approvalNowList:approvalNowList,
          }
        })
      }else{
        message.error("没有数据");
      }



    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/staffLeave_index/contractApproveInform') {
          dispatch({ type: 'contractApproveInform',query });
        }
      });
    }
  }
}
