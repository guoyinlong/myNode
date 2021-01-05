/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：资金计划填报（包括预填报的和追加的，公用一个入口）
 */
import React from 'react';
import Style from '../../../../components/employer/employer.less'
import CurrentMonthFill from './currentMonthFill';
import PriorYearFill from './priorYearFill';
import {Tabs,Spin} from 'antd';
import styles from './planFill.less';
//import OtherReportType from './../errorPage/otherReportType'
const {TabPane} = Tabs;
class FundingPlanFill extends React.Component{
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div className={Style.wrap}>
        <Spin tip={'加载中'} spinning={this.props.data.loading}>
          <div className={styles.titleStyle}>
            <span>{this.props.data.fundStageData.plan_year}</span><span>{'年'}</span>
            <span>{this.props.data.fundStageData.plan_month}</span><span>{'月资金计划'}</span>
          </div>
          <Tabs>
            <TabPane tab="本月资金计划填报" key="1">
              <CurrentMonthFill
                dispatch={this.props.dispatch}
                data={this.props.data}
                flag={this.props.flag}
              />
              <div style={{color:'red',marginTop:'20px'}}>注：{this.props.data.fundStageData.report_type_show}</div>
            </TabPane>
            <TabPane tab="以前年度应付款填报" key="2">
              <PriorYearFill
                dispatch={this.props.dispatch}
                data={this.props.data}
                flag={this.props.flag}
              />
              <div style={{color:'red',marginTop:'20px'}}>注：{this.props.data.fundStageData.report_type_show}</div>
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }
}
export default FundingPlanFill;
