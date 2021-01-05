/**
 * 文件说明：创建新加班审批流程
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-05-15
 */
import Cookie from "js-cookie";
import {OU_HQ_NAME_CN, OU_NAME_CN} from "../../utils/config";
import * as hrService from "../../services/hr/hrService";
import {message} from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";
//导入文件数据整理
function serviceDataFrontData(data){
  let frontDataList = [];
  for(let item in data){
    //{ key: 1, indexID: '1 ', hrID:'0544512',staffName:'田友谊',workTime:'2019/5/1',workReason:'结算2.0开发', workPlace:'济南', mark: '1'},
    let newdata = {
      key: data[item].序号,
      indexID: data[item].序号,
      hrID:data[item].员工编号,
      staffName:data[item].姓名,
      workTime:data[item].加班日期,
      workReason:data[item].加班原因,
      workPlace:data[item].加班地点,
      remark: data[item].天数
    };
    frontDataList.push(newdata);
  }
  return frontDataList;
}
export default {
  namespace: 'create_approval_model',
  state : {
    circulationType:'',
    approvType: '',
    tableDataList: [],
    personDataList: [],
    userProjectDataList : [],
    personCheckResult : '',
    teamDataList:[],
    approvalDataList:[],
    saveView: '',
    saveTaskId: '',
    nextpostname:'',
    nextDataList: [],
	  proj_id: '',
    fileDataList: [],
    pf_url:'',
    file_relativepath:'',
    file_name:'',
  },
  reducers:{
    save(state,action) {
      return { ...state,...action.payload};
    },
  },
  effects: {
    * personImport({param}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      yield put({
        type: 'save',
        payload: {
          personDataList: serviceDataFrontData(param),
          haveData: true
        }
      });
    },

    * personAdd({transferPersonList,importPersonDataList}, {put}) {
      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        i = i + 1;
        let personData = {
          indexID: i,
          hrID: item.hrID,
          staffName:item.staffName,
          workTime:item.workTime,
          workReason:item.workReason,
          workPlace:item.workPlace,
          remark: item.remark
        };
        personListTmp.push(personData);
      })
      transferPersonList.map((item) => {
        i = i + 1;
        let personData1 = {
          indexID: i,
          hrID: item.hrID,
          staffName:item.staffName,
          workTime:item.workTime,
          workReason:item.workReason,
          workPlace:item.workPlace,
          remark: item.remark
        };
        personListTmp.push(personData1);
      })
      yield put({
        type: 'save',
        payload: {
          personDataList: personListTmp
        }
      });
    },

    * deletePerson({importPersonDataList,record}, {put}) {
      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        if(item.indexID != record.indexID)
        {
          i = i + 1;
          let personData = {
            indexID: i,
            hrID: item.hrID,
            staffName:item.staffName,
            workTime:item.workTime,
            workReason:item.workReason,
            workPlace:item.workPlace,
            remark: item.remark
          };
          personListTmp.push(personData);
        }
      })
      yield put({
        type: 'save',
        payload: {
          personDataList: personListTmp
        }
      });
    },

    //传递审批进度参数
    * postApprovalType({approvType}, {put}) {
      yield put({
        type: 'save',
        payload: {
          approvType: approvType.approvType
        }
      });
    },
    //新建审批流程传参
    * postDatatoCreate({query}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          circulationType: query.circulationType,
          proj_id: query.proj_id,
          personDataList :[],
          holiday_name:'',
          saveTaskId : ''
        }
      });
      let auth_userid = Cookie.get('userid');
      /* 查询用户项目信息 Begin */
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = auth_userid;
      let userProjectData = yield call(overtimeService.projectQuery, projectQueryparams);
      if (userProjectData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            userProjectDataList: userProjectData.DataRows,
          }
        })
      }
      /* 查询用户项目信息 End */

      /* 查询加班人员信息 Begin */
      let applyType = query.circulationType;
      let apply_type = null;
      if(applyType === '项目组加班申请' ||  applyType === '职能线加班申请')
      {
        apply_type = 1;
      }
      if(applyType === '项目组加班统计' ||  applyType === '职能线加班统计')
      {
        apply_type = 2;
      }
      if(query.saveViewControl === "none"){
        yield put({
          type:'save',
          payload:{
            personDataList :[],
            holiday_name:query.holiday_name,
            create_time : query.create_time,
            saveTaskId : ''
          }
        });
        let projectQueryparams = {
          arg_team_apply_id: query.task_id,
          arg_apply_type: apply_type
        };
        const personData = yield call(overtimeService.teamApplyPersonQuery, projectQueryparams);
        if (personData.RetCode === '1') {
          let resultList = personData.DataRows;
          let transferDataList = [];
          let i = 0;
          resultList.map((item) => {
            i = i + 1;
            let personData = {
              key: i,
              indexID: i,
              hrID:item.user_id,
              staffName:item.user_name,
              workTime:item.overtime_time,
              workReason:item.overtime_reson,
              workPlace:item.overtime_place,
              remark: item.remark
            };
            transferDataList.push(personData);
          })
          yield put({
            type: 'save',
            payload: {
              personDataList: transferDataList,
              saveViewControl: 'none',
              circulationType: query.circulationType,
              saveTaskId: query.task_id
            }
          })
        } else {
          message.error("没有加班人员信息");
        }
      }
      /* 查询加班人员信息 End */

      //查询下一环节处理人信息begin
      console.log("query.circulationType:"+query.circulationType);
      if(query.circulationType==="部门加班申请"||query.circulationType==="部门加班统计"
	    ||query.circulationType==="职能线加班申请"||query.circulationType==="职能线加班统计"){
        projectQueryparams = {
          arg_deptid: Cookie.get('dept_id')
        };
        let nextData = yield call(overtimeService.nextPersonListStartQuery,projectQueryparams);
        let nextname = '';
        if (nextData.DataRows.length>0) {
          nextname = nextData.DataRows[0].submit_post_name;
        }
        if( nextData.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              nextDataList: nextData.DataRows,
              nextpostname: nextname
            }
          })
        }else{
          message.error("查询下一环节处理人信息异常");
        }
      }
	  
	  /*查询项目组下一环节处理人信息 Begin*/
      if(query.circulationType==="项目组加班申请"|| query.circulationType==="项目组加班统计") {
        let projectQueryparams1 = {
          arg_proc_inst_id: 'NA',
          arg_proj_id: query.proj_id,
          arg_post_id: '9cc97a9cb3b311e6a01d02429ca3c6ff'
        };
        let nextData1 = yield call(overtimeService.nextPersonListQuery, projectQueryparams1);
        let nextname1 = '';
        if (nextData1.length > 0) {
          nextname1 = nextData1.DataRows[0].submit_post_name;
        }

        //console.log(nextData);
        if (nextData1.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              nextDataList: nextData1.DataRows,
              nextpostname: nextname1
            }
          })
        } else {
          message.error("查询下一环节处理人信息异常");
        }
      }
      /*查询项目组下一环节处理人信息 End*/

      console.log("query.saveViewControl"+query.saveViewControl);
      //查询附件信息
      if( query.circulationType==="项目组加班统计"&&query.saveViewControl==="none") {
        let param = {
          arg_apply_id: query.task_id,
          arg_type:2
        };
        let fileData = yield call(overtimeService.fileListQuery, param);
        if( fileData.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              fileDataList: fileData.DataRows,
            }
          })
        }
        if(fileData.DataRows.length>0){
          yield put({
            type:'save',
            payload:{
              pf_url:fileData.DataRows[0].url,
              file_relativepath:fileData.DataRows[0].url,
              file_name:fileData.DataRows[0].name,
            }
          })
        }
      }
      //查询附件信息
      if( query.circulationType==="职能线加班统计"){
        let param = {
          arg_apply_id: query.task_id,
          arg_type:3
        };
        let fileData = yield call(overtimeService.fileListQuery, param);
        if( fileData.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              fileDataList: fileData.DataRows,
            }
          })
        }
        if(fileData.DataRows.length>0){
          yield put({
            type:'save',
            payload:{
              pf_url:fileData.DataRows[0].url,
              file_relativepath:fileData.DataRows[0].url,
              file_name:fileData.DataRows[0].name,
            }
          })
        }
      }

      /*
      console.log(query.proc_inst_id);
      let nextData = yield call(overtimeService.nextPersonListStartQuery,projectQueryparams);

      //console.log(nextData);
      if( nextData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            nextDataList: nextData.DataRows,
            nextpostname: nextname
          }
        })
      }else{
        message.error("查询下一环节处理人信息异常");
      }*/
      //查询下一环节处理人信息end
    },
    //保存文件
    * changeNewFile({oldfile,newfile,apply_stats_id}, {call, put}) {
      console.log("changeNewFile");
      console.log("oldfile==="+JSON.stringify(oldfile));
      console.log("newfile==="+JSON.stringify(newfile));
      console.log("apply_stats_id==="+JSON.stringify(apply_stats_id));

      if(oldfile.name===""||oldfile.name === null){//替换文件
        console.log("首次新增文件");
        yield put({
          type:'save',
          payload:{
            pf_url:newfile[0].response.file.AbsolutePath,
            file_relativepath:newfile[0].response.file.RelativePath,
            file_name:newfile[0].name,
          }
        })
      }else{
        console.log("修改文件");
        if(oldfile.uid===1){
          console.log("保存的文件进行修改");
          //删除旧文件
          let projectQueryparams = {
            RelativePath: oldfile.url,
          };
          yield call(overtimeService.deleteFile,projectQueryparams);
          //保存新文件
          yield put({
            type:'save',
            payload:{
              pf_url:newfile[0].response.file.AbsolutePath,
              file_relativepath:newfile[0].response.file.RelativePath,
              file_name:newfile[0].name,
            }
          })
          /*projectQueryparams = {
            arg_team_stats_id: team_stats_id,
            arg_pf_url:newfile[0].response.file.AbsolutePath,
            arg_file_relativepath:newfile[0].response.file.RelativePath,
            arg_new_file_name:newfile[0].name
          };
          let updatefalg = yield call(overtimeService.updateTeamFile,projectQueryparams);*/
        }else{
          console.log("新建的文件进行修改");
          //删除旧文件
          let projectQueryparams = {
            RelativePath: oldfile.response.file.RelativePath,
          };
          yield call(overtimeService.deleteFile,projectQueryparams);
          //修改新文件
          /*projectQueryparams = {
            arg_team_stats_id: team_stats_id,
            arg_pf_url:newfile[0].response.file.AbsolutePath,
            arg_file_relativepath:newfile[0].response.file.RelativePath,
            arg_new_file_name:newfile[0].name
          };
          let updatefalg = yield call(overtimeService.updateTeamFile,projectQueryparams);*/
          //保存新文件
          yield put({
            type:'save',
            payload:{
              pf_url:newfile[0].response.file.AbsolutePath,
              file_relativepath:newfile[0].response.file.RelativePath,
              file_name:newfile[0].name,
            }
          })
        }
      }
    },
    //删除文件
    * deleteFile({RelativePath}, {call, put}) {
      let projectQueryparams = {
        RelativePath: RelativePath,
      };
      let deletefalg = yield call(overtimeService.deleteFile,projectQueryparams);
      if( deletefalg.RetCode === '1'){
        console.log("调用服务删除成功");
      }else{
        console.log("调用服务删除失败");
      }
    },
    //删除业务表文件数据
    * deleteTeamFile({apply_stats_id}, {call, put}) {
      yield put({
        type:'save',
        payload:{
          pf_url:"",
          file_relativepath:"",
          file_name:"",
        }
      })
        /*let projectQueryparams = {
          arg_apply_stats_id: apply_stats_id,
          arg_type: arg_type
        };
        let deletefalg = yield call(overtimeService.deleteTeamFile,projectQueryparams);
        if( deletefalg.RetCode === '1'){
          console.log("调用业务服务删除成功");
        }else{
          console.log("调用业务服务删除失败");
        }*/
    },


	
	* nextStepPersonQuery({query}, {call, put}) {
      /*查询下一环节处理人信息 Begin*/
      let projectQueryparams = {
        arg_proc_inst_id: 'NA',
        arg_proj_id: query.proj_id,
        arg_post_id: '9cc97a9cb3b311e6a01d02429ca3c6ff'
      };
      let nextData = yield call(overtimeService.nextPersonListQuery,projectQueryparams);
      let nextname = '';
      if (nextData.length>0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }

      //console.log(nextData);
      if( nextData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            nextDataList: nextData.DataRows,
            nextpostname: nextname
          }
        })
      }else{
        message.error("查询下一环节处理人信息异常");
      }
      /*查询下一环节处理人信息 End*/

    },
	
    //查询基本信息
    * staffInfoSearch({}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          tableDataList: [],
        }
      });
      //获取Cookie的值，用的时候获取即可，写在最外面容易导致获取的不是最新的。
      const auth_tenantid = Cookie.get('tenantid');
      const auth_userid = Cookie.get('userid');
      const auth_ou = Cookie.get('OU');
      let ou_search = auth_ou;
      if (auth_ou === OU_HQ_NAME_CN) { //如果是联通软件研究院本部，传参：联通软件研究院
        ou_search = OU_NAME_CN;
      }
      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      postData["arg_all"] = auth_userid;    //只查询自己的信息
      postData["arg_ou_name"] = ou_search;
      postData["arg_allnum"] = 0;     //默认值为0
      postData["arg_page_size"] = 9;
      postData["arg_page_current"] = 1;
      const basicInfoData = yield call(hrService.basicInfoQuery, postData);
      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: basicInfoData.DataRows,
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },
    //保存信息
    * teamApprovalSave({basicInfoData, transferPersonList, team_apply_id,resolve}, {call}) {
      /* 保存humanwork.overtime_team_apply表 */
      /* TODO const saveBasicInfo = yield call(overtimeService.teamOvertimeApplyBasicInfoSave, {transjsonarray :basicInfoParam});*/
      const saveBasicInfo = yield call(overtimeService.teamOvertimeApplyBasicInfoSave, basicInfoData);
      if (saveBasicInfo.RetCode === '1') {
        /* 保存humanwork.overtime_team_person表 */

        /* TODO const savePersonInfo = yield call(overtimeService.teamOvertimeApplyPersonInfoSave, {transjsonarray :personInfoParam});*/
        let j = 0;
        for (let i = 0; i < transferPersonList.length; i++) {
          /*校验人员信息在申请中是否存在，如果不存在则提示不允许保存提交*/
          const personCheckResult = yield call(overtimeService.teamOvertimeStatsCheckPersonInfo, transferPersonList[i]);
          if(personCheckResult.DataRows[0].result > 0)
          {
            /*没有在申请名单中，直接终止程序运行*/
            /* 回滚功能 */
            let postData = {};
            postData["arg_team_apply_id"] = team_apply_id;
            postData["arg_status"] = '0';
            yield call(overtimeService.teamOvertimeApplyDelete, postData);
            message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号加班已经申请，禁止保存提交,请仔细核对所有加班人员信息后再保存提交");
            resolve("false");
            return "false";
          }
          const savePersonInfo = yield call(overtimeService.teamOvertimeApplyPersonInfoSave, transferPersonList[i]);
          if (savePersonInfo.RetCode !== '1') {
            /* 回滚功能 */
            let postData = {};
            postData["arg_team_apply_id"] = team_apply_id;
            postData["arg_status"] = '0';
            yield call(overtimeService.teamOvertimeApplyDelete, postData);
            message.error('保存失败');
            j = 1;
            break;
          }
        }
        if (j === 0) {
          message.success('保存成功');
          resolve("success");
        }
        else
        {
          message.success('保存失败');
          resolve("false");
        }
        return;

      } else {
        message.error('保存失败');
        resolve("false");
        return "false";
      }
    },

    //调用启动工作流
    * teamApprovalFlowStart({}, {call, put}) {
      let param = {};
      const teamOvertimeApplyFlowStartResult = yield call(overtimeService.teamOvertimeApplyFlowStart, param);
      if (teamOvertimeApplyFlowStartResult.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            teamApprovalFlowStartList: teamOvertimeApplyFlowStartResult.DataRows,
            RetCode: teamOvertimeApplyFlowStartResult.RetCode,
            RetVal: teamOvertimeApplyFlowStartResult.RetVal
          }
        })
      }

    },

    //调用节点结束工作流
    * teamApprovalFlowComplete({taskid}, {call, put}) {
      let param = {};
      param[taskid] = taskid;
      const teamOvertimeApplyFlowCompleteResult = yield call(overtimeService.teamOvertimeApplyFlowComplete, param);
      if (teamOvertimeApplyFlowCompleteResult.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            teamApprovalFlowCompleteList: teamOvertimeApplyFlowCompleteResult.DataRows,
          }
        })
      }

    },

    * teamApprovalSubmit({basicInfoData, transferPersonList, approvalData, approvalData1, team_apply_id,resolve}, {call}) {

      /*调用工作流开始服务，返回proc_inst_id，post_id_next*/
      let param = {};
      const teamOvertimeApplyFlowStartResult = yield call(overtimeService.teamOvertimeApplyFlowStart, param);
      let teamApprovalFlowStartList = [];
      if (teamOvertimeApplyFlowStartResult.RetCode === '1') {
        teamApprovalFlowStartList = teamOvertimeApplyFlowStartResult.DataRows;
      } else {
        message.error('Service teamOvertimeApplyFlowStart ' + teamOvertimeApplyFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      let proc_inst_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].procInstId;
      /*团队负责人角色*/
      let post_id_next = '9cc97a9cb3b311e6a01d02429ca3c6ff';
      let task_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].taskId;
      let task_name = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].actName;

      basicInfoData["arg_proc_inst_id"] = proc_inst_id;
      basicInfoData["arg_post_id_next"] = post_id_next;
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;
      let postData = {};
      postData["arg_team_apply_id"] = team_apply_id;
      postData["procInstId"] = proc_inst_id;
      postData["arg_status"] = '1';
      try {
          /* 保存humanwork.overtime_team_person表加班人员信息 Begin */
          let j = 0;
          for (let i = 0; i < transferPersonList.length; i++) {
            /*校验人员信息在申请中是否存在，如果存在则提示不允许保存提交*/
            const personCheckResult = yield call(overtimeService.teamOvertimeStatsCheckPersonInfo, transferPersonList[i]);
            if(personCheckResult.DataRows[0].result > 0)
            {
              /*没有在申请名单中，直接终止程序运行*/
              /* 回滚功能:数据库 */
              yield call(overtimeService.teamOvertimeApplyDelete, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号加班已经申请，禁止保存提交,请仔细核对所有加班人员信息后再保存提交");
              resolve("false");
              return ;
            }
            const savePersonInfo = yield call(overtimeService.teamOvertimeApplyPersonInfoSave, transferPersonList[i]);
            if (savePersonInfo.RetCode !== '1') {
              /* 回滚功能:数据库 */
              yield call(overtimeService.teamOvertimeApplyDelete, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error('提交失败');
              j = 1;
              break;
            }
          }
          /* 保存humanwork.overtime_team_person表加班人员信息 End */
          /* 保存humanwork.overtime_team_apply表 Begin */
          const saveBasicInfo = yield call(overtimeService.teamOvertimeApplyBasicInfoSave, basicInfoData);
          if (saveBasicInfo.RetCode !== '1') {
           /* 回滚功能:数据库 */
           yield call(overtimeService.teamOvertimeApplyDelete, postData);
           /* 回滚功能:工作流 */
           yield call(overtimeService.overtimeFlowTerminate, postData);
           message.error('提交失败');
          }
          /* 保存humanwork.overtime_team_apply表 End */
          /* 保存humanwork.overtime_team_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(overtimeService.teamOvertimeApplyApprovalInfoSave, approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.teamOvertimeApplyDelete, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /* 保存humanwork.overtime_team_approval表当前节点信息 End  */

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenersrc = '{addteamnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"处理环节", arg_deptid:"' + Cookie.get('OUID') + '"}}';
          param["listener"] = listenersrc;
          let teamApprovalFlowCompleteList = {};
          const teamOvertimeApplyFlowCompleteResult = yield call(overtimeService.overtimeFlowComplete, param);
          if (teamOvertimeApplyFlowCompleteResult.RetCode === '1') {
            teamApprovalFlowCompleteList = teamOvertimeApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service teamOvertimeApplyFlowComplete ' + teamOvertimeApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].taskId;
          let task_name1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].actName;
          approvalData1["arg_task_id"] = task_id1;
          approvalData1["arg_task_name"] = task_name1;
          /*调用工作流节点结束服务 End */

          /*保存下一节点信息 Begin */
          const approvalDataInfo1 = yield call(overtimeService.teamOvertimeApplyApprovalInfoSave, approvalData1);
          if (approvalDataInfo1.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.teamOvertimeApplyDelete, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /*保存下一节点信息 End */

          if (j === 1) {
            /* 回滚功能:数据库 */
            yield call(overtimeService.teamOvertimeApplyDelete, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }
      } catch (e) {
        /* 回滚功能:数据库 */
        try {
          yield call(overtimeService.teamOvertimeApplyDelete, postData);
          /* 回滚功能:工作流 */
          yield call(overtimeService.overtimeFlowTerminate, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }


    },

    * teamStatsApprovalSave({basicInfoData, transferPersonList, team_stats_id,resolve}, {call}) {
      /* 保存humanwork.overtime_team_stats表 */
      /* TODO const saveBasicInfo = yield call(overtimeService.teamOvertimeApplyBasicInfoSave, {transjsonarray :basicInfoParam});*/
      const saveBasicInfo = yield call(overtimeService.teamOvertimeStatsBasicInfoSave, basicInfoData);
      if (saveBasicInfo.RetCode === '1') {
        /* 保存humanwork.overtime_team_stats_person表 */

        /* TODO const savePersonInfo = yield call(overtimeService.teamOvertimeApplyPersonInfoSave, {transjsonarray :personInfoParam});*/
        let j = 0;
        for (let i = 0; i < transferPersonList.length; i++) {
          /*校验人员信息在申请中是否存在，如果不存在则提示不允许保存提交*/
          const personCheckResult = yield call(overtimeService.teamOvertimeStatsCheckPersonInfo, transferPersonList[i]);
          if(personCheckResult.DataRows[0].result === '0')
          {
            /*没有在申请名单中，直接终止程序运行*/
            /* 回滚功能 */
            let postData = {};
            postData["arg_team_stats_id"] = team_stats_id;
            postData["arg_status"] = '0';
            yield call(overtimeService.teamOvertimeStatsDelete, postData);
            message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号【" + transferPersonList[i].arg_holiday + "】加班申请没有填报，禁止保存提交,请仔细核对所有加班人员信息后再保存提交");
            resolve("false");
            return ;
          }
          if(personCheckResult.StatsResult > 0)
          {
            /*没有在申请名单中，直接终止程序运行*/
            /* 回滚功能 */
            let postData = {};
            postData["arg_team_stats_id"] = team_stats_id;
            postData["arg_status"] = '0';
            yield call(overtimeService.teamOvertimeStatsDelete, postData);
            message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号加班统计已经填报过，禁止再次保存提交,请仔细核对所有加班人员信息后再保存提交");
            resolve("false");
            return ;
          }
          const savePersonInfo = yield call(overtimeService.teamOvertimeStatsPersonInfoSave, transferPersonList[i]);
          if (savePersonInfo.RetCode !== '1') {
            /* 回滚功能 */
            let postData = {};
            postData["arg_team_stats_id"] = team_stats_id;
            postData["arg_status"] = '0';
            yield call(overtimeService.teamOvertimeStatsDelete, postData);
            message.error('保存失败');
            j = 1;
            break;
          }
        }
        if (j === 0) {
          message.success('保存成功');
          resolve("success");
        }

      } else {
        message.error('保存失败');
        resolve("false");
      }
    },

    * teamStatsApprovalSubmit({basicInfoData, transferPersonList, approvalData, approvalData1, team_stats_id,resolve}, {call}) {

      //检查项目组是否已经提交


      /*调用工作流开始服务，返回proc_inst_id，post_id_next*/
      let param = {};
      const teamOvertimeApplyFlowStartResult = yield call(overtimeService.teamOvertimeStatsFlowStart, param);
      console.log('teamOvertimeApplyFlowStartResult model : ' + teamOvertimeApplyFlowStartResult);
      let teamApprovalFlowStartList = [];
      if (teamOvertimeApplyFlowStartResult.RetCode === '1') {
        teamApprovalFlowStartList = teamOvertimeApplyFlowStartResult.DataRows;
      } else {
        message.error('Service teamOvertimeApplyFlowStart ' + teamOvertimeApplyFlowStartResult.RetVal);
        return;
      }
      console.log('teamApprovalFlowStartList : ' + teamApprovalFlowStartList);
      let proc_inst_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].procInstId;
      console.log('proc_inst_id : ' + proc_inst_id);
      /*团队负责人角色*/
      let post_id_next = '9cc97a9cb3b311e6a01d02429ca3c6ff';
      let task_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].taskId;
      let task_name = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].actName;
      console.log('task_id : ' + task_id);

      basicInfoData["arg_proc_inst_id"] = proc_inst_id;
      basicInfoData["arg_post_id_next"] = post_id_next;
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;
      let postData = {};
      postData["arg_team_stats_id"] = team_stats_id;
      postData["procInstId"] = proc_inst_id;
      postData["arg_status"] = '0';
      try {
          /* 保存humanwork.overtime_team_stats_person表加班人员信息 Begin */
          let j = 0;
          for (let i = 0; i < transferPersonList.length; i++) {
            /*校验人员信息在申请中是否存在，如果不存在则提示不允许保存提交*/
            const personCheckResult = yield call(overtimeService.teamOvertimeStatsCheckPersonInfo, transferPersonList[i]);
            if(personCheckResult.DataRows[0].result === '0')
            {
              /*没有在申请名单中，直接终止程序运行*/
              /* 回滚功能 */
              /* 回滚功能:数据库 */
              yield call(overtimeService.teamOvertimeStatsDelete, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号【" + transferPersonList[i].arg_holiday + "】加班申请没有填报，禁止保存提交,请仔细核对所有加班人员信息后再保存提交");
              resolve("false");
              return ;
            }

            /*校验人员信息是否部门通过，如果不存在则提示不允许保存提交*/
            const personCheckResult2 = yield call(overtimeService.deptOvertimeStatsCheckPersonInfo, transferPersonList[i]);
            if(personCheckResult2.DataRows[0].result === '0')
            {
              yield call(overtimeService.teamOvertimeStatsDelete, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号【" + transferPersonList[i].arg_holiday + "】部门加班申请没有提交或被驳回，禁止保存提交,请仔细核对所有加班人员信息后再保存提交");
              resolve("false");
              return ;
            }

            if(personCheckResult.StatsResult > 0)
            {
              /*没有在申请名单中，直接终止程序运行*/
              /* 回滚功能 */
              /* 回滚功能:数据库 */
              yield call(overtimeService.teamOvertimeStatsDelete, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号加班申请已经填报过，禁止重复统计填报,请仔细核对所有加班人员信息后再保存提交");
              resolve("false");
              return ;
            }
            const savePersonInfo = yield call(overtimeService.teamOvertimeStatsPersonInfoSave, transferPersonList[i]);
            if (savePersonInfo.RetCode !== '1') {
              /* 回滚功能:数据库 */
              yield call(overtimeService.teamOvertimeStatsDelete, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error('提交失败');
              j = 1;
              break;
            }
          }
          /* 保存humanwork.overtime_team_stats_person表加班人员信息 End */
          /* 保存humanwork.overtime_team_stats表 Begin */
          postData["arg_status"] = '1';
          const saveBasicInfo = yield call(overtimeService.teamOvertimeStatsBasicInfoSave, basicInfoData);
          if (saveBasicInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.teamOvertimeStatsDelete, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
          }
          /* 保存humanwork.overtime_team_stats表 End */
          /* 保存humanwork.overtime_team_stats_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(overtimeService.teamOvertimeStatsApprovalInfoSave, approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.teamOvertimeStatsDelete, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /* 保存humanwork.overtime_team_stats_approval表当前节点信息 End  */

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenersrc = '{addteamnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"处理环节", arg_deptid:"' + Cookie.get('OUID') + '"}}';
          param["listener"] = listenersrc;
          let teamApprovalFlowCompleteList = {};
          const teamOvertimeApplyFlowCompleteResult = yield call(overtimeService.overtimeFlowComplete, param);
          console.log('teamOvertimeApplyFlowCompleteResult model : ' + teamOvertimeApplyFlowCompleteResult);
          if (teamOvertimeApplyFlowCompleteResult.RetCode === '1') {
            teamApprovalFlowCompleteList = teamOvertimeApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service teamOvertimeApplyFlowComplete ' + teamOvertimeApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].taskId;
          let task_name1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].actName;
          approvalData1["arg_task_id"] = task_id1;
          approvalData1["arg_task_name"] = task_name1;
          /*调用工作流节点结束服务 End */

          /*保存下一节点信息 Begin */
          const approvalDataInfo1 = yield call(overtimeService.teamOvertimeStatsApprovalInfoSave, approvalData1);
          if (approvalDataInfo1.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.teamOvertimeStatsDelete, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
            j = 1;
          }
          /*保存下一节点信息 End */

          if (j === 1) {
            /* 回滚功能:数据库 */
            yield call(overtimeService.teamOvertimeStatsDelete, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }

      } catch (e) {
        /* 回滚功能:数据库 */
        try {
          yield call(overtimeService.teamOvertimeApplyDelete, postData);
          /* 回滚功能:工作流 */
          yield call(overtimeService.overtimeFlowTerminate, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }


    },

    *deptQuery({param},{call,put}){
      console.log("deptQuery");
      console.log(param);

      const submitBasicInfo = yield call(overtimeService.departmentOvertimeApplyQuery,param);
      console.log(submitBasicInfo);
      if(submitBasicInfo.RetCode==='1'){
        // message.success('请求成功！');
        yield put({
          type: 'save',
          payload: {
            teamDataList: submitBasicInfo.DataRows,
          }
        });
      }else{
        yield put({
          type:'save',
          payload:{
            teamDataList :[],
          }
        });
        // message.error('请求失败');
      }
    },
    *approvalQuery({param},{call,put}){
      console.log("approvalQuery");
      console.log(param);

      const submitBasicInfo = yield call(overtimeService.departmentOvertimeApprovalQuery,param);
      console.log(submitBasicInfo);
      if(submitBasicInfo.RetCode==='1'){
        // message.success('请求成功！');
        console.log(submitBasicInfo.DataRows+"88888888");
        yield put({
          type: 'save',
          payload: {
            approvalDataList: submitBasicInfo.DataRows,
          }
        });
      }else{
        yield put({
          type:'save',
          payload:{
            approvalDataList :[],
          }
        });
        // message.error('请求失败');
      }
    },
    //统计查询用
    *deptStatsQuery({param},{call,put}){
      console.log("deptStatsQuery");
      console.log(param);

      const submitBasicInfo = yield call(overtimeService.departmentOvertimeStatsQuery,param);
      console.log(submitBasicInfo);
      if(submitBasicInfo.RetCode==='1'){
        yield put({
          type: 'save',
          payload: {
            teamDataList: submitBasicInfo.DataRows,
          }
        });
      }else{
        yield put({
          type:'save',
          payload:{
            teamDataList :[],
          }
        });
        message.error('请求失败');
      }
      //查询附件列表
      let teamstatsidlist = '';
      for (let i=0;i<submitBasicInfo.DataRows.length;i++){
        if (teamstatsidlist === '') {
          teamstatsidlist += submitBasicInfo.DataRows[i].team_stats_id;
        }else{
          teamstatsidlist += ","+submitBasicInfo.DataRows[i].team_stats_id;
        }
      }
      if(teamstatsidlist !== ''){
        let projectQueryparams = {
          arg_apply_id: teamstatsidlist,
          arg_type:4
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
    //统计审批意见查询用
    *deptStatsApprovalQuery({param},{call,put}){
      console.log("deptStatsapprovalQuery");
      console.log(param);

      const submitBasicInfo = yield call(overtimeService.departmentOvertimeStatsApprovalQuery,param);
      console.log(submitBasicInfo);
      if(submitBasicInfo.RetCode==='1'){
        message.success('请求成功！');
        console.log(submitBasicInfo.DataRows+"88888888");
        yield put({
          type: 'save',
          payload: {
            approvalDataList: submitBasicInfo.DataRows,
          }
        });
      }else{
        yield put({
          type:'save',
          payload:{
            approvalDataList :[],
          }
        });
        message.error('请求失败');
      }
    },
    *departmentApprovalSubmit({basicInfoData,transforTeamDataList,approvalData,approvalData1,department_apply_id,resolve},{call}){
      /*调用工作流开始服务，返回proc_inst_id，post_id_next*/
      let param = {};
      /* TODO 修改调用部门申请工作流启动服务  */
      const teamOvertimeApplyFlowStartResult = yield call(overtimeService.departmentOvertimeApplyFlowStart, param);
      let teamApprovalFlowStartList = [];
      if (teamOvertimeApplyFlowStartResult.RetCode === '1') {
        teamApprovalFlowStartList = teamOvertimeApplyFlowStartResult.DataRows;
      } else {
        message.error('Service teamOvertimeApplyFlowStart ' + teamOvertimeApplyFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      
      let proc_inst_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].procInstId;
      let task_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].taskId;
      let task_name = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].actName;
      
      //基本信息表overtime_department_apply补全
      basicInfoData["arg_proc_inst_id"] = proc_inst_id;
      
      //第一条approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //回滚参数
      let postData = {};
      postData["arg_department_apply_id"] = department_apply_id;
      postData["procInstId"] = proc_inst_id;
      postData["arg_status"] = 1;
      try {
        /* 保存humanwork.overtime_department_apply表 Begin */
        const saveBasicInfo = yield call(overtimeService.departmentOvertimeApplyBasicSave,basicInfoData);
        /* 保存humanwork.overtime_department_apply表 End */
        if (saveBasicInfo.RetCode === '1') {
          let j =0;
          /* 保存humanwork.overtime_department_team表项目组信息 Begin */
          for(let i=0;i<transforTeamDataList.length;i++){
            const saveTeamInfo = yield call(overtimeService.departmentOvertimeApplyRelSave,transforTeamDataList[i]);
            if(saveTeamInfo.RetCode !== '1'){
              /* 回滚功能:数据库 */
              yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error('提交失败');
              j = 1;
              break;
            }
          }
           /* 保存humanwork.overtime_department_team表项目组信息 End */

          /* 保存humanwork.overtime_department_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(overtimeService.departmentOvertimeApplyApprovalSave,approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /* 保存humanwork.overtime_department_approval表当前节点信息 End  */   

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenersrc = '{adddepartmentnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"'+ Cookie.get('OUID')+'"}}';
          param["listener"] = listenersrc;
          let teamApprovalFlowCompleteList = {};
          const teamOvertimeApplyFlowCompleteResult = yield call(overtimeService.overtimeFlowComplete, param);
          if (teamOvertimeApplyFlowCompleteResult.RetCode === '1') {
            teamApprovalFlowCompleteList = teamOvertimeApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service teamOvertimeApplyFlowComplete ' + teamOvertimeApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].taskId;
          let task_name1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].actName;
          approvalData1["arg_task_id"] = task_id1;
          approvalData1["arg_task_name"] = task_name1;
          /*调用工作流节点结束服务 End */


          /*保存humanwork.overtime_department_approval下一节点信息 Begin */
          const approvalDataInfo1 = yield call(overtimeService.departmentOvertimeApplyApprovalSave, approvalData1);
          if (approvalDataInfo1.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /*保存humanwork.overtime_department_approval下一节点信息 End */

          if (j === 1) {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }

        }else{
          /* 回滚功能:工作流 */
          yield call(overtimeService.overtimeFlowTerminate, postData);
          message.error('提交失败');
          resolve("false");
        }
      } catch (error) {
        /* 回滚功能:数据库 */
        try {
          yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
          /* 回滚功能:工作流 */
          yield call(overtimeService.overtimeFlowTerminate, postData);
          resolve("false");
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }

    },
    *departmentStatsApprovalSubmit({basicInfoData,transforTeamDataList,approvalData,approvalData1,department_stats_id,resolve},{call}){
      /*调用工作流开始服务，返回proc_inst_id，post_id_next Begin*/
      /*调用工作流开始服务，返回proc_inst_id，post_id_next End*/
  
      /* 保存overtime_department_apply表 Begin 存储过程：team_overtime_apply_basicinfo_save_proc*/
  
      /* 保存overtime_department_team表 Begin 存储过程：team_overtime_apply_personinfo_save_proc*/
  
      /* TODO 保存overtime_department_approval表信息，封装的参数参考存储入参存储过程：team_overtime_stats_approval_save_proc Begin*/
  
      /*调用工作流节点结束服务 Begin overtimeService.overtimeFlowComplete */
  
      /* TODO 保存overtime_department_approval表下一节点信息，封装的参数参考存储入参 Begin*/
  
      /* TODO 异常回滚数据库，存储过程：team_overtime_apply_delete_proc Begin*/
      /* TODO 异常回滚工作流，overtimeService.overtimeFlowTerminate Begin*/
      
      /*调用工作流开始服务，返回proc_inst_id，post_id_next*/
      let param = {};
      /* TODO 修改调用部门申请工作流启动服务  */
      const teamOvertimeApplyFlowStartResult = yield call(overtimeService.departmentOvertimeStatsFlowStart, param);
      let teamApprovalFlowStartList = [];
      if (teamOvertimeApplyFlowStartResult.RetCode === '1') {
        teamApprovalFlowStartList = teamOvertimeApplyFlowStartResult.DataRows;
      } else {
        message.error('Service teamOvertimeApplyFlowStart ' + teamOvertimeApplyFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      
      let proc_inst_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].procInstId;
      let task_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].taskId;
      let task_name = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].actName;
      
      //基本信息表overtime_department_stats补全
      basicInfoData["arg_proc_inst_id"] = proc_inst_id;
      
      //第一条approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //回滚参数
      let postData = {};
      postData["arg_department_stats_id"] = department_stats_id;
      postData["procInstId"] = proc_inst_id;
      postData["arg_status"] = 1;
      try {
        /* 保存humanwork.overtime_department_stats表 Begin */
        const saveBasicInfo = yield call(overtimeService.departmentOvertimeStatsBasicSave,basicInfoData);
        /* 保存humanwork.overtime_department_stats表 End */
        if (saveBasicInfo.RetCode === '1') {
          let j =0;
          /* 保存humanwork.overtime_stats_department_team表项目组信息 Begin */
          for(let i=0;i<transforTeamDataList.length;i++){
            const saveTeamInfo = yield call(overtimeService.departmentOvertimeStatsRelSave,transforTeamDataList[i]);
            if(saveTeamInfo.RetCode !== '1'){
              /* 回滚功能:数据库 */
              yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error('提交失败');
              j = 1;
              break;
            }
          }
           /* 保存humanwork.overtime_stats_department_team表项目组信息 End */

          /* 保存humanwork.overtime_department_stats_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(overtimeService.departmentOvertimeStatsApprovalSave,approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /* 保存humanwork.overtime_stats_department_approval表当前节点信息 End  */   

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenersrc = '{adddepartmentnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"'+ Cookie.get('OUID')+'"}}';
          param["listener"] = listenersrc;
          let teamApprovalFlowCompleteList = {};
          const teamOvertimeApplyFlowCompleteResult = yield call(overtimeService.overtimeFlowComplete, param);
          if (teamOvertimeApplyFlowCompleteResult.RetCode === '1') {
            teamApprovalFlowCompleteList = teamOvertimeApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service teamOvertimeApplyFlowComplete ' + teamOvertimeApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].taskId;
          let task_name1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].actName;
          approvalData1["arg_task_id"] = task_id1;
          approvalData1["arg_task_name"] = task_name1;
          /*调用工作流节点结束服务 End */


          /*保存humanwork.overtime_stats_department_approval下一节点信息 Begin */
          const approvalDataInfo1 = yield call(overtimeService.departmentOvertimeStatsApprovalSave, approvalData1);
          if (approvalDataInfo1.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /*保存humanwork.overtime_stats_department_approval下一节点信息 End */

          if (j === 1) {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }

        }else{
          /* 回滚功能:工作流 */
          yield call(overtimeService.overtimeFlowTerminate, postData);
          message.error('提交失败');
          resolve("false");
        }
      } catch (error) {
        /* 回滚功能:数据库 */
        try {
          yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
          /* 回滚功能:工作流 */
          yield call(overtimeService.overtimeFlowTerminate, postData);
          resolve("false");
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },
    /*查询加班部门人员*/
    *queryTeamList({orig_proc_task_id},{call,put}){
      let projectQueryparams = {
        arg_team_apply_id: orig_proc_task_id,
        arg_apply_type:1
      };
      const personData = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
      console.log(personData);
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
    *queryTeamListSta({orig_proc_task_id},{call,put}){
      let projectQueryparams = {
        arg_team_apply_id: orig_proc_task_id,
        arg_apply_type: 2
      };
      const personData = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
      console.log(personData);
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

    * functionalDeptApprovalSave({basicInfoData, transferPersonList, department_apply_id,resolve}, {call}) {
      /* 保存humanwork.overtime_department_apply表 Begin */
      const saveBasicInfo = yield call(overtimeService.departmentOvertimeApplyBasicSave,basicInfoData);
      /* 保存humanwork.overtime_department_apply表 End */
      if (saveBasicInfo.RetCode === '1') {
        /* 保存humanwork.overtime_team_person表 */
        let j = 0;
        for (let i = 0; i < transferPersonList.length; i++) {
          /*校验人员信息在申请中是否存在，如果不存在则提示不允许保存提交*/
          const personCheckResult = yield call(overtimeService.teamOvertimeStatsCheckPersonInfo, transferPersonList[i]);
          if(personCheckResult.DataRows[0].result > 0)
          {
            /*没有在申请名单中，直接终止程序运行*/
            /* 回滚功能 */
            let postData = {};
            postData["arg_department_apply_id"] = department_apply_id;
            postData["arg_status"] = '0';
            yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
            message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号加班已经申请，禁止保存提交,请仔细核对所有加班人员信息后再保存提交");
            resolve("false");
            return ;
          }
          const savePersonInfo = yield call(overtimeService.teamOvertimeApplyPersonInfoSave, transferPersonList[i]);
          if (savePersonInfo.RetCode !== '1') {
            /* 回滚功能 */
            let postData = {};
            postData["arg_team_apply_id"] = department_apply_id;
            postData["arg_status"] = '0';
            yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
            message.error('保存失败');
            j = 1;
            break;
          }
        }
        if (j === 0) {
          message.success('保存成功');
          resolve("success");
        }

      } else {
        message.error('保存失败');
        resolve("false");
      }
    },

    *functionalDeptApprovalSubmit({basicInfoData,transferPersonList,approvalData,approvalData1,department_apply_id,resolve},{call}){
      /*调用工作流开始服务，返回proc_inst_id，post_id_next*/
      let param = {};
      const teamOvertimeApplyFlowStartResult = yield call(overtimeService.departmentOvertimeApplyFlowStart, param);
      let teamApprovalFlowStartList = [];
      if (teamOvertimeApplyFlowStartResult.RetCode === '1') {
        teamApprovalFlowStartList = teamOvertimeApplyFlowStartResult.DataRows;
      } else {
        message.error('Service teamOvertimeApplyFlowStart ' + teamOvertimeApplyFlowStartResult.RetVal);
        return;
      }

      let proc_inst_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].procInstId;
      let task_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].taskId;
      let task_name = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].actName;

      //基本信息表overtime_department_apply补全
      basicInfoData["arg_proc_inst_id"] = proc_inst_id;

      //第一条approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //回滚参数
      let postData = {};
      postData["arg_department_apply_id"] = department_apply_id;
      postData["procInstId"] = proc_inst_id;
      postData["arg_status"] = 1;
      try {
          let j =0;
          /* 保存humanwork.overtime_team_person表项目组信息 Begin */
          for(let i=0;i<transferPersonList.length;i++){
            /*校验人员信息在申请中是否存在，如果不存在则提示不允许保存提交*/
            const personCheckResult = yield call(overtimeService.teamOvertimeStatsCheckPersonInfo, transferPersonList[i]);
            if(personCheckResult.DataRows[0].result > 0)
            {
              /*没有在申请名单中，直接终止程序运行*/
              /* 回滚功能 */
              let postData = {};
              postData["arg_department_apply_id"] = department_apply_id;
              postData["arg_status"] = '0';
              yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
              message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号加班已经申请，禁止保存提交,请仔细核对所有加班人员信息后再保存提交");
              resolve("false");
              return ;
            }
            const savePersonInfo = yield call(overtimeService.teamOvertimeApplyPersonInfoSave, transferPersonList[i]);
            if(savePersonInfo.RetCode !== '1'){
              /* 回滚功能:数据库 */
              yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error('提交失败');
              j = 1;
              break;
            }
          }
          /* 保存humanwork.overtime_team_person表项目组信息 End */
          /* 保存humanwork.overtime_department_apply表 Begin */
          const saveBasicInfo = yield call(overtimeService.departmentOvertimeApplyBasicSave,basicInfoData);
          if(saveBasicInfo.RetCode !== '1'){
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
          }
          /* 保存humanwork.overtime_department_apply表 End */
          /* 保存humanwork.overtime_department_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(overtimeService.departmentOvertimeApplyApprovalSave,approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /* 保存humanwork.overtime_department_approval表当前节点信息 End  */

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenersrc = '{adddepartmentnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"'+ Cookie.get('OUID')+'"}}';
          param["listener"] = listenersrc;
          let teamApprovalFlowCompleteList = {};
          const teamOvertimeApplyFlowCompleteResult = yield call(overtimeService.overtimeFlowComplete, param);
          if (teamOvertimeApplyFlowCompleteResult.RetCode === '1') {
            teamApprovalFlowCompleteList = teamOvertimeApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service teamOvertimeApplyFlowComplete ' + teamOvertimeApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].taskId;
          let task_name1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].actName;
          approvalData1["arg_task_id"] = task_id1;
          approvalData1["arg_task_name"] = task_name1;
          /*调用工作流节点结束服务 End */


          /*保存humanwork.overtime_department_approval下一节点信息 Begin */
          const approvalDataInfo1 = yield call(overtimeService.departmentOvertimeApplyApprovalSave, approvalData1);
          if (approvalDataInfo1.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /*保存humanwork.overtime_department_approval下一节点信息 End */

          if (j === 1) {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }

      } catch (error) {
        /* 回滚功能:数据库 */
        try {
          yield call(overtimeService.departmentOvertimeApplyDeleteSave, postData);
          /* 回滚功能:工作流 */
          yield call(overtimeService.overtimeFlowTerminate, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }

    },

    * functionalDeptStatsApprovalSave({basicInfoData, transferPersonList, department_stats_id,resolve}, {call}) {
      /* 保存humanwork.overtime_department_stats表 Begin */
      const saveBasicInfo = yield call(overtimeService.departmentOvertimeStatsBasicSave,basicInfoData);
      /* 保存humanwork.overtime_department_stats表 End */
      let postData = {};
      postData["arg_department_stats_id"] = department_stats_id;
      postData["arg_status"] = 0;
      if (saveBasicInfo.RetCode === '1') {
        /* 保存humanwork.overtime_team_person表 */
        let j = 0;
        for (let i = 0; i < transferPersonList.length; i++) {
          /*校验人员信息在申请中是否存在，如果不存在则提示不允许保存提交*/
          const personCheckResult = yield call(overtimeService.teamOvertimeStatsCheckPersonInfo, transferPersonList[i]);
          if(personCheckResult.DataRows[0].result === '0')
          {
            /*没有在申请名单中，直接终止程序运行*/
            /* 回滚功能 */
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号【" + transferPersonList[i].arg_holiday + "】加班申请没有填报，禁止保存提交,请仔细核对所有加班人员信息后再保存提交");
            resolve("false");
            return ;
          }
          if(personCheckResult.StatsResult > 0)
          {
            /*没有在申请名单中，直接终止程序运行*/
            /* 回滚功能 */
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号加班申请已经填报过，禁止重复统计填报,请仔细核对所有加班人员信息后再保存提交");
            resolve("false");
            return ;
          }
          const savePersonInfo = yield call(overtimeService.teamOvertimeStatsPersonInfoSave, transferPersonList[i]);
          if (savePersonInfo.RetCode !== '1') {
            /* 回滚功能 */
            let postData = {};
            postData["arg_department_stats_id"] = department_stats_id;
            postData["arg_status"] = '0';
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            message.error('保存失败');
            j = 1;
            break;
          }
        }
        if (j === 0) {
          message.success('保存成功');
          resolve("success");
        }

      } else {
        message.error('保存失败');
        resolve("false");
      }
    },

    *functionalDeptStatsApprovalSubmit({basicInfoData,transferPersonList,approvalData,approvalData1,department_stats_id,resolve},{call}){
      /*调用工作流开始服务，返回proc_inst_id，post_id_next*/
      let param = {};
      const teamOvertimeApplyFlowStartResult = yield call(overtimeService.departmentOvertimeStatsFlowStart, param);
      let teamApprovalFlowStartList = [];
      if (teamOvertimeApplyFlowStartResult.RetCode === '1') {
        teamApprovalFlowStartList = teamOvertimeApplyFlowStartResult.DataRows;
      } else {
        message.error('Service teamOvertimeApplyFlowStart ' + teamOvertimeApplyFlowStartResult.RetVal);
        resolve("false");
        return;
      }

      let proc_inst_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].procInstId;
      let task_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].taskId;
      let task_name = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].actName;

      //基本信息表overtime_department_stats表补全
      basicInfoData["arg_proc_inst_id"] = proc_inst_id;

      //第一条approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //回滚参数
      let postData = {};
      postData["arg_department_stats_id"] = department_stats_id;
      postData["procInstId"] = proc_inst_id;
      postData["arg_status"] = 1;
      try {
          let j =0;
          /* 保存humanwork.overtime_department_team表项目组信息 Begin */
          for(let i=0;i<transferPersonList.length;i++){
            /*校验人员信息在申请中是否存在，如果不存在则提示不允许保存提交*/
            const personCheckResult = yield call(overtimeService.teamOvertimeStatsCheckPersonInfo, transferPersonList[i]);
            if(personCheckResult.DataRows[0].result === '0')
            {
              /*没有在申请名单中，直接终止程序运行*/
              /* 回滚功能 */
              /* 回滚功能:数据库 */
              yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号【" + transferPersonList[i].arg_holiday + "】加班申请没有填报，禁止保存提交,请仔细核对所有加班人员信息后再保存提交");
              resolve("false");
              return ;
            }
            if(personCheckResult.StatsResult > 0)
            {
              /*没有在申请名单中，直接终止程序运行*/
              /* 回滚功能 */
              /* 回滚功能:数据库 */
              yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error(transferPersonList[i].arg_user_name + transferPersonList[i].arg_overtime_time + "号加班申请已经填报过，禁止重复统计填报,请仔细核对所有加班人员信息后再保存提交");
              resolve("false");
              return ;
            }
            const savePersonInfo = yield call(overtimeService.teamOvertimeStatsPersonInfoSave, transferPersonList[i]);
            if(savePersonInfo.RetCode !== '1'){
              /* 回滚功能:数据库 */
              yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error('提交失败');
              j = 1;
              break;
            }
          }
          /* 保存humanwork.overtime_department_team表项目组信息 End */
          /* 保存overtime_department_stats表 Begin */
          const saveBasicInfo = yield call(overtimeService.departmentOvertimeStatsBasicSave,basicInfoData);
          if (saveBasicInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
          }
          /* 保存overtime_department_stats表表 End */
          /* 保存humanwork.overtime_department_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(overtimeService.departmentOvertimeStatsApprovalSave,approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /* 保存humanwork.overtime_department_approval表当前节点信息 End  */

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenersrc = '{adddepartmentnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"'+ Cookie.get('OUID')+'"}}';
          param["listener"] = listenersrc;
          let teamApprovalFlowCompleteList = {};
          const teamOvertimeApplyFlowCompleteResult = yield call(overtimeService.overtimeFlowComplete, param);
          if (teamOvertimeApplyFlowCompleteResult.RetCode === '1') {
            teamApprovalFlowCompleteList = teamOvertimeApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service teamOvertimeApplyFlowComplete ' + teamOvertimeApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].taskId;
          let task_name1 = teamApprovalFlowCompleteList[0] && teamApprovalFlowCompleteList[0].actName;
          approvalData1["arg_task_id"] = task_id1;
          approvalData1["arg_task_name"] = task_name1;
          /*调用工作流节点结束服务 End */


          /*保存humanwork.overtime_department_approval下一节点信息 Begin */
          const approvalDataInfo1 = yield call(overtimeService.departmentOvertimeStatsApprovalSave, approvalData1);
          if (approvalDataInfo1.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            j = 1;
          }
          /*保存humanwork.overtime_department_approval下一节点信息 End */

          if (j === 1) {
            /* 回滚功能:数据库 */
            yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }
      } catch (error) {
        /* 回滚功能:数据库 */
        try {
          yield call(overtimeService.departmentOvertimeStatsDeleteSave, postData);
          /* 回滚功能:工作流 */
          yield call(overtimeService.overtimeFlowTerminate, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }

    },

  },
  
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/overtime/overtime_index/createTeamApproval') {
          dispatch({ type: 'postDatatoCreate',query });
        }
        if (pathname === '/humanApp/overtime/overtime_index/createDeptApproval') {
          dispatch({ type: 'postDatatoCreate',query });
        }
        if (pathname === '/humanApp/overtime/createFuncApproval') {
          dispatch({ type: 'postDatatoCreate',query });
        }
        if (pathname === '/humanApp/overtime/overtime_index/createFunctionalDeptApproval') {
          dispatch({ type: 'postDatatoCreate',query });
        }
      });
    }
  }
};
