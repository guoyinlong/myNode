/**
 * 作者：韩爱爱
 * 日期：2020-12-22
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单-培训批量上传
 */
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import {message} from 'antd';
import * as Services from "../../../../services/newsOne/newsOneServers";
export default {
  namespace: 'TrainBulkUpload',
  loading:[false],
  state: {
    query:'',
    trainTypeStr:[false],//类型 线上：true ,线下：false
    bulkSource:[],//批量上传数据
    loading1:[false],
    loading2:[false],
    loading3:[false],
    subDataCurrent:1,
    subDataCount:'',
    personName:''
  },
  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    *init({query},{put}){
      yield put({
        type: 'save',
        payload: {
          query:query.name
        }
      });
      yield put({
        type: 'recordData',
      });
    },
    //数据
    *recordData({},{put,call,select}){
      const {trainTypeStr,loading1,loading2,loading3,query} = yield select(v=>v.TrainBulkUpload);
      if(query == '重大'){
        let recordItem= JSON.parse(sessionStorage.getItem('record'));
        recordItem.map((item,index)=>{
          item.index =index;
          loading1.splice(index,1,false);
        });
        yield put({
          type: 'save',
          payload: {
            bulkSource:recordItem,
            subDataCount:recordItem.length,
            loading1:loading1,
          }
        });
      }else if(query == '培训'){
        let recordItem= JSON.parse(sessionStorage.getItem('record'));
        let trainType1 =trainTypeStr;//类型 线上：true ,线下：false
        recordItem.map((item,index)=>{
          item.index =index;
          loading1.splice(index,1,false);
          loading2.splice(index,1,false);
          if(item.trainType == '线下'){
            trainType1.splice(index,1,false)
          }else if(item.trainType == '线上'){
            trainType1.splice(index,1,true)
          }
        });
        yield put({
          type: 'save',
          payload: {
            bulkSource:recordItem,
            subDataCount:recordItem.length,
            trainTypeStr:trainType1,
            loading1:loading1,
            loading2:loading2,
            personName:recordItem[0].personName
          }
        });
      }
    },
    //图片上传
    *imgChange({record,name,dataNmae},{call,put,select}){
      const {bulkSource,loading1,loading2,loading3,query} = yield select(v=>v.TrainBulkUpload);
      if(name.status =='done' ){
        if(name.response.RetCode == '1') {
          if(query == '重大'){
            const dataStr={
              id:dataNmae.id,
              image :JSON.stringify(name.response.filename)
            };
            let data =yield call(Services.uploadActivityImage,dataStr);
            if(data.retCode == '1'){
              message.info('导入成功');
              bulkSource.map((item,index)=>{
                if(dataNmae.id == item.id){
                  item.proveImage =JSON.parse(data.dataRows);
                  loading1.splice(index,1,true)
                }
              })
              yield put({
                type: 'save',
                payload: {
                  bulkSource:bulkSource,
                  loading1:loading1
                }
              });

            }else {
              message.error(data.retVal)
            }
          }else if(query == '培训'){
            //图片导入
            const dataStr={
              id:dataNmae.id,
              material:JSON.stringify(name.response.filename)
            };
            let data =yield call(Services.uploadMaterial,dataStr);
            if(data.retCode == '1'){
              message.info('导入成功');
              if(record == '签到表'){
                bulkSource.map((item,index)=>{
                  if(item.id == dataNmae.id){
                    item.trainForm =JSON.parse(data.dataRows);
                    loading2.splice(index,1,true)
                  }
                });
                yield put({
                  type: 'save',
                  payload: {
                    bulkSource:bulkSource,
                    loading2:loading2
                  }
                });
              }else if(record == '培训证明材料'){
                bulkSource.map((item,index)=>{
                  if(item.id == dataNmae.id){
                    item.trainMaterials =JSON.parse(data.dataRows);
                    loading1.splice(index,1,true)
                  }
                });
                yield put({
                  type: 'save',
                  payload: {
                    bulkSource:bulkSource,
                    loading1:loading1
                  }
                });
              }
            }
          }

        }else {
          message.error(`${name.name} 上传失败.`)
        }
      }else if(name.status === 'error'){
        message.error(`${name.name} 文件上传失败.`);
      }else if (name.status !== 'uploading') {
      }
    },
    //删除
    *eachDetail({record,name},{call,put,select}){
      const {bulkSource} = yield select(v=>v.TrainBulkUpload);
      bulkSource.map((item,index)=>{
        if(item.index == name.index){
          bulkSource.splice(index,1)
        }
      });
      bulkSource.map((item,index)=>{
        item.index =index;
      });
      yield put ({
        type : 'save',
        payload : {
          bulkSource: JSON.parse(JSON.stringify(bulkSource)),
          subDataCount:bulkSource.length
        }
      });
    },
    //页码
    *handlePageChange({record,name},{call,put}){
      yield  put({
        type:'save',
        payload:{
          subDataCurrent:record
        }
      })
    },
    //提交
    *submissionTopic({record,name},{call,put,select}){
      const {bulkSource,loading1,loading2,loading3,query} = yield select(v=>v.TrainBulkUpload);
      if(query == '重大'){
        yield put(routerRedux.push({
          pathname: '/adminApp/newsOne/contributionList',
        }));
      }else if(query == '培训'){
        for(let i=0;i<bulkSource.length;i++){
          if(bulkSource[i].trainType == '线下'){
            if(bulkSource[i].trainForm==undefined ) {
              return message.info('签到表和调差问卷图片不能为空')
            }else {
              yield put(routerRedux.push({
                pathname:'/adminApp/newsOne/contributionList',
              }));
            }
          }else if(bulkSource[i].trainType == '线上'){
            if(bulkSource[i].trainMaterials== undefined) {
              return  message.info('培训证明材料图片不能为空')
            }else {
              yield put(routerRedux.push({
                pathname:'/adminApp/newsOne/contributionList',
              }));
            }
          }
        }
      }
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/TrainBulkUpload') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
