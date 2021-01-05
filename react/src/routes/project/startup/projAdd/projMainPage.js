/**
 *  作者: 胡月
 *  创建日期: 2017-9-11
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：项目启动新增项目主页，包括四部分
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Tabs, message, Spin, Modal } from 'antd';
import config from '../../../../utils/config';
import ProjInfoModal from './projInfoModal.js';
import MileStone from './mileStone.js';
import ProjStartFullCost from './projStartFullCost';
import Attachment from './attachment';
import GoBackModal from './goBackModal';
import TabChangeModal from './tabChangeModal';
import StartSubmitModal from './startSubmitModal';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import { CHECK_INFO_RULE } from '../../projConst.js';
const TabPane = Tabs.TabPane;

/**
 *  作者: 胡月
 *  创建日期: 2017-9-17
 *  功能：项目添加主页（基本信息，里程碑，全成本，附件）
 */
class ProjMainPage extends React.Component {
    state = {
        delDraftVisible:false
    }
    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：直接处理tab切换，不加任何处理
     * @param key tab的key
     * @param flag 弹出模态框标记
     * @param isFullCost 是否是全程本的 tab切换
     * @param nextPmsTabValue 下一个全成本的 tab值
     */
    directTabChangeClick = (key, flag, isFullCost, nextPmsTabValue) => {
        this.props.dispatch({
            type: 'projectInfo/tabChangeClick',
            key: key,
            flag: flag,
            isFullCost: isFullCost,
            nextPmsTabValue: nextPmsTabValue
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：处理tab切换
     * @param key tab的key
     */
    tabChangeClick = (key) => {
        const { currentTabKey } = this.props;
        //如果点击的是当前tab不起作用
        if (key !== currentTabKey) {
            if (currentTabKey === 't1') {
                let { projData, pmsData, formIsRight, pmsDataIsRight } = this.refs.projInfoModal.getBasicInfoData();
                if (formIsRight === '1' && pmsDataIsRight === '1') {
                    //在切换保存时，判断变化了才保存
                    if (JSON.stringify(projData) === '{}' && pmsData.length === 0 ) {
                        this.directTabChangeClick(key,'cancel');
                    } else {
                        this.refs.tabChangeModal.showModal(currentTabKey,key);
                    }
                }
            }
            else if (currentTabKey === 't2') {
                const array_milestone = this.refs.mileStone.getMileStoneInfo();
                if (array_milestone === undefined || array_milestone.length === 0) {
                    this.directTabChangeClick(key,'cancel');
                } else {
                    this.refs.tabChangeModal.showModal(currentTabKey,key);
                }
            }
            else if (currentTabKey === 't3') {
                //如果是在  合计预算 里面， 直接切换，不管是上面的tab，还是下面的tab
                if (this.props.fullCostPmsTab.tab_flag === '2') {
                    this.directTabChangeClick(key,'cancel');
                } else {
                    const array_proj_dept = this.refs.projStartFullCost.getCoorDeptData();
                    const array_proj_budget = this.refs.projStartFullCost.getdeptBudgetData();
                    const fullcostIsSave = this.refs.projStartFullCost.judgeFullcostIsSave('tabChange');
                    if (fullcostIsSave === '1') {
                        if ( array_proj_dept.length === 0  && array_proj_budget.length === 0) {
                            this.directTabChangeClick(key,'cancel');
                        } else {
                            this.refs.tabChangeModal.showModal(currentTabKey,key);
                        }
                    } else {
                        this.directTabChangeClick(key,'cancel');
                    }
                }
            }
            else if (currentTabKey === 't4') {
                const arg_proj_attachment_json = this.refs.attachment.getAttachmentiInfo();
                if ( arg_proj_attachment_json.length === 0) {
                    this.directTabChangeClick(key,'cancel');
                } else {
                    this.refs.tabChangeModal.showModal(currentTabKey,key);
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
    saveOrSubmitBasicInfo = (optName,isTab,nextTab) => {
        const { projInfoFlag, projOldInfo } = this.props;
        let { projData, pmsData, formIsRight, pmsDataIsRight } = this.refs.projInfoModal.getBasicInfoData();
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
                    projData.createby_id=Cookie.get('userid')
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
                //关联项目数据
                let relObj = {};
                relObj.re_proj_uid = projData.re_proj_uid;
                relObj.re_form_id = projOldInfo.re_form_id;
                this.props.projRelation.forEach(
                    (item,index)=>{ 
                        if(item.proj_uid){
                            if( item.proj_uid == projData.re_proj_uid)
                            {
                                relObj.re_proj_id = item.proj_id
                            }
                        }
                        }
                )
                
                if ('is_relation' in projData ){
                    if(projData.is_relation === '0' ){
                        relObj.re_proj_id = "";
                        relObj.re_proj_uid = "";
                        relObj.re_form_id = projOldInfo.re_form_id;
                    }
                }
                
                if(relObj.re_proj_uid == undefined){ relObj={}}
                this.props.dispatch({
                    type: 'projectInfo/saveOrSubmit',
                    payload: {
                        optName: optName,
                        isTab: isTab,
                        nextTab: nextTab,
                        arg_proj_info_json : projData,
                        arg_proj_parent_info_json : projParentObj,
                        arg_pu_info_json : puObj,
                        arg_pms_code_json : pmsData,
                        arg_proj_relation_json : relObj,
                        arg_is_check : "0"
                    }
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
    saveOrSubmitMilestone = (optName,isTab,nextTab) => {
        const array_milestone = this.refs.mileStone.getMileStoneInfo(optName);
        if (optName === 'submit' && array_milestone === undefined) {
            return 0;
        } else {
            if (array_milestone.length === 0 && optName === 'save') {
                message.info('没有变化数据');
            } else {
                this.props.dispatch({
                    type: 'projectInfo/saveOrSubmit',
                    payload: {
                        optName: optName,
                        isTab: isTab,
                        nextTab: nextTab,
                        array_milestone: array_milestone,
                    }
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
     * @param isFullCostTab 是否是全程本的 tab切换
     * @param nextPmsTabValue 下一个全成本的 tab值
     */
    saveOrSubmitCostBudget = (optName,isTab,nextTab,isFullCostTab,nextPmsTabValue) => {
        const array_proj_dept = this.refs.projStartFullCost.getCoorDeptData();
        const array_proj_budget = this.refs.projStartFullCost.getdeptBudgetData();
        const fullcostIsSave = this.refs.projStartFullCost.judgeFullcostIsSave();
        if (fullcostIsSave === '1') {
            if ( array_proj_dept.length === 0  && array_proj_budget.length === 0 && optName === 'save') {
                message.info('没有变化数据');
            } else {
                this.props.dispatch({
                    type: 'projectInfo/saveOrSubmit',
                    payload: {
                        optName: optName,
                        isTab: isTab,
                        nextTab: nextTab,
                        isFullCostTab: isFullCostTab,
                        nextPmsTabValue: nextPmsTabValue,
                        array_proj_dept: array_proj_dept,
                        array_proj_budget: array_proj_budget,
                    },
                });
            }
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：保存或者提交立项文件
     * @param optName 操作名字 'save' 'submit'
     * @param isTab 是否是tab切换保存 0 不是， 1 是
     * @param nextTab 如果isTab等于1时，需要传这个参数
     */
    saveOrSubmitAttach = (optName,isTab,nextTab) => {
        const arg_proj_attachment_json = this.refs.attachment.getAttachmentiInfo();
        if ( arg_proj_attachment_json.length === 0 && optName === 'save') {
            message.info('没有变化数据');
        } else {
            this.props.dispatch({
                type: 'projectInfo/saveOrSubmit',
                payload: {
                    optName: optName,
                    isTab: isTab,
                    nextTab: nextTab,
                    arg_proj_attachment_json: arg_proj_attachment_json,
                },
            });
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：保存或者提交
     * @param optName 操作名字 'save' 'submit'
     */
    saveOrSubmit = (optName) => {
        const { currentTabKey } = this.props;
        if (optName === 'save') {
            if ( currentTabKey === 't1') {
                this.saveOrSubmitBasicInfo(optName,'0');
            }
            else if (currentTabKey === 't2') {
                this.saveOrSubmitMilestone(optName,'0');
            }
            else if (currentTabKey === 't3') {
                this.saveOrSubmitCostBudget(optName,'0');
            }
            else if (currentTabKey === 't4') {
                this.saveOrSubmitAttach(optName,'0');
            }
        } else if (optName === 'submit') {
            if (currentTabKey === 't1') {
                let { formIsRight, pmsDataIsRight } = this.refs.projInfoModal.getBasicInfoData();
                if (formIsRight === '1' && pmsDataIsRight === '1') {
                    this.refs.startSubmitModal.showModal(currentTabKey);
                }
            }
            else if (currentTabKey === 't2') {
                const array_milestone = this.refs.mileStone.getMileStoneInfo(optName);
                if (array_milestone !== undefined) {
                    this.refs.startSubmitModal.showModal(currentTabKey);
                }
            }
            else if (currentTabKey === 't3') {
                const fullcostIsSave = this.refs.projStartFullCost.judgeFullcostIsSave();
                if (fullcostIsSave === '1') {
                    this.refs.startSubmitModal.showModal(currentTabKey);
                }
            }
            else if (currentTabKey === 't4') {
                this.refs.startSubmitModal.showModal(currentTabKey);
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
            pathname: 'projectApp/projStartUp/projList'
        }));
    };

        /**
     * 作者：金冠超
     * 创建日期：2020-2-24
     * 功能：删除草稿按钮事件
     */
    delDraft = ()=>{
        //显示删除模态框
        this.setState({delDraftVisible:true})
    }
            /**
     * 作者：金冠超
     * 创建日期：2020-2-24
     * 功能：删除草稿模态框确认事件
     */
    delDraftModalOk = (proj_uid)=>{
        this.props.dispatch({
            type: 'projectInfo/delDraftModalOk',
            proj_uid
        });
    }

    render() {
        const { dispatch } = this.props;
        const operations = (
            <div>
                {
                    // 如果位于草稿删除界面，那么出现删除草稿按钮
                this.props.projInfoFlag=='update'
                ?
                <Button
                    type='danger'
                    style={{marginRight:'10px'}}
                    onClick={this.delDraft}>删除草稿
                </Button>
                :
                null
                } 
                <Button
                    type="primary"
                    style={{marginRight:'10px'}}
                    onClick={()=>this.saveOrSubmit('save')}>保存
                </Button>
                &nbsp;&nbsp;
                <Button
                    type="primary"
                    style={{marginRight:'10px'}}
                    onClick={()=>this.saveOrSubmit('submit')}>提交
                </Button>
                &nbsp;&nbsp;
                <Button
                    type="primary"
                    style={{marginRight:'10px'}}
                    onClick={()=>this.refs.goBackModal.showModal()}>返回
                </Button>
            </div>
        );
        // console.log("当前状态"+this.props.projInfoFlag)
        return (
            <Spin tip={config.IS_LOADING} spinning={this.props.loading || this.props.fullCostLoading === true}>
                <div style={{background: 'white', padding: '10px 10px 10px 10px'}}>
                    <GoBackModal
                        ref='goBackModal'
                        goBack={this.goBack}
                    />
                    <TabChangeModal
                        ref='tabChangeModal'
                        directTabChangeClick={(key,flag)=>this.directTabChangeClick(key,flag)}
                        saveOrSubmitBasicInfo={(optName,isTab,nextTab)=>this.saveOrSubmitBasicInfo(optName,isTab,nextTab)}
                        saveOrSubmitMilestone={(optName,isTab,nextTab)=>this.saveOrSubmitMilestone(optName,isTab,nextTab)}
                        saveOrSubmitCostBudget={(optName,isTab,nextTab)=>this.saveOrSubmitCostBudget(optName,isTab,nextTab)}
                        saveOrSubmitAttach={(optName,isTab,nextTab)=>this.saveOrSubmitAttach(optName,isTab,nextTab)}
                    />
                    <StartSubmitModal
                        ref='startSubmitModal'
                        saveOrSubmitBasicInfo={(optName,isTab)=>this.saveOrSubmitBasicInfo(optName,isTab)}
                        saveOrSubmitMilestone={(optName,isTab)=>this.saveOrSubmitMilestone(optName,isTab)}
                        saveOrSubmitCostBudget={(optName,isTab)=>this.saveOrSubmitCostBudget(optName,isTab)}
                        saveOrSubmitAttach={(optName,isTab)=>this.saveOrSubmitAttach(optName,isTab)}
                    />
                    <Tabs
                        tabBarExtraContent={operations}
                        activeKey={this.props.currentTabKey}
                        onTabClick={this.tabChangeClick}
                    >
                        <TabPane tab="基本信息" key="t1">
                            
                            <ProjInfoModal
                                ref="projInfoModal"
                                dispatch={dispatch}
                                mainProjList={this.props.mainProjList}
                                projTypeList={this.props.projTypeList}
                                projRelation={this.props.projRelation}
                                projRelSearch={this.props.projRelSearch}
                                projOldInfo={this.props.projOldInfo}
                                basicInfoUuid={this.props.basicInfoUuid}
                                is_limit_key={this.props.is_limit_key}
                                pms_list={this.props.pms_list}
                                is_check = "0"
                                //修改测试
                                username={this.props.username}
                                userid={this.props.userid}
                                
                            />
                            {/* 删除模态框 */}
                                <Modal
                                    visible={this.state.delDraftVisible}
                                    width='400px'
                                    title="草稿删除"
                                    onOk={()=>this.delDraftModalOk(this.props.projOldInfo.proj_uid)}
                                    onCancel={()=>{this.setState({delDraftVisible:false})}}
                                >
                                    <div>
                                        确认删除当前草稿？
                                    </div>
                                </Modal>
                            
                        </TabPane>
                        <TabPane tab="里程碑" key="t2" disabled={this.props.projInfoFlag === 'insert'}>
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
                            />
                        </TabPane>
                        <TabPane tab="全成本" key="t3" disabled={this.props.projInfoFlag === 'insert'}>
                            <ProjStartFullCost
                                ref="projStartFullCost"
                                dispatch={dispatch}
                                projNewUid={this.props.projNewUid}
                                fullCostPmsTab={this.props.fullCostPmsTab}
                                fullCostShowPmsTab={this.props.fullCostShowPmsTab}
                                fullCostPmsListData={this.props.fullCostPmsListData}
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
                                directTabChangeClick={this.directTabChangeClick}
                                saveOrSubmitCostBudget={this.saveOrSubmitCostBudget}
                                oubudgetList = {this.props.oubudgetList}
                            />
                        </TabPane>
                        <TabPane tab="附件" key="t4" disabled={this.props.projInfoFlag === 'insert'}>
                            <Attachment
                                dispatch={dispatch}
                                ref="attachment"
                                attachmentList={this.props.attachmentList}
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
        loading: state.loading.models.projectInfo,
        ...state.projectInfo
    };
}

export default connect(mapStateToProps)(ProjMainPage);
