/**
 * 作者：韩爱爱
 * 日期：2020-11-18
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训申请-培训修改
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers';
import Cookie from 'js-cookie';
import {routerRedux} from "dva/router";
export default {
  namespace: 'trainAppModify',
  state:{
    cultosiName:'',//培训名称
    cultiTime:'',//培训时间
    typeValue:'0',//培训类型
    trainingMaterial:[],//培训证明材料
    signForm:[],//签到表
    questionnaire:[],//调查问卷
    loading:false,
    loading1:false,
    previewVisible: false,
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
          queryid:query.record,
					approval_id: query.approvalId,
					difference:query.difference
				}
      })
      yield put({
        type:'queryData'
      })
    },
     //审核详情
    *queryData({}, {call, put, select}){
      const {approval_id,difference,queryid} = yield select(v => v.trainAppModify);
      if(difference){
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
              let typ=res.trainType=="线上"?0:1
            arrPian.map((item,index)=>{item.key=index});
              yield put({
                type: 'save',
                payload: {
                trainDetalils: JSON.parse(JSON.stringify(res.trainName)),
                cultosiName:res.trainName,//培训名称
                cultiTime:res.trainTime,//培训时间
                typeValue:typ,//培训类型
                trainingMaterial:JSON.parse(res.trainingMaterial),//培训证明材料
                signForm:JSON.parse(res.signIn),//签到表
                questionnaire:JSON.parse(res.signIn),//调查问卷
                taskid:response.dataRows.taskId,
                taskName:response.dataRows.taskName,
                tableid:response.dataRows.projApply.tableId
                }
              })
              }
          }
        }else{
          message.error(response.retVal);
        }
      }else{
        //详情
        let dataStr = {
          id:JSON.parse(queryid),
        };
        let data = yield call(Services.queryTrainDetail, dataStr);
        let arrPian = [];
              if(data.dataRows.trainingMaterial != '[]'){
                arrPian = JSON.parse( data.dataRows.trainingMaterial);
              }else if(data.dataRows.questionnaire != '[]' ){
              arrPian = JSON.parse( data.dataRows.questionnaire);
              }
              let typ=data.dataRows.trainType=="线上"?0:1
            arrPian.map((item,index)=>{item.key=index});
        if(data.retCode == '1'){
          yield put({
            type: 'save',
            payload: {
              // trainDetalils: JSON.parse(JSON.stringify(data.dataRows.trainName)),
              // trainTime:data.dataRows.createTime.substring(0,10),
              // personName:data.dataRows.personName,
              // deptName:data.dataRows.deptName,
              // trainType:data.dataRows.trainType,
              // tuTableSource:arrPian,
              // loading:false,
              trainDetalils: JSON.parse(JSON.stringify(data.dataRows.trainName)),
                cultosiName:data.dataRows.trainName,//培训名称
                cultiTime:data.dataRows.trainTime,//培训时间
                typeValue:typ,//培训类型
                trainingMaterial:JSON.parse(data.dataRows.trainingMaterial),//培训证明材料
                signForm:JSON.parse(data.dataRows.signIn),//签到表
                questionnaire:JSON.parse(data.dataRows.signIn),//调查问卷
            }
          })
        }
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
    //培训类型
    *typeChange({record}, {put, select}){
      const  {trainingMaterial,questionnaire,signForm } = yield select(v => v.trainAppModify);
      if(record.target.value == "0"){
        yield put({
          type: 'save',
          payload: {
            trainingMaterial:trainingMaterial, //
            questionnaire:[],    //调查问卷图片
            signForm:[]
          }
        })
      }else  if(record.target.value == "1"){
        yield put({
          type: 'save',
          payload: {
            trainingMaterial: [],
            signForm:signForm,
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
      const  {trainingMaterial,questionnaire,signForm ,typeValue} = yield select(v => v.trainAppModify);
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
            loading1: true,
          }
        })
      }
    },
    //材料删除
    *trainingDelete({record,name},{select, put}){
      const {trainingMaterial} = yield select(state => state.trainAppModify);
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
      const {signForm  } = yield select(state => state.trainAppModify);
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
    //图片放大
    *handlePreview({record,text},{put}){
      if(record == '打开'){
        yield put({
          type:'save',
          payload:{
            previewVisible:true,
            previewImage:text.RelativePath
          }
        })
      }else if(record == '关闭'){
        yield put({
          type:'save',
          payload:{
            previewVisible:false
          }
        })
      }
    },
    *trainingDelete2({record,name},{select, put}){
      const {questionnaire  } = yield select(state => state.trainAppModify);
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
      const  {cultosiName,cultiTime,signForm,typeValue,trainingMaterial, questionnaire,taskid,queryid,tableid} = yield select(v => v.trainAppModify);
      const dataStr ={
        trainName:cultosiName,//培训名称
        time:cultiTime,//培训时间
        trainType:typeValue,//培训类型（传0或者1，0是线上，1是线下）
        trainingMaterial:JSON.stringify(trainingMaterial),//培训证明材料（培训类型为0的时候比传）
        signIn:JSON.stringify(signForm),//签到表（培训类型为1的时候比传）
        questionnaire:JSON.stringify(questionnaire),//调查问卷（培训类型为1的时候比传）
        // flag:1
        taskId:taskid?taskid:"",
        id:tableid?tableid:JSON.parse(queryid) ,

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
            let data=yield  call(Services.updateTrainFill,dataStr);
            if (data.retCode === '1') {
              message.info('提交成功');
              yield put(routerRedux.push({
                pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
              }));
            }
          }
        }else {
          let data=yield  call(Services.updateTrainFill,dataStr);
          if (data.retCode === '1') {
            message.info('提交成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
            }));
          }
        }
      }else if(record ==  '保存') {
            dataStr['flag']=0
        let data=yield  call(Services.updateTrainFill,dataStr);
          if (data.retCode === '1') {
            message.info('提交成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
            }));
          }

      }else if(record ==  '取消'){
        yield put(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
        }));
      }
    }
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/trainAppIndex/trainAppModify') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}
