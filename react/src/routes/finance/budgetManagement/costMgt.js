/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：科目（费用项，dw科目）列表界面
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../components/employer/employer.less';
import tableStyle from '../../../components/finance/table.less'
import { Spin,Table,Popconfirm,Button,Switch,Modal,Tabs } from "antd";
import EditBudget from './budgetMgt/editBudget';
import AddBudget from './budgetMgt/addBudget';
import ConfigRule from './budgetMgt/configRule';
import DWListMgt from './budgetMgt/dwList';
import DeptListMgt from './budgetMgt/deptListMgt';
const TabPane = Tabs.TabPane;
import Cookies from 'js-cookie';
const confirm = Modal.confirm; //确认框
class CostMgt extends React.Component{
  constructor(props){
    super(props)
  }
  changeSwitch =(check,record)=>{
    const {dispatch}=this.props;
    let text = check?'开启':'关闭';
    let editData = {
      arg_fee_id:record.fee_id,
      arg_fee_name:record.fee_name,
      arg_fee_index:record.fee_index,
      arg_fee_use_id:record.fee_use_id?record.fee_use_id:'',
      arg_fee_type:record.fee_type,
      arg_is_default:record.is_default ==='true'?'1':'0',
      arg_concentration_fee_id:record.concentration_fee_id?record.concentration_fee_id:'',
      arg_state_code:check?'1':'0',
      arg_user_id:Cookies.get('userid'),
    };
    confirm({
      title: '确认更改？',
      content: '要 ' + text + ' ' + record.fee_name + ' 吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        //将要更改的数据传给models层.
        dispatch({
          type:'costMgt/editExpenseAccount',
          editData,
        });
      },
      onCancel() {
        console.log('取消更改');
      },
    });
  };
  showDeleteConfirm = (record) => { //删除确认框
    const {dispatch} = this.props;
    dispatch({
      type: 'costMgt/delExpenseAccount',
      feeId:record.fee_id,
    });
  };
  onChangeTabs=(key)=> {
    const {dispatch} = this.props;
    if(key === '2'){
      dispatch({
        type: 'costMgt/queryDWList',
      });
    }
    if( key === '3'){
      dispatch({
        type: 'costMgt/queryDeptList',
        ou:Cookies.get('OUID')+','+Cookies.get('OU'),
      });
    }
  };
  render() {
    const {list} = this.props;
    let columns = [];
    columns.push(
      {
        title: '序号',
        width: 150,
        dataIndex: 'key',
      },
      {
        title: '费用项名称',
        key: 'fee_name',
        dataIndex: 'fee_name',
        render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      },
      {
        title: '费用项等级',
        key: 'fee_level',
        dataIndex: 'fee_level',
      },
      {
        title: '费用用途',
        key: 'fee_use_name',
        dataIndex: 'fee_use_name',
        render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      },
      {
        title: '归口费用',
        key: 'concentration_fee_name',
        dataIndex: 'concentration_fee_name',
        render:(text)=>{return(<div style={{textAlign:'left'}}>{text}</div>)}
      },
      {
        title: '费用类型',
        key: 'fee_type',
        dataIndex: 'fee_type',
        render:(text)=>{
          return(
            <div>
              {text === '1'?'资本化前费用':text === '2'?'资本化后费用':text === '3'?'归集费用':''}
            </div>
          )
        }
      },
      {
        title: '操作',
        key: '',
        dataIndex: '',
        width:'280px',
        render: (text,record) => {
          if( record.fee_level ==='1'){
            return (
              <div style={{textAlign:'center'}}>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={record.state_code === '1'}
                  onChange={(check) => this.changeSwitch(check,record)}
                />&nbsp;&nbsp;
                <Button
                  type="primary"
                  size='small'
                  onClick={() => this.refs.editBudget.showModal(record)}>
                  {'编辑'}
                </Button>&nbsp;&nbsp;
                <Popconfirm title={'要删除 ' + record.fee_name + ' 吗？'} onConfirm= {() => this.showDeleteConfirm(record)}>
                  <Button
                    size='small'
                    type="primary">
                    {'删除'}
                  </Button>
                </Popconfirm>
                &nbsp;&nbsp;
                <Button
                  type="primary"
                  size='small'
                  onClick={() => this.refs.addBudget.showModal(record)}>
                  {'新增'}
                </Button>
              </div>
            )
          }else{
            return (
              <div style={{textAlign:'center'}}>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={record.state_code === '1'}
                  onChange={(check) => this.changeSwitch(check,record)}
                />&nbsp;&nbsp;
                <Button
                  type="primary"
                  size='small'
                  onClick={() => this.refs.editBudget.showModal(record)}>
                  {'编辑'}
                </Button>&nbsp;&nbsp;
                <Popconfirm title={'确定要删除吗？'} onConfirm= {() => this.showDeleteConfirm(record)}>
                  <Button
                    size='small'
                    type="primary">
                    {'删除'}
                  </Button>
                </Popconfirm>
                &nbsp;&nbsp;
                <Button
                  type="primary"
                  size='small'
                  onClick={() => this.refs.configRule.showModal(record)}>
                  {'配置规则'}
                </Button>
              </div>
            )
          }

        }
      }
    );
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={Style.wrap}>
            <Tabs defaultActiveKey="1" onChange={this.onChangeTabs}>
              <TabPane tab="费用科目维护" key="1">
                  <div style={{height:'35px'}}>
                    <Button type="primary" style={{float:'right'}} onClick={() => this.refs.addBudget.showModal({fee_level:'0'})}>新增</Button>
                  </div>
                  <Table className={tableStyle.financeTable} columns={columns} dataSource={list} indentSize={6}/>
                  <EditBudget ref="editBudget" dispatch={this.props.dispatch} data={this.props}/>
                  <AddBudget ref='addBudget' dispatch={this.props.dispatch} data={this.props}/>
                  <ConfigRule ref='configRule' data={this.props} dispatch={this.props.dispatch}/>
              </TabPane>
              <TabPane tab="DW科目维护" key="2">
                <DWListMgt ref="DWListMgt" dispatch={this.props.dispatch} data={this.props}/>
              </TabPane>
              <TabPane tab="部门维护" key="3">
                <DeptListMgt ref="deptMgt" dispatch={this.props.dispatch} data={this.props}/>
              </TabPane>
            </Tabs>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.costMgt,
    ...state.costMgt
  };
}
export default connect(mapStateToProps)(CostMgt);
