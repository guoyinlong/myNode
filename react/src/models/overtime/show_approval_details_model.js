/**
 * 文件说明：创建新加班审批流程
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-05-19
 */
import Cookie from "js-cookie";
import {OU_HQ_NAME_CN, OU_NAME_CN} from "../../utils/config";
import * as hrService from "../../services/hr/hrService";
import {message} from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";
/**/
export default {
  namespace: 'show_approval_details_model',
  state : {
    teamDataList: [],
    approvalHiList: [],
    personDataList: [],
    personDataListExport: [],
    fileDataList:[],
    return_type:'1'
  },
  reducers:{
    save(state,action) {
      return { ...state,...action.payload};
    },
  },
  effects:{
    //查询该条部门申请记录下的项目组加班申请情况
    *staffInfoSearch1({query},{call,put}) {
      yield put({
        type:'save',
        payload:{
          holiday_name:query.holiday_name,
          create_time : query.create_time,
          step : query.step,
          teamDataList:[],
          approvalHiList:[],
          approvalTeamList:[],
        }
      });

      if(query.return_type==='2'){
        yield put({
          type:'save',
          payload:{
            return_type:'2',
          }
        });
      }

      //临时存放加班人员详细信息
      let personDataListExportTemp = [];

      //项目组查询
      let param = {
        arg_apply_id: query.task_id,
        arg_apply_type:query.applyType,
      };
      const projData = yield call(overtimeService.teamApplyProjQuery,param);
      if(projData.RetCode==='1'){
        yield put({
          type: 'save',
          payload: {
            teamDataList: projData.DataRows,
          }
        });
        //查询项目组对应的详细加班人员信息
        for(let i =0; i<projData.DataRows.length; i++){
          let projectQueryparams = {
            arg_team_apply_id: projData.DataRows[i].apply_id,
            arg_apply_type:query.applyType
          };
          const personDataExport = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
          if( personDataExport.RetCode === '1'){
            for(let j=0; j<personDataExport.DataRows.length; j++){
              personDataListExportTemp.push(personDataExport.DataRows[j]);
            }
          }else{
            message.error("没有加班人员信息");
          }
        }
        yield put({
          type:'save',
          payload: {
            personDataListExport: personDataListExportTemp
          }
        })
      }else{
        yield put({
          type:'save',
          payload:{
            teamDataList :[],
          }
        });
      }
      //审批意见信息查询
      param = {
        arg_apply_id: query.task_id,
        arg_apply_type:query.approvalType
      };
      const approvalData = yield call(overtimeService.approvalListQuery,param);

      if( approvalData.RetCode === '1'){
        let getdata = approvalData.DataRows;
        let teamApprovalDate = [];
        let hiApprovalDateList = [];
        for (let i=0; i<getdata.length;i++){
          if(getdata[i].task_type_id === '2'){
            hiApprovalDateList.push(getdata[i]);
          }
          else if (getdata[i].task_type_id === '1'){
            teamApprovalDate.push(getdata[i]);
          }
        }
        yield put({
          type:'save',
          payload:{
            approvalDataList :approvalData.DataRows,
            approvalTeamList: teamApprovalDate,
            approvalHiList: hiApprovalDateList,
          }
        })
      }
      //查询附件信息
      if (query.approvType==="部门加班统计") {
        let projectQueryparams = {
          arg_apply_id: query.task_id,
          arg_type:1
        };
        let fileData = yield call(overtimeService.fileListQuery,projectQueryparams);
        //console.log(fileData);
        if( fileData.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              fileDataList: fileData.DataRows,
            }
          })
        }
      }
    },
    /*查询加班部门人员*/
    *queryTeamList({query},{call,put}){
      let projectQueryparams = {
        arg_team_apply_id: query.orig_proc_task_id,
        arg_apply_type:query.apply_type
      };
      const personData = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
      //console.log(personData);
      if( personData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personDataList :personData.DataRows
          }
        })
      }else{
        message.error("没有加班人员信息");
      }
    },
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/overtime/overtime_index/showApprovalDetails') {
          dispatch({ type: 'staffInfoSearch1',query });
        }
      });
    }
  }
};
