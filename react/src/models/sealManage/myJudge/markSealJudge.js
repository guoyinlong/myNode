/**
 * 作者：贾茹
 * 日期：2019-9-11
 * 邮箱：m18311475903@163.com
 * 文件说明：刻章审批页面
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as sealApplyService from '../../../services/sealManage/sealApply.js';

export default {
  namespace: 'markSealJudge',
  state: {
    dataInfo:[], //详情数据
    passData:{},  //待办列表页面跳转传递的数据
    visible:false,//退回原因弹框
    returnReason:'',//退回原因
    deptDisplay:'',//会签部门显示
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
        }
      });
      yield put({
        type:'taskInfoSearch'
      })

    },

    //详情数据查询
    * taskInfoSearch({}, {select,call, put}){
      const {passData} = yield select(state=>state.markSealJudge);
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
            if(res[i].form_if_sign === '0'){
              yield put({
                type:'save',
                payload:{
                  deptDisplay:'none'
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  deptDisplay:'block'
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
      const {returnReason} = yield select(state=>state.markSealJudge);
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
      const {dataInfo,passData,returnReason} = yield select(state=>state.markSealJudge);
      let recData={
        form_title:passData.form_title,
        form_name:dataInfo.form_name,// | varchar(45) | 否 | 刻章名字 |
        form_uuid: passData.form_uuid, //           | char(32)    | 是       | 申请单id                                           |
        submit_id :passData.submit_id,//| char(32) | 是 | 提交批次id |
        batch_id: passData.batch_id,//| char(32) | 是 | 环节id |
        seal_details_id:passData.seal_details_id,// | varchar(32) | 是 | 印章证照id |
        form_type:passData.form_type,//            | varchar(2)  | 是       | 申请单类型 0:使用 1:外借 2:刻章                    |
        form_reason:passData.form_reason,// | varchar(200) | 是 | 用印事由或刻章事由 |
        form_if_sign:dataInfo.form_if_sign,// | char(1) | 是 | 是否需要相关部门会签（0：否，1：是） |
        form_dept_id:dataInfo.form_dept_id,// | char(32) | 是 | 申请或借用部门 |
        form_seal_demand:dataInfo.form_seal_demand,// | varchar(500) | 是 | 刻章规格及要求 |
        form_borrow_date:"",// | timestamp | 是 | 借用时间 |
        form_return_date:"",// | timestamp | 是 | 归还时间 |
        form_check_state :dataInfo.form_check_state,//     | char(1)     | 是       | 申请单当前状态                                     |
        ouid:Cookie.get('OUID'),// | varchar(32) | 是 | 院ouid |
        approval_user_id: Cookie.get('userid'),    //| char(7)     | 是       | 审批用户id                                         |
        approval_user_name :Cookie.get('username'),  // | varchar(10) | 是       | 审批用户姓名                                       |
        update_user_id :dataInfo.update_user_id,//       | char(7)     | 是       | 更新用户id（用于会签同意后转入后续审核流程）       |
        update_user_name:dataInfo.update_user_name,
        create_user_id :dataInfo.screate_user_id,//       | char(7)     | 是       | 申请人id       |
        create_user_name:dataInfo.screate_user_name,//      | varchar(10) | 是       | 申请人姓名
        form_check_reject_reason:returnReason,
        if_leader_seal:0, //| char(1) | 是 | 是否是领导名章审核，0：否，1：是 |
      };
      const response = yield call(sealApplyService.borrowReturn, recData);
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
      const {dataInfo,passData} = yield select(state=>state.markSealJudge);
      let recData={
        form_title:passData.form_title,
        form_name:dataInfo.form_name,// | varchar(45) | 否 | 刻章名字 |
        form_uuid: passData.form_uuid, //           | char(32)    | 是       | 申请单id                                           |
        submit_id :passData.submit_id,//| char(32) | 是 | 提交批次id |
        batch_id: passData.batch_id,//| char(32) | 是 | 环节id |
        seal_details_id:passData.seal_details_id,// | varchar(32) | 是 | 印章证照id |
        form_type:passData.form_type,//            | varchar(2)  | 是       | 申请单类型 0:使用 1:外借 2:刻章                    |
        form_reason:passData.form_reason,// | varchar(200) | 是 | 用印事由或刻章事由 |
        form_if_sign:dataInfo.form_if_sign,// | char(1) | 是 | 是否需要相关部门会签（0：否，1：是） |
        form_dept_id:dataInfo.form_dept_id,// | char(32) | 是 | 申请或借用部门 |
        form_seal_demand:dataInfo.form_seal_demand,// | varchar(500) | 是 | 刻章规格及要求 |
        form_borrow_date:"",// | timestamp | 是 | 借用时间 |
        form_return_date:"",// | timestamp | 是 | 归还时间 |
        form_check_state :dataInfo.form_check_state,//     | char(1)     | 是       | 申请单当前状态                                     |
        ouid:Cookie.get('OUID'),// | varchar(32) | 是 | 院ouid |
        approval_user_id: Cookie.get('userid'),    //| char(7)     | 是       | 审批用户id                                         |
        approval_user_name :Cookie.get('username'),  // | varchar(10) | 是       | 审批用户姓名                                       |
        update_user_id :dataInfo.update_user_id,//       | char(7)     | 是       | 更新用户id（用于会签同意后转入后续审核流程）       |
        update_user_name:dataInfo.update_user_name,
        if_leader_seal:0, //| char(1) | 是 | 是否是领导名章审核，0：否，1：是 |
      };
      const response = yield call(sealApplyService.borrowApproval, recData);
      /* console.log(response);*/
      if(response.RetCode === '1'){
        message.info('审核已通过');
        if(dataInfo.form_next_check_state === "20"){
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
      const {passData} = yield select(state=>state.markSealJudge);
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
        if (pathname === '/adminApp/sealManage/myJudge/markSealJudge') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
