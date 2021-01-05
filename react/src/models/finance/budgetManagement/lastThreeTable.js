/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：最后三张表
 */
import * as budgeManage from '../../../services/finance/budgetManageCofig';
import { message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
function MoneyComponent({text}) {
  if(text && text.includes('%')){
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>{text && text!=='-'?parseFloat(text).toFixed(2) + '%':text}</div>
    )
  }else{
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>{text && text!=='-'?parseFloat(text).toFixed(2) + '':text}</div>
    )
  }
}
function MoneyComponentRatio({text}) {
  return (
    <div style={{textAlign:'right',letterSpacing:1}}>{text && text!=='-'?parseFloat(text).toFixed(2) + '%':text}</div>
  )
}
function commafyback(num) {
  let x = num.split(',');
  return parseFloat(x.join(""));
}
export default {
  namespace: 'lastThreeTable',
  state: {

    ouList:[],
    stateList:[],

    dateInfo:moment(),
    ouInfo:localStorage.ou,
    stateInfo:'1',

    list:[],
    columnDeptBudget:[],
    columnWholeNetwork:[],
    columnDepreciation:[],

    roleType:false
  },

  reducers: {
    initData(state){
      return {
        ...state,
        ouList:[],
        stateList:[],

        dateInfo:moment(),
        ouInfo:localStorage.ou,
        stateInfo:'1',

        list:[],
        columnDeptBudget:[],
        columnWholeNetwork:[],
        columnDepreciation:[],

        roleType:false

      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *init({ flag }, { put,call }) {
      const role = yield call(budgeManage.queryUserRole, {arg_tp_name: '预算管理', arg_user_id: localStorage.userid});
      if(role.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            roleType : role.DataRows.some(i=>i.role_name.includes('财务管理员')),
          }
        });
      }
      if( flag === '1'){
        yield put({
          type: 'deptBudget',
        });
      }else if( flag ==='2'){
        yield put({
          type: 'depreciationSharing',
        });
      }else if( flag ==='3'){
        //查ou
        let postData = {};
        postData["argtenantid"] = '10010';
        postData["arguserid"] = localStorage.userid;
        postData["argrouterurl"] = '/whole_netWork';
        //flag ==='1'?'/dept_budget':flag === '2'?'depreciation_budget':'whole_netWork';
        const moduleIdData = yield call(budgeManage.costUserHasModule,postData);
        if( moduleIdData.RetCode === '1'){
          let formData = {};
          formData["argtenantid"] = '10010';
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
          type: 'wholeNetwork',
        });
      }
      //查统计类型
      const data= yield call(budgeManage.stateParamQuery, {argstatetype:'2', argstatemode:'0'});
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            stateList:data.DataRows
          }
        });
      }
    },
    *changeSelect({value,key},{put}){
      yield put({
        type: 'save',
        payload:{
          [key]:value,
        }
      });
    },

    *deptBudget({}, { call, put,select }){
      let { dateInfo,stateInfo} = yield select(state=>state.lastThreeTable);
      let formData = {};
      formData['arg_total_year'] = dateInfo.year();
      formData['arg_total_month'] = dateInfo.month()+1;
      //formData['arg_ou'] = ouInfo;
      formData['arg_total_type'] = stateInfo;
      const data = yield call(budgeManage.deptBudget,formData);
      if( data.RetCode === '1'){
        let column = [
          {
            title : '部门名称',
            key : 'dept_name',
            dataIndex :'dept_name',
            width: '180px',
            fixed:'left',
            render: (text) => {return <div style={{textAlign:'left'}}>{text.includes('-')?text.split('-')[1]:text}</div>}
          },
          {
            title : '自管经费',
            children:[{
              title: '部门差旅费（非资本化）',
              children:[
                {
                  title : '预算',
                  key : 'budget_fee_self',
                  dataIndex :'budget_fee_self',
                  width: '150px',
                  render:(text,record)=><MoneyComponent text={record['budget_fee_self']}/>
                },
                {
                  title : '执行数',
                  key : 'cost_fee_self',
                  dataIndex :'cost_fee_self',
                  width: '150px',
                  render:(text,record)=><MoneyComponent text={record['cost_fee_self']}/>
                },
                {
                  title : '完成率',
                  key : 'ratio_self',
                  dataIndex :'ratio_self',
                  width: '150px',
                  render:(text,record)=><MoneyComponentRatio text={record['ratio_self']}/>
                }
              ]
            }]
          },
          {
            title : '归口负责差旅费（含分院）',
            children:[
              {
                title: '非资本化差旅费',
                children:[
                  {
                    title : '预算',
                    key : 'budget_fee_no',
                    dataIndex :'budget_fee_no',
                    width: '150px',
                    render:(text,record)=><MoneyComponent text={record['budget_fee_no']}/>
                  },
                  {
                    title : '执行数',
                    key : 'cost_fee_no',
                    dataIndex :'cost_fee_no',
                    width: '150px',
                    render:(text,record)=><MoneyComponent text={record['cost_fee_no']}/>
                  }
                ]
              },
              {
                title: '资本化的差旅费',
                children:[
                  {
                    title : '预算',
                    key : 'budget_fee',
                    dataIndex :'budget_fee',
                    width: '150px',
                    render:(text,record)=><MoneyComponent text={record['budget_fee']}/>
                  },
                  {
                    title : '执行数',
                    key : 'cost_fee',
                    dataIndex :'cost_fee',
                    width: '150px',
                    render:(text,record)=><MoneyComponent text={record['cost_fee']}/>
                  }
                ]
              },
              {
                title: '归口合计',
                children:[
                  {
                    title : '预算',
                    key : 'budget_fee_sum',
                    dataIndex :'budget_fee_sum',
                    width: '150px',
                    render:(text,record)=><MoneyComponent text={record['budget_fee_sum']}/>
                  },
                  {
                    title : '执行数',
                    key : 'cost_fee_sum',
                    dataIndex :'cost_fee_sum',
                    width: '150px',
                    render:(text,record)=><MoneyComponent text={record['cost_fee_sum']}/>
                  },
                  {
                    title : '完成率',
                    key : 'ratio_sum',
                    dataIndex :'ratio_sum',
                    width: '150px',
                    render:(text,record)=><MoneyComponentRatio text={record['ratio_sum']}/>
                  }
                ]
              }
            ]
          },
        ];
        data.DataRows.map((i)=>{
          data.DataRows1.map((ii)=>{
            if( i.dept_name === ii.dept_name){
              Object.assign(i,ii);
            }
          })
        });
        let deptBudgetList = data.DataRows;
        let titleName =[
          {
            key:'budget_fee_self',
            value:'预算'
          },
          {
            key:'cost_fee_self',
            value:'执行'
          },
          {
            key:'ratio_self',
            value:'完成率'
          },
          {
            key:'budget_fee_no',
            value:'预算,非资本化'
          },
          {
            key:'cost_fee_no',
            value:'执行数，非资本化'
          },
          {
            key:'budget_fee',
            value:'预算，资本化'
          },
          {
            key:'cost_fee',
            value:'执行数，资本化'
          },
          {
            key:'budget_fee_sum',
            value:'预算合计'
          },
          {
            key:'cost_fee_sum',
            value:'执行合计'
          },
          {
            key:'ratio_sum',
            value:'完成率合计'
          },
        ];
        let sumList = {};
        titleName.map((i)=>{
          let sumBudget = 0;
          deptBudgetList.map((ii)=>{
            if(ii[i.key] && ii[i.key]!== '-'){
              sumBudget += parseFloat(ii[i.key])
            }
          });
          sumList[i.key] = sumBudget.toFixed(2);
          sumList['dept_name'] = '合计';
        });
        for( let index in sumList){
          if(index ==='ratio_self'){
            sumList['ratio_self'] = sumList['budget_fee_self'] === '0.00' ? '-':(sumList['cost_fee_self'] ==='0.00'?'0.00%':sumList['cost_fee_self']/sumList['budget_fee_self']*100+'%')
          }
          if(index === 'ratio_sum'){
            sumList['ratio_sum'] = sumList['budget_fee_sum']==='0.00'?'-':(sumList['cost_fee_sum']==='0.00'?'0.00%':sumList['cost_fee_sum']/sumList['budget_fee_sum']*100+'%')
          }
        }
        if(deptBudgetList.length){
          deptBudgetList.push(sumList);
        }
        yield put({
          type: 'save',
          payload:{
            list:data.StateCode?deptBudgetList:[],
            columnDeptBudget:column,
            currState:data.StateCode,
            scroll:10*150+180,
          }
        });
      }
    },

    *deptBudgetGenerate({},{ call, put,select }){
      let { dateInfo} = yield select(state=>state.lastThreeTable);
      let formData = {};
      formData['arg_total_year'] = dateInfo.year();
      formData['arg_total_month'] = dateInfo.month()+1;
      //formData['arg_ou'] = ouInfo;
      formData['arg_user_id'] = localStorage.userid;
      const data = yield call(budgeManage.deptBudgetGenerate,formData);
      if( data.RetCode === '1'){
        message.info('生成成功！');
        yield put({
          type:'deptBudget'
        })
      }else{
        message.info(data.RetVal);
      }
    },
    *deptBudgetPublic({},{ call, put,select }){
      let { dateInfo} = yield select(state=>state.lastThreeTable);
      let formData = {};
      formData['arg_total_year'] = dateInfo.year();
      formData['arg_total_month'] = dateInfo.month()+1;
      //formData['arg_ou'] = ouInfo;
      formData['arg_user_id'] = localStorage.userid;
      const data = yield call(budgeManage.deptBudgetPublic,formData);
      if( data.RetCode === '1'){
        message.info('审核通过！');
        yield put({
          type:'deptBudget'
        })
      }else{
        message.info(data.RetVal);
      }
    },
    *deptBudgetCancel({},{ call, put,select }){
      let { dateInfo} = yield select(state=>state.lastThreeTable);
      let formData = {};
      formData['arg_total_year'] = dateInfo.year();
      formData['arg_total_month'] = dateInfo.month()+1;
      //formData['arg_ou'] = ouInfo;
      formData['arg_user_id'] = localStorage.userid;
      const data = yield call(budgeManage.deptBudgetCancel,formData);
      if( data.RetCode === '1'){
        message.info('撤销成功！');
        yield put({
          type:'deptBudget'
        })
      }else{
        message.info(data.RetVal);
      }
    },

    *wholeNetwork({}, { call, put,select }){
      let { dateInfo,ouInfo,stateInfo} = yield select(state=>state.lastThreeTable);
      let formData = {};
      formData['arg_total_year'] = dateInfo.year();
      formData['arg_total_month'] = dateInfo.month()+1;
      formData['arg_ou'] = ouInfo;
      formData['arg_total_type'] = stateInfo;
      const data = yield call(budgeManage.wholeNetwork,formData);
      if( data.RetCode === '1'){
        let column = [
          {
            title : '部门名称',
            key : 'dept_name',
            dataIndex :'dept_name',
            width: 180,
            fixed:'left',
            render: (text) => {return <div style={{textAlign:'left'}}>{text.includes('-')?text.split('-')[1]:text}</div>}
          }];
        let titleName=[];
        for( let code in JSON.parse(data.TitleName)){titleName.push({key : code, value : JSON.parse(data.TitleName)[code]})}
        for( let i=0;i<titleName.length;i++){
          column.push(
            {
              title: titleName[i].value,
              key: i,
              children:[
                {
                  title: '预算数',
                  width: 150,
                  key:i+'a',
                  render:(text,record)=><MoneyComponent text={record[titleName[i].key+'::budget']}/>
                },
                {
                  title:"执行数",
                  width: 150,
                  key:i+'b',
                  render:(text,record)=><MoneyComponent text={record[titleName[i].key+'::cost']}/>
                },
                {
                  title:'完成率',
                  width: 150,
                  key:i+'c',
                  render:(text,record)=><MoneyComponentRatio text={record[titleName[i].key+'::ratio']}/>
              }]
            }
          );
        }
        let wholeNetWork = [];
        for ( let i=0;i<data.DataRows.length;i++){
          let tempList = {};
          tempList = data.DataRows[i].dept_total_cost ? JSON.parse(data.DataRows[i].dept_total_cost):{};
          tempList.dept_name = data.DataRows[i].dept_name;
          wholeNetWork.push(tempList);
        }
        let sumList = {};
        titleName.map((i)=>{
          let sumBudget = 0;
          let sumCost = 0;
          let sumRatio = 0;
          wholeNetWork.map((ii)=>{
            sumBudget += parseFloat(ii[i.key+'::budget']);
            sumCost += parseFloat(ii[i.key+'::cost']);
            if( sumRatio && sumBudget!=='-'){sumRatio += parseFloat(ii[i.key+'::ratio'])}
          });
          sumList[i.key+'::budget'] = sumBudget.toFixed(2);
          sumList[i.key+'::cost'] = sumCost.toFixed(2);
          //sumList[i.key+'::ratio'] = sumRatio.toFixed(2);
          //预算为0，完成率为-，执行为0，完成率为0
          sumList[i.key+'::ratio'] = sumList[i.key+'::budget'] ==='0.00'? '-':(sumList[i.key+'::cost'] ==='0.00'?'0.00%':sumList[i.key+'::cost']/sumList[i.key+'::budget']*100+'%');
          sumList['dept_name'] = '合计';
        });
        if(wholeNetWork.length){
          wholeNetWork.push(sumList);
        }
        yield put({
          type: 'save',
          payload:{
            list:wholeNetWork,
            columnWholeNetwork:column,
            scroll:titleName.length*450+180,
          }
        });
      }
    },

    *depreciationSharing({}, { call, put,select }){
      let { dateInfo } = yield select(state=>state.lastThreeTable);
      let formData = {};
      formData['arg_total_year'] = dateInfo.year();
      formData['arg_total_month'] = dateInfo.month()+1;
      const data = yield call(budgeManage.depreciationSharing,formData);
      if( data.RetCode === '1'){
        let column = [{
          title : '部门名称',
          key : 'ou',
          dataIndex :'ou',
          width: '180px',
          fixed : 'left',
          render: (text) => {return <div style={{textAlign:'left'}}>{text}</div>}
        }];
        let titleName=[];
        for( let code in JSON.parse(data.TitleName)){titleName.push({key : code, value : JSON.parse(data.TitleName)[code]})}
        for( let i=0;i<titleName.length;i++){
          column.push(
            {
              title: titleName[i].value,
              key: titleName[i].key,
              dataIndex :titleName[i].key,
              width:'150px',
              render:(text,record)=><MoneyComponent text={record[titleName[i].key]}/>
            }
          );
        }
        let depreciationSharing = [{ou:'零购及长摊类-办公设备折旧摊销',fee_name:'零购及长摊类-办公设备折旧摊销'}];
        //两项所有的数据处理
        for ( let i=0;i<data.DataRows.length;i++){
          let tempList = data.DataRows[i].dept_cost?JSON.parse(data.DataRows[i].dept_cost):{};
          tempList.ou = data.DataRows[i].ou;
          tempList.season_budget = data.DataRows[i].season_budget;
          tempList.season_cost = data.DataRows[i].season_cost;
          tempList.month_cost = data.DataRows[i].month_cost;
          tempList.year_budget = data.DataRows[i].year_budget;
          tempList.year_cost = data.DataRows[i].year_cost;
          tempList.ratio = data.DataRows[i].ratio;
          tempList.fee_name = data.DataRows[i].fee_name;
          depreciationSharing.push(tempList);
        }
        //算合计
        let sumList = {};
        titleName.map((i)=>{
          let sumBudget = 0;
          depreciationSharing.map((ii)=>{
            if(ii[i.key] && ii[i.key]!== '-'){
              sumBudget += parseFloat(ii[i.key])
            }
          });
          sumList[i.key] = sumBudget.toFixed(2);
          sumList['ou'] = '合计';
          sumList['ratio'] = sumList['ratio']+'%';
        });
        for( let index in sumList){
          if(index ==='ratio'){
            sumList['ratio'] = sumList['year_budget'] === '0.00' ? '-':(sumList['year_cost'] ==='0.00'?'0.00%':sumList['year_cost']/sumList['year_budget']*100+'%')
          }
        }
        //将合计加入到depreciationSharing
        if(depreciationSharing.length){
          depreciationSharing.push(sumList);
        }
        //将 零购及长摊类-办公设备折旧摊销和data.DataRows1[0] 加入到depreciationSharing
        for( let i = depreciationSharing.length-1;i>0;i--){
          if( depreciationSharing[i].fee_name === '零购及长摊类-办公设备折旧摊销'){
            depreciationSharing.splice(i+1,0,{ou:'生产类资产折旧摊销',fee_name:'生产类资产折旧摊销'});
            depreciationSharing.splice(i+2,0,data.DataRows1[0]);
            break;
          }
        }
        scroll = 180+titleName.length*150;
        yield put({
          type: 'save',
          payload:{
            list:data.DataRows.length?depreciationSharing:[],
            columnDepreciation:column,
            scroll,
          }
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/financeApp/budget_management/dept_budget') {
          let flag = '1';
          dispatch({ type: 'initData'});
          dispatch({ type: 'init',flag });
        }else if( pathname === '/financeApp/budget_management/depreciation_budget' ){
          let flag = '2';
          dispatch({ type: 'initData'});
          dispatch({ type: 'init',flag });
        }else if( pathname === '/financeApp/budget_management/whole_netWork' ){
          let flag = '3';
          dispatch({ type: 'initData'});
          dispatch({ type: 'init',flag });
        }
      });
    },
  },
};
