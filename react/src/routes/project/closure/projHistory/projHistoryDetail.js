/**
 *  作者: 夏天
 *  创建日期: 2018-9-17
 *  邮箱：1348744578@qq.com
 *  文件说明：历史项目-详细
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import SquareTab from './module/squareTab';
import ProjInfo from './module/projInfo';
import TeamQuery from './module/teamQuery';
import ProjPlan from './module/projPlan';
import ProjWeekReport from './module/projWeekReport';
import ProjMonthReport from './module/projMonthReport';
import RiskTrack from './module/riskTrack';
import ProblemTrack from './module/problemTrack';
import ProjDelivery from './module/projDelivery';
import { getUuid } from '../../../../models/project/closure/projHistory/publicFunc';


class ProjHistoryDetail extends React.Component {
    /**
     * 作者：夏天
     * 创建日期：2018-9-17
     * 功能：tab变化
     * @params key tab的key
     */
    changeSquareTabs = (key) => {
        this.props.dispatch({
            type: 'projHistoryDetail/changeSquareTabs',
            key,
            
        });
    };
    /**
     * 功能：返回项目历史列表页面
     */
    goBack = () => {
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
            pathname: 'projectApp/projClosure/historyProject',
            query: this.props.query,
        }));
    };
    render() {
        return (
            <Spin spinning={this.props.loading}>
                <div style={{ paddingTop: 13, paddingBottom: 16, paddingLeft: 20, paddingRight: 20, background: 'white' }}>
                    <p style={{ fontWeight: 600, fontSize: '25px', textAlign: 'center', marginBottom: 20, padding: 0 }}>
                        {this.props.projectInfo.proj_name}
                    </p>
                    <div style={{ textAlign: 'right', marginBottom: 5 }}>
                        <Button
                            type="primary"
                            onClick={() => this.goBack()}
                        >
                            返回
                        </Button>
                    </div>
                    <div>
                        <SquareTab
                            activeKey={this.props.squareTabKey}
                            onTabsClick={this.changeSquareTabs}
                        >
                            <div name="项目信息" value="projInfo">
                                <ProjInfo
                                    dispatch={this.props.dispatch}
                                    // projOldInfo={this.props.projOldInfo}
                                    // 基本信息
                                    replaceMoneyList={this.props.replaceMoneyList}
                                    projectInfo={this.props.projectInfo}
                                    pms_list={this.props.pms_list}
                                    // 里程碑
                                    mileInfoList={this.props.mileInfoList}
                                    fore_workload={this.props.fore_workload}
                                    // 全成本
                                    coorpDeptList={this.props.coorpDeptList}
                                    deptBudgetTableData={this.props.deptBudgetTableData}
                                    allDeptList={this.props.allDeptList}
                                    fullCostPmsListData={this.props.fullCostPmsListData}
                                    predictTimeTotal={this.props.predictTimeTotal}
                                    // 附件
                                    // display={this.props.display}
                                    attachmentList={this.props.attachmentList}
                                    proj_id={this.props.proj_id}
                                    fullCostShowPmsTab={this.props.fullCostShowPmsTab}
                                    fullCostPmsTab={this.props.fullCostPmsTab}
                                />
                            </div>
                            <div name="团队查询" value="teamQuery">
                                <TeamQuery
                                    teamList={this.props.teamList}
                                />
                            </div>
                            <div name="项目计划" value="projPlan">
                                <ProjPlan
                                    dispatch={this.props.dispatch}
                                    projPlanList={this.props.projPlanList}
                                    projPlanDoc={this.props.projPlanDoc}
                                    arg_ppd_doc_type={this.props.arg_ppd_doc_type}
                                />
                            </div>
                            <div name="周报月报" value="weekMonth">
                                {this.props.weekOrMonth ?
                                    <ProjWeekReport
                                        key={getUuid(32, 64)}
                                        dispatch={this.props.dispatch}
                                        weekOrMonth={this.props.weekOrMonth}
                                        collapsePanelList={this.props.collapsePanelList}
                                        oneYearMonthStart={this.props.oneYearMonthStart}
                                        oneYearMonthEnd={this.props.oneYearMonthEnd}
                                        monthHaveReport={this.props.monthHaveReport}
                                        dateTableList={this.props.dateTableList}
                                        monthTabIndex={this.props.monthTabIndex}
                                        tableDataLoadSpin={this.props.tableDataLoadSpin}
                                    />
                                    :
                                    <ProjMonthReport
                                        dispatch={this.props.dispatch}
                                        projId={this.props.projId}
                                        earnData={this.props.earnData}
                                        mileStoneList={this.props.mileStoneList}
                                        purchaseCostTypeList={this.props.purchaseCostTypeList}
                                        operateCostTypeList={this.props.operateCostTypeList}
                                        carryOutCostTypeList={this.props.carryOutCostTypeList}
                                        workPlanThisMonth={this.props.workPlanThisMonth}
                                        workPlanNextMonth={this.props.workPlanNextMonth}
                                        mileStoneFinishState={this.props.mileStoneFinishState}
                                        mileDataLoading={this.props.mileDataLoading}
                                        purchaseCostTableData={this.props.purchaseCostTableData}
                                        operateCostTableData={this.props.operateCostTableData}
                                        carryOutCostTableData={this.props.carryOutCostTableData}
                                        humanCostData={this.props.humanCostData}
                                        shareCostThis={this.props.shareCostThis}
                                        shareCostAll={this.props.shareCostAll}
                                        staffTotalLast={this.props.staffTotalLast}
                                        staffTotalThis={this.props.staffTotalThis}
                                        staffTotalChange={this.props.staffTotalChange}
                                        costOffset={this.props.costOffset}
                                        progressOffset={this.props.progressOffset}
                                        mark={this.props.mark}
                                    />
                                }
                            </div>
                            <div name="风险跟踪" value="riskTrack">
                                <RiskTrack
                                    dispatch={this.props.dispatch}
                                    riskTrackList={this.props.riskTrackList}
                                    riskTrackDetail={this.props.riskTrackDetail}
                                />
                            </div>
                            <div name="问题跟踪" value="problemTrack">
                                <ProblemTrack
                                    dispatch={this.props.dispatch}
                                    loading={this.props.loading}
                                    problemTrackList={this.props.problemTrackList}
                                    problemTrackDetail={this.props.problemTrackDetail}
                                />
                            </div>
                            <div name="项目结项" value="projDelivery">
                                <ProjDelivery
                                    projDeliveryList={this.props.projDeliveryList}
                                />
                            </div>
                        </SquareTab>
                    </div>
                </div>
            </Spin>
        );
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.projHistoryDetail,
        ...state.projHistoryDetail,
    };
}

export default connect(mapStateToProps)(ProjHistoryDetail);
