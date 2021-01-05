/**
 * 作者：韩爱爱
 * 日期：2020-11-18
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训备案-培训备案修改
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers';
import Cookie from 'js-cookie';
import {routerRedux} from "dva/router";
export default {
  namespace: 'trainRecordModify',
  state:{
    cultosiName:'',//培训名称
    cultiTime:'',//培训时间
    staffName:localStorage['fullName'],//人员名称
    checkObjectAndContentList:[],//单位
    checkObject:localStorage['deptname'],//选中单位
    typeValue:0,//培训类型
    questionnaire:[],//调查问卷
    trainingMaterial:[],//考试题目回答情况
    loading:false,
  },
  reducers:{
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },
  effects:{
    *init({query}, {put}) {
      yield put({
				type:'save',
				payload:{
					approval_id: query.approvalId,
					difference:query.difference
				}
      })
      yield put({
        type:'queryData'
      })
      yield put({
        type:'queryUserInfo1'
      })
    },
    *queryData({}, {call, put, select}){
      const {approval_id,difference} = yield select(v => v.trainRecordModify);
      if(difference){
        //审核详情
        let recData = {
          approval_id:approval_id
          };
        const response = yield call(Services.showTodoApprovalDetail, recData);
        if (response.retCode === '1') {
          if (response.dataRows.projApply.businessObj!=null) {
            if (response.dataRows.projApply.businessObj!=null) {
              const res = response.dataRows.projApply.businessObj.dataRows;
              let arrPian = [];
              if(res.trainingMaterial != '[]'){
                arrPian = JSON.parse( res.trainingMaterial);
              }else if(res.questionnaire != '[]' ){
              arrPian = JSON.parse( res.questionnaire);
              }
            arrPian.map((item,index)=>{item.key=index});
              yield put({
                type: 'save',
                payload: {
                trainDetalils: JSON.parse(JSON.stringify(res.trainName)),
                
                cultosiName:res.trainName,//培训名称
                cultiTime:res.trainTime,//培训时间
                typeValue:res.createById,//人员名称
                checkObject,//单位
                taskid:response.dataRows.taskId,
                taskName:response.dataRows.taskName
                }
              })
              }
          }
        }else{
          message.error(response.retVal);
        }
      }else{
        //详情


    }
    },
    //培训名称
    *cultiVlaue ({record},{put}){
      yield put({
        type:'save',
        payload:{
          cultosiName:record.target.value
        }
      })
    },
    //培训时间
    *changeDate ({startTime},{put}){
      yield put({
        type:'save',
        payload:{
          cultiTime:startTime,
        }
      })
    },
    //人员名字
    *staffVlaue({record},{put}){
      yield put({
        type:'save',
        payload:{
          staffName:record.target.value
        }
      })
    },
    //单位
    *queryUserInfo1({}, {call, put, select}){
      
        let data = yield call(Services.checkObjectAndContent, {});
        if(data.retCode == '1') {
          data.dataRows.map((v, i) => {
            v.key = i + '';
            v.title = v.deptName;
            v.value = v.deptId;
            v.disabled = true;
            v.children.map((item, index) => {
              item.key = i + '-' + index;
              item.title = item.deptName;
              item.value = item.deptId;
            })
          });
          yield put({
            type: 'save',
            payload: {
              checkObjectAndContentList: JSON.parse(JSON.stringify(data.dataRows))
            }
          })
        }
      
     
    },
    //选中单位
    *onObjectChange({record}, {put}) {
      yield put({
        type:'save',
        payload:{
          checkObject: record,
        }
      })
    },
    //培训类型
    *typeChange({record}, {put}){
      yield put({
        type:'save',
        payload:{
          typeValue: record.target.value,
        }
      })
    },
    //调查问卷图片
    *questionnaireChange({record},{put, select}){
      const  {questionnaire} = yield select(v => v.trainRecordModify);
      if (record.file.status === 'done') {
        if (record.file.response.RetCode === '1') {
          questionnaire.push(record.file.response.filename);
          yield put({
            type: 'save',
            payload: {
              questionnaire:JSON.parse(JSON.stringify(questionnaire)),
              loading: false,
            }
          });
        }
      }else if (record.file.status === 'error') {
        message.error(`${record.file.name} 上传失败！.`);
      } else  if(record.file.status === 'uploading'){
        yield put({
          type: 'save',
          payload: {
            loading: true,
          }
        })
      }
    },
    *questionnaireDelete({record},{select,put}){
      const { questionnaire  } = yield select(state => state.trainRecordModify);
      for (let i = 0; i < questionnaire.length; i++) {
        const a = questionnaire.filter(v => v.AbsolutePath !== record.AbsolutePath);
        yield put({
          type: 'save',
          payload: {
            questionnaire: JSON.parse(JSON.stringify(a)),
          }
        })
      }
    },
    //考试题目回答情况
    *trainingMaterialChange({record},{put, select}){
      const  {trainingMaterial} = yield select(v => v.trainRecordModify);
      if (record.file.status === 'done') {
        if (record.file.response.RetCode === '1') {
          trainingMaterial.push(record.file.response.filename);
          yield put({
            type: 'save',
            payload: {
              trainingMaterial:JSON.parse(JSON.stringify(trainingMaterial)),
              loading: false,
            }
          });
        }
      }else if (record.file.status === 'error') {
        message.error(`${record.file.name} 上传失败！.`);
      } else  if(record.file.status === 'uploading'){
        yield put({
          type: 'save',
          payload: {
            loading: true,
          }
        })
      }
    },
    *trainingDelete({record},{select, put}){
      const { trainingMaterial  } = yield select(state => state.trainRecordModify);
      for (let i = 0; i < trainingMaterial.length; i++) {
        const a = trainingMaterial.filter(v => v.RelativePath !== record.RelativePath);
        yield put({
          type: 'save',
          payload: {
            trainingMaterial: JSON.parse(JSON.stringify(a)),
          }
        })
      }
    },
    *submission({record},{put,call ,select}){
      const  {cultosiName,cultiTime, staffName ,checkObject,typeValue,trainingMaterial,questionnaire} = yield select(v => v.trainRecordModify);
      if(typeValue == "0"){
        yield put({
          type: 'save',
          payload: {
            trainingMaterial:trainingMaterial, //
            questionnaire:[],    //调查问卷图片
          }
        })
      }else  if(typeValue == "1"){
        yield put({
          type: 'save',
          payload: {
            trainingMaterial: [],
            questionnaire:questionnaire,    //调查问卷图片
          }
        })
      };
      const dataStr ={
        trainName:cultosiName,// 培训名称
        time:cultiTime, //time
        personId: Cookie.get('userid'),//登录id
        deptId :Cookie.get('loginpass'),//登录部门id
        trainType:typeValue ,//培训类型（传0或者1，0是线上，1是线下）
        trainingMaterial:JSON.stringify( trainingMaterial),
        questionnaire:JSON.stringify(questionnaire),//调查问卷（培训类型为1的时候比传）
      };
      let data = yield call(Services.addTrainUpload, dataStr);
      if(record ==  '提交'){
        if(cultosiName == '' ||cultiTime=='' ||
          typeValue == "0" &&trainingMaterial.length == "0" ||typeValue == "1" && questionnaire.length == "0"){
          message.info('必填项不能为空');
        }else{
          if(data.retCode == '1') {
            message.info('提交成功');
            // yield put(routerRedux.push({
            //   pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
            // }));
          }else if(data.retCode == '0'){
            message.error('提交失败')
          }
        }
      }else if(record ==  '取消'){
        yield put({
          type: 'save',
          payload: {
            cultosiName:'',
            cultiTime:'',
            trainingMaterial:[],
            questionnaire: [],  //调查问卷图片
          }
        })
      }
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/trainingRecordIndex/trainRecordModify') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}
