/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：pm指标查询页面数据
 */

import Reducers from './search'
import Cookie from 'js-cookie';
import * as service from '../../../services/employer/search';
// const year = new Date().getFullYear().toString();
// const season = Math.floor((new Date().getMonth()+1 + 2) / 3).toString();

export default {
  ...Reducers,
  namespace:'pmsearch',
  effects:{

    *backTime({},{call, put}){
      const timeList = yield call(service.seasonTime); // 查询季度时间
      if(timeList.RetCode=="1"){
        yield put({
          type: 'saveinfo',
          payload:{
            season:timeList.DataRows[0].examine_season,
            year:timeList.DataRows[0].examine_year,
          }
        })

        yield put({type:"fetch"})
      }
     },

    *fetch({pageCondition}, {call, put,select}) {
      let {year,season}=yield select(state=>state.pmsearch)
      const {DataRows} = yield call(service.pmsearch,
        {
          //arg_cur_season:season,
          arg_cur_season:season,
          arg_cur_year:year,
          arg_mgr_id:Cookie.get('userid'),
          //...pageCondition
        });

      if(DataRows.length){
        yield put({
          type: 'save',
          list: DataRows,
          pageCondition
        });
      }
    },

    *selectCondition({query}, {put}) { 
      let props_query=query.param||{}
      let props_dep=query.dept_name||{}
      let props_staffid=query.staff_id||{}
      let props_staffname=query.staff_name||{}
      let props_projname=query.proj_name||{}
      if(props_query=="1"||JSON.stringify(props_query)=="{}"){
        props_query="{}"
      }
      if(props_dep=="1"||JSON.stringify(props_dep)=="{}"){
        props_dep="{}"
      }
      if(props_staffid=="1"||JSON.stringify(props_staffid)=="{}"){
        props_staffid="{}"
      }
      if(props_staffname=="1"||JSON.stringify(props_staffname)=="{}"){
        props_staffname="{}"
      }
      if(props_projname=="1"||JSON.stringify(props_projname)=="{}"){
        props_projname="{}"
      }
      yield put({
        type: 'saveinfo',
        payload:{
          condition:props_query,
          dept_name:props_dep,
          staff_id:props_staffid,
          staff_name:props_staffname,
          proj_name:props_projname,
        }
      });
    },
   
  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname,query}) => {
       // console.log("model",query)
        if (pathname.includes('/humanApp/employer/pmsearch')) {
          dispatch({type:'backTime' });
          dispatch({type: 'selectCondition',query});
        }
      });

    },
  },
}
