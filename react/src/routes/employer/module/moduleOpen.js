/**
 * 作者：张楠华
 * 日期：2017-08-30
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现个人考核开放时间展示功能
 */
import React from 'react';
import {connect} from 'dva';
import { Table,Select,Button} from 'antd';
const Option = Select.Option;
import styles from '../../../components/common/table.less'
import Style from '../../../components/employer/employer.less'
import ModelOpenCrl from './ModelCrl.js';
import ModelOpenAdd from './modelOpenAdd.js'
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
import moment from 'moment';
/**
 * 作者：张楠华
 * 创建日期：2017-08-30
 * 功能：通过后台数据转化季度
 */
function transSeason (text, record) {
  if(record.season == '1'){
    return <div>第一季度</div>
  }
  if(record.season == '2'){
    return <div>第二季度</div>
  }
  if(record.season == '3'){
    return <div>第三季度</div>
  }
  if(record.season == '4'){
    return <div>第四季度</div>
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-08-30
 * 功能：点击修改，弹出模态框，修改开放时间和结束时间
 */
function operation (text, record,ss){
    if(record.tag == '0'){
      return (
        <div className={Style.btnWrap2} style={{textAlign:'center'}}>
          <a  className = {Style["time-detail"]+' '+Style.timeTag} onClick={()=>ss.refs.ModalOpenCrl.showModal(record)}>{'修改'}</a>
        </div>
      )
    }if(record.tag == '1'){
      return(
        <div className={Style.btnWrap2} style={{textAlign:'center'}}>
          <a  className = {Style.timeTag} style={{border:'1px solid #c0c0c0',color:'#c0c0c0',cursor:"default"}}>{'修改'}</a>
        </div>
      )
    }
}
/**
 * 作者：张楠华
 * 创建日期：2017-08-30
 * 功能：格式化开始时间
 */
function beginTimeMoment ( text,record){
  let begin_time=moment(record.startTime).format(dateFormat);
  return (
    <div>
      {begin_time}
    </div>
  )
}
/**
 * 作者：张楠华
 * 创建日期：2017-08-30
 * 功能：格式化截止时间
 */
function endTimeMoment ( text,record){
  let end_time=moment(record.endTime).format(dateFormat);
  return (
    <div>
      {end_time}
    </div>
  )
}
/**
 * 作者：张楠华
 * 创建日期：2017-08-30
 * 功能：展示开发时间界面信息
 */
class ResultCtrl extends React.Component{
  constructor(props){
    super(props);
    this.state={
      year_type:new Date().getFullYear().toString(),
      season_type:Math.floor((new Date().getMonth() + 1 + 2) / 3).toString(),
    }
  }
  //表格数据
  columns = [
    {
      title: '序号',
      dataIndex: '',
      key:'index',
      render: (text, record,index) => {return (index+1)},
    },
    {
      title: '年度',
      dataIndex: 'years',
    },
    {
      title: '季度',
      dataIndex: 'season',
      render: (text, record) => transSeason(text, record),
    },
    {
      title: '考核阶段',
      dataIndex: 'stageName',
    },
    {
      title: '开放时间',
      dataIndex: 'startTime',
      render:(text,record)=>beginTimeMoment(text,record)
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render:(text,record)=>endTimeMoment(text,record)
    },
    {
      title: '操作',
      render:(text,record)=>operation(text,record,this)
    }];
  /**
   * 作者：张楠华
   * 创建日期：2017-08-30
   * 功能：时间更新，dispath到module再与后台交互
   */
  timeUpdate=(value,stageName,years,season)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'moduleOpen/updateTime',
      value,
      stageName,
      years,
      season,
    })
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-08-30
   * 功能：点击添加，添加考核阶段
   */
  examPhaseAdd=(values)=>{
    const {dispatch} = this.props;
    const {year_type,season_type}=this.state;
    dispatch({
      type:'moduleOpen/examPhaseAdd',
      values,
      year_type,
      season_type,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-08-30
   * 功能：点击查询，查询某年某季度的考核阶段开放时间
   */
  queryState=()=>{
    const {dispatch} = this.props;
    const {year_type,season_type}=this.state;
    dispatch({
      type:'moduleOpen/queryState',
      year_type,
      season_type,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-08-30
   * 功能：改变年份
   */
  changeYear=(value)=> {
    this.setState({
      year_type:value,
    })
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-08-30
   * 功能：改变季节
   */
  changeSeason=(value)=> {
    this.setState({
      season_type:value,
    })
  };
  render() {
    const {list,loading}=this.props;
    //table每一行需要一个key值
    if(list.length){
      list.map((i,index)=>{
        i.key=index;
      })
    }
    return(
        <div className={Style.wrap}>
          <div>
            年度：
            <Select showSearch style={{width: 200}} value={this.state.year_type}
             defaultValue={new Date().getFullYear().toString()} onSelect={this.changeYear}>
              <Option value="2020">2020</Option>
              <Option value="2019">2019</Option>
              <Option value="2018">2018</Option>
              <Option value="2017">2017</Option>
              <Option value="2016">2016</Option>
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;
            季度：
            <Select showSearch style={{width: 200}} value={this.state.season_type}
                    defaultValue={Math.floor((new Date().getMonth() + 1 + 2) / 3).toString()} onSelect={this.changeSeason}>
              <Option value="1">第一季度</Option>
              <Option value="2">第二季度</Option>
              <Option value="3">第三季度</Option>
              <Option value="4">第四季度</Option>
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" icon="search" onClick={this.queryState}>查询</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" icon="plus-circle-o" onClick={()=>this.refs.ModelOpenAdd.showModal()}>新增</Button>
          </div>
          <h3 className={Style.Title1} style={{marginTop:'10px'}}>考核阶段开放时间</h3>
          <Table columns={this.columns}
               dataSource={list.filter(item => item.tag !== '2')}
               pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
               loading={loading}
               className={styles.orderTable}
          />
          <ModelOpenCrl ref='ModalOpenCrl' timeUpdate={this.timeUpdate} list={list} />
          <ModelOpenAdd ref='ModelOpenAdd' examPhaseAdd={this.examPhaseAdd}/>
        </div>
    )
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-08-30
 * 功能：mapStateToProps函数：链接models层和routes层
 */
function mapStateToProps (state) {
  const {list} = state.moduleOpen;
  return {
    loading: state.loading.models.moduleOpen,
    list,
  };
}

export default connect(mapStateToProps)(ResultCtrl);
