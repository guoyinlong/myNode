/**
 * 作者：贾茹
 * 创建日期：2019-5-9
 * 邮箱：m18311475903@163.com
 * 文件说明：ERP核心库
 */
import React, { Component } from "react";
import { connect } from 'dva';
import { Input, Select, DatePicker, Spin, Button, Table, Pagination } from 'antd';
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
class DwErp extends React.Component{
    constructor(props){
      super(props);
      this.state = {

      };
    };

  //点击年月改变
  onChangeYearMoment=(value) =>{
    this.props.dispatch({
      type: 'dwErp/onChangeYearMoment',
      value: value
    })
  };

  //点击OU 改变
  handleOUChange=(value)=>{
    /* this.props.OUhandleChange(value);*/
    this.props.dispatch({
      type: "dwErp/handleOUChange",
      value: value
    });
  };
  columns = [
   {
      title: "年月",
      dataIndex: "yearMonth",
      key:"rowkey",
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
      title: "凭证编码",
      dataIndex: "voucherno",
      key:"voucherno",
      width: "200px",
      fixed: 'left',
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    }, {
      title: "成本中心名称",
      dataIndex: "deptName",
      key:"deptName",
      width: "200px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    }, {
      title: "会计科目",
      dataIndex: "feeName",
      key:"feeName",
      width: "300px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "会计科目编码",
      dataIndex: "feeCode",
      key:"feeCode",
      width: "150px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "项目名称",
      dataIndex: "projName",
      key:"projName",
      width: "100px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "项目名称编码",
      dataIndex: "projCode",
      key:"projCode",
      width: "150px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "借方金额",
      dataIndex: "enteredDr",
      key:"enteredDr",
      width: "80px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "贷方金额",
      dataIndex: "enteredCr",
      key:"enteredCr",
      width: "80px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "凭证头描述",
      dataIndex: "headerDesc",
      key:"headerDesc",
      width: "400px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },
  ];

  //点击项目改变
  onChangeProj=(value)=>{
    this.props.dispatch({
      type:"dwErp/onChangeProj",
      value: value
    })
  };
  //获得用户输入的凭证编码值
  handlevouchernoDataChange=(e)=>{
    this.props.dispatch({
      type:"dwErp/handlevouchernoDataChange",
      value: e.target.value
    })
  };
  //获得用户输入的科目编码
  handlekemuDataChange=(e)=>{
    this.props.dispatch({
      type:"dwErp/handlekemuDataChange",
      value: e.target.value
    })
  };

  //获得用户输入的部门名称的值
  handledeptNameDataChange=(e)=>{
    this.props.dispatch({
      type:"dwErp/handledeptNameDataChange",
      value: e.target.value
    })
  };

  //查询数据
  handleSearch=()=>{
    this.props.dispatch({
      type:"dwErp/handlePageClear",
    })
  };

  // 点击页面跳转
  handlePageChange = (page) => {
    this.props.dispatch({
      type:"dwErp/handlePageChange",
      page: page
    })
  };

  // 查询清空
  searchClear = () => {
    this.props.dispatch({
      type:"dwErp/searchClear",
    })
  };
  render (){
    return (
      <Spin tip="加载中" spinning={this.props.loading}>
      <div style={{ padding: '8px',borderRadius: '6px',background: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
        <div>
          <span>
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
          <span style={{marginLeft:'10px'}}>凭证编码：
              <Input value={this.props.vouchernoData} style={{width:'170px'}} onChange={this.handlevouchernoDataChange}/>
          </span>
          <span style={{marginLeft:'10px'}}>科目编码：
              <Input value={this.props.kemuData} style={{width:'170px'}} onChange={this.handlekemuDataChange}/>
          </span>
        </div>
        <div style={{marginTop:'10px'}}>
           <span style={{marginLeft:'10px'}}>部门名称：
              <Input value={this.props.deptNameData} style={{width:'120px'}} onChange={this.handledeptNameDataChange}/>
           </span>
           <span style={{marginLeft:'10px'}}>项目名称：
              <Select showSearch optionFilterProp="children" filterOption={true}   style={{minWidth:'450px'}} value={ this.props.proj }  onChange={this.onChangeProj}>
                {this.props.projs.map((i)=><Option key={i.proj_code} value={i.proj_code} title={i.proj_name}>{i.proj_name}</Option>)}
              </Select>
           </span>
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


         {/* <Button
            type="primary"
            style={{marginLeft:'10px'}}
            onClick={()=>this.erpOutPut(this.columns)}
          >
              导出
          </Button>*/}
        </div>
        <div style = {{ margin: "10px auto" }}>
          <Table
            className = { styles.tableStyle }
            dataSource = { this.props.tableDataSource }
            columns = { this.columns }
            style = {{ marginTop: "20px" }}
            bordered={true}
            scroll={{ x: 1920 }}
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

        {/*//用来导出的表格*/}
       {/* <div id='exportTable'>
          <Table
            className = { styles.tableStyle }
            dataSource = { this.props.tableDataSource }
            columns = { this.columns }
            style = {{ marginTop: "20px", display:'none' }}
            bordered={true}
            pagination={ false }

          />
        </div>*/}
      </div>
      </Spin>
    )
  };
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.dwErp || state.dwErp.loading,
    ...state.dwErp
  };
}
export default connect(mapStateToProps)(DwErp);
