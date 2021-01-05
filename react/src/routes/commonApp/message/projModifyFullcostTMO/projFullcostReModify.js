/**
 * 作者：邓广晖
 * 创建日期：2018-04-10
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：TMO修改已立项的全成本数据后，TMO和审核人查看待办、已办、办结的共用model
 */

import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {Modal,Table,Icon,Button,Input,Select,message,Spin} from 'antd';
import AssignDept  from '../../../../components/commonApp/assignDept.js';
import ChoseVerifier from '../../../project/startup/projStartMain/fullCostModule/choseVerifier';
import styles from '../../../project/startup/projAdd/projStartFullCost.less';
import config from '../../../../utils/config';
import {getuuid,isInArray} from '../../../project/projConst.js';
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;

/**
 * 作者：邓广晖
 * 创建日期：2018-01-22
 * 功能：转变为千分位
 * @param value 输入的值
 */
function change2Thousands (value) {
  if(value !== undefined){
    return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }else{
    return '';
  }
}

/**
 * 作者：邓广晖
 * 创建日期：2018-04-10
 * 邮件：denggh6@chinaunicom.cn
 * 功能：审核TMO修改全成本的主页面，包含全成本和审批历史tab
 */
class ProjFullcostReModify extends React.PureComponent {

  state={
    deptModalVisible:false,
    purchaseVisible:false,
    purchaseValue:'',
    operateVisible:false,
    operateValue:'',
    carryOutVisible:false,
    carryOutValue:'',
    verifyVisible:false, /*选择审核人模态框是否可见*/
    reasonValue:'',      /*修改原因*/
    year:'',             /*点击表格行时确定的年份*/
    yearVisible:false,
    yearValue:'',        /*下拉框中的年份*/
    currentCellData:'',  /*用于缓存焦点在预算输入框时的值*/
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：模态框显示
   * @param type 模态框类型
   */
  showModal=(type)=> {this.setState({[type]:true})};

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：改变下拉框的值
   * @param value 下拉框的值
   * @param type 下拉框类型
   */
  changeSelectValue = (value,type) =>{this.state[type] = value};

    initSelectData = () => {
        this.setState({
            purchaseValue:'',
            operateValue:'',
            carryOutValue:'',
            year:'',
        });
    };
  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：选择部门模态框关闭
   * @param flag 关闭模态框时的标志，为confirm，cancel
   */
  hideDeptModal=(flag)=>{
    if(flag === 'confirm'){
      let deptSelectData=this.refs.assignDeptComp.getData(true);
      //新增配合部门信息
      this.props.dispatch({
        type:'projFullcostReModify/addCoorpDept',
        deptSelectData:deptSelectData
      });
    }
    this.setState({deptModalVisible:false});
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：隐藏采购成本模态框
   * @param flag 关闭模态的标志
   */
  hidePurchaseModal=(flag)=>{
    if(flag === 'confirm'){
        if (this.state.purchaseValue === '') {
            message.error('选项不能为空');
            return;
        }
      if(isInArray(this.props.yearListRowSpan[this.state.year].purchaseCostList,this.state.purchaseValue)){
        message.error(config.FEE_IS_REPEATED);
        return;
      }else{
        this.props.dispatch({
          type:'projFullcostReModify/addCostType',
          value:this.state.purchaseValue,
          fee_type:'1',
          fee_subtype:'0',
          year:this.state.year
        });
      }
    }
    this.setState({purchaseVisible:false});
    this.initSelectData();
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：隐藏运行成本模态框
   * @param flag 关闭模态的标志
   */
  hideOperateModal=(flag)=>{
    if(flag === 'confirm'){
        if (this.state.operateValue === '') {
            message.error('选项不能为空');
            return;
        }
      if(isInArray(this.props.yearListRowSpan[this.state.year].operateCostList,this.state.operateValue)){
        message.error(config.FEE_IS_REPEATED);
        return;
      }else{
        this.props.dispatch({
          type:'projFullcostReModify/addCostType',
          value:this.state.operateValue,
          fee_type:'1',
          fee_subtype:'3',
          year:this.state.year
        });
      }
    }
    this.setState({operateVisible:false});
    this.initSelectData();
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：隐藏执行成本模态框
   * @param flag 关闭模态的标志
   */
  hideCarryOutModal=(flag)=>{
    if(flag === 'confirm'){
        if (this.state.carryOutValue === '') {
            message.error('选项不能为空');
            return;
        }
      if(isInArray(this.props.yearListRowSpan[this.state.year].carryOutCostList,this.state.carryOutValue)){
        message.error(config.FEE_IS_REPEATED);
        return;
      }else{
        this.props.dispatch({
          type:'projFullcostReModify/addCostType',
          value:this.state.carryOutValue,
          fee_type:'1',
          fee_subtype:'1',
          year:this.state.year
        });
      }
    }
    this.setState({carryOutVisible:false});
    this.initSelectData();
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：显示年份模态框
   */
  showYearModal = () => {
    if(this.props.yearList.length === this.props.fullCostYearList.length){
      message.error(config.NO_ADD_YEAR);
    }else{
      this.setState({yearVisible:true})
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：隐藏年份模态框
   * @param flag 关闭模态的标志
   */
  hideYearModal=(flag)=>{
    if(flag === 'confirm'){
        if (this.state.yearValue === '') {
            message.error('选项不能为空');
            return;
        }
      if(isInArray(this.props.yearList,this.state.yearValue)){
        message.error(config.YEAR_IS_REPEATED);
        return;
      }else{
        this.props.dispatch({
          type:'projFullcostReModify/addYear',
          year:this.state.yearValue
        });
      }
    }
    this.setState({yearVisible:false});
    this.initSelectData();
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-04-18
   * 功能：隐藏选择审核人模态框
   * @param flag 关闭模态的标志
   */
  hideVerifyModal=(flag)=>{
    if(flag === 'confirm'){
      const {verifierValue,emailValue} = this.refs.choseVerifier.state;
      if(verifierValue === '' || verifierValue === undefined){
        message.error('请选择审核人');
        return;
      }else{
        let object_cos = {};
        object_cos.array_proj_dept = this.getCoorDeptData();
        object_cos.array_proj_budget = this.getdeptBudgetData();
        this.props.dispatch({
          type:'projFullcostReModify/submitFullCostBudget',
          object_cos:object_cos,
          reasonValue:this.state.reasonValue.trim(),
          verifierValue:verifierValue,
          emailValue:emailValue
        });
      }
    }
    else if(flag === 'cancel'){
      //点击关闭或者取消时，查询一遍最新的标题数据，用于获取最新的arg_check_id
      this.props.dispatch({
        type:'projFullcostReModify/projFullcostTitle',
      });
    }
    this.setState({
      verifyVisible:false,
    })
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：设置输入型框的值
   * @param e 输入事件
   * @param inputType 输入的类型
   */
  setInputValue = (e,inputType) =>{
    this.state[inputType] = e.target.value;
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：删除一个配合部门
   * @param index 配合部门的索引值
   */
  deleteCoorpDept=(index)=>{
    this.props.dispatch({
      type:'projFullcostReModify/deleteCoorpDept',
      index:index
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：编辑配合部门联系人
   * @param e 事件
   * @param index 配合部门的索引值
   */
  editCoorpMgrName=(e,index)=>{
    this.props.dispatch({
      type:'projFullcostReModify/editCoorpMgrName',
      index:index,
      text:e.target.value
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：编辑表格单元格数据
   * @param e 输入事件
   * @param year 年份
   * @param deptName 部门
   * @param noPreFeeName 没有前缀的费用名
   */
  editCellData = (e,year,deptName,noPreFeeName) => {
    //先将非数值去掉
    let value = e.target.value.replace(/[^\d.]/g, '');
    //如果以小数点开头，或空，改为0
    if (value === '.') { value = '0'}
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'))
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      if(noPreFeeName === config.NO_PREFIX_PREDICT ){
        //预计工时，最多1位小数
        value = value.substring(0, value.indexOf('.') + 2);
      }else{
        //费用项，最多2位小数
        value = value.substring(0, value.indexOf('.') + 3);
      }
    }
    //数字如果大于13位，第一位去掉
    if(value.length >= 13){
      value = value.substring(1,value.length)
    }
    this.props.dispatch({
      type:'projFullcostReModify/editCellData',
      value:value,
      year:year,
      deptName:deptName,
      noPreFeeName:noPreFeeName
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：添加成本费用类型
   * @param row 表格一行数据
   */
  addCostType = (row) =>{
    if('add_type' in row && row.add_type === 'purchase'){
      if(this.props.yearListRowSpan[row.year].purchaseCostList.length === this.props.purchaseAllCostList.length){
        message.error(config.NO_ADD_COST_TYPE);
      }else{
        this.showModal('purchaseVisible');
      }
    }else if('add_type' in row && row.add_type === 'carryOut'){
      if(this.props.yearListRowSpan[row.year].carryOutCostList.length === this.props.carryOutAllCostList.length){
        message.error(config.NO_ADD_COST_TYPE);
      }else{
        this.showModal('carryOutVisible');
      }
    }else if('add_type' in row && row.add_type === 'operate'){
      if(this.props.yearListRowSpan[row.year].operateCostList.length === this.props.operateAllCostList.length){
        message.error(config.NO_ADD_COST_TYPE);
      }else{
        this.showModal('operateVisible');
      }
    }
    this.state.year = row.year;
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：删除成本费用类型
   * @param row 表格一行数据
   */
  deleteCostType = (row) =>{
    this.props.dispatch({
      type:'projFullcostReModify/deleteCostType',
      value:row.no_pre_fee_name,
      year:row.year
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：删除年份费用项
   * @param year 删除的年份
   */
  deleteYear = (year) => {
    let thisMe = this;
    confirm({
      title: config.DELETE_YEAR_TIP + year + '吗？',
      onOk() {
        thisMe.props.dispatch({
          type:'projFullcostReModify/deleteYear',
          year:year
        });
      },
      onCancel() {
      },
    });
  };


  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：全成本编辑页面，点击返回时判断有无数据变化
   */
  goBackView = () => {
    let coorDeptData = this.getCoorDeptData();
    let deptBudgetData = this.getdeptBudgetData();
    if(coorDeptData.length === 0 && deptBudgetData.length === 0){
      history.back();
    }else{
      confirm({
        title:config.CONTENT_CHANGE,
        onOk() {
          history.back();
        },
        onCancel() {
        },
      });
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：获取配合部门表格变化的数据
   */
  getCoorDeptData = ()=>{
    let {coorpDeptList} = this.props;
    let array_proj_dept = [];
    for(let i = 0; i < coorpDeptList.length; i++){
      if(coorpDeptList[i].opt_type !== 'search'){
        let obj = {};
        // 新增，修改，删除 共用部门
        obj.dept_uid = coorpDeptList[i].dept_uid;
        obj.ou = coorpDeptList[i].ou;
        obj.dept_name = coorpDeptList[i].dept_name;
        obj.mgr_name = coorpDeptList[i].mgr_name;
        obj.flag = coorpDeptList[i].opt_type;
        array_proj_dept.push(obj);
      }
    }
    return array_proj_dept;
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：获取部门预算表格变化的数据
   */
  getdeptBudgetData = ()=>{
    let {deptBudgetList} = this.props;
    let array_proj_budget = [];
    for(let j = 0; j < deptBudgetList.length; j++){
      if(deptBudgetList[j].opt_type !== 'search'){
        let obj = {};
        // 新增，修改，删除 共用部门
        obj.budget_uid = deptBudgetList[j].budget_uid;
        obj.ou = deptBudgetList[j].ou;
        obj.dept_name = deptBudgetList[j].dept_name;
        obj.fee_type = deptBudgetList[j].fee_type;
        obj.fee_subtype = deptBudgetList[j].fee_subtype;
        obj.fee_name = deptBudgetList[j].fee_name;
        obj.fee = Number(deptBudgetList[j].fee).toString();
        obj.year = deptBudgetList[j].year;
        obj.flag = deptBudgetList[j].opt_type;
        array_proj_budget.push(obj);
      }
    }
    return array_proj_budget;
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-23
   * 功能：提交全成本数据
   */
  submitFullCost = () =>{
    let { yearListRowSpan, allDeptList, yearList } = this.props;
    allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
    let arrayProjBudget = this.getdeptBudgetData();
    let arrayProjDept = this.getCoorDeptData();
    if(arrayProjDept.length === 0 && arrayProjBudget.length === 0){
      message.error(config.CONTENT_NOT_CHANGE_NO_SUBMIT);
      return 1;
    }

    /*//预计工时总和不能为0
    if(Number(this.props.predictTimeTotal) === 0){
      message.error('总预计工时不能为0');
      return 1;
    }*/
    for(let di = 0; di < allDeptList.length; di++){
      let deptPredictSum = 0;
      let deptBudgetSum = 0;
      for(let yi = 0; yi < yearList.length; yi++){
        //每一部门工时和
        deptPredictSum += Number(yearListRowSpan[yearList[yi]].predictTimeTotal[di]);
        //每一个部门的预算和
        deptBudgetSum += Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[di]) +
          Number(yearListRowSpan[yearList[yi]].operateDeptTotal[di]) +
          Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[di]) +
          Number(yearListRowSpan[yearList[yi]].humanCostTotal[di]);
      }
      if(deptPredictSum === 0){
        message.error(allDeptList[di].dept_name + '的所有工时之和不能为0');
        return 1;
      }
      if(deptBudgetSum === 0){
        message.error(allDeptList[di].dept_name + '的所有预算之和不能为0');
        return 1;
      }
    }

    //判断修改原因是否为空
    if(this.state.reasonValue.trim() === ''){
      message.error(config.MODIFY_REASON_EMPTY);
      return 1;
    }

    this.props.dispatch({
      type:'projFullcostReModify/submitGetVerifierData',
    });
    this.showModal('verifyVisible');
  };

  columns = [
    {
      title:'序号',
      dataIndex:'',
      render: (value,row,index) =>{return(index+1);}
    },
    {
      title: '配合部门',
      dataIndex: 'dept_name',
      render: (value,row,index) =>{
        return(<div style={{textAlign:'left'}}>{value}</div>);
      }
    },
    {
      title: '配合方联系人',
      dataIndex: 'mgr_name',
      render: (value,row,index) =>{
        return(<Input value={value} onChange={(e)=>this.editCoorpMgrName(e,row.key)}/>);
      }
    },
    {
      title:<Icon type="plus-circle-o" className={styles.addIconBig}  onClick={()=>this.showModal('deptModalVisible')} />,
      dataIndex: 'ts_handle',
      render: (value,row,index) =>{
        return(<Button type="primary" onClick={()=>this.deleteCoorpDept(row.key)}><a>删除</a></Button>);
      }
    }
  ];

  render(){

    let budgetColumns = [
      {
        title:<Icon type="plus-circle-o" className={styles.addIconBig} onClick={this.showYearModal}/>,
        dataIndex:'year',
        fixed: 'left',
        width:100,
        render: (value, row, index) => {
          if('yearOptType' in row && row.yearOptType === 'total'){
            return value;
          }else{
            return {
              children: <div>
                <span>{value}</span>
                <Icon type="delete"
                      className={styles.deleteIcon}
                      onClick={()=>this.deleteYear(row.year)}/>
              </div>,
              props: {rowSpan:row.yearRowSpan},
            };
          }
        },
      },
      {
        title: '费用类别',
        dataIndex: 'fee_name',
        fixed: 'left',
        width:380,
        render: (value, row, index) => {
          if('can_add' in row && row.can_add === 'can_add'){
            return(<div style={{textAlign:'left',paddingLeft:row.padLeft}}>
              <span>{value}</span>
              <Icon type="plus-circle-o" className={styles.costAdd} onClick={()=>this.addCostType(row)}/>
            </div>);
          }else if(row.feeNameLevel === '3'){
            return (<div style={{textAlign:'left',paddingLeft:row.padLeft}}>{value}
              <Icon type="delete"
                    className={styles.deleteIcon}
                    onClick={()=>this.deleteCostType(row)}/>

            </div>);
          }else{
            return <div style={{textAlign:'left',paddingLeft:row.padLeft}}>{value}</div>;
          }
        },
      },
    ];

    let  allDeptList = this.props.allDeptList.filter(item => item.opt_type !== 'delete');

    for(let i = 0 ;i < allDeptList.length; i++){
      budgetColumns.push({
        title: allDeptList[i].dept_name,
        dataIndex:'dept' + i.toString(),
        render: (value, row, index) => {
          if('not_edit' in row && row.not_edit === 'not_edit'){
            return (<Input value={change2Thousands(value)} disabled={true}/>);
          }else if('not_input' in row && row.not_input === 'not_input'){
            return (<div style={{textAlign:'left',paddingLeft:7}}>{change2Thousands(value)}</div>);
          }else{
            return (<Input value={value}
                           disabled={false}
                           onChange={(e)=>this.editCellData(e,row.year,allDeptList[i].dept_name,row.no_pre_fee_name)}/>);
          }
        },
      });
    }
    budgetColumns.push({
      title: '小计',
      dataIndex: 'total',
      fixed: 'right',
      width:config.FULLCOST_TOTAL,
      render:(value,row,index)=>{
        //如果是预算项，保留千分位，并且为两位小数
        if(row.feeType === '1'){
          return (<div style={{textAlign:'right'}}>{change2Thousands(value)}</div>);
        }else{
          return (<div style={{textAlign:'right'}}>{value}</div>);
        }
      }
    });
    const purchaseList = this.props.purchaseAllCostList.map((item)=>{
      return (<Option key={item.fee_name}>{item.fee_name}</Option>)
    });
    const operateList = this.props.operateAllCostList.map((item)=>{
      return (<Option key={item.fee_name}>{item.fee_name}</Option>)
    });
    const carryOutList = this.props.carryOutAllCostList.map((item)=>{
      return (<Option key={item.fee_name}>{item.fee_name}</Option>)
    });
    const fullCostYearList = this.props.fullCostYearList.map((item)=>{
      return (<Option key={item}>{item}</Option>)
    });
    return(
      <Spin tip={config.PROCESSING_DATA} spinning={this.props.loading}>
        <div>
          <div>
            <div style={{textAlign:'right'}}>
              <Button type='primary' onClick={this.submitFullCost}>{'提交'}</Button>
              &nbsp;&nbsp;
              <Button type='primary' onClick={this.goBackView}>{'返回'}</Button>
            </div>
          </div>
          {/*选择审核人模态框*/}
          {<Modal visible={this.state.verifyVisible && this.props.verifierDataRel === true}
                  key={getuuid(20,62)}
                  title={'请选择审核人'}
                  width={'500px'}
                  onOk={()=>this.hideVerifyModal('confirm')}
                  onCancel={()=>this.hideVerifyModal('cancel')}
          >
            <ChoseVerifier
              ref={'choseVerifier'}
              verifierList={this.props.verifierData.DataRows}
              verifierDefaultId={this.props.verifierData.pre_checker_userid}
            />
          </Modal>}

          {/*修改原因输入框*/}
          <div className={styles.modifyReasonStyle}>
            <div>
              <div style={{color:'red',display:'inline-block',verticalAlign:'top',marginRight:5}}>{"修改原因*"}</div>
              <div style={{display:'inline-block',width:'90%'}}>
                <TextArea rows={4} onChange={(e)=>this.setInputValue(e,'reasonValue')} placeholder={'请输入修改原因'}/>
              </div>
            </div>
            {this.props.fullCostEditFlag === '3'?
              <div>
                <span style={{color:'red'}}>{this.props.fullCostEditVal}</span>
              </div>
              :
              null
            }
          </div>
          <div className={styles.predictTime}>
            <span>{config.PREDICT_TIME_TOTAL}</span><span>{this.props.predictTimeTotal}</span>{'人月'}
          </div>
          <h2 className={styles.headerName}>{config.COORP_DEPT_INFO}</h2>
          <Table columns={this.columns}
                 dataSource={this.props.coorpDeptList.filter(item => item.opt_type !== 'delete')}
                 pagination={false}
                 className={styles.fcTable+' '+styles.deptsTable}
          />
          {/*添加配合部门的模态框*/}
          <Modal visible={this.state.deptModalVisible}
                 key={getuuid(20,62)}
                 width={config.DEPT_MODAL_WIDTH}
                 title={config.SELECT_DEPT}
                 onOk={()=>this.hideDeptModal('confirm')}
                 onCancel={()=>this.hideDeptModal('cancel')}
          >
            <div>
              <AssignDept flag={true} ref='assignDeptComp'  defaultDept={this.props.coorpDeptList} />
            </div>
          </Modal>
          <br/>
          <h2 className={styles.headerName}>{config.DEPT_BUDGET_INFO}</h2>
          <Table columns={budgetColumns}
                 dataSource={this.props.deptBudgetTableData}
                 pagination={false}
                 className={styles.fcTable+' '+styles.deptsTable}
                 scroll={{ x: 300 * allDeptList.length}}
          />

          {/*添加项目采购成本类型的模态框*/}
          <Modal
            title={config.NO_PREFIX_PURCHASE_COST}
            key={getuuid(20,62)}
            visible={this.state.purchaseVisible}
            onOk={()=>this.hidePurchaseModal('confirm')}
            onCancel={()=>this.hidePurchaseModal('cancel')}
          >
            <Select  onSelect={(value)=>this.changeSelectValue(value,'purchaseValue')} style={{width:300,marginLeft:'20%'}}>
              {purchaseList}
            </Select>
          </Modal>

          {/*添加项目运行成本类型的模态框*/}
          <Modal
            title={config.NO_PREFIX_OPERATE_COST}
            key={getuuid(20,62)}
            visible={this.state.operateVisible}
            onOk={()=>this.hideOperateModal('confirm')}
            onCancel={()=>this.hideOperateModal('cancel')}
          >
            <Select  onSelect={(value)=>this.changeSelectValue(value,'operateValue')} style={{width:200,marginLeft:'30%'}}>
              {operateList}
            </Select>
          </Modal>

          {/*添加项目实施成本类型的模态框*/}
          <Modal
            title={config.NO_PREFIX_CARRYOUT_COST}
            key={getuuid(20,62)}
            visible={this.state.carryOutVisible}
            onOk={()=>this.hideCarryOutModal('confirm')}
            onCancel={()=>this.hideCarryOutModal('cancel')}
          >
            <Select  onSelect={(value)=>this.changeSelectValue(value,'carryOutValue')} style={{width:200,marginLeft:'30%'}}>
              {carryOutList}
            </Select>
          </Modal>

          {/*添加年份的模态框*/}
          <Modal
            title={config.SELECT_YEAR}
            key={getuuid(20,62)}
            visible={this.state.yearVisible}
            onOk={()=>this.hideYearModal('confirm')}
            onCancel={()=>this.hideYearModal('cancel')}
          >
            <Select  onSelect={(value)=>this.changeSelectValue(value,'yearValue')} style={{width:150,marginLeft:'35%'}}>
              {fullCostYearList}
            </Select>
          </Modal>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.projFullcostReModify,
    ...state.projFullcostReModify
  }
}

export default connect(mapStateToProps)(ProjFullcostReModify);
