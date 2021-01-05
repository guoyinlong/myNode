/**
 * 作者：韩爱爱
 * 日期：2020-11-06
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训备案-首页
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers';
import Cookie from 'js-cookie';
export default {
  namespace: 'trainingRecordIndex',
  loading: true,
  state: {
    crewNname: [],// 人员姓名
    channelName: [],//
    checkObjectAndContentList: [],//部门
    checkObject:[],//选中部门
    recordDataSource: [], //表格数据
    pageCurrent: 1,//当前页面
    pageDataCount: '',//总数据条数
    pageSize: '10',
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
        type: 'queryTrainLike'//
      });
      yield put({
        type: 'queryUserInfo'//查询去重部门
      });
      yield put({
        type: 'queryDistinctName'//查询所有培训名字
      });
    },
    //个人培训记录模糊查询
    *queryTrainLike({}, {call, put, select}) {
      const {pageCurrent, pageSize, channelName, checkObject} = yield select(v => v.trainingRecordIndex);
      const dataOstr = {
        pageCurrent: pageCurrent,//当前页
        pageSize: pageSize,//每页大小
        personName: channelName,//人员名字
        deptName: checkObject,//部门名字
      };
      let data = yield call(Services.queryTrainLike, dataOstr);
      if (data.dataRows!== '0') {
        data.dataRows.map(item => {
          item.trainTime = item.trainTime.substring(0, 10);
        });
        yield put({
          type: 'save',
          payload: {
            recordDataSource: JSON.parse(JSON.stringify(data.dataRows)),
            pageDataCount:data.allCount,
          }
        });
      }
    },

    //查询所有培训名字
    *queryDistinctName({}, {call, put, select}){
      let data = yield call(Services.queryDistinctName, {});
      if (data.retCode == '1') {
        let itemArr = [];
        data.dataRows.map((item, index) => {
          if(item != null){
            item.personName.split(',').map((i, v) => {
              itemArr.push({
                value:i,
                title:i,
                disabled :false,
              });
            });
          }
        });
        for (var i = 0, len = itemArr.length; i < len; i++) {
          for (var j = i + 1, len = itemArr.length; j < len; j++) {
            if (itemArr[i].value === itemArr[j].value) {
              itemArr.splice(j, 1);
              j--;
              len--;
            }
          }
        }
        yield put({
          type: 'save',
          payload: {
            crewNname: JSON.parse(JSON.stringify(itemArr))
          }
        })
      }
    },
    //查询去重部门
    * queryUserInfo({}, {call, put, select}) {
      let data = yield call(Services.queryDistinctDeptName, {});
      if (data.retCode == '1'){
        let itemArr =[];
        data.dataRows.map((item, index) => {
          if(item != null){
            item.deptName.split(',').map((i,v)=>{
              itemArr.push({
                value:i,
                title:i,
                disabled :false,
              });
            });
          }
        });
        for (var i = 0, len = itemArr.length; i < len; i++) {
          for (var j = i + 1, len = itemArr.length; j < len; j++) {
            if (itemArr[i].value === itemArr[j].value) {
              itemArr.splice(j, 1);
              j--;
              len--;
            }
          }
        }
        yield put({
          type: 'save',
          payload: {
            checkObjectAndContentList: JSON.parse(JSON.stringify(itemArr))
          }
        })
      }
    },
    //选中单位
    * onObjectChange({record}, {put}) {
      yield put({
        type: 'save',
        payload: {
          checkObject: record,
        }
      })
    },
    //人员姓名
    * nameObjectChange({record}, {put}) {
      yield put({
        type: 'save',
        payload: {
          channelName: record,
        }
      })
    },
    // 修改页码
    *changePage({page},{put}){
      yield put ({
        type:"save",
        payload:{
          pageCurrent:page
        }
      });
      yield put ({
        type:"queryTrainLike"
      })
    },
    //清空
    *emptyMaterial({},{put}){
       yield put({
         type: 'save',
         payload: {
           checkObject: [],
           channelName:[]
         }
       });
      yield put ({
        type:"queryTrainLike"
      })
    },
    //查询
    *inquiryMaterial({},{put,select,call}){
      const {checkObject ,channelName,pageCurrent, pageSize,} = yield select(state => state.trainingRecordIndex);
      const dataOstr = {
        pageCurrent: pageCurrent,//当前页
        pageSize: pageSize,//每页大小
      };
      let data = yield call(Services.queryTrainLike, dataOstr);
      let recordData =[];
      let checkData=[];
      let counData =[];
      if(channelName.length != '0' && checkObject.length == '0') {
        data.dataRows.map(item => {
          item.trainTime = item.trainTime.substring(0, 10);
          if (item.personName.indexOf(channelName) != -1) {
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
      }else if(checkObject.length != '0' && channelName.length == '0'){
        data.dataRows.map(i => {
          i.trainTime = i.trainTime.substring(0, 10);
          if(i.deptName.indexOf(checkObject) != -1 ){
            checkData.push(i)
          }
        });
        yield put({
          type: 'save',
          payload: {
            recordDataSource: checkData,
            pageDataCount:checkData.length,
          }
        });
      }else if(checkObject.length != '0' && channelName.length != '0'){
        data.dataRows.map(i => {
          i.trainTime = i.trainTime.substring(0, 10);
          if(i.deptName.indexOf(checkObject) != -1 && i.personName.indexOf(channelName) != -1 ){
            counData.push(i)
          }
        });
        yield put({
          type: 'save',
          payload: {
            recordDataSource: counData,
            pageDataCount: counData.length,
          }
        });
      }
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/trainingRecordIndex') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}