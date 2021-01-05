/**
 *  作者: 张楠华
 *  创建日期: 2018-2-7
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：项目工时数据统计。
 */
import React from 'react';
import {connect } from 'dva';
import { Button,DatePicker,Spin,Table } from 'antd';
import tableStyle from '../../../../components/finance/fundingPlanTable.less'
import Style from './statistic.less'
const dateFormat = 'YYYY-MM';
const { MonthPicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class worktimeYear extends React.Component{

  constructor(props){
    super(props);
    this.state={
      date:moment(),//第一个tab下的时间选择
    }
  }
  generate=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/generate',
      date:this.state.date,
    });
  };
  TimesheetPopulationMonthUndo=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/TimesheetPopulationMonthUndo',
      date:this.state.date,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变年月
   */
  onChangeDatePicker = (value) => {
    this.setState({
      date:value,
    });
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/queryAnnual',
      date:value,
    });
  };
  //导出tab1
  exportMonth=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/exportMonth',
      date:this.state.date,
    });
  };
  //导出tab1
  exportYear=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/exportYear',
      date:this.state.date,
    });
  };
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment().valueOf();
      return value.valueOf() > lastDate
    }
  };
  render() {
    const {columnsAnnual,annualList} = this.props;
    if(annualList.length){
      annualList.map((i,index)=>{
        i.key = index;
      });
    }
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          <div style={{marginTop:'10px'}}>
            年月：
            <MonthPicker
              onChange={this.onChangeDatePicker}
              format = {dateFormat}
              value={this.state.date}
              allowClear={false}
              disabledDate={this.disabledDate}
            />
            <Button type="primary" onClick={this.generate} disabled={ this.props.isCanGenPopulation !== '1'} style={{marginRight:20,marginLeft:20}}>生成</Button>
            <Button type="primary" onClick={this.TimesheetPopulationMonthUndo} disabled={ this.props.isCanGenPopulation === '1'} style={{marginRight:20}}>撤销</Button>
            <Button type="primary" onClick={this.exportMonth} disabled={ this.props.isCanGenPopulation === '1'} style={{marginRight:20}}>导出月化详细</Button>
            <Button type="primary" onClick={this.exportYear} disabled={ this.props.isCanGenPopulation === '1'} style={{marginRight:20}}>导出年化统计</Button>
          </div>
          <div style={{marginTop: '10px'}}>
            <Table columns={columnsAnnual}
                   dataSource={annualList}
                   className={tableStyle.financeTable}
                   pagination={false}
                   scroll={{ x: this.props.scrollAnnual,y:500 }}
            />
          </div>
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
export default connect(mapStateToProps)(worktimeYear);
