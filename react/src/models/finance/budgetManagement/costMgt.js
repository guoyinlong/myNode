/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：科目维护界面的逻辑。
 */
import * as budgeManage from '../../../services/finance/budgetManageCofig';
import cookie from 'js-cookie';
import { message } from 'antd';
export default {
  namespace: 'costMgt',
  state: {
    list:[],//费用科目数据
    DWList:[],//DW科目数据

    feeCostList:[],//费用规则现有数据数据
    fullApertureList:[],//全口径规则现有数据
    dwFee:[],//dw会计科目
    deptList:[],//成本中心
    projList:[],//项目类型

    concentrationFeeList:[],//归口费用   新增费用科目时用到

  },

  reducers: {
    initData(state){
      return {
        ...state,
        list:[],//费用科目数据

        feeCostList:[],//费用规则现有数据数据
        fullApertureList:[],//全口径规则现有数据
        dwFee:[],//dw会计科目
        deptList:[],//成本中心
        projList:[],//项目类型

        concentrationFeeList:[],//归口费用   新增费用科目时用到
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    //规则配置时，点击关闭清空数据
    *clearList({},{put}){
      yield put({
        type:'save',
        payload:{
          feeCostList:[],//费用规则现有数据数据
          fullApertureList:[],//全口径规则现有数据
        }
      })
    },
    *init({}, { call,put }) {
      let postData = {};
      postData["argtenantid"] = cookie.get('tenantid');
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] = '/budget_cost_mgt';
      const moduleIdData = yield call(budgeManage.costUserHasModule,postData);
      if( moduleIdData.RetCode === '1'){
        let formData = {};
        formData["argtenantid"] = cookie.get('tenantid');
        formData["arguserid"] = localStorage.userid;
        formData["argmoduleid"] = moduleIdData.moduleid;
        formData["argvgtype"] = '2';
        let ouList = yield call(budgeManage.costUserGetOU,formData);
        if( ouList.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              ouList : ouList.DataRows,
            }
          });
        }
      }
      yield put({
        type: 'getCostMgtData',
      });
      yield put({
        type: 'returnCost',
      });
      yield put({
        type: 'querySubject',
      });
    },
    //最外层需要的tab1 需要的服务。。。。。。。。。。。。。。。。。。。。。。。。。
    //归口费用查询：新增费用项的时候用到。。
    *returnCost({}, { call, put }){
      let postData = {};
      postData['arg_state_code'] = 1;
      let data = yield call(budgeManage.returnCost,postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            concentrationFeeList: data.DataRows,
          },
        });
      }
    },
    //查询费用用途
    *querySubject({}, { call, put }){
      let postData={
        arg_state_code : '1'
      };
      let data = yield call(budgeManage.querySubject,postData);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            dwFee: data.DataRows,
          },
        });
      }
    },
    //新增费用项
    *addExpenseAccount({addData}, { call, put }){
      let data = yield call(budgeManage.addExpenseAccount,addData);
      if(data.RetCode === '1'){
        message.info('添加成功！');
        yield put({
          type: 'getCostMgtData',
        });
      }
    },
    //编辑费用项
    *editExpenseAccount({editData}, { call, put }){
      let data = yield call(budgeManage.editExpenseAccount,editData);
      if(data.RetCode === '1'){
        yield put({
          type: 'getCostMgtData',
        });
      }
    },
    //删除费用项
    *delExpenseAccount({feeId}, { call, put }){
      let postData={
        arg_fee_id : feeId
      };
      let data = yield call(budgeManage.delExpenseAccount,postData);
      if(data.RetCode === '1'){
        message.info('删除成功！');
        yield put({
          type: 'getCostMgtData',
        });
      }
    },
    //查询费用科目
    *getCostMgtData({}, { call, put }){
      let data = yield call(budgeManage.getCostMgtData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            list: data.DataRows,
          },
        });
      }
    },

    //配置规则的时候用。。。。。。。。。。。。。。。
    //查询项目
    *queryProject({}, { call, put }){
      let postData={
        arg_state_code : '1'
      };
      let data = yield call(budgeManage.queryProject,postData);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            projList: data.DataRows,
          },
        });
      }
    },
    //查询成本中心
    *queryCostCenter({}, { call, put }){
      let postData={
        arg_state_code : '1'
      };
      let data = yield call(budgeManage.queryCostCenter,postData);
      let temp1=JSON.stringify(data.DataRows).replace(/dept_id/g,'value');
      let temp2=temp1.replace(/dept_name/g,'title');
      let deptListData = JSON.parse(temp2);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            deptList: deptListData,
          },
        });
      }
    },

    //查询现有费用规则
    *queryFeeCost({feeId}, { call, put }){
      let postData={
        arg_state_code : '1',
        arg_fee_id : feeId,
      };
      let data = yield call(budgeManage.queryFeeCost,postData);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            feeCostList: data.DataRows,
          },
        });
      }
    },
    //添加费用规则
    *addFeeCost({state,feeId}, { call, put }){
      let deptList = state.cost.join('#');
      let postData={
        arg_fee_id : feeId,
        arg_dw_fee_id : state.subject,
        arg_proj_type_id : state.project,
        arg_dept_id : deptList,
        arg_user_id : cookie.get('userid'),
      };
      let data = yield call(budgeManage.addFeeCost,postData);
      if(data.RetCode === '1'){
        message.info('添加成功！');
        yield put({
          type: 'queryFeeCost',
          feeId,
        });
      }
    },
    //删除费用规则.
    *delFeeCost({state,feeId}, { call, put }){
      let postData={
        arg_fee_id : feeId,
        arg_dw_fee_id : state.dw_fee_id,
        arg_proj_type_id : state.proj_type_id,
      };
      let data = yield call(budgeManage.delFeeCost,postData);
      if(data.RetCode === '1'){
        message.info('删除成功！');
        yield put({
          type: 'queryFeeCost',
          feeId,
        });
      }
    },

    //查询现有全口径规则
    *queryFullAperture({feeId}, { call, put }){
      let postData={
        arg_state_code : '1',
        arg_fee_id : feeId,
      };
      let data = yield call(budgeManage.queryFullAperture,postData);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            fullApertureList: data.DataRows,
          },
        });
      }
    },
    //添加全口径
    *addFullAperture({state,feeId}, { call, put }){
      let anotherDeeId = '';
      for(let i=0;i<state.targetKeys.length-1;i++){
        anotherDeeId = anotherDeeId+state.targetKeys[i].split('-')[1]+'#';
      }
      anotherDeeId = anotherDeeId + state.targetKeys[state.targetKeys.length-1].split('-')[1];
      let postData={
        arg_fee_id : feeId,
        arg_another_fee_id : anotherDeeId,
        arg_user_id : cookie.get('userid'),
      };
      let data = yield call(budgeManage.addFullAperture,postData);
      if(data.RetCode === '1'){
        message.info('添加成功！');
        yield put({
          type: 'queryFullAperture',
          feeId,
        });
      }
    },
    //删除全口径
    *delFullAperture({state,feeId}, { call, put }){
      let postData={
        arg_fee_id : feeId,
        arg_another_fee_id : state.another_fee_id,
      };
      let data = yield call(budgeManage.delFullAperture,postData);
      if(data.RetCode === '1'){
        message.info('删除成功！');
        yield put({
          type: 'queryFullAperture',
          feeId,
        });
      }
    },

    //DW科目维护tab
    //查询dw科目信息   //同样用于配置时的科目查询
    *queryDWList({}, { call, put }){
      let postData={
        arg_state_code : '1'
      };
      let data = yield call(budgeManage.queryDWList,postData);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            DWList: data.DataRows,
          },
        });
      }
    },
    //添加dw科目信息
    *addDWList({addDWList}, { call, put }){
      let postData={
        arg_dw_fee_name : addDWList.accountingSubject,//accountingSubject,subjectDec
        arg_dw_fee_desc : addDWList.subjectDec,//accountingSubject,subjectDec
        arg_state_code : '1',//accountingSubject,subjectDec
        arg_user_id : cookie.get('userid'),//accountingSubject,subjectDec
        arg_dw_fee_code : addDWList.subjectCode,//accountingSubject,subjectDec
      };
      let data = yield call(budgeManage.addDWList,postData);
      if(data.RetCode === '1'){
        message.info('添加成功！');
        yield put({
          type: 'queryDWList',
        });
      }
    },
    //删除dw科目信息
    *delDWList({record}, { call, put }){
      let postData={
        arg_dw_fee_id : record.dw_fee_id
      };
      let data = yield call(budgeManage.delDWList,postData);
      if(data.RetCode === '1'){
        message.info('删除成功！');
        yield put({
          type: 'queryDWList',
        });
      }
    },
    //编辑dw科目信息
    *editDWList({editDWList}, { call, put }){
      let postData={
        arg_dw_fee_id : editDWList.dwFeeId,//accountingSubject,subjectDec
        arg_dw_fee_name : editDWList.accountingSubject,//accountingSubject,subjectDec
        arg_dw_fee_desc : editDWList.subjectDec,//accountingSubject,subjectDec
        arg_state_code : '1',//accountingSubject,subjectDec
        arg_user_id : cookie.get('userid'),//accountingSubject,subjectDec
        arg_dw_fee_code : editDWList.subjectCode,//accountingSubject,subjectDec
      };
      let data = yield call(budgeManage.editDWList,postData);
      if(data.RetCode === '1'){
        message.info('编辑成功!');
        yield put({
          type: 'queryDWList',
        });
      }
    },

    //成本中心维护tab
    //查询
    *queryDeptList({ou}, { call, put }){
      let postData={
        arg_ou_id:ou.split(',')[0],
      };
      let data = yield call(budgeManage.queryDeptList,postData);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            costCenterList: data.DataRows,
          },
        });
      }
    },
    //添加.
    *addDeptList({values,ou}, { call, put }){
      let ou_name = values.arg_ou_name;
      if(values.arg_ou_name === '联通软件研究院本部'){
        ou_name = '联通软件研究院';
      }
      //部门为xxx-xxxx
      let dept_name = ou_name+'-'+values.arg_dept_name;
      //假如输入包含-，并且 -前面 与 ou_name不同，提示不能添加。相同，就用这个值，
      if(values.arg_dept_name.includes('-') && values.arg_dept_name.split('-')[0] !== ou_name){
        if( ou_name ==='联通软件研究院'){message.info('添加失败，部门前缀应为联通软件研究院');return;}
       message.info('添加失败，部门前缀需要和OU保持一致');
       return;
      }
      if(values.arg_dept_name.includes('-') && values.arg_dept_name.split('-')[0] === ou_name){
        dept_name = values.arg_dept_name;
      }
      let postData={
        arg_is_update_rule:values.arg_is_update_rule === true ? '1':'0',
        arg_ou_id:values.arg_ou_id,
        arg_ou_name:values.arg_ou_name,
        arg_dept_name:dept_name,
        arg_dept_code:values.arg_dept_code,
        arg_state_code:values.arg_state_code === true ? '1':'0',
        arg_dept_remark:values.arg_dept_remark,
        arg_dept_index:values.arg_dept_index,
        arg_user_id:cookie.get('userid'),
      };
      let data = yield call(budgeManage.addDeptList,postData);
      if(data.RetCode === '1'){
        message.info('添加成功！');
        yield put({
          type: 'queryDeptList',
          ou,
        });
      }
    },
    //删除
    *delDeptList({record,ou}, { call, put }){
      let postData={
        arg_dept_id : record.dept_id
      };
      let data = yield call(budgeManage.delDeptList,postData);
      if(data.RetCode === '1'){
        message.info('删除成功！');
        yield put({
          type: 'queryDeptList',
          ou,
        });
      }
    },
    //编辑
    *editDeptList({values,ou}, { call, put }){
      let ou_name = values.arg_ou_name;
      if(values.arg_ou_name === '联通软件研究院本部'){
        ou_name = '联通软件研究院';
      }
      //部门为xxx-xxx
      let dept_name = ou_name+'-'+values.arg_dept_name;
      //假如输入包含-，并且 -前面 与 ou_name不同，提示不能添加。相同，就用这个值，
      if(values.arg_dept_name.includes('-') && values.arg_dept_name.split('-')[0] !== ou_name){
        if( ou_name ==='联通软件研究院'){message.info('编辑失败，部门前缀应为联通软件研究院');return;}
        message.info('添加失败，部门前缀需要和OU保持一致');
        return;
      }
      if(values.arg_dept_name.includes('-') && values.arg_dept_name.split('-')[0] === ou_name){
        dept_name = values.arg_dept_name;
      }
      let postData={
        arg_dept_id:values.arg_dept_id,
        arg_dept_name:dept_name,
        arg_dept_code:values.arg_dept_code,
        arg_state_code:values.arg_state_code === true?'1':'0',
        arg_dept_remark:values.arg_dept_remark,
        arg_dept_index:values.arg_dept_index,
        arg_user_id:cookie.get('userid'),
      };
      let data = yield call(budgeManage.editDeptList,postData);
      if(data.RetCode === '1'){
        message.info('编辑成功!');
        yield put({
          type: 'queryDeptList',
          ou,
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/budget_management/budget_cost_mgt') {
          dispatch({type:'initData'});
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
