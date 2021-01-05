/**
 * 文件说明：全面激励-首页
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */
import * as service from '../../../services/encouragement/services';
import {message} from "antd";
import Cookie from 'js-cookie';
import {OU_NAME_CN,OU_HQ_NAME_CN} from '../../../utils/config';
import * as hrService from "../../../services/hr/hrService";

export default {
  namespace : 'encouragementImport',
  state : {
    ouList:[],
    deptList:[],
    postList:[],
    serviceList:[],
    messageList:[],
    dataList:[],
    wordBookList:[],
    reportList:[]
  },

  reducers : {
    initData(state) {
      return {
        ...state,
        ouList:[],
        deptList:[],
        postList:[],
        serviceList:[],
         // messageList:[],
        dataList:[],
        wordBookList:[],
      }
    },
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-09-18
     * @param state 初始状态
     * @param infoList
     */
    saveOU(state,{ouList: DataRows}) {
      return { ...state, ouList:DataRows};
    },
    saveDept(state,{deptList: DataRows}) {
      return { ...state, deptList:DataRows};
    },
    saveService(state,{serviceList: DataRows}) {
      return { ...state, serviceList:DataRows};
    },
    savePost(state,{postList: DataRows}) {
      return { ...state, postList:DataRows};
    },
      /*saveMessage(state,{messageList: DataRows}) {
          return { ...state, messageList:DataRows};
      },*/

    saveListRes(state,{dataList}) {
      return { ...state, dataList};
    },
    saveWordBook(state,{wordBookList}) {
      return { ...state, wordBookList};
    },
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects : {
    /**
     * 功能：初始化
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
      *fetch({}, {call, put}) {
      yield put({type: 'staffInfoSearchDefault'});
      yield put({type: 'userServiceQuery'});
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-9-20
     * 功能：初始化查询
     * @param call 请求服务
     * @param put 返回reducer
     */
      *userServiceQuery({},{call,put}) {
      //从服务获取OU列表
      let postData = {};
      postData["argtenantid"] = Cookie.get('tenantid');
      postData["arguserid"] = Cookie.get('userid');
      postData["argmoduleid"] = '7cb83a76c1fe11e8a340008cfa042288';
      const {DataRows: getServiceData} = yield call(service.userServiceQuery, postData);
      yield put({
        type: 'saveService',
        serviceList: getServiceData
      });
    },
    /**
     * 作者：邓广晖
     * 创建日期：2017-9-20
     * 功能：初始化查询
     * @param call 请求服务
     * @param put 返回reducer
     */
      *staffInfoSearchDefault({},{call,put}) {
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = Cookie.get('tenantid');
      const {DataRows: getOuData} = yield call(hrService.getOuList, postData_getOU);
      yield put({
        type: 'saveOU',
        ouList: getOuData
      });
     // yield put({type: 'getDept',arg_param:getOuData[0].OU});//这里考虑到是分院的情况时不能默认传本院的组织单元
      yield put({type: 'getDept',arg_param:Cookie.get('OU')});
      //yield put({type: 'getPost',arg_param:getOuData[0].OU});
      yield put({type: 'getPost',arg_param:Cookie.get('OU')});
      yield put({type: 'getMessage',arg_param:getOuData[0].OU});  // 获取服务类别
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：初始化部门和职务数组
     * @param put 返回reducer
     */
      *init({}, {put}){
      yield put({
        type: 'save',
        payload:{
          deptList: [],
          postList: [],
          dataList:[],
            //messageList:[],
        }
      });
    },

    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：从服务获取OU下的部门列表
     * @param arg_param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
      *getDept({arg_param},{call,put}){
      let postData_getDept = {};
      postData_getDept["argtenantid"] = Cookie.get('tenantid');
      const {DataRows:getDeptData} = yield call(hrService.getDeptInfo, postData_getDept);
      let pureDeptData = [];//存储去除前缀后的部门数据
      for(let i=0;i<getDeptData.length;i++){
        if(arg_param === OU_HQ_NAME_CN){ //联通软件研究院本部
          arg_param = OU_NAME_CN; //联通软件研究院
        }
        if(getDeptData[i].dept_name.split('-')[0] === arg_param && getDeptData[i].dept_name.split('-')[1]){
          if(!getDeptData[i].dept_name.split('-')[2]){ //纪委去重
            pureDeptData.push(getDeptData[i].dept_name.split('-')[1]);
          }
        }
      }
      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });
    },
    /**
     * 作者：耿倩倩
     * 创建日期：2017-9-20
     * 功能：从服务获取OU下的职务列表
     * @param arg_param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
      *getPost({arg_param},{call,put}){
      let postData_getPost={};
      postData_getPost["arg_tenantid"] = Cookie.get('tenantid');
      postData_getPost["arg_post_tenantid"] = Cookie.get('tenantid');
      postData_getPost["arg_ouname"] = arg_param;
      const {DataRows,RetCode,RetVal} = yield call(hrService.postInfoQuery, postData_getPost);
      if(RetCode=="1"){
        yield put({
          type: 'savePost',
          postList:DataRows||[]
        });
      }else{
        yield put({
          type: 'savePost',
          postList:[]
        });
        message.warning(RetVal)
      }
     
    },


      *getMessage({},{call,put}){
          const {DataRows:getPostData} = yield call(hrService.mycategoryquery, {});
          yield put({
              type: 'save',
              payload:{
                  messageList: getPostData
              }
          });
      },


    *wordbookQuery({field},{call,put}){
      let postData_getPost={};
      postData_getPost["arg_field_name"] = field;
      const dataRes = yield call(service.wordbookQuery, postData_getPost);
      if(dataRes && dataRes.RetCode == '1'){
        yield put({
          type: 'saveWordBook',
          wordBookList:dataRes.DataRows
        });
      }else{
        message.error("查询失败！")
      }

    },
    *adminSimpleQuery({param}, {call, put}) {
      // yield put({
      //   type: 'saveListRes',
      //   dataList:[]
      // });
      const infoRes = yield call(service.adminSimpleQuery,param);
      
      if(infoRes.RetCode=='1'){
        if(infoRes.DataRows && infoRes.DataRows.length){
          yield put({
            type: 'saveListRes',
            dataList: infoRes.DataRows
          });
        }else {
          yield put({
            type: 'saveListRes',
            dataList: []
          });
          message.warning('未查询到相关信息！')
        }

      }else {
        message.error(infoRes.RetVal)
      }
    },
    *adminAdvanceInfoQuery({param}, {call, put}) {
      // yield put({
      //   type: 'saveListRes',
      //   dataList:[]
      // });
      const infoRes = yield call(service.adminAdvanceInfoQuery,param);

      if(infoRes.RetCode=='1'){
        if(infoRes.DataRows && infoRes.DataRows.length){
          yield put({
            type: 'saveListRes',
            dataList: infoRes.DataRows
          });
        }else {
          yield put({
            type: 'saveListRes',
            dataList: []
          });
          message.warning('未查询到相关信息！')
        }

      }else {
        message.error(infoRes.RetVal)
      }
    },
    *getImportExl({value}, {call, put}) {
        let transjsonarray = {
          "property": {
            "templet_path":"templet_path"
          },
          "condition": {
            "category_name": value,
            "state":"0"
          }
        };
      const data = yield call(service.getImportExl,{transjsonarray:JSON.stringify(transjsonarray)});
      if(data.RetCode === '1'){
          yield put({
            type: 'save',
            payload: {
              importExl : data.DataRows[0].templet_path,
            }
          });
      }
    },
    // 删除
    *deletePersonData({param},{call,put}){
      const infoRes = yield call(hrService.admindeleterow,param) 
      message.warning(infoRes.RetVal)
    },


     //员工信息查询
    *staffInfoSearch({arg_param},{call,put,select}){
      //debugger
     let {postList}= yield select(state=>state.encouragementImport)
    const basicInfoData = yield call(hrService.basicInfoQuery,arg_param);
    const {DataRows} = yield call(hrService.getDeptInfo, {argtenantid:10010});

    basicInfoData.DataRows.forEach(ele=> {
      DataRows.forEach(item=>
        {
          if(ele.deptname==item.dept_name){
            ele["deptid"]=item.dept_id
          }
        })
     
        postList.forEach(post=>{
          if(post.post_name==ele.post_name){
            ele["ouid"]=post.op_ouid
            ele["ouname"]=arg_param["arg_ou_name"] 
          }
        })
    });
    //console.log(basicInfoData.DataRows)

    if(basicInfoData.RetCode === '1'){
      yield put({
        type: 'saveListRes',
        dataList: basicInfoData.DataRows||[]
      });
      message.success("查询成功")
     }else{
      yield put({
        type: 'saveListRes',
        dataList: []
      });
      message.warning(basicInfoData.RetVal)
     }
    },

    //可选激励报告列表
      *reportType({},{call,put}){
      const {DataRows,RetCode} = yield call(service.reportList,{arg_staff_id:Cookie.get('staff_id')});
      if(RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
              reportList: DataRows||[]
                }
            })
        }
      },
  

  },
  


  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname, query}) => {

        if (pathname === '/humanApp/hr/import') {
          dispatch({type: 'fetch', query});
          dispatch({type: 'initData', query});
          dispatch({type: 'reportType'});
        }
      });

    },
  },
};
