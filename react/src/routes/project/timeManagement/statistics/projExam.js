/**
 *  作者: 张楠华
 *  创建日期: 2018-2-7
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：项目工时数据统计。
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../../components/employer/employer.less';
import { Button, Tabs,Select,message,Spin } from 'antd';
const TabPane = Tabs.TabPane; //标签组
const Option = Select.Option;
import  TableSearch  from './tableSearch.js'
let yearList = function(year) {
  let yearList = [];
  for(let i=0;i<(new Date().getFullYear()-year);i++){
    yearList.push(new Date().getFullYear()-i);
  }
  return yearList;
};
class ProjExam extends React.Component{

  constructor(props){
    super(props);
    this.state={

      //工时考核得分
      timeSheetSeason:'',
      timeSheetYear:new Date().getFullYear().toString(),

    }
  }

  //员工工时考核得分
  changeTimeSheetYear=(value)=>{
    const { dispatch } = this.props;
    this.setState({timeSheetYear:value});
    if(this.state.timeSheetSeason === ''){
      console.log('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/queryTimeSheetScore',
        timeSheetYear:value,
        timeSheetSeason : this.state.timeSheetSeason
      });
    }
  };
  changeTimeSheetSeason=(value)=>{
    const { dispatch } = this.props;
    this.setState({timeSheetSeason:value});
    if(value === ''){
      message.info('请选择季度');
    }else {
      dispatch({
        type: 'worktimeDataStatistics/queryTimeSheetScore',
        timeSheetYear: this.state.timeSheetYear,
        timeSheetSeason:value
      });
    }
  };
  generateScoreData=()=>{
    const { dispatch } = this.props;
    if(this.state.timeSheetSeason === ''){
      message.info('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/generateScoreData',
        ...this.state
      });
    }
  };
  backScoreData=()=>{
    const { dispatch } = this.props;
    if(this.state.timeSheetSeason === ''){
      message.info('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/backScoreData',
        ...this.state
      });
    }
  };
  exportTab5=()=>{
    if(this.state.timeSheetSeason !== ''){
      let exportUrl='/microservice/alltimesheet/timesheet/TimesheetExamineStaffScore?'+'arg_year='+this.state.timeSheetYear+'&arg_season='+this.state.timeSheetSeason;
      window.open(exportUrl);
    }else{
      message.info('请选择季度');
    }
  };

  generateData=()=>{
    const { dispatch } = this.props;
    if(this.state.projExamSeason === ''){
      message.info('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/generateProjExam',
        ...this.state
      });
    }
  };

  render() {

    const columnsScore = [
      {
        title: '员工编号',
        dataIndex: 'staff_id',
        width:'90px',
      },
      {
        title: '员工名称',
        dataIndex: 'full_name',
        width:'110px',
      },
      {
        title: '生产编码',
        dataIndex: 'proj_id',
        width:'110px',
      },
      {
        title: '团队名称',
        dataIndex: 'proj_name',
      },
      {
        title: '系统总工时',
        dataIndex: 'total',
      },
      {
        title: '应填工时',
        dataIndex: 'whole',
      },
      {
        title: '分数',
        dataIndex: 'score',
        width:'90px',
      }
    ];
    const {scoreList} = this.props;
    if (scoreList.length) {
      scoreList.map((i, index) => {
        i.key = index;
      })
    }
    const needSearch=['full_name','proj_id','score'];
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          {
            this.props.noRule  ?
              <div>
                <div style={{textAlign:'left',paddingLeft:'15px'}}>
                  <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>年份：
                    <Select showSearch style={{ width: 160}}  value={this.state.timeSheetYear} onSelect={this.changeTimeSheetYear} >
                      {yearList(2015) && yearList(2015).length && yearList(2015).map((item) => {return (<Option key={item}>{item}</Option>)})}
                    </Select>
                  </div>
                  <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>季度：
                    <Select showSearch style={{width: 160}} placeholder="请选择季度"  onSelect={this.changeTimeSheetSeason}>
                      <Option value="1">第一季度</Option>
                      <Option value="2">第二季度</Option>
                      <Option value="3">第三季度</Option>
                      <Option value="4">第四季度</Option>
                    </Select>
                  </div>
                  <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>
                    {
                      this.props.HasAuth === '1'?
                        <span>
                          <Button onClick={this.generateScoreData} type="primary" disabled={this.props.hasData === '1' || this.props.hasData === ''}>生成</Button>&nbsp;&nbsp;
                          <Button onClick={this.backScoreData} type="primary" disabled={this.props.hasData !== '1'}>撤销</Button>&nbsp;&nbsp;
                        </span>
                        :
                        null
                    }
                    <Button type="primary" onClick={this.exportTab5} disabled={this.props.scoreList.length === 0}>导出</Button>
                  </div>
                </div>
                <div style={{marginTop: '20px'}}>
                  <TableSearch columns = {columnsScore} dataSource={this.props.scoreList} needSearch={needSearch} dispatch={this.props.dispatch}/>
                  {/*<Table columns={columnsScore}*/}
                  {/*dataSource={this.props.scoreList}*/}
                  {/*pagination={true}*/}
                  {/*className={tableStyle.financeTable}*/}
                  {/*/>*/}
                </div>
              </div>
              :
              null
          }
        </div>
      </Spin>
    );
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.worktimeDataStatistics,
    ...state.worktimeDataStatistics
  };
}
export default connect(mapStateToProps)(ProjExam);
