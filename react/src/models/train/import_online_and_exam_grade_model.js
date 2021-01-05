/**
 *  作者: 翟金亭
 *  创建日期: 2019-08-19
 *  邮箱：zhaijt33@chinaunicom.cn
 *  文件说明：实现线上培训、认证考试成绩导入
 */
import * as trainService from "../../services/train/trainService";
import * as overtimeService from "../../services/overtime/overtimeService";
import Cookie from 'js-cookie';
import { message } from "antd";

//导入文件数据整理
function dataFrontDataExamTrain(data) {
  let frontDataList = [];
  let i = 1;
  for (let item in data) {
    console.log(JSON.stringify(item))
    let newData = {
      //序号
      exam_index_id: data[item].序号,
      //参训人员
      exam_user_name: data[item].参训人员,
      //用户名
      exam_login_name: data[item].用户名,
      //是否通过
      exam_if_pass: data[item].是否通过,
      //报销费用
      exam_fee: data[item].报销费用,
      exam_name: data[item].认证名称,
      exam_if_in: data[item].是否考试清单,
    };
    frontDataList.push(newData);
    i++;
  }
  return frontDataList;
}

function dataFrontDataOnlineTrain(data) {
  let frontDataList = [];
  let i = 1;
  for (let item in data) {
    let newData = {
      //序号
      online_index_id: data[item].序号,
      //参训人员
      online_user_name: data[item].参训人员,
      //用户名
      online_login_name: data[item].用户名,
      //是否完成
      online_if_pass: data[item].是否完成,

      online_train_type: data[item].课程类型,
      online_train_date: data[item].完成时间,
      online_train_hour: data[item].培训课时,
      online_train_name: data[item].课程名称,
      online_train_kind: data[item].课程来源,
    };
    frontDataList.push(newData);
    i++;
  }
  return frontDataList;
}

