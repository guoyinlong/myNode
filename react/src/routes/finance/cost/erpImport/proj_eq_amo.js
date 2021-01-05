
import React from "react";
import {connect} from "dva";

import {Select, Table, Button, message, DatePicker, Spin} from "antd";
import moment from 'moment';
import 'moment/locale/zh-cn';

import exportExl from '../../../../components/commonApp/exportExl.js'
import styles from "../../../../components/finance/table.less";
import style from "../../depreciation/style.less";

moment.locale('zh-cn');
const { MonthPicker } = DatePicker
const {Option} = Select
class Proj_eq_amo extends React.Component {
  release=()=>{
    const { dispatch } = this.props;
    dispatch({
      type : `proj_eq_amo/proj_eq_amo_release`,
    })
  };
  delData = () =>{
    const { dispatch } = this.props;
    dispatch({
      type : `proj_eq_amo/delData`,
    })
  };
  exportData = () =>{
    const {list} = this.props;
    let tab=document.querySelector('#table1 table');
    if(list.length !== 0){
      exportExl()(tab,'项目设备摊销');
    }else{
      message.info("查询结果为空！")
    }
  };
  sync = ()=> {
    this.props.dispatch({
      type: 'proj_eq_amo/proj_eq_amo_sync'
    })
  }
  days_change =(time, timeString) => {
    this.props.dispatch({
      type: 'proj_eq_amo/days_change',
      current: timeString
    })
  }
  ou_change = (ou)=>{
    this.props.dispatch({
      type: 'proj_eq_amo/ou_change',
      ou: ou
    })
  }
  columns = [
    {
      title: 'ou',
      dataIndex: 'ou',
      width:'150px',
      key: 'key'
    },
    {
      title: '部门',
      dataIndex: 'dept_name',
      width:'150px',
    },
    {
      title: '项目编号',
      dataIndex: 'proj_code',
      width:'150px',
    },
    {
      title: 'pms编码',
      dataIndex: 'pms_code',
      width:'150px',
    },
    {
      title: '项目名称',
      dataIndex: 'proj_name',
      width:'150px',
    },
    {
      title: '折旧分摊额',
      dataIndex: 'depreciate_share_money',
      width:'150px',
    }
  ]
  render() {
    const {list,ou,ou_list,total_year,total_month,proj_eq_amo_sum} = this.props
    list.length && list.map((item,index)=>{item.key = index})
    return (
        <Spin spinning={this.props.loading}>
          <div className={style.title}>
            年月：
            {
              total_year && total_month ?
                <MonthPicker defaultValue={moment(`${total_year}-${total_month}`, 'YYYY-MM')}
                             placeholder="Select month"
                             style={{width: 120}}
                             onChange={this.days_change}
                />
                :
                null
            }

          </div>
          <div className={style.title}>
            OU：
            <Select style={{ width: 160,marginRight: '10px'}}  value={ou} onSelect={(value)=>this.ou_change(value)} >
              {ou_list.map((item) => {return (<Option key={item.dept_name}>{item.dept_name}</Option>)})}
            </Select>
            <Button type="primary" style={{marginRight:'10px'}} onClick={this.sync} disabled={ list.length }>同步</Button>
            <Button type="primary" style={{marginRight:'10px'}} onClick={this.release} disabled={ list.length===0 ||(list.length&& list[0].state_code === '0') }>发布</Button>
            <Button type="primary" onClick={this.delData} style={{marginRight:'10px'}} disabled={list.length===0 || (list.length && list[0].state_code === '2')}>撤销</Button>
            <Button type="primary" onClick={this.exportData}>导出</Button>
          </div>
          <div style={{display: list.length? '': 'none',marginLeft: '15px',marginTop: '15px',marginRight: '15px'}}>
            <span>状态：<span style={{color: list.length && list[0].state_code === '0'? 'red': 'green'}}>{list.length ? list[0].state_name: null }</span></span>
            <span style={{float:'right'}}>合计：{list.length &&proj_eq_amo_sum[0].sum_money}</span>
            <div style={{clear: 'both'}}/>
          </div>
          <div style={{marginTop:'10px'}}>
            <Table columns={this.columns}
                   dataSource={list}
                   className={styles.financeTable}
            />
          </div>
          <div id="table1" style={{display:'none'}}>
            <Table columns={this.columns}
                   dataSource={list}
                   pagination = {false}
            />
          </div>
          {/*<div style={{marginTop:'10px',color:'red'}}>您取到的有效工时数据截止到：{ remark }</div>*/}
        </Spin>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.proj_eq_amo,
    loading: state.loading.models.proj_eq_amo
  }
}

export default connect(mapStateToProps)(Proj_eq_amo)
