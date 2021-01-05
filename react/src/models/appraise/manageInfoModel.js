/**
 *  作者: 王福江
 *  创建日期: 2019-11-13
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：干部和评议人员维护功能
 */
import Cookie from 'js-cookie';
import {message} from "antd";
import * as appraiseService from "../../services/appraise/appraiseService";

const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace: 'manageInfoModel',
  state: {
    cadreDataList: [],
    personDataList: [],
  },
  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },
  effects: {
    *initCadreQuery({}, {call, put}) {
      let queryParam = {
        arg_ou_id : Cookie.get('OUID'),
      };
      const cadreData = yield call(appraiseService.cadreInfoList,queryParam);
      if(cadreData.RetCode === '1'){
        for (let i=0;i<cadreData.DataRows.length;i++){
          cadreData.DataRows[i]['indexID'] = i+1;
          cadreData.DataRows[i]['ID'] = i+1;
        }
        yield put({
          type: 'save',
          payload: {
            cadreDataList: cadreData.DataRows
          }
        });
      }else{
        message.error('干部信息查询失败！');
      }
    },
    *initPersonQuery({}, {call, put}) {
      let queryParam = {
        arg_ou_id : Cookie.get('OUID'),
      };
      const personData = yield call(appraiseService.personInfoList,queryParam);
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
        message.error('评议人信息查询失败！');
      }
    },
    *deleteCadreInfo({arg_param}, {call, put}) {
      let delparam = {};
      delparam['arg_id'] = arg_param.id;
      delparam['arg_user_id'] = arg_param.user_id;
      const delCadreData = yield call(appraiseService.cadreInfoDel,delparam);
      if(delCadreData.RetCode === '1'){
        message.info("操作成功！");
        yield put({
          type: 'initCadreQuery'
        });
      }else{
        message.info(delCadreData.RetVal);
      }
    },
    *deletePersonInfo({arg_param}, {call, put}) {
      let delparam = {};
      delparam['arg_id'] = arg_param.id;
      delparam['arg_user_id'] = arg_param.user_id;
      const delPersonData = yield call(appraiseService.personInfoDel,delparam);
      if(delPersonData.RetCode === '1'){
        message.info("操作成功！");
        yield put({
          type: 'initPersonQuery'
        });
      }else{
        message.info(delPersonData.RetVal);
      }
    },
    *addCadreInfo({arg_param}, {call, put}) {
      arg_param['arg_ou_id'] = Cookie.get('OUID');
      const addCadreData = yield call(appraiseService.cadreInfoAdd,arg_param);
      if(addCadreData.RetCode === '1'){
        message.info("新增成功！");
        yield put({
          type: 'initCadreQuery'
        });
      }else{
        message.info(addCadreData.RetVal);
      }
    },
    *addPersonInfo({arg_param}, {call, put}) {
      arg_param['arg_ou_id'] = Cookie.get('OUID');
      const addPersonData = yield call(appraiseService.personInfoAdd,arg_param);
      if(addPersonData.RetCode === '1'){
        message.info("新增成功！");
        yield put({
          type: 'initPersonQuery'
        });
      }else{
        message.info(addPersonData.RetVal);
      }
    },
    *updateCadreInfo({arg_param}, {call, put}) {
      const updateCadreData = yield call(appraiseService.cadreInfoUpdate,arg_param);
      if(updateCadreData.RetCode === '1'){
        message.info("修改成功！");
        yield put({
          type: 'initCadreQuery'
        });
      }else{
        message.info(updateCadreData.RetVal);
      }
    },
    *updatePersonInfo({arg_param}, {call, put}) {
      const updatePersonData = yield call(appraiseService.personInfoUpdate,arg_param);
      if(updatePersonData.RetCode === '1'){
        message.info("修改成功！");
        yield put({
          type: 'initPersonQuery'
        });
      }else{
        message.info(updatePersonData.RetVal);
      }
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/appraise/cadreInfo') {
          dispatch({ type: 'initCadreQuery',query });
        }
        if (pathname === '/humanApp/appraise/personInfo') {
          dispatch({ type: 'initPersonQuery',query });
        }
      });
    }
  }
}
