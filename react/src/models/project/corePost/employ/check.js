/**
 * 作者：靳沛鑫
 * 日期：2019-06-17
 * 邮箱：1677401802@qq.com
 * 文件说明：竞聘审核
 */
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import * as corePostEmployCheckService from "../../../../services/project/corePostEmployCheckService"
import {message} from "antd";

export default {
    namespace: 'employCheckQuery',

    state: {
        checkInfoList: [],      //审核列表
        historyList: [],        //审核历史信息
        chgText: [],
        params: {},
        query: []               //待办传参
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
        *init( { query } ,{ select, call, put }){
            yield put({
              type: 'save',
              payload:{
                query,
              }
            });
            //审核信息
            yield put({
              type : 'checkInfoList',
              query
            })
            //审核历史信息
            yield put({
            type : 'historyList',
            query
            });
        },
        * changedText( { value } ,{ put, call, select }) {
           yield put({
             type: 'save',
             payload:{
               chgText : value,
             }
           });
          // checkInfoList.map((i) => {
          //   chgText.id = i.id
          // })
         },
      //审核信息
        * checkInfoList( {query} ,{ put, call, select }) {
          const { params }= yield select(state => state.employCheckQuery)
          //流程id
          const postData={id:query.flowId}
          let data=yield call(corePostEmployCheckService.postsCheckList,postData)
          yield put({
            type : 'save',
            payload:{
              checkInfoList: data.DataRows,
              params:{...params}
            }
          });

        },
      //审核历史
        * historyList( {query} ,{ put, call, select }) {
          //流程id
          const postData={id:query.flowId}
          let data=yield call(corePostEmployCheckService.postsHistoryList, postData)
          yield put({
            type : 'save',
            payload:{
              historyList: data.DataRows
            }
          });
        },
      //通过or退回
        * addResetPosts( { ele, callback } ,{ put, call, select }) {
          const { chgText, checkInfoList, params, query }= yield select(state => state.employCheckQuery)
          params.corepositionIds=[]
          checkInfoList.map((item)=>{
            params.corepositionIds.push(item.id)
          })
          query.corepositionIds=params.corepositionIds+''
          query.opinion=chgText
          if( ele==='postRefuse' ){
            let data=yield call(corePostEmployCheckService.postsRefuseList, query)
            if (data.RetCode == '1') {
              message.success('退回成功');
              params.addCorRule='1'
              callback(params.addCorRule)
              yield put(routerRedux.push({pathname: '/taskList'}));
            }else{
              params.addCorRule='0'
              params.message=data.RetVal
              switch(params.message){
                case '缺少参数opinion': params.message='请填写退回意见';break;
                default : break
              }
              message.error(params.message);
            }
          }else{
            let data=yield call(corePostEmployCheckService.postsPassList, query)
            if (data.RetCode == '1') {
              message.success('通过成功');
              params.addCorRule='1'
              callback(params.addCorRule)
              yield put(routerRedux.push({pathname: '/taskList'}));
            }else{
              message.error(data.RetVal);
            }
          }
          yield put({
            type: 'save',
            payload:{
              params : {...params},
            }
          });
        }
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/check') {
                    dispatch({
                        type: 'init',
                        query
                    });
                }
            });
        },
    },
};
