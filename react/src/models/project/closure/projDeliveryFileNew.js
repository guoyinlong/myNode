/**
 * 作者：杨青
 * 创建日期：2019-6-19
 * 邮箱：yangq41@chinaunicom.cn
 * 文件说明：项目结项：项目列表页
 */
import * as projServices from '../../../services/project/projService';
import Cookie from 'js-cookie';
import {message} from "antd";


export default {
  namespace: 'projDeliveryFileNew',
  state: {
    projectId:'',
    projectName:'',
    projectDetail:{},
    role_type:'',//项目类型：0项目类1小组类2支持类
    tmoButtonPermissions:{},
    managerButtonPermissions:{},
    groupButtonPermissions:{},
    projectVisible:false,
    returnVisible:false,
    managerSubmitVisible:false,
    projectList:[],
    checkList:[],
    paramProject:{projectCode:'',projectName:''},//搜索项目
    flowId:'',
  },

  reducers: {
    initData(state){
      return {
        ...state,
        projectId:'',
        projectName:'',
        projectDetail:{},
        role_type:'',
        tmoButtonPermissions:{},
        managerButtonPermissions:{},
        groupButtonPermissions:{},
        projectVisible:false,
        managerSubmitVisible:false,
        projectList:[],
        checkList:[],
        paramProject:{projectCode:'',projectName:''},//搜索项目
        flowId:'',
      }
    },
    save(state, action){
      return {
        ...state,
        ...action.payload,
      }
    }
  },
  effects: {
    /**
     * 作者：杨青
     * 日期：2019-06-18
     * 邮箱：yangq41@chinaunicom.cn
     * 说明：填报页面初始化
     **/
    *init({query}, {call,put,select}){
      yield put({
        type : 'save',
        payload:{
          projectId:query.proj_uid,
          projectName:query.proj_name,
        }
      });
      yield put({
        type: 'queryButtonPermission',
      });
    },
    *queryButtonPermission({},{call,put,select}){
      let {projectId} = yield select(state =>state.projDeliveryFileNew);
      let postData ={
        projectId : projectId,
      };
      let data = yield call(projServices.queryButtonPermission, postData);
      if (data.RetCode === 1){
        // let data = {
        //   role: '0',//0: 项目经理1:团队负责人2:tmo
        //   tmoButtonPermissions:{ablePass:true,ableReturn:true},
        //   managerButtonPermissions:{isDisplaySubmit:true,ableSubmit:true,isDisplayAdd:true,isDisplayDel:true,isDisplayOperate:true},
        //   groupButtonPermissions:{ableSubmit:true,isDisplayOperate:true},
        // }
        let tmoButtonPermissions={};
        let managerButtonPermissions={};
        let groupButtonPermissions={};
        if (data.DataRows.role === 0){
          managerButtonPermissions = data.DataRows.managerButtonPermission;
        }else if (data.DataRows.role === 1){
          groupButtonPermissions=data.DataRows.groupButtonPermission;
        }else if (data.DataRows.role === 2){
          tmoButtonPermissions=data.DataRows.tmoButtonPermission;
        }
        yield put({
          type : 'save',
          payload:{
            role_type:data.DataRows.role,
            tmoButtonPermissions,
            managerButtonPermissions,
            groupButtonPermissions,
          }
        });
        yield put({
          type: 'queryProjectDeliver',
        });
        //添加同时结项，本期不上线
        // if (data.DataRows.role===0){
        //   yield put({
        //     type: 'queryProjectList',
        //   });
        // }
      }
      // }else {
      //   message.error(data.RetVal);
      // }
    },
    *queryProjectDeliver({},{call,put,select}){
      let {projectId} = yield select(state =>state.projDeliveryFileNew);
      let postData = {
        projectId:projectId,
      };
      let data = yield call(projServices.queryProjectDeliver, postData);
      if (data.RetCode === 1){
        let checkList = [];
        if (data.DataRows.togetherCloseProjects){
          data.DataRows.togetherCloseProjects.map(item =>{
            checkList.push(item.key);
          })
        }

        yield put({
          type : 'save',
          payload:{
            projectDetail:JSON.parse(JSON.stringify(data.DataRows)),
            checkList,
            flowId:data.DataRows.flowId,
          }
        });
      }
    },
    //添加同时结项，本期不上线
    //查找项目列表
    // *queryProjectList({},{select,put,call}){
    //   let data = yield call(projServices.queryProjectList);
    //   if (data.RetCode === 1){
    //     data.DataRows.map(item =>{
    //       item.key = item.projectId
    //     })
    //     yield put({
    //       type : 'save',
    //       payload:{
    //         projectList:data.DataRows,
    //         filterProject:data.DataRows,
    //       }
    //     });
    //   }
    // },
    *changeCheckList({checkedValues},{select,put,call}){
      yield put({
        type : 'save',
        payload:{
          checkList:checkedValues,
        }
      });
    },
    *changeProjectModal({flag},{select,put,call}){
      let visible = '';
      if (flag==='open'){
        visible = true;
      }else{
        visible = false;
      }
      yield put({
        type : 'save',
        payload:{
          projectVisible:visible,
          paramProject: {projectCode:'',projectName:''},
        }
      });
    },
    *setInputShow({key,value},{select,put,call}){
      let {paramProject} = yield select(state =>state.projDeliveryFileNew);
      paramProject[key] = value;
      yield put({
        type : 'save',
        payload:{
          paramProject
        }
      });
    },
    *searchProject({},{select,put,call}){
      let {projectList,paramProject} = yield select(state =>state.projDeliveryFileNew);
      let filterProject = projectList.filter(item => item.projectCode.toLowerCase().search(paramProject.projectCode.toLowerCase())!== -1&&item.projectName.toLowerCase().search(paramProject.projectName.toLowerCase())!== -1);
      yield put({
        type : 'save',
        payload:{
          filterProject:JSON.parse(JSON.stringify(filterProject)),
        }
      });
    },
    *clearSearchProject({},{select,put,call}){
      let paramProject= {projectCode:'',projectName:''};
      yield put({
        type : 'save',
        payload:{
          paramProject
        }
      });
      yield put({
        type: 'searchProject',
      });
    },
    *addTogetherProject({selectedRowKeys},{select,put,call}){
      let {projectId} = yield select(state =>state.projDeliveryFileNew);
      let list = selectedRowKeys.join(',');
      let postData = {
        projectId:projectId,
        projectIds:list,
      };
      let data = yield call(projServices.addTogetherProject, postData);
      if (data.RetCode === 1){
        message.success('添加成功');
        yield put({
          type : 'save',
          payload:{
            projectVisible:false
          }
        });
        yield put({
          type: 'queryProjectDeliver',
        });
      }else{
        message.error(data.RetVal);
      }
    },
    *deleteTogetherProject({id},{select,put,call}){
      let {projectId} = yield select(state =>state.projDeliveryFileNew);
      let postData = {
        projectId:projectId,
        projectIds:id,
      };
      let data = yield call(projServices.deleteTogetherProject, postData);
      if (data.RetCode === 1){
        message.success('删除成功');
        yield put({
          type: 'queryProjectDeliver',
        });
      }
    },
    *changeReasonModal({flag},{select,put,call}){
      let visible = '';
      if (flag==='open'){
        visible = true;
      }else{
        visible = false;
      }
      yield put({
        type : 'save',
        payload:{
          returnVisible:visible,
          paramProject: {projectCode:'',projectName:''},
        }
      });
    },
    *returnReasonCrl({reason},{select,put,call}){
      let {projectId,flowId} = yield select(state =>state.projDeliveryFileNew);
      let postData = {
        flowId:flowId,
        projectId:projectId,
        opinion:reason,
      };
      let data = yield call(projServices.tmoReturn, postData);
      if (data.RetCode === 1){
        yield put({
          type : 'save',
          payload:{
            returnVisible:false,
          }
        });
        message.success('退回成功');
        yield put({
          type: 'queryButtonPermission',
        });
      }else{
        message.error(data.RetVal);
      }
    },
    *tmoPass({reason},{select,put,call}){
      let {projectId,flowId} = yield select(state =>state.projDeliveryFileNew);
      let postData = {
        flowId:flowId,
        projectId:projectId,
        opinion:reason,
      };
      let data = yield call(projServices.tmoPass, postData);
      if (data.RetCode === 1){
        yield put({
          type : 'save',
          payload:{
            returnVisible:false,
          }
        });
        message.success('通过成功');
        yield put({
          type: 'queryButtonPermission',
        });
      }else{
        message.error(data.RetVal);
      }

    },
    *submitConfirm({},{select,put,call}){
      let {projectId} = yield select(state =>state.projDeliveryFileNew);
      let postData = {
        projectId:projectId,
      };
      let data = yield call(projServices.submitConfirm, postData);
      if (data.RetCode === 1){
        message.success('提交成功');
        yield put({
          type: 'changeManagerSubmitModal',
          flag:'close',
        });
        yield put({
          type: 'queryButtonPermission',
        });
      }else{
        message.error(data.RetVal);
      }
    },
    *uploadProjectFile({documentId,url,file},{select,put,call}){
      const formData = new FormData();
      formData.append('documentId', documentId);
      formData.append('fileUrl', url);
      formData.append('file', file);
      const data = yield call(projServices.uploadProjectFile, {
        method: 'POST',
        body: formData
      });
      if (data.data.RetCode === 1){
        message.success('文件上传成功');
        yield put({
          type: 'queryButtonPermission',
        });
      }else{
        message.error(data.data.RetVal);
      }
    },
    *deleteProjectFile({id},{select,put,call}){
      let postData = {
        fileId:id,
      };
      let data = yield call(projServices.deleteProjectFile, postData);
      if (data.RetCode === 1){
        message.success('文件删除成功!');
        yield put({
          type: 'queryButtonPermission',
        });
      }else{
        message.error(data.RetVal);
      }
    },
  },

  subscriptions: {
    setup({dispatch,history}){
      return history.listen(({pathname,query})=> {
        if (pathname == '/projectApp/projClosure/projDeliveryList/projDeliveryFileNew') {
          dispatch({type: 'init', query});
        }
      })
    }
  },
};
