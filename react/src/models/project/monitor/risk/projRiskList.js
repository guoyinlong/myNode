/**
 *  作者: 胡月
 *  创建日期: 2017-9-10
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：风险跟踪中查询、增加、编辑一条风险的model数据
 */
import * as projServices from '../../../../services/project/projService';
import Cookie from 'js-cookie';
import { message} from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'projRiskList',
  state: {
    riskList: [],
    list: {},
    query: {},
    queryData:{},
    addRiskSpin:false,                   //添加风险时的旋转框
    editRiskSpin:false,                  //编辑风险时的旋转框
    riskState:''
  },

  reducers: {
    projRiskSearch(state, { riskList: DataRows}) {
      return {...state, riskList: DataRows};
    },

    projCodeSearch(state, {proj_name,mgr_name,dept_name,mgr_id,proj_id}) {
      return {
        ...state,
        proj_name,
        mgr_name,
        dept_name,
        mgr_id,
        proj_id
      };
    },

    riskCheck(state, {list: DataRows,id}){
      return {
        ...state,
        list: DataRows,
        id
      };
    },
    update(state, {record,proj_id,proj_name,mgr_name,dept_name}) {
      return {
        ...state,
        record,
        proj_id,
        proj_name,
        mgr_name,
        dept_name,

      };
    },
    submit(state, { list: DataRows}) {
      return {...state, list: DataRows};
    },
    save(state,action){
      return { ...state, ...action.payload};
    }

  },

  effects: {
    //查询一个项目的所有风险时运行的方法
    *projRiskListSearch({query}, { call, put }) {
      const {DataRows} = yield call(projServices.riskTransQuery, {
          transjsonarray: JSON.stringify({
            "condition": {"proj_id": query.proj_id}
          })
        }
      );
      yield put({
        type: 'projRiskSearch',
        riskList: DataRows,
      });
    },
    //通过项目id号，查询一个项目的信息
    *projInfoSearch({query}, { call, put }) {
      const {DataRows} = yield call(projServices.projCodeQuery, {
          transjsonarray: JSON.stringify({
            "condition": {"proj_id": query.proj_id}
          })
        }
      );
      yield put({
        type: 'projCodeSearch',
        proj_id: DataRows[0].proj_id,
        proj_name: DataRows[0].proj_name,
        mgr_name: DataRows[0].mgr_name,
        dept_name: DataRows[0].dept_name,
        mgr_id: DataRows[0].mgr_id

      });
    },

    //查询一个风险的详细信息
    *oneRiskCheck({query}, { call, put }) {
      const {DataRows} = yield call(projServices.riskTrackSearch, {
          transjsonarray: JSON.stringify({
            "condition": {"id": query.id}
          })
        }
      );
      yield put({
        type: 'save',
        payload: {
            list: DataRows.length ? DataRows[0] : {},
            id: DataRows[0].id,
            riskState: DataRows[0].state
        }

      });
    },

    //一个风险的编辑
    *editRisk({riskParams}, { call, put,select }) {
      yield put({
        type:'save',
        payload:{
          editRiskSpin:true
        }
      });
      //const riskEditRes = yield call(projServices.riskUpdate, {transjsonarray: JSON.stringify(riskParams)});
      const riskEditRes = yield call(projServices.riskUpdate, riskParams);

        /*yield put({
          type: 'update',
          list: riskEditRes,
        });*/
      yield put({
        type:'save',
        payload:{
          editRiskSpin:false
        }
      });
      if (riskEditRes.RetCode === '1') {
        message.success("更新成功!");
        history.go(-1);
       /* yield put(routerRedux.push({
          pathname: '/projectApp/projMonitor/projRiskList',
          query: {
            proj_id: proj_id
          }
        }));*/
      } else {
        message.error("更新失败！")
      }
    },

      *setSelectValue({obj,key},{put}){
          yield put({
              type: 'save',
              payload: {
                  [obj]:key
              }
          });
      },
   // 添加一个风险
    *addRisk({riskParams}, {call,put,select}){
      yield put({
        type:'save',
        payload:{
          addRiskSpin:true
        }
      });
      const riskAddRes = yield call(projServices.riskAdd, {transjsonarray: JSON.stringify(riskParams)});
      yield put({
        type:'save',
        payload:{
          addRiskSpin:false
        }
      });
      /*yield put({
        type: 'submit',
        list: riskAddRes,
      });*/
      if (riskAddRes.RetCode === '1') {
        message.success("提交成功!");
        history.go(-1);
        /*yield put(routerRedux.push({
          pathname: '/projectApp/projMonitor/projRiskList',
          query: {
            proj_id: proj_id
          }
        }));*/
      } else {
        message.error("提交失败！")
      }
    },
   //点击返回时，将传进去的参数返回到原页面
    *setQueryData({query},{put}){
      yield put({
        type: 'save',
        payload:{queryData:query}
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/projMonitor/risk/projRiskList') {
          dispatch({type: 'projInfoSearch', query});
          dispatch({type: 'projRiskListSearch', query});
          dispatch({type: "setQueryData",query});
        } else if (pathname === '/projectApp/projMonitor/risk/addRiskDetial') {
          dispatch({type: 'projInfoSearch', query})
        } else if (pathname === '/projectApp/projMonitor/risk/editRiskDetial') {
          dispatch({type: 'projInfoSearch', query});
          dispatch({type: 'oneRiskCheck', query});
        }
      });
    },
  },
};
