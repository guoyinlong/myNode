/**
 * 作者：耿倩倩
 * 创建日期：2017-11-01
 * 邮箱：gengqq3@chinaunicom.cn
 * 功能：财务-全成本-项目全成本管理-项目全成本预算执行情况管理
 */
import * as costService from '../../../../services/finance/costService';
import config  from '../../../../utils/config';
import { rightControl } from '../../../../components/finance/rightControl';
import { message,Tooltip } from 'antd';
const dateFormat='YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
function isInArray (projListData,projCode){
  for(let i = 0; i < projListData.DataRows.length; i++){
    if(projCode === projListData.DataRows[i].proj_code){
      return true;
    }
  }
  return false;
}
export default {
  namespace: 'projCostBudgetExecuteManage',
  state: {
    stateParamList:[],
    projList:[],
    projBudgetGoingList:[],
    projInfoOne:[],
    projInfoTwo:[],
    lastDate: '',
    ouList:[],
    list:[],
    data:'',
    projName:[],

    beginTime:null,
    endTime:null,
    dataSource_BP:[],
    columns_BP: [],
    goback_btn: false,
    history_param: {}
  },
  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：保存ModuleId数据
     */
    initData(state){
      return{
        ...state,
        stateParamList:[],
        projList:[],
        projBudgetGoingList:[],
        projInfoOne:[],
        projInfoTwo:[],
        lastDate: '',
        ouList:[],
        list:[],
        data:'',
        projName:[],

        beginTime:null,
        endTime:null,
        dataSource_BP:[],
        columns_BP: [],
        goback_btn: false,
        history_param: {}
      }
    },
    saveModuleId(state,action) {
      return { ...state, ...action.payload};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：保存数据
     */
    saveOu(state,{ouList}) {
      return { ...state, ouList};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：保存数据
     */
    saveStateParam(state,action) {
      return { ...state, ...action.payload};
    },
    // 最新数据的年月
    ouFullCostLastDateReducer(state,{lastDate,beginTime,endTime}){
      return {
        ...state,
        lastDate:lastDate,
        beginTime,
        endTime,
      }
    },
    //获取项目列表
    getProjListReducer(state,action) {
      return { ...state, ...action.payload};
    },
    //获取预算执行情况数据
    getProjBudgetGoingReducer(state, {data}){
      let columnsWidth;
      if( data !== ''){
        let columns=[
          {
            title: '类别',
            width: 230,
            //fixed:'left',
            key:'1',
            render: (text,row) => {
              return(
                <div style={{textAlign:'left'}}>
                  <Tooltip title={row.fee_name} style={{width:'30%'}}>
                    <div style={{width:'195px',whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',paddingRight:'5px'}}>{row.fee_name}</div>
                  </Tooltip>
                </div>
              )
            }
          },
          {
            title: '项目合计',
            children:[{
              title: '预算数',
              width: 120,
              key:'a',
              render:(text,row)=>{
                if(row.allbudgetfee === '0.00'){
                  return <div style={{textAlign:'right'}}>-</div>
                }else{
                  return <div style={{textAlign:'right'}}>{row.allbudgetfee}</div>
                }
              }
            },{
              title:"实际完成数",
              width: 120,
              //width: columnList.length>1 ? 150:Math.round((1028-450)/3),
              key:'b',
              render:(text,row)=>{
                if(row.allfee === '0.00'){
                  return <div style={{textAlign:'right'}}>-</div>
                }else{
                  return <div style={{textAlign:'right'}}>{row.allfee}</div>
                }
              }
            },{
              title:'预算完成率',
              width: 120,
              key:'c',
              render:(text,row)=>{
                if(parseFloat(row.AllFeeCompletionRate) > 100 ){
                  return <div style={{textAlign:'right',color:'red'}}>{row.AllFeeCompletionRate}</div>
                }
                else if(row.AllFeeCompletionRate === '0.000%'){
                  return <div style={{textAlign:'right'}}>-</div>
                }else{
                  return <div style={{textAlign:'right'}}>{row.AllFeeCompletionRate}</div>
                }
              }
            }]
          }
        ];
        let columnList = data[1].DataRows;
        if(columnList){
          for(let i=0;i<columnList.length;i++){
            columns.push({
              title: columnList[i].dept_name,
              children:[{
                title: '预算数',
                width: 120,
                key:i+'a',
                render:(text,record)=>{
                  if(record['budget_fee-'+columnList[i].dept_name] === '0.00'){
                    return <div style={{textAlign:'right'}}>-</div>
                  }else{
                    return <div style={{textAlign:'right'}}>{record['budget_fee-'+columnList[i].dept_name]}</div>
                  }
                }
              },{
                title:"实际完成数",
                width: 120,
                key:i+'b',
                render:(text,record)=>{
                  if(record['fee-'+columnList[i].dept_name] === '0.00'){
                    return <div style={{textAlign:'right'}}>-</div>
                  }else{
                    return <div style={{textAlign:'right'}}>{record['fee-'+columnList[i].dept_name]}</div>
                  }
                }
              },{
                title:'预算完成率',
                width: 120,
                key:i+'c',
                render:(text,record)=>{
                  if(parseFloat(record['FeeCompletionRate-'+columnList[i].dept_name]) > 100 ){
                    return <div style={{textAlign:'right',color:'red'}}>{record['FeeCompletionRate-'+columnList[i].dept_name]}</div>
                  }
                  else if(record['FeeCompletionRate-'+columnList[i].dept_name] ==='0.00%'){
                    return <div style={{textAlign:'right'}}>-</div>
                  }else{
                    return <div style={{textAlign:'right'}}>{record['FeeCompletionRate-'+columnList[i].dept_name]}</div>
                  }
                }
              }]
            })
          }
          columnsWidth=590+columnList.length*360;
        }
        return {
          ...state,
          projBudgetGoingList:data,
          projInfoOne:data[1].DataRows !== undefined ?data[1].DataRows[0]:[],
          projInfoTwo:data[2].DataRows !== undefined ?data[2].DataRows[0]:[],
          columns,
          list:data[0].DataRows !== undefined?data[0].DataRows:[],
          columnsWidth
        }
      }else{
        return {
          ...state,
          projBudgetGoingList:[],
          projInfoOne:[],
          projInfoTwo:[],
          columns:[],
          list:[],
        }
      }
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  },
  effects: {
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：初始化
     */
    *init({query},{call,put}){
      let userId = localStorage.userid;
      let tenantId = config.COST_TENANT_ID;
      let routerUrl = config.COST_FULL_CPBG_Q;
      let postData = {};
      postData["argtenantid"] = tenantId;
      postData["arguserid"] = userId;
      postData["argrouterurl"] = routerUrl;
      const moduleIdData = yield call(costService.costUserHasModule,postData);
      if(moduleIdData.RetCode === '1') {
        yield put({
          type: 'saveModuleId',
          payload: {
            moduleId: moduleIdData.moduleid,
            ouList: [],
            list: [],
            projBudgetGoingList:[],
            projInfoOne:[],
            projInfoTwo:[],
            columns:[],
          }
        });
        let postData1 = {};
        postData1["argtenantid"] = config.COST_TENANT_ID;
        postData1["arguserid"] = localStorage.userid;
        postData1["argmoduleid"] = moduleIdData.moduleid;
        postData1["argvgtype"] = config.COST_OU_VGTYPE;
        const data = yield call(costService.costUserGetOU, postData1);
        if(data.RetCode === '1'){
          yield put({
            type: 'saveOu',
            ouList:data.DataRows
          });
        }
        //获取统计类型：月统计，年统计，至今
        let postData2={};
        postData2["argstatetype"] = '2';
        postData2["argstatemode"] = '5';
        const stateParamData= yield call(costService.stateParamQuery, postData2);
        if(stateParamData.RetCode === '1'){
          yield put({
            type: 'saveStateParam',
            payload:{
              stateParamList:stateParamData.DataRows
            }
          });
        }
        if (query.ou === config.OU_NAME_CN){
          query.ou = '*'
        }
        let postData3 = {};
        postData3['argou'] = query.ou || localStorage.ou;
        //查询最近有数据的年月
        let {max_year,max_month} = yield call(costService.ouFullCostLastDate,postData3);
        yield put({
          type: 'ouFullCostLastDateReducer',
          lastDate: moment(max_year+'-'+max_month,'YYYY-MM'),
          beginTime: query.argbegintime ? moment(query.argbegintime,'YYYY-MM') : moment(max_year+'-'+max_month,'YYYY-MM'),
          endTime:query.argendtime ? moment(query.argendtime,'YYYY-MM') : moment(max_year+'-'+max_month,'YYYY-MM'),
        });
        let postData4 = {};
        postData4['argou'] =query.ou || localStorage.ou;
        postData4['argbegintime'] =query.argbegintime ? moment(query.argbegintime,'YYYY-MM').format('YYYY-MM') : moment(max_year+'-'+max_month,'YYYY-MM').format('YYYY-MM');
        postData4['argendtime'] = query.argendtime ? moment(query.argendtime,'YYYY-MM').format('YYYY-MM') : moment(max_year+'-'+max_month,'YYYY-MM').format('YYYY-MM');
        let { DataRows } = yield call(costService.getProjListByBE,postData4);
        yield put({
          type: 'getProjListReducer',
          payload:{
            projList:DataRows
          }
        });
      }
      if (Object.keys(query).length){
        yield put({
          type: 'save',
          payload: {
            history_param: query.goback_param,
            goback_btn: true
          }
        })
        yield put({
          type: 'queryProjectBudgetGoing',
          ou:query.ou,
          projCode:query.projCode,
          stateParam:query.stateParam
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：查询项目全成本预算执行情况
     */
    *queryProjectBudgetGoing({ou,projCode,stateParam},{select,call,put}){

      let { moduleId,beginTime,endTime } = yield select(state=>state.projCostBudgetExecuteManage);
      let postData = {};
      postData['argmoduleid'] = moduleId;
      postData['arguserid'] = localStorage.userid;
      postData['argtenantid'] = config.COST_TENANT_ID;
      postData["argbegintime"] = beginTime.format('YYYY-MM');
      postData["argendtime"] = endTime.format('YYYY-MM');
      postData["proj_code"] = projCode;
      postData["argtotaltype"]=stateParam;
      if(ou === config.OU_NAME_CN){
        ou = '*';
      }
      postData['ou'] = ou;
      if(projCode !== '请选择项目名称'){
        let data = yield call(costService.getProjBudgetGoing,postData);
        if(data.RetCode === '0'){
          message.info(data.RetVal);
          yield put({
            type: 'getProjBudgetGoingReducer',
            data:''
          });
        }else{
          yield put({
            type: 'getProjBudgetGoingReducer',
            data
          });
        }
      }else{
        yield put({
          type: 'getProjBudgetGoingReducer',
          data:''
        });
      }
      yield put({
        type: 'saveStateParam',
        payload:{
          beginTime,
          endTime
        }
      });
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：根据OU和年份获取项目名称列表
     */
     *getProjList({ ou },{ call,put,select }){
      let { beginTime,endTime } = yield select(state=>state.projCostBudgetExecuteManage);
      let postData = {};
      if(ou === config.OU_NAME_CN){
        ou = '*';
      }
      postData['argou'] = ou;
      postData["argbegintime"] = beginTime.format('YYYY-MM');
      postData["argendtime"] = endTime.format('YYYY-MM');
      let projListData = yield call(costService.getProjListByBE,postData);
      yield put({
        type: 'getProjListReducer',
        payload:{
          projList:projListData.hasOwnProperty('DataRows') ? projListData.DataRows : [],
          projListRetVal:projListData.RetVal,
          // projBudgetGoingList:[],
          // projInfoOne:[],
          // projInfoTwo:[],
          // columns:[],
          // list:[],
        }
      });
    },
    //改变ou,查询项目，并且将之前的数据清空
    *changeOu({ ou },{ put }){
       yield put({
         type:'getProjList',
         ou
       });
      yield put({
        type: 'getProjListReducer',
        payload:{
          //projListRetVal:projListData.RetVal,
          projBudgetGoingList:[],
          projInfoOne:[],
          projInfoTwo:[],
          columns:[],
          list:[],
        }
      });
    },
    //改变统计类型，需要改变时间，然后查询项目,然后查询数据（如果不在列表中，不用查询）
    *changeStateParam({ projCode,stateParam,ou },{ put,select }){
      let { lastDate } = yield select(state=>state.projCostBudgetExecuteManage);
      let beginDate = null;
      let endDate = null;
      //月统计开始时间，结束时间都是最近有数据的时间
      if(stateParam === '1'||stateParam === '4'){
        beginDate = lastDate;
        endDate = lastDate;
      }
      //年统计，开始时间是最近有数据的年的一月；结束时间是最近有数据的时间
      else if( stateParam === '2'){
        beginDate = moment(lastDate.format("YYYY")+'-01');
        endDate = lastDate;
      }
      //项目至今统计，结束时间为最近有数据的时间，开始时间为2016年1月
      else if( stateParam === '3'){
        beginDate = moment('2016-01');
        endDate = lastDate;
      }
      //自定义，开始时间结束时间默认有数据的月份
      // else if( stateParam === '4'){
      //   beginDate = lastDate;
      //   endDate = lastDate;
      // }
      yield put({
        type: 'saveStateParam',
        payload:{
          beginTime:beginDate,
          endTime:endDate,
        }
      });
      yield put({
        type: 'getProjList',
        ou
      });
      yield put({
        type: 'queryProjectBudgetGoing',
        ou,projCode,stateParam
      });
    },
    //改变时间，首先查询项目名称，如果选中的projcode在projlist中。
    *changeDate({ou,beginTime,endTime,projCode,stateParam},{put}){
      yield put({
        type: 'saveStateParam',
        payload:{
          beginTime,
          endTime,
        }
      });
      yield put({
        type:'getProjList',
        ou
      });
      yield put({
        type:'queryProjectBudgetGoing',
        ou,
        projCode,
        stateParam,
      })
    },
    *cost_BP_detail_query_comp({ou, stateParam, projCode},{call, put, select}){
      const {beginTime, endTime} = yield select(state=>state.projCostBudgetExecuteManage)
      const postData = {
        arg_userid: localStorage.userid,
        arg_start_year: beginTime.format("YYYY-MM").split('-')[0],
        arg_start_month: beginTime.format("YYYY-MM").split('-')[1],
        arg_end_year: endTime.format("YYYY-MM").split('-')[0],
        arg_end_month: endTime.format("YYYY-MM").split('-')[1],
        arg_total_type: stateParam,
        arg_ou: ou,
        arg_projcode: projCode
      }
      const {RetCode,DataRows} = yield call(costService.cost_BP_detail_query_comp,postData)
      if(RetCode === '1'){
        DataRows.length && DataRows.map((item,index)=>item.key = index + 1)
        const columns_BP = [
          {
            title: '序号',
            dataIndex: 'key',
            width: 80
          },
          {
            title: 'ou',
            dataIndex: 'ou',
            width: 170
          },
          {
            title: '部门',
            dataIndex: 'dept_name',
            width: 150
          },
          {
            title: '费用名称',
            dataIndex: 'fee_name',
            width: 200
          },
          {
            title: '费用',
            dataIndex: 'fee',
            width: 80
          }
        ]
        yield put({
          type: 'save',
          payload: {
            dataSource_BP: DataRows,
            columns_BP
          }
        })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_proj_fullcost_mgt/cost_projbudgetgoing_mgt') {
          dispatch({type: 'initData'});
          dispatch({ type: 'init',query });
        }
      });
    },
  },
}


