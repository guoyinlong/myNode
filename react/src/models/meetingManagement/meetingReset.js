import {message} from "antd";
import Cookie from "js-cookie";
import * as Service from "../../services/meetingManagement/meetingManageSer";
import {routerRedux} from "dva/router";
import * as meetManageService from "../../services/meetingManagement/meetManage";
import request from "../../utils/request";

/**
 * 作者：韩爱爱
 * 日期：2020-2-19
 * 邮箱：1010788276@qq.com
 * 功能：归档前修改填报议题
 */
export default{
    namespace: 'meetingReset',
    state: {
      topicName:'',          //议题名称
      topicId:'',            //议题ID
      topicLevel:'',         //申请单位
      deptName:'',           //汇报单位
      deptNameId: '',       //汇报单位id
      topicUserName:'',      //汇报人
      topicUseId:'',         //创建人id
      meetingTypeReset:'',   //会议类型
      writeMinute:'',        //预计汇报时间
      topicImportant:'',     //是否是三重一大
      importantReason:'',    //三重一大原因
      tableMaterial:[],     //佐证材料
      topicIfStudy:''  ,   //是否需要前置讨论
      topicStudyId:''  ,   //前置议题id或原因
      topicContent:'',      //待决议事项
      topicUrgent:'',       //紧急程度
      urgentReason:'',       //紧急原因
      topicSecret: '',       //是否涉密
      secretReason:'',       //涉密说明
      partdeptVisible:false,  //点击弹出列席的弹出框选择
      outInputs:[],         //列席部门选择框显示内容
      outDeptId:[],         //列席部门选中
      outInputId:[],         //列席部门id
      deptId:[],              //申请单位id
      tableUploadFile:[],      //上会材料
      buttonDisplay:'',    //保存按钮是否显示
      attachmentMaterial:[], //附件材料
    },
    reducers: {
      save(state, action) {
        return {...state, ...action.payload};
      },
    },
    effects: {
      *init({query}, {put}){
        console.log(query);
        yield put({
          type: 'save',
          payload: {
            topicName: query.topic_name,//议题名称
            topicId:query.topic_id,     //议题ID
            topicLevel:query.topic_level,//申请单位
            deptName: query.topic_dept_name,//汇报单位
            deptNameId: query.topic_dept_id,//汇报单位id
            topicUserName:query.topic_user_name,//创建人
            topicUseId:query.topic_user_id,//创建人id
            meetingTypeReset:query.topic_type_name,//会议类型
            meetingTypeStudy:query.topic_if_study,//会议类型
            writeMinute:query.topic_reporting_time,//预计汇报时间
            topicImportant:query.topic_if_important,//是否是三重一大
            importantReason:query.topic_important_reason,    //三重一大原因
            topicIfStudy:query.topic_if_study  ,   //是否需要前置讨论
            topicStudyId:query.topic_study_id ,   //前置议题id或原因
            topicContent:query.topic_content,    //待决议事项
            topicUrgent:query.topic_urgent,       //紧急程度
            urgentReason:query.urgent_reason,       //紧急原因
            topicSecret: query.topic_if_secret,       //是否涉密
            secretReason:query.topic_secret_reason,       //涉密说明
            partdeptVisible:false,  //点击弹出列席的弹出框选择
            outInputs:[],    //列席部门选择框显示内容
            outInputId:query.topic_other_dept_id, //列席部门id
            outDeptId:[],                        //列席部门选中
            deptId:query.topic_dept_id.split(','),              //申请单位id
            tableMaterial:[],         //佐证材料
            tableUploadFile:[],      //上会材料
            attachmentMaterial:[], //附件材料
          }
        });
      },
      //附件材料（佐证材料、上会材料）
      *materialsData({query},{call, put, select}){
        const {tableMaterial, tableUploadFile} = yield select(state => state.meetingReset);
        let postData = {
          arg_topic_id :query.topic_id , //会议议题名称
          arg_submit_id:query.submit_id,// 批次id
        };
        let data = yield call(Service.queryUpload,postData);
        console.log(data.DataRows,'附件材料');
        if(data.RetCode === '1'){
          yield  put({
            type: 'save',
            payload: {
              attachmentMaterial:JSON.parse(JSON.stringify(data.DataRows)),
            }
          });
          for(let i=0;i<data.DataRows.length;i++){
            if(data.DataRows[i].upload_type === '0'){
              tableMaterial.push({
                upload_name:data.DataRows[i].upload_name,
                AbsolutePath:data.DataRows[i].upload_real_url,
                RelativePath:data.DataRows[i].upload_url,
                key:data.DataRows[i].upload_url,
                upload_type:'0',
                upload_desc:'佐证材料'
              });
              yield  put({
                type: 'save',
                payload: {
                  tableMaterial:JSON.parse(JSON.stringify(tableMaterial)),
                }
              })
            }else if(data.DataRows[i].upload_type === '1'){
              tableUploadFile.push({
                upload_name:data.DataRows[i].upload_name,
                AbsolutePath:data.DataRows[i].upload_real_url,
                RelativePath:data.DataRows[i].upload_url,
                key:data.DataRows[i].upload_url,
                upload_type:'1',
                upload_desc:'上会材料'
              });
              yield  put({
                type: 'save',
                payload: {
                  tableUploadFile:JSON.parse(JSON.stringify(tableUploadFile)),
                }
              })
            }
          }
        }
      },
      //议题名称
      * handleTopicName({value}, {put}) {
        yield put({
          type: 'save',
          payload: {
            topicName: value,
          }
        })
      },
      // 待决议事项
      *handleTopicContent({value},{put}){
        yield put({
          type: 'save',
          payload: {
            topicContent: value,
          }
        })
      },
      //点击弹出列席部门弹出框
      * handlePartDeptModal({}, {call, select, put}) {
        yield put({
          type: 'save',
          payload: {
            partdeptVisible: true,
          }
        })
      },
      //点击取消按钮取消列席部门弹出框
      * handlePartDeptCancel({}, {call, select, put}) {
        yield put({
          type: 'save',
          payload: {
            partdeptVisible: false,
          }
        })
      },
      //列席部门选中
      * outPartDeptChecked({value}, {call, select, put}) {
        const {outInputs, outDeptId} = yield select(state => state.meetingReset);
        if (value.target.checked === true) {
          outInputs.push(value.target.deptName);
          outDeptId.push(value.target.value);
          yield put({
            type: 'save',
            payload: {
              outInputs: [...outInputs],
              outDeptId: [...outDeptId]
            }
          });
        } else {
          let dept = outInputs.filter(i => i !== value.target.deptName);
          let deptid = outDeptId.filter(i => i !== value.target.value);
          yield put({
            type: 'save',
            payload: {
              outInputs: [...dept],
              outDeptId: [...deptid]
            }
          });
        }
        console.log(outDeptId,11);
      },
      //列席部门点击确定
      * handlePartDeptOk({value}, {call, select, put}) {
        const {outInputs} = yield select(state => state.meetingReset);
        if (outInputs.length > 5) {
          message.info('您已选择超过5个列席部门');
        }
        yield put({
          type: 'save',
          payload: {
            partdeptVisible: false,
            outInputs:outInputs
          }
        })
      },
      //上会材料上传
      *updateFilePath({value},{call,select,put}){
        const {tableUploadFile} = yield select(state => state.meetingReset);
        tableUploadFile.push({
          upload_name:value.filenames.RealFileName,
          AbsolutePath:value.filenames.AbsolutePath,
          RelativePath:value.filenames.RelativePath,
          key:value.filenames.AbsolutePath,
          upload_type:'1',
          upload_desc:'上会材料'
        });
        yield put({
          type:'save',
          payload:{
            tableUploadFile:JSON.parse(JSON.stringify(tableUploadFile))
          }
        });
      },
      //上会材料-删除
      *deleteAddMeetingAll({record},{call,select,put}){
        const {tableUploadFile} = yield select(state => state.meetingReset);
        let a = tableUploadFile.filter(v=>v.RelativePath !== record.RelativePath);
        yield put({
          type:'save',
          payload:{
            tableUploadFile:JSON.parse(JSON.stringify(a)),
          }
        })
      },
      //佐证材料-删除
      *deleteAddMeeting({record},{call,select,put}){
        console.log(record);
        const {tableMaterial} = yield select(state => state.meetingReset);
        let b = tableMaterial.filter(v=>v.RelativePath !== record.RelativePath);
        yield put({
          type:'save',
          payload:{
            tableMaterial:JSON.parse(JSON.stringify(b)),
          }
        })
      },
      //佐证材料上传
      *updateFileAll({value},{call,select,put}){
        const {tableMaterial} = yield select(state => state.meetingReset);
        tableMaterial.push({
          upload_name:value.filename.RealFileName,
          AbsolutePath:value.filename.AbsolutePath,
          RelativePath:value.filename.RelativePath,
          key:value.filename.AbsolutePath,
          upload_type:'0',
          upload_desc:'佐证材料'
        });
        yield put({
          type:'save',
          payload:{
            tableMaterial:JSON.parse(JSON.stringify(tableMaterial))
          }
        });
      },
      //上会材料是否涉密
      *SecretChange({value}, {call, select, put}){
        yield put({
          type: 'save',
          payload: {
            topicSecret: value,
          }
        })
      },
      //上会材料泄密说明
      *secretReasonContent({value},{put}){
        yield put({
          type: 'save',
          payload: {
            secretReason: value,
          }
        })
      },
      //点击保存
      *saveTopic({}, {call, select, put}) {
        const {
          topicName,topicId,topicImportant,importantReason,topicIfStudy, topicStudyId,outInput,outInputs,
          topicSecret,secretReason,topicContent,topicUseId,topicUserName,tableMaterial,outDeptId,tableUploadFile
          } = yield select(state => state.meetingReset);
        if (outInputs.length >5) {
          message.info('您已经选择了5个以上列席部门，建议不超过5个');
        }else {
          if(topicSecret ==='0'){
            let file = tableMaterial.concat(tableUploadFile);
            const postData = {
              arg_topic_id:topicId,                      //议题id
              arg_topic_name:topicName,                  //议题名称
              arg_topic_if_important:topicImportant,     //是否是三重一大
              arg_topic_important_reason:importantReason,// 否  三重一大原因
              arg_topic_if_study:topicIfStudy,           // 否  是否是前置议题
              arg_topic_study_id:topicStudyId,           //  否  总办会:前置研究的议题id，党委会:是前置讨论事项的原因
              arg_topic_other_dept_id:outDeptId.toString(),        //参与议题的部门id
              arg_topic_if_secret:topicSecret,           //议题是否涉密
              arg_topic_secret_reason:'',      // 否  议题涉密说明
              arg_upload_info:JSON.stringify(file.filter(i=>!i.hasOwnProperty('upload_id'))),        //议题涉密材料
              // arg_upload_info:JSON.stringify(file), //附件信息
              arg_topic_content:topicContent,           //待决议事项
              arg_user_id:topicUseId,                   //创建人id
              arg_user_name:topicUserName,             //创建人姓名
            };
            const data = yield call(Service.TopicManagerChange, postData);
            if (data.RetCode === '1') {
              message.info('保存成功');
              yield put(routerRedux.push({
                pathname: '/adminApp/meetManage/meetingConfirm'
              }));
            }
          }else {
            let file = tableMaterial.concat(tableUploadFile);
            const postData = {
              arg_topic_id:topicId,                      //议题id
              arg_topic_name:topicName,                  //议题名称
              arg_topic_if_important:topicImportant,     //是否是三重一大
              arg_topic_important_reason:importantReason,// 否  三重一大原因
              arg_topic_if_study:topicIfStudy,           // 否  是否是前置议题
              arg_topic_study_id:topicStudyId,           //  否  总办会:前置研究的议题id，党委会:是前置讨论事项的原因
              arg_topic_other_dept_id:outDeptId.toString(),        //参与议题的部门id
              arg_topic_if_secret:topicSecret,           //议题是否涉密
              arg_topic_secret_reason:secretReason,      // 否  议题涉密说明
              arg_upload_info:JSON.stringify(file.filter(i=>!i.hasOwnProperty('upload_id'))),        //议题涉密材料
              // arg_upload_info:JSON.stringify(file), //附件信息
              arg_topic_content:topicContent,           //待决议事项
              arg_user_id:topicUseId,                   //创建人id
              arg_user_name:topicUserName,             //创建人姓名
            };
            const data = yield call(Service.TopicManagerChange, postData);
            if (data.RetCode === '1') {
              message.info('保存成功');
              yield put(routerRedux.push({
                pathname: '/adminApp/meetManage/meetingConfirm'
              }));
            }
          }

        }
      },
      //点击取消 返回上一级并清空填报内容
      * cancelTopic({}, {call, select, put}) {
        yield put({
          type: 'save',
          payload: {
            topicName:'',          //议题名称
            topicId:'',            //议题ID
            topicLevel:'',         //申请单位
            deptName:'',           //汇报单位
            topicUserName:'',      //汇报人
            topicUseId:'',         //创建人id
            meetingTypeReset:'',   //会议类型
            writeMinute:'',        //预计汇报时间
            topicImportant:'',     //是否是三重一大
            importantReason:'',    //三重一大原因
            tableMaterial:[],     //佐证材料
            topicIfStudy:''  ,   //是否需要前置讨论
            topicStudyId:''  ,   //前置议题id或原因
            topicContent:'',      //待决议事项
            topicUrgent:'',       //紧急程度
            urgentReason:'',       //紧急原因
            topicSecret: '',       //是否涉密
            secretReason:'',       //涉密说明
            partdeptVisible:false,  //点击弹出列席的弹出框选择
            outInputs:[],         //列席部门选择框显示内容
            outDeptId:[],         //列席部门选中
            outInputId:[],         //列席部门id
            deptId:[],              //申请单位id
            tableUploadFile:[],      //上会材料
            buttonDisplay:'',    //保存按钮是否显示
            attachmentMaterial:[], //附件材料
          }
        })
      },
    },
    subscriptions: {
      setup({dispatch,history}){
        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/meetManage/meetingConfirm/meetingReset') {
            dispatch({type:'init',query});
            dispatch({type:'materialsData',query});
          }
        });
      },
    }
}
