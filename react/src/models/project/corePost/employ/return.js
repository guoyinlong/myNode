/**
 * 作者：靳沛鑫
 * 日期：2019-06-19
 * 邮箱：1677401802@qq.com
 * 文件说明：竞聘退回
 */
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import {message} from 'antd';
import * as corePostEmployReturnService from "../../../../services/project/corePostEmployReturnService"

export default {
    namespace: 'checkReturn',
    state: {
        returnList: [],          //退回列表
        query: [],               //传递参数
        params: {},
        numBox:[]
    },

    reducers: {
        initData(state){
            return {
                ...state,
            }
        },
        save(state, action){
            return {
                ...state,
                ...action.payload,
            }
        }
    },

    effects: {
        *  init( {query} ,{ select, call, put }){
            yield put({
              type: 'save',
              payload:{
                query,
              }
            });
            //初始化列表
            yield put({
                type: 'returnListQuery',
                query,
            });
        },
        //退回信息
        * returnListQuery( {query} , { call, put, select }) {
          const postData={
              flowId:query.flowId,
              flowProcessId:query.flowProcessId
          }
          let data = yield call(corePostEmployReturnService.postsReturnList, postData);
          const { params, numBox } = yield select(state => state.checkReturn);
          if(data.RetCode=='1'){
            data.DataRows.map((item, index)=>{
              numBox[index]='1'
            })
            params.opition=data.opinion
            yield put({
              type: 'save',
              params:{...params}
            });
            yield put({
              type: 'save',
              payload: {
                returnList: data.DataRows,
                numBox
              }
            });
          }
         },
        //上传文件后的信息提交
        * upDataReturn({ corepositionId, name, url, num, callback },{ call, put, select }){
          const { query,numBox } = yield select(state => state.checkReturn);
          let postData = {corepositionId, name, url}
          let data=yield call(corePostEmployReturnService.upDataReturnUrl, postData);
          if (data.RetCode == '1') {
            message.success(`${name}上传成功`);
            numBox[num]='1'
            yield put({
              type: 'save',
              payload:{
                numBox,
              }
            });
            let xnum='1'
            for(let key in numBox){
              if(numBox[key]=='0'){
                xnum='0'
              }
            }
            callback(xnum)
          }else{
            message.error(data.RetVal);
          }
          yield put({
            type: 'returnListQuery',
            query,
          });
        },
        //提交
        * resetCond({ elem },{ call, put, select }){
          const { returnList, params, query } = yield select(state => state.checkReturn);
          params.corepositionIds=[]
          if(returnList.length!=0){
            returnList.map((item)=>{
              params.corepositionIds.push(item.id)
            })
            if (elem){
              let postData = {corepositionIds:params.corepositionIds+'', flowId:query.flowId, taskUUID:query.taskUUID }
              let data = yield call(corePostEmployReturnService.upDataReapplied, postData);
              if (data.RetCode == '1') {
                message.success('提交成功');
                yield put(routerRedux.push({pathname: '/taskList'}));
              }else{
                message.error(data.RetVal);
              }
            }else{
              let postData = {id:query.flowId, taskUUID:query.taskUUID }
              let data = yield call(corePostEmployReturnService.upDataClose, postData);
              if (data.RetCode == '1') {
                message.success('终止成功');
                yield put(routerRedux.push({pathname: '/taskList'}));
              }else{
                message.error(data.RetVal);
              }
            }
           }
        },
       * changeNum({num}, {call, put, select}){
         const { numBox } = yield select(state => state.checkReturn);
         numBox[num]='0'
         yield put({
           type: 'save',
           payload:{
             numBox,
           }
         });
       }
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/return') {
                    dispatch({
                        type: 'init',
                        query
                    });
                }
            });
        },
    },
};
