/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：dm搜索数据
 */

import * as service from '../../../services/employer/search';

import Cookie from 'js-cookie';
//const staff_id=Cookie.get('staff_id')
//const fullName=Cookie.get('username')
// const year = new Date().getFullYear().toString();
// const season = Math.floor((new Date().getMonth()+1 + 2) / 3).toString();
let dept= '("' + Cookie.get("deptname") + '")'

export default {
  namespace : 'search',
  state : {
    list: [],
    query: {},
    season:"",
    year:"",
    condition:1,
    dept_name:1,
    staff_id:1,
    staff_name:1,
    proj_name:1,
    proj_name_0:1,
    dept_param:dept,
    focusDept:[]
  },

  reducers : {
    save(state, {list: DataRows}){
      return {
        ...state,
        list: DataRows,

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

    *fetch({}, {call, put,select}) {
      let {year,season}=yield select(state=>state.search)
      const {DataRows} = yield call(service.ouFetch,
        {
          arg_tenantid:Cookie.get('tenantid'),
          arg_user_id:Cookie.get('userid'),
        });
      if(DataRows.length){
        var dept_name = '';
        for(var i = 0;i <　DataRows.length;i++){
          if(i == DataRows.length - 1){
            dept_name = dept_name +'\"'+ DataRows[i].dept_name+'\"';
          }else{
            dept_name = dept_name +'\"'+ DataRows[i].dept_name +'\"' + ',';
          }
        }
        dept_name = '(' + dept_name + ')';

        yield put({
          type: 'saveinfo',
          payload:{
          dept_param:dept_name
          }
        })


        const resList=yield call(service.dmprojsearch,{
          arg_cur_season:season,
          arg_cur_year:year,
          arg_dept_name:dept_name,
          arg_checkid: Cookie.get('userid')
          //arg_dept_name:`("${DataRows[0].dept_name}")`
        })

        if(resList.DataRows.length){
          resList.DataRows.map((i,index)=>{
            i.key=index;
          })
          yield put({
              type: 'save',
              list: resList.DataRows,
            });
        }
      }else{
        dept_name = '("' + Cookie.get("deptname") + '")';
        const resList=yield call(service.dmprojsearch,{
          arg_cur_season:season,
          arg_cur_year:year,
          arg_dept_name:dept_name,
          arg_checkid: Cookie.get('userid')
        })
        if(resList.DataRows.length){
          resList.DataRows.map((i,index)=>{
            i.key=index;
          })
          yield put({
            type: 'save',
            list: resList.DataRows,

          });
        }
      }

    },

    *selectCondition({query}, {put}) { 
      let props_query=query.param||{}
      let props_dep=query.dept_name||{}
      let props_staffid=query.staff_id||{}
      let props_staffname=query.staff_name||{}
      let props_projname=query.proj_name||{}
      let props_proj_name_0=query.proj_name_0||{}
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
      if(props_proj_name_0=="1"||JSON.stringify(props_proj_name_0)=="{}"){
        props_proj_name_0="{}"
      }
      yield put({
        type: 'saveinfo',
        payload:{
          condition:props_query,
          dept_name:props_dep,
          staff_id:props_staffid,
          staff_name:props_staffname,
          proj_name:props_projname,
          proj_name_0:props_proj_name_0
        }
      });
    },

  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        // console.log("model",query)
        if (pathname.includes('/humanApp/employer/dmprojsearch')||pathname.includes('/humanApp/employer/dmsearch')) {
          dispatch({type:'backTime'});
          dispatch({type: 'selectCondition',query});
        }
      });

    },
  },
};
