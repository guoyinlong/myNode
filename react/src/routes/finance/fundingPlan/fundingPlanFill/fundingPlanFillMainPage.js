/**
 * 作者：邓广晖
 * 日期：2018-03-14
 * 邮箱：denggh6@chinaunicom.cn
 * 文件说明：资金计划填报
 */
import React from 'react';
import {connect} from 'dva';
import CurrentMonthFill from './currentMonthFill';
import PriorYearFill from './priorYearFill';
import {Tabs,Spin,Button} from 'antd';
import styles from './planFill.less';
import config from '../../../../utils/config';
const {TabPane} = Tabs;

/**
 *  作者: 邓广晖
 *  创建日期: 2018-03-14
 *  功能：资金计划填报主页
 */
class FundingPlanFillMainPage extends React.PureComponent{

  render() {

    return (
      <Spin tip={config.IS_LOADING} spinning={this.props.loading}>
        <div>
          <div className={styles.titleStyle}>
            <span>{this.props.fundStageData.plan_year}</span><span>{'年'}</span>
            <span>{this.props.fundStageData.plan_month}</span><span>{'月资金计划'}</span>
          </div>
          <Tabs >
            <TabPane tab="本月资金计划填报" key="1">
              <CurrentMonthFill
                dispatch={this.props.dispatch}
                fundStage={this.props.fundStageData.report_type}
                fundStageData={this.props.fundStageData}
                roleType={this.props.roleType}
                currentMonthFillTableData={this.props.currentMonthFillTableData}
                canApplyUserList={this.props.canApplyUserList}
                feeList={this.props.feeList}
                feeListTree={this.props.feeListTree}
                officeStationery={this.props.officeStationery}
                ordinalStationery={this.props.ordinalStationery}
              />
            </TabPane>
            <TabPane tab="以前年度应付款填报" key="2">
              <PriorYearFill
                dispatch={this.props.dispatch}
                fundStage={this.props.fundStageData.report_type}
                fundStageData={this.props.fundStageData}
                roleType={this.props.roleType}
                priorYearFillTableData={this.props.priorYearFillTableData}
                canApplyUserList={this.props.canApplyUserList}
                feeList={this.props.feeList}
                feeListTree={this.props.feeListTree}
                officeStationery={this.props.officeStationery}
                ordinalStationery={this.props.ordinalStationery}
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
    loading:state.loading.models.fundingPlanFill,
    ...state.fundingPlanFill
  };
}
export default connect(mapStateToProps)(FundingPlanFillMainPage);
