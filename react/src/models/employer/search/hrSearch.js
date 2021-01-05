/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：hr搜索数据
 */
import Reducers from './search'
import Cookie from 'js-cookie';
import * as service from '../../../services/employer/search';
import {message} from 'antd';
// const year = new Date().getFullYear().toString();
// const season = Math.floor((new Date().getMonth()+1 + 2) / 3).toString();
// let length=window.location.hash.split('/').length;
// let path=window.location.hash.split('/')[length-1]
function arrtoString(arr){
let str="";
arr.forEach(item=>{str+=item+","})
 str=str.slice(0,-1)
 return  str="("+str+")"
}

export default {
  ...Reducers,
  namespace:'hrSearch',

  state:{
    objData:{},
    backPage:0,//返回按钮
    focusDept:[],
    list:[]
  },


  effects:{

    *clearList({},{put}){
      yield put({
      type:"saveinfo",
      payload:{
      list:[],
      backPage:0,
      objData:{}
      }
      })


    },

    *backTime({bp_backPage},{call, put,select}){
      let {backPage}=yield select(state=>state.hrSearch)
      const timeList = yield call(service.seasonTime); // 查询季度时间
      if(timeList.RetCode=="1"){
        yield put({
          type: 'saveinfo',
          payload:{
            season:timeList.DataRows[0].examine_season,
            year:timeList.DataRows[0].examine_year,
            loading:true
          }
        })
        if(bp_backPage){
          return
        }
        if(!backPage){
           yield put({type:"initData"})
        }
      }
     },

    *fetch({pageCondition,objData}, {call, put,select}) {
      let {year,season}=yield select(state=>state.hrSearch)
      let  DataRows=[],focusDept=[];
         let result= yield call(service.BPinfo, {
          state:3,
          flag:0,
          upt:Cookie.get('userid'),
          staff_id:Cookie.get('userid')
         });
          if(result.RetCode=='1'&&result.DataRows&&result.DataRows.length!=0){
           let deptarry=result.DataRows.map(item=>{
              let obj={"principal_deptid":item.principal_deptid,"principal_deptname":item.principal_deptname}
               return obj
            })

            let obj = {}
            let newArr = []
            newArr = deptarry.reduce((item, next) => {
              obj[next.principal_deptname] ? ' ' : obj[next.principal_deptname] = true && item.push(next)
              return item 
            }, [])
            focusDept=newArr

           let bpdata= yield call(service.bpempkpiquery, {
            arg_year:"("+(objData?objData.year||year:year)+")",
            arg_season:"("+(objData?objData.season||season:season)+")",
            arg_cur_year:year,
            arg_cur_season:season,
            arg_pu_dept_name:objData?objData.focusName||result.DataRows[0].principal_deptname:result.DataRows[0].principal_deptname,
            arg_flag:objData?objData.role||2:2
           });

           if(bpdata.RetCode=='1'&&bpdata.DataRows.length!=0){
            DataRows=bpdata.DataRows
           }else{
            message.warning("暂无数据") 
            yield put({
              type: 'saveinfo',
              payload:{
               list: [],
               loading:false
              }
            });
           }

          }else{
            message.warning("未配置归口部门")
            yield put({
              type: 'saveinfo',
              payload:{loading:false}
            });
          }
      if(DataRows.length){
        yield put({
          type: 'saveinfo',
          payload:{
           list: [...DataRows],
            pageCondition,
            focusDept,
            loading:false
          }
        });
      }

    },

    //hr指标查询或者没跳转详情页面时候都走这个服务
    *initData({selectOuid,role},{call,put,select}){
      let {year,season}=yield select(state=>state.hrSearch)
      let  DataRows=[],focusDept=[];
      let length=window.location.hash.split('/').length;
      let path=window.location.hash.split('/')[length-1]

      if(path=="bpsearch"){
      let result= yield call(service.BPinfo, {
         state:3,
         flag:0,
         upt:Cookie.get('userid'),
         staff_id:Cookie.get('userid')
        });
         if(result.RetCode=='1'&&result.DataRows&&result.DataRows.length!=0){
          let deptarry=result.DataRows.map(item=>{
             let obj={"principal_deptid":item.principal_deptid,"principal_deptname":item.principal_deptname}
              return obj
           })

           let obj = {}
           let newArr = []
           newArr = deptarry.reduce((item, next) => {
             obj[next.principal_deptname] ? ' ' : obj[next.principal_deptname] = true && item.push(next)
             return item 
           }, [])
           focusDept=newArr

          let bpdata= yield call(service.bpempkpiquery, {
           arg_cur_year:year,
           arg_cur_season:season,
           arg_year:"("+year+")",
           arg_season:"("+season+")",
           arg_pu_dept_name:result.DataRows[0].principal_deptname,
           arg_flag:2
          });

          if(bpdata.RetCode=='1'&&bpdata.DataRows.length!=0){
           DataRows=bpdata.DataRows
           yield put({
            type: 'saveinfo',
            payload:{
             list: [...DataRows],
              focusDept,
              loading:false
            }
          });

          }else{
            message.warning("暂无数据") 
            yield put({
              type: 'saveinfo',
              payload:{
               list: [],
               focusDept,
               loading:false
              }
            });
          }

         }else{
           message.warning("未配置归口部门")
           yield put({
            type: 'saveinfo',
            payload:{
              loading:false,
              list:[],
              focusDept
            }
          });
         }
        }else{
          let exist_year=JSON.parse(sessionStorage.getItem("search_year"))
          let exist_season=JSON.parse(sessionStorage.getItem("search_season"))
          let postData = {
            arg_cur_season:season,
            arg_cur_year:year,
            arg_year:exist_year==null?"("+year+")":exist_year.length==0?"("+year+")":arrtoString(exist_year),
            arg_season:exist_season==null?"("+season+")":exist_season.length==0?"("+season+")":arrtoString(exist_season),
            arg_flag:role||Cookie.get("role")||2
          }
    
          if(selectOuid !== 'all'){
            postData.arg_ou =selectOuid||sessionStorage.getItem("selectOuid")||Cookie.get('deptname_p').split('-')[1]
          }
          let hrdata = yield call(service.hrempkpiquery, postData);
          if(hrdata.RetCode=='1'&&hrdata.RowCount!='0'&&hrdata.DataRows.length!=0){
            DataRows=hrdata.DataRows
            yield put({
              type: 'saveinfo',
              payload:{
               list: [...DataRows],
                loading:false
              }
            });
           }else{
             message.warning("暂无数据") 
             yield put({
               type: 'saveinfo',
               payload:{
                list: [],
                loading:false
               }
             });
           }
        }

    },


    *deleteKpi({record},{call,put}){
      const {year:arg_year,season:arg_season,staff_id:arg_staff_id}=record
      const {RetCode}=yield call(service.deleteKpi,{
        arg_year,arg_season,arg_staff_id
      })
      if(RetCode==='1'){
        message.success('删除成功')
        yield put({
          type:'initData'
        })
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

      if(query.bp_backPage=="1"){ //标志着是bp 并且有返回
       // debugger
        let objData={
          year:query.search_year=="1"?"":query.search_year,
          season:query.search_season=="string"?"":query.search_season,
          focusName:query.focusName=="1"?"":query.focusName,
          role:query.role=="string"?"":query.role,
          selectOuid:query.selectOuid=="1"?"":query.selectOuid
        }

        yield put({type:"backTime",bp_backPage:1})//参数顺序
        yield put({
          type:'fetch',
          //selectOuid:query.selectOuid||Cookie.get('deptname_p').split('-')[1],
          objData:objData
        })

        yield put({
          type: 'saveinfo',
          payload:{
            condition:props_query,
            dept_name:props_dep,
            staff_id:props_staffid,
            staff_name:props_staffname,
            proj_name:props_projname,
            objData:objData,
            backPage:1
          }
        });

      

      }else{
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
        yield put({type:"backTime"})
        //yield put({type:"clearList"})//初始化数据
      }
      
    },

      //清除信息，现在暂时不用了
      *clearInfo({},{put}){
       yield put({
        type: 'saveinfo',
        payload:{
          condition:"{}",
          dept_name:"{}",
          staff_id:"{}",
          staff_name:"{}",
          proj_name:"{}",
        }
      });
    }

  },

  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname,query}) => {
           //console.log("model",query)
          // console.log("pathname",pathname) 
        if (pathname.includes('/humanApp/employer/hrsearch')||pathname.includes('/humanApp/employer/bpsearch')) {
          dispatch({type: 'selectCondition',query});
         // dispatch({type:'backTime',query});
        }
        // if (pathname ==='/humanApp/employer/hrsearch'&&JSON.stringify(query)=="{}") {
        //   debugger
        //   window.localStorage.getItem("dept_name")?window.localStorage.removeItem("dept_name"):""
        // }
      });

    },
  },
}
