/**
 * 作者：陈红华
 * 创建日期：2017-12-01
 * 邮箱：1045825949@qq.com
 * 文件说明：项目结项：项目列表页
 */
import * as projServices from '../../../services/project/projService';
import Cookie from 'js-cookie';
import {message} from "antd";


export default {
  namespace: 'projDeliveryFile',
  state: {
    DataRows1:[],
    DataRows2:[],
    DataRows3:[],
    DataRows4:[],
    rightCtrl:[],
    auditState:''
  },

  reducers: {
    // 查询项目信息数据处理
    projDeliveryFileQRedu(state,action){
      let {DataRows3,DataRows2,DataRows1,auditState,DataRows4}=action;
      let DataList1=DataRows2;
      let DataList2={};
      for(let i=0;i<DataList1.length;i++){
        for(let k in DataList1[i]){
          if(DataList2[k]){
            for (let r=0;r<DataRows3.length;r++){
              if(DataRows3[r][DataList1[i][k]]){
                DataList2[k].push({'fileName':DataList1[i][k],[DataList1[i][k]]:DataRows3[r][DataList1[i][k]],'key':DataRows3[r][DataList1[i][k]].document_file_uid})
              }
            }
          }else{
            for (let r=0;r<DataRows3.length;r++){
              if(DataRows3[r][DataList1[i][k]]){
                DataList2[k]=[{'fileName':DataList1[i][k],[DataList1[i][k]]:DataRows3[r][DataList1[i][k]],'key':DataRows3[r][DataList1[i][k]].document_file_uid}];
              }
            }
          }
        }
      }
      let hasUploadList={};
      for(let key in DataList2){
        let hasUpload=DataList2[key].length;
        for(let t=0;t<DataList2[key].length;t++){
          if(DataList2[key][t][DataList2[key][t].fileName].allUrl.length!=0 && DataList2[key][t][DataList2[key][t].fileName].allUrl[0].file_name){
            hasUpload--;
          }
        }
        hasUploadList[key]=hasUpload;
      }
      return {
        ...state,
        DataRows1,
        DataList2,
        hasUploadList,
        DataRows2,
        DataRows3,
        DataRows4,
        auditState
      }
    },
    // 按钮权限
    usergetmoduleGrpsrvRedu(state,{DataRows}){
      return {...state,rightCtrl:DataRows}
    }
    // saveFileState(state,{returnNum,fileState}){
    //   return {
    //     ...state,returnNum,fileState
    //   }
    // }
  },
  effects: {
    // 查询moduleId
    *pUserhasmodule({},{call,put}){
      let {moduleid} = yield call(projServices.pUserhasmodule,{argtenantid:Cookie.get('tenantid'),arguserid:Cookie.get('userid'),argrouterurl:'/projClosure/projDeliveryList'});
      yield put({
        type: 'usergetmoduleGrpsrv',
        postData:{
          argtenantid:Cookie.get('tenantid'),
          arguserid:Cookie.get('userid'),
          argmoduleid:moduleid
        }
      });
    },
    // 根据moduleId查询按钮权限
    *usergetmoduleGrpsrv({postData},{call,put}){
      let {DataRows} = yield call(projServices.usergetmoduleGrpsrv,postData);
      yield put({
        type: 'usergetmoduleGrpsrvRedu',
        DataRows
      });
    },
    // 项目文档列表查询
    *projDeliveryFileQuery({postData},{call,put}){
      let {DataRows} = yield call(projServices.projDeliveryFileQuery,postData);
      let {DataRows1}=DataRows[0];
      let {DataRows2}=DataRows[1];
      let {DataRows3,auditState}=DataRows[2];
      let {DataRows4}=DataRows[3];

      yield put({
        type: 'projDeliveryFileQRedu',
        DataRows1,
        DataRows2,
        DataRows3,
        DataRows4,
        auditState
      });
    },
    // // 查看文档状态
    // *projDocumentPass({postData},{call,put}){
    //   let {returnNum,fileState}=yield call(projServices.projDocumentPass,postData);
    //   yield put({
    //     type:'saveFileState',
    //     returnNum,
    //     fileState
    //   })
    // },
    // 上传文件或者修改备注
    *updateData({record},{put,select}){
      let {DataRows1,DataRows2,DataRows3,DataRows4,auditState}=yield select((state)=>state.projDeliveryFile);
      for(let i=0;i<DataRows3.length;i++){
        if(DataRows3[i][record.fileName]){
          DataRows3[i][record.fileName]={...record[record.fileName]}
        }
      }
      yield put({
        type: 'projDeliveryFileQRedu',
        DataRows1,
        DataRows2,
        DataRows3,
        DataRows4,
        auditState
      })
    },
    // TMO审核是否通过
    *projClosingDocumentAudit({postData,queryData},{call,put}){
      let {RetCode}=yield call(projServices.projClosingDocumentAudit,postData);
      if(RetCode=='1'){
        yield put({
          type:'projDeliveryFileQuery',
          postData:queryData
        })
        message.success(postData.arg_isPass=='yes'?'通过成功！':"退回成功！")
      }
    },
    // 项目经理保存或提交
    *ProjWebReturnBackAnalysis({postData,queryData},{call,put}){
      let {RetCode}=yield call(projServices.ProjWebReturnBackAnalysis,postData);
      if(RetCode=='1'){
        yield put({
          type:'projDeliveryFileQuery',
          postData:queryData
        })
        message.success(postData.fileState=='1'?'提交成功！':"保存成功！")
      }
    },

  },

  subscriptions: {
  },
};
