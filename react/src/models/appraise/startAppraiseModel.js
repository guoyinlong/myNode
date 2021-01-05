/**
 *  作者: 王福江
 *  创建日期: 2019-11-21
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：发起评议功能
 */
import Cookie from 'js-cookie';
import {message} from "antd";
import * as appraiseService from "../../services/appraise/appraiseService";
import * as hrService from '../../services/hr/hrService.js';

const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace: 'startAppraiseModel',
  state: {
    personDataList: [],
    organDataList: [],
    ouList:[],
    appraisePersonInfo:{},
    appraiseOraganInfo:{},
    commentData1: [],
    commentData2: [],
    commentData3: [],
    appraiseInfo: [],
  },
  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
    saveOU(state,{ouList: DataRows}) {
      return { ...state, ouList:DataRows};
    },
  },
  effects: {
    *initStartAppraise({}, {call, put}) {
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = Cookie.get('tenantid');;
      const {DataRows:getOuData} = yield call(hrService.getOuList, postData_getOU);
      yield put({
        type: 'saveOU',
        ouList: getOuData
      });
      let queryParam = {
        arg_ou_id : Cookie.get('OUID'),
      };
      const personData = yield call(appraiseService.cadreInfoList,queryParam);
      if(personData.RetCode === '1'){
        for (let i=0;i<personData.DataRows.length;i++){
          personData.DataRows[i]['indexID'] = i+1;
          personData.DataRows[i]['ID'] = i+1;
        }
        yield put({
          type: 'save',
          payload: {
            personDataList: personData.DataRows
          }
        });
      }else{
        message.error('查询失败！');
      }
    },
    *queryStartAppraise({arg_param}, {call, put}) {
      const personData = yield call(appraiseService.appraisePersonList,arg_param);
      if(personData.RetCode === '1'){
        for (let i=0;i<personData.DataRows.length;i++){
          personData.DataRows[i]['indexID'] = i+1;
          personData.DataRows[i]['ID'] = i+1;
        }
        yield put({
          type: 'save',
          payload: {
            personDataList: personData.DataRows
          }
        });
      }else{
        message.error('查询失败！');
      }
    },
    *queryOrganAppraise({arg_param}, {call, put}) {
      const organData = yield call(appraiseService.appraiseOrganList,arg_param);
      if(organData.RetCode === '1'){
        for (let i=0;i<organData.DataRows.length;i++){
          organData.DataRows[i]['indexID'] = i+1;
          organData.DataRows[i]['ID'] = i+1;
        }
        yield put({
          type: 'save',
          payload: {
            organDataList: organData.DataRows
          }
        });
      }else{
        message.error('查询失败！');
      }
    },
    *startPersonAppraise({arg_param}, {call, put}) {
      const satrtData = yield call(appraiseService.startPersonAppraise,arg_param);
      if(satrtData.RetCode === '1'){
        yield put({
          type: 'queryStartAppraise',
          arg_param: arg_param,
        });
        message.info("操作成功！");
      }else{
        message.error('操作失败！');
      }
    },
    *startOraganAppraise({arg_param}, {call, put}) {
      const satrtData = yield call(appraiseService.startOraganAppraise,arg_param);
      if(satrtData.RetCode === '1'){
        yield put({
          type: 'queryOrganAppraise',
          arg_param: arg_param,
        });
        message.info("操作成功！");
      }else{
        message.error('操作失败！');
      }
    },
    /*查询个人评议结果*/
    *queryPersonInfo({arg_param}, {call, put}) {
      const personFirstData = yield call(appraiseService.appraisePersonInfo,arg_param);
      if(personFirstData.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            appraiseInfo: personFirstData.DataRows
          }
        });
      }else{
        message.error('查询失败！');
      }
    },
    /*查询组织结构评议结果*/
    *queryOrganInfo({arg_param}, {call, put}) {
      const commentData = yield call(appraiseService.appraiseOrganInfo,arg_param);
      if(commentData.RetCode === '1'){
        let commentData1 = [];
        let commentData2 = [];
        let commentData3 = [];
        for (let i=0;i<commentData.DataRows.length;i++){
          commentData.DataRows[i]['indexID'] = i+1;
          commentData.DataRows[i]['ID'] = i+1;
          if(commentData.DataRows[i].comment_type==='1'){
            commentData1.push(commentData.DataRows[i]);
          }else if(commentData.DataRows[i].comment_type==='2'){
            commentData2.push(commentData.DataRows[i]);
          }else{
            commentData3.push(commentData.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            appraiseOraganInfo: commentData.DataRows,
            commentData1: commentData1,
            commentData2: commentData2,
            commentData3: commentData3
          }
        });
      }else{
        message.error('查询失败！');
      }
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/appraise/startAppraise') {
          dispatch({ type: 'initStartAppraise',query });
        }
      });
    }
  }
}
