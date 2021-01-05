/**
 *  作者: 仝飞
 *  创建日期: 2017-9-10
 *  邮箱：tongf5@chinaunicom.cn
 *  文件说明：问题跟踪中查询、增加、编辑一条问题的model数据
 */
import * as projServices from '../../../../services/project/projService';
import Cookie from 'js-cookie';
import { message} from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'projIssueTrackList',
  state: {
    issueTrackList: [],
    list: {},
    query: {},
    relatedRiskList:[],
    queryData:{},
    issueState:''
  },

  reducers: {
    projIssueTrackSearch(state, { issueTrackList: DataRows}) {
      return {...state, issueTrackList: DataRows};
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

    issueTrackCheck(state, {list: DataRows,id}){
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
    save(state, action) {
      return {...state,...action.payload};
    }

  },

  effects: {
    //查询一个项目的所有问题时运行的方法
    *projIssueTrackListSearch({query}, { call, put }) {
      const {DataRows} = yield call(projServices.issueTrackQuery, {
          transjsonarray: JSON.stringify({
            "condition": {"proj_id": query.proj_id}
          })
        }
      );
      yield put({
        type: 'projIssueTrackSearch',
        issueTrackList: DataRows,
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

    //查询一个问题的详细信息
    *oneIssueTrackCheck({query}, { call, put }) {
      const {DataRows} = yield call(projServices.issueTrackSearch, {
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
            issueState: DataRows[0].state
        }
      });
    },

      *setSelectValue({obj,key},{put}){
        yield put({
            type: 'save',
            payload: {
                [obj]:key
            }
        });
      },

    //一个问题的编辑
    *editIssueTrack({issueTrackParams}, { call, put,select }) {
      //let proj_id = yield select(state => state.projIssueTrackList.proj_id);
      //const issueTrackEditRes = yield call(projServices.issueTrackUpdate, {transjsonarray: JSON.stringify(issueTrackParams)});
      const issueTrackEditRes = yield call(projServices.issueTrackUpdate, issueTrackParams);


        if (issueTrackEditRes.RetCode === '1') {
        message.success("更新成功!");
          yield put({
              type: 'update',
              list: issueTrackEditRes,
          });
        history.go(-1);
        /*yield put(routerRedux.push({
          pathname: '/projectApp/projMonitor/projIssueTrackList',
          query: {
            proj_id: proj_id
          }
        }));*/
      } else {
        message.error("更新失败！")
      }
    },
   // 添加一个问题
    *addIssueTrack({issueTrackParams}, {call,put,select}){
      let proj_id = yield select(state => state.projIssueTrackList.proj_id);
      const issueTrackAddRes = yield call(projServices.issueTrackAdd, {transjsonarray: JSON.stringify(issueTrackParams)});

      yield put({
        type: 'submit',
        list: issueTrackAddRes,
      });
      if (issueTrackAddRes.RetCode === '1') {
        message.success("提交成功!");
        history.go(-1);
        /*yield put(routerRedux.push({
          pathname: '/projectApp/projMonitor/projIssueTrackList',
          query: {
            proj_id: proj_id
          }
        }));*/
      } else {
        message.error("提交失败！")
      }
    },

    /**
     *Author: 仝飞
     *Date: 2017-11-14 14:00
     *Email: tongf5@chinaunicom.cn
     *功能：项目管理》项目监控》问题跟踪》
     */
      *relatedRiskSearch({query}, { call, put }) {
      //初始查询时，将项目类型列表（W1，R1)返回
      const relatedRiskData = yield call(projServices.riskTransQuery,{
        transjsonarray: JSON.stringify({
          "condition": {"proj_id": query.proj_id, "state": '3'}
        })
      });
      if(relatedRiskData.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{relatedRiskList: relatedRiskData.DataRows}
        });
      }else{
        yield put({
          type: 'save',
          payload:{relatedRiskList: []}
        });
      }
    },

    /**
     *Author: 仝飞
     *Date: 2017-11-28 10:34
     *Email: tongf5@chinaunicom.cn
     *功能：项目管理》项目收尾》历史项目》点击返回时，将传进去的参数返回到原页面
     */
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
        if (pathname === '/projectApp/projMonitor/issueTrack/projIssueTrackList') {
          dispatch({type: 'projInfoSearch', query});
          dispatch({type: 'projIssueTrackListSearch', query});
          dispatch({type: 'relatedRiskSearch', query});
          dispatch({type: "setQueryData",query});
        } else if (pathname === '/projectApp/projMonitor/issueTrack/addIssueTrackDetial') {
          dispatch({type: 'relatedRiskSearch', query});
          dispatch({type: 'projInfoSearch', query});
        } else if (pathname === '/projectApp/projMonitor/issueTrack/editIssueTrackDetial') {
          dispatch({type: 'projInfoSearch', query});
          dispatch({type: 'oneIssueTrackCheck', query});
          dispatch({type: 'relatedRiskSearch', query});
        }
      });
    },
  },
};
