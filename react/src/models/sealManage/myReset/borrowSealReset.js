/**
 * 作者：贾茹
 * 日期：2019-9-16
 * 邮箱：m18311475903@163.com
 * 文件说明：印章外借申请修改
 */

import Cookie from 'js-cookie';
import { message } from "antd";

import { routerRedux } from 'dva/router';
import * as sealApplyService from "../../../services/sealManage/sealApply";
const dateFormatList = ['DD/MM/YYYY HH:mm:ss', 'DD/MM/YY HH:mm:ss'];
export default {
  namespace: 'borrowSealReset',
  state: {
    useReason:'', //用印事由
    use:'',     //用途
    fileNumber:'',     //盖章份数
    fileDay:'',   //复印件的有效期
    startTime:'',  //开始时间
    endTime:'',   //结束时间
    sealList:[],
    sealNameId:{},
    sealID:'',
    isSave:'',//保存按钮是否显示
    searchData:{},
    formCheckState:"",
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
      console.log(JSON.parse(query.record))
      yield put({
        type:'save',
        payload:{
          passData:JSON.parse(query.record),
          useReason:'', //用印事由
          use:'',     //用途
          fileNumber:'',     //盖章份数
          fileDay:'',   //复印件的有效期
          startTime:'',  //开始时间
          endTime:'',   //结束时间
          sealList:[],
          sealNameId:{},
          sealID:'',
          isSave:'',//保存按钮是否显示
          searchData:{},
          formCheckState:""
        }
      })
      yield put({
        type:'taskInfoSearch'
      })
    },


    //详情数据查询
    * taskInfoSearch({}, {select,call, put}){
      const {passData} = yield select(state=>state.borrowSealReset);
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
          let nameId = {};
          for(let i = 0; i <res.length;i++){
            res[i].key = i;
            if(res[i].form_check_state === '0'){
              yield put({
                type:'save',
                payload:{
                  isSave:false
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  isSave:true
                }
              })
            }
            console.log(res[i]);
            nameId.seal_details_id = res[i].seal_details_id;
            nameId.seal_details_name = res[i].seal_details_name;
            yield put({

              type:'save',
              payload:{
                searchData:res[i],
                use:res[i].form_reason,     //用途
                startTime:res[i].form_borrow_date === "" ? "" : res[i].form_borrow_date.slice(0, -2),  //开始时间
                endTime:res[i].form_return_date === "" ? "" :res[i].form_return_date.slice(0, -2),   //结束时间
                sealID:res[i].form_uuid,
                sealNameId:nameId,    //默认的印章名称
                screateDate:res[i].screate_date
              }
            })
          }
          /*console.log(res);*/

        }


      }
      yield put({
        type:'sealListSearch'
      })
    },

    //印章类型下拉框查询
    * sealListSearch({},{call,put}){
      let recData={
        arg_seal_ouid:Cookie.get('OUID'),// | varchar(32) | 是 | 印章ouid
        arg_seal_mark:'0',// | char(1) | 是 | 印章唯一标识符（印章：0，领导名章：1，营业执照：2，领导身份证复印件：3，刻章：4）
      }
      const response = yield call(sealApplyService.sealList, recData);
      if(response.RetCode === '1'){
        let res = response.DataRows;
        for(let i = 0 ;i < res.length; i ++ ){
          res[i].key = i;
        }
        yield put({
          type:'save',
          payload:{
            sealList:res
          }
        })
      }
    },

    //保存选中印章的类型id
    * getSealTypeId({record},{put}){
      /* console.log(record.target.value)*/
      yield put({
        type:'save',
        payload:{
          sealNameId:JSON.parse(record),
        }
      })
    },

    //复印件的用途及时间中的实际使用人的单位或名字
    * userDept({record},{put}){
      /* console.log(record.target.value)*/
      yield put({
        type:'save',
        payload:{
          userDept:record.target.value,
        }
      })
    },

    //复印件的用途
    * use({record},{put}){
      /* console.log(record.target.value)*/
      yield put({
        type:'save',
        payload:{
          use:record.target.value,
        }
      })
    },

    //复印件的份数
    * getFileNumber({record},{put}){
      /* console.log(record.target.value)*/
      yield put({
        type:'save',
        payload:{
          fileNumber:record.target.value,
        }
      })
    },

    //复印件的有效期
    * getFileDay({record},{put}){
      /* console.log(record.target.value)*/
      yield put({
        type:'save',
        payload:{
          fileNumber:record.target.value,
        }
      })
    },

    //暂存开始时间
    * getStartTime({record},{put}){
      yield put({
        type:'save',
        payload:{
          startTime:record
        }
      })
    },

    //暂存开始时间
    * getEndTime({record},{put}){
      yield put({
        type:'save',
        payload:{
          endTime:record
        }
      })
    },

    //点击保存
    * sealSave({},{select,call,put}){
      const { use, startTime,searchData ,endTime, sealID, sealNameId} = yield select(state=>state.borrowSealReset);
      const end = new Date(Date.parse(endTime .replace('/-/g','/'))).getTime();  // 当前时间的时间戳 当期时间2018-09-30
      const str = new Date(Date.parse(startTime .replace('/-/g','/'))).getTime();
      const now = new Date().getTime();
      if(end < str){
        message.info('归还时间不可早于借用时间，请重新选择')
      }else if(str < now){
        message.info('请选择正确的借用时间，不可早于当前时间');
      }else {
        let recData = {
          form_title: '印章外借申请填报',//  varchar(32)  是  申请单标题
          form_uuid: sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
          form_type: '1',//       varchar(2)    是        申请单类型 0:使用 1:外借 2:刻章
          form_check_state: searchData.form_check_state,//  char(2)  是  申请单当前状态
          seal_details_id: sealNameId.seal_details_id,//char(32)      否  印章证照id（借用类必传）
          form_dept_id: Cookie.get('dept_id'),//     char(32)      是        申请部门id
          form_reason: use,//      varchar(200)  是        借用事由或刻章事由
          form_borrow_date: startTime,//  timestamp     否        借用时间（借用类必传）
          form_return_date: endTime,// timestamp     否        归还时间（借用类必传）
          form_name: '',//        varchar(45)   否        刻章名称（刻章类必传）
          form_seal_demand: '',//  char(32)      否        刻章规格及要求（刻章类必传）
          form_if_sign: '',//     char(1)       否        是否需要相关部门会签（0：否，1：是）（刻章类必传）
          sign_dept_ids: '',//    varchar(500)  否        会签部门id（刻章类必传）
          create_user_id: Cookie.get('userid'),//   char(7)       是        用户id
          create_user_name: Cookie.get('username'),//  varchar(10)   是        用户姓名
        };
        const response = yield call(sealApplyService.sealSave, recData);
        if (response.RetCode === '1') {
          message.info('保存成功');
          yield put({
            type: 'save',
            payload: {
              sealID: response.return_data
            }
          })
          /*yield put(routerRedux.push({
            pathname: '/adminApp/sealManage/sealIndexApply'
          }))*/
        }
      }
    },

    //点击提交
    * sealSubmit({},{select,call,put}){
      const { searchData,use, startTime, endTime, sealID, sealNameId} = yield select(state=>state.borrowSealReset);
      //console.log(sealNameId)
      const end = new Date(Date.parse(endTime .replace('/-/g','/'))).getTime();  // 当前时间的时间戳 当期时间2018-09-30
      const str = new Date(Date.parse(startTime .replace('/-/g','/'))).getTime();
      const now = new Date().getTime();
      //console.log(startTime );
      //console.log(end );
      //console.log(str );
      if( use==="" || startTime === "" || endTime === "" || sealNameId === {}){
        message.info('有必填项没填')
      }else if(end < str){
        message.info('归还时间不可早于借用时间，请重新选择')
      }else if(str < now){
        message.info('请选择正确的借用时间，不可早于当前时间');
      }else {
        let recData = {
          form_title: '印章外借申请填报',//  varchar(32)  是  申请单标题
          form_uuid: sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
          form_type: '1',//       varchar(2)    是        申请单类型 0:使用 1:外借 2:刻章
          form_check_state: searchData.form_check_state,//  char(2)  是  申请单当前状态
          seal_details_id: sealNameId.seal_details_id,//char(32)      否  印章证照id（借用类必传）
          form_dept_id: Cookie.get('dept_id'),//     char(32)      是        申请部门id
          form_reason: use,//      varchar(200)  是        借用事由或刻章事由
          form_borrow_date: startTime,//  timestamp     否        借用时间（借用类必传）
          form_return_date: endTime,// timestamp     否        归还时间（借用类必传）
          form_name: '',//        varchar(45)   否        刻章名称（刻章类必传）
          form_seal_demand: '',//  char(32)      否        刻章规格及要求（刻章类必传）
          form_if_sign: '',//     char(1)       否        是否需要相关部门会签（0：否，1：是）（刻章类必传）
          sign_dept_ids: '',//    varchar(500)  否        会签部门id（刻章类必传）
          create_user_id: Cookie.get('userid'),//   char(7)       是        用户id
          create_user_name: Cookie.get('username'),//  varchar(10)   是        用户姓名

        };
        const response = yield call(sealApplyService.sealSubmit, recData);
        if (response.RetCode === '1') {
          message.info('提交成功');
          yield put({
            type: 'save',
            payload: {
              sealID: response.return_data,
            }
          })
          yield put({
            type:'sendMessages'
          })

        }
      }
    },

    //发送钉钉消息
    * sendMessages({},{put,call,select}){
      const { sealID } = yield select(state=>state.borrowSealReset);
      let recData={
        arg_form_uuid:sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
      };
      const response = yield call(sealApplyService.sendMessages, recData);
      if(response.RetCode === '1') {
        message.info('消息发送成功');
        window.history.go(-1);
      }
    },

    //点击取消
    * sealCancel({},{put}){
      window.history.go(-1);
    },





  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/sealManage/sealPersonalQuery/borrowSealReset') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
