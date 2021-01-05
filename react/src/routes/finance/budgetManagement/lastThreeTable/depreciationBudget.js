/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：折旧分摊完成情况
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../../components/finance/finance.less';
import styleTable from '../../../../components/finance/table.less';
import TopSelectInfo from './topSelect';
import { Spin,Table } from "antd";
import exportExl from '../../../../components/commonApp/exportExl';
class depreciationBudget extends React.Component{
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
      type : 'lastThreeTable/depreciationSharing',
    })
  };
  expExl=()=>{
    let tab=document.querySelector(`#tableDepreciationBudget table`);
    exportExl()(tab,'折旧分摊');
  };
  render() {
    const { columnDepreciation,list } = this.props;
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
              flag = '2'
            />
            <div id="tableDepreciationBudget" style={{display:'none'}}>
              <Table className={styleTable.financeTable} columns={columnDepreciation} dataSource={list} pagination={false}/>
            </div>
            <Table className={styleTable.financeTable} columns={columnDepreciation} dataSource={list} scroll={{ x: this.props.scroll }} pagination={false}/>
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
export default connect(mapStateToProps)(depreciationBudget);
