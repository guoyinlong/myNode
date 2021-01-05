/**
 * 作者：张楠华
 * 日期：2017-8-1
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：科技创新工时占比
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../../components/employer/employer.less';
import {Table,Select,DatePicker,Button,message,Spin,Collapse,Modal} from 'antd';
import tableStyle from '../../../../components/finance/fundingPlanTable.less'
const Option = Select.Option;
const Panel = Collapse.Panel;
const dateFormat = 'YYYY-MM';
const { MonthPicker } = DatePicker;
import moment from 'moment';
class techInnovateTimeSheet extends React.Component{
  constructor(props){
    super(props)
  }
  state={};
  changeState = (...arg) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'techInnovateTimeSheet/changeState',
      arg,
    })
  };
  changeStateS = (...arg) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'techInnovateTimeSheet/changeStateS',
      arg,
    })
  };
  generateTechData =(flag)=>{
    if( flag === 'confirm'){
      this.props.dispatch({
        type:'techInnovateTimeSheet/generateTechData',
      })
    }
    this.changeState(false,'generateModule');
  };
  backTechData =(flag)=>{
    if( flag === 'confirm'){
      this.props.dispatch({
        type:'techInnovateTimeSheet/backTechData',
      })
    }
    this.changeState(false,'cancelModule');
  };
  exportTechData =()=>{
    const { yearMonth,ou } = this.props;
    let exportUrl;
    if(ou ==='联通软件研究院'){
      exportUrl='/microservice/alltimesheet/timesheet/ExportTechnologicalInnovationData?'+'arg_this_year='+yearMonth.format(dateFormat).split('-')[0]+'&arg_this_month='+yearMonth.format(dateFormat).split('-')[1];
    }else{
     exportUrl='/microservice/alltimesheet/timesheet/ExportTechnologicalInnovationData?'+'arg_this_year='+yearMonth.format(dateFormat).split('-')[0]+'&arg_this_month='+yearMonth.format(dateFormat).split('-')[1]+'&arg_staff_ou='+ou;
    }
    window.open(exportUrl);
  };
  render() {
    const { ouList,list,yearMonth,ou,beginTime,endTime,yearMonthBack,generateModule,cancelModule,loading } = this.props;
    const columns = [
      {
        title: '生产编码',
        dataIndex: 'proj_code',
      },
      {
        title: 'PMS项目编码',
        dataIndex: 'pms_code',
      },
      {
        title: 'PMS项目名称',
        dataIndex: 'pms_name',
      },
      {
        title: '团队名称',
        dataIndex: 'proj_name',
      },
      {
        title: '员工部门',
        dataIndex: 'staff_deptname',
        render:(text)=>{return(<div>{text.includes('-')?text.split('-')[1]:text}</div>)}
      },
      {
        title: '员工编号',
        dataIndex: 'staff_id',
        width:'88px'
      },
      {
        title: '员工姓名',
        dataIndex: 'full_name',
        width:'88px'
      },
      {
        title: '所填工时',
        dataIndex: 'month_hours',
        width:'68px'
      },
      {
        title: '工时占比',
        dataIndex: 'ratio',
        width:'68px'
      }
    ];
    if(list.length !== 0){
      list.map((i,index)=>{
        let ratioList = JSON.parse(i.ratio_list);
        ratioList.map((ii,indexs)=>{
          ii.key = index+'-'+indexs;
        });
        i.ratioList = ratioList;
      })
    }
    return (
      <Spin tip="加载中" spinning={loading}>
        <div className={Style.wrap}>
        {
          this.props.noRule ?
            <div>
              <div>
                <div style={{display:'inline-block',marginTop:'10px'}}>
                  年月：
                  <MonthPicker
                    onChange={(value)=>this.changeStateS(value,'yearMonth')}
                    value={yearMonth}
                    allowClear={false}
                  />
                </div>
                <div style={{display:'inline-block',marginTop:'10px',margin: '0 20px'}}>员工OU：
                  <Select style={{ width: 160}}  value={ou} onSelect={(value)=>this.changeStateS(value,'ou')} >
                    {ouList.map((item) => {return (<Option key={item.dept_name}>{item.dept_name}</Option>)})}
                  </Select>
                </div>
                <Button type="primary" onClick={this.exportTechData} disabled={ list.length === 0 }>导出</Button>
              </div>
              {
                this.props.HasAuth === '1' ?
                  <div style={{textAlign:'right'}}>
                    <Button type="primary" onClick={()=>this.changeState(true,'generateModule')}>生成</Button>&nbsp;&nbsp;
                    <Button type="primary" onClick={()=>this.changeState(true,'cancelModule')}>撤销</Button>&nbsp;&nbsp;
                  </div>
                  :null
              }
              <Modal
                title={'联通软件研究院'}
                visible={generateModule}
                onOk={()=>this.generateTechData('confirm')}
                onCancel={()=>this.generateTechData('cancel')}
              >
                <div>
                  <div style={{marginTop:'10px',textAlign:'center'}}>
                    开始时间：
                    <DatePicker
                      onChange={(value)=>this.changeState(value,'beginTime')}
                      value={beginTime}
                      allowClear={false}
                    />
                  </div>
                  <div style={{marginTop:'10px',textAlign:'center'}}>
                    结束时间：
                    <DatePicker
                      onChange={(value)=>this.changeState(value,'endTime')}
                      value={endTime}
                      allowClear={false}
                    />
                  </div>
                  <p style={{marginTop: '20px',color: 'red'}}>您将要生成：{endTime.format('YYYY-MM')}全院的数据</p>
                </div>
              </Modal>
              <Modal
                title={'联通软件研究院'}
                visible={cancelModule}
                onOk={()=>this.backTechData('confirm')}
                onCancel={()=>this.backTechData('cancel')}
              >
                <div style={{textAlign:'center'}}>
                    年月：
                    <MonthPicker
                      onChange={(value)=>this.changeState(value,'yearMonthBack')}
                      value={yearMonthBack}
                      allowClear={false}
                    />
                </div>
                <p style={{marginTop: '20px',color: 'red'}}>您将要撤销：{yearMonthBack.format('YYYY-MM')}全院的数据</p>
              </Modal>
              {
                list.length ?
                  <div style={{marginTop:'30px'}}>
                    <Collapse>
                      {
                        list.map((i, index) => {
                          return (
                            <Panel header={i.pms_name} key={index}>
                              <div style={{marginTop: '20px'}}>
                                <Table columns={columns}
                                       dataSource={i.ratioList}
                                       className={tableStyle.financeTable}
                                       pagination={true}
                                />
                              </div>
                            </Panel>
                          )
                        })
                      }
                    </Collapse>
                  </div>
                  :
                  <div style={{textAlign: 'center', color: '#ccc', minHeight: '500px', paddingTop: '50px'}}>暂无数据</div>
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
    loading: state.loading.models.techInnovateTimeSheet,
    ...state.techInnovateTimeSheet
  };
}
export default connect(mapStateToProps)(techInnovateTimeSheet);
