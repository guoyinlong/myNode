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
import { Button, Tabs,Select,message,Spin,Table,Pagination } from 'antd';
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
class worktimeDataStatistics extends React.Component{

  constructor(props){
    super(props);
    this.state={

      //项目考核系数
      projYear:new Date().getFullYear().toString(),
      projSeason:'',
      projOU:localStorage.ou,
      page : 1,

    }
  }
//员工项目考核系数
  generateExam=()=>{
    const { dispatch } = this.props;
    if(this.state.projSeason === ''){
      message.info('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/generateProjRatio',
        ...this.state
      });
    }
  };
  backExam=()=>{
    const { dispatch } = this.props;
    if(this.state.projSeason === ''){
      message.info('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/backProjRatio',
        ...this.state
      });
    }
  };
  exportProjExamRatio=()=>{
    if(this.state.projSeason !== ''){
      let exportUrl='/microservice/alltimesheet/timesheet/TimesheetExamineRatio?'+'arg_this_year='+this.state.projYear+'&arg_this_season='+this.state.projSeason+'&arg_ou_name='+this.state.projOU;
      window.open(exportUrl);
    }else{
      message.info('请选择季度');
    }
  };
  queryProjExamRatioSeason=(value)=>{
    const { dispatch } = this.props;
    this.setState({projSeason:value});
    if(value === ''){
      message.info('请选择季度');
    }else {
      dispatch({
        type: 'worktimeDataStatistics/queryProjRatio',
        projSeason : value,
        projYear : this.state.projYear,
        projOU : this.state.projOU,
        page : this.state.page
      });
    }
  };
  queryProjExamRatioYear=(value)=>{
    const { dispatch } = this.props;
    this.setState({projYear:value});
    if(this.state.projSeason === ''){
      console.log('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/queryProjRatio',
        projYear : value,
        projSeason : this.state.projSeason,
        projOU : this.state.projOU,
        page : this.state.page
      });
    }
  };
  queryProjExamRatioOU=(value)=>{
    const { dispatch } = this.props;
    this.setState({projOU:value});
    if(this.state.projSeason === ''){
      message.info('请选择季度');
    }else{
      dispatch({
        type:'worktimeDataStatistics/queryProjRatio',
        projOU : value,
        projSeason : this.state.projSeason,
        projYear : this.state.projYear,
        page : this.state.page
      });
    }
  };
  changePage = (page) => {
    const { dispatch } = this.props;
    this.setState({
      page:page,
    });
    dispatch({
      type:'worktimeDataStatistics/queryProjRatio',
      projOU : this.state.projOU,
      projSeason : this.state.projSeason,
      projYear : this.state.projYear,
      page : page
    })
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

    const columnsProj = [
      {
        title: '序号',
        dataIndex: 'staff_sort',
      },
      {
        title: 'ou名称',
        dataIndex: 'ou_name',
      },
      {
        title: '员工id',
        dataIndex: 'staff_id',
      },
      {
        title: '员工姓名',
        dataIndex: 'staff_name',
      },
      {
        title: '部门名称',
        dataIndex: 'staff_dept_name',
      },
      {
        title: '项目系数',
        dataIndex: 'proj_ratio',
      },
      {
        title: '项目考核系数',
        dataIndex: 'proj_exam_ratio',
      }
    ];

    const {ouList,projRatioList,Rowcount} = this.props;
    if (projRatioList.length) {
      projRatioList.map((i, index) => {
        i.key = index;
      })
    }
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          {
            this.props.noRule  ?
              <div style={{textAlign:'left',paddingLeft:'15px'}}>
                <div>
                  <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>年份：
                    <Select showSearch style={{ width: 100}}  value={this.state.projYear} onSelect={this.queryProjExamRatioYear} >
                      {yearList(2015) && yearList(2015).length && yearList(2015).map((item) => {return (<Option key={item}>{item}</Option>)})}
                    </Select>
                  </div>
                  <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>季度：
                    <Select showSearch style={{width: 120}} placeholder="请选择季度"  onSelect={this.queryProjExamRatioSeason}>
                      <Option value="0">年度</Option>
                      <Option value="1">第一季度</Option>
                      <Option value="2">第二季度</Option>
                      <Option value="3">第三季度</Option>
                      <Option value="4">第四季度</Option>
                    </Select>
                  </div>
                  <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>OU：
                    <Select onChange={this.queryProjExamRatioOU} value={this.state.projOU} style={{width:'180px'}}>
                      {ouList.map((item) => {return (<Option key={item.dept_name}>{item.dept_name}</Option>)})}
                    </Select>
                  </div>
                  <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>
                    {
                      this.props.HasAuth === '1' ?
                       <span>
                         <Button type="primary" onClick={this.generateExam} disabled={this.props.has_num === '1' || this.props.isGen === '0' }>生成</Button>&nbsp;&nbsp;
                         <Button type="primary" onClick={this.backExam} disabled={this.props.has_num !== '1' ||this.props.IsSyn === true }>撤销</Button>&nbsp;&nbsp;
                       </span>
                        :
                        null
                    }
                    <Button type="primary" onClick={this.exportProjExamRatio} disabled={this.props.projRatioList.length === 0}>导出</Button>
                  </div>
                </div>
                <div style={{marginTop: '20px'}}>
                  <Table columns={columnsProj}
                         dataSource={this.props.projRatioList}
                         pagination={false}
                         className={tableStyle.financeTable}
                  />
                </div>
                {this.props.loading !== true?
                  (Rowcount != 0? <div className={style.page}>
                    <Pagination current={this.state.page}
                                total={Number(Rowcount)}
                                pageSize={10}
                                defaultCurrent={1}
                                onChange={this.changePage}
                    />
                  </div> : [])
                  :
                  null
                }
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
export default connect(mapStateToProps)(worktimeDataStatistics);
