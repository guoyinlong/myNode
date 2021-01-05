/**
 * 作者：贾茹
 * 日期：2019-9-11
 * 邮箱：m18311475903@163.com
 * 文件说明：院领导名章使用审批页面
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as sealApplyService from '../../../services/sealManage/sealApply.js';

export default {
  namespace: 'sealLeaderJudge',
  state: {
    dataInfo:[], //详情数据
    passData:{},  //待办列表页面跳转传递的数据
    visible:false,//退回原因弹框
    returnReason:'',//退回原因
    deptDisplay:'',//会签部门显示
    isReasonDisplay:'', //涉密原因显隐
    isFileDisplay:'',  //用印文件显隐
    tableUploadFile:[], //附件数据
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
      /*console.log(JSON.parse(query.record))*/
      yield put({
        type:'save',
        payload:{
          passData:JSON.parse(query.record),
          dataInfo:[], //详情数据
          visible:false,//退回原因弹框
          returnReason:'',//退回原因
          deptDisplay:'',//会签部门显示
          isReasonDisplay:'', //涉密原因显隐
          isFileDisplay:'',  //用印文件显隐
          tableUploadFile:[], //附件数据
        }
      });
      yield put({
        type:'taskInfoSearch'
      })
      yield put({
        type:'fileSearch'
      })
    },

    //附件查询
    * fileSearch({}, {select,call, put}){
      const {passData} = yield select(state=>state.sealLeaderJudge);
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

    //详情数据查询
    * taskInfoSearch({}, {select,call, put}){
      const {passData} = yield select(state=>state.sealLeaderJudge);
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
            //设置会签部门显隐
            if(res[i].form_if_sign === '0'){
              yield put({
                type:'save',
                payload:{
                  deptDisplay:'none'
                }
              })
            }
            else{
              yield put({
                type:'save',
                payload:{
                  deptDisplay:'block'
                }
              })
            }
            //设置涉密原因，用印文件显隐
            if(res[i].form_if_secret === '0'){
              yield put({
                type:'save',
                payload:{
                  isReasonDisplay:'none',
                  isFileDisplay:'block'

                }
              })
            }
            else{
              yield put({
                type:'save',
                payload:{
                  isReasonDisplay:'block',
                  isFileDisplay:'none'
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

    //点击出现modal
    * modalDisplay({},{put}){
      yield put({
        type:'save',
        payload:{
          visible:true
        }
      })
    },

    //获取退回原因
    * returnReason({record},{put}){
      /*console.log(record);*/
      yield put({
        type:'save',
        payload:{
          returnReason:record.target.value
        }
      })
    },

    //点击modal中的取消
    * handleModalCancel({},{ put }){
      yield put({
        type:'save',
        payload:{
          visible:false
        }
      })
    },

    //点击modal中的确定
    * handleModalOk({},{ select,put }){
      const {returnReason} = yield select(state=>state.sealLeaderJudge);
      console.log(returnReason);
      if(returnReason ===''){
        message.info('请填写退回原因');

      }else{
        yield put({
          type:'save',
          payload:{
            visible:false
          }
        });
        yield put({
          type:'return'
        })
      }

    },

    //审核退回
    * return({},{call,select,put}){
      const {passData,returnReason} = yield select(state=>state.sealLeaderJudge);
      let recData={
        arg_submit_id :passData.submit_id,//| varchar(32) | 是 | 提交批次id
        arg_create_user_id :Cookie.get('userid'),//申请单创建人id
        arg_create_user_name :Cookie.get('username'),//| VARCHAR(10) | 是 | 创建人姓名  |
        arg_return_reason:returnReason,//| VARCHAR(500)|是| 退回原因|
        arg_form_uuid: passData.form_uuid, //           | char(32)    | 是       | 申请单id
      };
      const response = yield call(sealApplyService.sealLeaderRefuse, recData);
      /* console.log(response);*/
      if(response.RetCode === '1'){
        message.info('审核已退回');
        yield put(routerRedux.push({
          pathname: '/adminApp/sealManage/myJudge'
        }))
      }
    },

    //审核通过
    * approval({},{call,select,put}){
      const {passData} = yield select(state=>state.sealLeaderJudge);
      let recData={
        arg_form_uuid :passData.form_uuid,//| varchar(32) | 是 | 申请单id
        arg_submit_id :passData.submit_id,//| varchar(32) | 是 | 提交批次id
        arg_create_user_id :Cookie.get('userid'),//申请单创建人id
        arg_create_user_name :Cookie.get('username'),//| VARCHAR(10) | 是 | 创建人姓名  |
      };
      const response = yield call(sealApplyService.sealLeaderApproval, recData);
      /* console.log(response);*/
      if(response.RetCode === '1'){
        message.info('审核已通过');
        if(passData.form_next_check_state === "20"){
          yield put(routerRedux.push({
            pathname: '/adminApp/sealManage/myJudge'
          }))
        }else{
          yield put({
            type:'sendMessages'
          })
        }
      }
    },

    //发送钉钉消息
    * sendMessages({},{put,call,select}){
      const {passData} = yield select(state=>state.sealLeaderJudge);
      let recData={
        arg_form_uuid:passData.form_uuid,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
      };
      const response = yield call(sealApplyService.sendMessages, recData);
      if(response.RetCode === '1') {
        message.info('消息发送成功');
        yield put(routerRedux.push({
          pathname: '/adminApp/sealManage/myJudge'
        }))
      }
    },

  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/sealManage/myJudge/sealLeaderJudge') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
