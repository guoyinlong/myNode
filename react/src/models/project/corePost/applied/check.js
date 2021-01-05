/**
 * 作者：靳沛鑫
 * 日期：2019-06-20
 * 邮箱：1677401802@qq.com
 * 文件说明：续聘审核
 */
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import {message} from 'antd';
import * as corePostAppliedCheckService from "../../../../services/project/corePostAppliedCheckService"
import * as corePostEmployCheckService from "../../../../services/project/corePostEmployCheckService";

export default {
    namespace: 'appliedCheckQuery',

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
        * checkInfoList( { query } ,{ put, call, select }) {
          const { params }= yield select(state => state.appliedCheckQuery)
          const postData={id:query.flowId}
          let data=yield call(corePostAppliedCheckService.postsCheckList, postData)
          yield put({
            type : 'save',
            payload:{
              checkInfoList: data.DataRows,
              params:{...params}
            }
          });
        },
      //审核历史
        * historyList( { query } ,{ put, call, select }) {
          const postData={id:query.flowId}
          let data=yield call(corePostAppliedCheckService.postsHistoryList, postData)
          yield put({
            type : 'save',
            payload:{
              historyList: data.DataRows
            }
          });
        },
      //退回通过
        * addResetPosts( { ele,callback } ,{ put, call, select }) {
          const { chgText, checkInfoList, params, query }= yield select(state => state.appliedCheckQuery)
          params.corepositionIds=[]
          checkInfoList.map((item)=>{
            params.corepositionIds.push(item.id)
          })
          query.corepositionIds=params.corepositionIds+''
          query.opinion=chgText
          if( ele==='postRefuse' ){
            let data=yield call(corePostAppliedCheckService.postsRefuseList, query)
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
            let data=yield call(corePostAppliedCheckService.postsPassList, query)
            if (data.RetCode == '1') {
              message.success('通过成功');
              params.addCorRule='1'
              callback(params.addCorRule)
              yield put(routerRedux.push({pathname: '/taskList'}));
            }else{
              message.error(data.RetVal);
            }
          }
        }
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/appCheck') {
                    dispatch({
                        type: 'init',
                        query
                    });
                }
            });
        },
    },
};
