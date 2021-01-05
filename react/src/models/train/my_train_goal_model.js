/**
 * 作者：郭西杰
 * 创建日期：2020-09-02
 * 邮箱：guoxj116@chinaunicom.cn  
 * 文件说明：培训管理我的小目标
 */
import Cookie from 'js-cookie';
import { message } from "antd";
const auth_tenantid = Cookie.get('tenantid');
import * as trainService from "../../services/train/trainService"

export default {
  namespace: 'myTrainGoalModel',
  state: {
    ProfessionalQueryList:[],
    courseQueryList:[],
    abilityQueryList:[],
    bookQueryList:[],
    targetQueryList:[],
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    *initManageQuery({ query }, { call, put }) {
      yield put({
        type: 'save',
        ProfessionalQueryList:[],
        courseQueryList:[],
        abilityQueryList:[],
        bookQueryList:[],
        targetQueryList:[],
      });

      let date = new Date;
      let currentDate = date.getFullYear();
      let user_id = Cookie.get("staff_id");  
      let queryParams = {
        arg_user_id: user_id,
        arg_target_year: currentDate,
      }
      const goaQueryResult = yield call(trainService.goalListlInfoQuery, queryParams);
      if (goaQueryResult.RetCode !== '1') {
        rollbackFlag = 1;
        j = 1;
        message.error(goaQueryResult.RetVal); 
        resolve("false");
        return;
      }else
      {
        yield put({
          type: 'save',
          payload: {
            ProfessionalQueryList:goaQueryResult.DataRows==undefined?[]:goaQueryResult.DataRows,
            courseQueryList:goaQueryResult.DataRows1==undefined?[]:goaQueryResult.DataRows1,
            abilityQueryList:goaQueryResult.DataRows2==undefined?[]:goaQueryResult.DataRows2,
            bookQueryList:goaQueryResult.DataRows3==undefined?[]:goaQueryResult.DataRows3,
            targetQueryList:goaQueryResult.DataRows4==undefined?[]:goaQueryResult.DataRows4,
          }
        });
      }
    },
    * goalSave({ totalList, resolve }, { call }) {
      let rollbackFlag = 0;

      let j = 0;
      for (let i = 0; i < totalList.length; i++) {
        const goalListResult = yield call(trainService.goalListlInfoSave, totalList[i]);
        if (goalListResult.RetCode !== '1') {
          rollbackFlag = 1;
          j = 1;
          message.error(goalListResult.RetVal);
          resolve("false");
          return;
        }
      }
      if (j === 0) {
        message.success('保存成功');
        resolve("success");
      }
      else {
        message.success('保存失败');
        resolve("false");
      }
      return;
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/myTrainGoal') {
          dispatch({ type: 'initManageQuery', query });
        }
      });
    }
  }
}
