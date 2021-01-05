/**
 * 作者：罗玉棋
 * 日期：2019-11-04
 * 邮箱：809590923@qq.com
 * 文件说明：员工互评管理
 */
import * as Service from '../../../services/employer/search.js'
import message from '../../../components/commonApp/message'
let defaultYear=new Date().getFullYear()
export default {
  namespace: 'staffManage',
  state: {
  dataList:[],
  tableInfo:[],
  dataInfo:{},
  state:0
  },

  reducers: {
 
    save(state, {payload}) {
      return { 
        ...state, 
       ...payload
              };
    },
  },

  effects: { 

    *sumbmitData({tYear,items,callback},{call,put}){
   let {RetCode,RetVal}=yield call(Service.submitData,{
    "e_year":tYear,
    "items":JSON.stringify(items)
    })
    if(RetCode=="1"){
     message.success("提交成功！",2," ")
     callback(true)
     yield put({type:"search",value:tYear})
    }else{
      message.error(RetVal,2," ")
    }
    },


    *search({value},{call,put}){
    let dataInfo=yield call(Service.searchInfo,{
        e_year:value?value:defaultYear,
        })
     
      if(dataInfo.RetCode=="1"){
   
        yield put({
          type:"save",
          payload:{
          dataList:[...dataInfo.DataRows],
          state:dataInfo.state,
          dataInfo
          }
        })
      }
      if(dataInfo.RetCode=="2"){
        message.error(dataInfo.RetVal,2," ")
        let payload={
          dataList:[],
          state:dataInfo.state,
          dataInfo
        }
     
        yield put({
          type:"save",
          payload
        })
      }
    },

    *staffBegin({tYear,resolve},{call,put}){
      let {RetCode,DataRows,RetVal}=yield call(Service.staffBegin,{
        "e_year":tYear?tYear:defaultYear,
        })
        if(RetCode=="1"){
          message.success("互评开始",2," ")
          !!resolve&resolve(true)
          yield put({
            type:"search",
            tYear
          })
        }
        
        if(RetCode=="3"){
          yield put({
            type:"save",
            payload:{
            tableInfo:[...DataRows]
            }
          })
          message.error(RetVal,5," ")
        }
        if(RetCode=="2")
        {
          message.warning(RetVal,5," ")
        }
      },

      *staffEnd({tYear,resolve},{call}){
        let {RetCode,RetVal}=yield call(Service.staffEnd,{
          "e_year":tYear?tYear:defaultYear,
          })
          if(RetCode=="1"){
            message.success("互评已结束",2," ")
            resolve&&!!resolve(true)
          } else{
            message.error(RetVal,2," ")
          }
          
        },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
         if (pathname === '/humanApp/employer/staffManage') {//开发时候先这样写，提交时候这段代码不用
          // let obj={
          //   key: "staffManage",
          //   name: "员工互评管理",
          //   module_id: "980b3c0808db11e9a825008cfa042281"
          //   }
          //   let list=JSON.parse(window.localStorage.getItem("menu"))
          //   list[3].child[4].child[27]=obj
          //   let str=JSON.stringify(list)
          //   window.localStorage.setItem("menu",str)
            
            dispatch({
              type:"save",
              payload:{
                dataList:[],
                tableInfo:[],
                dataInfo:{},
                state:0
              }
            })
            dispatch({ type:"search"})
        }
        
      });
    },
  },
};

