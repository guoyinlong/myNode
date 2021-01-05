/**
 * 作者：邓广晖
 * 创建日期：2018-04-10
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：TMO修改已立项的全成本数据后，TMO和审核人查看待办、已办、办结的共用model
 */
import * as projServices from '../../../../services/project/projService';
import { routerRedux } from 'dva/router';
import config from '../../../../utils/config';
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
  namespace: 'projFullcostView',
  state:{
    tab_key:'1',              /*点击审批历史进去后，出现返回按钮，判断返回按钮是否被按下，此处不能写在initData里面*/
    queryData:{},              //url参数
    titleData:{},              //标题数据
    titleDetail:{},
    coorpDeptList:[],          //配合部门列表数据
    compBudgetTableData:[],    //预算数据
    projChangeLog:[],          //审批历史列表数据
  },
  reducers: {
    initData(state){
      return {
        ...state,
        queryData:{},          //url参数
        titleData:{},          //标题数据
        titleDetail:{},
        coorpDeptList:[],      //配合部门列表数据
        compBudgetTableData:[],    //预算数据
        projChangeLog:[],      //审批历史列表数据
      }
    },
    save(state, action) {
      return {...state, ...action.payload};
    }
  },

  effects: {

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：审核人查看待办是否被审核过，
     * 返回值RetNum为1时表示未审核,进详细信息页面；
     * RetNum为0时表示已被审核,提示已被审核并返回待办列表页面
     * @param payload url数据
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *projFullcostIsCheck ({payload}, { call, put}) {

      //保存url的值
      let urlPayload = payload;
      if ('arg_tag' in urlPayload && urlPayload.arg_tag === '6'){
        //如果撤回的项目，arg_tag = 6 ，强制该为3
        urlPayload.arg_tag = '3'
      }
      yield put({
        type: 'save',
        payload: {
          queryData:urlPayload,
          /*queryData:{
            roleTag: payload.arg_tag,              /!*当前用户是什么角色，3是变更人角色，4审核人角色*!/
            handleFlag:payload.arg_handle_flag,    /!*0待办/1已办/3办结*!/
            taskUuid:payload.arg_task_uuid,
            projUid:payload.arg_proj_uid,
            checkId:payload.arg_check_id,
            taskBatchid:payload.arg_task_batchid,
            taskWfBatchid:payload.arg_task_wf_batchid,
            projId:payload.arg_proj_id,
            arg_check_detail_flag:payload.arg_check_detail_flag,
          },*/
        }
      });
      if(urlPayload.arg_handle_flag === '0') {
        //如果是从待办跳转进来，需要首先判断，该项目是否已经被审核
        const data = yield call(projServices.projChangeIsCheck, {
          arg_task_id:urlPayload.arg_task_id,
          arg_task_uuid:urlPayload.arg_task_uuid
        });
        if (data.RetNum === '1') {
          yield put({ type:'projFullcostTitle'});
        } else {
          yield put(routerRedux.push({pathname: '/taskList'}));
          message.error('TMO修改全成本已经被审核！');
        }
      }else{
        //如果是办结和已办，直接查询
        yield put({ type:'projFullcostTitle'});
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：审核人查看待办-TMO修改全成本的标题数据
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *projFullcostTitle({},{call,put,select}){
      const {queryData,tab_key} = yield select(state => state.projFullcostView);
      //  查询标题数据
      let titlePostData = {
        arg_proj_id:queryData.arg_proj_id,
        arg_check_id:queryData.arg_check_id,
        arg_tag:queryData.arg_tag,                       //当前用户是什么角色，3是提交人角色，4审核人角色
        arg_handle_flag:queryData.arg_handle_flag,        //必传，0待办/1已办/3办结
      };
      if('arg_check_detail_flag' in queryData && queryData.arg_check_detail_flag !== undefined){
        //审批环节进入详细查询时候必传值1；其他情况可传0；
        titlePostData.arg_check_detail_flag = queryData.arg_check_detail_flag;
      }

      const titleRetData = yield call(projServices.queryTmoModifyFullcostTitle,titlePostData);
      if (titleRetData.RetCode === '1') {
        yield put ({
          type:'save',
          payload:{
            titleData:titleRetData,
            titleDetail:titleRetData.DataRows[0]
          }
        });

        if (tab_key === '1') {
          yield put({type:'searchProjFullcostView'});
        }
        else if (tab_key === '2') {
          yield put({type:'projFullCostCheckLog'});
        }
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：审核人查看待办-TMO修改全成本
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *searchProjFullcostView({},{call,put,select}){
      const {queryData,titleData} = yield select(state => state.projFullcostView);
      // 1 查询配合部门数据，非对比数据
      let deptPostData = {
        arg_proj_id:queryData.arg_proj_id,
        arg_check_id:titleData.last_check_id,      //必传，值来自于标题查询中的last_check_id
      };

      const coorDeptRetData = yield call(projServices.queryTmoModifyFullcostCoorDept,deptPostData);
      if (coorDeptRetData.RetCode === '1') {
        yield put({
          type:'save',
          payload:{
            coorpDeptList:coorDeptRetData.DataRows,
          }
        });
      }

      // 2 查询预算数据，对比数据
      const compBudgetData = yield call(projServices.queryTmoModifyFullcostBudget, {
        arg_proj_id:queryData.arg_proj_id,
        arg_check_id:titleData.last_check_id, //必传，值来自于标题查询中的last_check_id
        arg_query_flag:'0',                   //arg_query_flag  0:对比，1：非对比
      });
      let compBudgetList = compBudgetData.DataRows;

      //确定返回的预算中的年份
      let yearList = [];
      //查询所有部门列表,第一个为主责部门
      let allDeptList = [];
      for(let i = 0; i < compBudgetList.length; i++){
        if(!isInArray(yearList,compBudgetList[i].year)){
          yearList.push(compBudgetList[i].year);
        }
        if(!isInArray(allDeptList,compBudgetList[i].dept_name)){
          allDeptList.push(compBudgetList[i].dept_name);
        }
      }
      yearList = yearList.sort();

      let deptListRowSpan = {};
      // deptListRowSpan = { dept0:{  2016:{
      //                                     purchaseTypeList:['xxxx费用1'，‘xxxx费用2’],
      //                                     purchaseTotal:[25 ,78]  // （原金额，新金额）所有xxx（采购）费用之和
      //                                     operateTypeList:['zzzz费用1'，‘zzzz费用2’],
      //                                     operateTotal:[25 ,78]  // （原金额，新金额）所有zzz（运行）费用之和
      //                                     carryOutTypeList:['yyyy费用1'，‘yyyy费用2’]},
      //                                     carryOutTotal:[56 ,90]  // （原金额，新金额）所有yyy（实施）费用之和
      //                                     humanTotal:[52, 67]    // （原金额，新金额）的人工成本
      //                                  }
      //                             2017:{
      //                                     purchaseTypeList:['xxxx费用1'，‘xxxx费用2’],
      //                                     purchaseTotal:[30 ,46]  // （原金额，新金额）所有xxx费用之和
      //                                     operateTypeList:['zzzz费用1'，‘zzzz费用2’],
      //                                     operateTotal:[25 ,78]  // （原金额，新金额）所有zzz费用之和
      //                                     carryOutTypeList:['yyyy费用1'，‘yyyy费用2’]},
      //                                     carryOutTotal:[11 ,95]  // （原金额，新金额）所有yyy费用之和
      //                                  }
      //                    dept1:{ ...}
      for(let d1 = 0; d1 < allDeptList.length; d1++){
        deptListRowSpan['dept'+d1.toString()] = {};
        for(let y1 = 0; y1 < yearList.length; y1++){
          //预计工时，直接成本，项目采购成本，项目运行成本，项目实施成本，项目人工成本默认存在
          let purchaseTypeList = [];   //项目采购成本列表
          let operateTypeList = [];    //项目运行成本列表
          let carryOutTypeList = [];   //项目实施成本列表
          let purchaseTotal = [];  //（原金额，新金额）所有xxx费用之和
          let operateTotal = [];   //（原金额，新金额）所有zzz费用之和
          let carryOutTotal = [];  //（原金额，新金额）所有yyy费用之和
          let humanTotal= [];      // （原金额，新金额）的人工成本
          let purchaseOldValue = 0;
          let purchaseNewValue = 0;
          let operateOldValue = 0;
          let operateNewValue = 0;
          let carryOutOldValue = 0;
          let carryOutNewValue = 0;
          let humanOldValue = 0;
          let humanNewValue = 0;
          for(let index1 = 0; index1 < compBudgetList.length; index1++){
            //先判断部门
            if(allDeptList[d1] === compBudgetList[index1].dept_name){
              //判断年
              if(yearList[y1] === compBudgetList[index1].year){
                //判断是不是属于直接成本中的采购成本或者实施成本，即fee_subtype = 0 或者 1
                if(compBudgetList[index1].fee_type === '1'){
                  //debugger;
                  if(compBudgetList[index1].fee_subtype === '0'){
                    //此处不用判断是否已经在列表
                    purchaseTypeList.push(compBudgetList[index1].fee_name.trim());
                    if('old_fee' in compBudgetList[index1]){
                      purchaseOldValue += Number(compBudgetList[index1].old_fee);
                    }
                    if('new_fee' in compBudgetList[index1]){
                      purchaseNewValue += Number(compBudgetList[index1].new_fee);
                    }
                  }else if(compBudgetList[index1].fee_subtype === '3'){
                    operateTypeList.push(compBudgetList[index1].fee_name.trim());
                    if('old_fee' in compBudgetList[index1]){
                      operateOldValue += Number(compBudgetList[index1].old_fee);
                    }
                    if('new_fee' in compBudgetList[index1]){
                      operateNewValue += Number(compBudgetList[index1].new_fee);
                    }
                  }else if(compBudgetList[index1].fee_subtype === '1'){
                    carryOutTypeList.push(compBudgetList[index1].fee_name.trim());
                    if('old_fee' in compBudgetList[index1]){
                      carryOutOldValue += Number(compBudgetList[index1].old_fee);
                    }
                    if('new_fee' in compBudgetList[index1]){
                      carryOutNewValue += Number(compBudgetList[index1].new_fee);
                    }
                  }else if(compBudgetList[index1].fee_subtype === '2'){
                    if('old_fee' in compBudgetList[index1]){
                      humanOldValue = Number(compBudgetList[index1].old_fee);
                    }else{
                      humanOldValue = 0;
                    }
                    if('new_fee' in compBudgetList[index1]){
                      humanNewValue = Number(compBudgetList[index1].new_fee);
                    }else{
                      humanNewValue = 0;
                    }
                  }
                }
              }
            }
          } //end for
          purchaseTotal.push(purchaseOldValue.toFixed(2),purchaseNewValue.toFixed(2));
          operateTotal.push(operateOldValue.toFixed(2),operateNewValue.toFixed(2));
          carryOutTotal.push(carryOutOldValue.toFixed(2),carryOutNewValue.toFixed(2));
          humanTotal.push(humanOldValue.toFixed(2),humanNewValue.toFixed(2));
          deptListRowSpan['dept'+d1.toString()][yearList[y1]] = {
            purchaseTypeList:purchaseTypeList,
            purchaseTotal:purchaseTotal,
            operateTypeList:operateTypeList,
            operateTotal:operateTotal,
            carryOutTypeList:carryOutTypeList,
            carryOutTotal:carryOutTotal,
            humanTotal:humanTotal
          };
        }
      }

      /*转换部门预算数据*/
      let compBudgetTableData = [];
      let allBudgetTotal = [0,0];        //所有预算的总计初始化
      for (let d2 = 0; d2 < allDeptList.length; d2++) {
        let deptBudgetTotal = [0,0];     //每个部门预算的合计初始化
        for (let y2 = 0; y2 < yearList.length; y2++) {
          //先添加  预计工时     //有可能没有查到预计工时
          let findPredict = false;
          for (let index2 = 0; index2 < compBudgetList.length; index2++) {
            //确定部门和年份
            if (allDeptList[d2] === compBudgetList[index2].dept_name &&
              compBudgetList[index2].year === yearList[y2] &&
              compBudgetList[index2].fee_type === '0' &&
              compBudgetList[index2].fee_subtype === '-1') {
              findPredict = true;
              //如果是被删除的，标记，页面加删除线
              let feeIsDelete = false;
              if(compBudgetList[index2].opt_flag && compBudgetList[index2].opt_flag === '3'){
                feeIsDelete = true;
              }
              compBudgetTableData.push({
                feeIsDelete:feeIsDelete,
                deptName:allDeptList[d2],
                year:yearList[y2],
                feeType:config.PREDICT_TIME,
                deptNamePadLeft:'0px',
                kindOfFee:'0',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                oldMoney:compBudgetList[index2].old_fee?Number(compBudgetList[index2].old_fee).toFixed(1):'0.0',
                newMoney:compBudgetList[index2].new_fee?Number(compBudgetList[index2].new_fee).toFixed(1):'0.0',
              });
            }
          }
          if(findPredict === false){
            compBudgetTableData.push({
              deptName:allDeptList[d2],
              year:yearList[y2],
              feeType:config.PREDICT_TIME,
              deptNamePadLeft:'0px',
              kindOfFee:'0',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
              oldMoney:'0.0',
              newMoney:'0.0',
            });
          }
          //添加 2 直接成本
          let oldTotal = Number(deptListRowSpan['dept'+d2.toString()][yearList[y2]].purchaseTotal[0]) +
            Number(deptListRowSpan['dept'+d2.toString()][yearList[y2]].operateTotal[0]) +
            Number(deptListRowSpan['dept'+d2.toString()][yearList[y2]].carryOutTotal[0]) +
            Number(deptListRowSpan['dept'+d2.toString()][yearList[y2]].humanTotal[0]);
          let newTotal = Number(deptListRowSpan['dept'+d2.toString()][yearList[y2]].purchaseTotal[1]) +
            Number(deptListRowSpan['dept'+d2.toString()][yearList[y2]].operateTotal[1]) +
            Number(deptListRowSpan['dept'+d2.toString()][yearList[y2]].carryOutTotal[1]) +
            Number(deptListRowSpan['dept'+d2.toString()][yearList[y2]].humanTotal[1]);
          compBudgetTableData.push({
            deptName:allDeptList[d2],
            year:yearList[y2],
            feeType:config.DIRECT_COST,
            deptNamePadLeft:'0px',
            kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
            oldMoney:oldTotal.toFixed(2),
            newMoney:newTotal.toFixed(2)
          });
          //添加 2.1 采购成本
          compBudgetTableData.push({
            deptName:allDeptList[d2],
            year:yearList[y2],
            feeType:config.PURCHASE_COST,
            deptNamePadLeft:'10px',
            kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
            oldMoney:deptListRowSpan['dept'+d2.toString()][yearList[y2]].purchaseTotal[0],
            newMoney:deptListRowSpan['dept'+d2.toString()][yearList[y2]].purchaseTotal[1],
          });
          //添加 2.1. 采购成本  子费用
          let secondIndex = 1;
          for (let index3 = 0; index3 < compBudgetList.length; index3++) {
            //确定部门和年份
            if (allDeptList[d2] === compBudgetList[index3].dept_name &&
              compBudgetList[index3].year === yearList[y2] &&
              compBudgetList[index3].fee_type === '1' &&
              compBudgetList[index3].fee_subtype === '0') {
              //如果是被删除的，标记，页面加删除线
              let feeIsDelete = false;
              if(compBudgetList[index3].opt_flag && compBudgetList[index3].opt_flag === '3'){
                feeIsDelete = true;
              }
              compBudgetTableData.push({
                feeIsDelete:feeIsDelete,
                deptName:allDeptList[d2],
                year:yearList[y2],
                feeType:'2.1.'+ secondIndex.toString() + compBudgetList[index3].fee_name,
                deptNamePadLeft:'30px',
                kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                oldMoney:compBudgetList[index3].old_fee?Number(compBudgetList[index3].old_fee).toFixed(2):'0.00',
                newMoney:compBudgetList[index3].new_fee?Number(compBudgetList[index3].new_fee).toFixed(2):'0.00',
              });
              secondIndex++;
            }
          }

          //添加 2.2 运行成本
          compBudgetTableData.push({
            deptName:allDeptList[d2],
            year:yearList[y2],
            feeType:config.OPERATE_COST,
            deptNamePadLeft:'10px',
            kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
            oldMoney:deptListRowSpan['dept'+d2.toString()][yearList[y2]].operateTotal[0],
            newMoney:deptListRowSpan['dept'+d2.toString()][yearList[y2]].operateTotal[1],
          });

          //添加 2.2. 运行成本  子费用
          let secondIndex22 = 1;
          for (let index44 = 0; index44 < compBudgetList.length; index44++) {
            //确定部门和年份
            if (allDeptList[d2] === compBudgetList[index44].dept_name &&
              compBudgetList[index44].year === yearList[y2] &&
              compBudgetList[index44].fee_type === '1' &&
              compBudgetList[index44].fee_subtype === '3') {
              //如果是被删除的，标记，页面加删除线
              let feeIsDelete = false;
              if(compBudgetList[index44].opt_flag && compBudgetList[index44].opt_flag === '3'){
                feeIsDelete = true;
              }
              compBudgetTableData.push({
                feeIsDelete:feeIsDelete,
                deptName:allDeptList[d2],
                year:yearList[y2],
                feeType:'2.2.'+ secondIndex22.toString() + compBudgetList[index44].fee_name,
                deptNamePadLeft:'30px',
                kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                oldMoney:compBudgetList[index44].old_fee?Number(compBudgetList[index44].old_fee).toFixed(2):'0.00',
                newMoney:compBudgetList[index44].new_fee?Number(compBudgetList[index44].new_fee).toFixed(2):'0.00',
              });
              secondIndex22++;
            }
          }


          //添加 2.3 实施成本
          compBudgetTableData.push({
            deptName:allDeptList[d2],
            year:yearList[y2],
            feeType:config.CARRYOUT_COST,
            deptNamePadLeft:'10px',
            kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
            oldMoney:deptListRowSpan['dept'+d2.toString()][yearList[y2]].carryOutTotal[0],
            newMoney:deptListRowSpan['dept'+d2.toString()][yearList[y2]].carryOutTotal[1],
          });

          //添加 2.3. 实施成本  子费用
          let secondIndex2 = 1;
          for (let index4 = 0; index4 < compBudgetList.length; index4++) {
            //确定部门和年份
            if (allDeptList[d2] === compBudgetList[index4].dept_name &&
              compBudgetList[index4].year === yearList[y2] &&
              compBudgetList[index4].fee_type === '1' &&
              compBudgetList[index4].fee_subtype === '1') {
              //如果是被删除的，标记，页面加删除线
              let feeIsDelete = false;
              if(compBudgetList[index4].opt_flag && compBudgetList[index4].opt_flag === '3'){
                feeIsDelete = true;
              }
              compBudgetTableData.push({
                feeIsDelete:feeIsDelete,
                deptName:allDeptList[d2],
                year:yearList[y2],
                feeType:'2.3.'+ secondIndex2.toString() + compBudgetList[index4].fee_name,
                deptNamePadLeft:'30px',
                kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
                oldMoney:compBudgetList[index4].old_fee?Number(compBudgetList[index4].old_fee).toFixed(2):'0.00',
                newMoney:compBudgetList[index4].new_fee?Number(compBudgetList[index4].new_fee).toFixed(2):'0.00',
              });
              secondIndex2++;
            }
          }
          //添加 2.4  人工成本
          //如果是被删除的，标记，页面加删除线
          let feeIsDelete = false;
          for (let index5 = 0; index5 < compBudgetList.length; index5++) {
            //确定部门和年份
            if (allDeptList[d2] === compBudgetList[index5].dept_name &&
              compBudgetList[index5].year === yearList[y2] &&
              compBudgetList[index5].fee_type === '1' &&
              compBudgetList[index5].fee_subtype === '2') {
              if(compBudgetList[index5].opt_flag && compBudgetList[index5].opt_flag === '3'){
                feeIsDelete = true;
              }
            }
          }
          compBudgetTableData.push({
            feeIsDelete:feeIsDelete,
            deptName:allDeptList[d2],
            year:yearList[y2],
            feeType:config.HUMAN_COST,
            deptNamePadLeft:'10px',
            kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
            oldMoney:deptListRowSpan['dept'+d2.toString()][yearList[y2]].humanTotal[0],
            newMoney:deptListRowSpan['dept'+d2.toString()][yearList[y2]].humanTotal[1],
          });

          //加总部门的每年合计
          deptBudgetTotal[0] += oldTotal;
          deptBudgetTotal[1] += newTotal;
          allBudgetTotal[0] += oldTotal;
          allBudgetTotal[1] += newTotal;

        }

        //添加完年份数据后，需要加部门的   合计
        compBudgetTableData.push({
          deptName:allDeptList[d2],
          year:'合计',
          feeType:'',
          deptNamePadLeft:'0px',
          kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
          oldMoney:deptBudgetTotal[0].toFixed(2),
          newMoney:deptBudgetTotal[1].toFixed(2),
        });
      }
      //所有预算处理完后，添加所有预算总计
      compBudgetTableData.push({
        deptName:'总计',
        year:'',
        feeType:'',
        deptNamePadLeft:'0px',
        kindOfFee:'1',               //  0 代表预计工时，1 代表 预算  用于区分是否使用千分位
        oldMoney:allBudgetTotal[0].toFixed(2),
        newMoney:allBudgetTotal[1].toFixed(2),
      });

      //compBudgetTableData.map((item,index)=>{item.key = index;return item});
      for(let indexc = 0; indexc < compBudgetTableData.length; indexc++){
        compBudgetTableData[indexc].key = indexc;
      }
      /*表格单元格合并,由于有些数据是拼出来的，所以需要手工合并*/
      let indexTable = [];  //表格合并时，长度索引表
      /*
      * indexTable = [ { deptName:xxxx,
      *                  height:5,
      *                  children: [  {year:2017,
      *                                height:6
      *                               },
      *                               {year:2018,
      *                                height:5
      *                                }
      *                 },
      *                 {...}
      * */
      let deptInfo = {};
      deptInfo.deptName = compBudgetTableData[0].deptName;
      deptInfo.height = 1;
      deptInfo.children = [];
      deptInfo.children.push({year:compBudgetTableData[0].year,height:1});

      //indexTable.push(deptInfo);
      compBudgetTableData[0].deptNameChange = true;
      compBudgetTableData[0].yearChange = true;

      for(let i = 1 ; i < compBudgetTableData.length;i++){
        if(compBudgetTableData[i].deptName === compBudgetTableData[i-1].deptName){
          compBudgetTableData[i].deptNameChange = false;
          //部门与上一个相等了，部门包含的信息条数加1
          deptInfo.height++;
          if(compBudgetTableData[i].year === compBudgetTableData[i-1].year){
            compBudgetTableData[i].yearChange = false;
            //部门相同的情况下，如果年份相同，将年份列表末尾元素的信息条数加1
            deptInfo.children[deptInfo.children.length-1].height++;
          }else{
            compBudgetTableData[i].yearChange = true;
            //如果年份不同，添加到children里面，长度设置为1
            deptInfo.children.push({year:compBudgetTableData[i].year,height:1});
          }
          //如果到了末尾，将正在处理的部门信息push到索引表
          if(i === compBudgetTableData.length-1 ){
            indexTable.push(deptInfo);
          }
        }else{
          compBudgetTableData[i].deptNameChange = true;
          compBudgetTableData[i].yearChange = true;
          //如果部门不相同，代表新的部门开始，将上一个部门信息push到索引表
          indexTable.push(deptInfo);
          //初始化一个新的部门信息
          deptInfo = {};
          deptInfo.deptName = compBudgetTableData[i].deptName;
          deptInfo.height = 1;
          deptInfo.children = [];
          deptInfo.children.push({year:compBudgetTableData[i].year,height:1});
          //如果到了末尾，将正在处理的部门信息push到索引表
          if(i === compBudgetTableData.length-1 ){
            indexTable.push(deptInfo);
          }
        }
      }

      //tableDatalist[0].rowSpan = indexTable[0].height;
      let deptNameIndex = 0;
      let yearIndex = 0;
      for(let i = 0; i < compBudgetTableData.length; i++){
        if(compBudgetTableData[i].deptNameChange === true){
          //如果部门发生变化
          compBudgetTableData[i].deptRowSpan = indexTable[deptNameIndex].height;
          yearIndex = 0;
          compBudgetTableData[i].yearRowSpan = indexTable[deptNameIndex].children[yearIndex].height;
          deptNameIndex++;
        }else{
          //如果部门没有发生变化
          compBudgetTableData[i].deptRowSpan = 0;
          if(compBudgetTableData[i].yearChange === true){
            //如果年份发生了变化
            //debugger;
            yearIndex++;
            compBudgetTableData[i].yearRowSpan = indexTable[deptNameIndex-1].children[yearIndex].height;
          }else{
            //如果年份没有变化
            compBudgetTableData[i].yearRowSpan = 0;
          }
        }
      }
      yield put({
        type:'save',
        payload:{
          compBudgetTableData:compBudgetTableData
        }
      });


    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：改变tab_key的值
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *changeTabKey({payload},{put}){

      if (payload.key === '1') {
        yield put({
          type:'searchProjFullcostView'
        });
      } else if(payload.key === '2') {
        yield put({
          type:'projFullCostCheckLog'
        });
      }
      //切换tab
      yield put({
        type: 'save',
        payload: { tab_key: payload.key}
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：审核人查看审批环节
     */
    *projFullCostCheckLog({}, {call,put,select}){
      const {titleData} = yield select(state => state.projFullcostView);
      let historyPostData = {
        arg_check_id:titleData.last_check_id,
      };
      const historyData = yield call(projServices.queryTmoModifyFullcostCheck,historyPostData);
      if (historyData.RetCode === '1') {
        if(historyData.DataRows.length > 0 ){
          yield put({
            type: 'save',
            payload:{projChangeLog: historyData.DataRows}
          });
        }else{
          yield put({
            type: 'save',
            payload:{projChangeLog:[]}
          });
        }
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：待办退回全成本
     * @param payload 请求数据
     * @param put 返回reducer
     * @param call 请求服务
     */
    *projFullcostReturn({payload},{call,put}){
      const data = yield call(projServices.verifierReturnFullcost,payload);
      if (data.RetCode === '1') {
        message.success('退回成功');
        yield put(routerRedux.push({pathname:'/taskList'}));
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：已办撤回全成本
     * @param payload 请求数据
     * @param put 返回reducer
     * @param call 请求服务
     */
    *projFullcostRetreat({payload},{call,put}){
      const data = yield call(projServices.applierRetreatFullcost,payload);
      if (data.RetCode === '1') {
        message.success('撤回成功');
        yield put(routerRedux.push({pathname:'/taskList'}));
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：待办通过全成本
     * @param payload 请求数据
     * @param put 返回reducer
     * @param call 请求服务
     */
    *projChangeApproval({payload},{call,put}){
      const data = yield call(projServices.verifierApproveFullcost,payload);
      if (data.RetCode === '1') {
        message.success('通过成功');
        yield put(routerRedux.push({pathname:'/taskList'}));
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-04-11
     * 功能：待办终止全成本
     * @param payload 请求数据
     * @param put 返回reducer
     * @param call 请求服务
     */
    *projFullcostTerminal({payload},{call,put}){
      const data = yield call(projServices.applierTerminate,payload);
      if (data.RetCode === '1') {
        message.success('终止成功');
        yield put(routerRedux.push({pathname:'/taskList'}));
      }
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname.indexOf('/projFullcostView') !== -1) {
          dispatch({type: 'initData'});
          dispatch({type: 'projFullcostIsCheck', payload: query});
        }
      });
    }
  }

}
