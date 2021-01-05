/**
 * 作者：韩爱爱
 * 日期：2020-11-18
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训申请-首页
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers';
import Cookie from 'js-cookie';
export default {
  namespace: 'trainAppIndex',
  loading: true,
  state: {
    appNmae:'',
    cultiTime:'',
    recordDataSource: [], //表格数据
    pageCurrent: 1,//当前页面
    pageDataCount: '',//总数据条数
    pageSize: 10,
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
  },
  effects: {
    * init({}, {call, put, select}) {
      yield put({
        type: 'queryTrainLike'
      });

    },
    //个人培训记录模糊查询
    *queryTrainLike({page}, {call, put, select}) {
      const  dataStr ={
        id:Cookie.get('userid')
      };
      let data = yield call(Services.queryTrainResultAndTrainByIdAll, dataStr);
      if(data.retCode == '1'){
        let recordDataSource1 =[];
        data.dataRows.map((item,index)=>{
          item.map((i,v)=>{
            i.trainTime = i.trainTime.substring(0, 10);
            recordDataSource1.push(i)
          })
        });
        yield put({
          type: 'save',
          payload: {
            recordDataSource: JSON.parse(JSON.stringify(recordDataSource1)),
            pageDataCount:recordDataSource1.length,
          }
        });
      }else {
        message.error(data.retVal)
      }
    },
    //时间
    *changeDate({startTime }, {put}) {
      yield put({
        type: 'save',
        payload: {
          cultiTime: startTime,
        }
      });
    },
    //名字
    *otherVlaue({record }, {put}) {
      yield put({
        type: 'save',
        payload: {
          appNmae: record.target.value,
        }
      });
    },
    //清空
    *emptyMaterial({ }, {put}) {
      yield put({
        type: 'save',
        payload: {
          appNmae:'',
          cultiTime:'',
        }
      });
      yield put({
        type: 'queryTrainLike'
      });
    },
    //页码
    *handlePageChange({page }, {put}) {
      console.log(page);
      yield put({
        type: 'save',
        payload: {
          pageCurrent:page,
        }
      })
    },
    //查询
    *inquiryMaterial({},{put,call, select}){
      yield put({
        type: 'inquiryMaterialOu'
      });
    },
    *inquiryMaterialOu({page},{put,call, select}){
      const {appNmae,cultiTime,recordDataSource} = yield select(v => v.trainAppIndex);

      const  dataStr ={
        id:Cookie.get('userid')
      };
      let data = yield call(Services.queryTrainResultAndTrainByIdAll, dataStr);
      if(data.retCode == '1'){
        let recordData =[];
        let checkData=[];
        let counData =[];
        let recordDataSource1 =[];
        data.dataRows.map((item,index)=>{
          item.map((i,v)=>{
            i.trainTime = i.trainTime.substring(0, 10);
            recordDataSource1.push(i)
          })
        });
        if( cultiTime.length == '0'){
          recordDataSource1.map(item => {
            item.trainTime = item.trainTime.substring(0, 10);
            if (item.trainName.indexOf(appNmae) != -1) {
              recordData.push(item)
            }
          });
          yield put({
            type: 'save',
            payload: {
              recordDataSource: JSON.parse(JSON.stringify(recordData)),
              pageDataCount: recordData.length,
            }
          });
        }else if(appNmae.length =='0'){
          recordDataSource1.map(item => {
            item.trainTime = item.trainTime.substring(0, 10);
            if(item.trainTime.indexOf(cultiTime) != -1){
              checkData.push(item)
            }
          });
          yield put({
            type: 'save',
            payload: {
              recordDataSource: JSON.parse(JSON.stringify(checkData)),
              pageDataCount: checkData.length,
            }
          });
        }else if(appNmae.length !='0' &&  cultiTime.length != '0'){
          recordDataSource1.map(item => {
            item.trainTime = item.trainTime.substring(0, 10);
            if(item.trainName.indexOf(appNmae) != -1 && item.trainTime.indexOf(cultiTime) != -1){
              counData.push(item)
            }
          });
          yield put({
            type: 'save',
            payload: {
              recordDataSource: JSON.parse(JSON.stringify(counData)),
              pageDataCount: counData.length,
            }
          });
        }
      }
    },
    //删除
    *deletData({record},{put,call,select}){
      console.log(record);
      let recordStr = record.material == undefined
      console.log(recordStr);
      const dataStr ={
        id:record.id,
        type:'t'
      };
      let data = yield call(Services.deleteTrainAndTrainResult, dataStr);
      if(data.retCode == '1'){
        yield put({
          type: 'queryTrainLike'
        });
      }else {
        message.error(data.retVal)
      }
    },
    //下载
    *emptyDownload({record},{put,call,select}){
      let str=record.material == undefined ?false:true;
      if(str != false){
        let data ='/microservice/newsmanager/downloaTrain?id='+ record.id + '&type=m';
        window.open(data,'_self')
      }else {
        let data = '/microservice/newsmanager/downloaTrain?id='+ record.id + '&type=t';
        window.open(data,'_self')
      }

    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/trainAppIndex') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}