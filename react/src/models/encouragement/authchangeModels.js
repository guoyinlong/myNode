/**
 * 作者：罗玉棋
 * 邮箱：luoyq@itnova.com.cn
 * 创建日期：2019-08-23
 * 文件说明：全面激励-权限配置
 */
import * as service from "../../services/encouragement/services";
import { message } from "antd";

function mergeDeep(originalValue, targetValue) {
  if (isArray(originalValue)) {
    return targetValue;
  }

  if (!isObject(originalValue)) {
    return targetValue;
  }

  if (typeof originalValue !== typeof targetValue) {
    return targetValue;
  }

  if (originalValue === null || targetValue === null) {
    return targetValue;
  }

  if ((originalValue.constructor && originalValue.constructor.name) === 'Moment') {
    return targetValue;
  }

  const originalValueCopy = { ...originalValue };

  for (const name in originalValueCopy) {
    if (name in targetValue) {
      originalValueCopy[name] = mergeDeep(originalValueCopy[name], targetValue[name]);
    }
  }

  for (const name in targetValue) {
    if (!(name in originalValueCopy)) {
      originalValueCopy[name] = targetValue[name];
    }
  }

  return originalValueCopy;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function isArray(item) {
  return item && typeof item === 'object' && Array.isArray(item);
}


export default {
  namespace: "authchange",
  state: {
    formVisble: false,
    copyrecord: { checkers:[],checkerIds:[] },
    typeInfoList: {
      DataRows: [{}]
    },
    metadataList: [],
    formList: [],
    fieldList:[],
    //变更权限（增加）
    addAction:false,
    keeprecord:{},
  },

  reducers: {

    updateState(state, { payload }) {//深合并
      return mergeDeep(state, payload);
    },

    updateShallowState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    saveinfo(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

  },

  effects: {
    *typeinfo({ select1, selectName }, { call, put }) {
      let typeInfo = yield call(service.typeInfoShow, {
        transjsonarray: JSON.stringify({
          condition: {
            state: "0"
          },
          sequence: [{ sort_num: "0" }]
        })
      });
      
      if (typeInfo.RetCode == "1") {
        yield put({
          type: "saveinfo",
          payload: {
            typeInfoList: { ...typeInfo }
          }
        });
        yield put({ type: "formData", payload: { selectName } }); //这里传的是类名字
        yield put({ type: "secondOpt", payload: { select1 } }); //这里传的是信息类的id
      }else{
        message.error( typeInfo.RetVal,5)
      }
    
     
    },
    //筛选列表
    *secondOpt({ payload }, { call, put, select }) {
      let { typeInfoList } = yield select(state => state.authchange);

      let classId = payload.select1 || typeInfoList.DataRows[0].uid; //默认查询

      let metadata = yield call(service.metedataShow, {
        transjsonarray: JSON.stringify({
          condition: {
            state: "0",
            category_id: classId
          },
          sequence: [{ sort_num: "0" }]
          
        })
      });

     
      if (metadata.RetCode == "1") {
        yield put({
          type: "saveinfo",
          payload: {
            metadataList: metadata.DataRows
          }
        });
      }else{
        message.error( metadata.RetVal,5)
      }
    },
    //表单数据
    *formData({ payload }, { call, select, put }) {
      let { typeInfoList } = yield select(state => state.authchange);
      let className =payload.selectName || typeInfoList.DataRows[0].category_name; //默认查询
      let getformData;
      let formList=[];
      if(payload.select2id==undefined){
         getformData = yield call(service.formData, {
          arg_category_name: className,
        });
      }else{
         getformData = yield call(service.formData, {
          arg_category_name: className,
          arg_field_uid:payload.select2id
        });
      }
      if (getformData.RetCode == "1" &&getformData.DataRows) {

        if(getformData.DataRows&&getformData.DataRows.length>0){
          formList= getformData.DataRows.map((item) => { 
            if (item.checkers != undefined) {
              item.checkers = item.checkers.split(",");
              item.checkerIds = item.checkerIds.split(",");
              return item;
            } else {
              return item;
            }
          });

        }else{
        formList=[]
        }

        yield put({
          type: "saveinfo",
          payload: {
            formList: formList,
            formVisble: false
          }
        });
      }else{
        message.error( getformData.RetVal,5)
      }
    },

    //筛选
    *filter({ selectName,select2 }, { put, select }) {
       let { metadataList } = yield select(state => state.authchange); //信息下拉框
       let select2id;
       if(select2){
        metadataList.forEach(item => {
          if (item.column_comment ==select2) {
            select2id=item.uid
          }
        });
       }
      yield put({ type: "formData", payload: { selectName,select2id } }); //这里传的是类名字
    },

    //增加和编辑
    *tbEdit({ values,user_id }, { call, put, select }) {
     
      let {typeInfoList, metadataList,addAction } = yield select(state => state.authchange);
        let category_id = 0;
        let field;
        if(values.column_comment=="all"){
          typeInfoList.DataRows.map((item) => {
          if (item.category_name == values.typeName) {//考虑这里为全部的情况
            category_id = item.uid;
          }
        });
        }else{
          metadataList.map((item) => {
          if (values.column_comment==item.column_comment) {//考虑这里为全部的情况
            field = item.uid;
            category_id = item.category_id;
          }
          });
        }
         //字段信息第8个接口
        let addtip = yield call(service.fieldChang, { 
                revisability: values.revisability,
                audit: values.audit,
                field_uid: values.column_comment == "all" ? "all" : field,
                update_userid:user_id,
                category_uid:category_id
            }
        );
         //新增审核人第3个接口
        if(addAction&&values.checkerIds){
          let addCheckTip = yield call(service.checkerAdd, 
          {
          category_uid:category_id,
          field_uid: values.column_comment == "all" ? "all" : field,
          checkers: JSON.stringify(values.checkerIds.map((item,index)=>{
          return {
          check_userid:item,
          level:index+1,
          is_last: index==values.checkerIds.length-1?1:0
          }
          })),
          create_userid:user_id
        }
        );
        if (addCheckTip.RetCode == 1) {
          
          message.success('字段权限变更成功!',5)
          let selectName = values.typeName;
          yield put({ type: "formData", payload: { selectName} });
          }else{
            message.error(addCheckTip.RetVal,5)
          }
        }
        //编辑审核人第4个接口
        if(!addAction){
            let changCheckTip = yield call(service.checkerChang, 
              {
                category_uid:category_id,
                field_uid:field,
                checkers: values.checkerIds?JSON.stringify((values.checkerIds||[]).map((item,index)=>{
                return {
                check_userid:item,
                level:index+1,
                is_last: index==values.checkerIds.length-1?1:0
                }
                })):"[]",
                update_userid:user_id
                }   
            );

          if (changCheckTip.RetCode == 1) {
            message.success('字段权限变更成功!',5)
            let selectName = values.typeName;
            yield put({ type: "formData", payload: { selectName} });
            }
            else{
              message.error(changCheckTip.RetVal,5)
            }
          
        }

    if (addtip.RetCode == 1) {
      if(!values.checkerIds){
        message.success('字段权限变更成功!',5)
      }
     
      let selectName = values.typeName;
     yield put({ type:"updateShallowState",payload:{copyrecord:{checkers:[],checkerIds:[]}}});
      yield put({ type: "formData", payload: { selectName} });
        }else{
          message.error(addtip.RetVal,5)
        }
    },
     //删除
    *deleteInfo({ record,user_id,selectName}, { call, put }) {
      let deleteTip = yield call(service.deleteInfo,{
        arg_field_uid:record.field_uid,
        arg_update_userid:user_id
      });
     // debugger
      if (deleteTip.RetCode == "1") {
        message.success("重置成功！",5)
        yield put({ type: "formData", payload: {selectName} 
          });
        }
        else{
          message.error(deleteTip.RetVal,5)
        }
      
    },
     //移除
    *remove({ opt,key }, { select,put }) {
      let { copyrecord } = yield select(state => state.authchange);
      let checkerIds = copyrecord.checkerIds;
      checkerIds.forEach((item, index) => {
        if (item == opt&&key==index) {
          checkerIds.splice(index, 1);
        }
      });

      yield put({
        type: "saveInfo",
        payload:{
          copyrecord
        }
       
      });
    },
     //变更权限（增加）
    *fieldAdd({formVisble,addAction},{select,put }) {
     let { formList,optmaxlength} = yield select(state => state.authchange);
     let arr=[];//这里需要清空，否则会一直push
         formList.forEach(item=>{
          if(item.audit==0&&item.revisability==0&&item.checkers==undefined){
            arr.push(item.column_comment)
          }
        })
      yield put({
        type: "saveinfo",
        payload: {
          formVisble,
          fieldList:arr,
          addAction,
          optmaxlength
        }
      });
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === "/humanApp/encouragement/authChange") {
          dispatch({ type: "typeinfo", query });
        }
      });
    }
  }
};
