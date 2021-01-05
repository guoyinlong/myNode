/**
 * 作者：胡月
 * 创建日期：2017-11-6
 * 邮件：huy61@chinaunicom.cn
 * 文件说明：实现项目变更申请
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Tabs, Input, Modal, message, Spin, Popconfirm} from 'antd';
import ChangeReason from './changeReason';
import ProjChangeInfo from './projChangeInfo.js';
import ProjChangeExamingInfo from './projChangeExamingInfo.js';
import MileStone from './mileStone.js';
import ProjChangeFullCost from './projChangeFullCost';
import {routerRedux} from 'dva/router';
import {CHECK_INFO_RULE} from '../../../projConst.js';
import Cookie from 'js-cookie';
import config from '../../../../../utils/config';

import GoBackModal from '../../../startup/projAdd/goBackModal';
import TabChangeModal from '../../../startup/projAdd/tabChangeModal';
//import StartSubmitModal from '../../../startup/projAdd/startSubmitModal';


const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
const confirm = Modal.confirm;

/**
 * 作者：胡月
 * 创建日期：2017-11-6
 * 功能：变更申请主页面
 */
class ApplyMainPage extends React.PureComponent {
    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：直接处理tab切换，不加任何处理
     * @param key tab的key
     * @param flag 弹出模态框标记
     */
    directTabChangeClick = (key, flag) => {
        this.props.dispatch({
            type: 'projChangeApply/tabChangeClick',
            key: key,
            flag: flag
        });
    };
    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：处理tab切换
     * @param key tab的key
     */
    tabChangeClick = (key) => {
        //如果是审核中的，直接切换
        if (this.props.projChangeCheckFlag === '1') {
            this.directTabChangeClick(key, 'cancel');
        } else {
            const {currentTabKey} = this.props;
            //如果点击的是当前tab不起作用
            if (key !== currentTabKey) {
                if (currentTabKey === 't1') {
                    let {projData, pmsData, formIsRight, pmsDataIsRight} = this.refs.projChangeInfo.getBasicInfoData();
                    if (formIsRight === '1' && pmsDataIsRight === '1') {
                        //在切换保存时，判断变化了才保存
                        if (JSON.stringify(projData) === '{}' && pmsData.length === 0) {
                            this.directTabChangeClick(key, 'cancel');
                        } else {
                            this.refs.tabChangeModal.showModal(currentTabKey, key);
                        }
                    }
                }
                else if (currentTabKey === 't2') {
                    const array_milestone = this.refs.mileStone.getMileStoneInfo();
                    if (array_milestone === undefined || array_milestone.length === 0) {
                        this.directTabChangeClick(key, 'cancel');
                    } else {
                        this.refs.tabChangeModal.showModal(currentTabKey, key);
                    }
                }
                else if (currentTabKey === 't3') {
                    if (this.props.squareTabKey === '合计预算') {
                        this.directTabChangeClick(key, 'cancel');
                    } else {
                        const array_proj_dept = this.refs.projChangeFullCost.getCoorDeptData();
                        const array_proj_budget = this.refs.projChangeFullCost.getdeptBudgetData();
                        const fullcostIsSave = this.refs.projChangeFullCost.judgeFullcostIsSave('tabChange');
                        if (fullcostIsSave === '1') {
                            if (array_proj_dept.length === 0 && array_proj_budget.length === 0) {
                                this.directTabChangeClick(key, 'cancel');
                            } else {
                                this.refs.tabChangeModal.showModal(currentTabKey, key);
                            }
                        } else {
                            this.directTabChangeClick(key, 'cancel');
                        }
                    }

                }
            }
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：保存或者提交基本信息
     * @param optName 操作名字 'save' 'submit'
     * @param isTab 是否是tab切换保存 0 不是， 1 是
     * @param nextTab 如果isTab等于1时，需要传这个参数
     */
    saveOrSubmitBasicInfo = (optName, isTab, nextTab) => {
        const {projInfoFlag, projOldInfo} = this.props;
        let {projData, pmsData, formIsRight, pmsDataIsRight} = this.refs.projChangeInfo.getBasicInfoData();
        if (formIsRight === '1' && pmsDataIsRight === '1') {
            //在保存时，判断变化了才保存，但是，提交时不判断
            if (JSON.stringify(projData) === '{}' && pmsData.length === 0 && optName === 'save') {
                message.info('没有变化数据');
            } else {
                //将投资替代额还原到 元 单位
                if ('replace_money' in projData && projData.replace_money !== '') {
                    projData.replace_money = (Number(projData.replace_money) * 10000).toString();
                }
                //如果是子项目，必选其主项目
                let projParentObj = {};
                if ('primary_proj_id' in projData) {
                    projParentObj.proj_parent_id = projData.primary_proj_id;
                    delete projData.primary_proj_id;
                    //如果是初始化(insert)的项目,只传proj_parent_id,如果是草稿，再加 tree_form_id
                    if (this.props.projInfoFlag === 'update') {
                        projParentObj.tree_form_id = this.props.projOldInfo.tree_form_id;
                    }
                }
                //如果是草稿保存，增加 arg_bussiness_batchid
                if (projInfoFlag === 'insert') {
                    projData.createdby_name = Cookie.get('username');
                    projData.flag = projInfoFlag;
                }
                else if (projInfoFlag === 'update') {
                    projData.info_form_id = projOldInfo.info_form_id;
                    projData.flag = projInfoFlag;
                }
                //归口部门数据
                let puObj = {};
                if ('pu_dept_name' in projData) {
                    puObj.pu_dept_name = projData.pu_dept_name;
                    puObj.pu_dept_id = projData.pu_dept_id;
                    puObj.pu_dept_ou = projData.pu_dept_ou;
                    if (this.props.projInfoFlag === 'update') {
                        puObj.pu_form_id = this.props.projOldInfo.pu_form_id;
                    }
                    delete projData.pu_dept_name;
                    delete projData.pu_dept_id;
                    delete projData.pu_dept_ou;
                }
                let payloadData = {
                    optName: optName,
                    isTab: isTab,
                    nextTab: nextTab,
                    arg_proj_info_json: projData,
                    arg_proj_parent_info_json: projParentObj,
                    arg_pu_info_json: puObj,
                    arg_pms_code_json: pmsData,
                };
                //提交时传 变更原因
                if (optName === 'submit') {
                    payloadData.arg_change_reason = this.refs.changeReason.state.reasonValue;
                }
                this.props.dispatch({
                    type: 'projChangeApply/saveOrSubmit',
                    payload: payloadData
                });
            }
        }

    };
    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：保存或者提交里程碑
     * @param optName 操作名字 'save' 'submit'
     * @param isTab 是否是tab切换保存 0 不是， 1 是
     * @param nextTab 如果isTab等于1时，需要传这个参数
     */
    saveOrSubmitMilestone = (optName, isTab, nextTab) => {
        const array_milestone = this.refs.mileStone.getMileStoneInfo(optName);
        if (optName === 'submit' && array_milestone === undefined) {
            return 0;
        } else {
            if (array_milestone.length === 0 && optName === 'save') {
                message.info('没有变化数据');
            } else {
                let payloadData = {
                    optName: optName,
                    isTab: isTab,
                    nextTab: nextTab,
                    array_milestone: array_milestone,
                };
                //提交时传 变更原因
                if (optName === 'submit') {
                    payloadData.arg_change_reason = this.refs.changeReason.state.reasonValue;
                }
                this.props.dispatch({
                    type: 'projChangeApply/saveOrSubmit',
                    payload: payloadData
                });
            }
        }
    };
    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：保存或者提交成本预算
     * @param optName 操作名字 'save' 'submit'
     * @param isTab 是否是tab切换保存 0 不是， 1 是
     * @param nextTab 如果isTab等于1时，需要传这个参数
     * childTab 有可能是全成本子tab的保存
     */
    saveOrSubmitCostBudget = (optName, isTab, nextTab, childTab) => {
        const array_proj_dept = this.refs.projChangeFullCost.getCoorDeptData();
        const array_proj_budget = this.refs.projChangeFullCost.getdeptBudgetData();
        const fullcostIsSave = this.refs.projChangeFullCost.judgeFullcostIsSave();
        if (fullcostIsSave === '1') {
            if (array_proj_dept.length === 0 && array_proj_budget.length === 0 && optName === 'save') {
                message.info('没有变化数据');
            } else {
                let payloadData = {
                    optName: optName,
                    isTab: isTab,
                    nextTab: nextTab,
                    childTab: childTab,
                    array_proj_dept: array_proj_dept,
                    array_proj_budget: array_proj_budget,
                };
                //提交时传 变更原因
                if (optName === 'submit') {
                    payloadData.arg_change_reason = this.refs.changeReason.state.reasonValue;
                }
                this.props.dispatch({
                    type: 'projChangeApply/saveOrSubmit',
                    payload: payloadData
                });
            }
        }
    };
    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：保存或者提交
     * @param optName 操作名字 'save' 'submit'
     */
    saveOrSubmit = (optName) => {
        const {currentTabKey} = this.props;
        if (optName === 'save') {
            if (currentTabKey === 't1') {
                this.saveOrSubmitBasicInfo(optName, '0');
            }
            else if (currentTabKey === 't2') {
                this.saveOrSubmitMilestone(optName, '0');
            }
            else if (currentTabKey === 't3') {
                this.saveOrSubmitCostBudget(optName, '0');
            }
        } else if (optName === 'submit') {
            if (currentTabKey === 't1') {
                let {formIsRight, pmsDataIsRight} = this.refs.projChangeInfo.getBasicInfoData();
                if (formIsRight === '1' && pmsDataIsRight === '1') {
                    this.refs.changeReason.showModal(currentTabKey);
                }
            }
            else if (currentTabKey === 't2') {
                const array_milestone = this.refs.mileStone.getMileStoneInfo(optName);
                if (array_milestone !== undefined) {
                    this.refs.changeReason.showModal(currentTabKey);
                }
            }
            else if (currentTabKey === 't3') {
                const fullcostIsSave = this.refs.projChangeFullCost.judgeFullcostIsSave();
                if (fullcostIsSave === '1') {
                    this.refs.changeReason.showModal(currentTabKey);
                }
            }
        }
    };
    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：从页面返回
     */
    goBack = () => {
        this.props.dispatch(routerRedux.push({
            pathname: 'projectApp/projMonitor/change'
        }));
    };
    /**
     * 作者：邓广晖
     * 创建日期：2018-10-15
     * 功能：删除草稿
     */
    deleteChangeApplyDraft = () => {
        this.props.dispatch({
            type: 'projChangeApply/deleteChangeApplyDraft',
        });
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {dispatch, mainProjList, projTypeList, projOldInfo} = this.props;
        const operations = (
            <div>
                <Button
                    type="primary"
                    style={{marginRight: '10px'}}
                    onClick={() => this.saveOrSubmit('save')}>保存
                </Button>
                &nbsp;&nbsp;
                <Button
                    type="primary"
                    style={{marginRight: '10px'}}
                    onClick={() => this.saveOrSubmit('submit')}>提交
                </Button>
                &nbsp;&nbsp;
                {
                    this.props.draft_isdelete === '1'
                        ?
                        <Popconfirm
                            title="确定重置项目信息（基本信息、里程碑、全成本）的内容到项目未变更之前状态吗？"
                            onConfirm={() => this.deleteChangeApplyDraft()}
                        >
                            <Button
                                type="primary"
                                style={{marginRight: '10px'}}
                            >重置
                            </Button>
                            &nbsp;&nbsp;
                        </Popconfirm>

                        :
                        null
                }
                <Button
                    type="primary"
                    style={{marginRight: '10px'}}
                    onClick={() => this.refs.goBackModal.showModal()}>返回
                </Button>
            </div>
        );

        return (
            <Spin tip={config.PROCESSING_DATA} spinning={this.props.loading||this.props.loading2}>
                <div style={{background: 'white', padding: '10px 10px 10px 10px'}}>
                    <GoBackModal
                        ref='goBackModal'
                        goBack={this.goBack}
                    />
                    <TabChangeModal
                        ref='tabChangeModal'
                        directTabChangeClick={(key, flag) => this.directTabChangeClick(key, flag)}
                        saveOrSubmitBasicInfo={(optName, isTab, nextTab) => this.saveOrSubmitBasicInfo(optName, isTab, nextTab)}
                        saveOrSubmitMilestone={(optName, isTab, nextTab) => this.saveOrSubmitMilestone(optName, isTab, nextTab)}
                        saveOrSubmitCostBudget={(optName, isTab, nextTab, childTab) => this.saveOrSubmitCostBudget(optName, isTab, nextTab, childTab)}
                    />
                    {/*修改原因模态框*/}
                    <ChangeReason
                        ref={'changeReason'}
                        saveOrSubmitBasicInfo={(optName, isTab) => this.saveOrSubmitBasicInfo(optName, isTab)}
                        saveOrSubmitMilestone={(optName, isTab) => this.saveOrSubmitMilestone(optName, isTab)}
                        saveOrSubmitCostBudget={(optName, isTab) => this.saveOrSubmitCostBudget(optName, isTab)}
                    />
                    <div>
                        <div style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 28
                        }}>
                            {this.props.projOriginName}
                        </div>
                        {this.props.projChangeCheckFlag !== '0' ?
                            <div>
                                {this.props.changeReason !== undefined && this.props.changeReason !== '' ?
                                    <div style={{marginLeft: 20, marginBottom: 10}}>
                                        <span style={{fontWeight: 'bold', fontSize: 16}}>变更原因：</span>
                                        <TextArea value={this.props.changeReason}
                                                  autosize={{minRows: 1, maxRows: 4}}
                                                  style={{width: '90%', verticalAlign: 'top', color: 'black'}}
                                                  disabled={true}
                                        >
                                        </TextArea>
                                    </div>
                                    :
                                    ''
                                }
                                <div style={{
                                    textAlign: 'right',
                                    fontWeight: 'bold',
                                    fontSize: 17,
                                    color: 'red',
                                    marginRight: '20px',
                                    marginBottom: '-25px'
                                }}>{this.props.projChangeCheckShow}</div>
                            </div>
                            :
                            ''
                        }
                    </div>
                    <div>
                        <Tabs
                            tabBarExtraContent={this.props.projChangeCheckFlag === '0' ? operations : ''}
                            activeKey={this.props.currentTabKey}
                            onTabClick={this.tabChangeClick}
                        >
                            <TabPane tab="基本信息" key="t1">
                                {this.props.projChangeCheckFlag === '0' ?
                                    <ProjChangeInfo
                                        ref="projChangeInfo"
                                        dispatch={dispatch}
                                        mainProjList={mainProjList}
                                        projTypeList={projTypeList}
                                        projOldInfo={projOldInfo}
                                        basicInfoUuid={this.props.basicInfoUuid}
                                        projInfoLimit={this.props.projInfoLimit}
                                        mixReplaceMoney={this.props.mixReplaceMoney}
                                        pms_list={this.props.pms_list}
                                        projNewUid={this.props.projNewUid} // 修改主责部门需要项目uid
                                        arg_proj_id={this.props.queryData.arg_proj_id}  // 项目id
                                    />
                                    :
                                    <ProjChangeExamingInfo
                                        ref="projChangeExamingInfo"
                                        dispatch={dispatch}
                                        projectInfo={projOldInfo}
                                        pms_list={this.props.pms_list}
                                    />
                                }
                            </TabPane>
                            <TabPane tab="里程碑" key="t2">
                                <MileStone
                                    dispatch={dispatch}
                                    ref="mileStone"
                                    begin_time={this.props.begin_time}
                                    end_time={this.props.end_time}
                                    mileStoneList={this.props.mileStoneList}
                                    fore_workload={this.props.fore_workload}
                                    remainWorkLoad={this.props.remainWorkLoad}
                                    projNewUid={this.props.projNewUid}
                                    mileStoneListOriginal={this.props.mileStoneListOriginal}
                                    mileModalVisible={this.props.mileModalVisible}
                                    mileModalType={this.props.mileModalType}
                                    mileStoneRecord={this.props.mileStoneRecord}
                                    mileStoneModalData={this.props.mileStoneModalData}
                                    projChangeCheckFlag={this.props.projChangeCheckFlag}
                                />
                            </TabPane>
                            <TabPane tab="全成本" key="t3">
                                <ProjChangeFullCost
                                    ref="projChangeFullCost"
                                    dispatch={dispatch}
                                    loading={this.props.loading}
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
                                    projChangeCheckFlag={this.props.projChangeCheckFlag}
                                    oubudgetList = {this.props.oubudgetList}
                                    squareTabKey={this.props.squareTabKey}
                                    isShowTabINFullCost={this.props.isShowTabINFullCost}
                                    tabListArr={this.props.tabListArr}
                                    // deptPersonList={this.props.deptPersonList}
                                    deptModalShow={this.props.deptModalShow}
                                    saveOrSubmitCostBudget={this.saveOrSubmitCostBudget} // 在全成本子tab中需要使用
                                    drtChildTabClick={this.drtChildTabClick} // 直接切换tab
                                    childTabChangeClick={this.childTabChangeClick} // 显示弹窗然后根据选择切换
                                    queryData={this.props.queryData}
                                />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </Spin>

        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.projChangeApply,
        ...state.projChangeApply
    }
}

export default connect(mapStateToProps)(ApplyMainPage);
