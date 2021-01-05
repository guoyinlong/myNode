/**
 * 作者：韩爱爱
 * 日期：2020-11-18
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训申请-培训填报
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers';
// import Cookie.get('username'), from 'js-Cookie.get('username'),';
import Cookie from 'js-cookie';
import {routerRedux} from "dva/router";
export default {
  namespace: 'trainAppWrite',
  state:{
    cultosiName:'',//培训名称
    cultiTime:'',//培训时间
    typeValue:'0',//培训类型
    trainingMaterial:[],//培训证明材料
    signForm:[],//签到表
    questionnaire:[],//调查问卷
    loading:false,
    loading1:false,
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
          cultosiName:"",
          cultiTime:"",
          typeValue:"0",
          trainingMaterial:[],
          signForm:[],
          questionnaire:[],
        }
      });
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
    //培训类型
    *typeChange({record}, {put, select}){
      const  {trainingMaterial,questionnaire,signForm } = yield select(v => v.trainAppWrite);
      if( record.target.value == 0){
        yield put({
          type: 'save',
          payload: {
            trainingMaterial:trainingMaterial, //
            questionnaire:[],    //调查问卷图片
            signForm:[]
          }
        })
      }else  if( record.target.value == 1){
        yield put({
          type: 'save',
          payload: {
            signForm:signForm,
            trainingMaterial: [],
            questionnaire:questionnaire,    //调查问卷图片
          }
        })
      }
      yield put({
        type:'save',
        payload:{
          typeValue: record.target.value,
        }
      })
    },
    //材料存储
    *trainingMaterialChange({record,name},{put, select}){
      const  {trainingMaterial,questionnaire,signForm ,typeValue} = yield select(v => v.trainAppWrite);
      if (name.file.status === 'done') {
        if (name.file.response.RetCode === '1') {
          if (record == '培训证明材料') {
            trainingMaterial.push(name.file.response.filename);
            yield put({
              type: 'save',
              payload: {
                trainingMaterial: JSON.parse(JSON.stringify(trainingMaterial)),
                loading: false,
              }
            });
          }
        }
        if (record == '签到表') {
          signForm.push(name.file.response.filename);
          yield put({
            type: 'save',
            payload: {
              signForm: JSON.parse(JSON.stringify(signForm)),
              loading: false,
              loading1: false,
            }
          });
        }
        if (record =='调查问卷') {
          questionnaire.push(name.file.response.filename);
          yield put({
            type: 'save',
            payload: {
              questionnaire: JSON.parse(JSON.stringify(questionnaire)),
              loading1: false,
              loading: false,
            }
          });
        }
      }else if (name.file.status === 'error') {
        message.error(`${name.file.name} 上传失败！.`);
      } else  if(name.file.status === 'uploading'){
        yield put({
          type: 'save',
          payload: {
            loading: true,
            loading1: false,
          }
        })
      }
    },
    //材料删除
    *trainingDelete({record,name},{select, put}){
      const {trainingMaterial} = yield select(state => state.trainAppWrite);
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
    *trainingDelete1({record,name},{select, put}){
      const {signForm  } = yield select(state => state.trainAppWrite);
      for (let i = 0; i < signForm.length; i++) {
        const a = signForm.filter(v => v.RelativePath !== record.RelativePath);
        yield put({
          type: 'save',
          payload: {
            signForm: JSON.parse(JSON.stringify(a)),
          }
        })
      }
    },
    *trainingDelete2({record,name},{select, put}){
      const {questionnaire  } = yield select(state => state.trainAppWrite);
      for (let i = 0; i < questionnaire.length; i++) {
        const a = questionnaire.filter(v => v.RelativePath !== record.RelativePath);
        yield put({
          type: 'save',
          payload: {
            questionnaire: JSON.parse(JSON.stringify(a)),
          }
        })
      }
    },
    *submission({record},{put,call ,select}){
      const  {cultosiName,cultiTime,signForm,typeValue,trainingMaterial,questionnaire} = yield select(v => v.trainAppWrite);
      const dataStr ={
        userName:Cookie.get('username').toString(),
        deptName: Cookie.get('deptname').toString(),
        trainName:cultosiName,//培训名称
        time:cultiTime,//培训时间
        trainType:typeValue,//培训类型（传0或者1，0是线上，1是线下）
        trainingMaterial:JSON.stringify(trainingMaterial),//培训证明材料（培训类型为0的时候比传）
        signIn:JSON.stringify(signForm),//签到表（培训类型为1的时候比传）
        questionnaire:JSON.stringify(questionnaire),//调查问卷（培训类型为1的时候比传）
        // flag:1
      };
      if(record ==  '提交'){
        dataStr['flag']=1
        if(cultosiName === '' ){
            message.info('培训名称不能为空');
        }else if(cultiTime ===''){
          message.info('培训时间不能为空');
        }else if(typeValue == 0 && trainingMaterial.length == 0){
          message.info('培训证明材料不能为空');
        }else if(typeValue == 1){
          if(signForm.length == '0'){
            message.info('签到表不能为空')
          }else if(questionnaire.length == '0'){
            message.info('调查问卷不能为空')
          }else {
            let data=yield  call(Services.addTrainFill,dataStr);
            if (data.retCode === '1') {
              message.info('提交成功');
              yield put(routerRedux.push({
                pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
              }));
            }
          }
        }else {
          let data=yield  call(Services.addTrainFill,dataStr);
          if (data.retCode === '1') {
            message.info('提交成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
            }));
          }
        }
      }else if(record ==  '保存') {
        dataStr['flag']=0
          // if(signForm.length == '0'){
          //   message.info('签到表不能为空')
          // }else if(questionnaire.length == '0'){
          //   message.info('调查问卷不能为空')
          // }else {
            // const dataStr ={
            //   trainName:cultosiName,//培训名称
            //   time:cultiTime,//培训时间
            //   trainType:typeValue,//培训类型（传0或者1，0是线上，1是线下）
            //   trainingMaterial:JSON.stringify(trainingMaterial),//培训证明材料（培训类型为0的时候比传）
            //   signIn:JSON.stringify(signForm),//签到表（培训类型为1的时候比传）
            //   questionnaire:JSON.stringify(questionnaire),//调查问卷（培训类型为1的时候比传）
            //   flag:0
            // };
            let data=yield  call(Services.addTrainFill,dataStr);
            if (data.retCode === '1') {
              message.info('提交成功');
              yield put(routerRedux.push({
                pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
              }));
            }
        // }
      }else if(record ==  '取消'){
        yield put({
          type: 'save',
          payload: {
            cultosiName:"",
            cultiTime:"",
            typeValue:"0",
            trainingMaterial:[],
            signForm:[],
            questionnaire:[],
          }
        });
        yield put(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
        }));
      }
    }
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/trainAppIndex/trainAppWrite') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}

