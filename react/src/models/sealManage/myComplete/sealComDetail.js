/*
* 作者：贾茹
* 日期：2019-9-16
* 邮箱：m18311475903@163.com
* 文件说明：印章使用审批详情页面
*/

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as sealApplyService from '../../../services/sealManage/sealApply.js';

export default {
  namespace: 'sealComDetail',
  state: {
    dataInfo:[], //详情数据
    passData:{},  //待办列表页面跳转传递的数据
    judgeTableSource:[],      //审批环节table数据
    tableUploadFile:[],       //上传文件查询
    isReasonDisplay:'',   //涉密原因设置显隐
    isFileDisplay:'',   //用印材料设置显隐
    deptDisplay:'',  //会签部门显隐
    isDown:'',  //下載申請單按鈕是否置灰
    screateDate:""
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({query}, {call, put}) {
      console.log(JSON.parse(query.record));
      yield put({
        type:'save',
        payload:{
          passData:JSON.parse(query.record)
        }
      })
      yield put({
        type:'taskInfoSearch'
      })
      yield put({
        type:'judgeHistory'
      })
      yield put({
        type:'fileSearch'
      })
    },

    //详情数据查询
    * taskInfoSearch({}, {select,call, put}){
      const {passData} = yield select(state=>state.sealComDetail);
      let recData={
        arg_submit_id:passData.submit_id,// |	VARCHAR(32)| 是 | 提交批次id
        arg_form_uuid :passData.form_uuid,//| VARCHAR(32)| 是 | 申请单id
        arg_list_state :passData.list_state,//| VARCHAR(2) | 是 | 详情状态描述（0待办，1,2已办，3办结）
        arg_batch_id :passData.batch_id,//| VARCHAR(32) | 是 | 环节id
      };
      const response = yield call(sealApplyService.applyDetail, recData);
      /* console.log(response);*/
      if(response.RetCode === '1'){
        if(response.DataRows){
          const res = response.DataRows;
          for(let i = 0; i <res.length;i++){
            res[i].key = i;
            //判断用印文件和涉密原因的显隐
            if(res[i].form_if_secret==='0'){
              yield put({
                type:'save',
                payload:{
                  isFileDisplay:'block',
                  isReasonDisplay:'none',
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  isFileDisplay:'none',
                  isReasonDisplay:'block',
                }
              })
            }

            //设置会签部门显隐
            if(res[i].form_if_sign==='0'){
              yield put({
                type:'save',
                payload:{
                  deptDisplay:'none',
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  deptDisplay:'block',
                }
              })
            }
            //设置下载申请单按钮是否置灰
            if(res[i].form_check_state > 21 ||res[i].form_check_state === '21'){
              yield put({
                type:'save',
                payload:{
                  isDown:false
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  isDown:true
                }
              })
            }
            yield put({
              type:'save',
              payload:{
                dataInfo:res[i],
                screateDate:res[i].screate_date
              }
            })
          }
          /*console.log(res);*/

        }


      }

    },

    //审批环节调取服务
    * judgeHistory({}, { call, put, select }){

      const { passData } = yield select(state=>state.sealComDetail);
      /* console.log(passData);*/
      const recData={
        arg_form_uuid:passData.form_uuid,// | VARCHAR(32)| 是 |申请单id
      };
      const response = yield call(sealApplyService.judgeHistory,recData);
      if(response.RetCode==='1'){
        if(response.DataRows){
          const res = response.DataRows;
          for(let i = 0;i<res.length;i++){
            res[i].key=i;
          }
          yield put({
            type:'save',
            payload:{
              judgeTableSource:res
            },
          });
        }

        /* console.log(res);*/
      };

    },

    //附件查询
    * fileSearch({}, {select,call, put}){
      const {passData} = yield select(state=>state.sealComDetail);
      let recData={
        arg_form_uuid :passData.form_uuid,//| VARCHAR(32)| 是 | 申请单id
        arg_submit_id:passData.submit_id,
      };
      const response = yield call(sealApplyService.fileSearch, recData);
      if(response.RetCode === '1') {
        if (response.DataRows) {
          let res = response.DataRows;
          yield put({
            type:'save',
            payload:{
              tableUploadFile:res
            }
          })
        }
      }
    },

    //点击下载议题申请单
    * downPage({}, {select}) {
      /*console.log(detailLine);*/
      const {passData} = yield select(state => state.sealComDetail);
      window.open("/microservice/allmanagementofseal/sealOfUse/UseSealWord?arg_form_uuid=" + passData.form_uuid);
    },

    //返回上一级
    * return ({}, {select,put}){
      const {passData} = yield select(state => state.sealComDetail);
      //searchType:'1'  :    /adminApp/sealManage/managerSealQuery
      // searchType:'2'  :    /adminApp/sealManage/sealPersonalQuery
      if (passData.searchType){
        if(passData.searchType === "1"){
          yield put(routerRedux.push({
            pathname: '/adminApp/sealManage/managerSealQuery',
            query: {
              state:JSON.stringify(passData)
            }

          }))
        }else if (passData.searchType === "2"){
          yield put(routerRedux.push({
            pathname: '/adminApp/sealManage/sealPersonalQuery',
            query: {
              state:JSON.stringify(passData)
            }
          }))
        }
      }else{
        yield put(routerRedux.push({
          pathname: '/adminApp/sealManage/myJudge'
        }))
      }
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/sealManage/myJudge/sealComDetail'||pathname === '/adminApp/sealManage/sealPersonalQuery/sealComDetail'||pathname === '/adminApp/sealManage/managerSealQuery/sealComDetail') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
