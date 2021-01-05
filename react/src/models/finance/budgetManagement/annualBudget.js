/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：年度预算
 */
import * as budgeManage from '../../../services/finance/budgeManageZ';
import Cookie from 'js-cookie';
import {message} from 'antd';

function MergeCells (list,mergeCell,key){
  let rowSpanNum = 1;
  let rowSpanArray = [];
  for(let i=1;i<list.length;i++){
    if(list[i][mergeCell] !== list[i-1][mergeCell]||list[i-1].sub_total === '合计'){
      rowSpanArray.push(rowSpanNum);
      rowSpanNum = 1;
      if(i===list.length-1){
        rowSpanArray.push(1);
      }
    }else{
      rowSpanNum++;
      if(i===list.length-1 && list[i][mergeCell] === list[i-1][mergeCell]){
        rowSpanArray.push(rowSpanNum);
      }
    }
  }
  //部门合计不加rowSpan，重复的加rowSpan=0，不重复的（第一个）加rowSpan=null。
  for(let i=1;i<list.length;i++){
    list[0][key] = null;
    if(list[i][mergeCell] === list[i-1][mergeCell]&&list[i-1].sub_total !== '合计'){
      list[i][key] = 0;
    }else{
      list[i][key] = null;
    }
  }
  let j=0;
  for(let i=0;i<list.length;i++){
    if(list[i][key] === null){
      list[i][key] = rowSpanArray[j];
      j++;
    }
  }
}
function MergeCol(list) {
  for(let i=0;i<list.length;i++){
    if (list[i].fee_name===list[i].fee_use_name&&list[i].fee_name===list[i].concentration_name){
      list[i].col1 = 3;
      list[i].col2 = 0;
      list[i].col3 = 0;
    }else if (list[i].concentration_name===list[i].fee_name){
      list[i].col1 = 1;
      list[i].col2 = 2;
      list[i].col3 = 0;
    }
  }
}
function FeeCollection(feeClass,dataRows) {
  let flag = false;
  let feeName = '';
  for (let item in dataRows[0]){
    feeName = item;
  }
  for (let i=0;i<dataRows.length;i++){
    if (feeClass === dataRows[i][feeName]){
      flag = true;
    }
  }
  return flag;
}
export default {
  namespace: 'annualBudget',
  state: {
    ouList:[],
    deptList:[],
    checkList:[],
    dateInfo:new Date().getFullYear().toString(),
    ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
    deptInfo:'全部',
    annualBudgetData:[],
    rawBackup : [],
    listT : [],
    titleList:[],
    deptName:[{
      dept_id:Cookie.get('dept_id'),
      dept_name:Cookie.get('dept_name'),
    }],
    tenantid:Cookie.get('tenantid'),
    userid:Cookie.get('userid'),
    roleFlag:true,
    role:false,
  },

  reducers: {
    initData(state){
      return {
        ...state,
        ouList:[],
        deptList:[],
        checkList:[],
        dateInfo:new Date().getFullYear().toString(),
        ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
        deptInfo:'全部',
        annualBudgetData:[],
        rawBackup : [],
        listT : [],
        titleList:[],
        deptName:[{
          dept_id:Cookie.get('dept_id'),
          dept_name:Cookie.get('dept_name'),
        }],
        tenantid:Cookie.get('tenantid'),
        userid:Cookie.get('userid'),
        roleFlag:true,
        role:false,
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *init({}, { call,put }) {
      yield put({
        type: 'save',
        payload:{
          ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
        }
      });
      yield put({
        type: 'getOU',
      });
    },

    *onCellChange({value,key,dept},{call,put,select}){
      let { rawBackup, dateInfo, ouInfo} = yield select(state => state.annualBudget);
      let backupData = rawBackup.filter(item => item.key === key)[0];
      let postData = {};
      postData['arg_year'] = dateInfo;
      postData['arg_ou'] = ouInfo.split('-')[1];
      postData['arg_dept'] = dept;
      postData['arg_fee_name'] = backupData.fee_name;
      postData['arg_class'] = backupData.parent_fee_name;
      postData['arg_fee_depart'] = backupData.concentration_name;
      postData['arg_fee_type'] = backupData.fee_use_name;
      postData['arg_old_value'] = backupData[dept];
      postData['arg_new_value'] = value===undefined?backupData[dept]:value;
      const data = yield call(budgeManage.updateYearBudget,postData);
      if (data.RetCode === '1'){
        yield put({
          type: 'queryData',
        });
        message.success('修改成功！');
      }else {
        message.error(data.RetVal);
      }
    },
//查询ou列表
    *getOU({}, { call, put, select }){
      let { tenantid, ouInfo } = yield select(state => state.annualBudget);
      let postData={};
      postData["argtenantid"] = tenantid;
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] = '/annual_budget';
      const moduleIdData= yield call(budgeManage.costUserHasModule, postData);
      if (moduleIdData.RetCode==='1'){
        let moduleId = moduleIdData.moduleid;
        let postData1 = {};
        postData1["argtenantid"] = tenantid;
        postData1["arguserid"] = localStorage.userid;
        postData1['argmoduleid'] = moduleId;
        postData1["argvgtype"] = '2';//全成本选择OU

        const data= yield call(budgeManage.costUserGetOU, postData1);
        if (data.RetCode==='1'){
          if (data.RowCount === '0'){
            let list = [];
            list.push({
              dept_id:ouInfo.split('-')[0],
              dept_name:ouInfo.split('-')[1],
            });
            yield put({
              type: 'save',
              payload:{
                ouList : list,
              }
            });
          }else{
            yield put({
              type: 'save',
              payload:{
                ouList : data.DataRows,
              }
            });
          }
          yield put({
            type:'getDept',
            ou : ouInfo.split('-')[0],
            flag: '1',
          })
        }else{
          message.error(data.RetVal);
        }
      }else{
        message.error(moduleIdData.RetVal);
      }
    },

    //查询部门列表
    *getDept({ ou, flag }, { call, put, select }){
      let { userid, deptName } = yield select(state => state.annualBudget);
      let postData = {};
      postData = {
        arg_tp_name: '预算管理',
        arg_user_id: userid,
      };
      const userRole = yield call(budgeManage.queryUserRole,postData);
      if (userRole.RetCode === '1'){
        if (userRole.DataRows){
          let role = false;
          let financeFlag = false;//是否是财务其他人员，可看全部部门，但不能生成等操作
          for(let i=0;i<userRole.DataRows.length;i++){
            if(userRole.DataRows[i].tag === '1'){
              role = true;
            }else if(userRole.DataRows[i].tag === '2'){
              financeFlag = true;
            }
          }
          if (role===true||financeFlag === true){
            let formData = {};
            formData['arg_parent_dept_id'] = ou;
            const data = yield call(budgeManage.queryOU,formData);

            //手动给每一个list一个key，不然表格数据会报错
            if (data.DataRows[0].children.length) {
              data.DataRows[0].children.map((i, index) => {
                i.key = index;
              })
            }
            let checkList = [];
            data.DataRows[0].children.map(item =>{
              checkList.push(item.dept_name);
            });
            if( data.RetCode === '1'){
              yield put({
                type: 'save',
                payload:{
                  deptList : data.DataRows[0].children,
                  checkList : checkList,
                  deptInfo:'全部',
                  role:role,
                }
              });
            }
          }else{
            yield put({
              type: 'save',
              payload:{
                deptList : deptName,
                roleFlag:false,
                role:role,
              }
            });
          }
          if (flag === '1'){
            yield put({
              type: 'queryData',
            });
          }
        }
      }
    },

    *onChangeDatePicker({dateInfo},{put}){
      yield put({
        type: 'save',
        payload:{
          dateInfo,
        }
      });
    },
    *onChangeOu({ou},{put}){
      yield put({
        type: 'save',
        payload:{
          ouInfo:ou,
        }
      });
      if (ou.split('-').length>1){
        yield put({
          type: 'getDept',
          ou: ou.split('-')[0],
        });
      } else {
        yield put({
          type: 'save',
          payload:{
            deptList : [],
            checkList : [],
            deptInfo:'全部',
          }
        });
      }
    },
    *onChangeDept({checkList,checkAll},{put}){
      if(checkAll === true){
        yield put({
          type: 'save',
          payload:{
            deptInfo:'全部',
          }
        });
      }else{
        yield put({
          type: 'save',
          payload:{
            deptInfo:checkList.join('\n'),
          }
        });
      }
    },
    *onChangeCheckList({checkedList},{put}){
      yield put({
        type: 'save',
        payload:{
          checkList:checkedList,
        }
      });
    },
    *queryData({}, { call, put, select }){
      let { dateInfo, ouInfo, deptInfo, deptList, checkList, roleFlag, deptName } = yield select(state => state.annualBudget);
      yield put({
        type: 'save',
        payload:{
          loading:true,
        }
      });
      let formData = {};
      let dept = [];
      for(let i = 0;i<deptList.length;i++){
        dept.push(
          deptList[i].dept_name
        )
      }
      let argdept = '';
      if (roleFlag === true){
        if (deptInfo==='全部'){
          argdept = '"'+dept.join('","')+'"';
        }else{
          if(checkList.length === 0){
            message.info('请选择部门');
            return;
          }
          argdept = '"'+checkList.join('","')+'"';
        }
      }else{
        if (ouInfo.match('本部')){
          argdept = '("联通软件研究院-'+deptName[0].dept_name+'")';
        }else{
          argdept = '("'+ouInfo.split('-')[1]+'-'+deptName[0].dept_name+'")';
        }
      }

      formData['arg_year'] = dateInfo;
      formData['arg_ou'] = ouInfo.split('-')[1];
      formData['arg_dept_name'] = ouInfo.split('-')[1]==='联通软件研究院'?'':argdept;
      const data = yield call(budgeManage.queryYearBudget,formData);
      let keyName = ouInfo.split('-')[1]==='联通软件研究院'?'ou_name':'dept_name';
      let subList = [];//小计
      let subDetail = [];//统计
      let titleList = [];
      let index = [];//总合计
      let subIndex = [];//小计index
      if (data.RetCode === '1'){
        if (data.DataRows.length) {
          if (data.DataRows.length>2){
            //获取表头名称
            for (let i = 0;i < JSON.parse(data.DataRows[0].budget_fee_value).length;i++){
              titleList.push(
                JSON.parse(data.DataRows[0].budget_fee_value)[i][keyName],
              )
            }
            //计算合计
            for (let i=0;i<data.DataRows.length;i++){
              let sum = 0;
              for (let j=0;j<JSON.parse(data.DataRows[i].budget_fee_value).length;j++){
                sum += parseFloat(JSON.parse(data.DataRows[i].budget_fee_value)[j].budget_fee_values);
              }
              data.DataRows[i]['sum']=sum;
            }
            //将数据按sub_total分到不同的list中，便于将小计的数据插入对应的位置。
            for (let i=0;i<data.DataRows.length;i++){
              if(data.DataRows[i].sub_total === '小计'){
                subList.push(data.DataRows[i]);
              }
            }
            for (let i=0;i<subList.length;i++){
              data.DataRows.splice(data.DataRows.indexOf(subList[i]), 1);
            }
            for (let i=0;i<data.DataRows.length;i++){
              for (let j=0;j<subList.length;j++){
                if((subList[j].parent_fee_name===data.DataRows[i].parent_fee_name&&subList[j].concentration_name===data.DataRows[i].concentration_name)&&((i!==data.DataRows.length-1&&subList[j].concentration_name!==data.DataRows[i+1].concentration_name)||i===data.DataRows.length-1)){
                  subIndex.push({
                    index:data.DataRows[i],
                    sub:subList[j],
                  })
                }
              }
            }
            for (let i=0;i<subIndex.length;i++){
              data.DataRows.splice(data.DataRows.indexOf(subIndex[i].index)+1, 0,subIndex[i].sub);
            }
            //处理每条数据
            for (let i=0;i<data.DataRows.length;i++){
              for (let j=0;j<JSON.parse(data.DataRows[i].budget_fee_value).length;j++){
                data.DataRows[i][JSON.parse(data.DataRows[i].budget_fee_value)[j][keyName]] = JSON.parse(data.DataRows[i].budget_fee_value)[j].budget_fee_values;
              }
              if (data.DataRows[i].sub_total === '合计'){
                data.DataRows[i].fee_use_name = data.DataRows[i].parent_fee_name;
                data.DataRows[i].concentration_name = data.DataRows[i].parent_fee_name;
                data.DataRows[i].fee_name = data.DataRows[i].parent_fee_name;
              } else if (data.DataRows[i].sub_total === '小计'){
                if (i+1 === data.DataRows.length || data.DataRows[i+1].fee_use_name !== data.DataRows[i-1].fee_use_name){
                  data.DataRows[i].fee_use_name = '';
                  data.DataRows[i].concentration_name = data.DataRows[i].sub_total;
                  data.DataRows[i].fee_name = data.DataRows[i].sub_total;
                } else if (data.DataRows[i+1].fee_use_name === data.DataRows[i-1].fee_use_name){
                  data.DataRows[i].fee_use_name = data.DataRows[i-1].fee_use_name;
                  data.DataRows[i].concentration_name = data.DataRows[i].sub_total;
                  data.DataRows[i].fee_name = data.DataRows[i].sub_total;
                }
              } else if (data.DataRows[i].sub_total !== '非合计'){
                data.DataRows[i].fee_use_name = data.DataRows[i].sub_total;
                data.DataRows[i].concentration_name = data.DataRows[i].sub_total;
                data.DataRows[i].fee_name = data.DataRows[i].sub_total;
                subDetail.push(data.DataRows[i]);
              }

              if (i < data.DataRows.length-1 && (data.DataRows[i].sub_total === '非合计'||data.DataRows[i].sub_total === '合计'||data.DataRows[i].sub_total === '小计')){
                if (data.DataRows[i].fee_type !== data.DataRows[i+1].fee_type){
                  index.push({
                    index:data.DataRows[i],
                    feeType:data.DataRows[i].fee_type,
                  })
                }
              }
            }
            //只有一种fee_type的情况
            if (index.length===0){
              index.push({
                index:data.DataRows[data.DataRows.length-1],
                feeType:data.DataRows[data.DataRows.length-1].fee_type,
              })
            }
            if (subDetail){
              for (let i=0;i<subDetail.length;i++){
                for (let j=0;j<index.length;j++){
                  if (subDetail[i].fee_type === index[j].feeType){
                    data.DataRows.splice(data.DataRows.indexOf(index[j].index)+1, 0 , subDetail[i]);
                  }
                }
/*                if (subDetail[i].fee_type === '2') {
                  data.DataRows.splice(data.DataRows.length, 0, subDetail[i]);
                }*/
              }
              for (let i=0;i<subDetail.length;i++){
                data.DataRows.splice(data.DataRows.indexOf(subDetail[i]), 1);
              }
            }
            //手动给每一个list一个key，不然表格数据会报错
            data.DataRows.map((i, index) => {
              i.key = index;
            });
            MergeCells(data.DataRows, 'parent_fee_name','1');
            MergeCells(data.DataRows, 'concentration_name','2');
            MergeCells(data.DataRows, 'fee_use_name','3');
            MergeCol(data.DataRows);

            yield put({
              type: 'save',
              payload:{
                annualBudgetData:data.DataRows,
                titleList:titleList,
                rawBackup : data.DataRows,
                loading:false,
              }
            });
          }
          else{
            yield put({
              type: 'save',
              payload:{
                annualBudgetData:[],
                titleList:[],
                rawBackup : [],
                loading:false,
              }
            });
          }
        }else{
          yield put({
            type: 'save',
            payload:{
              annualBudgetData:[],
              titleList:[],
              rawBackup : [],
              loading:false,
            }
          });
        }
      }else{
        message.error(data.RetVal);
      }
    },
    //模板下载
    *downloadAnnualBudget({},{select}){
      let { dateInfo, ouInfo } = yield select(state => state.annualBudget);
      window.open('/budgetservice/annual_budget_maintain/exportModuleServlet?arg_year='+dateInfo+'&arg_ou='+ouInfo.split('-')[1]);
    },
    //
    *cancelBudget({}, { call, put, select }){
      let { dateInfo, ouInfo } = yield select(state => state.annualBudget);

      let formData = {};
      formData['arg_year'] = dateInfo;
      formData['arg_ou'] = ouInfo.split('-')[1];
      formData['arg_user_id'] = localStorage.userid;
      const data = yield call(budgeManage.cancelAnnualBudget,formData);
      if (data.RetCode === '1'){
        message.success('撤销成功！');
        yield put({
          type: 'queryData',
        });
      }else {
        message.error(data.RetVal);
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/budget_management/annual_budget') {
          dispatch({ type: 'init',query });
          dispatch({type:'initData'});
        }
      });
    },
  },
};
