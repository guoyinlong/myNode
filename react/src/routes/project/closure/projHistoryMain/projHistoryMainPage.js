/**
 *  作者: 仝飞
 *  创建日期: 2017-9-19
 *  邮箱：tongf5@chinaunicom.cn
 *  文件说明：已立项项目的信息展示主页，包括四部分
 */
import React from 'react';
import { connect } from 'dva';
import { Button,Tabs } from 'antd';
//import styles from './projHistoryMainPage.less'
//import SearchFullCost  from '../../closure/projHistoryMain/fullCostSearch.js';
import Attachment from './projAttachment.js';
import AttachmentUpLoad from './attachment.js';
import NotChangeBasicInfo from '../../../commonApp/message/projChangeCheck/notChangeBasicInfo';
//import ProjInfoQuery from './projInfo.js';
import MileInfoQuery from './mileInfo.js';
import ProjFullCost from '../../startup/projStartMain/projFullCost';
import { routerRedux } from 'dva/router';
const TabPane = Tabs.TabPane;

/**
 *  作者: 仝飞
 *  创建日期: 2017-9-19
 *  功能：项目详情页面（基本信息，里程碑，全成本，附件）
 */
class ProjHistoryMainPage extends React.Component {

  /**
   * 作者：仝飞
   * 创建日期：2017-10-31
   * 功能：返回项目查询列表
   */
  goBack = ()=> {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname: 'projectApp/projClosure/historyProject',
      query:this.props.queryData
    }));
  };

  /**
   * 作者：仝飞
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


  render() {
    const {dispatch,projOldInfo,projectInfo,mileInfoList,fore_workload,attachmentList,checkLogList} = this.props;
    const operations = <Button type="primary" htmlType="submit" style={{marginRight:'10px'}}
                               onClick={this.goBack}>返回</Button>;
    checkLogList.map((item,index)=>{
      item.key = index;
    });
    return (
      <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
        {(projectInfo) ?
          <div className="header" style={{marginBottom:12}}>
            <h3
              style={{fontWeight:600,fontSize:'25px',textAlign:'center',marginBottom:20,padding:0}}>{projectInfo.proj_name}</h3>
            {/*<Row>
             <Col xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 2 }}><Icon type='xiangmubianhao' style={{marginRight:5}} />NO:{projectInfo.mgr_id}</Col>
             <Col xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 1 }}><Icon type='xingming' style={{marginRight:5}} />项目经理:{projectInfo.mgr_name}</Col>
             <Col xs={{ span: 11, offset: 1 }} lg={{ span: 11, offset: 0 }}><Icon type='bumen' style={{marginRight:5}} />主责部门:{projectInfo.dept_name}</Col>
             </Row>*/}
          </div> : ''
        }

        <Tabs tabBarExtraContent={operations}>
          <TabPane tab="基本信息" key="1">
            <NotChangeBasicInfo notChangeBasicInfo={projectInfo}/>
          </TabPane>
          <TabPane tab="里程碑" key="2"><MileInfoQuery
            ref="mileInfoQuery"
            dispatch={dispatch}
            mileInfoList={mileInfoList}
            fore_workload={fore_workload}
          />
          </TabPane>
          <TabPane tab="全成本" key="3">
            <ProjFullCost
              coorpDeptList={this.props.coorpDeptList}
              deptBudgetTableData={this.props.deptBudgetTableData}
              allDeptList={this.props.allDeptList}
              predictTimeTotal={this.props.predictTimeTotal}
            />
          </TabPane>
          {this.props.display === true ?
            <TabPane tab="附件" key="4"><AttachmentUpLoad proj_id={this.props.proj_id}
                                                           projObj={projOldInfo}  dispatch={dispatch}
                                                  attachmentList={attachmentList}/></TabPane>
            :
            <TabPane tab="附件" key="5"><Attachment proj_id={this.props.proj_id}
                                                  projObj={projOldInfo}  dispatch={dispatch}
                                                  attachmentList={attachmentList}/></TabPane>
          }
        </Tabs>
      </div>
    );
  }
}
function mapStateToProps(state) {
  // const { mainProjList, proj_id,projOldInfo,projectInfo,mileInfoList,fore_workload,attachmentList,checkLogList,queryData} = state.projHistoryMainPage;
  return {
    loading:state.loading.models.projHistoryMainPage,
    ...state.projHistoryMainPage
  };
}

export default connect(mapStateToProps)(ProjHistoryMainPage);
