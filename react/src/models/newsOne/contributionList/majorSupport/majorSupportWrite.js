/**
 * 作者：韩爱爱
 * 日期：2020-11-09
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单-重大活动支撑首页-填报
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers'
import {routerRedux} from "dva/router";
export default {
  namespace: 'majorSupportWrite',
  loading: true,
  state:{
    mobileName:'',//活动名称
    cobileTime:'',//活动时间
    eventWork:['摄影','摄像','H5制作','视频剪辑','新闻稿','微博稿','其他'],// 活动中担任工作
    eventWorkArr:[],
    evenArr:[],
    eventNum:false,
    pictureList:'',//图片存放
    shareResult:[],//表格数据
    wenInput:'',//其他
    checked:true,
    loading:false,
  },
  reducers:{
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },
  effects: {
    * init({}, {put}) {
      yield put({
        type:'save',
        payload:{
          mobileName:'',//活动名称
          cobileTime:'',//活动时间
          eventWork:['摄影','摄像','H5制作','视频剪辑','新闻稿','微博稿','其他'],// 活动中担任工作
          eventNum:false,
          eventWorkArr:[],
          evenArr:[],
          pictureList:'',//图片存放
          shareResult:[],//表格数据
          wenInput:'',//其他
          loading:false,
        }
      })
    },
    ////活动名称
    *mobileVlaue({record}, {put}){
      yield put({
        type:'save',
        payload:{
          mobileName:record.target.value
        }
      })
    },
    //活动时间
    *changeDate({startTime}, {put}){
      yield put({
        type:'save',
        payload:{
          cobileTime:startTime
        }
      })
    },
    // 活动中担任工作
    *eventVlaue({record,index}, {put,select}){
      const  {evenArr} = yield select(v => v.majorSupportWrite);
      if(record.checked == true){
        evenArr.push(record.value);
      }else if(record.checked == false){
        evenArr.splice(evenArr.indexOf(record.value),1)
      }

      if(record.value == '其他') {
        if (record.checked == true) {
          yield put({
            type: 'save',
            payload: {
              eventNum: true,
            }
          })
        } else if(record.checked == false) {
          yield put({
            type: 'save',
            payload: {
              eventNum: false,
            }
          })
        }
      }

      yield put({
        type:'save',
        payload:{
          eventWorkArr:evenArr
        }
      });
    },
    // 活动中担任工作 -其他
    *otherVlaue({record}, {put,select}){
      let recordInput= record.target.value;
      yield put({
        type:'save',
        payload:{
          wenInput:recordInput,
        }
      })
    },
    //活动证明材料上传
    *pictureChange({record},{put, select}){
      const  {shareResult} = yield select(v => v.majorSupportWrite);
      if (record.file.status === 'done') {
        if (record.file.response.RetCode === '1') {
          shareResult.push(record.file.response.filename);
          yield put({
            type: 'save',
            payload: {
              shareResult:JSON.parse(JSON.stringify(shareResult)),
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
    //删除
    *trainingDelete({record},{select, put}){
      const  {shareResult} = yield select(v => v.majorSupportWrite);
      for (let i = 0; i < shareResult.length; i++) {
        const a = shareResult.filter(v => v.RelativePath !== record.RelativePath);
        yield put({
          type: 'save',
          payload: {
            shareResult: JSON.parse(JSON.stringify(a)),
          }
        })
      }
    },
    *submission({record},{select, put,call}){
      const  {mobileName,cobileTime,eventWorkArr,shareResult,eventWork,wenInput} = yield select(v => v.majorSupportWrite);
      eventWorkArr.map((item,index)=>{
        if(item == '其他'){
          if(wenInput == ''){
            message.info('必填项不能为空')
          }else {
            eventWorkArr.splice(index,1,wenInput)
          }
        }
      });
      if(record == '提交'){
        if(mobileName == ''||cobileTime == ''||eventWork==''||shareResult.length==0){
          message.info('必填项不能为空')
        }else {
          const dataStr={
            activityName:mobileName.toString(),
            activityTime :cobileTime.toString(),
            job:JSON.stringify(eventWorkArr).replace(/\[|]/g,''),
            proveImage:JSON.stringify(shareResult).replace(/\[|]/g,''),
            flag:1,
          };
          let data = yield call(Services.addActivity, dataStr);
          if(data.retCode =='1'){
            message.info('提交成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/majorSupportIndex',
            }));
          }else {
            message.info(data.retVal)
          }
        }
      }else if(record == '保存'){
        if(mobileName == ''||cobileTime == ''||eventWork.length==0||shareResult.length==0 ){
          message.info('必填项不能为空')
        }else {
          const dataStr={
            activityName:mobileName.toString(),
            activityTime :cobileTime.toString(),
            job:JSON.stringify(eventWorkArr).replace(/\[|]/g,''),
            proveImage:JSON.stringify(shareResult).replace(/\[|]/g,''),
            flag:0,
          };
          let data = yield call(Services.addActivity, dataStr);
          if(data.retCode =='1'){
            message.info('保存成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/majorSupportIndex',
            }));
          }else {
            message.info(data.retVal)
          }
        }
      }else if(record == '取消'){
        yield put(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/majorSupportIndex',
        }));
        yield put({
          type:'save',
          payload:{
            mobileName:'',//活动名称
            mobileTime:'',//活动时间
            eventWork:[],// 活动中担任工作
            shareResult:[],//表格数据
            wenInput:'',
            loading:false,
          }
        })
      }
    }

  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportWrite') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}