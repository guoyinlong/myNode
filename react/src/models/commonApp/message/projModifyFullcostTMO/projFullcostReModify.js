/**
 * 作者：邓广晖
 * 创建日期：2018-04-10
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：TMO修改已立项的全成本数据后，TMO和审核人查看待办、已办、办结的共用model
 */

import * as projServices from '../../../../services/project/projService';
import config from '../../../../utils/config';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import {getUuid} from '../../../../components/commonApp/commonAppConst.js';
import {message} from 'antd';
import {getOuBussinessId,isInArray} from '../../../../routes/project/projConst';

/**
 * 作者：邓广晖
 * 创建日期：2017-11-24
 * 功能：改变OU值，主要是将 联通软件研究院  改为  联通软件研究院本部
 * @param name ou名
 */
function changeOuName(name){
  return name === config.OU_NAME_CN? config.OU_HQ_NAME_CN :name;
}


export default {
  namespace: 'projFullcostReModify',
  state: {
    queryData:{},
    /*以下为全成本数据*/
    yearListRowSpan:{},
    coorpDeptList:[],         /*配合部门列表*/
    coorpDeptListOriginal:[],
    allDeptList:[],           /*所有部门列表，第一个为主责部门*/
    deptBudgetList:[],        /*返回的部门预算数据*/
    deptBudgetListOriginal:[],
    deptBudgetTableData:[],   /*部门预算信息表格数据*/
    yearList:[],              /*显示的年份列表*/
    yearListOriginal:[],
    purchaseAllCostList:[],   /*采购成本类型列表*/
    operateAllCostList:[],    /*运行成本类型列表*/
    carryOutAllCostList:[],   /*实施成本类型列表*/
    fullCostYearList:[],      /*可添加的年份列表*/
    predictTimeTotal:'0',     /*预计工时综合*/
    allTableTotal:0,          /*预算合计*/
    verifierData:{},          /*审核时需要的数据*/
    verifierDataRet:false,    /*审核人列表数据是否已经返回*/
    /*以下为标题数据*/
    titleData:{},
    titleDetail:{},
    lastCheckId:'',

  },
  reducers: {
    initData(state){
      return {
        ...state,
        queryData:{},
        /*以下为全成本数据*/
        yearListRowSpan:{},
        coorpDeptList:[],         /*配合部门列表*/
        coorpDeptListOriginal:[],
        allDeptList:[],           /*所有部门列表，第一个为主责部门*/
        deptBudgetList:[],        /*返回的部门预算数据*/
        deptBudgetListOriginal:[],
        deptBudgetTableData:[],   /*部门预算信息表格数据*/
        yearList:[],              /*显示的年份列表*/
        yearListOriginal:[],
        purchaseAllCostList:[],   /*采购成本类型列表*/
        operateAllCostList:[],    /*运行成本类型列表*/
        carryOutAllCostList:[],   /*实施成本类型列表*/
        fullCostYearList:[],      /*可添加的年份列表*/
        predictTimeTotal:'0',     /*预计工时综合*/
        allTableTotal:0,          /*预算合计*/
        verifierData:{},          /*审核时需要的数据*/
        verifierDataRet:false,    /*审核人列表数据是否已经返回*/
        /*以下为标题数据*/
        titleData:{},
        titleDetail:{},
        lastCheckId:'',
      }
    },

    save(state,action){
      return { ...state, ...action.payload};
    }
  },
  effects: {

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：初始化查询
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *initQuery({},{call,put,select}){
      const {queryData} = yield select(state => state.projFullcostReModify);
      //  查询标题数据
      let titlePostData = {
        arg_proj_id:queryData.arg_proj_id,
        arg_check_id:queryData.arg_check_id,
        arg_tag:queryData.arg_tag,                        //当前用户是什么角色，3是提交人角色，4审核人角色
        arg_handle_flag:queryData.arg_handle_flag,        //必传，0待办/1已办/3办结
      };

      const titleRetData = yield call(projServices.queryTmoModifyFullcostTitle,titlePostData);
      if (titleRetData.RetCode === '1') {
        yield put ({
          type:'save',
          payload:{
            titleData:titleRetData,
            titleDetail:titleRetData.DataRows[0],
            lastCheckId:titleRetData.last_check_id
          }
        });
        yield put({
          type:'editFullCostQuery',
        });
      }
    },


    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：申请人查看待办-重新修改全成本时的的标题数据,在router页面使用
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *projFullcostTitle({},{call,put,select}){
      const {queryData} = yield select(state => state.projFullcostReModify);
      //  查询标题数据
      let titlePostData = {
        arg_proj_id:queryData.arg_proj_id,
        arg_check_id:queryData.arg_check_id,
        arg_tag:queryData.arg_tag,                        //当前用户是什么角色，3是提交人角色，4审核人角色
        arg_handle_flag:queryData.arg_handle_flag,        //必传，0待办/1已办/3办结
      };

      const titleRetData = yield call(projServices.queryTmoModifyFullcostTitle,titlePostData);
      if (titleRetData.RetCode === '1') {
        yield put ({
          type:'save',
          payload:{
            titleData:titleRetData,
            titleDetail:titleRetData.DataRows[0],
            lastCheckId:titleRetData.last_check_id
          }
        });
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：编辑全成本时初始化查询
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *editFullCostQuery({},{call,put,select}){
      const {queryData,lastCheckId} = yield select(state => state.projFullcostReModify);
      //queryData中已经包含arg_check_id,但此处尽量使用最新的lastCheckId
      // 1 查询配合部门数据，非对比数据
      let coorpDeptPostData = {
        arg_proj_id:queryData.arg_proj_id,
        arg_check_id:lastCheckId,            //必传，值来自于标题查询中的last_check_id
      };
      const coorpDeptData = yield call(projServices.queryTmoModifyFullcostCoorDept,coorpDeptPostData);
      if(coorpDeptData.RetCode === '1'){
        coorpDeptData.DataRows.map((i,index)=>{
          if('mgr_name' in i){
            i.opt_type='search';   //查询出来的配合部门标记为 search
            i.key=index;           //为没一条记录添加一个 key
          }else{
            i.opt_type='search';
            i.key=index;
            i.mgr_name = '';       //配合部门没有字段时，设置为空
          }
          return i;
        });
        yield put({
          type:'save',
          payload:{
            coorpDeptList:coorpDeptData.DataRows,
            coorpDeptListOriginal:JSON.parse(JSON.stringify(coorpDeptData.DataRows))
          }
        });
      }

      // 2 查询所有部门列表,第一个为主责部门,同时，这个服务里面包含项目的开始年份和结束年份
      let allDeptPostData = {
        arg_proj_id:queryData.arg_proj_id,
        arg_check_id:lastCheckId,      //必传，值来自于标题查询中的last_check_id
      };
      const allDeptData = yield call(projServices.queryTmoModifyFullcostAllDept,allDeptPostData);

      // 3 查询每个部门的预算，非对比数据
      let budgetPostData = {
        arg_proj_id:queryData.arg_proj_id,
        arg_check_id:lastCheckId,      //必传，值来自于标题查询中的last_check_id
        arg_query_flag:'1',                   //arg_query_flag  0:对比，1：非对比
      };
      const deptBudgetData = yield call(projServices.queryTmoModifyFullcostBudget,budgetPostData);

      //确定返回的预算中的年份
      let bugetYearList = [];
      for(let i = 0; i < deptBudgetData.DataRows.length; i++){
        if(!isInArray(bugetYearList,deptBudgetData.DataRows[i].year)){
          bugetYearList.push(deptBudgetData.DataRows[i].year);
        }
      }

      //数据存储的项目采购成本总列表
      let purchasePostData = {transjsonarray:JSON.stringify({
          "condition":{"fee_subtype":"0"},
          "sequence":[{"index_num":"0"}]
      })};
      let purchaseAllCostData = yield call(projServices.queryCostList,purchasePostData);
      //数据存储的项目实施成本总列表
      let carryOutPostData = {transjsonarray:JSON.stringify({
          "condition":{"fee_subtype":"1"},
          "sequence":[{"index_num":"0"}]
      })};
      let carryOutAllCostData = yield call(projServices.queryCostList,carryOutPostData);
      //数据存储的项目运行成本总列表
      let operatePostData = {transjsonarray:JSON.stringify({
          "condition":{"fee_subtype":"3"},
          "sequence":[{"index_num":"0"}]
      })};
      let operateAllCostData = yield call(projServices.queryCostList,operatePostData);

      allDeptData.DataRows.map((i)=>{i.opt_type='search';return i});
      for(let budgeIndex = 0; budgeIndex < deptBudgetData.DataRows.length; budgeIndex++){
        deptBudgetData.DataRows[budgeIndex].opt_type = 'search';
        deptBudgetData.DataRows[budgeIndex].proj_uid = queryData.arg_proj_uid;
      }
      //deptBudgetData.DataRows.map((i)=>{i.opt_type='search';i.proj_uid=uuid;return i});
      //purchaseAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});
      //carryOutAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});

      /*计算可添加的年份*/
      let fullCostYearList = [];
      //年的索引，先从开始时间的年份开始算起
      let yearIndex = parseInt(allDeptData.projBeginYear);
      //将结束时间作为结束标志
      let yearEndTagIndex = parseInt(allDeptData.projEndYear);
      //如果年份索引不超过开始年份，进行添加
      while (yearIndex <= yearEndTagIndex) {
        fullCostYearList.push(yearIndex.toString());
        yearIndex++;
      }

      //显示的年份，取预算和所有年份的并集
      let yearList = [];
      for(let bi = 0; bi < bugetYearList.length; bi++){
        if(!isInArray(yearList,bugetYearList[bi])){
          yearList.push(bugetYearList[bi]);
        }
      }
      for(let fi = 0; fi < fullCostYearList.length; fi++){
        if(!isInArray(yearList,fullCostYearList[fi])){
          yearList.push(fullCostYearList[fi]);
        }
      }

      yield put({
        type:'save',
        payload:{
          allDeptList:allDeptData.DataRows,
          deptBudgetList:deptBudgetData.DataRows,
          deptBudgetListOriginal:JSON.parse(JSON.stringify(deptBudgetData.DataRows)),
          yearList:yearList,
          yearListOriginal:JSON.parse(JSON.stringify(yearList)),
          purchaseAllCostList:purchaseAllCostData.DataRows,
          carryOutAllCostList:carryOutAllCostData.DataRows,
          operateAllCostList:operateAllCostData.DataRows,
          fullCostYearList:fullCostYearList
        }
      });
      //转变数据
      yield put({
        type:'convertFullCostData',
        isFirstTime:true
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：转变数据
     * @param put 返回reducer
     * @param select 获取model的state
     * @param isFirstTime 是否是第一次转换
     */
    *convertFullCostData({isFirstTime},{put,select}){
      let {yearList,allDeptList,deptBudgetList,queryData} = yield select(state=>state.projFullcostReModify);
      yearList = yearList.sort();   //年份需要排序
      allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
      deptBudgetList = deptBudgetList.filter(item => item.opt_type !== 'delete');
      //计算所有工时之和
      let predictTimeTotal = 0;
      for(let indexp = 0 ; indexp < deptBudgetList.length; indexp++){
        if(deptBudgetList[indexp].fee_type === '0' && deptBudgetList[indexp].fee_subtype === '-1'){
          predictTimeTotal += Number(deptBudgetList[indexp].fee);
        }
      }
      //查询每一个年份下的费用类型个数，首先要确定三级目录的个数
      let yearListRowSpan = {};
      //yearListRowSpan = {2016:{yearRowSpan:x,
      //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
      //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx(采购)费用之和
      //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
      //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
      //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
      //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy（实施）费用之和
      //                         humanCostTotal:[12,67]         // 每个部门的人工成本
      //                         predictTimeTotal:[3,7]         //每个部门的预计工时
      //                   2017:{yearRowSpan:x,
      //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
      //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx费用之和
      //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
      //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
      //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
      //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy费用之和
      //                         humanCostTotal:[12,67]         // 每个部门的人工成本
      //                         predictTimeTotal:[3,7]         //每个部门的预计工时
      //                  }
      if(yearList.length){
        //计算年份的rowspan
        for(let yearIndex = 0 ; yearIndex < yearList.length; yearIndex++){
          //预计工时，直接成本，项目采购成本，项目运行成本，项目实施成本，项目人工成本默认存在，yearRowSpan 默认加 6
          let yearRowSpan = 0;
          let purchaseCostList = [];   //项目采购成本列表
          let operateCostList = [];    //项目运行成本列表
          let carryOutCostList = [];   //项目实施成本列表
          for(let cellDataIndex1 = 0; cellDataIndex1 < deptBudgetList.length; cellDataIndex1++){
            //先判断年
            if(yearList[yearIndex] === deptBudgetList[cellDataIndex1].year){
              //判断是否为直接成本，即fee_type = 1
              if(deptBudgetList[cellDataIndex1].fee_type === '1'){
                //判断是不是属于直接成本中的采购成本、运行成本或者实施成本，即fee_subtype = 0 ，3 或者 1
                if(deptBudgetList[cellDataIndex1].fee_subtype === '0'){
                  //如果不在列表里面才添加
                  if(!isInArray(purchaseCostList,deptBudgetList[cellDataIndex1].fee_name.trim())){
                    purchaseCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                  }
                }else if(deptBudgetList[cellDataIndex1].fee_subtype === '3'){
                  if(!isInArray(operateCostList,deptBudgetList[cellDataIndex1].fee_name.trim())){
                    operateCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                  }
                }else if(deptBudgetList[cellDataIndex1].fee_subtype === '1'){
                  if(!isInArray(carryOutCostList,deptBudgetList[cellDataIndex1].fee_name.trim())){
                    carryOutCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                  }
                }
              }
            }
          } //end for
          let purchaseDeptTotal = [];  //每个部门的所有xxxx费用之和的列表
          let operateDeptTotal = [];   //每个部门的所有zzzz费用之和的列表
          let carryOutDeptTotal = [];  //每个部门的所有yyyy费用之和的列表
          let humanCostTotal = [];          //项目人工成本列表（每个部门）
          let predictTimeTotal = [];         //每个部门的预计工时
          for(let deptIndexx = 0; deptIndexx < allDeptList.length; deptIndexx++) {
            let purchaseDeptValue = 0;
            let operateDeptValue = 0;
            let carryOutDeptValue = 0;
            let humanCostValue = 0;
            let predictTimeValue = 0;
            for(let cellDataIndexx = 0; cellDataIndexx < deptBudgetList.length; cellDataIndexx++){
              //首先判断单元格中的年份
              if(yearList[yearIndex] === deptBudgetList[cellDataIndexx].year &&
                allDeptList[deptIndexx].dept_name === deptBudgetList[cellDataIndexx].dept_name){
                //判断是否为直接成本，即fee_type = 1
                if(deptBudgetList[cellDataIndexx].fee_type === '1'){
                  if(deptBudgetList[cellDataIndexx].fee_subtype === '0'){
                    //判断是不是属于直接成本中的采购成本，即fee_subtype = 0
                    purchaseDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                  }else if(deptBudgetList[cellDataIndexx].fee_subtype === '3'){
                    //判断是不是属于直接成本中的运行成本，即fee_subtype = 3
                    operateDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                  }else if(deptBudgetList[cellDataIndexx].fee_subtype === '1'){
                    //判断是不是属于直接成本中的实施成本，即fee_subtype = 1
                    carryOutDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                  }else if(deptBudgetList[cellDataIndexx].fee_subtype === '2'){
                    //判断是不是属于直接成本中的人工成本，即fee_subtype =2
                    humanCostValue += Number(deptBudgetList[cellDataIndexx].fee);
                  }
                }else if(deptBudgetList[cellDataIndexx].fee_type === '0'){
                  if(deptBudgetList[cellDataIndexx].fee_subtype === '-1'){
                    predictTimeValue += Number(deptBudgetList[cellDataIndexx].fee);
                  }
                }
              }
            }
            purchaseDeptTotal.push(purchaseDeptValue.toFixed(2));
            operateDeptTotal.push(operateDeptValue.toFixed(2));
            carryOutDeptTotal.push(carryOutDeptValue.toFixed(2));
            humanCostTotal.push(humanCostValue.toFixed(2));
            predictTimeTotal.push(predictTimeValue.toFixed(1));
          }
          yearRowSpan = purchaseCostList.length + operateCostList.length + carryOutCostList.length + 6;
          yearListRowSpan[yearList[yearIndex]] = {
            yearRowSpan:yearRowSpan,
            purchaseCostList:purchaseCostList,
            purchaseDeptTotal:purchaseDeptTotal,
            operateCostList:operateCostList,
            operateDeptTotal:operateDeptTotal,
            carryOutCostList:carryOutCostList,
            carryOutDeptTotal:carryOutDeptTotal,
            humanCostTotal:humanCostTotal,
            predictTimeTotal:predictTimeTotal
          };
        }//end for year
      }

      /*将返回的预算数据转变成表格数据
      * */
      let deptBudgetTableData = [];
      let obj = {};
      let allTableTotal = 0;
      if(yearList.length){
        for(let yearIndex2 = 0 ; yearIndex2 < yearList.length; yearIndex2++){
          obj = {};
          //每一年的每一个费用项，要添加所有部门的数据
          //1.添加预计工时 fee_type =0 , fee_subtype = -1
          obj.year = yearList[yearIndex2];
          obj.yearRowSpan = yearListRowSpan[yearList[yearIndex2]].yearRowSpan;
          obj.fee_name = config.PREDICT_TIME;
          obj.no_pre_fee_name = config.NO_PREFIX_PREDICT;
          obj.padLeft = '0px';
          obj.feeType = '0';         //  0 代表预计工时，1 代表 预算
          obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
          let predictTime = 0;
          for(let i = 0; i<allDeptList.length; i++){
            let findPredictTime = false;
            for(let cellDataIndex2 = 0; cellDataIndex2 < deptBudgetList.length; cellDataIndex2++){
              //年相同就添加一条数据
              if(yearList[yearIndex2] === deptBudgetList[cellDataIndex2].year){
                if(deptBudgetList[cellDataIndex2].fee_type === '0' &&
                  deptBudgetList[cellDataIndex2].fee_subtype === '-1'){
                  if(allDeptList[i].dept_name === deptBudgetList[cellDataIndex2].dept_name){
                    if(isFirstTime === true){
                      obj['dept' + i.toString()] = Number(deptBudgetList[cellDataIndex2].fee).toFixed(1);
                    }else{
                      obj['dept' + i.toString()] = deptBudgetList[cellDataIndex2].fee;
                    }
                    predictTime += Number(deptBudgetList[cellDataIndex2].fee);
                    findPredictTime = true;
                    break;
                  }
                }
              }
            }//end for
            //如果没有这种类型的数据，数据源加一条
            if(findPredictTime === false){
              deptBudgetList.push({
                year:yearList[yearIndex2],
                fee_type:'0',
                fee_subtype:'-1',
                fee:'0.0',
                fee_name:config.NO_PREFIX_PREDICT,
                ou:changeOuName(allDeptList[i].dept_name.split('-')[0]),
                dept_name:allDeptList[i].dept_name,
                budget_uid:getUuid(32,62),
                opt_type:'insert',
                proj_uid:queryData.arg_proj_uid,
                dept_uid:allDeptList[i].dept_id,
              });
              //如果查询出来的没有预计工时，则新增0
              obj['dept' + i.toString()] = '0.0';
            }
          }//end for
          obj.total = predictTime.toFixed(1);
          deptBudgetTableData.push(obj);
          //添加预计工时end

          //2.添加直接成本
          obj = {};
          obj.year = yearList[yearIndex2];
          obj.yearRowSpan = 0;
          obj.fee_name = config.DIRECT_COST;
          obj.no_pre_fee_name = config.NO_PREFIX_DIRECT_COST;
          obj.not_edit = 'not_edit';
          obj.padLeft = '0px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
          obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
          let directCostTotal = 0;
          for(let j = 0; j<allDeptList.length; j++){
            let directCost = Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[j]) +
              Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[j]) +
              Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[j]) +
              Number(yearListRowSpan[yearList[yearIndex2]].humanCostTotal[j]);
            obj['dept'+j.toString()] = directCost.toFixed(2);
            directCostTotal += directCost;
          }//end for
          obj.total = directCostTotal.toFixed(2);
          deptBudgetTableData.push(obj);

          //2.1添加项目采购成本
          obj = {};
          obj.year = yearList[yearIndex2];
          obj.yearRowSpan = 0;
          obj.fee_name = config.PURCHASE_COST;
          obj.no_pre_fee_name = config.NO_PREFIX_PURCHASE_COST;
          obj.not_edit = 'not_edit';
          obj.can_add = 'can_add';
          obj.add_type = 'purchase';
          obj.padLeft = '10px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
          obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
          let purchaseAllTotal = 0;
          for(let k = 0; k < allDeptList.length; k++) {
            obj['dept' + k.toString()] = yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k];
            purchaseAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k]);
          }//end for
          obj.total = purchaseAllTotal.toFixed(2);
          deptBudgetTableData.push(obj);

          //2.1. 添加项目采购成本-子费用
          let purchaseCostTypeList = yearListRowSpan[yearList[yearIndex2]].purchaseCostList;
          for(let purchaseIndex = 0; purchaseIndex < purchaseCostTypeList.length; purchaseIndex++) {
            obj = {};
            obj.year = yearList[yearIndex2];
            obj.yearRowSpan = 0;
            obj.fee_name = '2.1.'+(purchaseIndex+1).toString()+purchaseCostTypeList[purchaseIndex];
            obj.no_pre_fee_name = purchaseCostTypeList[purchaseIndex];
            obj.padLeft = '30px';
            obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
            obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
            let purchaseTotal = 0;
            for(let p = 0; p < allDeptList.length; p++){
              let findPurchase = false;
              for(let cellDataIndex3 = 0; cellDataIndex3 < deptBudgetList.length; cellDataIndex3++){
                if(yearList[yearIndex2] === deptBudgetList[cellDataIndex3].year &&
                  purchaseCostTypeList[purchaseIndex].trim() === deptBudgetList[cellDataIndex3].fee_name.trim()){
                  if(deptBudgetList[cellDataIndex3].fee_type === '1' &&
                    deptBudgetList[cellDataIndex3].fee_subtype === '0'){
                    if(allDeptList[p].dept_name === deptBudgetList[cellDataIndex3].dept_name){
                      if(isFirstTime === true){
                        obj['dept'+p.toString()] = Number(deptBudgetList[cellDataIndex3].fee).toFixed(2);
                      }else{
                        obj['dept'+p.toString()] = deptBudgetList[cellDataIndex3].fee;
                      }
                      purchaseTotal += Number(deptBudgetList[cellDataIndex3].fee);
                      findPurchase = true;
                      break;
                    }
                  }
                }
              }//end for
              if(findPurchase === false){
                deptBudgetList.push({
                  year:yearList[yearIndex2],
                  fee_type:'1',
                  fee_subtype:'0',
                  fee:'0.00',
                  fee_name:purchaseCostTypeList[purchaseIndex],
                  ou:changeOuName(allDeptList[p].dept_name.split('-')[0]),
                  dept_name:allDeptList[p].dept_name,
                  budget_uid:getUuid(32,62),
                  opt_type:'insert',
                  proj_uid:queryData.arg_proj_uid,
                  dept_uid:allDeptList[p].dept_id,
                });
                obj['dept'+p.toString()] = '0.00';
              }
            }//end for
            obj.total = purchaseTotal.toFixed(2);
            deptBudgetTableData.push(obj);
          }

          //2.2添加项目运行成本
          obj = {};
          obj.year = yearList[yearIndex2];
          obj.yearRowSpan = 0;
          obj.fee_name = config.OPERATE_COST;
          obj.no_pre_fee_name = config.NO_PREFIX_OPERATE_COST;
          obj.not_edit = 'not_edit';
          obj.can_add = 'can_add';
          obj.add_type = 'operate';
          obj.padLeft = '10px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
          obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
          let operateAllTotal = 0;
          for(let m = 0; m < allDeptList.length; m++) {
            obj['dept' + m.toString()] = yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[m];
            operateAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[m]);
          }//end for
          obj.total = operateAllTotal.toFixed(2);
          deptBudgetTableData.push(obj);

          //2.2. 添加项目运行成本-子费用
          let operateCostTypeList = yearListRowSpan[yearList[yearIndex2]].operateCostList;
          for(let operateIndex = 0; operateIndex < operateCostTypeList.length; operateIndex++) {
            obj = {};
            obj.year = yearList[yearIndex2];
            obj.yearRowSpan = 0;
            obj.fee_name = '2.2.'+(operateIndex+1).toString()+operateCostTypeList[operateIndex];
            obj.no_pre_fee_name = operateCostTypeList[operateIndex];
            obj.padLeft = '30px';
            obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
            obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
            let operateTotal = 0;
            for(let p = 0; p < allDeptList.length; p++){
              let findOperate = false;
              for(let cellDataIndex33 = 0; cellDataIndex33 < deptBudgetList.length; cellDataIndex33++){
                if(yearList[yearIndex2] === deptBudgetList[cellDataIndex33].year &&
                  operateCostTypeList[operateIndex].trim() === deptBudgetList[cellDataIndex33].fee_name.trim()){
                  if(deptBudgetList[cellDataIndex33].fee_type === '1' &&
                    deptBudgetList[cellDataIndex33].fee_subtype === '3'){
                    if(allDeptList[p].dept_name === deptBudgetList[cellDataIndex33].dept_name){
                      if(isFirstTime === true){
                        obj['dept'+p.toString()] = Number(deptBudgetList[cellDataIndex33].fee).toFixed(2);
                      }else{
                        obj['dept'+p.toString()] = deptBudgetList[cellDataIndex33].fee;
                      }
                      operateTotal += Number(deptBudgetList[cellDataIndex33].fee);
                      findOperate = true;
                      break;
                    }
                  }
                }
              }//end for
              if(findOperate === false){
                deptBudgetList.push({
                  year:yearList[yearIndex2],
                  fee_type:'1',
                  fee_subtype:'3',
                  fee:'0.00',
                  fee_name:operateCostTypeList[operateIndex],
                  ou:changeOuName(allDeptList[p].dept_name.split('-')[0]),
                  dept_name:allDeptList[p].dept_name,
                  budget_uid:getUuid(32,62),
                  opt_type:'insert',
                  proj_uid:queryData.arg_proj_uid,
                  dept_uid:allDeptList[p].dept_id,
                });
                obj['dept'+p.toString()] = '0.00';
              }
            }//end for
            obj.total = operateTotal.toFixed(2);
            deptBudgetTableData.push(obj);
          }

          //2.3添加项目实施成本
          obj = {};
          obj.year = yearList[yearIndex2];
          obj.yearRowSpan = 0;
          obj.fee_name = config.CARRYOUT_COST;
          obj.no_pre_fee_name = config.NO_PREFIX_CARRYOUT_COST;
          obj.not_edit = 'not_edit';
          obj.can_add = 'can_add';
          obj.add_type = 'carryOut';
          obj.padLeft = '10px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
          obj.feeNameLevel = '2';    //  费用项的目录级别  1 2 3
          let carryOutAllTotal = 0;
          for(let ii = 0; ii < allDeptList.length; ii++) {
            obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii];
            carryOutAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii]);
          }//end for
          obj.total = carryOutAllTotal.toFixed(2);
          deptBudgetTableData.push(obj);

          //2.2. 添加项目采购成本-子费用
          let carryOutCostTypeList = yearListRowSpan[yearList[yearIndex2]].carryOutCostList;
          for(let carryOutIndex = 0; carryOutIndex<carryOutCostTypeList.length;carryOutIndex++) {
            obj = {};
            obj.year = yearList[yearIndex2];
            obj.yearRowSpan = 0;
            obj.fee_name = '2.3.'+(carryOutIndex+1).toString() + carryOutCostTypeList[carryOutIndex];
            obj.no_pre_fee_name = carryOutCostTypeList[carryOutIndex];
            obj.padLeft = '30px';
            obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
            obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
            let carryOutTotal = 0;
            for(let jj = 0; jj<allDeptList.length; jj++){
              let findCarryOut = false;
              for(let cellDataIndex4 = 0; cellDataIndex4 < deptBudgetList.length; cellDataIndex4++){
                if(yearList[yearIndex2] === deptBudgetList[cellDataIndex4].year &&
                  carryOutCostTypeList[carryOutIndex] === deptBudgetList[cellDataIndex4].fee_name.trim()){
                  if(deptBudgetList[cellDataIndex4].fee_type === '1' &&
                    deptBudgetList[cellDataIndex4].fee_subtype === '1'){
                    if(allDeptList[jj].dept_name === deptBudgetList[cellDataIndex4].dept_name){
                      if(isFirstTime === true){
                        obj['dept'+jj.toString()] = Number(deptBudgetList[cellDataIndex4].fee).toFixed(2);
                      }else{
                        obj['dept'+jj.toString()] = deptBudgetList[cellDataIndex4].fee;
                      }
                      carryOutTotal += Number(deptBudgetList[cellDataIndex4].fee);
                      findCarryOut = true;
                      break;
                    }
                  }
                }
              }//end for
              if(findCarryOut === false){
                deptBudgetList.push({
                  year:yearList[yearIndex2],
                  fee_type:'1',
                  fee_subtype:'1',
                  fee:'0.00',
                  fee_name:carryOutCostTypeList[carryOutIndex],
                  ou:changeOuName(allDeptList[jj].dept_name.split('-')[0]),
                  dept_name:allDeptList[jj].dept_name,
                  budget_uid:getUuid(32,62),
                  opt_type:'insert',
                  proj_uid:queryData.arg_proj_uid,
                  dept_uid:allDeptList[jj].dept_id,
                });
                obj['dept'+jj.toString()] = '0.00';
              }
            }//end for
            obj.total = carryOutTotal.toFixed(2);
            deptBudgetTableData.push(obj);
          }

          //2.4添加项目人工成本
          obj = {};
          obj.year = yearList[yearIndex2];
          obj.yearRowSpan = 0;
          obj.fee_name = config.HUMAN_COST;
          obj.no_pre_fee_name = config.NO_PREFIX_HUMAN_COST;
          obj.padLeft = '10px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
          obj.feeNameLevel = '2';    //  费用项的目录级别  1 2 3
          let humanCostTotal = 0;
          for(let b = 0; b<allDeptList.length; b++){
            let findHumanCost = false;
            for(let cellDataIndex5 = 0; cellDataIndex5 < deptBudgetList.length; cellDataIndex5++){
              if(yearList[yearIndex2] === deptBudgetList[cellDataIndex5].year){
                if(deptBudgetList[cellDataIndex5].fee_type === '1' &&
                  deptBudgetList[cellDataIndex5].fee_subtype === '2'){
                  if(allDeptList[b].dept_name === deptBudgetList[cellDataIndex5].dept_name){
                    if(isFirstTime === true){
                      obj['dept'+b.toString()] = Number(deptBudgetList[cellDataIndex5].fee).toFixed(2);
                    }else{
                      obj['dept'+b.toString()] = deptBudgetList[cellDataIndex5].fee;
                    }
                    humanCostTotal += Number(deptBudgetList[cellDataIndex5].fee);
                    findHumanCost = true;
                    break;
                  }
                }
              }
            }//end for
            if(findHumanCost === false){
              deptBudgetList.push({
                year:yearList[yearIndex2],
                fee_type:'1',
                fee_subtype:'2',
                fee:'0.00',
                fee_name:config.NO_PREFIX_HUMAN_COST,
                ou:changeOuName(allDeptList[b].dept_name.split('-')[0]),
                dept_name:allDeptList[b].dept_name,
                budget_uid:getUuid(32,62),
                opt_type:'insert',
                proj_uid:queryData.arg_proj_uid,
                dept_uid:allDeptList[b].dept_id,
              });
              obj['dept'+b.toString()] = '0.00';
            }
          }//end for
          obj.total = humanCostTotal.toFixed(2);
          deptBudgetTableData.push(obj);
        }//end for year

        //添加最后一行总计
        obj = {};
        obj.year = config.COST_ALL_TOTAL;
        obj.yearRowSpan = 1;
        obj.fee_name = '';
        obj.yearOptType = 'total';
        obj.not_input = 'not_input';
        obj.padLeft = '0px';
        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
        obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
        for(let de = 0; de<allDeptList.length; de++) {
          let allYearTotal = 0;
          for(let yi = 0; yi < yearList.length; yi++){
            allYearTotal += Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[de]) +
              Number(yearListRowSpan[yearList[yi]].operateDeptTotal[de]) +
              Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[de]) +
              Number(yearListRowSpan[yearList[yi]].humanCostTotal[de]);
          }
          allTableTotal += allYearTotal;
          obj['dept' + de.toString()] = allYearTotal.toFixed(2);
        }//end for
        obj.total = allTableTotal.toFixed(2);
        deptBudgetTableData.push(obj);
      }
      //deptBudgetTableData.map((i,index)=>{ i.key=index;return i});
      for(let indexd = 0; indexd < deptBudgetTableData.length; indexd++){
        deptBudgetTableData[indexd].key = indexd;
      }
      //如果是第一次查询，保存
      if (isFirstTime === true){
        yield put({
          type:'save',
          payload:{deptBudgetList:JSON.parse(JSON.stringify(deptBudgetList))}
        });
      }

      yield put({
        type:'save',
        payload:{
          deptBudgetTableData:JSON.parse(JSON.stringify(deptBudgetTableData)),
          yearList:JSON.parse(JSON.stringify(yearList)),
          //allDeptList:JSON.parse(JSON.stringify(allDeptList)),
          predictTimeTotal:predictTimeTotal.toFixed(1),
          yearListRowSpan:JSON.parse(JSON.stringify(yearListRowSpan)),
          allTableTotal:allTableTotal
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：添加配合部门
     * @param deptSelectData 已选中的部门
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *addCoorpDept({deptSelectData},{put,select}){
      let coorpDeptListTemp = [];
      let {queryData,coorpDeptList,allDeptList,deptBudgetList,yearList,yearListRowSpan} = yield select(state=>state.projFullcostReModify);
      //如果选了更多的配合部门，将新添加的配合部门添加到列表
      if(deptSelectData.length){
        let deptIsRepeated = false;
        //首先判断是否有与存在的部门重复，包括主责部门和配合部门
        for(let i = 0; i < deptSelectData.length; i++ ){
          if(deptSelectData[i].dept_name === allDeptList[0].dept_name){
            deptIsRepeated = true;
            message.error(deptSelectData[i].dept_name + '为主责部门，请重新添加');  //添加的配合部门不能为主责部门
            break;
          }
          //如果有配合部门，还需要和已经添加的配合进行对比，不能重复,同时需要去除类型为delete的
          if(coorpDeptList.length){
            for(let j = 0; j < coorpDeptList.length;j++){
              if(deptSelectData[i].dept_name === coorpDeptList[j].dept_name && coorpDeptList[j].opt_type !== 'delete'){
                deptIsRepeated = true;
                message.error(deptSelectData[i].dept_name + '已经存在，请重新添加');
                break;
              }
            }
            if(deptIsRepeated === true){
              break;
            }
          }
        }
        //如果没有重复的再进行添加
        if(deptIsRepeated === false){
          for(let i = 0; i < deptSelectData.length; i++ ){
            coorpDeptListTemp.push({
                dept_name:deptSelectData[i].dept_name,
                dept_uid:getUuid(32,62),
                key:coorpDeptList.length+i,
                proj_uid:queryData.arg_proj_uid,
                opt_type:'insert',
                mgr_name:'',
                ou:changeOuName(deptSelectData[i].dept_name.split('-')[0])
              }
            );
            //对于选中的每一个部门，将其添加到deptBudgetList
            for (let yi = 0; yi < yearList.length; yi++){
              //对于每一年，需要添加预计工时和各项直接成本，默认值都为0
              //1.添加预计工时
              deptBudgetList.push({
                year:yearList[yi],
                fee_type:'0',
                fee_subtype:'-1',
                fee:'0',
                fee_name:config.NO_PREFIX_PREDICT,
                dept_name:deptSelectData[i].dept_name,
                ou:changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                budget_uid:getUuid(32,62),
                opt_type:'insert',
                proj_uid:queryData.arg_proj_uid,
                dept_uid:deptSelectData[i].dept_id,
              });

              //2.添加直接成本中的采购成本
              let purchaseCostList = yearListRowSpan[yearList[yi]].purchaseCostList;
              for(let pi = 0; pi < purchaseCostList.length; pi++){
                deptBudgetList.push({
                  year:yearList[yi],
                  fee_type:'1',
                  fee_subtype:'0',
                  fee:'0',
                  fee_name:purchaseCostList[pi],
                  dept_name:deptSelectData[i].dept_name,
                  ou:changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                  budget_uid:getUuid(32,62),
                  opt_type:'insert',
                  proj_uid:queryData.arg_proj_uid,
                  dept_uid:deptSelectData[i].dept_id,
                });
              }

              //3.添加直接成本中的运行成本
              let operateCostList = yearListRowSpan[yearList[yi]].operateCostList;
              for(let oi = 0; oi < operateCostList.length; oi++){
                deptBudgetList.push({
                  year:yearList[yi],
                  fee_type:'1',
                  fee_subtype:'3',
                  fee:'0',
                  fee_name:operateCostList[oi],
                  dept_name:deptSelectData[i].dept_name,
                  ou:changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                  budget_uid:getUuid(32,62),
                  opt_type:'insert',
                  proj_uid:queryData.arg_proj_uid,
                  dept_uid:deptSelectData[i].dept_id,
                });
              }
              //4.添加直接成本中的实施成本
              let carryOutCostList = yearListRowSpan[yearList[yi]].carryOutCostList;
              for(let ci = 0; ci < carryOutCostList.length; ci++){
                deptBudgetList.push({
                  year:yearList[yi],
                  fee_type:'1',
                  fee_subtype:'1',
                  fee:'0',
                  fee_name:carryOutCostList[ci],
                  dept_name:deptSelectData[i].dept_name,
                  ou:changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                  budget_uid:getUuid(32,62),
                  opt_type:'insert',
                  proj_uid:queryData.arg_proj_uid,
                  dept_uid:deptSelectData[i].dept_id,
                });
              }
              //5.添加人工成本
              deptBudgetList.push({
                year:yearList[yi],
                fee_type:'1',
                fee_subtype:'2',
                fee:'0',
                fee_name:config.NO_PREFIX_HUMAN_COST,
                dept_name:deptSelectData[i].dept_name,
                ou:changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                budget_uid:getUuid(32,62),
                opt_type:'insert',
                proj_uid:queryData.arg_proj_uid,
                dept_uid:deptSelectData[i].dept_id,
              });
            }//end for year
          }
          coorpDeptList = coorpDeptList.concat(coorpDeptListTemp);
          allDeptList = allDeptList.concat(coorpDeptListTemp);
          yield put({
            type:'save',
            payload:{
              coorpDeptList:coorpDeptList,
              allDeptList:allDeptList,
              deptBudgetList:deptBudgetList
            }
          });
          //转变数据
          yield put({
            type:'convertFullCostData',
            isFirstTime:false
          });
        }
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：删除配合部门
     * @param deptSelectData 已选中的部门
     * @param put 返回reducer
     * @param call 请求服务
     * @param select 获取model的state
     */
      *deleteCoorpDept({index},{call,put,select}){
      let {coorpDeptList,allDeptList,deptBudgetList,titleData,queryData} = yield select(state=>state.projFullcostReModify);
      //先判断是否可以删除(1,该项目中已产生成本,2,该项目中尚有启用成员)
      if(coorpDeptList[index].opt_type !== 'insert'){
        let costPostData = {
          arg_proj_id: queryData.arg_proj_id,
          arg_ou: coorpDeptList[index].ou,
          arg_proj_code: titleData.proj_code,
          arg_dept_name: coorpDeptList[index].dept_name,
        };
        const costData = yield call(projServices.queryCostData,costPostData);
        if(costData.cos_delete_flag !== 'true'){
          message.error(coorpDeptList[index].dept_name+'在该项目中已产生成本，不能删除该部门！');
          return;
        }else{
          let memberPostData = {
            arg_proj_id: titleData.proj_id,
            arg_dept_name: coorpDeptList[index].dept_name,
            arg_tenantid: Cookie.get('tenantid')
          };
          const memberData = yield call(projServices.queryMemberData,memberPostData);
          if (memberData.RowCount !== '0') {
            message.error(coorpDeptList[index].dept_name+'在该项目中尚有启用成员，不能删除该部门！');
            return;
          }
        }
      }
      /*都没有问题，处理部门预算列表*/
      let deptBudgetListNew = [];
      for(let di = 0; di < deptBudgetList.length; di++){
        if(deptBudgetList[di].dept_name !== coorpDeptList[index].dept_name){
          //如果部门不相等，将其加入新列表
          deptBudgetListNew.push(deptBudgetList[di]);
        }else{
          //如果部门相等，查询出来的部门数据(search,delete,update)，将其加入New,将标志改为delete，如果是新加入的(insert)，不加入
          if(deptBudgetList[di].opt_type !== 'insert'){
            deptBudgetList[di].opt_type = 'delete';
            deptBudgetListNew.push(deptBudgetList[di]);
          }
        }
      }
      //处理配合部门
      if(coorpDeptList[index].opt_type !== 'insert'){
        coorpDeptList[index].opt_type = 'delete';
      }else{
        coorpDeptList.splice(index,1);
      }
      //处理所有部门
      if(allDeptList[index+1].opt_type !== 'insert'){
        allDeptList[index+1].opt_type = 'delete';
      }else{
        allDeptList.splice(index+1,1);
      }
      //处理之后将key值重排
      //coorpDeptList.map((item,indexc) => {item.key = indexc;return item});
      for(let i = 0; i < coorpDeptList.length; i++){
        coorpDeptList[i].key = i;
      }
      yield put({
        type:'save',
        payload:{
          deptBudgetList:JSON.parse(JSON.stringify(deptBudgetListNew)),
          coorpDeptList:JSON.parse(JSON.stringify(coorpDeptList)),
          allDeptList:JSON.parse(JSON.stringify(allDeptList))
        }
      });

      //转变数据
      yield put({
        type:'convertFullCostData',
        isFirstTime:false
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：删除配合部门
     * @param index 配合部门索引值
     * @param text 配合部门联系人文本
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *editCoorpMgrName({index,text},{put,select}){
      let {coorpDeptList,coorpDeptListOriginal} = yield select(state=>state.projFullcostReModify);
      //如果编辑的是查询出来的配合部门
      if(coorpDeptList[index].opt_type !== 'insert'){
        //如果配合部门联系人于最原始查出来的联系人不一样，将标志设置为 update
        if(text !== coorpDeptListOriginal[index].mgr_name ){
          coorpDeptList[index].opt_type = 'update';
        }else{
          //如果改过后，又改回原来的值
          coorpDeptList[index].opt_type = 'search';
        }
      }
      //不管是查询的配合部门还是新增的配合部门，修改了，就修改内容
      if(coorpDeptList[index].mgr_name !== text){
        coorpDeptList[index].mgr_name = text;
      }
      yield put({
        type: 'save',
        payload:{coorpDeptList:JSON.parse(JSON.stringify(coorpDeptList))}
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：编辑表格单元格数据
     * @param value 单元格数据
     * @param year 年份
     * @param deptName 部门
     * @param noPreFeeName 没有前缀的费用名
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *editCellData({value,year,deptName,noPreFeeName},{put,select}){
      let {deptBudgetList,deptBudgetListOriginal} = yield select(state=>state.projFullcostReModify);
      for(let i = 0; i < deptBudgetList.length; i++){
        if(deptBudgetList[i].year === year &&
          deptBudgetList[i].dept_name === deptName &&
          deptBudgetList[i].fee_name.trim() === noPreFeeName.trim()){
          //如果编辑的是查询出来的单元格
          if(deptBudgetList[i].opt_type !== 'insert'){
            if(Number(deptBudgetListOriginal[i].fee) !== Number(value)){
              deptBudgetList[i].opt_type = 'update';
            }else{
              deptBudgetList[i].opt_type = 'search';
            }
          }
          //不管是查询的单元格还是新增的单元格，内容修改了，就修改内容(包括 5.  5.0  5)
          if(deptBudgetList[i].fee !== value){
            deptBudgetList[i].fee = value;
          }
          break;
        }
      }
      yield put({
        type:'save',
        payload:{
          deptBudgetList:JSON.parse(JSON.stringify(deptBudgetList))
        }
      });
      //转变数据
      yield put({
        type:'convertFullCostData',
        isFirstTime:false
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：增加费用项
     * @param value 费用项的值
     * @param fee_type 费用主类型
     * @param fee_subtype 费用子类型
     * @param year 年份
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *addCostType({value,fee_type,fee_subtype,year},{put,select}){
      let {queryData,deptBudgetList,allDeptList} = yield select(state=>state.projFullcostReModify);
      allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
      for(let i = 0; i < allDeptList.length; i++){
        deptBudgetList.push({
          year:year,
          fee_type:fee_type,
          fee_subtype:fee_subtype,
          fee:'0',
          fee_name:value,
          dept_name:allDeptList[i].dept_name,
          ou:changeOuName(allDeptList[i].dept_name.split('-')[0]),
          budget_uid:getUuid(32,62),
          opt_type:'insert',
          proj_uid:queryData.arg_proj_uid,
          dept_uid:allDeptList[i].deptid,
        });
      }

      yield put({
        type:'save',
        payload:{
          deptBudgetList:JSON.parse(JSON.stringify(deptBudgetList)),
        }
      });
      //转变数据
      yield put({
        type:'convertFullCostData',
        isFirstTime:false
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：删除费用项
     * @param value 费用项
     * @param year 年份
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *deleteCostType({value,year},{put,select}){
      let {deptBudgetList} = yield select(state=>state.projFullcostReModify);
      let deptBudgetListNew = [];
      //如果删除的是新增的费用项，直接删除,即不添加到新的里面
      for(let i = 0; i < deptBudgetList.length; i++){
        if(deptBudgetList[i].year === year && deptBudgetList[i].fee_name.trim() === value){
          if(deptBudgetList[i].opt_type !== 'insert'){
            //如果删除的是查询出来的，opt_type 设为 delete
            deptBudgetList[i].opt_type = 'delete';
            deptBudgetListNew.push(deptBudgetList[i]);
          }
        }else{
          deptBudgetListNew.push(deptBudgetList[i]);
        }
      }
      yield put({
        type:'save',
        payload:{
          deptBudgetList:JSON.parse(JSON.stringify(deptBudgetListNew)),
        }
      });
      //转变数据
      yield put({
        type:'convertFullCostData',
        isFirstTime:false
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：添加年份费用项
     * @param value 费用项
     * @param year 年份
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *addYear({year},{put,select}){
      let {queryData,deptBudgetList,allDeptList,yearList} = yield select(state=>state.projFullcostReModify);
      yearList.push(year);
      allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
      //添加年份时，只添加1.预计工时  和  2.3项目人工成本
      for(let i = 0; i < allDeptList.length; i++){
        //添加预计工时
        deptBudgetList.push({
          year:year,
          fee_type:'0',
          fee_subtype:'-1',
          fee:'0',
          fee_name:config.NO_PREFIX_PREDICT,
          dept_name:allDeptList[i].dept_name,
          ou:changeOuName(allDeptList[i].dept_name.split('-')[0]),
          budget_uid:getUuid(32,62),
          opt_type:'insert',
          proj_uid:queryData.arg_proj_uid,
          dept_uid:allDeptList[i].deptid,
        });
        //添加项目人工成本
        deptBudgetList.push({
          year:year,
          fee_type:'1',
          fee_subtype:'2',
          fee:'0',
          fee_name:config.NO_PREFIX_HUMAN_COST,
          dept_name:allDeptList[i].dept_name,
          ou:changeOuName(allDeptList[i].dept_name.split('-')[0]),
          budget_uid:getUuid(32,62),
          opt_type:'insert',
          proj_uid:queryData.arg_proj_uid,
          dept_uid:allDeptList[i].deptid,
        });
      }//end for
      yield put({
        type:'save',
        payload:{
          yearList:yearList,
          deptBudgetList:JSON.parse(JSON.stringify(deptBudgetList))
        }
      });
      //转变数据
      yield put({
        type:'convertFullCostData',
        isFirstTime:false
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：删除年份费用项
     * @param value 费用项
     * @param year 年份
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *deleteYear({year},{put,select}){
      let {deptBudgetList,yearList} = yield select(state=>state.projFullcostReModify);
      yearList =  yearList.filter(item => item !== year);
      let deptBudgetListNew = [];
      //如果删除的是新增的年份，直接删除,即不添加到新的里面
      for(let i = 0; i < deptBudgetList.length; i++){
        if(deptBudgetList[i].year === year ){
          if(deptBudgetList[i].opt_type !== 'insert'){
            //如果删除的是查询出来的，opt_type 设为 delete
            deptBudgetList[i].opt_type = 'delete';
            deptBudgetListNew.push(deptBudgetList[i]);
          }
        }else{
          deptBudgetListNew.push(deptBudgetList[i]);
        }
      }
      yield put({
        type:'save',
        payload:{
          yearList:yearList,
          deptBudgetList:JSON.parse(JSON.stringify(deptBudgetListNew))
        }
      });
      //转变数据
      yield put({
        type:'convertFullCostData',
        isFirstTime:false
      });
    },


    /**
     * 作者：邓广晖
     * 创建日期：2018-04-08
     * 功能：提交时，预算数据发生变化后，选择审核人
     * @param put 返回reducer
     * @param call 请求服务
     * @param select 获取model的state
     */
    *submitGetVerifierData({},{call,put,select}){
      const {queryData,titleData,titleDetail} = yield select(state=>state.projFullcostReModify);
      yield put({
        type:'save',
        payload:{
          verifierDataRel:false
        }
      });
      //选择审核人列表
      /*let verifierPostData = JSON.parse(JSON.stringify(queryData));
      verifierPostData.arg_opt_byid = Cookie.get('userid');          //登陆人id，必传
      verifierPostData.arg_opt_byname = Cookie.get('username');      //登陆人姓名，必传
      verifierPostData.arg_page_type = '1';  //必传，此页面必传0（0是项目启动-项目基本信息-全成本，1是待办中全成本修改）

      //此处需要将url中传来的arg_check_id 改变成最新的数据 lastCheckId
      verifierPostData.arg_check_id = lastCheckId;*/

      let verifierPostData = {
        arg_proj_id:queryData.arg_proj_id,          //项目id,必传
        arg_task_uuid: queryData.arg_task_uuid,
        arg_proj_uid:queryData.arg_proj_uid,        // uuid,必传

        arg_page_type:'1',                          //必传，此页面必传0（0是项目启动-项目基本信息-全成本，1是待办中全成本修改）
        arg_opt_byid:Cookie.get('userid'),          //登陆人id，必传
        arg_opt_byname:Cookie.get('username'),

        arg_business_id:titleData.business_id,      //必传，00001总院，00002哈院，00003济院
        arg_check_id: titleData.last_check_id,

        arg_business_batchid:titleDetail.bussiness_batchid,
        arg_check_batch_id: titleDetail.check_batch_id,
        arg_exe_id: titleDetail.exe_id,
        arg_wf_task_id: titleDetail.wf_task_id,
        arg_link_id: titleDetail.link_id,
        arg_role_id: titleDetail.role_id,

      };

      const verifierData = yield call(projServices.getVerifierData,verifierPostData);
      if (verifierData.RetCode === '1') {
        yield put({
          type:'save',
          payload:{
            verifierData:verifierData,
            verifierDataRel:true
          }
        });
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-13
     * 功能：修改提交全成本
     * @param object_cos 配合部门和预算变化的数据
     * @param reasonValue 修改原因
     * @param verifierValue 审核人id
     * @param emaileValue 是否发送邮件
     * @param put 返回reducer
     * @param call 请求服务
     * @param select 获取model的state
     */
    *submitFullCostBudget({object_cos,reasonValue,verifierValue,emailValue},{call,put,select}){
      let {queryData,verifierData,titleData,titleDetail} = yield select(state=>state.projFullcostReModify);

      let fullCostSubmitPostData = {
        arg_proj_id: queryData.arg_proj_id,                   //项目id,必传
        arg_proj_uid: queryData.arg_proj_uid,                 // uuid,必传
        arg_task_uuid: queryData.arg_task_uuid,
        arg_task_batchid: queryData.arg_task_batchid,
        arg_task_wf_batchid: queryData.arg_task_wf_batchid,

        arg_opt_byid: Cookie.get('userid'),                   //登陆人id，必传
        arg_opt_byname: Cookie.get('username'),               //登陆人姓名，必传
        arg_change_reason: reasonValue,
        object_cos: JSON.stringify(object_cos),               //修改项


        arg_proj_name:titleData.proj_name,
        arg_check_id: titleData.last_check_id,                //使用最新的check_id
        arg_business_id: titleData.business_id,

        arg_business_batchid:titleDetail.bussiness_batchid,
        arg_check_batch_id:titleDetail.check_batch_id,
      };

      let verifierInfo = {};
      for (let i = 0; i < verifierData.DataRows.length; i++) {
        if (verifierValue === verifierData.DataRows[i].userid) {
          verifierInfo = verifierData.DataRows[i];
          break;
        }
      }
      fullCostSubmitPostData.arg_is_email = emailValue;               //是否发送邮件给审核人
      fullCostSubmitPostData.arg_checker_id = verifierInfo.userid;    //用户选择的审核人id，必传
      fullCostSubmitPostData.arg_checker_name = verifierInfo.username;//用户选择的审核人名称，必传
      fullCostSubmitPostData.arg_checker_email = verifierInfo.email;  //用户选择的审核人email

      fullCostSubmitPostData.arg_exe_id = verifierData.current_exe_id;
      fullCostSubmitPostData.arg_wf_task_id = verifierData.current_wf_task_id;
      fullCostSubmitPostData.arg_link_name = verifierData.current_link_name;   //当前环节名称
      fullCostSubmitPostData.arg_link_id = verifierData.current_link_id;       //当前环节id
      fullCostSubmitPostData.arg_role_id = verifierData.current_role_id;       //当前角色id
/*

      fullCostSubmitPostData.arg_exe_id = titleDetail.exe_id;
      fullCostSubmitPostData.arg_wf_task_id = titleDetail.wf_task_id;
      fullCostSubmitPostData.arg_link_name = titleDetail.link_name;   //当前环节名称
      fullCostSubmitPostData.arg_link_id = titleDetail.link_id;       //当前环节id
      fullCostSubmitPostData.arg_role_id = titleDetail.role_id;       //当前角色id
*/


      //console.log('===================fullCostSubmitPostData');
      //console.log(fullCostSubmitPostData);
      const fullCostSubmitData = yield call(projServices.applierReSubmit,fullCostSubmitPostData);
      if(fullCostSubmitData.RetCode === '1'){
        yield put(routerRedux.push({pathname: '/taskList'}));
        message.success('提交成功');
      }else if(fullCostSubmitData.RetCode === '-1'){
        message.error(fullCostSubmitData.RetVal);
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：点击返回时，将传进去的参数返回到原页面
     * @param query url的请求参数
     * @param put 返回reducer
     */
    *setQueryData({query},{put}){
      yield put({
        type: 'save',
        payload:{queryData:query}
      });
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname.indexOf('/projFullcostReModify') !== -1) {
          dispatch({type: 'initData'});
          dispatch({type: "setQueryData",query});
          dispatch({type: 'initQuery'});
          //dispatch({type: 'projFullcostTitle'});
          //dispatch({type: "editFullCostQuery"});
        }
      });
    }
  }

}
