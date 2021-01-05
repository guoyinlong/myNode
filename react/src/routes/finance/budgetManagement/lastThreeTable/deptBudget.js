/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：部门自管经费
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../../components/finance/finance.less';
import styleTable from '../../../../components/finance/table.less';
import TopSelectInfo from './topSelect';
import { Spin,Table,Button } from "antd";
import exportExl from '../../../../components/commonApp/exportExl';
class deptBudget extends React.Component{
  constructor(props){
    super(props)
  }
  changeSelect=(value,key)=>{
    this.props.dispatch({
      type : 'lastThreeTable/changeSelect',
      key,
      value,
    })
  };
  queryData=()=>{
    this.props.dispatch({
      type : 'lastThreeTable/deptBudget',
    })
  };
  generateData=()=>{
    this.props.dispatch({
      type : 'lastThreeTable/deptBudgetGenerate',
    })
  };
  publicData=()=>{
    this.props.dispatch({
      type : 'lastThreeTable/deptBudgetPublic',
    })
  };
  cancelData=()=>{
    this.props.dispatch({
      type : 'lastThreeTable/deptBudgetCancel',
    })
  };
  expExl=()=>{
    let tab=document.querySelector(`#tableDeptBudget table`);
    exportExl()(tab,'部门自管及归口管理经费');
  };
  render() {
    const { columnDeptBudget,list,currState,roleType } = this.props;
    if(list){
      list.map((i,index)=>{
        i.key = index;
      })
    }
    return (
        <div className={Style.wrap}>
          <Spin tip="加载中..." spinning={this.props.loading}>
            <TopSelectInfo
              data={this.props}
              changeSelect={this.changeSelect}
              queryData={this.queryData}
              expExl={this.expExl}
              flag = '1'
            />
            {
              roleType === true ?
                <div>
                  <div style={{marginBottom : '10px',marginTop:'-10px'}}>
                    <Button type="primary" disabled={currState === '1'} onClick={this.generateData}>生成</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" disabled={currState !== '2' || !list.length} onClick={this.publicData}>审核</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" disabled={currState !== '1' || !list.length} onClick={this.cancelData}>撤销</Button>
                  </div>
                  <div style={{margin:'5px 0'}}>
                    状态：
                    {
                      currState === '' ?
                        <span style={{color:'red'}}>未生成</span>
                        :
                        currState === '1'? <span style={{color:'#FF0000'}}>审核通过</span>
                          :
                          currState === '2'?<span style={{color:'#0000FF'}}>待审核</span>
                            :''
                    }
                  </div>
                </div>
                :
                null
            }
            <div>
              <Table className={styleTable.financeTable} columns={columnDeptBudget} dataSource={list} pagination={false} scroll={{ x: this.props.scroll }}/>
            </div>
            <div id="tableDeptBudget" style={{display:'none'}}>
              <Table className={styleTable.financeTable} columns={columnDeptBudget} dataSource={list} pagination={false}/>
            </div>
          </Spin>
        </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.lastThreeTable,
    ...state.lastThreeTable
  };
}
export default connect(mapStateToProps)(deptBudget);
