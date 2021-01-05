/**
 *  作者: 胡月
 *  创建日期: 2017-9-19
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：已立项项目的信息展示主页，包括四部分
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Button,Tabs,Spin} from 'antd';
import styles from './projStartMain.less'
import config from '../../../../utils/config';
import Attachment from './projAttachment.js';
import ProjApproveEditAttachment from './projApproveEditAttachment'
import ProjInfoQuery from './projInfo.js';
import ProjApproveEditProjInfo from './projApproveEditProjInfo'
//import MileInfoQuery from './mileInfo.js';
import ProjMileStone from './projMileStone';
import ProjApproveEditMilestone from './projApproveEditMilestone';
import ProjFullCost from './projFullCost';
import ProjHistoryRecord from './projHistoryRecord';
import ProjApproveEditFullCost from './projApproveEditFullCost';
import { routerRedux } from 'dva/router';
const {TabPane} = Tabs;

/**
 *  作者: 胡月
 *  创建日期: 2017-9-19
 *  功能：项目详情页面（基本信息，里程碑，全成本，附件）
 */
class ProjStartMainPage extends React.Component {

    state = {
        currentTabKey:'1'
    };
    /**
     * 作者：邓广晖
     * 创建日期：2017-10-31
     * 功能：返回项目查询列表
     */
    goBack = ()=> {
        const {dispatch}=this.props;
        dispatch(routerRedux.push({
            pathname: 'projectApp/projStartUp/projList',
            query:this.props.queryData
        }));
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-31
     * 功能：点击审批历史，查看详细
     * @param record 表格一条记录
     */
    handleLogTableClick = (record) => {
        const{dispatch} = this.props;
        dispatch(routerRedux.push({
            pathname: '/taskDetail',
            query:{
                arg_flag:3,    /*0是待审，1是已办，3是办结*/
                arg_check_id:record.check_id
            }
        }));
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-21
     * 功能：tab切换
     * @param key tab的key
     */
    tabChangeClick = (key)=> {
        const {dispatch} = this.props;
        //查询对应tab的数据
        if(key === '1'){
            if(this.props.projInfoShow === 'view'){
                dispatch({
                    type:'projStartMainPage/projectInfoQuery'
                });
            }else{
                //在编辑时，再次点击tab,则重新刷新数据
                dispatch({
                    type:'projStartMainPage/editProjInfoQuery'
                });
            }
        }else if(key === '2'){
            /*dispatch({
              type:'projStartMainPage/mileInfoQuery'
            });*/

            if(this.props.mileInfoShow === 'view'){
                dispatch({
                    type:'projStartMainPage/searchProjMilestone'
                });
            }else{
                //在编辑时，再次点击tab,则重新刷新数据
                dispatch({
                    type:'projStartMainPage/clickMilestoneEditIcon'
                });
            }
        }else if(key === '3'){
            if(this.props.fullCostShow === 'view'){
                dispatch({
                    type:'projStartMainPage/searchProjFullcostTab'
                });
            }else{
                //在编辑时，再次点击tab,则重新刷新数据
                dispatch({
                    type:'projStartMainPage/editFullCostQuery'
                });
            }
        }else if(key === '4'){
            if(this.props.attachShow === 'view'){
                dispatch({
                    type:'projStartMainPage/searchNewAddAttachment'
                });
            }else{
                //在编辑时，再次点击tab,则重新刷新数据
                dispatch({
                    type:'projStartMainPage/editAttachmentQuery'
                });
            }
        }else if(key === '5'){
            dispatch({
                type:'projStartMainPage/searchCheckLogList'
            });
        }else if(key === '6'){
            dispatch({
                type:'projStartMainPage/searchHistoryInit'
            });
        }
        //切换tab
        this.setState({
            currentTabKey:key
        });
    };

    checkLogColumns = [
        {
            title: '序号',
            dataIndex:'',
            width: '6%',
            render:(text,record,index)=>{return index + 1;}
        },{
            title:'状态',
            dataIndex:'current_state',
            width: '7%',

        },{
            title: '环节名称',
            dataIndex:'current_link_name',
            width: '13%'
        },{
            title: '审批人',
            dataIndex: 'current_link_username',
            width: '8%',
        },{
            title: '审批类型',
            dataIndex: 'current_opt_flag_show',
            width: '6%',
        },{
            title: '审批意见',
            dataIndex: 'current_opt_comment',
            width: '28%',
            render: (text, record, index) => {
                if(record.current_opt_flag !== '1'){
                    return <div style={{textAlign:'left'}}>{text}</div>
                }else{
                    return null
                }
            }
        },{
            title: '审批时间',
            dataIndex: 'current_opt_handle_time',
            width: '12%',
        }
    ];

    render() {
        const {dispatch,projectInfo} = this.props;
        const operations = <Button type="primary"  style={{marginRight:'10px'}} onClick={this.goBack}>返回</Button>;
        let goBackButtonIsShow = this.props.tab1IsDisabled === false && this.props.tab2IsDisabled === false &&
            this.props.tab3IsDisabled === false && this.props.tab4IsDisabled === false &&
            this.props.tab5IsDisabled === false && this.props.tab6IsDisabled === false;
        return (
            <Spin tip={config.IS_LOADING} spinning={this.props.loading}>
                <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
                    {(projectInfo) ?
                        <div className="header" style={{marginBottom:12}}>
                            <h3 style={{fontWeight:600,fontSize:'25px',textAlign:'center',marginBottom:20,padding:0}}>{projectInfo.proj_name}</h3>
                        </div>
                        :
                        ''
                    }
                    <Tabs
                        tabBarExtraContent={goBackButtonIsShow ? operations : ''}
                        activeKey={this.state.currentTabKey}
                        onTabClick={this.tabChangeClick}
                    >
                        <TabPane tab="基本信息" key="1" disabled={this.props.tab1IsDisabled}>
                            {this.props.projInfoShow === 'view' ?
                                <ProjInfoQuery 
                                    ref="projInfoQuery"
                                    dispatch={this.props.dispatch}
                                    projectInfo={this.props.projectInfo}
                                    replaceMoneyList={this.props.replaceMoneyList}
                                    projInfoEditFlag={this.props.projInfoEditFlag}
                                    projInfoEditVal={this.props.projInfoEditVal}
                                    projInfoChgModal={this.props.projInfoChgModal}
                                    pms_list={this.props.pms_list}
                                />
                                :
                                <ProjApproveEditProjInfo
                                    dispatch={this.props.dispatch}
                                    projOldInfo={this.props.projOldInfo}
                                    mainProjList={this.props.mainProjList}
                                    projTypeList={this.props.projTypeList}
                                    projInfoEditFlag={this.props.projInfoEditFlag}
                                    projInfoEditVal={this.props.projInfoEditVal}
                                    projInfoLimit={this.props.projInfoLimit}
                                    pms_list={this.props.pms_list}
                                    key={this.props.basicInfoUuid}
                                />
                            }
                        </TabPane>
                        <TabPane tab="里程碑" key="2" disabled={this.props.tab2IsDisabled}>
                            {this.props.mileInfoShow === 'view'?
                                <ProjMileStone
                                    dispatch={this.props.dispatch}
                                    mileInfoList={this.props.mileInfoList}
                                    mileInfoEditFlag={this.props.mileInfoEditFlag}
                                    mileInfoEditVal={this.props.mileInfoEditVal}
                                    mileInfoShow={this.props.mileInfoShow}
                                    mileInfoChgModal={this.props.mileInfoChgModal}
                                >
                                </ProjMileStone>
                                :
                                <ProjApproveEditMilestone
                                    dispatch={this.props.dispatch}
                                    mileInfoList={this.props.mileInfoList}
                                    mileInfoListOriginal={this.props.mileInfoListOriginal}
                                    mileInfoEditFlag={this.props.mileInfoEditFlag}
                                    mileInfoEditVal={this.props.mileInfoEditVal}
                                    fore_workload={this.props.fore_workload}
                                    remainWorkLoad={this.props.remainWorkLoad}
                                    begin_time={this.props.begin_time}
                                    end_time={this.props.end_time}
                                    deliverableCategoryList={this.props.deliverableCategoryList}
                                    queryData={this.props.queryData}
                                >
                                </ProjApproveEditMilestone>
                            }
                        </TabPane>
                        <TabPane tab="全成本" key="3" disabled={this.props.tab3IsDisabled}>
                            {this.props.fullCostShow === 'view'?
                                <ProjFullCost
                                    fullCostPmsTab={this.props.fullCostPmsTab}
                                    fullCostShowPmsTab={this.props.fullCostShowPmsTab}
                                    fullCostPmsListData={this.props.fullCostPmsListData}
                                    coorpDeptList={this.props.coorpDeptList}
                                    deptBudgetTableData={this.props.deptBudgetTableData}
                                    allDeptList={this.props.allDeptList}
                                    predictTimeTotal={this.props.predictTimeTotal}
                                    fullCostEditFlag={this.props.fullCostEditFlag}
                                    fullCostEditVal={this.props.fullCostEditVal}
                                    fullCostChgModal={this.props.fullCostChgModal}
                                    dispatch={this.props.dispatch}
                                    from_page={"start"}
                                    />
                                :
                                <ProjApproveEditFullCost
                                    ref="projApproveEditFullCost"
                                    dispatch={dispatch}
                                    coorpDeptList={this.props.coorpDeptList}
                                    deptBudgetTableData={this.props.deptBudgetTableData}
                                    allDeptList={this.props.allDeptList.filter(item => item.opt_type !== 'delete')}
                                    purchaseAllCostList={this.props.purchaseAllCostList}
                                    operateAllCostList={this.props.operateAllCostList}
                                    carryOutAllCostList={this.props.carryOutAllCostList}
                                    yearListRowSpan={this.props.yearListRowSpan}
                                    fullCostYearList={this.props.fullCostYearList}
                                    yearList={this.props.yearList}
                                    predictTimeTotal={this.props.predictTimeTotal}
                                    deptBudgetList={this.props.deptBudgetList}
                                    fullCostEditFlag={this.props.fullCostEditFlag}
                                    fullCostEditVal={this.props.fullCostEditVal}
                                    verifierData={this.props.verifierData}
                                    verifierDataRel={this.props.verifierDataRel}
                                />
                            }
                        </TabPane>
                        <TabPane tab="附件" key="4" disabled={this.props.tab4IsDisabled}>
                            {this.props.attachShow === 'view'?
                                <Attachment
                                    attachmentList={this.props.attachmentList}
                                    attachEditFlag={this.props.attachEditFlag}
                                    attachEditVal={this.props.attachEditVal}
                                    dispatch={this.props.dispatch}
                                />
                                :
                                <ProjApproveEditAttachment
                                    attachmentList={this.props.attachmentList}
                                    dispatch={this.props.dispatch}
                                    loading={this.props.loading}
                                />
                            }
                        </TabPane>
                        <TabPane tab="审批记录" key="5" disabled={this.props.tab5IsDisabled}>
                            <Table
                                columns={this.checkLogColumns}
                                dataSource={this.props.checkLogList}
                                pagination={false}
                                className={styles.checkLogTable}
                                /*onRowClick={this.handleLogTableClick}*/
                            />
                        </TabPane>
                        <TabPane tab="历史记录" key="6" disabled={this.props.tab6IsDisabled}>
                            <ProjHistoryRecord
                                dispatch={this.props.dispatch}
                                searchModule={this.props.searchModule}
                                searchDeptValue={this.props.searchDeptValue}
                                searchDeptList={this.props.searchDeptList}
                                searchChangeItemValue={this.props.searchChangeItemValue}
                                searchChangeItemList={this.props.searchChangeItemList}
                                historyPage={this.props.historyPage}
                                historyRowCount={this.props.historyRowCount}
                                historyList={this.props.historyList}
                                historyTableLoad={this.props.historyTableLoad}
                                loading={this.props.loading}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </Spin>
        );
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.projStartMainPage,
        ...state.projStartMainPage
    };
}

export default connect(mapStateToProps)(ProjStartMainPage);
