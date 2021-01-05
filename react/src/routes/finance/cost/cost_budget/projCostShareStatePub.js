/**
 * 作者：张楠华
 * 日期：2017-11-3
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：部门分摊人均数据
 */
import React from 'react';
import {connect } from 'dva';
import { Table ,Button,Select } from 'antd';
const Option = Select.Option;
import Style from '../../../../components/employer/employer.less'
import styles from '../../../../components/finance/table.less'
import exportExl from '../../../../components/commonApp/exportExl'
/**
 * 作者：张楠华
 * 创建日期：2017-11-3
 * 功能：格式化数据
 */
function MoneyComponent({text}) {
  return (
    <div style={{textAlign:'right',letterSpacing:1}}>{text?format(parseFloat(text)):text}</div>
  )
}
function format (num) {
  return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
class projCostShareStatePub extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ou:localStorage.ou,
      shareStateYear:new Date().getFullYear().toString(),

    }
  }
  /**
   * 作者：张楠华
   * 创建日期：2017-11-3
   * 功能：选择组织单元
   */
  selectOu=(value)=>{
    const { dispatch } = this.props;
    const { shareStateYear } = this.state;
    this.setState({
      ou:value
    });
    dispatch({
      type:'projCostShareStatePub/queryProjectCostShareStatePub',
      ou:value,
      shareStateYear,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-3
   * 功能：选择年份
   */
  selectYear=(value)=>{
    const { dispatch } = this.props;
    const { ou } = this.state;
    this.setState({
      shareStateYear:value
    });
    dispatch({
      type:'projCostShareStatePub/queryProjectCostShareStatePub',
      ou,
      shareStateYear:value,
    });
  };
  //表格数据
  columns = [
    {
      title: '类别',
      dataIndex: 'fee_name',
      key:'fee_name',
    },
    {
      title: '上一年人均标准(实际)',
      dataIndex: 'up_year_ps',
      key:'up_year_ps',
      render:(text)=><MoneyComponent text={text}/>
    },
    {
      title: '今年人均标准（预算）',
      dataIndex: 'year_ps',
      key:'year_ps',
      render:(text)=><MoneyComponent text={text}/>
    }
  ];
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：导出数据
   */
  expExl=()=>{
    const { list } = this.props;
    let tab=document.querySelector('#table1 table');
    if(list !== null && list.length !== 0){
      exportExl()(tab,'部门分摊成本人均标准执行情况')
    }else{
      message.info("表格数据为空！")
    }
  };
  render() {
    const { loading,list,ouList } = this.props;
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    //组织单元列表
    let ouList1;
    if(ouList !== '' || ouList.length !== 0){
      ouList1 = ouList.map((item) => {
        return (
          <Option key={item.dept_name}>
            {item.dept_name}
          </Option>
        )
      });
    }
    return (
      <div className={Style.wrap}>
        <div style={{textAlign: 'left'}}>
          部门/OU：
          <Select showSearch style={{ width: 160}}  value={this.state.ou} onSelect={this.selectOu} >
            {ouList1}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          年份：
          <Select showSearch style={{ width: 160}}  value={this.state.shareStateYear} onSelect={this.selectYear}>
            <Option value="2016">2016</Option>
            <Option value="2017">2017</Option>
            <Option value="2018" diasbled>2018</Option>
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {
            list.length !== 0 ?
              <Button type="primary" onClick={this.expExl}>导出</Button>
              :
              <Button disabled onClick={this.expExl}>导出</Button>
          }
          {
            list.length !== 0 ?
              <div style={{marginTop:'10px',textAlign:'right'}}>
                <span><strong>状态：</strong><span style={{color:'red'}}>已发布</span></span>
                <span style={{marginLeft:'10px'}}>金额单位：元</span>
              </div>
              :
              null
          }
          <div id="table1" style={{marginTop:'10px'}}>
            <Table columns={this.columns}
                   dataSource={list}
                   pagination={false}
                   loading={loading}
                   className={styles.financeTable}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { list,ouList } = state.projCostShareStatePub;
  return {
    loading: state.loading.models.projCostShareStatePub,
    list,
    ouList
  };
}

export default connect(mapStateToProps)(projCostShareStatePub);
