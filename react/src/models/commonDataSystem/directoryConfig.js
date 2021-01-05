/**
 * 作者： 张枫
 * 创建日期： 2019-11-21
 * 邮箱: zhangf142@chinaunicom.cn
 * 功能： 常用资料-目录配置
 */
import * as Service from '../../services/commonData/commonData.js';
import { message } from 'antd';
import { getUuid } from '../../utils/func';
export default {
  namespace: 'directoryConfig',
  state:{
    directoryList:[],// 目录结构列表
    isAddDicVisible : false ,//添加一级目录模态框
    isAddSecDicVisible : false ,//添加二级目录模态框
    isAddThiDicVisible : false ,//添加三级目录模态框
    isUpdateDicVisible:false,//修改一级目录
    isUpdateSecDicVisible : false,//修改二级目录
    isUpdateThiDicVisible:false , //修改三级目录
    saveData :"",
    modalKey:"",//随机值
    secDic:{},//二级目录数据
    thiDic :{},//三级目录数据
    innerThiDic:{},
    pathIdList : [],//权限目录id
    roleType :0,// 0  1  办公室管理员

  },
  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  },
  effects: {
    //查询目录结构
    *queryDirectory({},{ select,put,call}){
      const postData = {arg_state: "1"}
    const { pathIdList ,roleType} = yield select((state) => state.directoryConfig)
    let data = yield call(Service.queryFilePath,{...postData})
    if(data.RetCode == "1"){
      let temp = JSON.parse(JSON.stringify(data.DataRows))
      // 若是类别管理员  设置目录权限
      if (temp.length !=0 && pathIdList.length!=0){
        for (let i =0 ;i<pathIdList.length;i++){
          for(let j=0;j<temp.length;j++){
            if(pathIdList[i] == temp[j].path_id){
              temp[j].state = 1 ;// 当登录账号有该目录权限时，给该目录增加字段state =1
            }
          }
        }
      }
      // 如果是办公室管理员  设置目录权限
      if (temp.length !=0 && roleType ==1){
        for(let j =0;j<temp.length;j++){
          temp[j].state = 1 ;// 当登录账号有该目录权限时，给该目录增加字段state =1
        }
      }
      yield put({
        type:"save",
        payload:{
         // directoryList:JSON.parse(JSON.stringify(data.DataRows))
          directoryList :JSON.parse(JSON.stringify(temp))
        }
      })
    }

  },
    //查询用户角色
    *queryRole({},{select,put,call}){
      let { pathIdList,roleType } = yield select((state) => state.directoryConfig)
      let data = yield call(Service.queryManageRole)
      if(data.RetCode == "1"){
        if(data.DataRows.length != 0){
          data.DataRows.map((item,index)=>{
            if(item.manage_role == "pathAdmin"){
              pathIdList = item.path_id.split(",")
            }else if(item.manage_role == "officeAdmin"){
              roleType = 1;
            }
          })
        }
        yield put({
          type:"save",
          payload :{
            pathIdList,
            roleType,
          }
        })
      }
      yield put({type:"queryDirectory"})
    },
    //设置模态框状态
    *setVisible({para},{ select,put,call}){
      yield put ({type:"save",
        payload:
        {
          modalKey :getUuid(32,64),
          isAddDicVisible:true
        }})
    },
    // 设置二级目录新增模态框
    *setSecVisible({data,para},{select,put,call}){
      if(para == "addSecDic"){
        yield put ({
          type:"save",
          payload:
          {
             modalKey :getUuid(32,64),
            isAddSecDicVisible:true,
            secDic:data
          }
        })
      }else if(para == "updateDic"){
        yield put ({
          type:"save",
          payload:
          {
             modalKey :getUuid(32,64),
            isUpdateDicVisible:true,
            secDic:data
          }
        })
      }
    },
    // 设置三级目录新增模态框
    *setThiVisible({record,para},{select,put,call}){
      if(para == "addThiDic"){
        yield put ({
          type:"save",
          payload:
          {
            isAddThiDicVisible:true,
            thiDic:record,
            modalKey :getUuid(32,64),
          }
        })
      }else if(para == "updateThiDic"){
        yield put ({
          type:"save",
          payload:
          {
            isUpdateSecDicVisible:true,
            thiDic:record,
            modalKey :getUuid(32,64),
          }
        })
      }
    },
    *setInnerThirdVisible({record},{select,put,call}){
      yield put ({
        type:"save",
        payload:
        {
          isUpdateThiDicVisible:true,
          innerThiDic:record,
          modalKey :getUuid(32,64),
        }
      })
    },
    //保存填写的目录数据
    *saveDic({data},{ select,put,call}){
        yield put ({type:"save",payload:{saveData:data}})
    },
    *confirmAddDic({data},{select,put,call}){
      const { saveData,secDic,thiDic } = yield select((state) => state.directoryConfig)
      if(data == "addDic"){
        let postData = {
          arg_path_name: saveData
        }
        let data = yield call(Service.createFilePath, postData)
        if (data.RetCode == "1") {
          message.success("新增成功！")
          //新增成功后重新走查询服务
          yield put({type:"queryDirectory"})
          yield put({
            type:"save",
            payload:{
              isAddDicVisible:false,
            }
          })
        }
      }
      else if (data == "addSecDic"){
        let postData = {
          arg_path_name: saveData,
          arg_parent_id:secDic.path_id
        }
        let data = yield call(Service.createFilePath, postData)
        if (data.RetCode == "1") {
          message.success("新增成功！")
          //新增成功后重新走查询服务
          yield put({type:"queryDirectory"})
          yield put({
            type:"save",
            payload:{
              isAddSecDicVisible:false
            }
          })
        }
      }
      else if(data == "addThiDic"){
        let postData = {
          arg_path_name: saveData,
          arg_parent_id:thiDic.spPathId
        }
        let data = yield call(Service.createFilePath, postData)
        if (data.RetCode == "1") {
          message.success("新增成功！")
          //新增成功后重新走查询服务
          yield put({type:"queryDirectory"})
          yield put({
            type:"save",
            payload:{
              isAddThiDicVisible:false
            }
          })
        }
      }
    },
      //确认删除目录
    *delDic({data},{select,put,call}){
      let postData = {
        arg_path_id : data
      }
      let responseData = yield call(Service.delFilePath,postData)
      if( responseData.RetCode == "1"){
        message.success("删除成功！")
        //删除成功后重新走查询服务
        yield put({type:"queryDirectory"})
      }
      },

    // 取消模态框
    *cancel({data},{select,put,call}){
      if(data === "addDic"){
        yield put ({type:"save",payload:{isAddDicVisible:false}})
      }else if(data === "addSecDic"){
        yield put ({type:"save",payload:{isAddSecDicVisible:false}})
      }else if(data === "addThiDic"){
        yield put ({type:"save",payload:{isAddThiDicVisible:false}})
      }else if(data === "updateDic"){
        yield put ({type:"save",payload:{isUpdateDicVisible:false}})
      }
      else if(data === "updateSecDic"){
        yield put ({type:"save",payload:{isUpdateSecDicVisible:false}})
      }
    else if(data === "updateThiDic"){
        yield put ({type:"save",payload:{isUpdateThiDicVisible:false}})
      }
    },
    //确认保存修改目录
    *confirmReviseDic({data},{ select,put,call}){
      let {saveData,secDic,thiDic,innerThiDic} = yield select((state) => state.directoryConfig)
      if(saveData == ""){
        if(data == "updateDic"){
          message.info("输入为空，目录名称未修改！")
         // isUpdateDicVisible = false
          yield put({
            type:"save",
            payload:{
              isUpdateDicVisible:false
            }
          })
        }else if(data == "updateSecDic"){
          message.info("输入为空，目录名称未修改！")
         // isUpdateSecDicVisible = false
          yield put({
            type:"save",
            payload:{
              isUpdateSecDicVisible:false
            }
          })
        }
        else if(data == "updateThiDic"){
          message.info("输入为空，目录名称未修改！")
         // isUpdateThiDicVisible = false
          yield put({
            type:"save",
            payload:{
              isUpdateThiDicVisible:false
            }
          })
        }
      }else{
        let postData = {
          arg_path_id : data == "updateDic"? secDic.path_id :(data == "updateSecDic" ? thiDic.spPathId :innerThiDic.tpPathId ) ,
          arg_path_name :saveData,
        };
        let responseData = yield call(Service.updateFilePath,postData);
        if( responseData.RetCode == "1"){
          if(data == "updateDic"){
            //isUpdateDicVisible = false
            yield put({
              type:"save",
              payload:{
                isUpdateDicVisible:false,
                saveData:"",
              }
            })
          }else if(data == "updateSecDic"){
            //isUpdateSecDicVisible = false
            yield put({
              type:"save",
              payload:{
                isUpdateSecDicVisible:false,
                saveData:"",
              }
            })
          }
          else if(data == "updateThiDic"){
           // isUpdateThiDicVisible = false
            yield put({
              type:"save",
              payload:{
                isUpdateThiDicVisible:false,
                saveData:"",
              }
            })
          }

          yield put({type:"queryRole"})
        }
      }
    }
  },
  subscriptions: {
    setup({dispatch,history}) {
      return history.listen(({pathname,query}) => {
        if (pathname === '/adminApp/commonDataSystem/directoryConfig') {
          dispatch({type:"queryRole"}) // 查询用户角色
        }
      });
    }
  }
};
