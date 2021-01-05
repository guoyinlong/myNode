/**
 *  作者: 王福江
 *  创建日期: 2019-10-16
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：实现工资导入功能
 */
//import * as costService from "../../services/cost/costService";
import Cookie from 'js-cookie';

import {message} from "antd";
import * as costService from "../../services/cost/costService";
import * as trainService from "../../services/train/trainService";
const auth_tenantid = Cookie.get('tenantid');
import moment from 'moment'

export default {
  namespace:'importLaborModel',
  state:{
    //工资信息
    importLaborDataList:[],
    //表头信息
    importLaborTitleList:[],
    //部门信息
    deptList:[],
    //ou信息
    ouList:[],
    //查询
    searchLaborDataList:[],
    //个人信息
    detailLaborDataList:[],
    //角色
    roleFlag:false,
  },

  reducers:{
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    //初始化
    *initLaborQuery({query}, {call, put}) { 
      console.log('OOOOOOOOTTT')
      console.log(query)
      console.log('OOOOOOOOTTT')
      yield put({
        type: 'save',
        payload: {
          importLaborDataList: [],
          codeVerify: query.verifyControl,
          rand_code: query.verifyControl
        }
      });
      let paramCode = {}
      
      paramCode["arg_user_id"] = Cookie.get("userid");
      paramCode["arg_module_type"] = 0;
      const sentVerifyCodeResult = yield call(costService.sentVerifyCodeQery, paramCode);
      let sentVerifyCodeResultList = [];
      sentVerifyCodeResultList = sentVerifyCodeResult.DataRows;
      if (sentVerifyCodeResult.RetVal !== '1') {
        message.error(sentVerifyCodeResult.RetVal);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          importLaborDataList: [],
          codeVerify: query.verifyControl,
          rand_code: sentVerifyCodeResultList[0].rand_code,
        }
      });
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const getOuData = yield call(trainService.getOuList, postData_getOU);
      if(getOuData.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            ouList: getOuData.DataRows
          }
        });
      }else{
        message.error('没有查询内容');
      }

      yield put({
        type: 'save',
        payload: {
          deptList: [],
        }
      });
      let queryParam = {
        arg_ou_id : Cookie.get('OUID'),
      };
      const courtDeptData = yield call(trainService.courtDeptQuery,queryParam);
      if(courtDeptData.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            deptList: courtDeptData.DataRows,
          }
        });
      }else{
        message.error('部门查询失败！');
      }
      //查询分院字段表
      let param = {};
      param['arg_ou_id'] = Cookie.get('OUID');
      let ouLaborRet = yield call(costService.costTitleList, param);
      let ouLaborList = [];
      if(ouLaborRet.RetCode === '1'){
        ouLaborList = ouLaborRet.DataRows;
      }
      //设置表头
      let persontitlelist = [
        { title: '序号', dataIndex: 'indexID',fixed: 'left',width: '50'},
        { title: '月份', dataIndex: 'month' ,fixed: 'left',width: '80'},
        { title: '部门', dataIndex: 'dept_name' ,fixed: 'left',width: '100'},
        { title: '员工编号', dataIndex: 'user_id' ,fixed: 'left',width: '100'},
        { title: '员工名称', dataIndex: 'user_name' ,fixed: 'left',width: '100'},
      ];
      let m = 1;
      for (let i=0;i<ouLaborList.length;i++) {
        let val = ouLaborList[i];
        if(!(val.cost_name=='员工编号'||val.cost_name=='员工姓名'||val.cost_name=='部门'||val.cost_name=='月份')){
          let persontitle = {};
          persontitle['title'] = val.cost_cname;
          persontitle['dataIndex'] = val.cost_ename;
          persontitle['key'] = m;
          m++
          persontitlelist.push(persontitle);
        }
      }
      yield put({
        type: 'save',
        payload: {
          importLaborTitleList: persontitlelist,
        }
      });


    },
    
    //查询
    *laborSearch({arg_param}, {call, put}){
      //查询分院字段表
      /*let param = {};
      param['arg_ou_id'] = Cookie.get('OUID');
      let ouLaborRet = yield call(costService.costTitleList, param);
      let ouTitleList = [];
      if(ouLaborRet.RetCode === '1'){
        ouTitleList = ouLaborRet.DataRows;
      }
      let zd_str = '';
      for (let i=0;i<ouTitleList.length;i++){
        if(ouTitleList[i].cost_ename.startsWith('column')){
          if(zd_str!==''){
            zd_str = zd_str + ',' + 'CAST(AES_DECRYPT(' + ouTitleList[i].cost_ename + ',user_id) AS CHAR(100)) as '+ouTitleList[i].cost_ename;
          }else{
            zd_str = 'CAST(AES_DECRYPT(' + ouTitleList[i].cost_ename + ', user_id) AS CHAR(100)) as '+ouTitleList[i].cost_ename;
          }
        }else{
          if(zd_str!==''){
            zd_str = zd_str + ',' + ouTitleList[i].cost_ename ;
          }else{
            zd_str = ouTitleList[i].cost_ename;
          }
        }
      }
      let sql_str = 'select '+ zd_str + ' from cost_labor_import_temp ';
      if(arg_param['arg_dept_id']==''||arg_param['arg_dept_id']==' '||arg_param['arg_dept_id']==null){
        sql_str = sql_str + ' where month = \''+ arg_param['arg_month']+ '\' and dept_id in (select a.deptid from auth_department a where a.parentid = \''+arg_param['arg_ou_id']+'\');';
      }else{
        sql_str = sql_str + ' where month = \''+ arg_param['arg_month']+ '\' and dept_id  = \''+arg_param['arg_dept_id']+'\';';
      }
      console.log("sql_str==="+sql_str);
      arg_param['arg_sql'] = sql_str;*/
	  arg_param['arg_sql'] = '';
      let costRet = yield call(costService.costLaborList, arg_param);
      if(costRet.RetCode === '1'){
        for (let i=0;i<costRet.DataRows.length;i++){
          costRet.DataRows[i]['indexID'] = i+1;
          costRet.DataRows[i]['ID'] = i+1;
        }
        yield put({
          type: 'save',
          payload: {
            importLaborDataList: costRet.DataRows,
          }
        });
      }else{
        message.error(costRet.RetVal);
      }
    },
    //导入劳动合同
    *LaborImport({ laborData }, {call,put}){
      let if_done = true;
      if (laborData.length<=0) {
        message.error("文件没有读取出数据！");
        return;
      }
      //查询分院字段表
      let param = {};
      param['arg_ou_id'] = Cookie.get('OUID');
      let ouLaborRet = yield call(costService.costTitleList, param);
      let ouLaborList = [];
      if(ouLaborRet.RetCode === '1'){
        ouLaborList = ouLaborRet.DataRows;
      }
      //设置表头
      let persontitlelist = [
        { title: '序号', dataIndex: 'indexID',fixed: 'left',width: '50'},
        { title: '月份', dataIndex: 'month' ,fixed: 'left',width: '80'},
        { title: '部门', dataIndex: 'dept_name' ,fixed: 'left',width: '100'},
        { title: '员工编号', dataIndex: 'user_id' ,fixed: 'left',width: '100'},
        { title: '员工名称', dataIndex: 'user_name' ,fixed: 'left',width: '100'},
      ];
      let m = 1;
      for (let i=0;i<ouLaborList.length;i++) {
        let val = ouLaborList[i];
        if(!(val.cost_name=='员工编号'||val.cost_name=='员工姓名'||val.cost_name=='部门'||val.cost_name=='月份')){
          let persontitle = {};
          persontitle['title'] = val.cost_cname;
          persontitle['dataIndex'] = val.cost_ename;
          persontitle['key'] = m;
          m++
          persontitlelist.push(persontitle);
        }
      }
      yield put({
        type: 'save',
        payload: {
          importLaborTitleList: persontitlelist,
        }
      });

      //批量插入数据
      let set_str = '';
      let personlaborlist = [];
      for (let i=0;i<laborData.length;i++){
        let laborparam = laborData[i];
        let personlabor = {};
        for (let j=0;j<ouLaborList.length;j++){
          let title_name = ouLaborList[j].cost_name;
          if(laborparam[title_name]===null||laborparam[title_name]===''||laborparam[title_name]===undefined){
            personlabor[ouLaborList[j].cost_ename] = '';
          }else{
            if(ouLaborList[j].cost_ename==='month'){
              let startdate = moment('1900-01-01','YYYY-MM-DD').add('days', laborparam[title_name]).format('YYYY-MM-DD');
              personlabor[ouLaborList[j].cost_ename] = startdate.substring(0,7);
            }else{
              personlabor[ouLaborList[j].cost_ename] = laborparam[title_name];
            }
          }
        }
        personlabor["ou_id"] = Cookie.get('OUID');
        personlaborlist.push(personlabor);
      }

      for (let i=0;i<ouLaborList.length;i++){
        if(ouLaborList[i].cost_ename.startsWith('column')){
          if(set_str!==''){
            set_str = set_str +','+ ouLaborList[i].cost_ename + ' = AES_ENCRYPT('+ouLaborList[i].cost_ename+',user_id)';
          }else{
            set_str = ouLaborList[i].cost_ename + ' = AES_ENCRYPT('+ouLaborList[i].cost_ename+',user_id)';
          }
        }
      }


      let sql_str = 'update cost_labor_import_temp set ' + set_str + ' where ou_id = \''+Cookie.get('OUID')+'\' and month = \''+personlaborlist[0].month+'\'';
      let deleteparam = {};
      deleteparam['arg_ou_id'] =  Cookie.get('OUID');
      deleteparam['arg_month'] =  personlaborlist[0].month;
      let deleteRet = yield call(costService.deleteLaborList, deleteparam);
      if(deleteRet.RetCode!=1){
        if_done = false;
      }
      let insertparam = {};
      insertparam['transjsonarray'] = JSON.stringify(personlaborlist);
      let insertRet = yield call(costService.insertLaborList, insertparam);
      if(insertRet.RetCode!=1){
        if_done = false;
      }
      //处理插入数据
      let updatepram = {};
      updatepram['arg_ou_id'] = Cookie.get('OUID');
      updatepram['arg_sql'] = sql_str;
      let updateRet = yield call(costService.updateLaborList, updatepram);
      if(updateRet.RetCode!=1){
        if_done = false;
      }
      for (let i=0;i<personlaborlist.length;i++){
        personlaborlist[i]['indexID'] = i+1;
        personlaborlist[i]['ID'] = i+1;
      }
      yield put({
        type: 'save',
        payload: {
          importLaborDataList: personlaborlist,
        }
      });
	  if(if_done===false){
		  message.error('插入异常');
	  }
    },
  },
    *queryVerifyCodeIndex({}, {call, put}) {

    let paramCode = {}
    
    paramCode["arg_user_id"] = Cookie.get("userid");
    paramCode["arg_module_type"] = 0;
    const sentVerifyCodeResult = yield call(costService.sentVerifyCodeQery, paramCode);
    let sentVerifyCodeResultList = [];
    sentVerifyCodeResultList = sentVerifyCodeResult.DataRows;
    if (sentVerifyCodeResult.RetVal !== '1') {
      message.error(sentVerifyCodeResult.RetVal);
      return;
    }
    yield put({
      type: 'save',
      payload: {
        rand_code: sentVerifyCodeResultList[0].rand_code,
      }
    });
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/costlabor/costVerify/costVerifyIndex/importLaborInfo') {
          dispatch({ type: 'queryVerifyCodeIndex',query });
        }
        if (pathname === '/humanApp/costlabor/costVerify/costVerifyIndex/importLaborInfo') {
          dispatch({ type: 'initLaborQuery',query });
        }
      });
    }
  }
};
