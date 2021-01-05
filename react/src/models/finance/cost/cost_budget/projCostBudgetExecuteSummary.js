/**
 * 作者：张楠华
 * 创建日期：2017-11-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：财务-全成本-项目全成本管理-项目全成本预算执行情况管理
 */
import {message} from 'antd';
import * as costService from '../../../../services/finance/costService';
import config  from '../../../../utils/config';
import {HideTextComp,MoneyComponent} from '../../../../routes/finance/cost/costCommon.js';
export default {
  namespace: 'projCostBudgetExecuteSummary',
  state: {
    moduleId: [],
    ouList: [],
    list: [],
    projList:[],
    projInfoOne:[],
    dataSource_BP: [],
    columns_BP: []
  },
  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：保存ModuleId数据
     */
    save(state,action) {
      return { ...state, ...action.payload};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：保存ModuleId数据
     */
    saveData(state,action) {
      return { ...state, ...action.payload};
    },
  },
  effects: {
    *init({},{call,put}){
      let userId = localStorage.userid;
      let tenantId = config.COST_TENANT_ID;
      let routerUrl = config.COST_FULL_CPBG_BYMONTH_Q;
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
            projInfoOne:[],
            projList:[],
            dataSource_BP: [],
            columns_BP: []
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
            type: 'save',
            payload:{
              ouList:data.DataRows
            }
          });
        }
        let postData3 = {};
        postData3['argou'] = localStorage.ou;
        //查询最近有数据的年月
        let {max_year} = yield call(costService.ouFullCostLastDate,postData3);
        yield put({
          type: 'save',
          payload:{
            lastDate: max_year
          }
        });
        let postData2 = {};
        postData2['argou'] = localStorage.ou;
        postData2['argyear'] = max_year;
        let { DataRows } = yield call(costService.getProjList,postData2);
        yield put({
          type: 'save',
          payload:{
            projList:DataRows
          }
        });
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：根据OU和年份获取项目名称列表
     */
      *getProjList({ou,QYearMonth},{call,put}){
      let postData = {};
      postData['argou'] = ou;
      postData['argyear'] = QYearMonth;
      let projListData = yield call(costService.getProjList,postData);
      yield put({
        type: 'save',
        payload:{
          projList:projListData.DataRows,
          list:[],
          projInfoOne:[]
        }
      });
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：查询项目全成本预算执行情况
     */
      *queryProjectBudgetGoing({projCode,yearMonth},{select,call,put}){
      let year1 = yearMonth;
      let moduleId1 = yield select(state=>state.projCostBudgetExecuteSummary.moduleId);
      let postData = {};
      postData['argmoduleid'] = moduleId1;
      postData['arguserid'] = localStorage.userid;
      postData['argtenantid'] = config.COST_TENANT_ID;
      postData["arg_total_year"] = year1;
      postData["arg_proj_code"] = projCode;
      if(projCode !== '请选择项目名称'){
        let data = yield call(costService.queryProjectBudgetGoingAll,postData);

        if(data.RetCode === '0'){
          message.info('没有查到数据');
          yield put({
            type: 'saveData',
            payload:{
              projInfoOne:[],
              list:[]
            }
          });
        }else{
          let arr = []
          let temp = data.DataRows.filter(item =>item.ou === '合计')[0];
          data.DataRows.map(item=>{
            if (item.ou !== '合计'){
              arr.push(item)
            }
          })
          arr.push(temp)
          yield put({
            type: 'saveData',
            payload:{
              projInfoOne:data,
              list:arr
            }
          });
        }
      }
    },
    /**
     * 作者：郝锐
     * 创建日期：2020-10-21
     * 功能：BP专项详情查询
     */
    *cost_BP_detail_query({projCode,year,ou},{call,put}){
      const postdata = {
        arg_userid: localStorage.userid,
        arg_projcode: projCode,
        arg_year: year,
        arg_ou: ou
      }
      
      let columns = [
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
          title: '1月',
          dataIndex : 'Jan',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '2月',
          dataIndex: 'Feb',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '3月',
          dataIndex: 'Mar',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '4月',
          dataIndex: 'Apr',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '5月',
          dataIndex: 'May',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '6月',
          dataIndex: 'Jun',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '7月',
          dataIndex: 'Jul',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '8月',
          dataIndex: 'Aug',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '9月',
          dataIndex: 'Sep',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '10月',
          dataIndex: 'Oct',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '11月',
          dataIndex: 'Nov',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        },
        {
          title: '12月',
          dataIndex: 'Dec',
          width: 80,
          render: (text)=><MoneyComponent text={text}/>
        }
      ]
      const {RetCode,DataRows} = yield call(costService.cost_BP_detail_query,postdata)
      if(RetCode === '1'){
        DataRows.length && DataRows.map((item,index)=>item.key = index)
        yield put({
          type: 'save',
          payload: {
            dataSource_BP: DataRows,
            columns_BP: columns
          }
        })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_proj_fullcost_mgt/cost_projbudgetgoingbyyear_mgt') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
}



