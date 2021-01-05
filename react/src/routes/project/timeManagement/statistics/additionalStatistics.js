/**
 *  作者: 张楠华
 *  创建日期: 2018-2-7
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：项目工时数据统计。
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../../components/employer/employer.less';
import style from '../review/review.less';
import tableStyle from '../../../../components/finance/fundingPlanTable.less'
import { Button,Select,message,Spin,Table,Pagination,Radio,Input,DatePicker } from 'antd';
import moment from 'moment'
const Option = Select.Option;
const RadioGroup = Radio.Group;
const MonthPicker = DatePicker.MonthPicker;
class additionalStatistics extends React.Component{

  changeState = (...arg) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'additionalStatistics/changeState',
      arg,
    })
  };
  changeStatisticType = (value) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'additionalStatistics/changeStatisticType',
      value,
    })
  };
  changeProj= (value) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'additionalStatistics/changeProj',
      value,
    })
  };
  changeCode= (value) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'additionalStatistics/changeCode',
      value,
    })
  };
  queryData= () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'additionalStatistics/technologicalSearch',
      page:1
    })
  };
  clearData= () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'additionalStatistics/clearTechnologicalSearch',
      page:1
    })
  };
  handlePageChange = (page) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'additionalStatistics/technologicalSearch',
      page
    });
  };
  exportExl= () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'additionalStatistics/exportExl',
    });
  };
  render() {
    const { list,queryStyle,pmsProj,statisticType,staffName,beginTime,endTime,projCode,projName } = this.props;
    list.length && list.forEach((i,index)=>{i.key = index});
    let columns1=[
      {
        title:'PMS项目编码',
        dataIndex:'pms_name',
      },
      {
        title:'PMS项目名称',
        dataIndex:'pms_code',
      },
    ];
    let columns2 = [
      {
        title:'员工编号',
        dataIndex:'staff_id',
      },
      {
        title:'员工姓名',
        dataIndex:'staff_name',
      },
    ];
    let columns3 = [
      {
        title:'工时占比合计',
        dataIndex:'sum_proj_ratio',
      },
    ];
    let columns = [];
    if(queryStyle === '0'){
      columns = columns1.concat(columns3)
    }else if(queryStyle === '1' ){
      columns = columns1.concat(columns2).concat(columns3)
    }
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          <div className={style.title}>
            <span>
              查询方式：
              <RadioGroup onChange={(e)=>this.changeState(e.target.value,'queryStyle')} value={queryStyle}>
                <Radio value={'0'}>项目查询</Radio>
                <Radio value={'1'}>员工查询</Radio>
              </RadioGroup>
            </span>
          </div>
          <div className={style.title}>
            <span>
              PMS项目：
              <Select
                showSearch
                style={{ width: 400}}
                optionFilterProp="children"
                onChange={this.changeProj}
                value={projName}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                { pmsProj.map((i,index)=>{return(<Option value={i.pms_name} key={index}>{i.pms_name}</Option>)})}
              </Select>
            </span>
            <span>
              PMS项目编码：
              <Select
                showSearch
                style={{ width: 150 }}
                optionFilterProp="children"
                onChange={this.changeCode}
                value={projCode}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                { pmsProj.map((i,index)=>{return(<Option value={i.pms_code} key={index}>{i.pms_code}</Option>)})}
              </Select>
            </span>
            {
              queryStyle === '1' ?
                <span>
                  员工：<Input onChange={(e)=>this.changeState(e.target.value,'staffName')} value={staffName} style={{ width: 150 }}/>
                </span>
                :
                null
            }
          </div>
          <div className={style.title}>
            <span>
              统计类型：
              <Select onChange={this.changeStatisticType} value={statisticType} style={{width:200}}>
                <Option value={'本月'}>{'本月'}</Option>
                <Option value={'年度'}>{'年度'}</Option>
                <Option value={'项目至今'}>{'项目至今'}</Option>
                <Option value={'自定义'}>{'自定义'}</Option>
              </Select>
            </span>
            <span>开始时间：<MonthPicker disabled={statisticType !=='自定义'} onChange={(value)=>this.changeState(value,'beginTime')} value={beginTime}/></span>~
            <span>结束时间：<MonthPicker disabled={statisticType !=='自定义'} onChange={(value)=>this.changeState(value,'endTime')} value={endTime}/></span>
          </div>
          <div style={{margin:'10px 0',textAlign:'right'}}>
            <Button onClick={this.queryData} type="primary"> 查询 </Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={this.clearData} type="primary"> 清空 </Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={this.exportExl} type="primary"> 导出 </Button>
          </div>
          <div>
            <Table columns={columns} dataSource={list} className={tableStyle.financeTable} pagination={false}/>
            <div style={{textAlign:'center',marginTop:'10px'}}>
              <Pagination
                defaultCurrent={1}
                total={Number(this.props.RowCount)}
                pageSize={10}
                onChange={this.handlePageChange}
                current = {Number(this.props.page)}
              />
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.additionalStatistics,
    ...state.additionalStatistics
  };
}
export default connect(mapStateToProps)(additionalStatistics);
