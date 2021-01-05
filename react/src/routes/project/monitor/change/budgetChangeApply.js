/**
 * 作者：薛刚
 * 创建日期：2018-10-15
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现差旅费预算变更填报页面
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Popconfirm, Form, Modal, message, Spin } from 'antd';
import styles from './budgetChangeApply.less';
import Cookie from 'js-cookie';

const TextArea = Input.TextArea;
class budgetChangeApply extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      reasonValue: ''
    }
  }

  /**
   * 作者：薛刚
   * 创建日期：2018-11-15
   * 功能：判断输入的数据是否合法
   * @param inputValue 输入的数据
   */
  valueHandler = (inputValue) => {
    //先将非数值去掉
    let value = inputValue.replace(/[^\d.]/g, '');
    //如果以小数点开头，改为0
    if (value === '.') {
      value = '0'
    }
    // 如果第一位输入0，后面只能输入小数点
    if (value[0]  === '0' && value[1] !== '.') {
      value = '0';
    }
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'));
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 3);
    }
    return value;
  }

  getDeptBudgetYear = (year) => {
    const { deptBudget } = this.props;
    let budget = null;
    deptBudget.map((item) => {
      if(item.year === year) {
        budget = item.rest_fee;
      }
    });
    return budget;
  }

  /**
   * 作者：薛刚
   * 创建日期：2018-10-25
   * 功能：实时计算汇总数据
   * @param e 事件; tableId 要改变的表格id; changeType 修改的类型
   */
  onInputChange = (e, changeIndex, tableId, changeType, projId) => {

    const inputValue = this.valueHandler(e.target.value);
    const { projTravelBudgetList } = this.props;
    const dataSource = projTravelBudgetList[tableId].budget;
    // 获取到修改的行对象，将改行的部门合计更换成最新的即可
    const changeRow = dataSource[changeIndex], lastRow = dataSource[dataSource.length-1];
    const deptName = changeRow.dept_name, type = changeRow.type;
    let expense = 0, capital = 0, budget_total = Number(inputValue), total_type = 0;

    if(changeType == 0) {
      changeRow.capital.fee = inputValue;
    }else if(changeType == 1) {
      changeRow.expense.fee = inputValue;
    }

    dataSource.map((item, index) => {
      // 遍历数组，计算同一部门的费用化预算之和
      if(item.dept_name === deptName){
        expense += Number(item.expense.fee);
        capital += Number(item.capital.fee);
      }
      // 遍历数组，除去变化的和最后一行，计算资本化之和或费用化之和
      if(index != changeIndex && index != dataSource.length-1) {
        if(changeType == 0) {
          budget_total += Number(item.capital.fee);
        }else if(changeType == 1) {
          budget_total += Number(item.expense.fee);
        }
      }
      // 遍历数组，计算同一类型费用的和
      if(item.type === type) {
        total_type += Number(item.capital.fee)+Number(item.expense.fee)
      }
    })
    if(changeType == 0) {
      lastRow.capital = Number(budget_total).toFixed(2);
      lastRow.sum = (Number(budget_total)+Number(lastRow.expense)).toFixed(2);
    }else if(changeType == 1) {
      lastRow.expense = Number(budget_total).toFixed(2);
      lastRow.sum = (Number(budget_total)+Number(lastRow.capital)).toFixed(2);
    }

    // 获取最新的部门剩余额度
    const { dispatch } = this.props;
    dispatch({
      type: 'budgetChangeApply/projTravelBudgetDeptRestrict',
      proj: {
        arg_proj_id: projId,
      }
    })

    // 修改同一部门的合计信息
    dataSource.map((dataItem) =>{
      if(dataItem.dept_name === deptName){
        dataItem.sum = (Number(capital)+Number(expense)).toFixed(2);
      }
    });

    // 修改类型合计
    const typeTotal = projTravelBudgetList[tableId].total_info;
    typeTotal.map((typeItem) => {
      if(typeItem.type === type) {
        typeItem.total = Number(total_type).toFixed(2);
      }
    })

    // 复制新的列表，返回给state
    const afterChangeList = { ...projTravelBudgetList };

    this.setState({
      projTravelBudgetList: afterChangeList,
    });
  };

  columns = (deptCountArray, budgetArray, tableId, status, projId) => {

    return [{
      title: '部门',
      dataIndex: 'dept_name',
      width: '30%',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = 0;
        for(let i=0; i<deptCountArray.length; i++) {
          if (index == deptCountArray[i].index) {
            obj.props.rowSpan = deptCountArray[i].span;
          }
        }
        if (index == budgetArray.length-1) {
          obj.props.colSpan = 2;
        }
        return obj;
      },
    }, {
      title: '预算类型',
      dataIndex: 'type',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if(row.code && row.code.length > 0) {
          obj.children = row.code.concat('预算');
        }
        if (index == budgetArray.length-1) {
          obj.props.colSpan = 0;
        }
        return obj;
      }
    }, {
      title: '差旅费预算（资本化）',
      dataIndex: 'capital',
      render:(value, row, index)=>{
        if(index == budgetArray.length-1) {
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }else if(status == 1) {
          value = value.fee.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }else {
          return <Input
            className={styles.input}
            defaultValue={value.fee}
            value={value.fee}
            size='large'
            onChange={(e) => this.onInputChange(e, index, tableId, 0, projId)}
            />;
        }
      }
    }, {
      title: '差旅费预算（费用化）',
      dataIndex: 'expense',
      render:(value, row, index)=>{
        if(index == budgetArray.length-1) {
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }else if(status == 1) {
          value = value.fee.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }else {
          return <Input
            className={styles.input}
            value={value.fee}
            size='large'
            onChange={(e) => this.onInputChange(e, index, tableId, 1, projId)}
            />;
        }
      }
    }, {
      title: '部门合计',
      dataIndex: 'sum',
      render: (value, row, index) => {
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = 0;
        for(let i=0; i<deptCountArray.length; i++) {
          if (index == deptCountArray[i].index) {
            obj.props.rowSpan = deptCountArray[i].span;
          }
        }
        return obj;
      }
    }]
  };

  // 将数据源转换成格式，统计各个部门的个数，做合并单元格
  changeDataSource = (budgetArray) => {
    const map = {}, group = [], result = [];
    for(let i=0; i<budgetArray.length; i++) {
      const data = budgetArray[i];
      if(!map[data.dept_name]){
        group.push({
          dept_name: data.dept_name,
          budget: [data]
        });
        map[data.dept_name] = data;
      }else {
        for(var j = 0; j < group.length; j++){
          const dj = group[j];
          if(dj.dept_name == data.dept_name){
            dj.budget.push(data);
            break;
          }
        }
      }
    }
    for(let i=0; i<group.length; i++) {
      const dataByDept = group[i];
      const budgetList = dataByDept.budget;
      let sumByDept = 0;
      budgetList.forEach((item) => {
        if(item.hasOwnProperty('capital')){
          sumByDept += Number(item.capital.fee);
        }
        if(item.hasOwnProperty('expense')){
          sumByDept += Number(item.expense.fee);
        }
      })
      result.push({
        dept: dataByDept.dept_name,
        count: budgetList.length,
        total: sumByDept
      });
    }
    return result;
  }

  compareFee = (preBudget, newBudgetFee) => {
    if(typeof newBudgetFee == 'number') {
      newBudgetFee = newBudgetFee.toFixed(2).toString();
    }
    let budget = null;
    // 输入空，小数点都不做比较
    if(newBudgetFee != '' && newBudgetFee != 'undefined' && newBudgetFee.indexOf('.') !== newBudgetFee.length - 1 && Number(preBudget.fee) != Number(newBudgetFee)) {
      budget = {
        opt_flag: "update",
        budget_uid: preBudget.uid,
        fee: newBudgetFee
      }
    }
    return budget;
  }

  getDiffBudget = (initialBudgetList, newBudgetList) => {
    const length = initialBudgetList.length;
    const result = {
      budgetList: [],
      budgetPmsList: []
    }
    for(let i=0; i<length; i++) {
      const initialBudget = initialBudgetList[i].budget;
      const newBudget = newBudgetList[i].budget;
      for(let j=0; j<initialBudget.length-1; j++){
        const initialCapital = initialBudget[j].capital, initialExpense = initialBudget[j].expense,
          newCapital = newBudget[j].capital, newExpense = newBudget[j].expense;
        const capitalObj = this.compareFee(initialCapital, newCapital.fee);
        if(capitalObj != null) {
          initialBudget[j].type == '团队预算' ? result.budgetList.push(capitalObj) : result.budgetPmsList.push(capitalObj);
        }
        const expenseObj = this.compareFee(initialExpense, newExpense.fee);
        if(expenseObj != null) {
          initialBudget[j].type == '团队预算' ? result.budgetList.push(expenseObj) : result.budgetPmsList.push(expenseObj);
        }
      }
    }
    return result;
  }

  // 保存或提交
  onSaveOrSubmit = (type, projInfo) => {
    const { dispatch, initialTravelBudgetList, projTravelBudgetList } = this.props;
    // 必传参数
    const params = {
      arg_flag: type, //保存提交的标志，0是保存，1是提交，必传
      arg_change_reason: this.state.reasonValue, //变更原因，必传，用户没写传’’
      arg_proj_id: projInfo.projId, //必传
      arg_proj_uid: projInfo.projUid, //必传
      arg_proj_name: projInfo.projName, //必传
      arg_pu_dept_id: projInfo.projPuDeptId, //归口部门id，必传
      pathname: this.props.location.pathname,
    }
    if(projInfo.hasOwnProperty('batchid')) {
      params.arg_bussiness_batchid = projInfo.batchid; //check_form关联id，非必传，已有草稿或退回保存提交时必传
    }
    const locationUrl = this.props.location.query;
    if(locationUrl.hasOwnProperty('arg_task_info')) {
      params.arg_task_info = locationUrl.arg_task_info;
    }
    const result = this.getDiffBudget(initialTravelBudgetList, projTravelBudgetList);
    if(projInfo.projDraftFlag == 0 && type == 1 && result.budgetList.length == 0 && result.budgetPmsList.length == 0) {
      message.error('差旅费预算未做变动，无法提交！');
      return;
    }
    if(result.budgetList.length> 0) {
      params.array_proj_budget = JSON.stringify(result.budgetList);
    }
    if(result.budgetPmsList.length > 0) {
      params.array_proj_pms_budget = JSON.stringify(result.budgetPmsList);
    }
    dispatch({
      type: 'budgetChangeApply/projTravelBudgetSaveOrSubmit',
      payload: params
    })
  }

  onSubmit = (projInfo) => {
    if(this.state.reasonValue.trim() === ''){
      message.error('变更原因不能为空');
      return;
    }
    this.hideModal();
    this.onSaveOrSubmit(1, projInfo);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  setChangeReason = (e) => {
    this.setState({
      reasonValue: e.target.value
    });
  };

  // 草稿重置
  draftReset = (projId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'budgetChangeApply/travelBudgetDraftDelete',
      payload: {
        arg_proj_id: projId,//项目id，必传
        arg_opt_id: Cookie.get('userid'),//操作人id，必传
        arg_opt_name: Cookie.get('username'),//操作人姓名，必传
        arg_flag: 1//0或者不传是项目变更，1是差旅变更
      }
    });
  }

  render() {
    const { projTravelBudgetList, projInfo } = this.props;
    const limitYearArray = [];
    let list = null;
    if(projTravelBudgetList.length !==0 ) {
      list = new Array;
      projTravelBudgetList.map((data, index) => {

        const budget = data.budget;

        const budgetLimit = this.getDeptBudgetYear(data.year);
        if(budgetLimit != null) {
          const sum = budget[budget.length-1].sum;
          if(Number(sum) > Number(budgetLimit)) {
            limitYearArray.push(data.year);
          }
        }

        const countArray = this.changeDataSource(budget);

        // 处理数据，合并单元格
        const tmpArray = new Array();
        tmpArray[0] = 0;
        for(let i=1; i<countArray.length+1; i++) {
          tmpArray[i] = countArray[i-1].count;
        }
        const rowSpanArray = new Array();
        for(let m=0; m<countArray.length; m++) {
          const rowSpan = countArray[m].count;
          let rowSpanIndex = 0;
          for(let n=0; n<=m; n++){
            rowSpanIndex += tmpArray[n];
          }
          const spanObj = {
            index: rowSpanIndex,
            span: rowSpan
          }
          rowSpanArray.push(spanObj);
        }
        const columns = this.columns(rowSpanArray, budget, index, projInfo.projStatus, projInfo.projId);
        const totalInfo = data.total_info;
        let totalList = [];
        totalInfo.map((info, index) => {
          const typeTotal = info.total.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          totalList.push(
            <label key={index}><span>{info.code.length > 0 ? info.code.concat('预算') : info.type}</span>合计：{typeTotal}元</label>
          )
        });
        list.push(
          <div key={index}>
            <div className={styles.sum}>
              <label>年度：<span>{data.year}</span></label>
              {totalList}
            </div>
            <Table
              bordered
              dataSource={budget}
              columns={columns}
              pagination={false}
              className={styles.table}
              />
          </div>
          )
      })
    }

    const submitModal = (
      <Modal
        title="变更原因"
        visible={this.state.visible}
        onOk={() => this.onSubmit(projInfo)}
        onCancel={this.hideModal}
        okText="确认"
        cancelText="取消"
        >
        <div className={styles.modal_mark_required}>{"*"}</div>
        <div className={styles.modal_input_textarea}>
          <TextArea
            placeholder="最多输入200字"
            maxLength='200'
            rows={4}
            value={this.state.reasonValue}
            onChange={this.setChangeReason}
            />
        </div>
        <div className={styles.modal_tips}>
          {'您确定要提交差旅费预算吗？一旦提交将进入审核流程！'}
        </div>
      </Modal>
    );

    let statusLabel = '';
    if(projInfo.projStatus == 1) {
      statusLabel = '审核中';
    }

    // 默认为空，不可以填写
    let btnDiv = null;
    // 可以修改的情况
    if(projInfo.projStatus == 0){
      btnDiv = (
        <div className={styles.button}>
          <Button onClick={() => this.onSaveOrSubmit(0, projInfo)}>保存</Button>
          <Button type="primary" onClick={this.showModal}>提交</Button>
          {submitModal}
        </div>
      )
      // 超过部门预算的情况
      if(limitYearArray.length > 0) {
        let limitYear = '';
        for(let i=0; i<limitYearArray.length; i++) {
          limitYear += limitYearArray[i] + ',';
        }
        btnDiv = (
          <div className={styles.tips}>
            <h4>提示：您{limitYear.slice(0, limitYear.length-1)}年差旅费预算已经超过部门总预算，请联系预算管理员！</h4>
            <div className={styles.button}>
              <Button disabled>保存</Button>
              <Button type="primary" disabled>提交</Button>
            </div>
          </div>
        );
      }
    }

    let draftRestDiv = (
      <div className={styles.draftResetButton}>
        <Popconfirm placement="leftBottom" title="你确定要删除草稿吗？"
                    onConfirm={() => this.draftReset(projInfo.projId)} okText="确定" cancelText="取消">
          <Button type="primary">重置</Button>
        </Popconfirm>
      </div>
    );

    if(projInfo.projDraftFlag === '0') {
      draftRestDiv = null;
    }

    return (
      <div className={styles.container}>
        <Spin spinning={this.props.loading}>
          <div className={styles.title}>
            <h2>{projInfo.projName}<span className={styles.status}>{statusLabel}</span></h2>
            <h3>差旅费预算变更</h3>
          </div>
          {draftRestDiv}
          {list}
          {btnDiv}
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.budgetChangeApply,
    ...state.budgetChangeApply
  }
}

export default connect(mapStateToProps)(budgetChangeApply);
