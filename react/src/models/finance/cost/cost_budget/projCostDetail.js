/**
 * 作者：张楠华
 * 创建日期：2018-1-2
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：财务-全成本-项目全成本管理-项目成本明细
 */
import * as costService from '../../../../services/finance/costService';
import config  from '../../../../utils/config';
import { rightControl } from '../../../../components/finance/rightControl';
import { message } from 'antd';
const dateFormat='YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
/**
 * 作者：张楠华
 * 创建日期：2017-11-3
 * 功能：格式化数据
 */
function MoneyComponent({text}) {
  return (
    <div style={{textAlign:'right',letterSpacing:1}}>{text?format(parseFloat(text)):text}</div>
  )
}
function format (num) {
  return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
function TagDisplay(proj_tag) {
  if(proj_tag === '0')return 'TMO保存';
  else if(proj_tag === '2') return '已立项';
  else if(proj_tag === '4') return '已结项';
  else if(proj_tag === '5') return '历史完成';
  else if(proj_tag === '6') return '常态化项目';
  else if(proj_tag === '7') return '中止/暂停';
  else if(proj_tag === '8') return '删除';
  else  return '';
}
export default {
  namespace: 'projCostDetail',
  state: {
    stateParamList:[],
    lastDate: '',
    ouList:[],
    list:[],
    data:'',
    rightCrl : []
  },
  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：保存数据
     */
    save(state,action) {
      return { ...state, ...action.payload};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：获取数据并进行处理
     */
    getProjCostDetail(state, {data,DataRows}){//data columns DataRows list
      let columnsWidth;
      let columns = [];
      if(DataRows !== undefined){
        if(150+(Object.keys(DataRows[0]).length-1)*150 > 1050){
          // columns=[
          //   {
          //     title: '项目编号',
          //     fixed: 'left',
          //     children: [{
          //       title: '项目名称',
          //       children: [
          //         {
          //           title: "部门",
          //           width: 150,
          //           key: 'b',
          //           render: (text, record) => {return (<div style={{textAlign:'left',marginLeft:'15px'}}>{record.fee_name}</div>)}
          //         }
          //       ]
          //     }],
          //   }
          // ];
          columns=[{
            title:'成本名称',
            fixed:'left',
            width:150,
            key:'b',
            render: (text, record) => {return (record.fee_name==='项目成本合计'?<div style={{textAlign:'left'}}><b>{record.fee_name}</b></div>:<div style={{textAlign:'left'}}>{record.fee_name}</div>)}
          }]
        }else{
          // columns=[
          //   {
          //     title: '项目编号',
          //     children: [{
          //       title: '项目名称',
          //       children: [
          //         {
          //           title: "部门",
          //           width: 150,
          //           key: 'b',
          //           render: (text, record) => {return (<div style={{textAlign:'left',marginLeft:'15px'}}>{record.fee_name}</div>)}
          //         }
          //       ]
          //     }],
          //   }
          // ];

          columns=[{
            title:'成本名称',
            width:150,
            key:'b',
            render: (text, record) => {return (record.fee_name==='项目成本合计'?<div style={{textAlign:'left'}}><b>{record.fee_name}</b></div>:<div style={{textAlign:'left'}}>{record.fee_name}</div>)}
          }]
        }
      }
      let columnList = data;
      if( DataRows !== undefined){
        if(columnList){
          for(let i=0;i<columnList.length;i++){
            let deptName = JSON.parse(columnList[i].dept_name);
            let deptName1 = deptName.map((ii,index)=>{
              return({
                title: ii.dept_name,
                width: 200,
                key:i.toString()+index.toString(),
                render:(text,record)=><MoneyComponent text={record[columnList[i].proj_code+'::'+ii.dept_name]}/>
                // {return(record[columnList[i].proj_code+'::'+ii.dept_name])}
              })
            });
            columns.push({
              title: columnList[i].pms_code ? columnList[i].proj_code+'/'+columnList[i].pms_code:columnList[i].proj_code,
              children: [{
                title: columnList[i].proj_tag ? columnList[i].proj_name+'('+TagDisplay(columnList[i].proj_tag)+')':columnList[i].proj_name,
                children:deptName1
              }],
            })
          }
          columnsWidth=150+(Object.keys(DataRows[0]).length-1)*200;
        }
        return {
          ...state,
          columns,
          list:DataRows,
          columnsWidth
        }
      }else{
        return {
          ...state,
          columns:[],
          list:[],
        }
      }
    },
  },
  effects: {
    /**
     * 作者：张楠华
     * 创建日期：2018-1-3
     * 功能：初始化
     */
      *init({},{call,put}){
      //1 通过userid,tenantid,url查询mouduleid
      let userId = localStorage.userid;
      let tenantId = config.COST_TENANT_ID;
      let routerUrl = '/proj_cost_detail';
      let postData = {};
      postData["argtenantid"] = tenantId;
      postData["arguserid"] = userId;
      postData["argrouterurl"] = routerUrl;
      const moduleIdData = yield call(costService.costUserHasModule,postData);
      if(moduleIdData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            moduleId: moduleIdData.moduleid,
            ouList: [],
            list: [],
            columns:[],
          }
        });
        // 2 通过 moduleid查询ou
        let postData1 = {};
        postData1["argtenantid"] = config.COST_TENANT_ID;
        postData1["arguserid"] = localStorage.userid;
        postData1["argmoduleid"] = moduleIdData.moduleid;
        postData1["argvgtype"] = config.COST_OU_VGTYPE;
        const data = yield call(costService.costUserGetOU, postData1);
        if(data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              ouList:data.DataRows
            }
          });
        }
        //3 获取统计类型：月统计，年统计
        let postData2={};
        postData2["argstatetype"] = '2';
        postData2["argstatemode"] = '5';
        const stateParamData= yield call(costService.stateParamQuery, postData2);
        if(stateParamData.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              stateParamList:stateParamData.DataRows
            }
          });
        }
        //查询权限
        let postData5 = {};
        postData5['arguserid'] = localStorage.userid;
        postData5['argmoduleid'] =moduleIdData.moduleid;
        postData5['argtenantid'] = config.COST_TENANT_ID;
        const rightData1 = yield call(costService.userGetModule,postData5);
        yield put({
          type: 'save',
          payload:{
            rightCrl:rightData1.DataRows,
          }
        });
        // 4 查询最近有数据的月份
        let postData3 = {};
        postData3['arg_ou'] = localStorage.ou;
        //查询最近有数据的年月
        let {DataRows} = yield call(costService.ProjCostDetailLastDate,postData3);
        let max_year = DataRows[0].total_year;
        let max_month = DataRows[0].total_month;
        yield put({
          type: 'save',
          payload:{
            lastDate: moment(max_year+'-'+max_month,'YYYY-MM')
          }
        });
        yield put({
          type: 'getProjCostDetail',
          OU:localStorage.ou,
          yearMonth:moment(max_year+'-'+max_month,'YYYY-MM'),
          stateParam:"2",
          projType:'科研项目',
        });
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2018-1-3
     * 功能：查询项目成本明细
     */
      *getProjCostDetail({OU,yearMonth,stateParam,projType},{call,put}){
        if(yearMonth !== undefined){
          let year1 = yearMonth.format(dateFormat).split('-')[0];
          let Month1 = yearMonth.format(dateFormat).split('-')[1];
          let postData = {};
          postData["arg_total_month"] = Month1;
          postData["arg_total_year"] = year1;
          postData["arg_proj_type"] = projType;
          postData["arg_total_type"]=stateParam;
          postData['arg_ou'] = OU;
          let {DataRows,DataRows1,RetCode} = yield call(costService.searchProjCostDetail,postData);
           if(RetCode === '1'){
             yield put({
               type: 'getProjCostDetail',
               data:DataRows,
               DataRows:DataRows1 !== undefined ? JSON.parse(DataRows1):undefined,
             });
           }else{
             message.info('没有查到数据');
             yield put({
               type: 'getProjCostDetail',
               data:[],
               DataRows:[]
             });
           }
        }
    },
    /**
     * 作者：张楠华
     * 创建日期：2018-5-3
     * 功能：同步
     */
    *syn({yearMonth,OU,stateParam,projType},{call,put}){
      let postData = {};
      let year1 = yearMonth.format(dateFormat).split('-')[0];
      let month1 = yearMonth.format(dateFormat).split('-')[1];
      postData["arg_month"] = parseInt(month1);
      postData["arg_year"] = parseInt(year1);
      postData["arg_userid"] = localStorage.userid;
      let synData = yield call(costService.synProjCostDetail,postData);
      if (synData.RetCode === '1'){
        yield put({
          type: 'getProjCostDetail',
          OU:OU,
          yearMonth: yearMonth,
          stateParam:stateParam,
          projType:projType,
        });
        message.info('同步成功');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_proj_fullcost_mgt/proj_cost_detail') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
}


