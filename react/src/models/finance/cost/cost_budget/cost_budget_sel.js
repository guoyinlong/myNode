/**
 * 作者：李杰双
 * 日期：2017/10/15
 * 邮件：282810545@qq.com
 * 文件说明：全成本预算查询数据
 */

import * as service from '../../../../services/finance/const_budget';
import Cookie from 'js-cookie';
import moment from 'moment'
import {message, Tooltip} from 'antd'

function MoneyComponent({text}) {
  return (
    <div style={{textAlign:'right',letterSpacing:1}}>{text
      ?parseFloat(text)===0?'-':format(parseFloat(text))
      :text
    }</div>
  )
}
function format (num) {
  return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

const cost_budeget_const={
  COST_BUDGET_Q: "/cost_budget_sel",  //全成本-项目全成本管理-项目全成本预算查询
  COST_BUDGET_M: "/cost_budget_ma",  //全成本-项目全成本管理-项目全成本预算查询(项目经理)
  COST_OU_VGTYPE: 2,//全成本选择ou
  columnList:[
    {
      title:'类别',
      dataIndex:'fee_name',
      width:200,
      fixed:'left',
      render:(text)=><Tooltip placement="top" title={text}>
        <div  style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',width:181}}>{text}</div>
      </Tooltip>
    },
    {
      title:'合计（预算金额）',
      dataIndex:'合计',
      width:150,
      render:(text)=><MoneyComponent text={text}/>
    },
    {
      title:'总院（预算金额）',
      dataIndex:'联通软件研究院本部',
      width:150,
      render:(text)=><MoneyComponent text={text}/>
    },
    {
      title:'哈尔滨分院（预算金额）',
      dataIndex:'哈尔滨软件研究院',
      width:150,
      render:(text)=><MoneyComponent text={text}/>
    },
    {
      title:'济南分院（预算金额）',
      dataIndex:'济南软件研究院',
      width:150,
      render:(text)=><MoneyComponent text={text}/>
    }
  ]
};

//const staff_id=Cookie.get('staff_id')
//const fullName=Cookie.get('username')

export default {
  namespace : 'cost_budget_sel',
  state : {
    list: [],
    query: {},
    OU:[],
    columnList:[
    ],
    syncAuthority:false
  },
  reducers : {
    clearData(){
      //debugger
      return {
        list: [],
        query: {},
        OU:[],
        columnList:[
        ],
        syncAuthority:false
      };
    },
    saveOU(state, {OU}){
      //debugger
      return {
        ...state,
        OU,
        ouCascader:OU.map((i)=>{
          return {value:i.dept_id,label:i.dept_name,isLeaf:false}
        })
      };
    },
    saveOuCascader(state, {ouCascader}){
      //debugger
      return {
        ...state,
        ouCascader
      };
    },
    syncAuthority(state, ){
      return {
        ...state,
        syncAuthority:true
      };
    },
    saveTable(state, {DataRows,columnList,dataOther}){
      //debugger
      let headArr=columnList.split(',')
      let cols=headArr.map((i,index)=>{
        if(index===headArr.length-1){
          return {
            title:i,
            dataIndex:i,
            width:150,
            fixed:'right',
            render:(text)=><MoneyComponent text={text}/>
          }
        }else{
          return {
            title:i,
            dataIndex:i,
            width:index===headArr.length-2?'auto':150,
            render:(text)=><MoneyComponent text={text}/>
          }
        }


      })
      //cols[cols.length-1].width='auto'
      for(let i=cols.length-1;i>=0;i--){
        if(!cols[i].fixed){
          continue
        }
        if(cols[i].fixed!=='right'){
          cols[i].width='auto';
          break
        }
      }
      return {
        ...state,
        list:DataRows.map((i,index)=>{return {...i,key:index}}),
        columnList:[...cost_budeget_const.columnList,...cols],
        dataOther
      };
    },

  },

  effects : {
    // *fetch({}, {call, put}) {
    //   let argtenantid=Cookie.get('tenantid'),arguserid=window.localStorage['sys_userid'];
    //   let { RetCode,moduleid } = yield call(service.p_userhasmodule,{
    //     argtenantid,
    //     arguserid,
    //     argrouterurl:cost_budeget_const.COST_BUDGET_Q
    //   });
    //   if(RetCode){
    //     let { DataRows } = yield call(service.p_usergetouordeptinmodule,{
    //       argtenantid,
    //       arguserid,
    //       argmoduleid:moduleid,
    //       argvgtype:cost_budeget_const.COST_OU_VGTYPE
    //     });
    //
    //     yield put({
    //       type: 'saveOU',
    //       OU:DataRows
    //     });
    //   }
    // },
    // *projname({targetOption},{call,put,select}){
    //   let {DataRows} = yield call(service.projname,{
    //     arguserid:window.localStorage['sys_userid'],
    //     argou:targetOption.label
    //   });
    //   targetOption.loading = false;
    //   if(!DataRows.length){
    //     targetOption.children=[
    //       {
    //         label:'无',
    //         value:'无',
    //         disabled:true
    //       }
    //     ]
    //   }else{
    //     targetOption.children = DataRows.map((i)=>{
    //       return {
    //         label:i.proj_name,
    //         value:i.proj_code,
    //
    //       }
    //     })
    //   }
    //
    //   let ouCascader=yield select(state => state.cost_budget_sel.ouCascader);
    //   yield put({
    //     type: 'saveOuCascader',
    //     ouCascader
    //   });
    //
    // },
    *projbudgetquery({selectedOptions},{call,put}){
      let data = yield call(service.projbudgetquery,{
        argou:'*',
        argprojname:selectedOptions.label,
        arguserid:window.localStorage['sys_userid'],
      });
      yield put({
        type: 'saveTable',
        DataRows:data.DataRows,
        columnList:data.columnList,
        dataOther:data
      });

    },
    *syncData({},{call,put}){
      let {RetCode} = yield call(service.sync,{
        userid:window.localStorage['sys_userid'],
      });
      if(RetCode==='1'){
        message.success('同步成功！')
      }else{
        message.error('同步失败！')
      }
    },
    *usergetmodule_grpsrv({argmoduleid},{call,put}){
      let {RetCode, DataRows} = yield call(service.usergetmodule_grpsrv,{
        arguserid:window.localStorage['sys_userid'],
        argtenantid:Cookie.get('tenantid'),
        argmoduleid

      });
      if(RetCode==='1'){
        if(DataRows.some(i=>i.fullurl==='/microservice/cosservice/cosprojbudget/allcost/cosprojbudgetsync')){
          yield put({
            type:'syncAuthority'
          })
        }

      }else{
        message.error('同步失败！')
      }
    },

  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname}) => {
        if (pathname === '/financeApp/financeCost/projCostManage/cost_budget_sel') {
          // dispatch({
          //   type:'fetch',
          //   // pageCondition:{arg_page_num:400, arg_start:0},
          // });
        }
      });

    },
  },
};
