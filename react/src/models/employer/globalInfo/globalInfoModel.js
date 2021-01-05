/**
 * 作者：罗玉棋
 * 日期：2019-11-18
 * 邮箱：809590923@qq.com
 * 文件说明：查询三度全部人员信息
 */
import * as usersService1 from '../../../services/employer/module.js'
import message from '../../../components/commonApp/message'
let defaultYear=new Date().getFullYear()

export default {
  namespace: 'globalInfo',
  state: {
    data:[],
    deptlist:[],
    RowCount:1,
    searchEnd:false
  },

  reducers: {
 


    save(state, {payload}) {
      return { ...state, 
               ...payload
              };
    },
  },

  effects: { 

    *deptlist({},{call,put}){
      let {RetCode,RetVal,DataRows}=yield call(usersService1.staffDeptList,{
        "arg_tenantid": 10010 
      })
        if(RetCode==="1"){

          yield put({
          type:"save",
          payload:{
            deptlist:[...DataRows],
            searchEnd:false
          }
          })
   
        } else{
          yield put({
            type:"save",
            payload:{
              deptlist:[],
              searchEnd:false
            }
            })
          message.error(RetVal,2," ")
        }
      },

      *staffInfo({tYear,deptname,staff,pageNumber,ordering},{call,put}){
        let postData={}
        if(deptname&&staff){
           postData={
            "arg_year":tYear?tYear:defaultYear,
            "staff":staff,
            "deptname":deptname,
            "arg_page":pageNumber||1,
            "arg_page_size":10,
            "ordering":ordering?ordering:"eval_m desc"
            }
        }
        else if(deptname){
          postData={
            "arg_year":tYear?tYear:defaultYear,
            "deptname":deptname,
            "arg_page":pageNumber||1,
            "arg_page_size":10,
            "ordering":ordering?ordering:"eval_m desc"
          }
          }
          else if(staff){
            postData={
              "arg_year":tYear?tYear:defaultYear,
              "staff":staff,
              "arg_page":pageNumber||1,
              "arg_page_size":10,
              "ordering":ordering?ordering:"eval_m desc"
              }
          }else{
            postData={
              "arg_year":tYear?tYear:defaultYear,
              "arg_page":pageNumber||1,
              "arg_page_size":10,
              "ordering":ordering?ordering:"eval_m desc"
              }
          }
        


        let {RetCode,RetVal,DataRows,RowCount}=yield call(usersService1.staffResult,postData)
          if(RetCode==="1"){
            if(DataRows.length==0){
            message.warning("暂无此信息！",2," ")
            yield put({
              type:"save",
              payload:{
                data:[...DataRows],
                RowCount,
                searchEnd:true
              }
              })
              return
            }

            yield put({
            type:"save",
            payload:{
              data:[...DataRows],
              RowCount,
              searchEnd:true
            }
            })

            //message.success("查询成功",1," ")

          } 
          else{
            yield put({
              type:"save",
              payload:{
                data:[],
                RowCount
              }
              })
           RetCode==="3"? message.warning(RetVal,3," "): message.error(RetVal,3," ")
          }
        },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/employer/globalInfo') {
          // let obj={
          //   key: "globalInfo",
          //   name: "员工互评结果查询",
          //   module_id: "980b3c0508db11e7a825008cfa042281"
          //   }
          //   let list=JSON.parse(window.localStorage.getItem("menu"))
          //   list[3].child[4].child[28]=obj
          //   let str=JSON.stringify(list)
          //   window.localStorage.setItem("menu",str)
          dispatch({type:"staffInfo"}) 
          dispatch({type:"deptlist"}) 
        }
      });
    },
  },
};
