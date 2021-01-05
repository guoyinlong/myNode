/**
 *  作者: 邓广晖
 *  创建日期: 2018-03-14
 *  邮箱：denggh6@chinaunicom.cn
 *  文件说明：以前年度应付款填报
 */
import React from 'react';
import {Button,Table, Input, Select,TreeSelect,Icon,Modal,message,Popconfirm,Popover,Tooltip } from 'antd';
import {getUuid} from '../../../../components/commonApp/commonAppConst.js';
import OfficeFillTable from './officeFillTable';
import CapexFillTable from './capexFillTable';
import styles from './planFill.less';
const {Option} = Select;

const EMPTY_DATA = '数据不能为空';

/**
 * 作者：邓广晖
 * 创建日期：2018-03-17
 * 功能：转变为千分位
 * @param value 输入的值
 */
function change2Thousands (value) {
  if(value !== undefined && value !== ''){
    return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }else{
    return '-';
  }
}

/**
 * 作者：邓广晖
 * 创建日期：2018-03-14
 * 功能：以前年度应付款填报组件
 */
class PriorYearFill extends React.PureComponent {
  state = {
    officeVisible:false,             //办公费对话框的可见状态
    capexVisible:false,              //capex对话框的可见状态
    stateCode:'',                    //表格处于的阶段
    chlidRowsIndex:0,                //表格当前行
    chlidRowsDataList:[],            //点击当前行时，缓存chlid数据，可编辑
    chlidRowsOrigList:[],            //点击当前行时，存入chlid数据的原始数据
    subjectObj:{},                   //点击科目（费用）时，将其对象保存，包括subject_name subject_id flag
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：添加一条本月填报记录
   */
  addPriorYearFillData = () => {
    this.props.dispatch({
      type:'fundingPlanFill/addPriorYearFillData'
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：删除一条本月填报记录
   * @param index 删除记录的索引值
   */
  deletePriorYearFillData = (index) => {
    this.props.dispatch({
      type:'fundingPlanFill/deletePriorYearFillData',
      index:index
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：编辑填报时的单元格
   * @param e 输入事件
   * @param index 编辑行所在的索引值
   * @param colType 编辑单元格所在的列名
   */
  editPriorYearCellData = (e,index,colType) => {
    let value = e.target.value;
    //如果是金额类，需要限制，而且可以输入负数  funds_plan   funds_current_amount
    if (colType === 'funds_plan' || colType === 'funds_current_amount') {
      //资金计划可填，资金计划调整永远不能编辑，调整后资金计划可以为负数
      let isMinus = false;
      if (colType === 'funds_current_amount') {
        //如果以 — 开头
        if (value.indexOf('-') === 0) {
          isMinus = true;
        }
      }
      //先将非数值去掉
      value = value.replace(/[^\d.]/g, '');
      //如果以小数点开头，或空，改为0
      if (value === '.') { value = '0'}
      //如果输入两个小数点，去掉一个
      if (value.indexOf('.') !== value.lastIndexOf('.')) {
        value = value.substring(0, value.lastIndexOf('.'))
      }
      //如果有小数点
      if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
        //费用项，最多2位小数
        value = value.substring(0, value.indexOf('.') + 3);
      }
      if(isMinus === true){
        value = '-' + value;
      }
    }
    this.props.dispatch({
      type:'fundingPlanFill/editPriorYearInputData',
      value:value,
      index:index,
      colType:colType
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：改变下拉框的值
   * @param value 下拉框的值的id
   * @param record 一条记录
   * @param colType 编辑单元格所在的列名
   */
  changeSelectValue = (value,record,colType) =>{
    //如果下拉菜单是  科目名称  中的  办公费 , 弹出对话框,并将已有数据传入
    if (colType === 'subject_id') {
      const {feeList} = this.props;
      let selectFeeFlag = '3';
      let subjectObj = {};
      for (let i = 0 ; i < feeList.length; i++) {
        //此处不能用value来做比较，因为如果点击的之前的选项，value = undefined
        let selectValue = value !== undefined ? value : record.subject_id;
        if (selectValue === feeList[i].uuid) {
          this.setState({ subjectObj:feeList[i]});
          subjectObj = feeList[i];
          selectFeeFlag = feeList[i].flag;
          break;
        }
      }
      //如果是 办公用品或者capex
      if (selectFeeFlag === '1' || selectFeeFlag === '2') {
        let chlidRowsDataList = [];
        //如果点击的还是当前显示的，赋值当前的值，如果不是，清空chlidRows
        if (value === undefined) {
          let chlidRows = record.chlidRows;
          chlidRows.map((item,index)=>{item.key = index});
          chlidRowsDataList = chlidRows;
        }
        this.setState({
          chlidRowsIndex:record.key,                 //表格当前行
          chlidRowsDataList:chlidRowsDataList,        //将弹出框详细数据缓存在state
          stateCode:record.state_code,                //表格处于的阶段
        });
        if (selectFeeFlag === '1') {
          //显示capex对话框
          this.setState({ capexVisible:true });
        }else if (selectFeeFlag === '2') {
          //显示办公费对话框
          this.setState({ officeVisible:true });
        }
      } else if (selectFeeFlag === '3') {
        this.props.dispatch({
          type:'fundingPlanFill/editPriorYearSelectData',
          value:value,
          index:record.key,
          colType:colType,
          subjectObj:subjectObj
        });
      }
    }else {
      this.props.dispatch({
        type:'fundingPlanFill/editPriorYearSelectData',
        value:value,
        index:record.key,
        colType:colType,
        subjectObj:this.state.subjectObj
      });
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：选择办公费对话框关闭
   * @param flag 关闭对话框时的标志，为confirm，cancel
   */
  hideOfficeModal=(flag)=>{
    if(flag === 'confirm'){
      let officeTableData = this.refs.officeFillTable.state.officeDataList;
      if (officeTableData.length > 0) {
        for (let i = 0; i < officeTableData.length; i++) {
          if (officeTableData[i].funds_plan.trim() === '') {
            message.info(officeTableData[i].supplies_name + '的金额不能为空');
            return;
          }
          if (Number(officeTableData[i].funds_plan) === 0) {
            message.info(officeTableData[i].supplies_name + '的金额不能为0');
            return;
          }
        }
        this.props.dispatch({
          type:'fundingPlanFill/editPriorYearOfficeData',
          index:this.state.chlidRowsIndex,
          fillOfficeData:officeTableData,
          subjectObj:this.state.subjectObj
        });
      } else {
        message.info('请添加数据');
        return;
      }
    }
    this.setState({officeVisible:false})
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：选择capex对话框关闭
   * @param flag 关闭对话框时的标志，为confirm，cancel
   */
  hideCapexModal=(flag)=>{
    if(flag === 'confirm'){
      let capexTableData = this.refs.capexFillTable.state.capexDataList;
      if (capexTableData.length > 0) {
        for (let i = 0; i < capexTableData.length; i++) {

          if (capexTableData[i].approved_proj_name.trim() === '') {
            message.info(EMPTY_DATA);
            return;
          }
          if (capexTableData[i].approved_item_number.trim() === '') {
            message.info(EMPTY_DATA);
            return;
          }
          if (capexTableData[i].total_proj_budget.trim() === '') {
            message.info(EMPTY_DATA);
            return;
          }
          if (capexTableData[i].contract_title.trim() === '') {
            message.info(EMPTY_DATA);
            return;
          }
          if (capexTableData[i].contract_amount.trim() === '') {
            message.info(EMPTY_DATA);
            return;
          }
          if (capexTableData[i].accumulated_amount_paid.trim() === '') {
            message.info(EMPTY_DATA);
            return;
          }
          if (capexTableData[i].payment_amount_this_month.trim() === '') {
            message.info(EMPTY_DATA);
            return;
          }
        }
        this.props.dispatch({
          type:'fundingPlanFill/editPriorYearCapexData',
          index:this.state.chlidRowsIndex,
          fillCapexData:capexTableData,
          subjectObj:this.state.subjectObj
        });
      } else {
        message.info('请添加数据');
        return;
      }
    }
    this.setState({capexVisible:false})
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：保存或者提交
   * @param flag  1：保存，2：提交
   * @param tabFlag 1:当月资金计划填报，2：以前年度应付款填报
   */
  savePriorYearFillData = (flag,tabFlag) => {
    this.props.dispatch({
      type:'fundingPlanFill/saveFillData',
      flag:flag,
      tabFlag:tabFlag
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-27
   * 功能：点击小图标时，也能弹出编辑框，但是不能新增和删除
   * @param record  一条记录
   */
  showEditModal = (record) => {
    const {feeList} = this.props;
    for (let i = 0 ; i < feeList.length; i++) {
      if (record.subject_id === feeList[i].uuid) {
        this.setState({ subjectObj:feeList[i]});
        break;
      }
    }
    //如果是 办公用品或者capex
    let chlidRows = record.chlidRows;
    chlidRows.map((item,index)=>{item.key = index});
    if (record.boundModalFlag === '1' || record.boundModalFlag === '2') {
      this.setState({
        chlidRowsIndex:record.key,                  //表格当前行
        chlidRowsDataList:chlidRows,                //将弹出框详细数据缓存在state
        stateCode:record.state_code,                //表格处于的阶段
      });
      if (record.boundModalFlag === '1') {
        //显示capex对话框
        this.setState({ capexVisible:true });
      }else if (record.boundModalFlag === '2') {
        //显示办公费对话框
        this.setState({ officeVisible:true });
      }
    }
  };

  officeIconColumns = [
    {
      title: '序号',
      dataIndex: '',
      width:'17%',
      render:(text, record, index) => {
        return (<div>{index+1}</div>);
      }
    },{
      title: '商品',
      dataIndex: 'supplies_name',
      width:'26%',
      render:(text, record, index) => {
        return (<div style={{textAlign:'left'}}>{text}</div>);
      }
    },
    {
      title: '单价',
      dataIndex: 'funds_plan',
      width:'20%',
      render:(text, record, index) => {
        return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width:'23%',
      render:(text, record, index) => {
        return (<div >{change2Thousands(text)}</div>);
      },
    }
  ];

  capexIconColumns = [
    {
      title: '序号',
      dataIndex: '',
      width:'5%',
      render:(text, record, index) => {
        return (<div>{index+1}</div>);
      }
    },{
      title: '项目批复年度',
      dataIndex: 'proj_approval_year',
      width:'10%',
    },{
      title: '批复项目名称',
      dataIndex: 'approved_proj_name',
      width:'12%',
      render: (text, record, index) => {
        return (<div style={{textAlign:'left'}}>{text}</div>);
      },
    },{
      title: '批复项目编号',
      dataIndex: 'approved_item_number',
      width:'10%',
      render: (text, record, index) => {
        return (<div style={{textAlign:'left'}}>{text}</div>);
      },
    },{
      title: '项目总预算',
      dataIndex: 'total_proj_budget',
      width:'10%',
      render: (text, record, index) => {
        return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
      },
    },{
      title: '合同名称',
      dataIndex: 'contract_title',
      width:'13%',
      render: (text, record, index) => {
        return (<div style={{textAlign:'left'}}>{text}</div>);
      },
    },{
      title: '合同总金额',
      dataIndex: 'contract_amount',
      width:'10%',
      render: (text, record, index) => {
        return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
      },
    },{
      title: '累计已支付金额',
      dataIndex: 'accumulated_amount_paid',
      width:'10%',
      render: (text, record, index) => {
        return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
      },
    },{
      title: '本月付款金额',
      dataIndex: 'payment_amount_this_month',
      width:'10%',
      render: (text, record, index) => {
        return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
      },
    }
  ];

  render() {
    const userApplyList = this.props.canApplyUserList.map((item)=>{
      return (<Option key={item.apply_userid} value={item.apply_userid}>{item.apply_username}</Option>)
    });
    let columns = [
      {
        title: '资金类型',
        dataIndex: 'funds_type',
        width:'9%',
        render:(text, record, index) => {
          //资金类型的编辑状态，与阶段无关，与 状态 和 角色有关
          let disabledData = true;
          //待审核（2）、审核通过（3），审核退回（4）的不能编辑，非填报阶段也不能编辑
          if (record.state_code === '2' || record.state_code === '3' ||
              record.state_code === '4' || this.props.fundStage === '4') {
            disabledData = true;
          } else {
            //在编辑的情况下（新增0和保存1），如果当前用户的角色是小组管理员，才能编辑
            disabledData = this.props.roleType !== '2';
          }
          return (
            <Select
              style={{ width: 63}}
              value={text}
              disabled={disabledData}
              onSelect={(value)=>this.changeSelectValue(value,record,'funds_type')}
            >
              <Option value="1">个人</Option>
              <Option value="2">公共</Option>
              <Option value="3">他购</Option>
            </Select>
          );
        }
      }, {
        title: '报销申请人',
        dataIndex: 'apply_userid',
        width:'11%',
        render:(text, record, index) => {
          //待审核（2）、审核通过（3），审核退回（4）的不能编辑
          let disabledData = record.state_code === '2' || record.state_code === '3' || record.state_code === '4';
          if (record.funds_type === '1' || record.funds_type === '2') {
            return (<div style={{textAlign:'left',marginLeft:12}}>{record.apply_username}</div>);
          } else {
            return (
              <div style={{textAlign:'left',marginLeft:5}}>
                <Select
                  style={{width:90}}
                  disabled={disabledData}
                  value={record.apply_username}
                  onSelect={(value)=>this.changeSelectValue(value,record,'apply_userid')}
                >
                  {userApplyList}
                </Select>
              </div>
            );
          }
        }
      }, {
        title: '科目名称',
        dataIndex: 'subject_id',
        width:'21%',
        render:(text,record,index) => {
          //如果是办公费，小图标显示办公品
          //科目名称的编辑状态，与阶段无关，只与 状态 有关
          //待审核（2）、审核通过（3），审核退回（4）的不能编辑
          let disabledData = record.state_code === '2' || record.state_code === '3' ||
                             record.state_code === '4' || this.props.fundStage === '4';
          //但是，如果是预填报阶段审核通过的，且是办公费或者capex的，图标是可以编辑的
          let iconDisabled = record.state_code === '2' ||
                            (record.state_code === '3' && record.report_batch !== '1') ||
                             record.state_code === '4' || this.props.fundStage === '4';
          let chlidRows = record.chlidRows;
          chlidRows.map((item,index)=>{item.key = index});
          return (
            <div style={{textAlign:'left'}}>
              <TreeSelect
                style={{ width: 180 }}
                value={text}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{width:200}}
                disabled={disabledData}
                treeData={this.props.feeListTree}
                onChange={(value)=>this.changeSelectValue(value,record,'subject_id')}
              />
              {record.boundModalFlag === '2'?
                <Popover
                  title={'办公用品详情'}
                  content={
                    <Table
                      dataSource={chlidRows}
                      columns={this.officeIconColumns}
                      className={styles.fillTable}
                      style={{width:'350px'}}
                      bordered={true}
                      pagination={false}
                    />
                  }
                >
                  {iconDisabled?
                    <Icon type='info-circle-o' />
                    :
                    <Icon type='info-circle-o'
                          onClick={()=>this.showEditModal(record)}
                          style={{cursor:'pointer'}}
                    />
                  }
                </Popover>
                :
                <span>
                  {record.boundModalFlag === '1'?
                    <Popover
                      title={record.subject_name + '详情'}
                      content={
                        <Table
                          dataSource={chlidRows}
                          columns={this.capexIconColumns}
                          className={styles.fillTable}
                          style={{width:'1100px'}}
                          bordered={true}
                          pagination={false}
                        />
                      }
                    >
                      {iconDisabled?
                        <Icon type='info-circle-o' />
                        :
                        <Icon type='info-circle-o'
                              onClick={()=>this.showEditModal(record)}
                              style={{cursor:'pointer'}}
                        />
                      }
                    </Popover>
                    :
                    null
                  }
                </span>
              }
            </div>
          );
        }
      }, {
        title: '资金计划',
        dataIndex: 'funds_plan',
        width:'8%',
        render: (text, record, index) => {
          let disabledData = true;
          if (this.props.fundStage === '1') {
            //预填报阶段（1）
            //待审核（2）和审核通过（3）和审核退回（4）的不能编辑
            disabledData = record.state_code === '2' || record.state_code === '3'|| record.state_code === '4';
          } else if (this.props.fundStage === '2' || this.props.fundStage === '3') {
            //追加阶段(2)，和调整阶段（3），任何状态都不能编辑
            disabledData = true;
          }
          if (disabledData === true) {
            return (
              <div style={{textAlign:'left',marginLeft:7}}>
                {change2Thousands(text)}
              </div>
            );
          } else {
            //有弹出框的不能编辑，没有弹出框的可以编辑
            if(record.boundModalFlag === '1' || record.boundModalFlag === '2'){
              return (
                <div style={{textAlign:'left',marginLeft:7}}>
                  {change2Thousands(text)}
                </div>
              );
            }else {
              return (
                <Input
                  value={text}
                  disabled={false}
                  maxLength='12'
                  onChange={(e)=>this.editPriorYearCellData(e,record.key,'funds_plan')}
                />
              );
            }
          }
        },
      }, {
        title: '资金计划调整',
        dataIndex: 'funds_diff',
        width:'8%',
        render: (text, record, index) => {
          //资金计划调整，任何阶段，任何状态下，不能编辑，
          //显示的值 用 调整后资金计划 减去 资金计划，如果调整后资金计划为“”，资金计划调增显示“-”
          if (record.funds_current_amount.trim() === '' || record.funds_current_amount.trim() === '-') {
            return (
              <div style={{textAlign:'left',marginLeft:7}}>{'-'}</div>
            );
          }else {
            return (
              <div style={{textAlign:'left',marginLeft:7}}>
                {change2Thousands((Number(record.funds_current_amount) - Number(record.funds_plan)).toFixed(2))}
              </div>
            );
          }
        },
      }, {
        title: '调整后资金计划',
        dataIndex: 'funds_current_amount',
        width:'8%',
        render: (text, record, index) => {
          //预填报阶段，如何状态都不能编辑
          let disabledData = true;
          if (this.props.fundStage === '1') {
            disabledData = true;
          } else if (this.props.fundStage === '2') {
            //只有预填报审核通过（3），保存（1），新增（0）的可编辑，待审核（2）和审核退回（4）的不能编辑
            //追加阶段的审核通过不能编辑
            //追加阶段如果是办公费和capex的（有弹框的），该值不是输入框，通过对话框的值传递过来，即不能编辑
            disabledData = record.state_code === '2' || record.state_code === '4' ||
                           (record.report_batch !== '1' && record.state_code === '3')||
                           (record.boundModalFlag === '1' || record.boundModalFlag === '2');
          } else if (this.props.fundStage === '3') {
            //新增（0）保存（1）的可编辑，，待审核（2），审核通过（3），审核退回（4）不能编辑，办公费和capex不能编辑
            disabledData = record.state_code === '2' || record.state_code === '3' || record.state_code === '4' ||
                          (record.boundModalFlag === '1' || record.boundModalFlag === '2');
          }
          if (disabledData === true) {
            return (
              <div style={{textAlign:'left',marginLeft:7}}>
                {change2Thousands(text)}
              </div>
            );
          } else {
            return (
              <Input
                value={text}
                disabled={false}
                maxLength='12'
                onChange={(e)=>this.editPriorYearCellData(e,record.key,'funds_current_amount')}
              />
            );
          }
        },
      },{
        title: '具体付款事项描述',
        dataIndex: 'spe_pay_description',
        width:'12%',
        render: (text,record,index) => {
          //编辑状态，与阶段无关，只与 状态 有关
          //待审核（2）、审核通过（3），审核退回（4）的不能编辑
          let disabledData = record.state_code === '2' || record.state_code === '3' ||
                             record.state_code === '4' || this.props.fundStage === '4';
          if (disabledData === true) {
            return (
              <div style={{textAlign:'left',marginLeft:7}}>{text}</div>
            );
          } else {
            return (
              <Input
                value={text}
                disabled={false}
                maxLength='100'
                onChange={(e)=>this.editPriorYearCellData(e,record.key,'spe_pay_description')}
              />
            );
          }
        }
      }, {
        title: '状态',
        dataIndex: 'state_name',
        width:'8%',
        render: (text,record,index) => {
          if (record.state_code === '3') {
            //状态中，审核通过分为填报阶段的审核通过，追加阶段的审核通过，调整阶段的审核通过
            let stateMark = '';
            if (record.report_batch === '1') {
              stateMark = '(预填报)';
            } else if (record.report_batch === '2') {
              stateMark = '(追加)';
            } else if (record.report_batch === '3') {
              stateMark = '(调整)';
            }
            return (
              <div>
                <div>{text}</div>
                <div>{stateMark}</div>
              </div>
            );
          } else {
            return (
              <div>{text}</div>
            );
          }
        }
      }, {
        title: '备注',
        dataIndex: 'remark',
        width:'10%',
        render: (text, record, index) => {
          //编辑状态，与阶段无关，只与 状态 有关
          //待审核（2）、审核通过（3），审核退回（4）的不能编辑
          let disabledData = record.state_code === '2' || record.state_code === '3' ||
                             record.state_code === '4' || this.props.fundStage === '4';
          if (disabledData === true) {
            return (
              <div style={{textAlign:'left',marginLeft:7}}>{text}</div>
            );
          } else {
            return (
              <Input
                value={text}
                disabled={false}
                maxLength='100'
                onChange={(e)=>this.editPriorYearCellData(e,record.key,'remark')}
              />
            );
          }
        },
      }, {
        title: '操作',
        dataIndex: 'operation',
        width:'10%',
        render: (text, record, index) => {
          //编辑状态，与阶段无关，只与 状态 有关
          //待审核（2）、审核通过（3）不能编辑
          //审核退回（4）可编辑（删除）
          let disabledData = record.state_code === '2' || record.state_code === '3' || this.props.fundStage === '4';
          if (disabledData === false) {
            return (
              <Popconfirm title="确定删除吗?" onConfirm={() => this.deletePriorYearFillData(record.key)}>
                <Button size='small' type="danger"  ghost>{'删除'}</Button>
              </Popconfirm>
            );
          }else{
            return (
              <Button size='small' disabled ghost>{'删除'}</Button>
            );
          }
        },
      }
    ];

    return (
      <div>
        {this.props.fundStageData.report_type === '4'?
          /*为4时，不能编辑*/
          <div>
            <Tooltip title={this.props.fundStageData.report_type_show}>
              <Button type='primary' disabled={true}>{'新增'}</Button>
            </Tooltip>
          </div>
          :
          <div>
            {this.props.fundStageData.report_type === '3'?
              /*调整阶段时，只有小组管理员才能新增*/
              <div>
                {this.props.roleType ==='2'?
                  <Button onClick={this.addPriorYearFillData} type='primary'>新增</Button>
                  :
                  <Tooltip title={'调整阶段只有小组管理员才能新增！'}>
                    <Button type='primary' disabled={true}>{'新增'}</Button>
                  </Tooltip>
                }
              </div>
              :
              <div>
                {/*其他阶段*/}
                {this.props.canApplyUserList.length > 0?
                  <Button onClick={this.addPriorYearFillData} type='primary'>新增</Button>
                  :
                  <Tooltip title={'当前用户不在小组团队中，请联系小组管理员！'}>
                    <Button type='primary' disabled={true}>{'新增'}</Button>
                  </Tooltip>
                }
              </div>
            }
          </div>
        }
        <br/>
        <Table
          dataSource={this.props.priorYearFillTableData.filter(item => item.opt_type !== 'delete')}
          columns={columns}
          className={styles.fillTable}
          bordered={true}
          pagination={false}
        />
        <br/>

        {this.props.fundStageData.report_type === '4'?
          <Tooltip title={this.props.fundStageData.report_type_show}>
            <Button type='primary' disabled={true}>{'保存'}</Button>
          </Tooltip>
          :
          <span>
            {this.props.fundStageData.report_type === '3'?
              /*调整阶段时，只有小组管理员才能保存*/
              <span>
                {this.props.roleType ==='2'?
                  <Button onClick={()=>this.savePriorYearFillData('1','1')} type='primary'>保存</Button>
                  :
                  <Tooltip title={'调整阶段只有小组管理员才能保存！'}>
                    <Button type='primary' disabled={true}>{'保存'}</Button>
                  </Tooltip>
                }
              </span>
              :
              <Button onClick={()=>this.savePriorYearFillData('1','1')} type='primary'>保存</Button>
            }
          </span>
        }
        &nbsp;&nbsp;&nbsp;&nbsp;
        {this.props.fundStageData.report_type === '4'?
          <Tooltip title={this.props.fundStageData.report_type_show}>
            <Button type='primary' disabled={true}>{'提交'}</Button>
          </Tooltip>
          :
          <span>
            {this.props.fundStageData.report_type === '3'?
              /*调整阶段时，只有小组管理员才能提交*/
              <span>
                {this.props.roleType ==='2'?
                  <Button onClick={()=>this.savePriorYearFillData('2','1')} type='primary'>提交</Button>
                  :
                  <Tooltip title={'调整阶段只有小组管理员才能提交！'}>
                    <Button type='primary' disabled={true}>{'提交'}</Button>
                  </Tooltip>
                }
              </span>
              :
              <Button onClick={()=>this.savePriorYearFillData('2','1')} type='primary'>提交</Button>
            }
          </span>
        }

        {/*办公费对话框*/}
        <Modal
          title={this.state.subjectObj.fee_name + '管理'}
          key={getUuid(20,62)}
          visible={this.state.officeVisible}
          width={'500px'}
          onOk={()=>this.hideOfficeModal('confirm')}
          onCancel={()=>this.hideOfficeModal('cancel')}
        >
          <OfficeFillTable
            ref='officeFillTable'
            officeDataList={this.state.chlidRowsDataList}
            officeStationery={this.props.officeStationery}
            ordinalStationery={this.props.ordinalStationery}
            fundStage={this.props.fundStage}
            stateCode={this.state.stateCode}
          />
        </Modal>

        {/*capex对话框*/}
        <Modal
          title={this.state.subjectObj.fee_name + '管理'}
          key={getUuid(20,62)}
          visible={this.state.capexVisible}
          width={'1220px'}
          onOk={()=>this.hideCapexModal('confirm')}
          onCancel={()=>this.hideCapexModal('cancel')}
        >
          <CapexFillTable
            ref='capexFillTable'
            capexDataList={this.state.chlidRowsDataList}
            fundStageData={this.props.fundStageData}
            subjectObj={this.state.subjectObj}
            fundStage={this.props.fundStage}
            stateCode={this.state.stateCode}
          />
        </Modal>
      </div>
    );
  }
}

export default PriorYearFill;
