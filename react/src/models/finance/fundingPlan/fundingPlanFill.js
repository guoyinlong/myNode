/**
 * 作者：邓广晖
 * 日期：2018-2-28
 * 邮箱：denggh6@chinaunicom.cn
 * 文件说明：资金计划填报
 */
import * as fundingPlanFillService from '../../../services/finance/fundingPlanFillService';
import Cookie from 'js-cookie';
import {message} from 'antd';

const OFFICE_FEE_NAME = '办公费';

export default {
  namespace: 'fundingPlanFill',
  state: {
    /*当月资金计划填报  和 以前年度应付款填报 公共数据*/
    fundStageData:{},                              //资金填报阶段数据包括 uid year month
    roleType:'1',                                  //用户角色   1、普通员工 2、小组管理员 3、部门管理员
    canApplyUserList:[],                           //报销申请人列表
    feeList:[],                                    //费用科目顺序列表数据
    feeListTree:[],                                //费用科目树形列表数据
    officeStationery:[],                           //选择办公费时的，办公用品数据
    ordinalStationery:[],                          //办公用品由于有主子类别，这里将所有子数据按顺序连接在一起

    /*当月资金计划数据*/
    currentMonthFillTableData:[],                  //本月资金计划填报的表格数据
    currentMonthFillTableOrig:[],                  //本月资金计划填报的表格数据,原始数据

    /*以前年度应付款填报数据*/
    priorYearFillTableData:[],                     //以前年度应付款填报的表格数据
    priorYearFillTableOrig:[],                     //以前年度应付款填报的表格数据,原始数据

  },

  reducers: {
    initData(state){
      return {
        ...state,
        /*当月资金计划填报  和 以前年度应付款填报 公共数据*/
        fundStageData:{},                              //资金填报阶段数据包括 uid year month
        roleType:'1',                                  //用户角色   1、普通员工 2、小组管理员 3、部门管理员
        canApplyUserList:[],                           //报销申请人列表
        feeList:[],                                    //费用科目顺序列表数据
        feeListTree:[],                                //费用科目树形列表数据
        officeStationery:[],                           //选择办公费时的，办公用品数据
        ordinalStationery:[],                          //办公用品由于有主子类别，这里将所有子数据按顺序连接在一起

        /*当月资金计划数据*/
        currentMonthFillTableData:[],                  //本月资金计划填报的表格数据
        currentMonthFillTableOrig:[],                  //本月资金计划填报的表格数据,原始数据

        /*以前年度应付款填报数据*/
        priorYearFillTableData:[],                     //以前年度应付款填报的表格数据
        priorYearFillTableOrig:[],                     //以前年度应付款填报的表格数据,原始数据
      }
    },

    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：查询资金计划数据
     * @param call 请求服务
     * @param put 返回reducer
     */
    *queryFundPlanData({}, {call, put}) {
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
      //DataRows1 : 一级和二级科目列表，有主子关系
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
            if ('chlidRows' in feeListData.DataRows1[i]) {
              children = JSON.parse(feeListData.DataRows1[i].chlidRows);
            }
            if (children.length > 0) {
              obj.selectable = false;    //如果有二级目录，则一级目录不可选，如果没有，则一级可用
            }
            for (let j = 0; j < children.length; j++) {
              obj.children.push({
                label:children[j].fee_name,
                value:children[j].chlid_uuid,
                key:children[j].chlid_uuid,
                flag:children[j].fee_flag
              });
              feeList.push({
                fee_name:children[j].fee_name,
                uuid:children[j].chlid_uuid,
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


        //选择办公费时的办公用品数据
        let officeFeeId = '';
        for (let k = 0; k < feeListData.DataRows.length; k++) {
          if (feeListData.DataRows[k].fee_name === OFFICE_FEE_NAME) {
            officeFeeId = feeListData.DataRows[k].uuid;
            break;
          }
        }
        if (officeFeeId !== '') {
          const officeStationeryData = yield call(fundingPlanFillService.getOfficeSuppliesList, {arg_uuid: officeFeeId});
          if (officeStationeryData.RetCode === '1') {
            let ordinalStationery = [];
            for (let i = 0; i < officeStationeryData.DataRows.length; i++) {
              let chlidRows = officeStationeryData.DataRows[i].chlidRows;
              chlidRows = JSON.parse(chlidRows);
              for (let j = 0; j < chlidRows.length; j++) {
                ordinalStationery.push(chlidRows[j]);
              }
              officeStationeryData.DataRows[i].chlidRows = chlidRows;
            }
            yield put({
              type: 'save',
              payload: {
                officeStationery: officeStationeryData.DataRows,
                ordinalStationery: ordinalStationery
              }
            });
          }
        }

        //资金类型为“他购”时，获取可填报申请人名单
        const canApplyUserData = yield call(fundingPlanFillService.getTeamMembers, {arg_userid: Cookie.get('userid')});
        if (canApplyUserData.RetCode === '1') {
          yield put({
            type:'save',
            payload:{
              canApplyUserList:canApplyUserData.DataRows,
            }
          });
        }
        //查询已经填报的当月填报数据
        yield put({
          type:'queryCurrentMonthFillData'
        });

        //查询已经填报的以前年度填报数据
        yield put({
          type:'queryPriorYearFillData'
        });
      }
    },

    //====================================================以下为当月填报的model  ---start

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：查询当月填报的数据
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *queryCurrentMonthFillData({},{call,put,select}){
      const {feeList } = yield select(state => state.fundingPlanFill);
      let fillPostData = {
        arg_userid: Cookie.get('userid'),
        arg_parameter: '2',                //2当月 ，1以前
      };
      const currentMonthFillData = yield call(fundingPlanFillService.getFillData, fillPostData);
      if (currentMonthFillData.RetCode === '1') {
        for (let i = 0; i < currentMonthFillData.DataRows.length; i++) {
          let chlidRows = [];
          if ('chlidRows' in currentMonthFillData.DataRows[i] && currentMonthFillData.DataRows[i].chlidRows !== '') {
            chlidRows = JSON.parse(currentMonthFillData.DataRows[i].chlidRows);
            for (let j = 0; j < chlidRows.length; j++) {
              chlidRows[j].opt_type = 'search';
              chlidRows[j].key = j;
            }
          }
          currentMonthFillData.DataRows[i].chlidRows = chlidRows;
          currentMonthFillData.DataRows[i].opt_type = 'search';
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
        }
        yield put({
          type:'save',
          payload:{
            currentMonthFillTableData:currentMonthFillData.DataRows,
            currentMonthFillTableOrig:JSON.parse(JSON.stringify(currentMonthFillData.DataRows))
          }
        });
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：添加一条当月填报记录
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *addCurrentMonthFillData({}, {put, select}) {
      let {currentMonthFillTableData,canApplyUserList} = yield select(state => state.fundingPlanFill);
      let applyUserId = Cookie.get('userid');
      let applyUserData = {};
      for (let i = 0; i < canApplyUserList.length; i++) {
        if (applyUserId === canApplyUserList[i].apply_userid) {
          applyUserData = canApplyUserList[i];
          break;
        }
      }
      let dataLength = currentMonthFillTableData.length;

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
        chlidRows:[],

        funds_plan: '',                              //资金计划
        funds_diff: '',                              //资金计划调整
        funds_current_amount: '',                    //调整后资金计划
        state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
        state_name: '新增',
        remark: '',                                  //备注

        budget_id:'',
        spe_pay_description:'',
        budget_record_id:'',
        report_batch:'',

        opt_type: 'insert',
        key: dataLength,
      });
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：删除一条当月填报记录
     * @param index 删除记录的索引值
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *deleteCurrentMonthFillData({index}, {put, select}) {
      let {currentMonthFillTableData} = yield select(state => state.fundingPlanFill);
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

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：编辑当月资金填报时的单元格（输入型）
     * @param value 输入值
     * @param index 编辑行所在的索引值
     * @param colType 编辑单元格所在的列名
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *editCurrentMonthInputData({value, index, colType}, {put, select}) {
      let {currentMonthFillTableData} = yield select(state => state.fundingPlanFill);
      currentMonthFillTableData[index][colType] = value;
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：编辑当月资金填报时的单元格（选择型）
     * @param value 选择的id值
     * @param index 编辑行所在的索引值
     * @param colType 编辑单元格所在的列名
     * @param subjectObj 费用科目数据
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *editCurrentMonthSelectData({value, index, colType,subjectObj}, {put, select}) {
      let {currentMonthFillTableData,currentMonthFillTableOrig,canApplyUserList} = yield select(state => state.fundingPlanFill);
      if (colType === 'funds_type') {
        currentMonthFillTableData[index].funds_type = value;
        //如果修改为 个人和公共，需要去修改 报销申请人数据
        if (value === '1' || value === '2') {
          //如果编辑的是资金类型（funds_type）
          if (currentMonthFillTableData[index].opt_type === 'insert') {
            //如果是新增的，报销申请人 使用登录人姓名
            let applyUserId = Cookie.get('userid');
            let applyUserData = {};
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
          } else {
            //如果是查询出来的，报销申请人 使用原始查询数据
            currentMonthFillTableData[index].apply_username = currentMonthFillTableOrig[index].apply_username;
            currentMonthFillTableData[index].apply_userid = currentMonthFillTableOrig[index].apply_userid;
            currentMonthFillTableData[index].dept_name = currentMonthFillTableOrig[index].deptname;
            currentMonthFillTableData[index].ou = currentMonthFillTableOrig[index].ou;
            currentMonthFillTableData[index].team_id = currentMonthFillTableOrig[index].team_id;
            currentMonthFillTableData[index].team_name = currentMonthFillTableOrig[index].team_name;
          }
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
        //如果编辑的是 普通的 科目名称，需要去改变 boundModalFlag，同时清空chlidRows, 也要清空 资金计划(总共五个值)
        currentMonthFillTableData[index].subject_name = subjectObj.fee_name;
        currentMonthFillTableData[index].subject_id = subjectObj.uuid;
        currentMonthFillTableData[index].boundModalFlag = subjectObj.flag;
        currentMonthFillTableData[index].chlidRows = [];
        currentMonthFillTableData[index].funds_plan = '';
      }
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：编辑办公用品对话框
     * @param index 编辑行所在的索引值
     * @param fillOfficeData 对话框中的数据
     * @param subjectObj 费用科目数据
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *editCurrentOfficeData({index,fillOfficeData,subjectObj},{select,put}){
      let {currentMonthFillTableData,fundStageData} = yield select(state => state.fundingPlanFill);
      currentMonthFillTableData[index].subject_name = subjectObj.fee_name; //1.修改科目名称
      currentMonthFillTableData[index].subject_id = subjectObj.uuid;       //2.修改科目id
      currentMonthFillTableData[index].chlidRows = fillOfficeData;         //3.修改childRows
      currentMonthFillTableData[index].boundModalFlag = subjectObj.flag;   //4.弹出标志位

      let officeMoneySum = 0;
      for( let i = 0; i < fillOfficeData.length; i++){
        officeMoneySum += Number(fillOfficeData[i].funds_plan) * Number(fillOfficeData[i].quantity);
      }
      //5.资金计划
      //如果是预填报阶段，修改的是资金计划，如果是追加阶段和调整阶段，修改的是 调整后资金计划
      if (fundStageData.report_type === '1') {
        currentMonthFillTableData[index].funds_plan = officeMoneySum.toFixed(2);            //需要修改资金计划的值
      } else {
        currentMonthFillTableData[index].funds_current_amount = officeMoneySum.toFixed(2);  //需要修改调整后资金计划的值
      }

      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：编辑capex对话框
     * @param index 编辑行所在的索引值
     * @param fillCapexData 对话框中的数据
     * @param subjectObj 费用科目数据
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *editCurrentCapexData({index,fillCapexData,subjectObj},{put,select}){
      let {currentMonthFillTableData,fundStageData} = yield select(state => state.fundingPlanFill);
      currentMonthFillTableData[index].subject_name = subjectObj.fee_name; //1.修改科目名称
      currentMonthFillTableData[index].subject_id = subjectObj.uuid;       //2.修改科目id
      currentMonthFillTableData[index].chlidRows = fillCapexData;          //3.修改childRows
      currentMonthFillTableData[index].boundModalFlag = subjectObj.flag;   //4.弹出标志位

      let capexMoneySum = 0;
      for( let i = 0; i < fillCapexData.length; i++){
        capexMoneySum += Number(fillCapexData[i].payment_amount_this_month);
      }

      //5.资金计划
      //如果是预填报阶段，修改的是资金计划，如果是追加阶段和调整阶段，修改的是 调整后资金计划
      if (fundStageData.report_type === '1') {
        currentMonthFillTableData[index].funds_plan = capexMoneySum.toFixed(2);            //需要修改资金计划的值
      } else {
        currentMonthFillTableData[index].funds_current_amount = capexMoneySum.toFixed(2);  //需要修改调整后资金计划的值
      }
      yield put({
        type: 'save',
        payload: {
          currentMonthFillTableData: JSON.parse(JSON.stringify(currentMonthFillTableData))
        }
      });
    },

    //====================================================当月填报的model  ---end


    //====================================================以下为以前年度填报填报的model  ---start

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：查询以前年度填报的数据
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *queryPriorYearFillData({},{call,put,select}){
      const {feeList } = yield select(state => state.fundingPlanFill);
      let fillPostData = {
        arg_userid: Cookie.get('userid'),
        arg_parameter: '1',                //2当月 ，1以前
      };
      const priorYearFillData = yield call(fundingPlanFillService.getFillData, fillPostData);
      if (priorYearFillData.RetCode === '1') {
        for (let i = 0; i < priorYearFillData.DataRows.length; i++) {
          let chlidRows = [];
          if ('chlidRows' in priorYearFillData.DataRows[i] && priorYearFillData.DataRows[i].chlidRows !== '') {
            chlidRows = JSON.parse(priorYearFillData.DataRows[i].chlidRows);
            for (let j = 0; j < chlidRows.length; j++) {
              chlidRows[j].opt_type = 'search';
              chlidRows[j].key = j;
            }
          }
          priorYearFillData.DataRows[i].chlidRows = chlidRows;
          priorYearFillData.DataRows[i].opt_type = 'search';
          priorYearFillData.DataRows[i].key = i;

          //判断当前返回的数据中是否有 办公费 和 capax的数据
          let boundModalFlag = '3';    // 1 : capex  , 2 :办公费  ，3：其他，1,2是有弹框的
          for (let k = 0; k < feeList.length; k++) {
            if (priorYearFillData.DataRows[i].subject_id === feeList[k].uuid) {
              boundModalFlag = feeList[k].flag;
              break;
            }
          }
          priorYearFillData.DataRows[i].boundModalFlag = boundModalFlag;
        }
        yield put({
          type:'save',
          payload:{
            priorYearFillTableData:priorYearFillData.DataRows,
            priorYearFillTableOrig:JSON.parse(JSON.stringify(priorYearFillData.DataRows))
          }
        });
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：添加一条以前年度填报记录
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *addPriorYearFillData({}, {put, select}) {
      let {priorYearFillTableData,canApplyUserList} = yield select(state => state.fundingPlanFill);
      let applyUserId = Cookie.get('userid');
      let applyUserData = {};
      for (let i = 0; i < canApplyUserList.length; i++) {
        if (applyUserId === canApplyUserList[i].apply_userid) {
          applyUserData = canApplyUserList[i];
          break;
        }
      }
      let dataLength = priorYearFillTableData.length;

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
        chlidRows:[],

        funds_plan: '',                              //资金计划
        funds_diff: '',                              //资金计划调整
        funds_current_amount: '',                    //调整后资金计划
        state_code: '0',                             //状态  0 新增，1 保存，2 待审核，3 审核通过 , 4审核退回
        state_name: '新增',
        remark: '',                                  //备注

        budget_id:'',
        spe_pay_description:'',
        budget_record_id:'',
        report_batch:'',

        opt_type: 'insert',
        key: dataLength,
      });
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：删除一条当月填报记录
     * @param index 删除记录的索引值
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *deletePriorYearFillData({index}, {put, select}) {
      let {priorYearFillTableData} = yield select(state => state.fundingPlanFill);
      //如果删除的记录不是新增的，将状态改为delete
      if (priorYearFillTableData[index].opt_type !== 'insert') {
        priorYearFillTableData[index].opt_type = 'delete';
      } else {
        //如果删除的记录是新增的，直接删除这条记录
        priorYearFillTableData.splice(index, 1);
      }
      //处理之后将key值重排
      for (let i = 0; i < priorYearFillTableData.length; i++) {
        priorYearFillTableData[i].key = i;
      }
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：编辑以前年度资金填报时的单元格（输入型）
     * @param value 输入值
     * @param index 编辑行所在的索引值
     * @param colType 编辑单元格所在的列名
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *editPriorYearInputData({value, index, colType}, {put, select}) {
      let {priorYearFillTableData} = yield select(state => state.fundingPlanFill);
      priorYearFillTableData[index][colType] = value;
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：编辑以前年度资金填报时的单元格（选择型）
     * @param value 选择的id值
     * @param index 编辑行所在的索引值
     * @param colType 编辑单元格所在的列名
     * @param subjectObj 费用科目数据
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *editPriorYearSelectData({value, index, colType,subjectObj}, {put, select}) {
      let {priorYearFillTableData,priorYearFillTableOrig,canApplyUserList} = yield select(state => state.fundingPlanFill);
      if (colType === 'funds_type') {
        priorYearFillTableData[index].funds_type = value;
        //如果修改为 个人和公共，需要去修改 报销申请人数据
        if (value === '1' || value === '2') {
          //如果编辑的是资金类型（funds_type）
          if (priorYearFillTableData[index].opt_type === 'insert') {
            //如果是新增的，报销申请人 使用登录人姓名
            let applyUserId = Cookie.get('userid');
            let applyUserData = {};
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
          } else {
            //如果是查询出来的，报销申请人 使用原始查询数据
            priorYearFillTableData[index].apply_username = priorYearFillTableOrig[index].apply_username;
            priorYearFillTableData[index].apply_userid = priorYearFillTableOrig[index].apply_userid;
            priorYearFillTableData[index].dept_name = priorYearFillTableOrig[index].deptname;
            priorYearFillTableData[index].ou = priorYearFillTableOrig[index].ou;
            priorYearFillTableData[index].team_id = priorYearFillTableOrig[index].team_id;
            priorYearFillTableData[index].team_name = priorYearFillTableOrig[index].team_name;
          }
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
        //如果编辑的是 普通的 科目名称，需要去改变 boundModalFlag，同时清空chlidRows, 也要清空 资金计划(总共五个值)
        priorYearFillTableData[index].subject_name = subjectObj.fee_name;
        priorYearFillTableData[index].subject_id = subjectObj.uuid;
        priorYearFillTableData[index].boundModalFlag = subjectObj.flag;
        priorYearFillTableData[index].chlidRows = [];
        priorYearFillTableData[index].funds_plan = '';
      }
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：编辑办公用品对话框
     * @param index 编辑行所在的索引值
     * @param fillOfficeData 对话框中的数据
     * @param subjectObj 费用科目数据
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *editPriorYearOfficeData({index,fillOfficeData,subjectObj},{select,put}){
      let {priorYearFillTableData,fundStageData} = yield select(state => state.fundingPlanFill);
      priorYearFillTableData[index].subject_name = subjectObj.fee_name; //1.修改科目名称
      priorYearFillTableData[index].subject_id = subjectObj.uuid;       //2.修改科目id
      priorYearFillTableData[index].chlidRows = fillOfficeData;         //3.修改childRows
      priorYearFillTableData[index].boundModalFlag = subjectObj.flag;   //4.弹出标志位

      let officeMoneySum = 0;
      for( let i = 0; i < fillOfficeData.length; i++){
        officeMoneySum += Number(fillOfficeData[i].funds_plan) * Number(fillOfficeData[i].quantity);
      }
      //5.资金计划
      //如果是预填报阶段，修改的是资金计划，如果是追加阶段和调整阶段，修改的是 调整后资金计划
      if (fundStageData.report_type === '1') {
        priorYearFillTableData[index].funds_plan = officeMoneySum.toFixed(2);            //需要修改资金计划的值
      } else {
        priorYearFillTableData[index].funds_current_amount = officeMoneySum.toFixed(2);  //需要修改调整后资金计划的值
      }

      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：编辑capex对话框
     * @param index 编辑行所在的索引值
     * @param fillCapexData 对话框中的数据
     * @param subjectObj 费用科目数据
     * @param put 返回reducer
     * @param select 获取model的state
     */
      *editPriorYearCapexData({index,fillCapexData,subjectObj},{put,select}){
      let {priorYearFillTableData,fundStageData} = yield select(state => state.fundingPlanFill);
      priorYearFillTableData[index].subject_name = subjectObj.fee_name; //1.修改科目名称
      priorYearFillTableData[index].subject_id = subjectObj.uuid;       //2.修改科目id
      priorYearFillTableData[index].chlidRows = fillCapexData;          //3.修改childRows
      priorYearFillTableData[index].boundModalFlag = subjectObj.flag;   //4.弹出标志位

      let capexMoneySum = 0;
      for( let i = 0; i < fillCapexData.length; i++){
        capexMoneySum += Number(fillCapexData[i].payment_amount_this_month);
      }

      //5.资金计划
      //如果是预填报阶段，修改的是资金计划，如果是追加阶段和调整阶段，修改的是 调整后资金计划
      if (fundStageData.report_type === '1') {
        priorYearFillTableData[index].funds_plan = capexMoneySum.toFixed(2);            //需要修改资金计划的值
      } else {
        priorYearFillTableData[index].funds_current_amount = capexMoneySum.toFixed(2);  //需要修改调整后资金计划的值
      }
      yield put({
        type: 'save',
        payload: {
          priorYearFillTableData: JSON.parse(JSON.stringify(priorYearFillTableData))
        }
      });
    },


    //====================================================以前年度填报填报的model  ---end

    /**
     * 作者：邓广晖
     * 创建日期：2018-03-14
     * 功能：保存或者提交
     * @param flag 1:保存，2：提交
     * @param tabFlag 1:当月资金计划填报，2：以前年度应付款填报
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *saveFillData({flag,tabFlag},{call,put,select}){
      const {fundStageData} = yield select(state => state.fundingPlanFill);
      let tableData = [];
      let tableOrig = [];
      if (tabFlag === '2') {
        //如果是 当月填报
        tableData = yield select(state => state.fundingPlanFill.currentMonthFillTableData);
        tableOrig = yield select(state => state.fundingPlanFill.currentMonthFillTableOrig);
      } else if (tabFlag === '1') {
        //如果是 以前年度
        tableData = yield select(state => state.fundingPlanFill.priorYearFillTableData);
        tableOrig = yield select(state => state.fundingPlanFill.priorYearFillTableOrig);
      }
      //console.log('===============================TableData提交保存');
      //console.log(tableData);
      let postData = [];
      for (let i = 0; i < tableData.length; i++) {
        let canSaveFlag = false;
        let isAppendChange = false;     //是否是追加阶段修改审核通过的  调整后资金计划
        if (tableData[i].opt_type === 'delete') {
          //如果可以删除，那么这条数据是可以保存提交的
          canSaveFlag = true;
        } else {
          //如果不是删除的，进行一下判断
          if (fundStageData.report_type === '1' ) {
            //如果是预填报阶段（1），只有新增（0）和保存（1）的可保存提交
            canSaveFlag = tableData[i].state_code === '0' || tableData[i].state_code === '1';
          } else if (fundStageData.report_type === '2' ) {
            //如果是追加阶段（2）
            if (tableData[i].state_code === '0' || tableData[i].state_code === '1') {
              //如果是新增和保存的可保存和提交
              canSaveFlag = true;
            }else if (tableData[i].state_code === '3' && tableData[i].report_batch === '1') {
              //如果在追加阶段（分为预填报审核通过和追加审核通过），预填报审核通过的且"修改了"  “调整后资金计划” 的可保存和提交
              if (tableData[i].funds_current_amount !== tableOrig[i].funds_current_amount) {
                canSaveFlag = true;
                isAppendChange = true;
              }
            }
          } else if (fundStageData.report_type === '3' ) {
            //如果是调整报阶段（3）,只有新增和保存的数据才能保存和提交，（待审核的，审核通过的，审核退回的都不传）
            if (tableData[i].state_code === '0' || tableData[i].state_code === '1') {
              canSaveFlag = true;
            }
          }
        }

        //如果能够保存和提交
        if (canSaveFlag === true) {
          //判断金额为负数时，输入了 负号  但是不输入数字
          if (tableData[i].opt_type !== 'delete') {
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
            if (fundStageData.report_type === '2' && tableData[i].funds_current_amount.trim() === '' ) {
              //追加阶段，调整后资金计划不能为“”
              message.error('追加阶段，调整后资金计划不能为空');
              return;
            }
            if (fundStageData.report_type === '3' && tableData[i].funds_current_amount.trim() === '' ) {
              //调整阶段，调整后资金计划不能为“”
              message.error('调整阶段，调整后资金计划不能为空');
              return;
            }
            if ( tabFlag === '1' && tableData[i].spe_pay_description.trim() === '') {
              message.error('具体付款事项描述不能为空');
              return;
            }

          }

          let obj = tableData[i];
          obj.is_pre_year_funds = tabFlag;
          obj.status_code = flag;         //保存或者提交的状态  注意与 state_code区分
          obj.create_userid = Cookie.get('userid');

          if (tableData[i].opt_type === 'delete') {
            //删除的数据，flag_flied = 3
            obj.flag_flied = '3';
          } else {
            if (isAppendChange === true ) {
              //如果是追加阶段修改审核通过的  调整后资金计划  flag_flied = 2
              obj.flag_flied = '2';
            } else {
              //其他情况（新增和保存的）flag_flied = 1
              obj.flag_flied = '1';
            }
          }
          postData.push(obj);
        }
      }
      //console.log('=============================保存提交postData');
      //console.log(postData);
      if (postData.length > 0) {
        const data = yield call(fundingPlanFillService.saveOrSubmitFillData,{
          DataRows:JSON.stringify(postData)
        });
        if (data.RetCode === '1') {
          if (tabFlag === '2') {
            yield put({ type:'queryCurrentMonthFillData'});
          } else if (tabFlag === '1') {
            yield put({ type:'queryPriorYearFillData'});
          }
          if (flag === '1') {
            message.info('保存成功');
          } else if (flag === '2') {
            message.info('提交成功');
          }
        }
      } else {
        message.info('没有修改的数据，请重填！');
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_fill') {
          dispatch({type: 'initData'});
          dispatch({ type: 'queryFundPlanData'});
        }
      });
    },
  },
};
