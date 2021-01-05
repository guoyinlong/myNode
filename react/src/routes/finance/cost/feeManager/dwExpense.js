/**
 * 作者：贾茹
 * 创建日期：2019-5-9
 * 邮箱：m18311475903@163.com
 * 文件说明：报账系统
 */
import React, { Component } from "react";
import { connect } from 'dva';
import { Input,Select,DatePicker,Button,Table, Spin, Pagination } from 'antd';
import styles from './dw.less';
/*import exportExl  from "../../../../components/commonApp/exportExl.js";*/

const Option = Select.Option;
const { MonthPicker} = DatePicker;
// 定义你需要的时间格式
const monthFormat = 'YYYY-MM';

/*@connect(({ dwErp, loading }) => ({
  ...dwErp,
  loading: loading.models.dwErp,
}))*/
class DwExpense extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  };
  //点击OU 改变
  handleOUChange=(value)=>{
    /* this.props.OUhandleChange(value);*/
    this.props.dispatch({
      type: "dwExpense/handleOUChange",
      value: value
    });
  };
  //点击类别下的option的值传给model
  handleTypeChange=(value)=>{
    /* this.props.OUhandleChange(value);*/
    this.props.dispatch({
      type: "dwExpense/handleTypeChange",
      value: value
    });
  };

  //点击年月改变
  onChangeYearMoment=(value) =>{
    this.props.dispatch({
      type: 'dwExpense/onChangeYearMoment',
      value: value
    })
  };

  //获得用户输入的报账单编号
  claimNoDataChange=(e)=>{
    this.props.dispatch({
      type:"dwExpense/claimNoDataChange",
      value: e.target.value
    })
  };

  //获得用户输入的部门名称的值
  handledeptNameDataChange=(e)=>{
    this.props.dispatch({
      type:"dwExpense/handledeptNameDataChange",
      value: e.target.value
    })
  };

  //查询数据
  handleSearch=()=>{
    this.props.dispatch({
      type:"dwExpense/handlePageClear",
    })
  };

  // 点击页面跳转
  handlePageChange = (page) => {
    this.props.dispatch({
      type:"dwExpense/handlePageChange",
      page: page
    })
  };

  // 查询清空
  searchClear = () => {
    this.props.dispatch({
      type:"dwExpense/searchClear",
    })
  };
  //点击导出表格
/*  erpOutPut=()=>{
    /!* console.log(this.props.yearmoment);*!/
    let tab = document.querySelector(`#exportTable table`);
    /!* let oDate=new Date(this.props.yearmoment);*!/
    /!*   let yearData = oDate.getFullYear();
       let monthData = oDate.getMonth() + 1;*!/
    /!*let time=oDate.getFullYear();*!/
    let erpName = '报账单';
    exportExl()(tab,erpName);
  };*/

  columns = [
    {
      title: "申请年月",
      dataIndex: "yearMonth",
      key:"yearMonth",
      width: "80px",
      fixed: "left",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    }, {
      title: "主建单位",
      dataIndex: "ouName",
      key:"ouName",
      width: "180px",
      fixed: 'left',
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    }, {
      title: "报账单编号",
      dataIndex: "CLAIM_NO",
      key:"CLAIM_NO",
      width: "200px",
      fixed: 'left',
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    }, {
      title: "摘要",
      dataIndex: "REMARK",
      key:"REMARK",
      width: "300px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    }, {
      title: "部门名称",
      dataIndex: "deptName",
      key:"deptName",
      width: "200px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "申请人",
      dataIndex: "userName",
      key:"userName",
      width: "100px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "业务大类名称",
      dataIndex: "busName",
      key:"busName",
      width: "180px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "申请金额",
      dataIndex: "APPLY_AMOUNT",
      key:"APPLY_AMOUNT",
      width: "100px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "已付金额",
      dataIndex: "PAY_AMOUNT",
      key:"PAY_AMOUNT",
      width: "100px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "未付金额",
      dataIndex: "UNPAID_AMOUNT",
      key:"UNPAID_AMOUNT",
      width: "100px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "流程名称",
      dataIndex: "processName",
      key:"processName",
      width: "100px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },
  ];
  render (){
    return (
      <Spin tip="加载中" spinning={this.props.loading}>
      <div style={{ padding: '8px',borderRadius: '6px',background: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
        <div>
           <span style={{marginLeft:'10px'}}>类别：
              <Select style={{minWidth:'135px'}} value={ this.props.type } onChange={this.handleTypeChange}>
                  <Option key='员工报账单'>员工报账单</Option>
                  <Option key='日常业务报账单'>日常业务报账单</Option>
                  <Option key='总账支付报账单'>总账支付报账单</Option>
              </Select>
          </span>
          <span style={{marginLeft:'10px'}}>年月：
              <MonthPicker
                value={this.props.yearmoment}
                format={monthFormat}
                onChange={this.onChangeYearMoment}
              />
          </span>
          <span style={{marginLeft:'10px'}}>主建单位/OU：
              <Select style={{minWidth:'165px'}} value={ this.props.OUCode } onChange={this.handleOUChange}>
                {this.props.OUnamecodes.map((i)=><Option key={i.ou_code} value={i.ou_code}>{i.ou_name}</Option>)}
              </Select>
          </span>
          <span style={{marginLeft:'10px'}}>报账单编号：
              <Input value={this.props.claimNoData} style={{width:'170px'}} onChange={this.claimNoDataChange}/>
          </span>

        </div>
        <div style={{marginTop:'10px'}}>
           <span style={{marginLeft:'10px'}}>部门名称：
              <Input value={this.props.deptNameData} style={{width:'250px'}} onChange={this.handledeptNameDataChange}/>
           </span>
          {/* <Button
              type="primary"
              style={{marginLeft:'10px',marginRight:'30px',float:'right'}}
              onClick={()=>this.erpOutPut()}
           >
             导出
           </Button>*/}

          <Button
            type="primary"
            style={{float:'right'}}
            onClick={this.searchClear}
          >
            清空
          </Button>
           <Button
              type="primary"
              style={{marginRight:'10px',float:'right'}}
              onClick={this.handleSearch}
           >
              查询
           </Button>
        </div>
        <div style = {{ margin: "10px auto" }}>
          <Table
            className = { styles.tableStyle }
            dataSource = { this.props.tableDataSource }
            columns = { this.columns }
            style = {{ marginTop: "20px" }}
            bordered={true}
            scroll={{ x: 1640 }}
            pagination={ false }
          />
        </div>
        {this.props.loading !== true?
          <div className={styles.page}>
            <Pagination
              current={Number(this.props.pageCurrent)}
              total={Number(this.props.pageDataCount)}
              pageSize={10}
              onChange={(page) => this.handlePageChange(page, "")}
            />
          </div>
          :
          null
        }
       {/* <div id='exportTable'>
          <Table
            className = { styles.tableStyle }
            dataSource = { this.props.tableDataSource.filter((i,index)=>index<100) }
            columns = { this.columns }
            style = {{ marginTop: "20px", display:'none' }}
            bordered={true}
            pagination={ false }
          />
        </div>*/}
      </div>
      </Spin>
    );
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.dwExpense || state.dwExpense.loading,
    ...state.dwExpense
  };
}
export default connect(mapStateToProps)(DwExpense);


