/**
 *  作者: 张楠华
 *  创建日期: 2018-2-7
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：项目工时数据统计。
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../../components/employer/employer.less'
import { Button, Tabs,Select,DatePicker,Spin,Table } from 'antd';
import tableStyle from '../../../../components/finance/fundingPlanTable.less'
const TabPane = Tabs.TabPane; //标签组
const Option = Select.Option;
const dateFormat = 'YYYY-MM';
const { MonthPicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class worktimeDataStatistics extends React.Component{

  constructor(props){
    super(props);
    this.state={
      ouPartner:localStorage.ou,
      datePartner:moment(),
      //合作伙伴生成数据
      ouPartnerGenerate : localStorage.ou,
      datePartnerGenerate:moment(),
    }
  }
  //合作伙伴同步tab改变ou
  onchangeDatePickerPartner=(value)=>{
    this.setState({
      datePartner:value
    });
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/queryPartner',
      date:value,
      ou:this.state.ouPartner,
    });
  };
  //合作伙伴同步tab改变ou
  onchangeOUPartner=(value)=>{
    this.setState({
      ouPartner:value,
    });
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/queryPartner',
      date:this.state.datePartner,
      ou:value,
    });
  };
  //合作伙伴生成tab改变年月
  onchangeDatePickerPartnerGenerate=(value)=>{
    this.setState({
      datePartnerGenerate:value
    });
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/queryPartnerGenerate',
      date:value,
      ou:this.state.ouPartnerGenerate,
    });
  };
  //合作伙伴生成tab改变ou
  onchangeOUPartnerGenerate=(value)=>{
    this.setState({
      ouPartnerGenerate:value,
    });
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/queryPartnerGenerate',
      date:this.state.datePartnerGenerate,
      ou:value,
    });
  };
  //切换tab
  queryData=(key)=>{
    if(key === '6'){
      const { dispatch } = this.props;
      dispatch({
        type:'worktimeDataStatistics/queryPartner',
        date:this.state.datePartner,
        ou:this.state.ouPartner,
      });
    }else if(key === '7'){
      const { dispatch } = this.props;
      dispatch({
        type:'worktimeDataStatistics/queryPartnerGenerate',
        date:this.state.datePartnerGenerate,
        ou:this.state.ouPartnerGenerate,
      });
    }
  };
  synPartner=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/synPartner',
      date:this.state.datePartner,
      ou:this.state.ouPartner,
    });
  };
  generatePartner=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/generatePartner',
      date:this.state.datePartnerGenerate,
      ou:this.state.ouPartnerGenerate,
    });
  };
  cancelPartner=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/cancelPartner',
      date:this.state.datePartnerGenerate,
    });
  };
  render() {
    const columns = [
      {
      title: '年月',
      dataIndex: 'year_month',
    },{

      title: '生产编码',
      dataIndex: 'proj_code',
    },
      {
      title: '团队名称',
      dataIndex: 'proj_name',
    },
      {
      title: '外协编号',
      dataIndex: 'user_id',
    },
      {
      title: '外协姓名',
      dataIndex: 'user_name',
    },
      {
      title:'工作量（人日）',
      dataIndex:'work_cnt',
    },
      {
      title:'月化（人月）',
      dataIndex:'work_month',
    },
      {
      title:'同步时间',
      dataIndex:'time_cnt',
    }
    ];
    const columnsListPartner = [
      {
      title: '外协编号',
      dataIndex: 'user_id',
    },{
      title: '外协名称',
      dataIndex: 'user_name',
    },{
      title: '生产编码',
      dataIndex: 'proj_code',
    },{
      title: '团队名称',
      dataIndex: 'proj_name',
    },{
      title: '工作量（人日）',
      dataIndex: 'total_work_time',
    },{
      title:'工作量（人月）',
      dataIndex:'total_work_month',
    },{
      title:'年月',
      dataIndex:'',
      render : (text,record)=>{
        return(<div>{record.this_year+'-'+record.this_month}</div>)
      }
    },{
      title:'同步年月',
      dataIndex:'',
      render : (text,record)=>{
        return(<div>{record.sys_year+'-'+record.sys_month}</div>)
      }
    }, {
      title: '职级',
      dataIndex: 'state_level',
    }];
    const {list,ouList,listPartner} = this.props;
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    if (listPartner.length) {
      listPartner.map((i, index) => {
        i.key = index;
      })
    }
    const ouList1 = ouList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          <Tabs defaultActiveKey="6" onTabClick={this.queryData}>
            <TabPane tab='合作伙伴工时同步' key="6">
              <div style={{textAlign:'left',paddingLeft:'15px',marginBottom:'20px'}}>
                <div style={{display:'inline-block',marginTop:'10px'}}>
                  年月：
                  <MonthPicker
                    onChange={this.onchangeDatePickerPartner}
                    format = {dateFormat}
                    value={this.state.datePartner}
                  />
                </div>
                <span style={{display:'inline-block',paddingLeft:'15px'}}>OU：
                  <Select showSearch style={{ width: 160}}  value={this.state.ouPartner} onSelect={this.onchangeOUPartner} >
                    {ouList1}
                  </Select>
                </span>
                <div style={{display:'inline-block',paddingLeft:'15px'}}>
                  <Button type="primary" onClick={this.synPartner} style={{marginRight:20}}>同步</Button>
                </div>
              </div>
              <Table columns={columns}
                     dataSource={this.props.list}
                     pagination={true}
                     className={tableStyle.financeTable}
              />
            </TabPane>
            <TabPane tab='合作伙伴工时生成' key="7">
              <div style={{textAlign:'left',paddingLeft:'15px',marginBottom:'20px'}}>
                <div style={{display:'inline-block',marginTop:'10px'}}>
                  年月：
                  <MonthPicker
                    onChange={this.onchangeDatePickerPartnerGenerate}
                    format = {dateFormat}
                    value={this.state.datePartnerGenerate}
                  />
                </div>
                <span style={{display:'inline-block',paddingLeft:'15px'}}>OU：
                  <Select showSearch style={{ width: 160}}  value={this.state.ouPartnerGenerate} onSelect={this.onchangeOUPartnerGenerate} >
                    {ouList1}
                  </Select>
                </span>
                <div style={{display:'inline-block',paddingLeft:'15px'}}>
                  <Button type="primary" onClick={this.generatePartner} style={{marginRight:20}} disabled = {this.props.stateCode === '0'?false:true}>生成</Button>
                  <Button type="primary" onClick={this.cancelPartner} style={{marginRight:20}} disabled = {this.props.stateCode === '1'?false:true}>撤销</Button>
                </div>
              </div>
              <Table columns={columnsListPartner}
                     dataSource={this.props.listPartner}
                     pagination={true}
                     className={tableStyle.financeTable}
              />
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    );
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.worktimeDataStatistics,
    ...state.worktimeDataStatistics
  };
}
export default connect(mapStateToProps)(worktimeDataStatistics);
