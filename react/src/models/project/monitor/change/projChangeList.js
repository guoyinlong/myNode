/**
 * 作者：邓广晖
 * 创建日期：2017-11-4
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目变更的项目列表数据的model
 */
import * as projServices from '../../../../services/project/projService';
import Cookie from 'js-cookie';

export default {
  namespace:'projChangeList',

  state:{
    projChgList: [],
    changeType: '',
    changeProjId: '',
    typeDisabled: true,
  },
  reducers:{
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
  },
  effects:{

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-8
     * 功能：变更项目列表查询
     */
    *projChgSearch({}, { call, put }) {
      const data = yield call(projServices.queryProjChgList,{arg_userid:Cookie.get('staff_id')})
      // 如果是一个项目，默认选中该项目
      let id = '', type = '', isAbled = false;
      if(data.DataRows){
        const pjList = data.DataRows;
        // 根据变更类型判断默认变更事项
        if(pjList.length == 1) {
          const pjData = pjList[0];
          id = pjData.proj_id;
          if(pjData.change_flag == 2 || pjData.change_flag == 4) {
            type = 1, isAbled = true;
          } else if(pjData.change_flag == 1 || pjData.change_flag == 3 || pjData.change_flag == 5) {
            type = 0, isAbled = true;
          }
        }else {
          pjList.map((item) => {
            if(item.change_flag == 0) {
              isAbled = false
            }
          })
        }
        yield put({
          type: 'save',
          payload:{
            projChgList: pjList,
            changeProjId: id,
            changeType: type,
            typeDisabled: isAbled
          }
        });
      }
    },

    *change({ payload }, { put }) {
      if(payload.changeName == 'changeType') {
        yield put({
          type: 'save',
          payload:{
            changeType: payload.changeValue,
          }
        });
      }
      if(payload.changeName == 'changeProjId') {
        yield put({
          type: 'save',
          payload:{
            changeProjId: payload.changeValue,
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/projMonitor/change') {
          dispatch({type: 'projChgSearch', query});
        }
      });
    },
  }
}
