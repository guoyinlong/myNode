/**
 * 作者：邓广晖
 * 创建日期：2017-11-07
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目执行中报告管理新增月报服务
 */
import * as projServices from '../../../../services/project/projService';
import {message} from 'antd';
//import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import moment from 'moment';

moment.locale('zh-cn');

export default {
  namespace:'projReportAdd',

  state:{
    earnData:[],             /*挣值数据*/
    workPlanThisMonth:'',    /*本月工作计划*/
    workPlanNextMonth:'',    /*下个月工作计划*/
    progressOffset:'',       /*进度偏差分析*/
    costOffset:'',           /*成本偏差分析*/
    shareCostThis:'',        /*本期分摊成本*/
    shareCostAll:'',         /*累计分摊成本*/
    staffTotalLast:'',       /*上期人员数量*/
    staffTotalThis:'',       /*本期人员数量*/
    staffTotalChange:'',     /*本期人员变化*/
    mark:'',                 /*备注*/
    queryData:{},            /*url查询参数*/
    mileStoneList:[],        /*里程碑列表*/
    mileStoneFinishState:'', /*里程碑完成情况*/
    purchaseCostTypeList:[], /*采购成本类型列表*/
    purchaseCostTableData:[],/*采购成本表格数据*/
    operateCostTypeList:[],  /*运行成本类型列表*/
    operateCostTableData:[], /*运行成本表格数据*/
    carryOutCostTypeList:[], /*实施成本类型列表*/
    carryOutCostTableData:[],/*实施成本表格数据*/
    humanCostData:[],        /*人工成本数据,一般只有一条数据*/
    mileStoneState:'notChange', /*里程碑变更状态*/
    mileStoneTagVal:'',         /*里程碑提示语*/
    mileDataLoading:false,      /*里程碑加载状态*/
    mileStoneProgressIsEmpty:false,  //里程碑权重是否为空
    currentAC:'',             /*当月ac值*/
    allPvDataList:[],         /*所有pv值*/
    currentPv:'',             /*当月pv值*/
    allCostList:[],           /*所有费用（四种成本）的列表*/
    mileInitFail:false,       /*里程碑初始化是否失败*/
    hasFullCostCount:false,   /*全成本是否出账，没有出账不让新增*/
    fullCostVal:'',           /*全成本出账时的提示语句*/
  },

  reducers:{
    save(state, action) {
      return {...state,...action.payload};
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-10
     * 功能：初始化数据
     */
    initData(){
      return {
        earnData:[],             /*挣值数据*/
        workPlanThisMonth:'',    /*本月工作计划*/
        workPlanNextMonth:'',    /*下个月工作计划*/
        progressOffset:'',       /*进度偏差分析*/
        costOffset:'',           /*成本偏差分析*/
        shareCostThis:'',        /*本期分摊成本*/
        shareCostAll:'',         /*累计分摊成本*/
        staffTotalLast:'',       /*上期人员数量*/
        staffTotalThis:'',       /*本期人员数量*/
        staffTotalChange:'',     /*本期人员变化*/
        mark:'',                 /*备注*/
        queryData:{},            /*url查询参数*/
        mileStoneList:[],        /*里程碑列表*/
        mileStoneFinishState:'', /*里程碑完成情况*/
        purchaseCostTypeList:[], /*采购成本类型列表*/
        purchaseCostTableData:[],/*采购成本表格数据*/
        operateCostTypeList:[],  /*运行成本类型列表*/
        operateCostTableData:[], /*运行成本表格数据*/
        carryOutCostTypeList:[], /*实施成本类型列表*/
        carryOutCostTableData:[],/*实施成本表格数据*/
        humanCostData:[],        /*人工成本数据,一般只有一条数据*/
        mileStoneState:'notChange', /*里程碑变更状态*/
        mileStoneTagVal:'',         /*里程碑提示语*/
        mileDataLoading:false,      /*里程碑加载状态*/
        mileStoneProgressIsEmpty:false,  //里程碑权重是否为空
        currentAC:'',             /*当月ac值*/
        allPvDataList:[],         /*所有pv值*/
        currentPv:'',             /*当月pv值*/
        allCostList:[],           /*所有费用（四种成本）的列表*/
        mileInitFail:false,       /*里程碑初始化是否失败*/
      }
    },
  },

  effects:{
    /**
     * 作者：邓广晖
     * 创建日期：2017-11-10
     * 功能：挣值数据统计
     * @param query url请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *earnDataStatistic({query},{call,put}){
      let postData = {
        transjsonarray:JSON.stringify({
          condition:{
            proj_id:query.proj_id,
            tag:'2'
          },
          sequence:[{"year":"0"},{"month":"0"}]
        })
      };
      let data = yield call(projServices.earnDataStatistic,postData);
      if(data.DataRows.length){
        for(let i = 0; i < data.DataRows.length; i++){
          data.DataRows[i].key = i;
          data.DataRows[i].pv = (Number(data.DataRows[i].pv)/10000).toFixed(2);
          data.DataRows[i].ev = (Number(data.DataRows[i].ev)/10000).toFixed(2);
          data.DataRows[i].ac = (Number(data.DataRows[i].ac)/10000).toFixed(2);
          data.DataRows[i].spi = Number(data.DataRows[i].spi).toFixed(2);
          data.DataRows[i].cpi = Number(data.DataRows[i].cpi).toFixed(2);
        }
        yield put({
          type:'save',
          payload:{earnData:data.DataRows}
        });
      }else{
        yield put({
          type:'save',
          payload:{earnData:[]}
        });
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-04
     * 功能：工作计划查询和偏差分析查询
     * @param query url请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *queryWorkPlanAndDeviation({query},{call,put}){
      //transjsonarray:{"condition":{"proj_id":"55","proj_month":"4"}}
      if(query.operateType === 'view'){
        let postData = {
          transjsonarray:JSON.stringify({
            condition:{
              proj_id:query.proj_id,
              proj_month:query.monthFromProjStart
            }
          })
        };
        const data = yield call(projServices.queryWorkPlanAndDeviation,postData);
        if(data.RetCode === '1' && data.DataRows.length){
          yield put({
            type:'save',
            payload:{
              workPlanThisMonth:data.DataRows[0].this_month,    /*本月主要工作*/
              workPlanNextMonth:data.DataRows[0].next_month,    /*下个月工作计划*/
              progressOffset:data.DataRows[0].progress_offset,  /*进度偏差分析*/
              costOffset:data.DataRows[0].cost_offset,          /*成本偏差分析*/
              shareCostThis:data.DataRows[0].share_cost_this,   /*本期分摊成本*/
              shareCostAll:data.DataRows[0].share_cost_all,     /*累计分摊成本*/
              staffTotalLast:data.DataRows[0].staff_total_last, /*上期人员数量*/
              staffTotalThis:data.DataRows[0].staff_total_this, /*本期人员数量*/
              staffTotalChange:data.DataRows[0].staff_total_change,/*本期人员变化*/
              mileStoneFinishState:data.DataRows[0].ev,            /*里程碑完成度*/
              mark:data.DataRows[0].mark,                          /*备注*/
            }
          });
        }
      }else if(query.operateType === 'add'){
        let postData = {
          transjsonarray:JSON.stringify({
            condition:{
              proj_id:query.proj_id,
              proj_month:query.monthFromProjStart,
              tag:'0'
            }
          })
        };
        const data = yield call(projServices.queryWorkPlanAndDeviation,postData);
        if(data.RetCode === '1' && data.DataRows.length){
          yield put({
            type:'save',
            payload:{
              workPlanThisMonth:data.DataRows[0].this_month,      /*本月主要工作*/
              workPlanNextMonth:data.DataRows[0].next_month,      /*下个月工作计划*/
              progressOffset:data.DataRows[0].progress_offset,    /*进度偏差分析*/
              costOffset:data.DataRows[0].cost_offset,            /*成本偏差分析*/
              //shareCostThis:data.DataRows[0].share_cost_this,   /*本期分摊成本，新增时去  直接成本里获取数据*/
              //shareCostAll:data.DataRows[0].share_cost_all,     /*累计分摊成本，新增时去  直接成本里获取数据*/
              //staffTotalLast:data.DataRows[0].staff_total_last, /*上期人员数量*/
              //staffTotalThis:data.DataRows[0].staff_total_this, /*本期人员数量*/
              //staffTotalChange:data.DataRows[0].staff_total_change,/*本期人员变化*/
              //mileStoneFinishState:data.DataRows[0].ev,            /*里程碑完成度，需要通过权重计算，见 changeMileAndEarnData*/
              mark:data.DataRows[0].mark,                            /*备注*/
            }
          });
        }else{
          yield put({
            type:'save',
            payload:{
              workPlanThisMonth:undefined,    /*本月主要工作*/
              workPlanNextMonth:undefined,    /*下个月工作计划*/
              progressOffset:undefined,       /*进度偏差分析*/
              costOffset:undefined,           /*成本偏差分析*/
              mark:undefined,                 /*备注*/
            }
          });
        }
        //查询上期人员数量
        let lastPostData = {
          transjsonarray:JSON.stringify({
            condition:{
              proj_id:query.proj_id,
              proj_month:(Number(query.monthFromProjStart) - 1).toString(),
              tag:'1'
            }
          })
        };
        const lastData = yield call(projServices.queryWorkPlanAndDeviation,lastPostData);
        if(lastData.RetCode === '1'){
          let staffTotalLast = '0';
          if(lastData.DataRows.length){
            if('staff_total_this' in lastData.DataRows[0]){
              staffTotalLast = lastData.DataRows[0].staff_total_this;
            }
          }
          //查询本期人员数量
          //transjsonarray:{"condition":{"proj_id":"55","tag":"0","is_out":"0"}}
          let thisMemberPostData = {
            transjsonarray:JSON.stringify({
              condition:{
                proj_id:query.proj_id,
                tag:'0',
                is_out:'0'
              }
            })
          };
          const thisMemberData = yield call(projServices.queryMemberNum,thisMemberPostData);
          if(thisMemberData.RetCode === '1'){
            yield put({
              type:'save',
              payload:{
                staffTotalLast:staffTotalLast,
                staffTotalThis:thisMemberData.RowCount,
                staffTotalChange:(Number(thisMemberData.RowCount) - Number(staffTotalLast)).toString()
              }
            });
          }
        }
      }

      //判断全程本是否出账，只有出完帐的才能提交月报--------------新增的限制
      let fullCostCountPostData = {
        arg_month:query.actualMonth,
        arg_proj_code:query.proj_code,
        arg_year:query.actualYear
      };
      const fullCostCountdata =  yield call(projServices.queryDirectCostManageNewAdd,fullCostCountPostData);
      if(fullCostCountdata.RetCode === '1'){
        if(fullCostCountdata.ac_flag === '0'){
          yield put({
            type:'save',
            payload:{
              hasFullCostCount:false,
              fullCostVal:fullCostCountdata.RetVal,
            }
          });
        }else{
          yield put({
            type:'save',
            payload:{
              hasFullCostCount:true,
              fullCostVal:'',
            }
          });
        }
      }

    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-04
     * 功能：保存url的查询参数
     * @param query url请求参数
     * @param put 返回reducer
     */
    *saveQueryData({query},{put}){
      yield put({
        type:'save',
        payload:{
          queryData:query
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-04
     * 功能：查询里程碑历史
     * @param query url请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *queryMileStoneHistory({query},{call,put}){
      let actualMonth = parseInt(query.actualMonth);
      let standardMonth = actualMonth < 10 ? '0'+query.actualMonth : query.actualMonth;
      let postData = {
        transjsonarray:JSON.stringify({
          property:{
            proj_id:"proj_id",
            mile_name:"mile_name",
            progress:"initVal"
          },
          condition:{
            proj_id:query.proj_id,
            year:query.actualYear,
            month:standardMonth,
            tag:'1'
          }
        })
      };
      //里程碑加载数据旋转
      yield put({
        type:'save',
        payload:{
          mileDataLoading:true
        }
      });
      const data = yield call(projServices.queryMileStoneHistory,postData);
      if(data.RetCode === '1') {
        yield put({
          type:'save',
          payload:{
            mileStoneList:data.DataRows
          }
        });
        yield put({
          type:'save',
          payload:{
            mileDataLoading:false
          }
        });
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-04
     * 功能：查询新增里程碑的信息
     * @param query url请求参数
     * @param call 请求服务
     * @param select 获取model的state
     * @param put 返回reducer
     */
    *queryMileStone({},{select,call,put}){
      let {queryData} = yield select(state =>state.projReportAdd);
      //arg_flag=2&arg_proj_id=55
      //里程碑加载数据旋转
      yield put({
        type:'save',
        payload:{
          mileDataLoading:true
        }
      });
      //首先查询里程碑状态
      const data = yield call(projServices.queryMileStoneState,{arg_flag: '2',arg_proj_id:queryData.proj_id});
      if(data.tag === '1' || data.tag ==='3'){
        yield put({
          type:'save',
          payload:{
            mileStoneState:'change',
            mileStoneTagVal:data.tagVal,
          }
        });
        //message.error('项目里程碑信息正在变更，请等待里程碑审核通过后再填写月报!');
      }else{
        yield put({
          type:'save',
          payload:{
            mileStoneState:'notChange',
            mileStoneTagVal:'',
          }
        });
      }

      //查询里程碑
      let actualMonth = parseInt(queryData.actualMonth);
      let standardMonth = actualMonth < 10 ? '0'+queryData.actualMonth : queryData.actualMonth;
      let milePostData = {
        //arg_month=09&arg_proj_id=55&arg_year=2017
        arg_month:standardMonth,
        arg_proj_id:queryData.proj_id,
        arg_year:queryData.actualYear
      };
      const mileData = yield call(projServices.queryAddReportMileStone,milePostData);
      if(mileData.RetCode === '1') {
        yield put({
          type:'save',
          payload:{
            mileStoneList:mileData.DataRows,
            mileInitFail:false
          }
        });
      }else{
        yield put({
          type:'save',
          payload:{mileInitFail:true}
        });
        //message.error("里程碑信息初始化失败，请检查该项目是否添加里程碑信息！");
      }
      //关闭里程碑旋转
      yield put({
        type:'save',
        payload:{
          mileDataLoading:false
        }
      });

      //所有pv值
      let pvPostData = {
        transjsonarray:JSON.stringify({
          condition:{
            proj_id:queryData.proj_id,
            tag:'0'
          },
          sequence:[{"year":"0"},{"month":"0"}]
        })
      };
      const pvRestData = yield call(projServices.allPvDataQuery,pvPostData);
      let currentPv = '0';
      for(let i = 0; i < pvRestData.DataRows.length; i++){
        if(pvRestData.DataRows[i].year === queryData.actualYear && pvRestData.DataRows[i].month === queryData.actualMonth){
          currentPv = pvRestData.DataRows[i].pv;
          break;
        }
      }
      yield put({
        type:'save',
        payload:{
          allPvDataList:pvRestData.DataRows,
          currentPv:currentPv
        }
      });

      //计算里程碑完成度和添加当月的挣值数据
      yield put({
        type:'changeMileAndEarnData',
        opt_type:'search'
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-19
     * 功能：计算里程碑完成度和添加当月的挣值数据
     * @param opt_type 里程碑编辑时，挣值数据操作类型 （search,edit）,search代表初始化查询的计算操作，edit代表编辑时的计算操作
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *changeMileAndEarnData({opt_type},{select,put}){
      let mileStoneProgressIsEmpty = false;
      let {mileStoneList,queryData,earnData,currentAC,currentPv} = yield select(state =>state.projReportAdd);
      let mileStoneFinishState = 0;
      for(let i = 0;i < mileStoneList.length;i++){
        if(mileStoneList[i].progress === null || mileStoneList[i].progress === undefined){
          //message.error('里程碑权重为空，请先补全里程碑信息再填写月报！');
          mileStoneFinishState = 0;
          mileStoneProgressIsEmpty = true;
          break;
        }
        mileStoneFinishState += Number(mileStoneList[i].initVal) * Number(mileStoneList[i].progress);
      }

      yield put({
        type:'save',
        payload:{
          mileStoneFinishState:(mileStoneFinishState/100).toFixed(2),
          mileStoneProgressIsEmpty:mileStoneProgressIsEmpty
        }
      });
      //添加挣值数据
      let obj = {
        year:queryData.actualYear,
        month:queryData.actualMonth,
        pv:(Number(currentPv)/10000).toFixed(2),
        ev:((mileStoneFinishState/100 * queryData.replace_money)/100/10000).toFixed(2),
        ac:(Number(currentAC)/10000).toFixed(2),
        spi:((mileStoneFinishState/100 * queryData.replace_money)/100/Number(currentPv)).toFixed(2),
        cpi:((mileStoneFinishState/100 * queryData.replace_money)/100/Number(currentAC)).toFixed(2),
      };

      //如果是末尾月份，添加到末尾
      if(opt_type === 'search'){
        earnData.push(obj);
      }else if(opt_type === 'edit'){
        earnData.pop();
        earnData.push(obj);
      }

      /*//如果是中间月份，添加在中间
      if(earnData.length > Number(queryData.monthFromProjStart)){
        if(opt_type === 'search'){
          earnData.splice(Number(queryData.monthFromProjStart)-1,0,obj);
        }else if(opt_type === 'edit'){
          earnData.splice(Number(queryData.monthFromProjStart)-1,1,obj);
        }
      }else{
        //如果是末尾月份，添加到末尾
        if(opt_type === 'search'){
          earnData.push(obj);
        }else if(opt_type === 'edit'){
          earnData.pop();
          earnData.push(obj);
        }
      }*/

      for(let j = 0; j < earnData.length; j++){
        earnData[j].key = j;
      }
      yield put({
        type:'save',
        payload:{
          earnData:JSON.parse(JSON.stringify(earnData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-19
     * 功能：改变里程碑的进度值
     * @param value 输入值
     * @param index 输入框索引
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *changeMileValue({value,index},{select,put}){
      let {mileStoneList} = yield select(state =>state.projReportAdd);
      mileStoneList[index].initVal = value;
      yield put({
        type:'save',
        payload:{
          mileStoneList:JSON.parse(JSON.stringify(mileStoneList))
        }
      });
      //计算里程碑完成度和添加当月的挣值数据
      yield put({
        type:'changeMileAndEarnData',
        opt_type:'edit'
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-04
     * 功能：查询直接成本管理数据
     * @param query url请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *queryDirectCostManage({query},{call,put}){
      let postData = {};
      let data = {};
      if(query.operateType === 'view'){
        //如果是查看月报的查询
        postData = {
          transjsonarray:JSON.stringify({
            condition:{
              proj_id:query.proj_id,
              year:query.actualYear,
              month:query.actualMonth
            }
          })
        };
        data =  yield call(projServices.queryDirectCostManageView,postData);
      }else if(query.operateType === 'add'){
        //如果是查看新增月报的查询
        postData = {
          arg_month:query.actualMonth,
          arg_proj_code:query.proj_code,
          arg_year:query.actualYear
        };
        data =  yield call(projServices.queryDirectCostManageNewAdd,postData);
        //新增月报时，本期分摊成本和累计分摊成本从这里获取，查看月报时从 queryWorkPlanAndDeviation 查询
        if(data.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              shareCostThis:data.proj_indirect_cost_month?data.proj_indirect_cost_month:'0', //本期分摊成本
              shareCostAll:data.proj_indirect_cost_proj?data.proj_indirect_cost_proj:'0',    //累计分摊成本
              currentAC:data.total_fee_ac?data.total_fee_ac:'0',                             //当月ac值
              allCostList:data.DataRows,                                                     //所有费用（三种成本）的列表
            }
          });
          //成本费用结束后在查里程碑
          yield put({type:'queryMileStone'});
        }
      }
      //const data =  yield call(projServices.queryDirectCostManage,postData);
      //查看月报和新增共用
      if(data.RetCode === '1'){
        let purchaseCostTypeList = [];  //采购成本类型列表
        let purchaseCostTableData = []; //采购成本表格数据
        let operateCostTypeList = [];   //运行成本类型列表
        let operateCostTableData = [];  //运行成本表格数据
        let carryOutCostTypeList = [];  //实施成本类型列表
        let carryOutCostTableData = []; //实施成本表格数据
        let humanCostData = [];         //人工成本数据,一般只有一条数据
        if(data.DataRows.length){
          let purchaseFeeIndex = 0;
          let purchaseObj1 = {intro:'本月',key:'0'};
          let purchaseObj2 = {intro:'累计',key:'1'};
          let operateFeeIndex = 0;
          let operateObj1 = {intro:'本月',key:'0'};
          let operateObj2 = {intro:'累计',key:'1'};
          let carryOutFeeIndex = 0;
          let carryOutObj1 = {intro:'本月',key:'0'};
          let carryOutObj2 = {intro:'累计',key:'1'};
          for(let i = 0; i < data.DataRows.length; i++){
            if(data.DataRows[i].fee_subtype === '0'){
              //判断是否为采购成本
              purchaseCostTypeList.push(data.DataRows[i].fee_name);
              purchaseObj1['fee' + purchaseFeeIndex.toString()] = data.DataRows[i].month_fee;  //本月费用
              purchaseObj2['fee' + purchaseFeeIndex.toString()] = data.DataRows[i].fee;        //累计费用
              purchaseFeeIndex++;
            }else if(data.DataRows[i].fee_subtype === '3'){
              //判断是否为运行成本
              operateCostTypeList.push(data.DataRows[i].fee_name);
              operateObj1['fee' + operateFeeIndex.toString()] = data.DataRows[i].month_fee;  //本月费用
              operateObj2['fee' + operateFeeIndex.toString()] = data.DataRows[i].fee;        //累计费用
              operateFeeIndex++;
            }else if(data.DataRows[i].fee_subtype === '1'){
              //判断是否为实施成本
              carryOutCostTypeList.push(data.DataRows[i].fee_name);
              carryOutObj1['fee' + carryOutFeeIndex.toString()] = data.DataRows[i].month_fee;  //本月费用
              carryOutObj2['fee' + carryOutFeeIndex.toString()] = data.DataRows[i].fee;        //累计费用
              carryOutFeeIndex++;
            }else if(data.DataRows[i].fee_subtype === '2'){
              //判断是否为人工成本
              humanCostData.push(data.DataRows[i]);
            }
          }
          purchaseCostTableData.push(purchaseObj1,purchaseObj2);
          operateCostTableData.push(operateObj1,operateObj2);
          carryOutCostTableData.push(carryOutObj1,carryOutObj2);
          yield put({
            type:'save',
            payload:{
              purchaseCostTypeList:purchaseCostTypeList,
              purchaseCostTableData:purchaseCostTableData,
              operateCostTypeList:operateCostTypeList,
              operateCostTableData:operateCostTableData,
              carryOutCostTypeList:carryOutCostTypeList,
              carryOutCostTableData:carryOutCostTableData,
              humanCostData:humanCostData
            }
          });
        }else{
          yield put({
            type:'save',
            payload:{
              purchaseCostTypeList:purchaseCostTypeList,
              purchaseCostTableData:purchaseCostTableData,
              operateCostTypeList:operateCostTypeList,
              operateCostTableData:operateCostTableData,
              carryOutCostTypeList:carryOutCostTypeList,
              carryOutCostTableData:carryOutCostTableData,
              humanCostData:humanCostData
            }
          });
        }

      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-04
     * 功能：改变文本域
     * @param value 输入框值
     * @param optType 输入框类型
     * @param put 返回reducer
     */
    *setTextArea({value,optType},{put}){
      yield put({
        type:'save',
        payload:{
          [optType]:value
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-20
     * 功能：保存或者提交数据
     * @param opt_type 保存或者提交  save 为保存，submit为提交
     * @param select 获取model的state
     * @param call 请求服务
     * @param put 返回reducer
     */
    *saveOrSubmit({opt_type},{call,select,put}){
      let {queryData} = yield select(state =>state.projReportAdd);
      let stateData = yield select(state =>state.projReportAdd);
      //let actualMonth = parseInt(queryData.actualMonth);
      //let standardMonth = actualMonth < 10 ? '0'+queryData.actualMonth : queryData.actualMonth;
      //提交之前先判断是否能操作
      /*if(opt_type === 'submit') {
        if(stateData.mileStoneState === 'change'){
          message.error('项目里程碑信息正在变更，请等待里程碑审核通过后再填写月报!');
          return;
        }else if(stateData.mileStoneProgressIsEmpty === true){
          message.error('里程碑权重为空，请先补全里程碑信息再填写月报！');
          return;
        }else if(stateData.currentPv === '0' || stateData.currentPv === '' || stateData.currentPv === undefined ){
          message.error('项目当月PV值为空，请检查项目是否配置投资替代额！');
          return;
        }else if(stateData.currentAC === '0' || stateData.currentAC === '' || stateData.currentAC === undefined ){
          message.error('项目当月AC值为空，项目产生人工成本数据后方可填写月报！');
          return;
        }else if(queryData.replace_money === '0' || queryData.replace_money === '' || queryData.replace_money === undefined ){
          message.error('项目投资替代额为空，请先配置投资替代额！');
          return;
        }else if(stateData.mileInitFail === true){
          message.error("里程碑信息初始化失败，请检查该项目是否添加里程碑信息！");
          return;
        }
      }*/

      if(stateData.mileStoneProgressIsEmpty === true){
        message.error('里程碑权重为空，请先补全里程碑信息再填写月报！');
        return;
      }else if(queryData.replace_money === undefined || Number(queryData.replace_money) === 0 ){
        message.error('项目投资替代额为空，请先配置投资替代额！');
        return;
      }else if(stateData.mileInitFail === true){
        message.error("里程碑信息初始化失败，请检查该项目是否添加里程碑信息！");
        return;
      }

      let postData = {
        arg_proj_id:queryData.proj_id,                //  必传
        arg_opt_byid:Cookie.get('userid'),            //  必传
        arg_opt_byname:Cookie.get('username'),        //  当前登录人的姓名  必传
        arg_year:queryData.actualYear,                //  当前年  必传
        arg_month:queryData.actualMonth,              //  当前月  必传
        arg_sort_month:queryData.monthFromProjStart,  //  当前月是项目的第几月 必传
        arg_start_time: queryData.monthStartTime,     //  必传
        arg_end_time: queryData.monthEndTime,         //  必传
      };

      postData.arg_this_month_plan = stateData.workPlanThisMonth?stateData.workPlanThisMonth:'';//本月工作计划
      postData.arg_next_month_plan = stateData.workPlanNextMonth?stateData.workPlanNextMonth:'';//下月工作计划
      postData.arg_cost_offset = stateData.costOffset?stateData.costOffset:'';                  //成本偏差分析
      postData.arg_progress_offset = stateData.progressOffset?stateData.progressOffset:'';      //进度偏差分析
      postData.arg_mark = stateData.mark?stateData.mark:'';//备注
      postData.arg_flag = opt_type === 'save'?'0':'1';                            //0保存、1提交  必传

      //里程碑数据
      let mileData = [];
      if(stateData.mileStoneState === 'notChange'){
        for(let i = 0; i < stateData.mileStoneList.length; i++){
          mileData.push({
            mile_id: stateData.mileStoneList[i].mile_id,
            mile_uid: stateData.mileStoneList[i].mile_uid,
            mile_name: stateData.mileStoneList[i].mile_name,
            progress: stateData.mileStoneList[i].initVal?(Number(stateData.mileStoneList[i].initVal)/100).toString():'0',
          });
        }
      }
      postData.arg_milestone_progress = JSON.stringify(mileData);


      //全成本数据，保存传（arg_cost_detail:[]），提交时候必传
      let fullCostData = [];

      //挣值数据,保存传（arg_earn_value:{}），提交时候必传
      let earnData = {};

      //提交增加的字段
      if(opt_type === 'submit') {
        if(stateData.workPlanThisMonth === undefined || stateData.workPlanThisMonth.trim() ===''){
          message.error('提交月报时，本月主要工作不能为空！');
          return;
        }
        if(stateData.mileStoneState === 'change'){
          message.error('项目里程碑信息正在变更，请等待里程碑审核通过后再填写月报!');
          return;
        }
        if( stateData.currentPv === undefined || Number(stateData.currentPv) === 0){
          message.error('项目当月PV值为空，请检查项目是否配置投资替代额！');
          return;
        }
        /*if(stateData.currentAC === undefined || Number(stateData.currentAC) === 0 ){
          message.error('项目当月AC值为空，项目产生人工成本数据后方可提交月报！');
          return;
        }*/
        if(stateData.hasFullCostCount === false){
          message.error('项目当月AC值为空，项目产生人工成本数据后方可提交月报！');
          return;
        }
        postData.arg_mile_total_progress = stateData.mileStoneFinishState; //里程碑完成情况，原来是ev
        postData.arg_share_cost_this = stateData.shareCostThis;            //本期分摊成本
        postData.arg_share_cost_all = stateData.shareCostAll;              //累计分摊成本
        postData.arg_staff_total_last = stateData.staffTotalLast;          //上期人员数量
        postData.arg_staff_total_this = stateData.staffTotalThis;          //本期人员数量
        postData.arg_staff_total_change = stateData.staffTotalChange;      //本期人员变化

        //全成本数据
        for(let k = 0; k < stateData.allCostList.length; k++){
          if('fee_subtype' in stateData.allCostList[k]){
            fullCostData.push({
              fee_name: stateData.allCostList[k].fee_name,
              fee_subtype: stateData.allCostList[k].fee_subtype,
              fee: stateData.allCostList[k].fee,
              month_fee: stateData.allCostList[k].month_fee,
              proj_id: queryData.proj_id,
              year: queryData.actualYear,
              month:queryData.actualMonth
            });
          }
        }
        //挣值数据
        let cpiData = '';
        //如果AC值为0
        if(Number(stateData.currentAC) === 0){
          cpiData = 'NaN';
        }else{
          cpiData = ((Number(stateData.mileStoneFinishState) * queryData.replace_money)/100/Number(stateData.currentAC)).toFixed(2);
        }
        earnData = {
          pv:stateData.currentPv,
          ev:((Number(stateData.mileStoneFinishState) * queryData.replace_money)/100).toFixed(2),
          ac:stateData.currentAC,
          spi:((Number(stateData.mileStoneFinishState) * queryData.replace_money)/100/Number(stateData.currentPv)).toFixed(2),
          cpi:cpiData,
        };

      }
      postData.arg_cost_detail = JSON.stringify(fullCostData);
      postData.arg_earn_value = JSON.stringify(earnData);

      //console.log('===================================postData');
      //console.log(postData);

      const resData = yield call(projServices.reportSaveOrSubmit,postData);
      if(resData.RetCode === '1'){
        if(opt_type === 'save'){
          message.info('保存成功');
        }else if(opt_type === 'submit'){
          message.info('提交成功');
          history.back();
          /*yield put(routerRedux.push({
            pathname: 'projectApp/projExecute/projReportAdd',
            query:{
              proj_id: queryData.proj_id,
              proj_name: queryData.proj_name,
              begin_time: queryData.begin_time,
              end_time: queryData.end_time,
              proj_code:queryData.proj_code,
              mgr_name:queryData.mgr_name,
              replace_money:queryData.replace_money,
              actualYear:queryData.actualYear,
              actualMonth:queryData.actualMonth,
              monthFromProjStart:queryData.monthFromProjStart,
              monthStartTime:queryData.monthStartTime,
              monthEndTime:queryData.monthEndTime,
              operateType:'view'
            }
          }));*/
        }
      }
    },

  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/projExecute/report/projReportAdd') {
          dispatch({type: 'initData'});
          dispatch({type: 'saveQueryData',query});
          dispatch({type: 'queryWorkPlanAndDeviation',query});
          dispatch({type: 'earnDataStatistic',query});
          dispatch({type: 'queryDirectCostManage',query});
          if(query.operateType === 'view'){
            dispatch({type: 'queryMileStoneHistory',query});
          }
        }
      });
    },
  }
}

