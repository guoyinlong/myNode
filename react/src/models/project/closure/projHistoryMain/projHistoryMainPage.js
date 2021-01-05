/**
 * 作者：仝飞
 * 创建日期：2017-10-11.
 * 邮箱：tongf5@chinaunicom.cn
 * 文件说明：已立项项目信息的查询
 */
import * as projServices from '../../../../services/project/projService';
import config from '../../../../utils/config';
import Cookie from 'js-cookie';
import { message} from 'antd';

/**
 * 作者：邓广晖
 * 创建日期：2017-11-24
 * 功能：判断元素是否在数组中
 * @param arr 原数组
 * @param value 输入值
 */
function isInArray(arr,value){
  for(let i = 0; i < arr.length; i++){
    if(value === arr[i]){
      return true;
    }
  }
  return false;
}

export default {
  namespace: 'projHistoryMainPage',
  state: {
    mainProjList: [],
    proj_id: "",
    projectInfo: {},
    mileInfoList: [],
    fore_workload: '',
    attachmentList: [],
    checkLogList:[],
    queryData:{},
    display:false,//根据TMO项目权限判断是否展示【修改附件】
    // projOldInfo:{},
  },
  reducers: {
    mainProjSearch(state, { mainProjList: DataRows}) {
      return { ...state, mainProjList:DataRows};
    },
    saveProjId(state, { proj_id: proj_id}){
      return { ...state, proj_id:proj_id};
    },
    projectInfoSearch(state, { projectInfo}) {
      return {...state, projectInfo};
    },
    mileInfoSearch(state, {mileInfoList, fore_workload}) {
      return {
        ...state,
        mileInfoList,
        fore_workload
      };
    },
    saveAttachmentList(state,action){
      return { ...state, ...action.payload};
    },
    saveCheckLogList(state,action){
      return { ...state, ...action.payload};
    },
    save(state,action){
      return { ...state, ...action.payload};
    },

    // 根据TMO项目权限判断是否展示【修改附件】
    saveRole(state, { display: display}){
      return {...state,display: display};
    },

  },
  effects: {
    /**
     * 作者：仝飞
     * 创建日期：2017-10-11
     * 功能：主项目信息查询
     * @param query url的请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *mainProjQuery({query}, { call, put }) {
      const {DataRows} = yield call(projServices.getPrimaryProj);
      let proj_id= query.proj_id;
      yield put({
        type: 'mainProjSearch',
        mainProjList: DataRows,
      });
      yield put({
        type: 'saveProjId',
        'proj_id':proj_id,
      });
    },

    /**
     * 作者：仝飞
     * 创建日期：2017-10-11
     * 功能：项目基本信息查询
     * @param query url的请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *projectInfoQuery({query}, { call, put }) {
      let postData = {
        arg_proj_id: query.proj_id,
        arg_flag: 1
      };
      const {DataRows} = yield call(projServices.getprojectInfo, postData);
      if(DataRows.length && 'replace_money' in DataRows[0]){
        DataRows[0].replace_money = Number((Number(DataRows[0].replace_money)/10000).toFixed(6));
      }
      yield put({
        type: 'projectInfoSearch',
        projectInfo: DataRows[0],
      });
    },

    /**
     * 作者：仝飞
     * 创建日期：2017-10-11
     * 邓广晖 2018-05-04 修改 ，替换里程碑查询服务，并加入交付物信息
     * 功能：里程碑信息查询
     * @param query url的请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *mileInfoQuery({query}, {call, put }) {
      let milestonePostData = {
        arg_flag:'1',         //
        arg_mile_flag:'3',
        arg_proj_id:query.proj_id
      };
      const mileData = yield call(projServices.queryProjMilestoneInfo,milestonePostData);
      if(mileData.RetCode === '1'){
        //首先对数据进行处理，尤其是NaN的数据，将NaN的数据用[]空数组代替
        for(let i = 0; i < mileData.DataRows.length; i++){
          //为每一条里程碑添加一个key
          mileData.DataRows[i].key = i;
          let deliverables = mileData.DataRows[i].deliverables;
          if(deliverables !== 'NaN' && deliverables !== undefined){
            //将字符串中 [] 前后的引号去掉
            deliverables = deliverables.replace(/\:\"\[+/g, ':[');
            deliverables = deliverables.replace(/\]\"\}/g, ']}');
            deliverables = JSON.parse(deliverables);
            for(let j = 0; j < deliverables.length; j++){
              //为每一条交付物类别添加一个key
              deliverables[j].key = j;
              if(deliverables[j].files !== 'NaN' && deliverables[j].files !== undefined){
                let files = deliverables[j].files;
                for(let k = 0; k < files.length; k++){
                  //为每一个附件添加一个key
                  files[k].key = k;
                }
                deliverables[j].files = files;
              }else{
                deliverables[j].files = [];
              }
            }
          }else{
            deliverables = [];
          }
          mileData.DataRows[i].deliverables = deliverables;
        }
        yield put({
          type:'save',
          payload:{
            mileInfoList:mileData.DataRows,
            fore_workload:mileData.fore_workload
          }
        });
        //console.log('=============mileData.DataRows');
        //console.log(mileData.DataRows);
      }

      /*let postData = {
        arg_flag: 1,
        arg_proj_id:query.proj_id,
        arg_mile_flag: 1,     //历史项目时候arg_mile_flag=1   已立项的时候为0

      };
      const data = yield call(projServices.getMileInfo,postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'mileInfoSearch',
          mileInfoList: data.DataRows,
          fore_workload:data.fore_workload
        });
      }*/
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-16
     * 功能：已立项项目的全成本
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *searchHistoryFullcost({query},{call,put,select}){
      //查询配合部门列表
      let coorpDeptPostData = {
        arg_proj_id:query.proj_id,
        arg_tag:'2',                        /*2代表已立项项目*/
      };
      const coorpDeptData = yield call(projServices.projApproveCoorDeptQuery,coorpDeptPostData);
      if(coorpDeptData.RetCode === '1'){
        coorpDeptData.DataRows.map((i,index)=>{
          if('mgr_name' in i){
            i.key=index;           //为没一条记录添加一个 key
          }else{
            i.key=index;
            i.mgr_name = '';       //配合部门没有字段时，设置为空
          }
          return i;
        });
      }

      //查询所有部门列表,第一个为主责部门
      let allDeptPostData = {
        arg_proj_id:query.proj_id,
        arg_tenantid:Cookie.get('tenantid')
      };
      const allDeptData = yield call(projServices.projApproveAllDeptQuery,allDeptPostData);
      //const allDeptData = yield call(projServices.queryAllDept,{arg_proj_id:queryData.arg_proj_id});
      //查询每个部门的预算
      let budgetPostData = {
        arg_proj_id:query.proj_id
      };
      const deptBudgetData = yield call(projServices.projApproveBudgetQuery,budgetPostData);
      //const deptBudgetData = yield call(projServices.querydeptBudgetData,{arg_proj_id:queryData.arg_proj_id});

      yield put({
        type:'save',
        payload:{
          coorpDeptList:coorpDeptData.DataRows,
          allDeptList:allDeptData.DataRows
        }
      });
      let allDeptList = allDeptData.DataRows;
      let deptBudgetList = deptBudgetData.DataRows;

      //确定返回的预算中的年份
      let yearList = [];
      //年的索引，先从开始时间的年份开始算起
      let yearIndex = parseInt(query.begin_time.split('-')[0]);
      //将结束时间作为结束标志
      let yearEndTagIndex = parseInt(query.end_time.split('-')[0]);
      //如果年份索引不超过开始年份，进行添加
      while (yearIndex <= yearEndTagIndex) {
        yearList.push(yearIndex.toString());
        yearIndex++;
      }
      yearList = yearList.sort();   //年份需要排序

      //计算所有工时之和
      let predictTimeTotal = 0;
      for(let indexp = 0 ; indexp < deptBudgetList.length; indexp++){
        if(deptBudgetList[indexp].fee_type === '0' && deptBudgetList[indexp].fee_subtype === '-1'){
          predictTimeTotal += Number(deptBudgetList[indexp].fee);
        }
      }
      yield put({
        type:'save',
        payload:{predictTimeTotal:predictTimeTotal.toFixed(1)}
      });
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
      //                   2017:{yearRowSpan:x,
      //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
      //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx费用之和
      //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
      //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
      //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
      //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy费用之和
      //                         humanCostTotal:[12,67]         // 每个部门的人工成本
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
          for(let deptIndexx = 0; deptIndexx < allDeptList.length; deptIndexx++) {
            let purchaseDeptValue = 0;
            let operateDeptValue = 0;
            let carryOutDeptValue = 0;
            let humanCostValue = 0;
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
                }
              }
            }
            purchaseDeptTotal.push(purchaseDeptValue.toFixed(2));
            operateDeptTotal.push(operateDeptValue.toFixed(2));
            carryOutDeptTotal.push(carryOutDeptValue.toFixed(2));
            humanCostTotal.push(humanCostValue.toFixed(2));
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
            humanCostTotal:humanCostTotal
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
          obj.padLeft = '0px';
          obj.feeType = '0';         //  0 代表预计工时，1 代表 预算
          let predictTime = 0;
          for(let i = 0; i<allDeptList.length; i++){
            let findPredictTime = false;
            for(let cellDataIndex2 = 0; cellDataIndex2 < deptBudgetList.length; cellDataIndex2++){
              //年相同就添加一条数据
              if(yearList[yearIndex2] === deptBudgetList[cellDataIndex2].year){
                if(deptBudgetList[cellDataIndex2].fee_type === '0' &&
                  deptBudgetList[cellDataIndex2].fee_subtype === '-1'){
                  if(allDeptList[i].dept_name === deptBudgetList[cellDataIndex2].dept_name){
                    obj['dept' + i.toString()] = Number(deptBudgetList[cellDataIndex2].fee).toFixed(1);
                    predictTime += Number(deptBudgetList[cellDataIndex2].fee);
                    findPredictTime = true;
                    break;
                  }
                }
              }
            }//end for
            //如果没有这种类型的数据，数据源加一条
            if(findPredictTime === false){
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
          obj.padLeft = '0px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
          let directCostTotal = 0;
          for(let j = 0; j<allDeptList.length; j++){
            let directCost = Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[j]) +
              Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[j]) +
              Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[j]) +
              Number(yearListRowSpan[yearList[yearIndex2]].humanCostTotal[j]);
            directCostTotal += directCost;
            obj['dept'+j.toString()] = directCost.toFixed(2);
          }//end for
          obj.total = directCostTotal.toFixed(2);
          deptBudgetTableData.push(obj);

          //2.1添加项目采购成本
          obj = {};
          obj.year = yearList[yearIndex2];
          obj.yearRowSpan = 0;
          obj.fee_name = config.PURCHASE_COST;
          obj.padLeft = '10px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
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
            let purchaseTotal = 0;
            for(let p = 0; p < allDeptList.length; p++){
              let findPurchase = false;
              for(let cellDataIndex3 = 0; cellDataIndex3 < deptBudgetList.length; cellDataIndex3++){
                if(yearList[yearIndex2] === deptBudgetList[cellDataIndex3].year &&
                  purchaseCostTypeList[purchaseIndex].trim() === deptBudgetList[cellDataIndex3].fee_name.trim()){
                  if(deptBudgetList[cellDataIndex3].fee_type === '1' &&
                    deptBudgetList[cellDataIndex3].fee_subtype === '0'){
                    if(allDeptList[p].dept_name === deptBudgetList[cellDataIndex3].dept_name){
                      obj['dept'+p.toString()] = Number(deptBudgetList[cellDataIndex3].fee).toFixed(2);
                      purchaseTotal += Number(deptBudgetList[cellDataIndex3].fee);
                      findPurchase = true;
                      break;
                    }
                  }
                }
              }//end for
              if(findPurchase === false){
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
          obj.padLeft = '10px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
          let operateAllTotal = 0;
          for(let ii = 0; ii < allDeptList.length; ii++) {
            obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[ii];
            operateAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[ii]);
          }//end for
          obj.total = operateAllTotal.toFixed(2);
          deptBudgetTableData.push(obj);

          //2.2. 添加项目运行成本-子费用
          let operateCostTypeList = yearListRowSpan[yearList[yearIndex2]].operateCostList;
          for(let operateIndex = 0; operateIndex < operateCostTypeList.length;operateIndex++) {
            obj = {};
            obj.year = yearList[yearIndex2];
            obj.yearRowSpan = 0;
            obj.fee_name = '2.2.'+(operateIndex+1).toString() + operateCostTypeList[operateIndex];
            obj.no_pre_fee_name = operateCostTypeList[operateIndex];
            obj.padLeft = '30px';
            obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
            let operateTotal = 0;
            for(let jj = 0; jj < allDeptList.length; jj++){
              let findOperate = false;
              for(let cellDataIndex44 = 0; cellDataIndex44 < deptBudgetList.length; cellDataIndex44++){
                if(yearList[yearIndex2] === deptBudgetList[cellDataIndex44].year &&
                  operateCostTypeList[operateIndex] === deptBudgetList[cellDataIndex44].fee_name.trim()){
                  if(deptBudgetList[cellDataIndex44].fee_type === '1' &&
                    deptBudgetList[cellDataIndex44].fee_subtype === '3'){
                    if(allDeptList[jj].dept_name === deptBudgetList[cellDataIndex44].dept_name){
                      obj['dept'+jj.toString()] = Number(deptBudgetList[cellDataIndex44].fee).toFixed(2);
                      operateTotal += Number(deptBudgetList[cellDataIndex44].fee);
                      findOperate = true;
                      break;
                    }
                  }
                }
              }//end for
              if(findOperate === false){
                obj['dept'+jj.toString()] = '0.00';
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
          obj.padLeft = '10px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
          let carryOutAllTotal = 0;
          for(let ii = 0; ii < allDeptList.length; ii++) {
            obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii];
            carryOutAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii]);
          }//end for
          obj.total = carryOutAllTotal.toFixed(2);
          deptBudgetTableData.push(obj);

          //2.3. 添加项目采购成本-子费用
          let carryOutCostTypeList = yearListRowSpan[yearList[yearIndex2]].carryOutCostList;
          for(let carryOutIndex = 0; carryOutIndex<carryOutCostTypeList.length;carryOutIndex++) {
            obj = {};
            obj.year = yearList[yearIndex2];
            obj.yearRowSpan = 0;
            obj.fee_name = '2.3.'+(carryOutIndex+1).toString() + carryOutCostTypeList[carryOutIndex];
            obj.no_pre_fee_name = carryOutCostTypeList[carryOutIndex];
            obj.padLeft = '30px';
            obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
            let carryOutTotal = 0;
            for(let jj = 0; jj<allDeptList.length; jj++){
              let findCarryOut = false;
              for(let cellDataIndex4 = 0; cellDataIndex4 < deptBudgetList.length; cellDataIndex4++){
                if(yearList[yearIndex2] === deptBudgetList[cellDataIndex4].year &&
                  carryOutCostTypeList[carryOutIndex] === deptBudgetList[cellDataIndex4].fee_name.trim()){
                  if(deptBudgetList[cellDataIndex4].fee_type === '1' &&
                    deptBudgetList[cellDataIndex4].fee_subtype === '1'){
                    if(allDeptList[jj].dept_name === deptBudgetList[cellDataIndex4].dept_name){
                      obj['dept'+jj.toString()] = Number(deptBudgetList[cellDataIndex4].fee).toFixed(2);
                      carryOutTotal += Number(deptBudgetList[cellDataIndex4].fee);
                      findCarryOut = true;
                      break;
                    }
                  }
                }
              }//end for
              if(findCarryOut === false){
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
          obj.padLeft = '10px';
          obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
          let humanCostTotal = 0;
          for(let b = 0; b<allDeptList.length; b++){
            let findHumanCost = false;
            for(let cellDataIndex5 = 0; cellDataIndex5 < deptBudgetList.length; cellDataIndex5++){
              if(yearList[yearIndex2] === deptBudgetList[cellDataIndex5].year){
                if(deptBudgetList[cellDataIndex5].fee_type === '1' &&
                  deptBudgetList[cellDataIndex5].fee_subtype === '2'){
                  if(allDeptList[b].dept_name === deptBudgetList[cellDataIndex5].dept_name){
                    obj['dept'+b.toString()] = Number(deptBudgetList[cellDataIndex5].fee).toFixed(2);
                    humanCostTotal += Number(deptBudgetList[cellDataIndex5].fee);
                    findHumanCost = true;
                    break;
                  }
                }
              }
            }//end for
            if(findHumanCost === false){
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
        obj.padLeft = '0px';
        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
        obj.yearOptType = 'total';
        for(let de = 0; de<allDeptList.length; de++) {
          let allYearTotal = 0;
          for(let yi = 0; yi < yearList.length; yi++){
            allYearTotal += Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[de]) +
              Number(yearListRowSpan[yearList[yi]].operateDeptTotal[de]) +
              Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[de]) +
              Number(yearListRowSpan[yearList[yi]].humanCostTotal[de]);
          }
          obj['dept' + de.toString()] = allYearTotal.toFixed(2);
          allTableTotal += allYearTotal;
        }//end for
        obj.total = allTableTotal.toFixed(2);
        deptBudgetTableData.push(obj);
      }
      //deptBudgetTableData.map((i,index)=>{ i.key=index;return i});
      for(let indexd = 0; indexd < deptBudgetTableData.length; indexd++){
        deptBudgetTableData[indexd].key = indexd;
      }
      yield put({
        type:'save',
        payload:{
          deptBudgetTableData:deptBudgetTableData
        }
      });
    },


    /**
     * 作者：仝飞
     * 创建日期：2017-10-11
     * 功能：查询审核日志
     * @param query url的请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *searchCheckLogList({query},{call,put}){
      const data = yield call(projServices.searchCheckLogList, {arg_proj_id:query.proj_id});
      if(data.RetCode === '1'){
        if(data.DataRows.length > 0 ){
          yield put({
            type: 'saveCheckLogList',
            payload:{checkLogList: data.DataRows}
          });
        }else{
          yield put({
            type: 'saveCheckLogList',
            payload:{checkLogList:[]}
          });
        }
      }
    },

    /**
     * 作者：仝飞
     * 创建日期：2017-10-11
     * 功能：项目启动时项目信息页面的查询已上传附件列表
     * @param query url的请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
      *searchNewAddAttachment({query},{call,put}){
      let postData = {};
      postData['arg_flag'] = 1;//arg_flag：固定传0（0，项目启动-项目新增立项；1，项目启动-项目基本信息查询）
      postData['arg_proj_id'] = query.proj_id;

      const data = yield call(projServices.searchNewAddAttachment, postData);
      if(data.RetCode === '1'){
        if(data.DataRows.length && data.DataRows[0].file_list){
          //将字符串转为json对象
          let attachmentListTemp = JSON.parse(data.DataRows[0].file_list);
          attachmentListTemp.map((i,index)=>{
            i.opt_type='search';   //查询出来的附件标记为 search
            i.key=index;           //为没一条记录添加一个 key
          });
          //此处重写一遍的原因是因为使用同一个时修改attachmentList时也修改了attachmentListOriginal
          let attachmentListOriginal = JSON.parse(data.DataRows[0].file_list);
          attachmentListOriginal.map((i,index)=>{
            i.opt_type='search';   //查询出来的附件标记为 search
            i.key=index;           //为没一条记录添加一个 key
          });
          yield put({
            type: 'saveAttachmentList',
            payload:{
              attachmentList:attachmentListTemp,
              attachmentListOriginal:attachmentListOriginal
            }
          });
        }else{
          yield put({
            type: 'saveAttachmentList',
            payload:{
              attachmentList:[],
              attachmentListOriginal:[]
            }
          });
        }

      }
    },


    /**
     * 作者：仝飞
     * 创建日期：2017-10-11
     * 功能：项目启动时新增页面删除附件列表
     * @param key 附件的key
     * @param attachmentList 附件列表
     * @param put 返回reducer
     * @param select 获取model里面state
     */
    *deleteAttachment({key,attachmentList},{put, select}){
      //删除delete操作
      //传入delete的正确参数
      const projIdValue = yield select(state=>state.projHistoryMainPage.proj_id);
      const transjson = {
          "opt":"update",
          "data":{
            "update":{
              "att_state":"1",
              "att_update_by":Cookie.get('userid'),
              "att_opt":"delete"
            },
            "condition":{
              "att_id":attachmentList[key].att_id,
              "proj_id":projIdValue
            }
          }
      };
      const editMessage = {
        "opt":"update",
        "data":{
          "update":{
            "att_change_item": attachmentList[key].file_name + "：删除一条附件信息\n",
            "att_update_by":Cookie.get('userid'),
          },
          "condition":{
            "proj_id":projIdValue
          }
        }
      };
      //调用保存方法，传入数据库
      yield put({
        type: 'projAttachmentSave',
        transjson:transjson,
        editMessage: editMessage,
      });
    },

    /**
     * 作者：仝飞
     * 创建日期：2017-10-11
     * 功能：项目启动时新增页面编辑附件列表
     * @param key 附件的key
     * @param attachmentList 附件列表
     * @param text 编辑时的文本值
     * @param put 返回reducer
     * @param select 获取model里面state
     */
    *editAttachment({key, attachmentList},{put,select}){
      let query = yield select(state=>state.routing.locationBeforeTransitions.query);
        // 此处是放真正修改update的操作
        //传入update的正确参数
        const projIdValue = yield select(state=>state.projHistoryMainPage.proj_id);
        const transjson = {
          "opt":"update",
          "data":{
            "update":{
              "file_byname":attachmentList[key].file_byname,
              "att_update_by":Cookie.get('userid'),
              "att_opt":"update"
            },
            "condition":{
              "att_id":attachmentList[key].att_id,
              "proj_id":projIdValue
            }
          }
        };
      const editMessage = {
        "opt":"update",
        "data":{
          "update":{
            "att_change_item": attachmentList[key].file_name + "：修改附件别名信息\n",
            "att_update_by":Cookie.get('userid'),
          },
          "condition":{
            "proj_id":projIdValue
          }
        }
      };
      //调用保存方法，传入数据库
      yield put({
        type: 'projAttachmentSave',
        transjson:transjson,
        editMessage: editMessage,
      });
    },

    /**
     * 作者：仝飞
     * 创建日期：2017-10-11
     * 功能：项目启动时新增页面新增附件列表
     * @param attachmentList 附件列表
     * @param objFile 添加的文件
     * @param text 编辑时的文本值
     * @param put 返回reducer
     */
      *addAttachment({attachmentList,objFile},{put, select}){
      let fileNameIsRepeat = false;
      if(attachmentList.length > 0){
        for(let i = 0; i< attachmentList.length; i++){
            if(objFile.file_name === attachmentList[i].file_name){
              fileNameIsRepeat = true;
              break;
            }
        }
      }

      if(fileNameIsRepeat){
        message.error(config.FILE_NAME_IS_REPEAT);
      }else{
        attachmentList.push(objFile);
        yield put({
          type: 'saveAttachmentList',
          payload:{attachmentList:attachmentList}
        });
        //此处放真正的增加add服务
        const projIdValue = yield select(state=>state.projHistoryMainPage.proj_id);
        const transjson = {
          "opt":"insert",
          "data":{
            "proj_id": projIdValue,
            "file_byname": objFile.file_byname,
            "att_opt": objFile.opt_type,
            "file_name": objFile.file_name,
            "file_url": objFile.url,
            "file_relativepath": objFile.file_relativepath,
            "file_tag": "0",
            "att_create_by": Cookie.get('userid'),
            "att_id":objFile.att_id,
          }
        };

        const editMessage = {
          "opt":"update",
          "data":{
            "update":{
              "att_change_item": objFile.file_name + "：新增一条附件信息\n",
              "att_update_by":Cookie.get('userid'),
            },
            "condition":{
              "proj_id":projIdValue
            }
          }
        };
        //调用保存方法，传入数据库
        yield put({
          type: 'projAttachmentSave',
          transjson:transjson,
          editMessage: editMessage,
        });

      }
    },


    /**
     * 作者：仝飞
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
    },

    /**
     * 作者：仝飞
     * 创建日期：2017-10-11
     * 功能：判断是否是TMO权限
     * @param call 请求服务
     * @param put 返回reducer
     */
      *tmoRoleSearch({}, { call, put }) {
      //TMO权限
      let argVrName = {
        'arg_vr_name': '项目管理-TMO'
      };
      let staffId = Cookie.get('staff_id');
      let display = false;
      const argVrNameList = yield  call(projServices.projTMOQuery,argVrName);
      if(argVrNameList.RetCode === '1' && argVrNameList.DataRows.length){
        for(let i =0;i<argVrNameList.DataRows.length;i++) {
          if(argVrNameList.DataRows[i].staff_id === staffId) {
            display = true;
          }
        }
      }
      yield put({
        type: 'saveRole',
        display: display,
      });
    },

    /**
     *Author: 仝飞
     *Date: 2017-11-25 11:12
     *Email: tongf5@chinaunicom.cn
     *功能：项目管理》项目收尾》历史项目》
     */
    *projAttachmentSave({transjson,editMessage}, { select, call, put }) {
      //????????============?????这是哪里取得的值？？
      let query = yield select(state=>state.routing.locationBeforeTransitions.query);
      let transjsonarray = [];
      transjsonarray.push(transjson,editMessage);
      //真正的save动作
      //tag 0 保存，2 提交
      const retData = yield call(projServices.projFileUpdate, {
        transjsonarray: JSON.stringify(transjsonarray)
      });
      if(retData.RetCode=='1'){
        message.success('数据操作成功!');
        yield put({
          type: 'searchNewAddAttachment',
          query: query,
        });

      }
      else if(retData.RetCode == '-1'){
        message.error(retData.RetVal);
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname,  query }) => {
        if (pathname === '/projectApp/projClosure/historyProject/projHistoryEdit') {
          dispatch({type: 'mainProjQuery', query});
          dispatch({type: "projectInfoQuery",query});
          dispatch({type: "mileInfoQuery",query});
          dispatch({type: "searchHistoryFullcost",query});
          dispatch({type: "searchNewAddAttachment",query});
          dispatch({type: "searchCheckLogList",query});
          dispatch({type: "setQueryData",query});
          //判断是否有附件修改权限，即项目tmo权限
          dispatch({type: 'tmoRoleSearch'});
        }
      });
    },
  },
};
