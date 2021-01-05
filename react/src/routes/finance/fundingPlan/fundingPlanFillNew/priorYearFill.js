/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：资金计划预填报.
 */
import React from 'react';
import styles from './planFill.less'
import { Button,Tooltip,Table,Select,TreeSelect,Input,Popover,Icon } from "antd";
import CapexFillAdd from './capexFillAdd';
import { stateCodeFill} from '../common'
const COPE_DATA='复制上月费用项';
const Option = Select.Option;
function change2Thousands (value) {
  if(value !== undefined && value !== ''){
    return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }else{
    return '-';
  }
}
class PriorYearPreFill extends React.Component{
  constructor(props){
    super(props)
  }
  state = {};
  copyPriorYearFillData = () => {
    this.props.dispatch({
      type:'fundingPlanFillNew/copyPriorYearFillData'
    });
  };
  addPriorYearFillData = () => {
    this.props.dispatch({
      type:'fundingPlanFillNew/addPriorYearFillData'
    });
  };
  deletePriorYearFillData = (index) => {
    this.props.dispatch({
      type:'fundingPlanFillNew/deletePriorYearFillData',
      index:index
    });
  };
  clearPriorYearFillData= (index) => {
    this.props.dispatch({
      type:'fundingPlanFillNew/clearPriorYearFillData',
      index,
    });
  };
  changeSelectValue = (value,record,colType) =>{
    const {feeList} = this.props.data; // feeList 没有树形结构的科目 通过value 得到 科目的所有信息 包括 name 和 flag
    let selectFeeFlag = '3';
    let subjectObj = {};
    for (let i = 0 ; i < feeList.length; i++) {
      //此处不能用value来做比较，因为如果点击的之前的选项，value = undefined ????????????????????  通过选择value(uuid)得到uuid name flag
      let selectValue = value !== undefined ? value : record.subject_id;
      if (selectValue === feeList[i].uuid) {
        subjectObj = feeList[i];
        selectFeeFlag = feeList[i].flag;
        break;
      }
    }
    //如果下拉菜单是  科目名称  中的  办公费 , 弹出对话框,并将已有数据传入
    if (colType === 'subject_id') {
      //如果是capex
      if (selectFeeFlag === '1') {
        //显示capex对话框
        this.refs.capexFillAdd.showModule(record,subjectObj,'add');
      } else if (selectFeeFlag === '3' || selectFeeFlag === '2' ) {
        this.props.dispatch({
          type:'fundingPlanFillNew/editPriorYearSelectData',
          value:value,
          index:record.key,
          colType:colType,
          subjectObj:subjectObj
        });
      }
    }else {
      this.props.dispatch({
        type:'fundingPlanFillNew/editPriorYearSelectData',
        value:value,
        index:record.key,
        colType:colType,
        subjectObj:subjectObj
      });
    }
  };
  editPriorYearCellData = (e,index,colType) => {
    let value = e.target.value;
    //如果是金额类，需要限制，而且可以输入负数  funds_plan   funds_current_amount
    if (colType === 'funds_plan' || colType === 'funds_current_amount') {
      //资金计划可填，资金计划调整永远不能编辑，调整后资金计划可以为负数
      let isMinus = false;
      //if (colType === 'funds_current_amount') {
        //如果以 — 开头
        if (value.indexOf('-') === 0) {
          isMinus = true;
        }
      //}
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
      type:'fundingPlanFillNew/editPriorYearInputData',
      value:value,
      index:index,
      colType:colType
    });
  };
  savePriorYearFillData = (flag,tabFlag) => {
    this.props.dispatch({
      type:'fundingPlanFillNew/saveFillData',
      flag:flag,
      tabFlag:tabFlag
    });
  };
  showEditModal = (record) => {
    const {feeList} = this.props.data;
    let subjectObj = {};
    for (let i = 0 ; i < feeList.length; i++) {
      if (record.subject_id === feeList[i].uuid) {  //通过record.subject_id 这一行的科目 选择出对应的科目的uuid name flag 做相应修改
        subjectObj = feeList[i];
        break;
      }
    }
    this.refs.capexFillAdd.showModule(record,subjectObj,'edit');
  };
  render() {
    const { fundStageData,roleType,canApplyUserList,priorYearFillTableData,feeListTree} = this.props.data;
    let capexIconColumns=[];
    if(fundStageData.report_type === '1'){
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
          render: (text) => {
            return (<div style={{textAlign:'left'}}>{text}</div>);
          },
        },{
          title: '批复项目编号',
          dataIndex: 'approved_item_number',
          width:'10%',
          render: (text) => {
            return (<div style={{textAlign:'left'}}>{text}</div>);
          },
        },{
          title: '项目总预算',
          dataIndex: 'total_proj_budget',
          width:'10%',
          render: (text) => {
            return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
          },
        },{
          title: '合同名称',
          dataIndex: 'contract_title',
          width:'13%',
          render: (text) => {
            return (<div style={{textAlign:'left'}}>{text}</div>);
          },
        },{
          title: '合同总金额',
          dataIndex: 'contract_amount',
          width:'10%',
          render: (text) => {
            return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
          },
        },{
          title: '累计已支付金额',
          dataIndex: 'accumulated_amount_paid',
          width:'10%',
          render: (text) => {
            return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
          },
        },{
          title: '本月付款金额',
          dataIndex: 'payment_amount_this_month',
          width:'10%',
          render: (text) => {
            return (<div style={{textAlign:'right'}}>{text?change2Thousands(Number(text).toFixed(2)):'-'}</div>);
          },
        }
      ];
    }else{
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
          width:'9%',
        },{
          title: '批复项目名称',
          dataIndex: 'approved_proj_name',
          width:'12%',
          render: (text) => {
            return (<div style={{textAlign:'left'}}>{text}</div>);
          },
        },{
          title: '批复项目编号',
          dataIndex: 'approved_item_number',
          width:'9%',
          render: (text) => {
            return (<div style={{textAlign:'left'}}>{text}</div>);
          },
        },{
          title: '项目总预算',
          dataIndex: 'total_proj_budget',
          width:'9%',
          render: (text) => {
            return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
          },
        },{
          title: '合同名称',
          dataIndex: 'contract_title',
          width:'12%',
          render: (text) => {
            return (<div style={{textAlign:'left'}}>{text}</div>);
          },
        },{
          title: '合同总金额',
          dataIndex: 'contract_amount',
          width:'9%',
          render: (text) => {
            return (<div style={{textAlign:'right'}}>{change2Thousands(Number(text).toFixed(2))}</div>);
          },
        },{
          title: '累计已支付金额',
          dataIndex: 'accumulated_amount_paid',
          width:'9%',
          render: (text) => {
            return (<div style={{textAlign:'right'}}>{text?change2Thousands(Number(text).toFixed(2)):'-'}</div>);
          },
        },{
          title: '本月付款金额',
          dataIndex: 'payment_amount_this_month',
          width:'9%',
          render: (text) => {
            return (<div style={{textAlign:'right'}}>{text?change2Thousands(Number(text).toFixed(2)):'-'}</div>);
          },
        },{
          title: '本月调整后付款金额',
          dataIndex: 'adjust_payment_amount_this_month',
          width:'9%',
          render: (text) => {
            return (<div style={{textAlign:'right'}}>{text?change2Thousands(Number(text).toFixed(2)):'-'}</div>);
          },
        }
      ];
    }
    const { flag } = this.props; // flag 判断是预填报还是追加阶段
    const userApplyList = canApplyUserList.map((item)=>{
      return (<Option key={item.apply_userid} value={item.apply_userid}>{item.apply_username}</Option>)
    });
    let columns = [];
    if(flag === 'pre'){ //预填报阶段    如果目前不处于预填报阶段，fundStageData.report_type !== 1  不能编辑    //所有state_code 都要换成fill_state_code
      columns = [
        {
          title: '资金类型',
          dataIndex: 'funds_type',
          width:'9%',
          render:(text, record) => {

            //资金类型的编辑状态，，与 状态 和 角色有关   与阶段也有关系，fundStageData.report_type !== 1 不能编辑
            let disabledData = true;
            //待审核（2）、审核通过（3）的不能编辑,非填报阶段也不能编辑
            if (record.fill_state_code === '2' || record.fill_state_code === '3' || fundStageData.report_type !== '1') {
              disabledData = true;
            } else {
              //在编辑的情况下（新增0和保存1），如果当前用户的角色是小组管理员，才能编辑
              //disabledData = roleType !== '2';
              disabledData = false;
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
        },
        {
          title: '报销申请人',
          dataIndex: 'apply_userid',
          width:'11%',
          render:(text, record) => {
            //待审核（2）、审核通过（3）的不能编辑
            let disabledData = record.fill_state_code === '2' || record.fill_state_code === '3' || fundStageData.report_type !== '1';
            if (record.funds_type === '1' || record.funds_type === '2') { //资金类型是个人和公共 不能修改 只有他购才能改
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
        },
        {
          title: '科目名称',
          dataIndex: 'subject_id',
          width:'16%',
          render:(text,record) => {
            //如果是办公费，小图标显示办公品
            //科目名称的编辑状态，与阶段无关，只与 状态 有关
            //待审核（2）、审核通过（3）的不能编辑
            let disabledData = record.fill_state_code === '2' || record.fill_state_code === '3'|| fundStageData.report_type !== '1';
            //但是，如果是预填报阶段审核通过的，且是capex的，图标是可以编辑的 待审核（2），审核退回（4）的不能编辑
            let iconDisabled = record.fill_state_code === '2' ||  // 待审核，不是预填报阶段都不能编辑
              record.fill_state_code === '3' ||  //不是预填报阶段填的审核通过了  不能编辑
              fundStageData.report_type !== '1';
            let childRows = record.childRows;
            childRows.map((item,index)=>{item.key = index});
            return (
              <div style={{textAlign:'left'}}>
                <TreeSelect
                  style={{ width: 120 }}
                  value={text}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{width:200}}
                  disabled={disabledData}
                  treeData={feeListTree}
                  onSelect={(value)=>this.changeSelectValue(value,record,'subject_id')}
                />&nbsp;&nbsp;

                {
                  record.boundModalFlag === '1' ?
                    iconDisabled?
                      <Popover
                        title={record.subject_name + '详情'}
                        content={
                          <Table
                            dataSource={childRows}
                            columns={capexIconColumns}
                            className={styles.fillTable}
                            style={{width:'1100px'}}
                            bordered={true}
                            pagination={false}
                          />
                        }
                      >
                        <Icon type='info-circle-o'/>
                      </Popover>
                      :
                      <Icon type='edit' onClick={() => this.showEditModal(record)} style={{cursor: 'pointer'}}/>
                    :
                    null
                }
              </div>
            );
          }
        },
        {
          title: '资金计划',
          dataIndex: 'funds_plan',
          width:'11%',
          render: (text, record) => {
            //预填报阶段（1）
            //待审核（2）和审核通过（3）的不能编辑
            let disabledData = record.fill_state_code === '2' || record.fill_state_code === '3'|| fundStageData.report_type !== '1';
            if (disabledData === true) {
              return (
                <div style={{textAlign:'left',marginLeft:7}}>
                  {change2Thousands(text)}
                </div>
              );
            } else {
              //有弹出框的不能编辑，没有弹出框的可以编辑    boundModalFlag ：  1 capex  2 办公用品 3 其他
              if(record.boundModalFlag === '1'){
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
        },
        {
          title: '预填报状态',
          dataIndex: 'fill_state_code',
          width:'9%',
          render:(text,record)=>stateCodeFill(text,record)
        },
        {
          title: '具体付款事项描述',
          dataIndex: 'spe_pay_description',
          width:'12%',
          render: (text,record) => {
            //待审核（2）、审核通过（3）不能编辑
            let disabledData = record.fill_state_code === '2' || record.fill_state_code === '3' || fundStageData.report_type !== '1';
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
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width:'11%',
          render: (text, record) => {
            //编辑状态，与阶段无关，只与 状态 有关
            //待审核（2）、审核通过（3）不能编辑 不是预填报阶段的不能编辑
            let disabledData = record.fill_state_code === '2' || record.fill_state_code === '3' || fundStageData.report_type !== '1';
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
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width:'11%',
          render: (text, record) => {
            //待审核（2）、审核通过（3）不能编辑
            //审核退回（4）可编辑（删除）
            let disabledData = record.fill_state_code === '2' || record.fill_state_code === '3'|| fundStageData.report_type !== '1';
            if (disabledData === false) {
              return (
                <a onClick={() => this.deletePriorYearFillData(record.key)}>{'删除'}</a>
              );
            }else{
              return (
                <div style={{color:'#B0B0B0'}}>{'删除'}</div>
              );
            }
          },
        }
      ];
    }else if( flag === 'append'){   //所有state_code 都要换成adjust_state_code
      columns = [
        {
          title: '资金类型',
          dataIndex: 'funds_type',
          width:'8%',
          render:(text, record) => {
            //资金类型的编辑状态，与阶段无关，与 状态 和 角色有关   report_type  1 预填报  2 追加 3 调整 4 其他（非填报阶段）
            let disabledData = true;
            //待审核（2）、审核通过（3），的不能编辑,非填报阶段也不能编辑
            if (record.adjust_state_code === '2' || record.adjust_state_code === '3' || fundStageData.report_type === '4' || fundStageData.report_type === '1'|| record.fill_state_code === '3') {
              disabledData = true;
            } else {
              //在编辑的情况下（新增0和保存1），如果当前用户的角色是小组管理员，才能编辑
              disabledData = false;
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
        },
        {
          title: '报销申请人',
          dataIndex: 'apply_userid',
          width:'9%',
          render:(text, record) => {
            //待审核（2）、审核通过（3），的不能编辑   这个是追加阶段 或者调整阶段的
            let disabledData = record.adjust_state_code === '2' || record.adjust_state_code === '3' || fundStageData.report_type === '1' || fundStageData.report_type === '4'|| record.fill_state_code === '3';
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
        },
        {
          title: '科目名称',
          dataIndex: 'subject_id',
          width:'16%',
          render:(text,record) => {
            //如果是办公费，小图标显示办公品
            //科目名称的编辑状态，与阶段无关，只与 状态 有关
            //待审核（2）、审核通过（3），的不能编辑
            let disabledData = record.adjust_state_code === '2' || record.adjust_state_code === '3' || fundStageData.report_type === '4' || fundStageData.report_type === '1'
              || record.fill_state_code === '3';
            //但是，如果是预填报阶段审核通过的，且是办公费或者capex的，图标是可以编辑的
            let iconDisabled = record.adjust_state_code === '2' || record.adjust_state_code === '3'  || fundStageData.report_type === '4' || fundStageData.report_type === '1';
            let childRows = record.childRows;
            childRows.map((item,index)=>{item.key = index});
            return (
              <div style={{textAlign:'left'}}>
                <TreeSelect
                  style={{ width: 120 }}
                  value={text}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{width:200}}
                  disabled={disabledData}
                  treeData={feeListTree}
                  onChange={(value)=>this.changeSelectValue(value,record,'subject_id')}
                />&nbsp;&nbsp;
                {
                  record.boundModalFlag === '1' ?
                    iconDisabled?
                      <Popover
                        title={record.subject_name + '详情'}
                        content={
                          <Table
                            dataSource={childRows}
                            columns={capexIconColumns}
                            className={styles.fillTable}
                            style={{width:'1100px'}}
                            bordered={true}
                            pagination={false}
                          />
                        }
                      >
                        <Icon type='info-circle-o'/>
                      </Popover>
                      :
                      <Icon type='edit' onClick={() => this.showEditModal(record)} style={{cursor: 'pointer'}}/>
                    :
                    null
                }
              </div>
            );
          }
        },
        {
          title: '资金计划',
          dataIndex: 'funds_plan',
          width:'9%',
          render:(text) =>{
            return (
              <div style={{textAlign:'left',marginLeft:7}}>
                {change2Thousands(text)}
              </div>
            );
          }
        },
        {
          title: '填报状态',
          dataIndex: 'fill_state_code',
          width:'8%',
          render:(text,record)=>stateCodeFill(text,record)
        },
        {
          title: '资金计划调整',
          dataIndex: 'funds_diff',
          width:'9%',
          render: (text, record) => {
            //资金计划调整，任何阶段，任何状态下，不能编辑，
            //显示的值 用 调整后资金计划 减去 资金计划，如果调整后资金计划为“”，资金计划调增显示“-”
            if(record.hasOwnProperty('funds_current_amount')){
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
            }
          },
        },
        {
          title: '调整后资金计划',
          dataIndex: 'funds_current_amount',
          width:'9%',
          render: (text, record) => {
            //预填报阶段，状态都不能编辑
            let disabledData = true;
            if (fundStageData.report_type === '1') {
              disabledData = true;
            } else if (fundStageData.report_type === '2' || fundStageData.report_type === '3') { //追加阶段
              //只有预填报审核通过（3），保存（1），新增（0）的可编辑，待审核（2）和审核退回（4）的不能编辑
              //追加阶段的审核通过不能编辑
              //追加阶段如果是capex的（有弹框的），该值不是输入框，通过对话框的值传递过来，即不能编辑
              disabledData = record.adjust_state_code === '2' || record.adjust_state_code === '3'|| record.boundModalFlag === '1' ;
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
        },
        {
          title: '调整阶段状态',
          dataIndex: 'adjust_state_code',
          width:'8%',
          render:(text,record)=>stateCodeFill(text,record)
        },
        {
          title: '具体付款事项描述',
          dataIndex: 'spe_pay_description',
          width:'10%',
          render: (text,record) => {
            //待审核（2）、审核通过（3）不能编辑
            let disabledData = record.adjust_state_code === '2' || record.adjust_state_code === '3'|| fundStageData.report_type === '4' || fundStageData.report_type === '1';
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
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width:'8%',
          render: (text, record) => {
            //编辑状态，与阶段无关，只与 状态 有关
            //待审核（2）、审核通过（3），审核退回（4）的不能编辑
            let disabledData = record.adjust_state_code === '2' || record.adjust_state_code === '3' ||
              fundStageData.report_type === '4' || fundStageData.report_type === '1';
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
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width:'10%',
          render: (text, record) => {
            //编辑状态，与阶段无关，只与 状态 有关
            //待审核（2）、审核通过（3）不能编辑
            //审核退回（4）可编辑（删除）
            let disabledData = record.adjust_state_code === '2' || record.adjust_state_code === '3' || fundStageData.report_type === '4' || fundStageData.report_type === '1';
            if (disabledData === false) {
              if( record.fill_state_code === '3'){  //预填报且审核通过
                return (
                  <a onClick={() => this.clearPriorYearFillData(record.key)}>{'清空'}</a>
                );
              }else{
                return (
                  <a onClick={() => this.deletePriorYearFillData(record.key)}>{'删除'}</a>
                );
              }
            }else{
              return (
                <div style={{color:'#B0B0B0'}}>{'删除'}</div>
              );
            }
          },
        }
      ];
    }
    return (
      <div className={styles.wrap}>
        {
          fundStageData.report_type === '4'?
            /*为4时，不能编辑*/
            <span>
              <Tooltip title={fundStageData.report_type_show}>
                <Button type='primary' disabled={true}>{'新增'}</Button>
              </Tooltip>
            </span>
            :
            <span>
              {fundStageData.report_type === '3'?
                /*调整阶段时，只有小组管理员才能新增*/
                <span>
                  {roleType ==='2' && flag ==='append'?
                    <Button onClick={this.addPriorYearFillData} type='primary'>新增</Button>
                    :
                    <Tooltip title={'该阶段只有小组管理员在调整模块才能新增！'}>
                      <Button type='primary' disabled={true}>{'新增'}</Button>
                    </Tooltip>
                  }
                </span>
                :
                <span>

                  {/*其他阶段*/}
                  {
                    canApplyUserList.length > 0?
                      flag ==='append' && fundStageData.report_type === '2' ||  flag==='pre' && fundStageData.report_type === '1'?
                        <Button onClick={this.addPriorYearFillData} type='primary'>新增</Button>
                        :
                        <Button disabled={true} type='primary'>新增</Button>
                      :
                      <Tooltip title={'当前用户不在小组团队中，请联系小组管理员！'}>
                        <Button type='primary' disabled={true}>{'新增 '}</Button>
                      </Tooltip>
                  }
                </span>
              }
            </span>
        }
        &nbsp;&nbsp;&nbsp;&nbsp;
        {
          fundStageData.report_type === '4'?
            /*为4时，不能编辑*/
            <span>
              <Tooltip title={fundStageData.report_type_show}>
                <Button type='primary' disabled={true}>{COPE_DATA}</Button>
              </Tooltip>
            </span>
            :
            <span>
            {fundStageData.report_type === '3'?
              /*调整阶段时，只有小组管理员才能新增*/
              <span>
                {roleType ==='2' && flag ==='append'?
                  <Button onClick={this.copyPriorYearFillData} type='primary'>{COPE_DATA}</Button>
                  :
                  <Tooltip title={'该阶段只有小组管理员在调整模块才能操作！'}>
                    <Button type='primary' disabled={true}>{COPE_DATA}</Button>
                  </Tooltip>
                }
              </span>
              :
              <span>
                {/*其他阶段*/}
                {
                  canApplyUserList.length > 0?
                    flag ==='append' && fundStageData.report_type === '2' ||  flag==='pre' && fundStageData.report_type === '1'?
                      <Button onClick={this.copyPriorYearFillData} type='primary'>{COPE_DATA}</Button>
                      :
                      <Button disabled={true} type='primary'>{COPE_DATA}</Button>
                    :
                    <Tooltip title={'当前用户不在小组团队中，请联系小组管理员！'}>
                      <Button type='primary' disabled={true}>{COPE_DATA}</Button>
                    </Tooltip>
                }
              </span>
            }
          </span>
        }
        <div style={{margin:'10px 0',position: 'relative'}}>
          <div style={{position: 'absolute',top: '-20px',right: '0',color: 'red'}}>金额单位：元</div>
          <Table
            dataSource={priorYearFillTableData.filter(item => item.opt_type !== 'delete')}
            columns={columns}
            className={styles.fillTable}
            bordered={true}
            pagination={false}
          />
        </div>
        {
          fundStageData.report_type === '4'?
            <Tooltip title={fundStageData.report_type_show}>
              <Button type='primary' disabled={true}>{'保存'}</Button>
            </Tooltip>
            :
            <span>
            {
              fundStageData.report_type === '3'?
                /*调整阶段时，只有小组管理员才能保存*/
                <span>
                {
                  roleType ==='2'&& flag ==='append'?
                    <Button onClick={()=>this.savePriorYearFillData('1','1')} type='primary'>保存</Button>
                    :
                    <Tooltip title={'该阶段只有小组管理员在调整模块才能保存！'}>
                      <Button type='primary' disabled={true}>{'保存'}</Button>
                    </Tooltip>
                }
              </span>
                :
                canApplyUserList.length > 0 ?
                flag ==='append' && fundStageData.report_type === '2' ||  flag==='pre' && fundStageData.report_type === '1'?
                  <Button onClick={()=>this.savePriorYearFillData('1','1')} type='primary'>保存</Button>
                  :
                  <Button disabled={true} type='primary'>保存</Button>
                  :
                  <Tooltip title={'当前用户不在小组团队中，请联系小组管理员！'}>
                    <Button disabled={true} type='primary'>保存</Button>
                  </Tooltip>

            }
          </span>
        }
        &nbsp;&nbsp;&nbsp;&nbsp;
        {
          fundStageData.report_type === '4'?
            <Tooltip title={fundStageData.report_type_show}>
              <Button type='primary' disabled={true}>{'提交'}</Button>
            </Tooltip>
            :
            <span>
            {
              fundStageData.report_type === '3'&& flag ==='append'?
                /*调整阶段时，只有小组管理员才能提交*/
                <span>
                {roleType ==='2'?
                  <Button onClick={()=>this.savePriorYearFillData('2','1')} type='primary'>提交</Button>
                  :
                  <Tooltip title={'该阶段只有小组管理员在调整模块才能提交！'}>
                    <Button type='primary' disabled={true}>{'提交'}</Button>
                  </Tooltip>
                }
              </span>
                :
                canApplyUserList.length > 0 ?
                flag ==='append' && fundStageData.report_type === '2' ||  flag==='pre' && fundStageData.report_type === '1'?
                  // roleType ==='2' || canSubmit === false && roleType !=='2'?  //预算管理员可以多次提交  普通角色如果有审核通过记录 canSubmit === true 不能提交
                  <Button onClick={()=>this.savePriorYearFillData('2','1')} type='primary'>提交</Button>
                  :
                  <Button disabled={true} type='primary'>提交</Button>
                  :
                  <Tooltip title={'当前用户不在小组团队中，请联系小组管理员！'}>
                    <Button disabled={true} type='primary'>保存</Button>
                  </Tooltip>
            }
              <CapexFillAdd fundStageData={this.props.data.fundStageData} ref='capexFillAdd' dispatch={this.props.dispatch} flag={flag} isPriorYear='2'/>
          </span>
        }
      </div>
    );
  }
}
export default PriorYearPreFill;
