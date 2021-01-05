/**
 * 作者：李杰双
 * 日期：2017/10/24
 * 邮件：282810545@qq.com
 * 文件说明：项目全成本预算查询
 */
import React from 'react';
import { connect } from 'dva';
import { Cascader, Table, Button,Row,Col } from 'antd';
import exportExl from '../../../../components/commonApp/exportExl'
import Styles from '../../../../components/cost/cost_budget.less'
import withOUSearch from './withOuSearch'
import {TagDisplay} from '../costCommon.js'


class Const_budeget extends React.Component{
  state={
    currPro:''
  }

  onChange=(value, selectedOptions)=>{
    let selectPro=selectedOptions[selectedOptions.length - 1]
    this.state.currPro=selectPro.label
    this.props.dispatch({
      type:'cost_budget_sel/projbudgetquery',
      selectedOptions:selectPro
    })
  }
  exportTable=()=>{
    let thead=document.querySelector('#table1 .ant-table-scroll .ant-table-header table thead').cloneNode(true);
    let tbody=document.querySelector('#table1 .ant-table-scroll .ant-table-body table tbody').cloneNode(true);
    let expTable=document.createElement('table')
    expTable.appendChild(thead)
    expTable.appendChild(tbody)
    exportExl()(expTable,this.state.currPro)
  }
  componentWillUnmount(){
    this.props.dispatch({
      type:'cost_budget_sel/clearData'
    })
  }
  render(){
    let {list ,columnList ,loading,dataOther} = this.props;
    return(
      <div>
        <div className={Styles.btns}>
          {this.props.syncAuthority?<Button type='primary' onClick={()=>this.props.dispatch({type:'cost_budget_sel/syncData'})}>同步</Button>:null}
          <Button disabled={!list.length} type='primary' onClick={this.exportTable}>导出</Button>
        </div>
        {
          dataOther ?
            <div>
              <Row style={{marginTop:'20px'}}>
                <Col span={6}>
                  <b>项目编码：</b>{dataOther.ProjCode}
                </Col>
                <Col span={6}>
                  <b>PMS编码：</b>{dataOther.pms_code}
                </Col>
                <Col span={6}>
                  <b>项目状态：</b><TagDisplay proj_tag={dataOther.proj_tag}/>
                </Col>
              </Row>
              <Row style={{marginTop:'10px'}}>
                <Col span={6}>
                  <b>项目经理：</b>{dataOther.ProjMgr}
                </Col>
                <Col span={6}>
                  <b>项目周期：</b>{dataOther.BeginEndDate}
                </Col>
                <Col span={12}>
                  <b>主责部门：</b>{dataOther.DeptPrimary}
                </Col>
              </Row>
              <Row style={{marginTop:'10px'}}>
                <Col span={24}>
                  <b>配合部门：</b>{dataOther.DeptSecondary}
                </Col>
              </Row>
            </div>
            :
            null
        }

        <div className={Styles.orderTable} style={{paddingTop:'20px',minHeight:'500px'}} id='table1'>
          <Table loading={loading}  columns={columnList} dataSource={list}  pagination={false} scroll={{x:(columnList.length-1)*150+200, y: 500 }}/>
        </div>

      </div>
    )
  }
}
function mapStateToProps(state) {
  const { list,columnList,syncAuthority,dataOther} = state.cost_budget_sel;

  return {
    list,
    columnList,
    dataOther,
    loading: state.loading.models.cost_budget_sel,
    syncAuthority
  };
}
export default connect(mapStateToProps)(withOUSearch(Const_budeget))
