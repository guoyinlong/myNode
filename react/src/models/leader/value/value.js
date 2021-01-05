/**
 * 文件说明：中层考核-指标评价数据处理层
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 */
import * as service from '../../../services/leader/leaderservices';
import { routerRedux } from 'dva/router';
import Cookies from 'js-cookie'
let year;
const season = new Date().getMonth();
if(season < 3){
  year = (new Date().getFullYear() - 1).toString();
}else{
  year = new Date().getFullYear().toString();
}

import Cookie from 'js-cookie';

export default {
  namespace : 'leaderValue',
  state : {
    list: [],
    query: {},

  },
  reducers : {
    save(state, {list: DataRows}){
      return {
        ...state,
        list: DataRows,
      };
    },
    saveStage(state, {stage}){
      return {
        ...state,
        stage
      };
    },
  },

  effects : {
    /**
     * 功能：待评价中层领导
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-10-25
     * @param pathname 访问路径
     */
    *toValueLeaderSearch({query}, {call, put}) {
      yield put({
        type: 'save',
        list: [],
      });
      yield put({type: 'valueStageSearch'});

      let ser=service.leaderToValueSearch;
      const resList=yield call(ser,{
        arg_checker_id:Cookie.get('userid'),
        arg_year:year
      })

      if(resList.DataRows.length){
        if(query && query.flag == '0'){
          //一级待评价
          yield put({
            type: 'save',
            list: resList.DataRows.filter((i)=>i.level == '1' && i.state != '7')
          });
        }else if(query && query.flag == '1'){
          //二级待审核
          yield put({
            type: 'save',
            list: resList.DataRows.filter((i)=> i.level == '2' && i.state != '7')
          });
        }else if(query && query.flag == '2'){
          //一级评价完成
          yield put({
            type: 'save',
            list: resList.DataRows.filter((i)=>i.level == '1' && i.state == '7')
          });
        }else if(query && query.flag == '3'){
          //二级审核完成
          yield put({
            type: 'save',
            list: resList.DataRows.filter((i)=> i.level == '2' && i.state == '7')
          });
        }else{
          yield put({
            type: 'save',
            list: resList.DataRows
          });
        }
      }

    },
    /**
     * 功能：评价状态查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-10-25
     * @param pathname 访问路径
     */
      *valueStageSearch({pathname}, {call, put}) {
      let ser=service.leaderKpiStageSearch;
      const resList=yield call(ser,{
        arg_checker_id:Cookie.get('userid'),
        arg_year:year
      })
      if(resList.DataRows.length){

        let stage;
        if(resList.DataRows.length == 1){
          let item = resList.DataRows[0];
          stage = {"count":item.count,"tocheck":item.tocheck,"tovalue1":item.tovalue,'hasSecond':false}
        }else{
          let item0 = resList.DataRows[0];
          let item1 = resList.DataRows[1];
          stage = {"count":parseInt(item0.count)  + parseInt(item1.count),"count1":item0.count,"count2":item1.count,"tocheck":parseInt(item0.tocheck) + parseInt(item1.tocheck),
            "tovalue1":item0.tovalue,"tovalue2":item1.tovalue,'hasSecond':true}
        }
        yield put({
          type: 'saveStage',
          stage: stage
        });
      }

    },
    /**
     * 功能：待评价中层领导
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-10-25
     * @param pathname 访问路径
     */
    *toValueLeaderAutoSearch({query}, {call, put}) {
      let ser=service.leaderToValueSearch;
      const resList=yield call(ser,{
        arg_checker_id:Cookie.get('userid'),
        arg_year:year
      })
      let list;
      if(query && query.flag == '0'){
        list = resList.DataRows.filter((i)=>i.level == '1' && i.state == '3');
      }else if(query && query.flag == '1'){
        list = resList.DataRows.filter((i)=> i.level == '2' && i.state == '5');
      }
      if(list && list.length){
        const{staff_id,year,level,state}=list[0];

        yield put(routerRedux.push({
          pathname: '/humanApp/leader/value/valueDetail',
          query:{
            staff_id,
            year,
            checker_id:Cookies.get('userid'),
            level,
            state
          }
        }));
      }
    },
  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/leader/value') {
          dispatch({
            type:'toValueLeaderSearch',
            query
          });
        }
      });

    },
  },
};
