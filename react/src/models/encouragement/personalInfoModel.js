/**
 * 作者：罗玉棋
 * 日期：2019-09-12
 * 邮箱：809590923@qq.com
 * 文件说明：个人信息修改
 * */

import * as service from '../../services/encouragement/personalServices';
import {message} from "antd";
import Cookie from 'js-cookie';
import moment from 'moment';


export default {
  namespace : 'personalInfo',
  state : {
    categoryList:[],
    tableList:[],
    copyList:[],
    originalList:[],
    lockList:[],
    historyList:[],
    update_loading:false,
    tbList:[],
    dataList:[],
    UidMap:[],
    historyMap:[],
    insert_historyMap:[],
    editCount:0,
    uneditCount:0,
    welfareList:
    ["防暑降温费"
    ,"过节费"
    ,"取暖费"
    ,"通信补贴"
    ,"交通补贴"
    ,"就餐补贴"
    ,"绿色出行补贴"
    ,"劳保费"
    ,"独生子女费"
    ,"体检费"
    ,"年节福利费"
    ,"探亲费"
    ,"其他"],
    insert_tbList:[],
    insert_dataList:[],
    insert_loading:false,
    //loading:false
  },

  reducers : {
    save(state,{payload}) {
      return { ...state, ...payload};
    },
  },

  effects : {
      *fetch({}, {put}) {
      yield put({type: 'getcategory'});
    },

      *init({}, {put}){
      yield put({
        type: 'save',
        payload:{
          tableList:[],
          categoryList:[],
        }
      });
    },
    //初始化信息类别
    *getcategory({},{call,put}){
      let transjsonarray={
        "property":{
          "uid":"uid",
          "category_name":"category_name"
        },
        "condition": {
          "state":"0"
        },
        "sequence":[
         {"sort_num":"0"}
      ]
      }
      const {DataRows,RetCode,RetVal} = yield call(service.indexInfo, {transjsonarray:JSON.stringify(transjsonarray)});
      if(RetCode=='1'){
        yield put({
          type: 'save',
          payload:{
            categoryList: DataRows,
            editCount:0,
            uneditCount:0,
          }
        });
      }else{
        message.error(RetVal,5)
      }
    
    },
    //获取字段信息
    *fieldInfo({category_id,resolve},{call,put}){
      let transjsonarray={
        condition: {
          state:"0",
          category_id:category_id
        },
        sequence:[
          {"sort_num":"1"}
        ]
      }
      let {RetCode,DataRows,RetVal} = yield call(service.fieldInfo,{transjsonarray:JSON.stringify(transjsonarray)});
      if(RetCode=='1'){
        if(DataRows && DataRows.length){
          yield put({
            type: 'save',
            payload:{
              fieldList: DataRows
            }
          });
        }else {
          yield put({
            type: 'save',
            payload:{
              fieldList: []
            }
          });
         // message.warning('未查询到相关信息！')
        }
        resolve==undefined?"":!!resolve&resolve(true)
      }else {
        message.error(RetVal,5)
      }
    
    },
    //表格数据
    *tableInfo({arg_category,arg_categoryid},{call,put,select}){
      let { fieldList, lockList,welfareList}= yield select(state=>state.personalInfo);
      let postData={
        arg_staffid:Cookie.get('staff_id'),
        arg_category,
        arg_categoryid
      }
      const {DataRows,RetCode,RetVal,UidMap} = yield call(service.tableInfo, postData);
      if(RetCode=='1'){
        if(DataRows && DataRows.length){ 
          let obj={};
          fieldList.forEach(item=>{
            if(item.column_name=="welfare_amount"){
              obj[''+item.column_comment]=parseInt(item.revisability)==1?true:false
            }else{
              obj[''+item.column_name]=parseInt(item.revisability)==1?true:false
            }
           
          })
          //~符号前面要加个空字符串避免父数据有为空的情况
          DataRows.forEach((row)=>{
          for( var index in obj){
            if( row[index]){
              row[index]==""?
              row[index]=row[index]+" ~"+obj[index]
              :
              row[index]=row[index]+"~"+obj[index]
            }else if(index=='welfare_amount'){

               welfareList.forEach(name=>{
                row[name]==undefined?
                row[name]=" ~"+obj[index]
                :
                row[name]=row[name]+"~"+obj[index]
               })
            }
             else{
              row[index]=" ~"+obj[index]
            }           
          }
          })
          if(lockList.length>0){
          DataRows.forEach((el)=>{
          let uidkey=Object.keys(el).filter((td)=>td.indexOf("uid")>=0)
          if(uidkey.length==1){
            if(lockList.some(lock=>(el[uidkey]==lock.data_uid))){ 
              el["lock"]=true      
          }
        }
          else{
            uidkey.forEach(other=>{
              if(lockList.some(lock=>(el[other]==lock.data_uid))){
              el["lock"]=true 
              }
            })
          } 
        })
           }
            let copyList=JSON.stringify(DataRows)
            let originalList=JSON.stringify(DataRows)
          yield put({
            type: 'save',
            payload:{
              tableList: [...DataRows],
              copyList:JSON.parse(copyList),
              originalList:JSON.parse(originalList),
              UidMap:UidMap
            }
          });

        }else {
          yield put({
            type: 'save',
            payload:{
              tableList: [],
              copyList:[]
            }
          });
        }
      }else {
        message.error(RetVal,5)
      }
    },
    //提交数据
    *submit({formatList,resolve},{call}){
       let submitTip=yield call(service.upDateInfo,{
        data:formatList,
        flag:1
       })
      if(submitTip.RetCode=="1"){
      message.success("提交成功",5)
      !!resolve && resolve(true);
      }else{
        message.error(submitTip.RetVal,5)
      }

    },
    //新增数据
    *addInfo({values,resolve},{call}){
      const {RetVal,RetCode}=yield call(service.upDateInfo,{
        data:values,
         flag:"1"
       }) 
      if(RetCode=="1"){
        message.success("提交成功",5)
        !!resolve && resolve(true);
      }else{
        message.error(RetVal,5)
      }

    },
    //锁住的行
    *lockRow({category_id,category_name},{call,put}){
     const lockTip=yield call(service.lockService,{
      arg_staff_id:Cookie.get('staff_id')
     })
     
     if(lockTip.RetCode=="1"){
      const lockList=lockTip.DataRows.filter(item=>(category_id==item.category_uid))
      yield put({
        type:"save",
        payload:{
        lockList:[...lockList]
        }      
      })
      yield put({
      type:"tableInfo",
      arg_category:category_name,
      arg_categoryid:category_id
    })
     }else{
       message.error(lockTip.RetVal,5)
     }
    },
    //个人提交历史条数
    *historyInfo({},{call,put}){
      let {RetCode,RetVal,DataRows}=yield call(service.personHistory,{
      arg_staffid:Cookie.get('staff_id')
       })
       
       if(RetCode=="1"){
        DataRows=JSON.parse(DataRows)
        DataRows.forEach((item,index)=>{
        item.key=index
        })
        DataRows.sort((a,b)=>moment(b.create_time)-moment(a.create_time))

        yield put({
          type:"save",
          payload:{
          historyList:[...DataRows]
          }
          
        })
       }else{
         message.error(RetVal,5)
       }
    },
    //个人提交类别信息
    *dataInfo({category_name,batchid,arg_categoryid,opt},{call,put}){
      const {RetCode,RetVal,DataRows,UidMap}=yield call(service.tableInfo,{
        arg_staffid:Cookie.get('staff_id'),
        arg_category:category_name,
        arg_categoryid
       })
       if(RetCode=="1"){
        let dataList=DataRows 
        if(opt=="update"){
          yield put({
            type:"save",
            payload:{
             historyMap:UidMap
            }
          })
        }
        if(opt=="insert"){
          yield put({
            type:"save",
            payload:{
             insert_historyMap:UidMap
            }
          })
        }

       
        yield put({ type: "editInfo",batchid,dataList,opt});//对替换时候不突兀的处理
       }else{
         message.error(RetVal,5)
       }

      
    },
    //个人修改数据
    *editInfo({batchid,dataList,opt},{call,put}){
    const {RetCode,RetVal,DataRows}=yield call(service.editInfo,{
      arg_check_batch_id:batchid
    })
    if(RetCode=="1"&&opt=="update"){

    yield put({
      type:"save",
      payload:{
      tbList:[...DataRows],
      dataList:[...dataList],
      update_loading:false
      }
      
    })
    }else if(RetCode=="1"&&opt=="insert"){
      yield put({
        type:"save",
        payload:{
        insert_tbList:[...DataRows],
        insert_dataList:[...dataList],
        insert_loading:false
        }

    })
  }
    else{
      message.error(RetVal,5)
    }
    }

    },

  subscriptions: {                      
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/humanApp/encouragement/personalInfo') {
          dispatch({type:"init"});
          dispatch({type: 'fetch'});
        }
      });
    },
  }
};

