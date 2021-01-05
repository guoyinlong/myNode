/**
 * 文件说明：内训-培训申请
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-12-17
 */

import Cookie from "js-cookie";
import * as overtimeService from "../../services/overtime/overtimeService"
import * as trainService from "../../services/train/trainService"
import { message } from "antd";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
import { routerRedux } from "dva/router";
import * as appraiseService from "../../services/appraise/appraiseService";
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

//导入文件数据整理
function dataFrontDataPersonGrade(data) {
  let frontDataList = [];
  let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
  for (let item in data) {
    if (pattern.test(data[item].参训人员)) {
      message.error("录入成绩含有非法字符，请修改！");
      return;
    } else {
      let newData = {
        //序号
        indexID: data[item].序号,
        //参训人员
        user_name: data[item].参训人员,
        //地区
        train_area: data[item].地区,
        //用户名
        login_name: data[item].用户名,
        //考试成绩
        class_grade: data[item].考试成绩,
        //是否合格
        if_pass: data[item].是否合格,
      };
      frontDataList.push(newData);
    }
  }
  return frontDataList;
}

export default {
  namespace: 'train_in_approval_model',
  state: {
    //下一环节处理名称及处理人
    nextPersonList: [],
    nextPostName: '',
    create_person: [],
    //附件信息
    fileDataListCheck: [],
    fileDataListExec: [],

    pf_url: '',
    file_relative_path: '',
    file_name: '',
    //传递的参数
    approvalInfoRecord: [],
    //审批信息
    approvalList: [],
    approvalHiList: [],
    approvalNowList: [],
    //导入成绩
    importPersonClassGradeDataList: [],
    //参训人员查询
    personsList: [],
    //培训成绩展示
    showPersonClassGradeDataList: [],
    teacherList: [],
    teacherDateList: [],
    outClassInfo: {},
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    *TrainApplyApproval({ query }, { call, put }) {
      //计划外课程详情
      if (query.is_out_of_plan === '1') {
        let classparams = {
          arg_train_class_apply_id: query.task_id,
        }
        let classapprovalinfo = yield call(trainService.trainClassOutInfo, classparams);
        if (classapprovalinfo.RetCode === '1') {
          if (classapprovalinfo.DataRows.length > 0) {
            yield put({
              type: 'save',
              payload: {
                outClassInfo: classapprovalinfo.DataRows[0],
              }
            });
          }
        }
      }

      let train_type_name = '';
      if (query.train_apply_type === '4') {
        train_type_name = '外训-外派培训';
      } else if (query.train_apply_type === '3') {
        train_type_name = '内训-外请讲师';
      } else if (query.train_apply_type === '2') {
        train_type_name = '内训-自有内训师';
      } else if (query.train_apply_type === '1') {
        train_type_name = '内训-参加集团及系统内培训';
      }
      if (query.is_out_of_plan === '1') {
        train_type_name = train_type_name + '-计划外';
      } else {
        train_type_name = train_type_name + '-计划内';
      }
      query["train_type_name"] = train_type_name;
      //传递参数值
      yield put({
        type: 'save',
        payload: {
          approvalInfoRecord: query,
        }
      });

      //查询审批信息
      let params = {
        arg_train_class_apply_id: query.task_id,
      }
      //查询审批信息
      let approvalinfo = yield call(trainService.trainClassApplyApprovalListQuery, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if (approvalinfo.DataRows[i].task_type_id === '1') {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          } else {
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        message.error("没有数据");
      }

      //查询下一环节处理人
      //console.log("查询下一环节处理人");
      let personinfo = { arg_proc_inst_id: query.proc_inst_id };
      let nextData = yield call(overtimeService.nextPersonListQuery, personinfo);
      //console.log("nextData==="+JSON.stringify(nextData));
      if (nextData.RetCode === '-1' || nextData.RetCode === '0') {
        let nextpersonlist = [];
        let person = {};
        person.submit_user_name = query.create_person_name;
        person.submit_user_id = query.create_person;
        person.submit_post_name = '接口人提交执行培训';
        nextpersonlist.push(person);
        yield put({
          type: 'save',
          payload: {
            nextPersonList: nextpersonlist,
          }
        })
      } else if (nextData.RetCode === '1') {
        let nextperson = '';
        let nextpersonid = '';
        //判断下一环节是否是多个人
        if (nextData.DataRows[0].submit_post_name === '内训师所在部门负责人审批') {
          for (let i = 0; i < nextData.DataRows.length; i++) {
            nextperson = nextperson + '  ' + nextData.DataRows[i].submit_user_name;
            if (nextpersonid === '') {
              nextpersonid = nextData.DataRows[i].submit_user_id;
            } else {
              nextpersonid = nextpersonid + ',' + nextData.DataRows[i].submit_user_id;
            }
          }
          nextData.DataRows[0].submit_user_name = nextperson;
          nextData.DataRows[0].submit_user_id = nextpersonid;
          let nextpersonlist = [];
          nextpersonlist.push(nextData.DataRows[0]);
          yield put({
            type: 'save',
            payload: {
              nextPersonList: nextpersonlist,
            }
          })
        } else if (nextData.DataRows[0].submit_post_name === '内训师确认') {
          let personinfo2 = {
            arg_proc_inst_id: query.proc_inst_id,
            arg_dept_id: Cookie.get('dept_id')
          };
          let nextData2 = yield call(trainService.trainApprovalNextPerson, personinfo2);
          if (nextData2.RetCode === '1') {
            let nextperson = '';
            let nextpersonid = '';
            for (let i = 0; i < nextData2.DataRows.length; i++) {
              nextperson = nextperson + '  ' + nextData2.DataRows[i].submit_user_name;
              if (nextpersonid === '') {
                nextpersonid = nextData2.DataRows[i].submit_user_id;
              } else {
                nextpersonid = nextpersonid + ',' + nextData2.DataRows[i].submit_user_id;
              }
            }
            nextData2.DataRows[0].submit_user_name = nextperson;
            nextData2.DataRows[0].submit_user_id = nextpersonid;
            let nextpersonlist = [];
            nextpersonlist.push(nextData2.DataRows[0]);
            yield put({
              type: 'save',
              payload: {
                nextPersonList: nextpersonlist,
              }
            })
          } else {
            message.error("查询下一环节处理人为空");
          }
        } else {
          //console.log("nextData.DataRows==="+JSON.stringify(nextData.DataRows));
          yield put({
            type: 'save',
            payload: {
              nextPersonList: nextData.DataRows,
            }
          })
        }
      } else {
        message.error("查询下一环节处理人为空");
      }
      yield put({
        type: 'save',
        payload: {
          create_person: [{ create_person_id: query.create_person_name, create_person_name: query.create_person_name }],
        }
      })

      //查询培训人员信息
      let personParams = {
        arg_train_class_apply_id: query.task_id,
        arg_is_out_of_plan: query.is_out_of_plan,
      }
      let personInfo = yield call(trainService.trainClassApplyPersons, personParams);
      if (personInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            personsList: personInfo.DataRows,
          }
        })
      } else {
        message.error("没有数据");
      }

      //查询附件列表
      let fileQueryparams1 = {
        arg_proc_inst_id: query.proc_inst_id,
        arg_type: '0',
      };
      let fileData = yield call(trainService.trainClassFileListQuery, fileQueryparams1);
      if (fileData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            fileDataListCheck: fileData.DataRows,
          }
        })
      }

      //查询执行附件列表
      let fileQueryparams2 = {
        arg_proc_inst_id: query.proc_inst_id,
        arg_type: '1',
      };
      let fileData1 = yield call(trainService.trainClassFileListQuery, fileQueryparams2);
      if (fileData1.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            fileDataListExec: fileData1.DataRows,
          }
        })
      }

      //培训成绩信息展示
      let showGradeQueryparams = {
        arg_proc_inst_id: query.proc_inst_id,
        arg_train_class_apply_id: query.task_id,
      };

      let gradeData = yield call(trainService.trainClassApplyApprovalPersonGradeQuery, showGradeQueryparams);
      if (gradeData.RetCode === '1') {
        for (let i = 0; i < gradeData.DataRows.length; i++) {
          gradeData.DataRows[i]['indexID'] = i + 1;
          gradeData.DataRows[i]['ID'] = i + 1;
        }
        let gradelist = gradeData.DataRows;

        yield put({
          type: 'save',
          payload: {
            showPersonClassGradeDataList: gradelist,
          }
        })
      };

      //培训老师查询
      let teacherQueryparams = {
        arg_proc_inst_id: query.proc_inst_id,
        arg_is_out_of_plan: query.is_out_of_plan,
        arg_type: '0'
      };
      let teacherData = yield call(trainService.trainClassApplyApprovalTeacherQuery, teacherQueryparams);
      if (teacherData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            teacherList: teacherData.DataRows,
          }
        })
      };
      let teacherQueryparams2 = {
        arg_proc_inst_id: query.proc_inst_id,
        arg_is_out_of_plan: query.is_out_of_plan,
        arg_type: '1'
      };
      let teacherData2 = yield call(trainService.trainClassApplyApprovalTeacherQuery, teacherQueryparams2);
      if (teacherData2.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            teacherDateList: teacherData2.DataRows,
          }
        })
      };
    },

    //提交申请
    *trainClassApprovalSubmit({ approval_if, approval_advice, nextstepPerson, nextstep, orig_proc_inst_id, orig_proc_task_id, orig_train_class_apply_task_id, trainOrgan,
      trainUseFee, trainNumberPerson, resolve, is_purchase, is_exam, is_assessment, train_principle, train_teacher
    }, { call }) {
      /*console.log("-------------------------------------------------");
      console.log("-------------------------------------------------");
      console.log("approval_if=="+approval_if);
      console.log("approval_advice=="+approval_advice);
      console.log("nextstepPerson=="+nextstepPerson);
      console.log("nextstep=="+nextstep);
      console.log("orig_proc_inst_id=="+orig_proc_inst_id);
      console.log("orig_train_class_apply_task_id=="+orig_train_class_apply_task_id);
      console.log("trainOrgan=="+trainOrgan);
      console.log("trainUseFee=="+trainUseFee);
      console.log("trainNumberPerson=="+trainNumberPerson);
      console.log("resolve=="+resolve);
      console.log("is_purchase=="+is_purchase);
      console.log("is_exam=="+is_exam);
      console.log("is_assessment=="+is_assessment);
      console.log("train_principle=="+train_principle);
      console.log("train_teacher=="+train_teacher);
      console.log("-------------------------------------------------");
      console.log("-------------------------------------------------");*/
      let submitparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_train_class_apply_id: orig_train_class_apply_task_id,
        arg_approval_if: approval_if,
        arg_approval_advice: approval_advice,
        arg_task_id: '',
        arg_if_end: '',
        arg_post_id: '',
        arg_next_person: nextstepPerson,
        arg_nextstep: nextstep,
        //培训组织信息，写入到培训申请表中
        arg_trainOrgan: trainOrgan,
        arg_trainUseFee: trainUseFee,
        arg_trainNumberPerson: trainNumberPerson,
        arg_is_purchase: is_purchase,
        arg_is_exam: is_exam,
        arg_is_assessment: is_assessment,
        arg_train_principle: train_principle,
        arg_train_teacher: train_teacher,
      }
      //最后一步
      if (nextstepPerson === '结束' || nextstepPerson === 'end' || nextstepPerson === '' || nextstepPerson === null) {
        submitparams.arg_if_end = '1';
        let procparams = { taskId: orig_proc_task_id, }
        yield call(overtimeService.overtimeFlowComplete, procparams);
        //插入审批信息
        let updateCompleteData = yield call(trainService.trainClassApplyApprovalOperate, submitparams);
        if (updateCompleteData.RetCode === '1') {
          resolve("success");
          message.info('归档成功');
        } else {
          resolve("false");
          message.error('归档失败');
        }
      } else if (approval_if == "同意") {
        submitparams.arg_if_end = '0';
        submitparams.arg_user_id = Cookie.get("userid");
        /*查询待办是否一条*/
        let undoparam = {};
        undoparam["arg_proc_inst_id"] = orig_proc_inst_id;
        let undoData = yield call(trainService.trainApprovalCheckQuery, undoparam);
        if (undoData.DataRows.length === 1) {
          let param = {};
          param["taskId"] = orig_proc_task_id;
          let listenersrc = '{trainapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
          param["listener"] = listenersrc;
          let if_own_str = 'if_own: true';
          let if_branch_str = 'if_branch: true';
          if (nextstep === '内训师所在部门负责人审批') {
            if_own_str = 'if_own: false';
          }
          if (Cookie.get('OUID') === 'e65c02c2179e11e6880d008cfa0427c4') {
            if_branch_str = 'if_branch: false';
          }
          param["form"] = '{' + if_own_str + ',' + if_branch_str + '}';

          let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, param);
          submitparams.arg_task_id = flowTerminateData.DataRows[0].taskId;
        }
        //console.log("submitparams==="+JSON.stringify(submitparams));

        let updateCompleteData = yield call(trainService.trainClassApplyApprovalOperate2, submitparams);
        if (updateCompleteData.RetCode === '1') {
          resolve("success");
          message.info('提交成功');
        } else {
          resolve("false");
          message.error('提交失败');
        }
      } else {//驳回
        submitparams.arg_if_end = '0';
        let projectparams = {
          procInstId: orig_proc_inst_id,
        }
        yield call(overtimeService.overtimeFlowTerminate, projectparams);
        //驳回功能，新增待办
        let updateTerminateData = yield call(trainService.trainClassApplyApprovalOperate, submitparams);
        if (updateTerminateData.RetCode === '1') {
          resolve("success");
          message.info('提交成功');
        } else {
          resolve("false");
          message.error('提交失败');
        }
      }
    },

    //前台导入成绩成绩
    *PersonPradeImportOperation({ classGradeData, resolve }, { put }) {
      yield put({
        type: 'save',
        payload: {
          importPersonClassGradeDataList: []
        }
      });
      if (classGradeData) {
        let returnFlag = dataFrontDataPersonGrade(classGradeData);
        if (returnFlag && returnFlag.length > 0) {
          yield put({
            type: 'save',
            payload: {
              importPersonClassGradeDataList: dataFrontDataPersonGrade(classGradeData),
              haveData: true
            }
          });
          resolve("success");
        } else {
          resolve("false");
        }
      }
    },

    //提交个人成绩
    *trainClassPersonApprovalSubmit({ transferPersonClassGradeList, arg_proc_inst_id, arg_is_out_of_plan, teacherGradeList, resolve1 }, { call }) {
      //导入人员成绩，如果是内训-自有内训师计划外的，不需要判断，直接提交，否则先判断是否已经有；如果是计划内的，直接导入
      if(arg_is_out_of_plan=='0'){
        //删除上次失败成绩信息
        let deleteparam = {};
        deleteparam['arg_proc_inst_id'] = arg_proc_inst_id;
        yield call(trainService.deleteTrainGradeList, deleteparam);

        //批量插入成绩
        let insertlist = [];
        for (let i=0;i<transferPersonClassGradeList.length;i++){
          let insertparam = {};
          insertparam['train_class_personal_info_id'] = transferPersonClassGradeList[i].arg_train_class_personal_info_id;
          insertparam['user_id'] = transferPersonClassGradeList[i].arg_login_name;
          insertparam['train_class_grade'] = transferPersonClassGradeList[i].arg_class_grade;
          insertparam['train_area'] = transferPersonClassGradeList[i].arg_train_area;
          insertparam['user_name'] = transferPersonClassGradeList[i].arg_user_name;
          insertparam['is_out_of_plan'] = transferPersonClassGradeList[i].arg_is_out_of_plan;
          insertparam['train_class_type'] = transferPersonClassGradeList[i].arg_train_class_type;
          insertparam['state'] = '1';
          if(transferPersonClassGradeList[i].arg_if_pass=='是'){
            insertparam['if_pass'] = '0';
            insertparam['is_get_credit'] = '0';
          }else{
            insertparam['if_pass'] = '1';
            insertparam['is_get_credit'] = '0';
          }
          insertparam['train_class_plan_credit'] = '0';
          insertparam['train_class_apply_id'] = arg_proc_inst_id;
          insertparam['train_class_id'] = '0';
          insertparam['curr_year'] = '0';
          insertlist.push(insertparam);
        }
        //console.log("insertlist==="+JSON.stringify(insertlist));
        let insertparam = {};
        insertparam['transjsonarray'] = JSON.stringify(insertlist);
        let insertRet = yield call(trainService.importTrainGradeList, insertparam);
        if (insertRet.RetCode !== '1') {
          message.error("批量插入失败");
          resolve1("false");
          return;
        }
        let updateparam = {};
        updateparam['arg_proc_inst_id'] = arg_proc_inst_id;
        let updateRet = yield call(trainService.updateTrainGradeList, updateparam);
        if (updateRet.RetCode !== '1') {
          message.error("批量修改失败。");
          resolve1("false");
          return;
        }else if (updateRet.RetCode === '1') {
          resolve1("success");
        }
      }else{
        for (let i = 0; i < transferPersonClassGradeList.length; i++) {
          //走判断
          if (arg_is_out_of_plan === '1') {
            if (transferPersonClassGradeList[i].arg_train_apply_type !== 2) {
              const personInfoCheckResult = yield call(trainService.importClassGradeCheckPersonInfo, transferPersonClassGradeList[i]);
              if (personInfoCheckResult.DataRows[0].stats_result === '0') {
                /*申请时没有在名单中，直接终止程序运行*/
                message.error(transferPersonClassGradeList[i].arg_user_name + "没有进行计划外课程申请，禁止提交成绩,请仔细核对所有参加培训人员后再保存提交");
                resolve1("false");
                return;
              }
            }
            const classPersonGradeInfo = yield call(trainService.importPersonClassGradeSubmit, transferPersonClassGradeList[i]);
            if (classPersonGradeInfo.RetCode !== '1') {
              /*导入失败*/
              resolve1("false");
              return;
            } else if (classPersonGradeInfo.RetCode === '1') {
              resolve1("success");
            }
          } else {
            transferPersonClassGradeList[i]["arg_proc_inst_id"] = arg_proc_inst_id;
            const classPersonGradeInfo = yield call(trainService.importPersonClassGradeSubmit, transferPersonClassGradeList[i]);
            if (classPersonGradeInfo.RetCode !== '1') {
              /*导入失败*/
              resolve1("false");
              return;
            } else if (classPersonGradeInfo.RetCode !== '1') {
              resolve1("success");
            }
          }
        }
      }
      //添加培训老师评估老师
      for (let i = 0; i < teacherGradeList.length; i++) {
        let teacherparam = {};
        teacherparam['arg_proc_inst_id'] = arg_proc_inst_id;
        teacherparam['arg_id'] = teacherGradeList[i].id;
        teacherparam['arg_grade'] = teacherGradeList[i].grade;
        const teacherGradeResult = yield call(trainService.trainTeacherGrade, teacherparam);
        if (teacherGradeResult.RetCode !== '1') {
          resolve1("false");
          return;
        } else {
          resolve1("success");
        }
      }
    },

    //提交培训执行附件
    *trainClassExecFileSubmit({ exec_data, arg_proc_inst_id, arg_train_class_apply_id }, { call }) {
      let submitparams = {
        arg_proc_inst_id: arg_proc_inst_id,
        arg_pf_url: exec_data.arg_pf_url,
        arg_file_relative_path: exec_data.arg_file_relative_path,
        arg_file_name: exec_data.arg_file_name,
        arg_train_class_apply_id: arg_train_class_apply_id,
      };

      let update = yield call(trainService.trainClassExecFileSubmit, submitparams);

      if (update.RetCode === '1') {
        message.info("上传附件成功！");
      }
    },

    //删除附件
    *deleteFile({ RelativePath }, { call }) {
      let projectQueryparams = {
        RelativePath: RelativePath,
      };
      let deletefalg = yield call(overtimeService.deleteFile, projectQueryparams);
      if (deletefalg.RetCode === '1') {
        console.log("调用服务删除成功");
        yield put({
          type: 'save',
          payload: {
            pf_url: '',
            file_relative_path: '',
            file_name: '',
          }
        })
      } else {
        console.log("调用服务删除失败");
      }
    },

    //保存文件
    * changeNewFile({ oldfile, newfile }, { call, put }) {
      if (oldfile.name === "" || oldfile.name === null) {
        yield put({
          type: 'save',
          payload: {
            pf_url: newfile[0].response.file.AbsolutePath,
            file_relative_path: newfile[0].response.file.RelativePath,
            file_name: newfile[0].name,
          }
        })
      } else {
        console.log("修改文件");
        if (oldfile.uid === 1) {
          console.log("保存的文件进行修改");
          //删除旧文件
          let projectQueryparams = {
            RelativePath: oldfile.url,
          };
          yield call(overtimeService.deleteFile, projectQueryparams);
          //保存新文件
          yield put({
            type: 'save',
            payload: {
              pf_url: newfile[0].response.file.AbsolutePath,
              file_relative_path: newfile[0].response.file.RelativePath,
              file_name: newfile[0].name,
            }
          })
        } else {
          console.log("新建的文件进行修改");
          //删除旧文件
          let projectQueryparams = {
            RelativePath: oldfile.response.file.RelativePath,
          };
          yield call(overtimeService.deleteFile, projectQueryparams);
          //保存新文件
          yield put({
            type: 'save',
            payload: {
              pf_url: newfile[0].response.file.AbsolutePath,
              file_relative_path: newfile[0].response.file.RelativePath,
              file_name: newfile[0].name,
            }
          })
        }
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/train_do/train_in_planout_approval') {
          dispatch({ type: 'TrainApplyApproval', query });
        }
        if (pathname === '/humanApp/train/train_do/train_in_planout_look') {
          dispatch({ type: 'TrainApplyApproval', query });
        }
        if (pathname === '/humanApp/train/train_do/train_in_planin_approval') {
          dispatch({ type: 'TrainApplyApproval', query });
        }
        if (pathname === '/humanApp/train/train_do/train_in_planin_look') {
          dispatch({ type: 'TrainApplyApproval', query });
        }
      });
    }
  }
};
