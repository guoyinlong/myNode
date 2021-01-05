/**
 * 作者：靳沛鑫
 * 日期：2019-06-19
 * 邮箱：1677401802@qq.com
 * 文件说明：续聘退回
 */
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import {message} from 'antd';
import * as corePostAppliedReturnService from "../../../../services/project/corePostAppliedReturnService"
import * as corePositionService from "../../../../services/project/corePositionService"

export default {
    namespace: 'appCheckReturn',
    state: {
        returnList: [],          //退回列表
        query: [],               //传递参数
        params: {},
        userNameList: []
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
        *  init( { query } ,{ select, call, put }){
            //初始化列表
            yield put({
                type: 'returnListQuery',
                query
            });
            yield put({
              type: 'save',
              payload:{
                query,
              }
            });
        },
        * returnListQuery( { query } , { call, put, select }) {
          const postData={
                        flowId:query.flowId,
                        flowProcessId:query.flowProcessId
                    }
          let data = yield call(corePostAppliedReturnService.postsReturnList, postData);
          const { params } = yield select(state => state.appCheckReturn);
          params.opition=data.opinion
          yield put({
            type: 'save',
            params:{...params}
          });
           yield put({
             type: 'save',
             payload: {
               returnList: data.DataRows
             }
           });

         },

        //上传文件后的信息提交
        * upDataReturn({ corepositionId, name, url },{ call, put, select }){
          const { query } = yield select(state => state.appCheckReturn);
          let postData = {corepositionId, name, url}
          yield call(corePostAppliedReturnService.upDataReturnUrl, postData);
          yield put({
            type: 'returnListQuery',
            query
          })
        },
        //提交
        * resetCond({ elem },{ call, put, select }) {
          const {returnList, params, query} = yield select(state => state.appCheckReturn);
          params.corepositionIds = []
          if (returnList.length != 0) {
            returnList.map((item) => {
              params.corepositionIds.push(item.id)
            })
            if (elem) {
              let postData = {corepositionIds: params.corepositionIds + '', flowId: query.flowId, taskUUID:query.taskUUID}
              let data = yield call(corePostAppliedReturnService.upDataReapplied, postData);
              if (data.RetCode == '1') {
                message.success('提交成功');
                yield put(routerRedux.push({pathname: '/taskList'}));
              }
            } else {
              let postData = {id: query.flowId, taskUUID:query.taskUUID }
              let data = yield call(corePostAppliedReturnService.upDataClose, postData);
              if (data.RetCode == '1') {
                message.success('终止成功');
                yield put(routerRedux.push({pathname: '/taskList'}));
              }
            }
          }
        },
        //添加人模态窗
        * addPerson({record},{ call, put, select }){
          const { params } = yield select(state => state.appCheckReturn);
          params.username=record.corepositionUserName
          params.affiliatedAcademy=record.affiliatedAcademy
          params.userId=record.corepositionUserId
          params.id=record.id
          yield put({
            type: 'save',
            payload:{
              params : {...params},
            }
          });
          yield put({
            type: 'userAndAcademyNames'
          })
        },
        //人员及其所属院
        * userAndAcademyNames({id}, {call, put, select}){
          const { params, userNameList} = yield select(state => state.appCheckReturn);
          let data = yield call(corePositionService.userAndAcademyNames);
          if(data.RetCode=='1'){
            userNameList.map((i)=>{
              if(i.userId==id.slice(-7)){
                params.username=i.username
                params.corepositionUserId=i.userId
                params.affiliatedAcademy=i.affiliatedAcademy
              }
            })
            yield put({
              type: 'save',
              payload:{
                userNameList: data.DataRows
              }
            });
            yield put({
              type: 'save',
              payload:{
                params : {...params},
              }
            });
          }
        },
        //模态窗确定
        * addCorePosts({callback}, {call, put, select}){
          const { params, query } = yield select(state => state.appCheckReturn);
          let postData = { corepositionId:params.id, corepositionUserId:params.corepositionUserId}
          let data=yield call(corePostAppliedReturnService.addPersons, postData);
          if (data.RetCode == '1') {
            message.success('提交成功');
            params.addCorRule='1'
          }else{
            params.addCorRule='0'
            params.message=data.RetVal
          }
          callback(params.addCorRule)
          if(params.addCorRule=='0'){
            switch(params.message){
              case '缺少参数corepositionUserId': params.message='请填写核心岗位人';break;
              default : break
            }
            message.error(params.message);
          }else{
            yield put({
              type: 'returnListQuery',
              query
            })
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
                if (pathname === '/appReturn') {
                    dispatch({
                        type: 'init',
                        query
                    });
                }
            });
        },
    },
};
