/**
 *  作者: 张楠华
 *  创建日期: 2018-2-7
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：项目工时数据统计。
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../../components/employer/employer.less';
import { Button, Tabs,Select,message,Spin,Table } from 'antd';
import tableStyle from '../../../../components/finance/fundingPlanTable.less'
const TabPane = Tabs.TabPane; //标签组
const Option = Select.Option;
let yearList = function(year) {
  let yearList = [];
  for(let i=0;i<(new Date().getFullYear()-year);i++){
    yearList.push(new Date().getFullYear()-i);
  }
  return yearList;
};
class SeasonProjWork extends React.Component{

  constructor(props){
    super(props);
    this.state={
      //考核项目工作量.
      projExamYear:new Date().getFullYear().toString(),
      projExamSeason:'',
    }
  }
  //季度考核项目工作量11
  queryProjExamSeason=(value)=>{
    const { dispatch } = this.props;
    this.setState({projExamSeason:value});
    if(value === ''){
      message.info('请选择季度');
    }else {
      dispatch({
        type: 'worktimeDataStatistics/queryProjExam',
        projExamSeason : value,
        projExamYear : this.state.projExamYear
      });
    }
  };
  queryProjExamYear=(value)=>{
    const { dispatch } = this.props;
    this.setState({projExamYear:value});
    if(this.state.projExamSeason === ''){
      console.log('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/queryProjExam',
        projExamYear : value,
        projExamSeason : this.state.projExamSeason
      });
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
  backData=()=>{
    const { dispatch } = this.props;
    if(this.state.projExamSeason === ''){
      message.info('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/backProjExam',
        ...this.state
      });
    }
  };
  exportExamList=()=>{
    if(this.state.projExamSeason){
      let exportUrl='/microservice/alltimesheet/timesheet/ExportExamineWorkload?'+'arg_year='+this.state.projExamYear+'&arg_season='+this.state.projExamSeason;
      window.open(exportUrl);
    }else{
      message.info('请选择季度');
    }
  };
  render() {
    const columns = [
      {
        title: '项目id',
        dataIndex: 'proj_id',
      },
      {
        title: '生产编码',
        dataIndex: 'proj_code',
      },
      {
        title: '团队名称',
        dataIndex: 'proj_name',
      },
      {
        title: '自有工作量（人月）',
        dataIndex: 'total_work',
      },
      {
        title: '外协工作量（人月）',
        dataIndex: 'out_person_work',
      },
      {
        title: '软研院工作量',
        dataIndex: 'season_work',
      },
      {
        title: '季度年化',
        dataIndex: 'population_year',
      }
    ];

    const { examList } = this.props;
    if (examList.length) {
      examList.map((i, index) => {
        i.key = index;
      })
    }

    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          {
            this.props.noRule  ?
              <div>
                <div style={{textAlign:'left',paddingLeft:'15px'}}>
                  <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>年份：
                    <Select showSearch style={{ width: 160}}  value={this.state.projExamYear} onSelect={this.queryProjExamYear} >
                      {yearList(2015) && yearList(2015).length && yearList(2015).map((item) => {return (<Option key={item}>{item}</Option>)})}
                    </Select>
                  </div>
                  <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>季度：
                    <Select showSearch style={{width: 160}} placeholder="请选择季度"  onSelect={this.queryProjExamSeason}>
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
                          <Button onClick={this.generateData} type="primary" disabled={this.props.have_generate === '1' || this.props.have_generate ===''}>生成</Button>&nbsp;&nbsp;
                          <Button onClick={this.backData} type="primary" disabled={this.props.have_generate !== '1'}>撤销</Button>&nbsp;&nbsp;
                        </span>
                        :
                        null
                    }
                    <Button onClick={this.exportExamList} type="primary" disabled={ examList.length ===0 }>导出</Button>&nbsp;&nbsp;
                  </div>
                </div>
                <div style={{marginTop: '20px'}}>
                  <Table columns={columns}
                         dataSource={this.props.examList}
                         pagination={true}
                         className={tableStyle.financeTable}
                  />
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
export default connect(mapStateToProps)(SeasonProjWork);