export default {
  namespace: 'importGradeModel',
  state: {
    importOnlineClassGradeDataList: [],
    importExamClassGradeDataList: [],
    nextPersonList: [],
    examList: [],
    //附件信息
    pf_url: '',
    file_relative_path: '',
    file_name: '',
    //申请信息
    applyInfoRecord: [],
    //成绩信息
    examAndOnlineGradeList: [],
    //附件信息
    fileDataList: [],
    //审批意见信息
    approvalHiList: [],
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    *initQuery({query}, { call, put }) {
      //查询下一处理人员信息
      let arg_deptid = Cookie.get('dept_id');
      let queryparams = {};
      queryparams["arg_dept_id"] = arg_deptid;
      let nextPerson = yield call(trainService.onlineAndExamImportNextPersonQuery, queryparams);
      //部门接口人-部门经理—培训人力资源专员归档，将所有的人员查出来
      if (nextPerson.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextPersonList: nextPerson.DataRows,
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
      /* 查询下一环节处理人信息 End */
      let param = {
        arg_curr_year: new Date().getFullYear().toString()
      };
      //查询sql列表
      const queryListInfo = yield call(trainService.certificationList, param);
      if (queryListInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            examList: queryListInfo.DataRows,
          }
        });
      } else {
        message.error('认证考试查询失败');
      }
    },

    //申请查看初始化
    *initApplyQuery({ query }, { put, call }) {
      //传递参数值
      if (query) {
        yield put({
          type: 'save',
          payload: {
            applyInfoRecord: query,
          }
        });
      }

      //查询成绩信息
      let params = {
        arg_import_id: query.proc_inst_id,
      }
      let gradeInfo = yield call(trainService.trainExamAndOnlineDateQuery, params);
      if (gradeInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            examAndOnlineGradeList: gradeInfo.DataRows,
          }
        })
      } else {
        message.error("没有数据");
      }

      //查询附件列表
      let projectQueryparams = {
        arg_import_id: query.proc_inst_id,
      };
      let fileData = yield call(trainService.examAndOnlineFileListQuery, projectQueryparams);
      //console.log(fileData);
      if (fileData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            fileDataList: fileData.DataRows,
          }
        })
      }

      //查询审批信息
      let approvalinfo = yield call(trainService.trainExamAndOnlineApprovalDataQuery, projectQueryparams);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if (approvalinfo.DataRows[i].task_type_id === '1') {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalHiList: approvalHiList,
          }
        })
      } else {
        message.error("没有数据");
      }
    },

    //导入认证考试成绩、导入线上培训成绩
    *GradeImport({ GradeData, importType }, { put }) {
      yield put({
        type: 'save',
        payload: {
          importExamClassGradeDataList: [],
          importOnlineClassGradeDataList: []
        }
      });
      if (GradeData) {
        if (importType === 'examTrain'||importType === 'examTrainNo') {
          yield put({
            type: 'save',
            payload: {
              importExamClassGradeDataList: dataFrontDataExamTrain(GradeData),
              haveData: true
            }
          });
        } else if (importType === 'onlineTrain') {
          yield put({
            type: 'save',
            payload: {
              importOnlineClassGradeDataList: dataFrontDataOnlineTrain(GradeData),
              haveData: true
            }
          });
        }
      }
    },
    *importExamGradeOperation({ transferExamDataDataList, transferExamApprovalDataDataList, train_exam_import_id, resolve }, { call }) {
      let postData = {};
      postData["arg_import_id"] = train_exam_import_id;
      let rollbackFlag = 0;
      try {
        //console.log("==="+JSON.stringify(transferExamDataDataList));
        //console.log("==="+JSON.stringify(transferExamApprovalDataDataList));
        let insertlist = [];
        if (transferExamDataDataList.length > 0) {
          for (let i=0;i<transferExamDataDataList.length;i++){
            let insertparam = {};
            insertparam['import_id'] = transferExamDataDataList[i].arg_import_id;
            insertparam['login_name'] = transferExamDataDataList[i].arg_login_name;
            insertparam['user_name'] = transferExamDataDataList[i].arg_user_name;
            if(transferExamDataDataList[i].arg_if_pass==='是'||transferExamDataDataList[i].arg_if_pass=='是'){
              insertparam['if_pass'] = '15';
            }else{
              insertparam['if_pass'] = '0';
            }
            insertparam['train_import_type'] = '认证考试';
            insertparam['class_name'] = transferExamDataDataList[i].arg_class_name;
            insertparam['create_time'] = new Date().getFullYear()+'-'+new Date().getMonth()+new Date().getDay();
            insertparam['state'] = '1';
            insertparam['train_year'] = transferExamDataDataList[i].arg_year;
            insertparam['score'] = '15';
            insertparam['train_kind'] = '非线上课程';
            insertparam['exam_fee'] = transferExamDataDataList[i].arg_exam_fee;
            insertparam['exam_if_in'] = transferExamDataDataList[i].arg_exam_if_in;

            insertlist.push(insertparam);
          }
          //console.log("insertlist==="+JSON.stringify(insertlist));
          let insertparam = {};
          insertparam['transjsonarray'] = JSON.stringify(insertlist);
          let insertRet = yield call(trainService.importExamOnlineList, insertparam);
          if (insertRet.RetCode !== '1') {
            message.error('保存失败');
            rollbackFlag = 1;
            return;
          }
          if (rollbackFlag !== 0) {
            message.error('提交失败');
            yield call(trainService.trainExamAndOnlineGradeDelete, postData);
            resolve("false");
          } else {
            const saveExameGradeApprovalInfo = yield call(trainService.trainExamAndOnlineGradeApproval, transferExamApprovalDataDataList);
            if (saveExameGradeApprovalInfo.RetCode !== '1') {
              message.error('保存失败');
              yield call(trainService.trainExamAndOnlineGradeDelete, postData);
              return;
            }
            message.success('提交成功');
            resolve("success");
          }
        }
      } catch (error) {
        message.error('回滚失败');
        resolve("false");
      }
    },

    *importOnlineGradeOperation({ transferOnlineDataDataList, transferOnlineApprovalDataDataList, train_onine_import_id, resolve }, { call }) {
      let postData = {};
      postData["arg_import_id"] = train_onine_import_id;
      let rollbackFlag = 0;
      try {
        //批量插入成绩
        let insertlist = [];
        //console.log("insertlist==="+JSON.stringify(transferOnlineDataDataList));
        let size = Math.ceil(transferOnlineDataDataList.length/500);
        for (let i=0;i<size;i++) {
          if(i<(size-1)){
            insertlist = [];
            for (let j=0;j<500;j++){
              let insertparam = {};
              insertparam['import_id'] = transferOnlineDataDataList[i*500+j].arg_import_id;
              insertparam['login_name'] = transferOnlineDataDataList[i*500+j].arg_login_name;
              insertparam['user_name'] = transferOnlineDataDataList[i*500+j].arg_user_name;
              if(transferOnlineDataDataList[i*500+j].arg_if_pass==='是'||transferOnlineDataDataList[i*500+j].arg_if_pass=='是'){
                insertparam['if_pass'] = '8';
              }else{
                insertparam['if_pass'] = '0';
              }

              insertparam['train_import_type'] = transferOnlineDataDataList[i*500+j].arg_train_kind;
              insertparam['class_name'] = transferOnlineDataDataList[i*500+j].arg_train_name;
              //insertparam['create_time'] = new Date().getFullYear()+'-'+new Date().getMonth()+new Date().getDay();
              insertparam['create_time'] = transferOnlineDataDataList[i*500+j].arg_train_date;
              insertparam['state'] = '1';
              insertparam['train_year'] = transferOnlineDataDataList[i*500+j].arg_year;
              insertparam['score'] = '8';
              insertparam['train_kind'] = '线上课程';
              insertparam['train_hour'] = transferOnlineDataDataList[i*500+j].arg_train_hour;
              insertparam['train_month'] = transferOnlineDataDataList[i*500+j].arg_train_date.substr(0,7);
              insertlist.push(insertparam);
            }
          }else{
            insertlist = [];
            for (let j=0;j<(transferOnlineDataDataList.length-i*500);j++){
              let insertparam = {};
              insertparam['import_id'] = transferOnlineDataDataList[i*500+j].arg_import_id;
              insertparam['login_name'] = transferOnlineDataDataList[i*500+j].arg_login_name;
              insertparam['user_name'] = transferOnlineDataDataList[i*500+j].arg_user_name;
              if(transferOnlineDataDataList[i*500+j].arg_if_pass==='是'||transferOnlineDataDataList[i*500+j].arg_if_pass=='是'){
                insertparam['if_pass'] = '8';
              }else{
                insertparam['if_pass'] = '0';
              }

              insertparam['train_import_type'] = transferOnlineDataDataList[i*500+j].arg_train_kind;
              insertparam['class_name'] = transferOnlineDataDataList[i*500+j].arg_train_name;
              //insertparam['create_time'] = new Date().getFullYear()+'-'+new Date().getMonth()+new Date().getDay();
              insertparam['create_time'] = transferOnlineDataDataList[i*500+j].arg_train_date;
              insertparam['state'] = '1';
              insertparam['train_year'] = transferOnlineDataDataList[i*500+j].arg_year;
              insertparam['score'] = '8';
              insertparam['train_kind'] = '线上课程';
              insertparam['train_hour'] = transferOnlineDataDataList[i*500+j].arg_train_hour;
              insertparam['train_month'] = transferOnlineDataDataList[i*500+j].arg_train_date.substr(0,7);
              insertlist.push(insertparam);
            }
          }
          let insertparam = {};
          insertparam['transjsonarray'] = JSON.stringify(insertlist);
          let insertRet = yield call(trainService.importExamOnlineList, insertparam);
          if (insertRet.RetCode !== '1') {
            message.error('保存失败');
            rollbackFlag = 1;
          }
        }
        if (rollbackFlag !== 0) {
          message.error('提交失败');
          yield call(trainService.trainExamAndOnlineGradeDelete, postData);
          resolve("false");
        } else {
          transferOnlineApprovalDataDataList["arg_class_name"] = '';
          const saveOnlineGradeApprovalInfo = yield call(trainService.trainExamAndOnlineGradeApproval, transferOnlineApprovalDataDataList);
          if (saveOnlineGradeApprovalInfo.RetCode !== '1') {
            message.error('保存失败');
            yield call(trainService.trainExamAndOnlineGradeDelete, postData);
            return;
          }
          message.success('提交成功');
          resolve("success");
        }
      } catch (error) {
        message.error('回滚失败');
        resolve("false");
      }
/*
        for (let i=0;i<transferOnlineDataDataList.length;i++){
          let insertparam = {};
          insertparam['import_id'] = transferOnlineDataDataList[i].arg_import_id;
          insertparam['login_name'] = transferOnlineDataDataList[i].arg_login_name;
          insertparam['user_name'] = transferOnlineDataDataList[i].arg_user_name;
          if(transferOnlineDataDataList[i].arg_if_pass==='是'||transferOnlineDataDataList[i].arg_if_pass=='是'){
            insertparam['if_pass'] = '10';
          }else{
            insertparam['if_pass'] = '0';
          }

          insertparam['train_import_type'] = transferOnlineDataDataList[i].arg_train_kind;
          insertparam['class_name'] = transferOnlineDataDataList[i].arg_train_name;
          //insertparam['create_time'] = new Date().getFullYear()+'-'+new Date().getMonth()+new Date().getDay();
          insertparam['create_time'] = transferOnlineDataDataList[i].arg_train_date;
          insertparam['state'] = '1';
          insertparam['train_year'] = transferOnlineDataDataList[i].arg_year;
          insertparam['score'] = '10';
          insertparam['train_kind'] = '线上课程';
          insertparam['train_hour'] = transferOnlineDataDataList[i].arg_train_hour;
          insertparam['train_month'] = transferOnlineDataDataList[i].arg_train_date.substr(0,7);
          insertlist.push(insertparam);
        }
        //console.log("insertlist==="+JSON.stringify(insertlist));
       /* let insertparam = {};
        insertparam['transjsonarray'] = JSON.stringify(insertlist);
        let insertRet = yield call(trainService.importExamOnlineList, insertparam);
        if (insertRet.RetCode !== '1') {
          message.error('保存失败');
          rollbackFlag = 1;
          return;
        }
        if (rollbackFlag !== 0) {
          message.error('提交失败');
          yield call(trainService.trainExamAndOnlineGradeDelete, postData);
          resolve("false");
        } else {
          transferOnlineApprovalDataDataList["arg_class_name"] = '';
          const saveOnlineGradeApprovalInfo = yield call(trainService.trainExamAndOnlineGradeApproval, transferOnlineApprovalDataDataList);
          if (saveOnlineGradeApprovalInfo.RetCode !== '1') {
            message.error('保存失败');
            yield call(trainService.trainExamAndOnlineGradeDelete, postData);
            return;
          }
          message.success('提交成功');
          resolve("success");
        }*/

    },

    //删除附件
    *deleteFile({ RelativePath }, { call }) {
      let projectQueryparams = {
        RelativePath: RelativePath,
      };
      let deletefalg = yield call(overtimeService.deleteFile, projectQueryparams);
      if (deletefalg.RetCode === '1') {
        console.log("调用服务删除成功");
      } else {
        console.log("调用服务删除失败");
      }
    },
    //保存文件
    *changeNewFile({ oldfile, newfile }, { call, put }) {
      if (oldfile.name === "" || oldfile.name === null) {
        console.log("首次新增文件");
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
    //查詢認證考試
    *queryExamList({ year }, { call, put }) {
      let param = {
        arg_curr_year: year
      };
      //查询sql列表
      const queryListInfo = yield call(trainService.certificationList, param);
      if (queryListInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            examList: queryListInfo.DataRows,
          }
        });
      } else {
        message.error('认证考试查询失败');
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/train_index/train_online_exam_import') {
          dispatch({ type: 'initQuery', query });
        }
        if (pathname === '/humanApp/train/train_do/train_online_exam_import_look') {
          dispatch({ type: 'initApplyQuery', query });
        }

        if (pathname === '/humanApp/train/train_index/train_online_exam_import/train_online_import') {
          dispatch({ type: 'initQuery', query });
        }
        if (pathname === '/humanApp/train/train_index/train_online_exam_import/train_exam_import') {
          dispatch({ type: 'initQuery', query });
        }
      });
    }
  }
};
