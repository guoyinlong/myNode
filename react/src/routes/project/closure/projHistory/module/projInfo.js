/**
 *  作者: 夏天
 *  创建日期: 2018-09-17
 *  邮箱：1348744578@qq.com
 *  文件说明：已立项项目的信息展示主页，包括四部分
 */
import React from 'react';
import { Tabs } from 'antd';

import NotChangeBasicInfo from './notChangeBasicInfo';
// import ProjInfoQuery from './projInfo.js';
import Attachment from '../../projHistoryMain/projAttachment';
import MileInfoQuery from '../../projHistoryMain/mileInfo.js';
import ProjFullCost from '../../../startup/projStartMain/projFullCost';

const TabPane = Tabs.TabPane;


class ProjInfo extends React.Component {


    render() {
        const { dispatch, projectInfo, mileInfoList, fore_workload, attachmentList,pms_list } = this.props;
        // console.log(attachmentList);
        
        return (
            <div >
                <Tabs>
                    <TabPane tab="基本信息" key="1">
                        <NotChangeBasicInfo
                            notChangeBasicInfo={projectInfo}
                            pms_list={pms_list}
                            replaceMoneyList={this.props.replaceMoneyList}
                        />
                    </TabPane>
                    <TabPane tab="里程碑" key="2">
                        <MileInfoQuery
                            ref="mileInfoQuery"
                            dispatch={dispatch}
                            mileInfoList={mileInfoList}
                            fore_workload={fore_workload}
                        />
                    </TabPane>
                     <TabPane tab="全成本" key="3">
                        <ProjFullCost
                            dispatch={this.props.dispatch}
                            coorpDeptList={this.props.coorpDeptList}
                            deptBudgetTableData={this.props.deptBudgetTableData}
                            allDeptList={this.props.allDeptList}
                            predictTimeTotal={this.props.predictTimeTotal}
                            fullCostPmsListData={this.props.fullCostPmsListData}
                            fullCostShowPmsTab={this.props.fullCostShowPmsTab}
                            fullCostPmsTab={this.props.fullCostPmsTab}
                            from_page={"History"}
                       />
                    </TabPane> 
                    <TabPane tab="附件" key="5">
                        <Attachment
                            proj_id={this.props.proj_id}
                            // projObj={projOldInfo}
                            dispatch={dispatch}
                            attachmentList={attachmentList}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default ProjInfo;
