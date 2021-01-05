/**
 * 作者：罗玉棋
 * 日期：2019-09-6
 * 邮箱：809590923@qq.com
 * 文件说明：审核人查待办已办
 * */
import * as service from "../../services/encouragement/services.js";
import { message } from "antd";
import Cookie from 'js-cookie';
import moment from 'moment';
const user_id = Cookie.get('userid');

export default {
  namespace: "auditPage",
  state: {
    dataList: [],
    tbList: [],
    category_name:"",
    toCheckList:[],
    staff_id:"",
    batchid:"",
    loading:false,
    closeKey:"1",
    fieldList:[],
    UidMap:[],
    auditList:[],
    auditedList:[]
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },

  effects: {
   //查询待办和已办
    * pendingOrder({payload},{call ,put,}){

      let {DataRows,RetCode,RetVal}=yield call(service.selectPending,{
          check_userid:user_id,
           flag:(payload==undefined)?"1":(payload.key=="tab1")?"1":"2"
      
      })
  
      if (RetCode == "1") { 
         DataRows=DataRows.map(item=>{
          item.fieldinfo=JSON.parse(item.fieldinfo) 
          return item
        }) 
        
        DataRows.sort((a,b)=>moment(b.create_time)-moment(a.create_time))
        
         let auditList=DataRows.filter((item)=>{
          return  item.fieldinfo.some(el=>el.flag=="1")
        })

        let auditedList=DataRows.filter((item)=>{
          return  item.fieldinfo.some(el=>el.flag=="2")
        })

        yield put({
          type: "save",
          payload: {
            auditList:[],
            auditedList:[],
            toCheckList:[]
          }
        });

        yield put({
          
          type: "save",
          payload: {
            auditList:auditList,
            auditedList:auditedList,
            toCheckList:DataRows
          }
        });
      }else{
        message.error(RetVal,5)
      }

    },

    //全部行数据
    *selectInfo({category_name,staff_id,batchid,category_uid}, { call, put}) {
      let seletList = yield call(service.checkInfo, {
        arg_staffid: staff_id,
        arg_category: category_name,
        arg_categoryid:category_uid
      });

      if (seletList.RetCode == "1") {
        let dataList = seletList.DataRows;
        yield put({
          type: "save",
          payload: {
            category_name:category_name,
            staff_id:staff_id,
            batchid:batchid,
            UidMap:seletList.UidMap
          }
        });
        yield put({ type: "tdInfo",batchid:batchid,dataList:dataList }); //这里传的是信息类的id

      }else{
       
        message.error( seletList.RetVal,5)
      }

     
    },

    //审核单元数据
    *tdInfo({batchid,dataList}, {call, put}) { 
      let tbListTip = yield call(service.tbInfo, {
        arg_check_batch_id:batchid,
        arg_checkuserid:user_id
      });
      let tbList=[];
      if (tbListTip.RetCode == "1" && tbListTip.DataRows && tbListTip.DataRows.length) {
        tbList= tbListTip.DataRows;

        yield put({
          type: "save",
          payload: {
            tbList: [...tbList],
            dataList:[...dataList],
            loading:false
          }
        });
      }else{
        message.error( tbListTip.RetVal,5)
      }
    },
     //提交审核
    *checkInfo({ checkFlage,fieldList }, { call,select,put}) {
      const { batchid,staff_id,auditList }=yield select(state=>state.auditPage)
    
        let result = yield call(service.submitCheck, {
          batchid: batchid,
          staff_id: staff_id,
          check_userid: user_id,
          tag: checkFlage,
          checkresult:fieldList
        });

        if (result.RetCode == "1") {
          message.success("提交成功!", 5);
          yield put({
            type: "save",
            payload: {
              closeKey :""
            }
          });
  
          auditList.forEach((item,index) => {
            if(item.batchid==batchid){
              auditList.splice(index,1)
            }
          });

            yield put({
              type: "save",
              payload: {
                auditList:[],
                auditedList:[]
              }
            });
          yield put({type: "pendingOrder"}); 
        }else{
          message.error( result.RetVal,5)
        }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === "/humanApp/encouragement/auditPage") {
          dispatch({ type: "pendingOrder", query });
        }
      });
    }
  }
};
