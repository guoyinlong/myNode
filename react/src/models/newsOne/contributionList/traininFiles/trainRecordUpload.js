/**
 * 作者：韩爱爱
 * 日期：2020-11-06
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训备案-培训备案上传
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers';
import Cookie from 'js-cookie';
import {routerRedux} from "dva/router";
export default {
  namespace: 'trainRecordUpload',
  state:{
    cultosiName:'',//培训名称
    cultiTime:'',//培训时间
    checkContentList:[],//人员名称
    staffName:[],//选中人员名称
    checkObjectAndContentList:[],//单位
    checkObject:[],//选中单位
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
    *init({}, {put}) {
      yield put({
        type: 'save',
        payload: {
          cultosiName:'',
          cultiTime:'',
          typeValue:0,
          staffName:[],//人员名称
          checkObject:[],//单位
          trainingMaterial:[],
          questionnaire: [],  //调查问卷图片
        }
      });
      yield put({
        type:'queryUserInfo1'
      })
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
    *onObjectChange({record}, {put, call}) {
      const postData = {
        deptId: record.toString(),//单位 id
      };
      let data = yield call(Services.tijiaoren, postData);
      if(data.retCode == '1') {
        yield put({
          type:'save',
          payload:{
            checkContentList:JSON.parse(JSON.stringify(data.dataRows)),
          }
        })
      }
      yield put({
        type:'save',
        payload:{
          checkObject: record,
        }
      })
    },
    //人员名字
    *staffVlaue({record},{put}){
      yield put({
        type:'save',
        payload:{
          staffName:record
        }
      })
    },
    //培训类型
    *typeChange({record}, {put,select}){
      const  {questionnaire,trainingMaterial } = yield select(v => v.trainRecordUpload);
      if(record.target.value == "0"){
        yield put({
          type: 'save',
          payload: {
            trainingMaterial:trainingMaterial, //
            questionnaire:[],    //调查问卷图片
          }
        })
      }else  if(record.target.value == "1"){
        yield put({
          type: 'save',
          payload: {
            trainingMaterial: [],
            questionnaire:questionnaire,    //调查问卷图片
          }
        })
      };
      yield put({
        type:'save',
        payload:{
          typeValue: record.target.value,
        }
      })
    },
    //调查问卷图片
    *questionnaireChange({record},{put, select}){
      const  {questionnaire} = yield select(v => v.trainRecordUpload);
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
      const { questionnaire  } = yield select(state => state.trainRecordUpload);
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
      const  {trainingMaterial} = yield select(v => v.trainRecordUpload);
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
      const { trainingMaterial  } = yield select(state => state.trainRecordUpload);
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
      const  {cultosiName,cultiTime, staffName ,checkObject,typeValue,trainingMaterial,questionnaire} = yield select(v => v.trainRecordUpload);
      if(record ==  '提交'){
        if(cultosiName == '' || cultiTime=='' || staffName.length == 0 || checkObject.length  == 0){
          message.info('必填项不能为空');
        }else if( typeValue == "0" && trainingMaterial.length  == 0){
          message.info('必填项不能为空');
        }else if(typeValue == "1" && questionnaire.length  == 0){
          message.info('必填项不能为空');
        }else{
          let staffNameArr =[];
          staffName.map(item=>{
            staffNameArr.push( item.value)
          });
          const dataStr ={
            trainName:cultosiName,// 培训名称
            time:cultiTime, //time
            personId: staffNameArr.toString(),//姓名id
            deptId :checkObject.toString(),//部门id
            trainType:typeValue ,//培训类型（传0或者1，0是线上，1是线下）
            trainingMaterial:JSON.stringify( trainingMaterial),
            questionnaire:JSON.stringify(questionnaire),//调查问卷（培训类型为1的时候比传）
          };
          let data = yield call(Services.addTrainUpload, dataStr);
          if(data.retCode == '1') {
            message.info('提交成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/trainingRecordIndex',
            }));
          }else if(data.retCode == '0'){
            message.error('提交失败')
          }
        }
      } else if(record ==  '保存'){


      } else if(record ==  '取消'){
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
        if (pathname === '/adminApp/newsOne/contributionList/trainingRecordIndex/trainRecordUpload') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}
