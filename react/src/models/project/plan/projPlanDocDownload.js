/*
*项目计划文档下载
*Author: 任金龙
*Date: 2017年11月13日
*Email: renjl33@chinaunicom.cn
*/
import * as projServices from '../../../services/project/projService';
import Cookie from 'js-cookie';
import { message } from 'antd';
export default {
  namespace: 'projPlanDocDownload',
  state: {
    ismgr:"",
    isthisPro:"",
    isshowmgr:"",
    istmo:"",
    isshowtmo:"",
    isou:"",
    isInOu:"",
    postData:{},
    projPlanDocList: [],
    projName:""
  },
  reducers: {
    save(state,action){
      return { ...state, ...action.payload};
    },
    saveInit(state, {projPlanDocList: DataRows, projName,condCollapse}) {
      return { ...state, projPlanDocList: DataRows, projName,condCollapse}
    },
    saveProjPlanDocList(state, {projPlanDocList: DataRows, }) {
      return { ...state, projPlanDocList: DataRows}
    },
  },
  effects: {
    //项目启动时项目信息页面的查询已上传附件列表
    *searchProjPlanDoc({query},{call,put}){
        let ismgr="";
        let isthisPro="";
        let isshowmgr="";
        let istmo="";
        let isshowtmo="";
        let isou="";
        let isInOu="";
      //1，当登录的员工为mgr并且点击进去的项目为自己的项目时，可以查看到上传和删除
      let param={};
      param['arg_staff_id']= Cookie.get("staff_id");
      param['arg_proj_id']=Cookie.get("projId");
      const data = yield call(projServices.projIsPromise,param);
      console.log("99999999999999999")
      console.log(data)
      console.log(data.is_upload_flag=='1')
      if(data.is_upload_flag=='1'){
            ismgr=true;
      } else if(data.is_upload_flag=='0'){
           ismgr=false;
      }else{
        message.error("查询数据失败原因:" + data.RetVal);
      }
      // //2,当登录的员工为tmo,并且点击的是自己ou内的项目时，可以看到上传和删除
      // let param2={};
      // param2["arg_vr_name"]='项目管理-TMO';
      // const data2 = yield call(projServices.projManagerSearchService,param2);

      // if (data2 == null) {
      //   message.error("微服务返回为空！");
      // } else {
      //   if (data2.RetCode == '1') {
      //     let managers = data2.DataRows;
      //     for (var i = 0; i < data2.DataRows.length; i++) {
      //       if (data2.DataRows[i].staff_id == Cookie.get("staff_id")) {
      //         istmo = true;
      //         //查找tmo点击的项目是否是自己ou范围内的
      //         var postData = {};
      //          postData["transjsonarray"] = '{\"property\": {\"ou\":\"ou\"},' +
      //           '\"condition\":{\"proj_id\":\"' + query["projId"] + '\"}}';
      //         const data3 = yield call(projServices.searchOubumgrId,postData);
      //           if (data3.RetCode == '1'){
      //             let projList = data3.DataRows;
      //             if (typeof(data3.DataRows) != "undefined"){
      //               for (var j = 0; j < data3.DataRows.length; j++) {
      //                 if (data3.DataRows[j].ou == query["projOu"]) {
      //                   isou = true;
      //                   isshowtmo = istmo && isou;
      //                 }
      //               }
      //             }
      //       }else{
      //             message.error("failed");
      //           }
      //     }
      //     }
      //   } else {
      //     message.error(data2.RetVal);
      //   }
      // }
      // if(query["projOu"]==Cookie.get("OU"))
      // {
      //   isInOu=true;
      // }else{
      //   isInOu=false;
      // }
      yield put({
        type: 'save',
        payload:{
          ismgr: ismgr,
          isthisPro:isthisPro,
          isshowmgr:isshowmgr,
          istmo:istmo,
          isshowtmo:isshowtmo,
          isou:isou,
          isInOu:isInOu,
        }
      });
      //获取doc列表
     // console.log(query)
      let params={};
      params["transjsonarray"]='{\"property\": {\"ppd_id\":\"doc_id\",\"ppd_doc_name\":\"doc_name\",\"ppd_doc_byname\":\"doc_byname\",' +
        '\"ppd_doc_url\":\"doc_url\",\"ppd_doc_path\":\"doc_path\",\"ppd_doc_type\":' +
        '\"doc_type\",\"ppd_doc_usrid\":\"doc_usrid\",\"ppd_doc_usrname\":\"doc_usrname\",' +
        '\"ppd_upload_time\":\"upload_time\"},\"condition\":{\"projId\":\"' + query["projId"] + '\",\"ppd_doc_type\":\"'+query["projPlanType"]+'\"},' +
        '\"sequence\":[{\"ppd_upload_time\":\"1\"}]}';

      const {DataRows} = yield call(projServices.getProjPlanOneDocService,params);

      yield put({
        type: 'saveInit',
        projPlanDocList: DataRows,
        projName:query.projName,
        condCollapse:query.condCollapse
      });
    },
    *searchDoc({arg_param}, {call, put}){
      //获取doc列表
     // console.log(arg_param)
      let params={};
      params["transjsonarray"]='{\"property\": {\"ppd_id\":\"doc_id\",\"ppd_doc_name\":\"doc_name\",\"ppd_doc_byname\":\"doc_byname\",' +
        '\"ppd_doc_url\":\"doc_url\",\"ppd_doc_path\":\"doc_path\",\"ppd_doc_type\":' +
        '\"doc_type\",\"ppd_doc_usrid\":\"doc_usrid\",\"ppd_doc_usrname\":\"doc_usrname\",' +
        '\"ppd_upload_time\":\"upload_time\"},\"condition\":{\"projId\":\"' + arg_param["projId"] + '\",\"ppd_doc_type\":\"'+arg_param["projPlanType"]+'\"},' +
        '\"sequence\":[{\"ppd_upload_time\":\"1\"}]}';

      const {DataRows} = yield call(projServices.getProjPlanOneDocService,params);
      yield put({
        type: 'saveProjPlanDocList',
          projPlanDocList: DataRows,
      });
},
    *deleteDoc({arg_param},{call,put}){
        var postData = {};
        postData["transjsonarray"] = '[{\"opt\":\"delete\",\"data\":{\"ppd_id\":\"'+ arg_param["doc_id"] + '\"}}]';
        const data = yield call(projServices.docuDelete,postData);
        if(data.RowCount=="0") {
          message.error("删除文档失败");
        }else{
         message.success("删除文档成功");
          //获取doc列表
          //console.log(arg_param)
          let params={};
          params["transjsonarray"]='{\"property\": {\"ppd_id\":\"doc_id\",\"ppd_doc_name\":\"doc_name\",\"ppd_doc_byname\":\"doc_byname\",' +
            '\"ppd_doc_url\":\"doc_url\",\"ppd_doc_path\":\"doc_path\",\"ppd_doc_type\":' +
            '\"doc_type\",\"ppd_doc_usrid\":\"doc_usrid\",\"ppd_doc_usrname\":\"doc_usrname\",' +
            '\"ppd_upload_time\":\"upload_time\"},\"condition\":{\"projId\":\"' + arg_param["projId"] + '\",\"ppd_doc_type\":\"'+arg_param["projPlanType"]+'\"},' +
            '\"sequence\":[{\"ppd_upload_time\":\"1\"}]}';

          const {DataRows} = yield call(projServices.getProjPlanOneDocService,params);
          yield put({
            type: 'saveProjPlanDocList',
            projPlanDocList: DataRows,
          });
        }
    },
    *setQueryData({query},{put}){

      let data=JSON.parse(query.postData)
      //console.log(data)
      yield put({
        type: 'save',
        payload:{
          postData:data
        }
      });
    },
    *docInsert({query},{call,put}){
      const data = yield call(projServices.projDocSubmitService,query);
      if(data.RetCode=="1")
      {
          message.success("上传成功");
      }else {
        message.error(`${query.file_name} 上传失败.`);
      }
      let params={};
      params["transjsonarray"]='{\"property\": {\"ppd_id\":\"doc_id\",\"ppd_doc_name\":\"doc_name\",\"ppd_doc_byname\":\"doc_byname\",' +
        '\"ppd_doc_url\":\"doc_url\",\"ppd_doc_path\":\"doc_path\",\"ppd_doc_type\":' +
        '\"doc_type\",\"ppd_doc_usrid\":\"doc_usrid\",\"ppd_doc_usrname\":\"doc_usrname\",' +
        '\"ppd_upload_time\":\"upload_time\"},\"condition\":{\"projId\":\"' + query["arg_projId"] + '\",\"ppd_doc_type\":\"'+query["projPlanType"]+'\"},' +
        '\"sequence\":[{\"ppd_upload_time\":\"1\"}]}';

      const {DataRows} = yield call(projServices.getProjPlanOneDocService,params);
      yield put({
        type: 'saveProjPlanDocList',
        projPlanDocList: DataRows,
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname,  query}) => {
        if (pathname === '/projectApp/projPrepare/projPlan/projPlanDocDownload') {
          dispatch({type: 'searchProjPlanDoc', query});
          dispatch({type: 'setQueryData', query});
        }
      });
    },
  },
};
