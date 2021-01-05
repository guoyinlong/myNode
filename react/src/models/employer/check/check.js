/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：指标评价页数据
 */
import * as service from '../../../services/employer/check';

import Cookie from 'js-cookie';
import moment from 'moment'
import message from '../../../components/commonApp/message'

//const staff_id=Cookie.get('staff_id')
//const fullName=Cookie.get('username')

export default {
  namespace : 'empCheck',
  state : {
    list: [],
    query: {},
    season:"",
    year:""
  },
  reducers : {
    save(state, {list: DataRows}){

      //debugger
      return {
        ...state,
        list: DataRows
      };
    },

    saveinfo(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

  },

  effects : {

    *backTime({pathname},{call, put}){
      const timeList = yield call(service.seasonTime); // 查询季度时间
      if(timeList.RetCode=="1"){
        yield put({
          type: 'saveinfo',
          payload:{
            season:timeList.DataRows[0].examine_season,
            year:timeList.DataRows[0].examine_year,
          }
        })
        yield put({
          type: 'fetch',
          pathname
        });
      }
     },


    *fetch({pathname}, {call, put,select}) {
      let {season,year}=yield select(state=>state.empCheck)
      yield put({
        type: 'save',
        list: [],
      });
      let code = pathname.indexOf('check')!=-1?'200':'300';
      const res= yield call(service.moduleopenquery,
        {
          arg_code:code,
          arg_time:moment().format('YYYY-MM-DD HH:mm:ss')
        });

      if(res.RetCode==='1'){
        let ser=pathname.indexOf('check')!=-1?service.empkpiuncheckquery:service.empkpiunvaluequery;
        if(pathname.indexOf('check')==-1){
          yield call(service.bpcalculate,{
            arg_dept_name:Cookie.get('deptname'),
            arg_year:year,
            arg_season:season
          })
        }
        const resList=yield call(ser,{
          arg_checker_id:Cookie.get('userid')
        })
        if(resList.DataRows.length){
          resList.DataRows.map((i,index)=>{
            i.key=index;
          })
        }
        yield put({
          type: 'save',
          list: resList.DataRows
        });
      }else if(res.RetCode==='3'){
        message.warning('模块未开放！')
      }

    },



  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname}) => {
        if (pathname === '/humanApp/employer/check'||pathname==='/humanApp/employer/value') {
          dispatch({ type:'backTime',pathname});
          // dispatch({
          //   type:'fetch',
          //  // pageCondition:{arg_page_num:400, arg_start:0},
          //   pathname
          // });
        }
      });

    },
  },
};
