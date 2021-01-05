/**
 * 作者：张楠华
 * 日期：2018-11-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划填报
 */
import * as fundingPlanFillService from '../../../services/finance/fundingPlanFillService';
import Cookie from 'js-cookie';
import {message} from 'antd';
export default {
  namespace: 'fundingPlanFillNew',
  state: {
    list:[],
    roleType:'1',
    fundStageData:[],
    canApplyUserList:[],
    feeList:[],                                    //费用科目顺序列表数据
    feeListTree:[],                                //费用科目树形列表数据

    /*当月资金计划数据*/
    currentMonthFillTableData:[],                  //本月资金计划填报的表格数据
    currentMonthFillTableOrig:[],                  //本月资金计划填报的表格数据,原始数据
    currentMonthFillDataPass:[],                   //预填报阶段审核通过的数据

    /*以前年度应付款填报数据*/
    priorYearFillTableData:[],                     //以前年度应付款填报的表格数据
    priorYearFillTableOrig:[],                     //以前年度应付款填报的表格数据,原始数据
    priorYearFillTableDataPass:[],                   //预填报阶段审核通过的数据
  },

  reducers: {

    initData(state){
      return {
        ...state,
        /*当月资金计划填报  和 以前年度应付款填报 公共数据*/
        list:[],
        roleType:'1',
        fundStageData:[],
        canApplyUserList:[],
        feeList:[],                                    //费用科目顺序列表数据
        feeListTree:[],                                //费用科目树形列表数据

        /*当月资金计划数据*/
        currentMonthFillTableData:[],                  //本月资金计划填报的表格数据
        currentMonthFillTableOrig:[],                  //本月资金计划填报的表格数据,原始数据

        /*以前年度应付款填报数据*/
        priorYearFillTableData:[],                     //以前年度应付款填报的表格数据
        priorYearFillTableOrig:[],                     //以前年度应付款填报的表格数据,原始数据
        priorYearFillTableDataPass:[],                   //预填报阶段审核通过的数据
      }
    },

    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *init({isFillOrAdjust}, {call, put}) {
      //获取用户当前角色 1、普通员工 2、小组管理员 3、部门管理员
      const userRoleData = yield call(fundingPlanFillService.getFundingUserType, {arg_userid: Cookie.get('userid')});
      if (userRoleData.RetCode === '1') {
        yield put ({
          type:'save',
          payload:{
            roleType:userRoleData.DataRows[0].role_type
          }
        });
      }

      //获取资金填报阶段
      const fillStageData = yield call(fundingPlanFillService.getBatchType, {arg_null: Cookie.get('userid')});
      if (fillStageData.RetCode === '1') {
        yield put({
          type:'save',
          payload:{
            fundStageData:fillStageData.DataRows[0]
          }
        });
      }

      //获取科目名称列表
      let feeListData = yield call(fundingPlanFillService.getFeeList);
      //DataRows  : 所有一级和二级科目列表
      //DataRows1 : 一级和二级科目列表，有主子关系 变成树形组件想要的格式
      if (feeListData.RetCode === '1') {
        let feeList = [];
        let feeListTree = [];
        if ('DataRows1' in feeListData && feeListData.DataRows1.length > 0) {
          for (let i = 0; i < feeListData.DataRows1.length; i++) {
            let obj = {};
            obj.label = feeListData.DataRows1[i].fee_name;
            obj.value = feeListData.DataRows1[i].uuid;
            obj.key = feeListData.DataRows1[i].uuid;
            /*obj.selectable = false;*/
            feeList.push({
              fee_name:feeListData.DataRows1[i].fee_name,
              uuid:feeListData.DataRows1[i].uuid,
              flag:'3',        //一级目录的标志为都设置为3,1：capex,2:办公费，3：其他
            });
            obj.children = [];
            let children = [];
            if ('childRows' in feeListData.DataRows1[i]) {
              children = JSON.parse(feeListData.DataRows1[i].childRows);
            }
            if (children.length > 0) {
              obj.selectable = false;    //如果有二级目录，则一级目录不可选，如果没有，则一级可用
            }
            for (let j = 0; j < children.length; j++) {
              obj.children.push({
                label:children[j].fee_name,
                value:children[j].child_uuid,
                key:children[j].child_uuid,
                flag:children[j].fee_flag
              });
              feeList.push({
                fee_name:children[j].fee_name,
                uuid:children[j].child_uuid,
                flag:children[j].fee_flag
              });
            }
            feeListTree.push(obj);
          }
          yield put({
            type: 'save',
            payload: {
              feeList: feeList,
              feeListTree:feeListTree
            }
          });
        }
        //资金类型为“他购”时，获取可填报申请人名单
        const canApplyUserData = yield call(fundingPlanFillService.getTeamMembers, {arg_userid: Cookie.get('userid')});
        if (canApplyUserData.RetCode === '1') {
          for(let i=0;i<canApplyUserData.DataRows.length;i++){
            if(canApplyUserData.DataRows[i].hasOwnProperty('ou')){
              canApplyUserData.DataRows[i].ou = canApplyUserData.DataRows[i].ou.includes('-')?canApplyUserData.DataRows[i].ou.split('-')[1]:canApplyUserData.DataRows[i].ou;
            }
          }
          yield put({
            type:'save',
            payload:{
              canApplyUserList:canApplyUserData.DataRows,
            }
          });
        }
        //查询已经填报的当月填报数据
        yield put({
          type:'queryCurrentMonthFillData',
          isFillOrAdjust
        });
        yield put({
          type:'queryPriorYearFillData',
          isFillOrAdjust
        });
      }
    },

    *queryCurrentMonthFillData({isFillOrAdjust},{call,put,select}){
      const { feeList,fundStageData } = yield select(state => state.fundingPlanFillNew);
      if(fundStageData.length !==0){
        let fillPostData = {
          arg_userid: Cookie.get('userid'),
          arg_is_pre_year_funds: '2',                //2当月 ，1以前
          arg_report_batch: isFillOrAdjust ==='1'?isFillOrAdjust:fundStageData.report_type,                //1预填报 ，2追加
          arg_plan_year: fundStageData.plan_year,                //1预填报 ，2追加
          arg_plan_month: fundStageData.plan_month,                //1预填报 ，2追加
        };
        const currentMonthFillData = yield call(fundingPlanFillService.getFillData, fillPostData);
        let currentMonthFillDataPass = [];
        if (currentMonthFillData.RetCode === '1') {
          for (let i = 0; i < currentMonthFillData.DataRows.length; i++) {
            let childRows = [];
            if ('childRows' in currentMonthFillData.DataRows[i] && currentMonthFillData.DataRows[i].childRows !== '') {
              childRows = JSON.parse(currentMonthFillData.DataRows[i].childRows);
              for (let j = 0; j < childRows.length; j++) {
                childRows[j].opt_type = 'search';
                childRows[j].key = j;
              }
            }
            currentMonthFillData.DataRows[i].childRows = childRows;
            currentMonthFillData.DataRows[i].opt_type = 'search';
            currentMonthFillData.DataRows[i].isDelete = 'search';//清空的数据是delete，查出来的数据是其他的状态
            currentMonthFillData.DataRows[i].key = i;

            //判断当前返回的数据中是否有 办公费 和 capax的数据
            let boundModalFlag = '3';    // 1 : capex  , 2 :办公费  ，3：其他，1,2是有弹框的
            for (let k = 0; k < feeList.length; k++) {
              if (currentMonthFillData.DataRows[i].subject_id === feeList[k].uuid) {
                boundModalFlag = feeList[k].flag;
                break;
              }
            }
            currentMonthFillData.DataRows[i].boundModalFlag = boundModalFlag;

            if(currentMonthFillData.DataRows[i].fill_state_code === '3'){ //调整阶段，预填报审核通过的数据存起来
              currentMonthFillDataPass.push(currentMonthFillData.DataRows[i]);
            }
          }
          yield put({
            type:'save',
            payload:{
              currentMonthFillTableData:currentMonthFillData.DataRows,
              currentMonthFillTableOrig:JSON.parse(JSON.stringify(currentMonthFillData.DataRows)),
              currentMonthFillDataPass:JSON.parse(JSON.stringify(currentMonthFillDataPass)),
            }
          });
        }
      }
    },

    *addCurrentMonthFillData({}, {put, select}) {
      let {currentMonthFillTableData,canApplyUserList,fundStageData} = yield select(state => state.fundingPlanFillNew);
      let applyUserId = Cookie.get('userid');
      let applyUserData = {};
      //申请人不在他购报销人列表中，直接break
      for (let i = 0; i < canApplyUserList.length; i++) {
        if (applyUserId === canApplyUserList[i].apply_userid) {
          applyUserData = canApplyUserList[i];
          break;
        }
      }
      let dataLength = currentMonthFillTableData.length;
      if(fundStageData.report_type === '1'){
        currentMonthFillTableData.push({
          funds_type: '1',                             //资金类型，1：个人，2：公共，3：他购，默认为1

          apply_username: applyUserData.apply_username,//报销申请人,默认是登录人
          apply_userid:applyUserData.apply_userid,     //报销申请人id，默认是登录人
          dept_name:applyUserData.deptname,
          ou:applyUserData.ou,
          team_id:applyUserData.team_id,
          team_name:applyUserData.team_name,

          subject_id: '',                              //科目名称id, 默认为空
          subject_name: '',                            //科目名称，默认为空
          boundModalFlag:'3',                          //选择科目费用时，是否弹出对话框
          childRows:[],

          funds_plan: '',                              //资金计划
          fill_state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
          state_name: '新增',
          remark: '',                                  //备注

          budget_id:'',
          spe_pay_description:'',
          budget_record_id:'',
          report_batch:'',

          opt_type: 'insert',
          isDelete:'insert',
          key: dataLength,
        });
      }else{
        currentMonthFillTableData.push({
          funds_type: '1',                             //资金类型，1：个人，2：公共，3：他购，默认为1

          apply_username: applyUserData.apply_username,//报销申请人,默认是登录人
          apply_userid:applyUserData.apply_userid,     //报销申请人id，默认是登录人
          dept_name:applyUserData.deptname,
          ou:applyUserData.ou,
          team_id:applyUserData.team_id,
          team_name:applyUserData.team_name,

          subject_id: '',                              //科目名称id, 默认为空
          subject_name: '',                            //科目名称，默认为空
          boundModalFlag:'3',                          //选择科目费用时，是否弹出对话框
          childRows:[],

          funds_plan: '',                              //资金计划
          funds_diff: '',                              //资金计划调整
          funds_current_amount: '',                    //调整后资金计划
          adjust_state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
          fill_state_code: '',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
          state_name: '新增',
          remark: '',                                  //备注

          budget_id:'',
          spe_pay_description:'',
          budget_record_id:'',
          report_batch:'',

          opt_type: 'insert',
          isDelete:'insert',
          key: dataLength,
        });
      }
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    *deleteCurrentMonthFillData({index}, {put, select}) {
      let {currentMonthFillTableData} = yield select(state => state.fundingPlanFillNew);
      //如果删除的记录不是新增的，将状态改为delete
      if (currentMonthFillTableData[index].opt_type !== 'insert') {
        currentMonthFillTableData[index].opt_type = 'delete';
      } else {
        //如果删除的记录是新增的，直接删除这条记录
        currentMonthFillTableData.splice(index, 1);
      }
      //处理之后将key值重排
      for (let i = 0; i < currentMonthFillTableData.length; i++) {
        currentMonthFillTableData[i].key = i;
      }
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    *clearCurrentMonthFillData({index}, {put, select}) {
      // 如果需要清空的这一行的数据和预填报阶段审核通过的时候匹配，则将数据变成预填报查询出来时候的数据，回到最初的状态。
      let {currentMonthFillTableData} = yield select(state => state.fundingPlanFillNew);
      // for(let i=0;i<currentMonthFillDataPass.length;i++){
      //   if(currentMonthFillTableData[index].budget_id === currentMonthFillDataPass[i].budget_id){
      //     currentMonthFillTableData[index] = currentMonthFillDataPass[i];
      //   }
      // }
      currentMonthFillTableData[index].isDelete = 'delete'; //审核通过的清空算是删除，但是审核通过的记录还要在界面上显示。
      currentMonthFillTableData[index].funds_current_amount = '';//调整后资金计划变为空
      if(currentMonthFillTableData[index].adjust_state_code === '1' || currentMonthFillTableData[index].adjust_state_code === '4'){ //如果目前是保存状态，将追加阶段状态改为5,提交的时候是修改而不是新增
        currentMonthFillTableData[index].adjust_state_code = '5';
      }else{
        currentMonthFillTableData[index].adjust_state_code = '';//如果目前状态不是保存，是其他，例如新增，提交的时候是新增而不是修改
      }
      currentMonthFillTableData[index].funds_diff = '';//资金计划调整变为空
      currentMonthFillTableData[index].childRows = currentMonthFillTableData[index].childRows.filter(item => item.fill_state_code ==='3');//将fill_state_code 为3 的挑选出来
      for( let i=0;i<currentMonthFillTableData[index].childRows.length; i++ ){
        currentMonthFillTableData[index].childRows[i].adjust_payment_amount_this_month = '';//资金计划调整变为空
        currentMonthFillTableData[index].childRows[i].adjust_state_code = '';//追加阶段状态为空
        //点击capex编辑 或者新增时，加入opt字段，该字段表示到底是新加的还是编辑的，如果是这两种情况，需要将isDelete改为其他状态，不能删除。
        // if(currentMonthFillTableData[index].childRows[i].opt ==='insert' || currentMonthFillTableData[index].childRows[i].opt === 'edit'){
        //   currentMonthFillTableData[index].isDelete = 'update';
        // }
      }
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },
    *changeDeleteToOtherMonth({index}, {put, select}) {
      // 点击capex编辑 或者新增时，加入opt字段，该字段表示到底是新加的还是编辑的。并且将将isDelete改为其他状态，不能删除。
      let {currentMonthFillTableData} = yield select(state => state.fundingPlanFillNew);
      currentMonthFillTableData[index].isDelete = 'other'; //审核通过的清空算是删除，但是审核通过的记录还要在界面上显示。
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },
    *editCurrentMonthSelectData({value, index, colType,subjectObj}, {put, select}) {
      //opt_type insert类 search类 delete类

      //value 修改的值
      //index 当前行的索引
      //colTpye 修改的是哪一个slect
      // subjectObj 科目类型中的科目具体信息
      let {currentMonthFillTableData,canApplyUserList} = yield select(state => state.fundingPlanFillNew);
      if (colType === 'funds_type') { //funds_type 资金类型（个人，他购，公共）影响 报销申请人
        currentMonthFillTableData[index].funds_type = value;
        currentMonthFillTableData[index].isDelete = 'other';
        //如果修改为 个人和公共，需要去修改 报销申请人数据
        if (value === '1' || value === '2') {  // 个人或者公共
          //如果编辑的是资金类型（funds_type）
          //if (currentMonthFillTableData[index].opt_type === 'insert') {
            //如果是新增的，报销申请人 使用登录人姓名
            let applyUserId = Cookie.get('userid');
            let applyUserData = {}; //通过id得到这个人的其他信息
            for (let i = 0; i < canApplyUserList.length; i++) {
              if (applyUserId === canApplyUserList[i].apply_userid) {
                applyUserData = canApplyUserList[i];
                break;
              }
            }
            currentMonthFillTableData[index].apply_username = applyUserData.apply_username;
            currentMonthFillTableData[index].apply_userid = applyUserData.apply_userid;
            currentMonthFillTableData[index].dept_name = applyUserData.deptname;
            currentMonthFillTableData[index].ou = applyUserData.ou;
            currentMonthFillTableData[index].team_id = applyUserData.team_id;
            currentMonthFillTableData[index].team_name = applyUserData.team_name;
          //}
          // else {
          //   //如果是查询出来的，报销申请人 使用原始查询数据
          //   currentMonthFillTableData[index].apply_username = currentMonthFillTableOrig[index].apply_username;
          //   currentMonthFillTableData[index].apply_userid = currentMonthFillTableOrig[index].apply_userid;
          //   currentMonthFillTableData[index].dept_name = currentMonthFillTableOrig[index].dept_name;
          //   currentMonthFillTableData[index].ou = currentMonthFillTableOrig[index].ou;
          //   currentMonthFillTableData[index].team_id = currentMonthFillTableOrig[index].team_id;
          //   currentMonthFillTableData[index].team_name = currentMonthFillTableOrig[index].team_name;
          // }
        }
      } else if (colType === 'apply_userid') {
        //如果编辑的是 报销申请人（apply_userid）
        for (let i = 0; i < canApplyUserList.length; i++) {
          let applyUserData = {};
          for (let i = 0; i < canApplyUserList.length; i++) {
            if (value === canApplyUserList[i].apply_userid) {
              applyUserData = canApplyUserList[i];
              break;
            }
          }
          currentMonthFillTableData[index].apply_username = applyUserData.apply_username;
          currentMonthFillTableData[index].apply_userid = applyUserData.apply_userid;
          currentMonthFillTableData[index].dept_name = applyUserData.deptname;
          currentMonthFillTableData[index].ou = applyUserData.ou;
          currentMonthFillTableData[index].team_id = applyUserData.team_id;
          currentMonthFillTableData[index].team_name = applyUserData.team_name;
        }
      } else if (colType === 'subject_id'){
        //如果编辑的是 普通的 科目名称，需要去改变 boundModalFlag，childRows, 也要清空 资金计划(总共五个值)
        currentMonthFillTableData[index].subject_name = subjectObj.fee_name;
        currentMonthFillTableData[index].subject_id = subjectObj.uuid;
        currentMonthFillTableData[index].boundModalFlag = subjectObj.flag;
        currentMonthFillTableData[index].childRows = [];
        currentMonthFillTableData[index].funds_plan = '';
      }
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    *editCurrentMonthInputData({value, index, colType}, {put, select}) {
      let {currentMonthFillTableData} = yield select(state => state.fundingPlanFillNew);
      currentMonthFillTableData[index][colType] = value;
      currentMonthFillTableData[index].isDelete = 'other';
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    *editCurrentCapexData({index,fillCapexData,subjectObj,capexMoneySum},{put,select}){
      let {currentMonthFillTableData,fundStageData} = yield select(state => state.fundingPlanFillNew);
      currentMonthFillTableData[index].subject_name = subjectObj.fee_name; //1.修改科目名称
      currentMonthFillTableData[index].subject_id = subjectObj.uuid;       //2.修改科目id
      currentMonthFillTableData[index].childRows = fillCapexData;          //3.修改childRows
      currentMonthFillTableData[index].boundModalFlag = subjectObj.flag;   //4.弹出标志位
      currentMonthFillTableData[index].isDelete = 'other';

      //5.资金计划
      //如果是预填报阶段，修改的是资金计划，如果是追加阶段和调整阶段，修改的是 调整后资金计划
      if (fundStageData.report_type === '1') {
        currentMonthFillTableData[index].funds_plan = capexMoneySum;            //需要修改资金计划的值
      } else {
        currentMonthFillTableData[index].funds_current_amount = capexMoneySum;  //需要修改调整后资金计划的值
      }
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    *copyCurrentMonthFillData({},{call,put,select}){
      let {currentMonthFillTableData,fundStageData,canApplyUserList} = yield select(state => state.fundingPlanFillNew);

      let postData = {
        arg_create_user_id: Cookie.get('userid'),
        arg_is_pre_year_funds: '2',                //2当月 ，1以前
        arg_plan_year: fundStageData.plan_year,
        arg_plan_month: parseInt(fundStageData.plan_month)-1,
      };
      let currentMonthList = yield call(fundingPlanFillService.copyCurrentMonthFillData, postData);
      let dataLength = currentMonthFillTableData.length;
      let currentMonthData = currentMonthList.DataRows;
      if(currentMonthList.RetCode === '1'){
        for(let i=0;i<currentMonthData.length;i++){
          let applyUserId = currentMonthData[i].apply_userid;//获取到复制后他给我的apply_userid，循环得到applyUserData
          let applyUserData = {};
          //申请人不在他购报销人列表中，直接break
          for (let j = 0;j < canApplyUserList.length; j++) {
            if (applyUserId === canApplyUserList[j].apply_userid) {
              applyUserData = canApplyUserList[j];
              break;
            }
          }
          if(fundStageData.report_type === '1'){
            currentMonthFillTableData.push({
              funds_type: currentMonthData[i].funds_type,                             //资金类型，1：个人，2：公共，3：他购，默认为1

              apply_username: currentMonthData[i].apply_username,//报销申请人,默认是登录人
              apply_userid:currentMonthData[i].apply_userid,     //报销申请人id，默认是登录人
              dept_name:applyUserData.deptname,
              ou:applyUserData.ou,
              team_id:applyUserData.team_id,
              team_name:applyUserData.team_name,

              subject_id: currentMonthData[i].subject_id,                              //科目名称id, 默认为空
              subject_name: currentMonthData[i].subject_name,                            //科目名称，默认为空
              boundModalFlag:currentMonthData[i].subject_name  === '其他capex' || currentMonthData[i].subject_name=== '资产购置'?'1':'3',                          //选择科目费用时，是否弹出对话框
              childRows:[],

              funds_plan: '',                              //资金计划
              fill_state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
              state_name: '新增',
              remark: '',                                  //备注

              budget_id:'',
              spe_pay_description:'',
              budget_record_id:'',
              report_batch:'',

              opt_type: 'insert',
              key: dataLength+i,
            });
          }else{
            currentMonthFillTableData.push({
              funds_type: currentMonthData[i].funds_type,                            //资金类型，1：个人，2：公共，3：他购，默认为1

              apply_username: currentMonthData[i].apply_username,//报销申请人,默认是登录人
              apply_userid:currentMonthData[i].apply_userid,     //报销申请人id，默认是登录人
              dept_name:applyUserData.deptname,
              ou:applyUserData.ou,
              team_id:applyUserData.team_id,
              team_name:applyUserData.team_name,

              subject_id: currentMonthData[i].subject_id,                              //科目名称id, 默认为空
              subject_name: currentMonthData[i].subject_name,                            //科目名称，默认为空
              boundModalFlag:currentMonthData[i].subject_name  === '其他capex' || currentMonthData[i].subject_name === '资产购置'?'1':'3',                           //选择科目费用时，是否弹出对话框
              childRows:[],

              funds_plan: '',                              //资金计划
              funds_diff: '',                              //资金计划调整
              funds_current_amount: '',                    //调整后资金计划
              adjust_state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
              fill_state_code: '',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
              state_name: '新增',
              remark: '',                                  //备注

              budget_id:'',
              spe_pay_description:'',
              budget_record_id:'',
              report_batch:'',

              opt_type: 'insert',
              key: dataLength+i,
            });
          }
        }
      }
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },


    *queryPriorYearFillData({isFillOrAdjust},{call,put,select}){
      const { feeList,fundStageData } = yield select(state => state.fundingPlanFillNew);
      if(fundStageData.length !== 0){
        let fillPostData = {
          arg_userid: Cookie.get('userid'),
          arg_is_pre_year_funds: '1',                //2当月 ，1以前
          arg_report_batch: isFillOrAdjust ==='1'?isFillOrAdjust:fundStageData.report_type,                //1预填报 ，2追加
          arg_plan_year: fundStageData.plan_year,
          arg_plan_month: fundStageData.plan_month,
        };
        const priorYearFillTableData = yield call(fundingPlanFillService.getFillData, fillPostData);
        let priorYearFillTableDataPass =[];
        //查询出来的数据给每个数据贴上标签：search出来的 opt_type：search，
        // 给每一个数据加上一个boundModalFlag标签，判断是不是要有弹框，这个标签在feeList[k].flag里
        if (priorYearFillTableData.RetCode === '1') {
          for (let i = 0; i < priorYearFillTableData.DataRows.length; i++) {
            let childRows = [];
            if ('childRows' in priorYearFillTableData.DataRows[i] && priorYearFillTableData.DataRows[i].childRows !== '') {
              childRows = JSON.parse(priorYearFillTableData.DataRows[i].childRows);
              for (let j = 0; j < childRows.length; j++) {
                childRows[j].opt_type = 'search';
                childRows[j].key = j;
              }
            }
            priorYearFillTableData.DataRows[i].childRows = childRows;
            priorYearFillTableData.DataRows[i].opt_type = 'search';
            priorYearFillTableData.DataRows[i].isDelete = 'search';//清空的数据是delete，查出来的数据是其他的状态
            priorYearFillTableData.DataRows[i].key = i;

            //判断当前返回的数据中是否有 办公费 和 capax的数据
            let boundModalFlag = '3';    // 1 : capex  , 2 :办公费  ，3：其他，1是有弹框的
            for (let k = 0; k < feeList.length; k++) {
              if (priorYearFillTableData.DataRows[i].subject_id === feeList[k].uuid) {
                boundModalFlag = feeList[k].flag;
                break;
              }
            }
            priorYearFillTableData.DataRows[i].boundModalFlag = boundModalFlag;
            if(priorYearFillTableData.DataRows[i].fill_state_code === '3'){ //预填报审核通过的数据存起来
              priorYearFillTableDataPass.push(priorYearFillTableData.DataRows[i]);
            }
          }
          yield put({
            type:'save',
            payload:{
              priorYearFillTableData:priorYearFillTableData.DataRows,
              priorYearFillTableOrig:JSON.parse(JSON.stringify(priorYearFillTableData.DataRows)),//这个是目前的原始数据，后面会对齐修改
              priorYearFillTableDataPass:JSON.parse(JSON.stringify(priorYearFillTableDataPass)),//这个是目前的原始数据，后面会对齐修改
            }
          });
        }
      }
    },

    *addPriorYearFillData({}, {put, select}) {
      let {priorYearFillTableData,canApplyUserList,fundStageData} = yield select(state => state.fundingPlanFillNew);
      let applyUserId = Cookie.get('userid');
      let applyUserData = {};
      //申请人不在他购报销人列表中，直接break
      for (let i = 0; i < canApplyUserList.length; i++) {
        if (applyUserId === canApplyUserList[i].apply_userid) {
          applyUserData = canApplyUserList[i];
          break;
        }
      }
      //添加，将所有字段添加到priorYearFillTableData中，key自动加一，标志位insert
      let dataLength = priorYearFillTableData.length;
      if(fundStageData.report_type === '1'){
        priorYearFillTableData.push({
          funds_type: '1',                             //资金类型，1：个人，2：公共，3：他购，默认为1

          apply_username: applyUserData.apply_username,//报销申请人,默认是登录人
          apply_userid:applyUserData.apply_userid,     //报销申请人id，默认是登录人
          dept_name:applyUserData.deptname,
          ou:applyUserData.ou,
          team_id:applyUserData.team_id,
          team_name:applyUserData.team_name,

          subject_id: '',                              //科目名称id, 默认为空
          subject_name: '',                            //科目名称，默认为空
          boundModalFlag:'3',                          //选择科目费用时，是否弹出对话框
          childRows:[],

          funds_plan: '',                              //资金计划
          fill_state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
          state_name: '新增',
          remark: '',                                  //备注

          budget_id:'',
          spe_pay_description:'',
          budget_record_id:'',
          report_batch:'',

          opt_type: 'insert',
          key: dataLength,
        });
      }else{
        priorYearFillTableData.push({
          funds_type: '1',                             //资金类型，1：个人，2：公共，3：他购，默认为1

          apply_username: applyUserData.apply_username,//报销申请人,默认是登录人
          apply_userid:applyUserData.apply_userid,     //报销申请人id，默认是登录人
          dept_name:applyUserData.deptname,
          ou:applyUserData.ou,
          team_id:applyUserData.team_id,
          team_name:applyUserData.team_name,

          subject_id: '',                              //科目名称id, 默认为空
          subject_name: '',                            //科目名称，默认为空
          boundModalFlag:'3',                          //选择科目费用时，是否弹出对话框
          childRows:[],

          funds_plan: '',                              //资金计划
          funds_diff: '',                              //资金计划调整
          funds_current_amount: '',                    //调整后资金计划
          adjust_state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
          fill_state_code: '',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
          state_name: '新增',
          remark: '',                                  //备注

          budget_id:'',
          spe_pay_description:'',
          budget_record_id:'',
          report_batch:'',

          opt_type: 'insert',
          key: dataLength,
        });
      }
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    *deletePriorYearFillData({index}, {put, select}) {
      let {priorYearFillTableData} = yield select(state => state.fundingPlanFillNew);
      //如果删除的记录不是新增的，将状态改为delete
      if (priorYearFillTableData[index].opt_type !== 'insert') {
        priorYearFillTableData[index].opt_type = 'delete';
      } else {
        //如果删除的记录是新增的，直接删除这条记录
        priorYearFillTableData.splice(index, 1);
      }
      //删完之后少了一条，需要重新赋予key值
      //处理之后将key值重排
      for (let i = 0; i < priorYearFillTableData.length; i++) {
        priorYearFillTableData[i].key = i;
      }
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    *clearPriorYearFillData({index}, {put, select}) {
      // 需要清空5个值，并且设置标志位为delete，这种情况也算是删除。
      let {priorYearFillTableData} = yield select(state => state.fundingPlanFillNew);
      //预填报审核通过的数据存起来，再进行比较，将数据归还。
      // for(let i=0;i<priorYearFillTableDataPass.length;i++){
      //   if(priorYearFillTableData[index].budget_id === priorYearFillTableDataPass[i].budget_id){
      //     priorYearFillTableData[index] = priorYearFillTableDataPass[i];
      //   }
      // }
      priorYearFillTableData[index].isDelete = 'delete'; //审核通过的清空算是删除，但是审核通过的记录还要在界面上显示。
      priorYearFillTableData[index].funds_current_amount = '';//调整后资金计划变为空
      if(priorYearFillTableData[index].adjust_state_code === '1'|| priorYearFillTableData[index].adjust_state_code === '4'){ //如果目前是保存状态，将追加阶段状态改为5,提交的时候是修改而不是新增
        priorYearFillTableData[index].adjust_state_code = '5';
      }else{
        priorYearFillTableData[index].adjust_state_code = '';//如果目前状态不是保存，是其他，例如新增，提交的时候是新增而不是修改
      }
      priorYearFillTableData[index].funds_diff = '';//资金计划调整变为空
      priorYearFillTableData[index].childRows = priorYearFillTableData[index].childRows.filter(item => item.fill_state_code ==='3');//将fill_state_code 为3 的挑选出来
      for( let i=0;i<priorYearFillTableData[index].childRows.length; i++ ){
        priorYearFillTableData[index].childRows[i].adjust_payment_amount_this_month = '';//资金计划调整变为空
        priorYearFillTableData[index].childRows[i].adjust_state_code = '';//追加阶段状态为空
        // if(priorYearFillTableData[index].childRows[i].opt ==='insert' || priorYearFillTableData[index].childRows[i].opt === 'edit'){
        //   priorYearFillTableData[index].isDelete = 'update';
        // }
        // if(priorYearFillTableData[index].childRows[i].fill_state_code !== '3'){ //如果填报阶段的状态不是审核通过，删除这条记录
        //   priorYearFillTableData[index].childRows.splice(i,1);
        // }
      }
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    *changeDeleteToOther({index}, {put, select}) {
      // 点击capex编辑 或者新增时，加入opt字段，该字段表示到底是新加的还是编辑的。并且将将isDelete改为其他状态，不能删除。
      let {priorYearFillTableData} = yield select(state => state.fundingPlanFillNew);
      priorYearFillTableData[index].isDelete = 'other'; //审核通过的清空算是删除，但是审核通过的记录还要在界面上显示。
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    *editPriorYearSelectData({value, index, colType,subjectObj}, {put, select}) {
      //opt_type insert类 search类 delete类

      //value 修改的值
      //index 当前行的索引
      //colTpye 修改的是哪一个select
      // subjectObj 科目类型中的科目具体信息
      let {priorYearFillTableData,canApplyUserList} = yield select(state => state.fundingPlanFillNew);
      //如果改的是资金类型，首先将资金类型的值改了，
      // 然后如果是个人和公共，如果是新增的用cookie里的个人信息，放到priorYearFillTableData中
      //如果是查出来的用以前数据的值
      if (colType === 'funds_type') { //funds_type 资金类型（个人，他购，公共）影响 报销申请人
        priorYearFillTableData[index].funds_type = value;
        priorYearFillTableData[index].isDelete = 'other'; //审核通过的清空算是删除，但是审核通过的记录还要在界面上显示。
        //如果修改为 个人和公共，需要去修改 报销申请人数据
        if (value === '1' || value === '2') {  // 个人或者公共
          //if (priorYearFillTableData[index].opt_type === 'insert') {
            //如果是新增的，报销申请人 使用登录人姓名
            let applyUserId = Cookie.get('userid');
            let applyUserData = {}; //通过id得到这个人的其他信息
            for (let i = 0; i < canApplyUserList.length; i++) {
              if (applyUserId === canApplyUserList[i].apply_userid) {
                applyUserData = canApplyUserList[i];
                break;
              }
            }
            priorYearFillTableData[index].apply_username = applyUserData.apply_username;
            priorYearFillTableData[index].apply_userid = applyUserData.apply_userid;
            priorYearFillTableData[index].dept_name = applyUserData.deptname;
            priorYearFillTableData[index].ou = applyUserData.ou;
            priorYearFillTableData[index].team_id = applyUserData.team_id;
            priorYearFillTableData[index].team_name = applyUserData.team_name;
          //}
          // else {
          //   //如果是查询出来的，报销申请人 使用原始查询数据
          //   priorYearFillTableData[index].apply_username = priorYearFillTableOrig[index].apply_username;
          //   priorYearFillTableData[index].apply_userid = priorYearFillTableOrig[index].apply_userid;
          //   priorYearFillTableData[index].dept_name = priorYearFillTableOrig[index].dept_name;
          //   priorYearFillTableData[index].ou = priorYearFillTableOrig[index].ou;
          //   priorYearFillTableData[index].team_id = priorYearFillTableOrig[index].team_id;
          //   priorYearFillTableData[index].team_name = priorYearFillTableOrig[index].team_name;
          // }
        }
      } else if (colType === 'apply_userid') {
        //如果编辑的是 报销申请人（apply_userid）
        for (let i = 0; i < canApplyUserList.length; i++) {
          let applyUserData = {};
          for (let i = 0; i < canApplyUserList.length; i++) {
            if (value === canApplyUserList[i].apply_userid) {
              applyUserData = canApplyUserList[i];
              break;
            }
          }
          priorYearFillTableData[index].apply_username = applyUserData.apply_username;
          priorYearFillTableData[index].apply_userid = applyUserData.apply_userid;
          priorYearFillTableData[index].dept_name = applyUserData.deptname;
          priorYearFillTableData[index].ou = applyUserData.ou;
          priorYearFillTableData[index].team_id = applyUserData.team_id;
          priorYearFillTableData[index].team_name = applyUserData.team_name;
        }
      } else if (colType === 'subject_id'){
        //如果编辑的是 普通的 科目名称，需要去改变 boundModalFlag，childRows,subject_name ，subject_id ，funds_plan (总共五个值)
        priorYearFillTableData[index].subject_name = subjectObj.fee_name;
        priorYearFillTableData[index].subject_id = subjectObj.uuid;
        priorYearFillTableData[index].boundModalFlag = subjectObj.flag;
        priorYearFillTableData[index].childRows = [];
        priorYearFillTableData[index].funds_plan = '';
      }
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    *editPriorYearInputData({value, index, colType}, {put, select}) {
      //修改input框，直接将值存进去即可
      let {priorYearFillTableData} = yield select(state => state.fundingPlanFillNew);
      priorYearFillTableData[index][colType] = value;
      priorYearFillTableData[index].isDelete = 'other'; //审核通过的清空算是删除，但是审核通过的记录还要在界面上显示。
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    *editPriorYearCapexData({index,fillCapexData,subjectObj,capexMoneySum},{put,select}){
      //修改capex，最重要修改childRows里面的值
      let {priorYearFillTableData,fundStageData} = yield select(state => state.fundingPlanFillNew);
      priorYearFillTableData[index].subject_name = subjectObj.fee_name; //1.修改科目名称
      priorYearFillTableData[index].subject_id = subjectObj.uuid;       //2.修改科目id
      priorYearFillTableData[index].childRows = fillCapexData;          //3.修改childRows
      priorYearFillTableData[index].boundModalFlag = subjectObj.flag;   //4.弹出标志位
      priorYearFillTableData[index].isDelete = 'other'; //审核通过的清空算是删除，但是审核通过的记录还要在界面上显示。

      //5.资金计划
      //如果是预填报阶段，修改的是资金计划，如果是追加阶段和调整阶段，修改的是 调整后资金计划
      if (fundStageData.report_type === '1') {
        priorYearFillTableData[index].funds_plan = capexMoneySum;            //需要修改资金计划的值
      } else {
        priorYearFillTableData[index].funds_current_amount = capexMoneySum;  //需要修改调整后资金计划的值
      }
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    *copyPriorYearFillData({},{call,put,select}){
      let {priorYearFillTableData,fundStageData,canApplyUserList} = yield select(state => state.fundingPlanFillNew);

      let postData = {
        arg_create_user_id: Cookie.get('userid'),
        arg_is_pre_year_funds: '1',                //2当月 ，1以前
        arg_plan_year: fundStageData.plan_year,
        arg_plan_month: parseInt(fundStageData.plan_month)-1,
      };
      let priorYearList = yield call(fundingPlanFillService.copyCurrentMonthFillData, postData);
      let dataLength = priorYearFillTableData.length;
      let priorYearData = priorYearList.DataRows;
      if(priorYearList.RetCode === '1'){
        for(let i=0;i<priorYearData.length;i++){
          let applyUserId = priorYearData[i].apply_userid;//获取到复制后他给我的apply_userid，循环得到applyUserData
          let applyUserData = {};
          //申请人不在他购报销人列表中，直接break
          for (let j = 0;j < canApplyUserList.length; j++) {
            if (applyUserId === canApplyUserList[j].apply_userid) {
              applyUserData = canApplyUserList[j];
              break;
            }
          }
          if(fundStageData.report_type === '1'){
            priorYearFillTableData.push({
              funds_type: priorYearData[i].funds_type,                             //资金类型，1：个人，2：公共，3：他购，默认为1

              apply_username: priorYearData[i].apply_username,//报销申请人,默认是登录人
              apply_userid:priorYearData[i].apply_userid,     //报销申请人id，默认是登录人
              dept_name:applyUserData.deptname,
              ou:applyUserData.ou,
              team_id:applyUserData.team_id,
              team_name:applyUserData.team_name,

              subject_id: priorYearData[i].subject_id,                              //科目名称id, 默认为空
              subject_name: priorYearData[i].subject_name,                            //科目名称，默认为空
              boundModalFlag:priorYearData[i].subject_name  === '其他capex' || priorYearData[i].subject_name=== '资产购置'?'1':'3',                          //选择科目费用时，是否弹出对话框
              childRows:[],

              funds_plan: '',                              //资金计划
              fill_state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
              state_name: '新增',
              remark: '',                                  //备注

              budget_id:'',
              spe_pay_description:'',
              budget_record_id:'',
              report_batch:'',

              opt_type: 'insert',
              key: dataLength+i,
            });
          }else{
            priorYearFillTableData.push({
              funds_type: priorYearData[i].funds_type,                            //资金类型，1：个人，2：公共，3：他购，默认为1

              apply_username: priorYearData[i].apply_username,//报销申请人,默认是登录人
              apply_userid:priorYearData[i].apply_userid,     //报销申请人id，默认是登录人
              dept_name:applyUserData.deptname,
              ou:applyUserData.ou,
              team_id:applyUserData.team_id,
              team_name:applyUserData.team_name,

              subject_id: priorYearData[i].subject_id,                              //科目名称id, 默认为空
              subject_name: priorYearData[i].subject_name,                            //科目名称，默认为空
              boundModalFlag:priorYearData[i].subject_name  === '其他capex' || priorYearData[i].subject_name === '资产购置'?'1':'3',                           //选择科目费用时，是否弹出对话框
              childRows:[],

              funds_plan: '',                              //资金计划
              funds_diff: '',                              //资金计划调整
              funds_current_amount: '',                    //调整后资金计划
              adjust_state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
              fill_state_code: '',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
              state_name: '新增',
              remark: '',                                  //备注

              budget_id:'',
              spe_pay_description:'',
              budget_record_id:'',
              report_batch:'',

              opt_type: 'insert',
              key: dataLength+i,
            });
          }
        }
      }
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    *saveFillData({flag,tabFlag},{call,put,select}){
      const {fundStageData} = yield select(state => state.fundingPlanFillNew);
      let tableData = [];
      let tableOrig = [];
      if (tabFlag === '2') {
        //如果是 当月填报
        tableData = yield select(state => state.fundingPlanFillNew.currentMonthFillTableData);
        tableOrig = yield select(state => state.fundingPlanFillNew.currentMonthFillTableOrig);
      } else if (tabFlag === '1') {
        //如果是 以前年度
        tableData = yield select(state => state.fundingPlanFillNew.priorYearFillTableData);
        tableOrig = yield select(state => state.fundingPlanFillNew.priorYearFillTableOrig);
      }
      //console.log('===============================TableData提交保存');
      //console.log(tableData);
      let postData = {};
      let DataRows = [];
      //currentMonthFillTableData 或者priorYearFillTableData 判断每一行数据是否应该提交
      // is_pre_year_funds：以前年度还是当月资金计划
      // status_code 保存还是提交
      // create_userid
      // flag_flied：删除还是其他 4个字段
      for (let i = 0; i < tableData.length; i++) {
        let canSaveFlag = false;   //是否需要提交
        let isChange = false;     //是修改，还是新增(删除不用这个判断）用 delete即可
        if (tableData[i].opt_type === 'delete') {   //库里存在的，前端删除加delete属性，如果是库里不存在的，前端删除，直接删除，这里不会出现那条数据
          //如果可以删除，那么这条数据是可以保存提交的
          canSaveFlag = true;
        } else if( tableData[i].hasOwnProperty('isDelete') && tableData[i].isDelete ==='delete'){ //如果第二个阶段点了清空，并且目前的数据和原来的数据不一样，可以提交
          if (tableData[i].funds_current_amount !== tableOrig[i].funds_current_amount) {
            canSaveFlag = true;
          }
        } else {
          //如果不是删除的，进行一下判断
          if (fundStageData.report_type === '1' ) {
            //如果是预填报阶段（1），只有新增（0）和保存（1）退回的（4）的可保存提交   // state_code : 1 保存  2 待审核  3 审核通过  4 审核退回
            canSaveFlag = tableData[i].fill_state_code === '0' || tableData[i].fill_state_code === '1' || tableData[i].fill_state_code === '4';
            isChange = tableData[i].fill_state_code === '1' || tableData[i].fill_state_code === '4';  //保存和退回的算修改
          } else if (fundStageData.report_type === '2' ) {
            isChange = tableData[i].adjust_state_code === '1'|| tableData[i].adjust_state_code === '4' || tableData[i].adjust_state_code === '5';  //追加阶段：保存的，退回的
            //如果是追加阶段（2）0 代表新增，1代表保存，2待审核，3 审核通过，4 退回，'' 清空（有两种，一种算新增‘’，一种算修改‘5’）当查出来的adjust_state_code是3时，算修改
            if (tableData[i].adjust_state_code === '0' || tableData[i].adjust_state_code === '1'|| tableData[i].adjust_state_code === '4') {
              //如果是新增和保存的或者退回的 可保存和提交
              canSaveFlag = true;
            }else if (tableData[i].adjust_state_code === '' || tableData[i].adjust_state_code === '5') { // 追加阶段：清空，两种 ‘’新增可以提交，‘5'修改，可以提交
              //如果在追加阶段，预填报审核通过的且"修改了"  “调整后资金计划” 的可保存和提交
              if (tableData[i].funds_current_amount !== tableOrig[i].funds_current_amount) {
                canSaveFlag = true;
              }
            }
          } else if (fundStageData.report_type === '3' ) {
            //如果是调整报阶段（3）,只有新增和保存，退回的数据才能保存和提交，（待审核的，审核通过的）
            canSaveFlag = tableData[i].adjust_state_code === '0' || tableData[i].adjust_state_code === '1'|| tableData[i].adjust_state_code === '4';
            isChange = tableData[i].adjust_state_code === '1' || tableData[i].adjust_state_code === '4';  //保存和退回的算修改
          }
        }

        //如果能够保存和提交  才把tableData[i]放到obj中，tableData[i].opt_type 如果是delete 告诉后台这是要删除的数据。
        if (canSaveFlag === true) {
          //判断金额为负数时，输入了 负号  但是不输入数字
          if (tableData[i].opt_type !== 'delete') { //如果不是要删除的数据，需要判断各个输入是否为空。
            if (tableData[i].subject_id === '') {
              message.error('科目名称不能为空');
              return;
            }
            if (tableData[i].funds_plan === '-') {
              message.error('资金计划不能为“-”');
              return;
            }
            if (tableData[i].funds_current_amount === '-') {
              message.error('调整后资金计划不能为“-”');
              return;
            }
            if (fundStageData.report_type === '1' && tableData[i].funds_plan.trim() === '' ) {
              //预填报阶段，资金计划不能为“”
              message.error('预填报阶段，资金计划不能为空');
              return;
            }
            if(!tableData[i].hasOwnProperty('isDelete') || tableData[i].isDelete !== 'delete' ){ //如果没有delete字段,或者isDelete !== isDelete 才判断是否为空，
              if (fundStageData.report_type === '2' && tableData[i].funds_current_amount.trim() === '') {
                //追加阶段，调整后资金计划不能为“”
                message.error('调整阶段，调整后资金计划不能为空');
                return;
              }
            }
            if (fundStageData.report_type === '3' && tableData[i].funds_current_amount.trim() === '' ) {
              //调整阶段，调整后资金计划不能为“”
              message.error('追加阶段，调整后资金计划不能为空');
              return;
            }
            if ( tabFlag === '1' && tableData[i].spe_pay_description.trim() === '') {
              message.error('具体付款事项描述不能为空');
              return;
            }

          }
          //如果能够保存和提交  才把tableData[i]放到obj中，tableData[i].opt_type 如果是delete 告诉后台这是要删除的数据。
          let obj = {};
          //第二个阶段，如果是第一个阶段审核通过的并且点了清空按钮，算是删除的数据。
          if (tableData[i].opt_type === 'delete' || (tableData[i].hasOwnProperty('isDelete') && tableData[i].isDelete ==='delete')) {   //需要删除的行 传这两个参数
            obj.flag_field = '2';
            obj.budget_id = tableData[i].budget_id;
          } else {
            if (isChange === true ) {              //需要修改的行   flag_flied === 3
              //如果是追加阶段修改审核通过的  调整后资金计划  flag_flied = 2

              obj = tableData[i];
              obj.flag_field = '3';
              if(fundStageData.report_type === '2' || fundStageData.report_type === '3'){
                //追加阶段 将adjust_payment_amount_this_month的值变成payment_amount_this_month传递给后台（后台需要），
                // 成功后重新查询一遍，payment_amount_this_month是查询出来的数据而非自己改的数据。
                for(let j=0;j<tableData[i].childRows.length;j++){
                  obj.childRows[j].payment_amount_this_month = tableData[i].childRows[j].adjust_payment_amount_this_month;
                  obj.childRows[j].uuid = '';
                }
              }
            } else {                             //新增的行   flag_flied === 1
              //其他情况（新增和保存的）flag_flied = 1
              obj = tableData[i];
              obj.flag_field = '1';
              if(fundStageData.report_type === '2' ||fundStageData.report_type === '3' ){ //追加阶段
                for(let j=0;j<tableData[i].childRows.length;j++){
                  obj.childRows[j].payment_amount_this_month = tableData[i].childRows[j].adjust_payment_amount_this_month;
                  obj.childRows[j].uuid = '';
                }
              }
            }
          }
          DataRows.push(obj);
        }
      }
      postData.state_code = flag;         //保存或者提交的状态  注意与 state_code区分 保存是1 提交是2
      postData.create_userid = Cookie.get('userid');
      postData.report_batch = fundStageData.report_type; //阶段名字，1是预填报，2是追加阶段
      postData.is_pre_year_funds = tabFlag;   //以前年度是1 2是本月
      postData.DataRows = JSON.stringify(DataRows);
      postData.plan_year = fundStageData.plan_year;
      postData.plan_month = fundStageData.plan_month;
      //console.log('=============================保存提交postData');
      //console.log(postData);
        if (JSON.parse(postData.DataRows).length > 0) {
          let data = {};
          if(fundStageData.report_type === '1'){
            data = yield call(fundingPlanFillService.saveOrSubmitFillData,postData);
          }else if(fundStageData.report_type === '2' ||fundStageData.report_type === '3'){
            data = yield call(fundingPlanFillService.saveOrSubmitFillAdjustData,postData);
          }
          let isFillOrAdjust = fundStageData.report_type;
          if (data.RetCode === '1') {
            if (tabFlag === '2') {
              yield put({ type:'queryCurrentMonthFillData',isFillOrAdjust});
            } else if (tabFlag === '1') {
              yield put({ type:'queryPriorYearFillData',isFillOrAdjust});
            }
            if (flag === '1') {
              message.info('保存成功');
            } else if (flag === '2') {
              message.info('提交成功');
            }
          }
        } else {
        message.info('没有填报或修改数据，请填报或修改后再保存或提交！');
      }
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_fill') {
          let isFillOrAdjust = '1';
          dispatch({ type: 'init',isFillOrAdjust});
          dispatch({type: 'initData'});
        }
        if(pathname === '/financeApp/funding_plan/funding_plan_append_fill'){
          let isFillOrAdjust = '2';
          dispatch({ type: 'init',isFillOrAdjust});
          dispatch({type: 'initData'});
        }
      });
    },
  },
};
