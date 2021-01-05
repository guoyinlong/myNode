/**
 * 作者：贾茹
 * 日期：2019-9-17
 * 邮箱：m18311475903@163.com
 * 文件说明：刻章申请修改
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as sealApplyService from "../../../services/sealManage/sealApply";

export default {
  namespace: 'markSealReset',
  state: {
    sealName:'', //刻章名字
    markReason:'',     //用途
    sealSize:'',//印章的规格及要求
    isRelativeDept:'', //是否需要相关部门会签
    relativeDeptModal:false, //会签部门弹出框
    /*relativeDeptName:[],   //会签部门名字*/
    deptInputs:[],
    deptId:[],
    Dept:[],
    deptDisplay:'none', //会签部门显示
    deptModal:false,      //弹出删除会签部门的弹出框
    sealID:'',
    isSave:'', //保存按钮是否显示
    searchData:{},
    sealList:{},
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
      //console.log(JSON.parse(query.record))
      yield put({
        type:'save',
        payload:{
          passData:JSON.parse(query.record),
          sealName:'', //刻章名字
          markReason:'',     //用途
          sealSize:'',//印章的规格及要求
          isRelativeDept:'', //是否需要相关部门会签
          relativeDeptModal:false, //会签部门弹出框
          /*relativeDeptName:[],   //会签部门名字*/
          deptInputs:[],
          deptId:[],
          Dept:[],
          deptDisplay:'none', //会签部门显示
          deptModal:false,      //弹出删除会签部门的弹出框
          sealID:'',
          isSave:'', //保存按钮是否显示
          searchData:{},
          sealList:{}
        }
      })
      yield put({
        type:'taskInfoSearch'
      })
    },


    //详情数据查询
    * taskInfoSearch({}, {select,call, put}){
      const {passData} = yield select(state=>state.markSealReset);
      let recData={
        arg_submit_id:passData.submit_id,// |	VARCHAR(32)| 是 | 提交批次id
        arg_form_uuid :passData.form_uuid,//| VARCHAR(32)| 是 | 申请单id
        arg_list_state :passData.list_state,//| VARCHAR(2) | 是 | 详情状态描述（0待办，1,2已办，3办结）
        arg_batch_id :passData.batch_id,//| VARCHAR(32) | 是 | 环节id
      };
      const response = yield call(sealApplyService.applyDetail, recData);
       //console.log(response);
      if(response.RetCode === '1'){
        if(response.DataRows){
          const res = response.DataRows;
          for(let i = 0; i <res.length;i++){
            res[i].key = i;
            //console.log(res[i]);
            if(res[i].form_check_state === '0'){
              yield put({
                type:'save',
                payload:{
                  isSave:false,
                  deptInputs:[],
                  deptId:[],
                  Dept:[],
                }
              })
            }
            else{
              yield put({
                type:'save',
                payload:{
                  isSave:true,

                }
              })
            }
            //判断会签部门显示
            if(res[i].form_if_sign === "1"){
              if(res[i].other_deptid !==""){
                yield put({
                  type:'save',
                  payload:{
                    deptInputs:res[i].dept_name.split(','),
                    deptId:res[i].other_deptid.split(','),
                    Dept:res[i].dept_name.split(','),
                  }
                })
              }
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
                searchData:res[i],
                sealName:res[i].form_name, //刻章名字
                markReason:res[i].form_reason,     //用途
                sealSize:res[i].form_seal_demand,//印章的规格及要求
                isRelativeDept:Number(res[i].form_if_sign), //是否需要相关部门会签
                sealID:res[i].form_uuid,
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
        arg_seal_ouid:Cookie.get('OUID'),// | varchar(32) | 是 | 登录人ouid
        arg_seal_mark:'4',// | char(1) | 是 | 印章唯一标识符（印章：0，领导名章：1，营业执照：2，领导身份证复印件：3，刻章：4）
      }
      const response = yield call(sealApplyService.sealList, recData);
      if(response.RetCode === '1'){
        let res = response.DataRows;
        for(let i = 0 ;i < res.length; i ++ ){
          res[i].key = i;
          yield put({
            type:'save',
            payload:{
              sealList:res[i]
            }
          })
        }

      }
    },
    //刻制印章的名字
    * getSealName({record},{put}){
      /* console.log(record.target.value)*/
      if(record.target.value.length>200){
        message.info('字数限制200字，请重新输入')
      }else {
        yield put({
          type: 'save',
          payload: {
            sealName: record.target.value,
          }
        })
      }
    },

    //刻章的原因
    * getMarkReason({record},{put}){
      /* console.log(record.target.value)*/
      yield put({
        type:'save',
        payload:{
          markReason:record.target.value,
        }
      })
    },

    //刻制印章的规格大小
    * getSealSize({record},{put}){
      /* console.log(record.target.value)*/
      if(record.target.value.length>200){
        message.info('字数限制200字，请重新输入')
      }else {
        yield put({
          type: 'save',
          payload: {
            sealSize: record.target.value,
          }
        })
      }
    },

    //相关会签部门弹出框打开
    * handleRelativeDeptModal({},{put}){
      yield put({
        type:'save',
        payload:{
          relativeDeptModal:true
        }
      })
    },

    //是否需要相关部门会签
    * isRelativeDept({record},{select,put}){
      /*console.log(record);*/
      const { deptInputs} = yield select(state => state.markSealReset);
      if(record.target.value===0){
        if(deptInputs.length!==0){
          yield put({
            type:'save',
            payload:{
              deptModal:true,
            }
          })
        }else{
          yield put({
            type:'save',
            payload:{
              deptDisplay:'none', //会签部门隐藏
              isRelativeDept:record.target.value
            }
          })
        }
      }else{
        yield put({
          type:'save',
          payload:{
            deptDisplay:'block', //会签部门显示
            isRelativeDept:record.target.value
          }
        })
      }
      yield put({
        type:'save',
        payload:{
          isRelativeDeptNow:record.target.value  //暂存所选value
        }
      })
    },

    //选择会签部门后修改是否需要会签部门选项弹出框点击取消
    * deptIsCancel({}, {put}) {
      yield put({
        type: 'save',
        payload: {
          deptModal:false
        }
      })

    },

    //选择会签部门后修改是否需要会签部门选项弹出框点击确定
    * deptIsOk({}, {select,put}) {
      const { isRelativeDeptNow } = yield select(state => state.markSealReset);
      yield put({
        type: 'save',
        payload: {
          deptModal:false,
          isRelativeDept:isRelativeDeptNow,
          deptInputs:[],
          deptId:[],
          Dept:[],
          deptDisplay:'none', //会签部门隐藏
        }
      })

    },

    //相关会签部门弹出框点击取消
    * handleRelativeDeptCancel ({},{put}){
      yield put({
        type:'save',
        payload:{
          relativeDeptModal:false
        }
      })
    },

    //相关部门选中
    * onDeptChecked({value},{call,select,put}){
      const { deptInputs,deptId } = yield select(state => state.markSealReset);
      /* console.log(value);*/
      if(value.target.checked===true){
        deptInputs.push(value.target.deptName);
        deptId.push(value.target.value);
        yield put({
          type:'save',
          payload:{
            deptInputs: [...deptInputs],
            deptId:[...deptId]
          }
        });
      }else{
        let dept = deptInputs.filter(i=>i!==value.target.deptName);
        let deptid = deptId.filter(i=>i !== value.target.value);
        yield put({
          type:'save',
          payload:{
            deptInputs: [...dept],
            deptId:[...deptid]
          }
        });
      }
    },

    //申请单位点击确定按钮存入
    * handleRelativeDeptOk({value},{call,select,put}){
      const { deptInputs } = yield select(state => state.markSealReset);
         console.log(deptInputs.length);
      const deptFalse=JSON.parse(JSON.stringify(deptInputs));
      /* console.log(deptFalse);*/
      yield put({
        type:'save',
        payload:{
          Dept: deptFalse,
          relativeDeptModal: false,
        }
      });

    },

    //点击保存
    * sealSave({},{select,call,put}){
      const { searchData,markReason, sealName, sealSize, sealID, isRelativeDept,deptId,sealList} = yield select(state=>state.markSealReset);
      let recData={
        form_title:'刻章申请填报',//  varchar(32)  是  申请单标题
        form_uuid:sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
        form_type:'2' ,//       varchar(2)    是        申请单类型 0:使用 1:外借 2:刻章
        form_check_state:searchData.form_check_state,//  char(2)  是  申请单当前状态
        seal_details_id:sealList.seal_details_id,//char(32)      否  印章证照id（借用类必传）
        form_dept_id :Cookie.get('dept_id'),//     char(32)      是        申请部门id
        form_reason :markReason,//      varchar(200)  是        借用事由或刻章事由
        form_borrow_date:'',//  timestamp     否        借用时间（借用类必传）
        form_return_date:'',// timestamp     否        归还时间（借用类必传）
        form_name:sealName,//        varchar(45)   否        刻章名称（刻章类必传）
        form_seal_demand:sealSize,//  char(32)      否        刻章规格及要求（刻章类必传）
        form_if_sign :isRelativeDept,//     char(1)       否        是否需要相关部门会签（0：否，1：是）（刻章类必传）
        sign_dept_ids:deptId.toString(),//    varchar(500)  否        会签部门id（刻章类必传）
        create_user_id :Cookie.get('userid'),//   char(7)       是        用户id
        create_user_name:Cookie.get('username'),//  varchar(10)   是        用户姓名
      };
      const response = yield call(sealApplyService.sealSave, recData);
      if(response.RetCode === '1'){
        message.info('保存成功');
        yield put({
          type:'save',
          payload:{
            sealID:response.return_data
          }
        })
        /*yield put(routerRedux.push({
          pathname: '/adminApp/sealManage/sealIndexApply'
        }))*/
      }
    },

    //点击提交
    * sealSubmit({},{select,call,put}){
      const { searchData,markReason, sealName, sealSize, sealID, isRelativeDept,deptId,sealList } = yield select(state=>state.markSealReset);
      if( sealSize==="" || sealName === "" || markReason === "" || isRelativeDept === "" ){
        message.info('有必填项没填')
      }else if(isRelativeDept === 1 && deptId === []){
        message.info('有必填项没填')
      } else {
        let recData = {
          form_title: '刻章申请填报',//  varchar(32)  是  申请单标题
          form_uuid: sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
          form_type: '2',//       varchar(2)    是        申请单类型 0:使用 1:外借 2:刻章
          form_check_state: searchData.form_check_state,//  char(2)  是  申请单当前状态
          seal_details_id: sealList.seal_details_id,//char(32)      否  印章证照id（借用类必传）
          form_dept_id: Cookie.get('dept_id'),//     char(32)      是        申请部门id
          form_reason: markReason,//      varchar(200)  是        借用事由或刻章事由
          form_borrow_date: '',//  timestamp     否        借用时间（借用类必传）
          form_return_date: '',// timestamp     否        归还时间（借用类必传）
          form_name: sealName,//        varchar(45)   否        刻章名称（刻章类必传）
          form_seal_demand: sealSize,//  char(32)      否        刻章规格及要求（刻章类必传）
          form_if_sign: isRelativeDept,//     char(1)       否        是否需要相关部门会签（0：否，1：是）（刻章类必传）
          sign_dept_ids: deptId.toString(),//    varchar(500)  否        会签部门id（刻章类必传）
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
      const { sealID } = yield select(state=>state.markSealReset);
      let recData={
        arg_form_uuid:sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
      };
      const response = yield call(sealApplyService.sendMessages, recData);
      if(response.RetCode === '1') {
        message.info('消息发送成功');
        window.history.go(-1);
      }
    },

  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/sealManage/sealPersonalQuery/markSealReset') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
