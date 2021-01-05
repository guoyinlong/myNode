/**
 * 作者：张楠华
 * 日期：2018-6-25
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：归集账
 */
import React from 'react'
import { connect } from 'dva';
import Styles from '../../../../components/finance/subsidiaryCollect/subsidiaryCollect.less'
import { Tabs, Select, Button, Spin,Collapse,Tooltip,Modal,Input } from 'antd';
import SubsidiaryTab2 from './subsidiaryTab2';
import  BeginEnd from './beginEnd';
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const Option = Select.Option;
const { TextArea } = Input;
class SubsidiaryCollect extends React.Component{
  state={
    query:{
      arg_year: new Date().getFullYear().toString(),
      arg_state_code:'1',
      visible: false,
      reason:''
    },
  };
  //查询
  dataSearch=()=>{
    this.props.dispatch({
      type:'subsidiaryCollect/getData',
      query:this.state.query
    })

  };
  //生成
  insertData=()=>{
    this.props.dispatch({
      type:'subsidiaryCollect/insert_all_summary_data',
      query:this.state.query,
    })
  };
  //发布
  publishData=()=>{
    this.props.dispatch({
      type:'subsidiaryCollect/publishData',
      query:this.state.query,
    })
  };
  //导出发布后才能导出，导出的是某年某月数据
  exportExcel=()=>{
    let {arg_month,arg_year}=this.state.query;
    window.open(`/microservice/cosservice/divided/ExportSummaryExcelAsMonthServlet?arg_state_code=1&arg_month=${arg_month}&arg_year=${arg_year}`)
  };
  //撤销
  inputReason=()=>{
    this.setState({
      visible:true,
    })
  };
  cancelModule=()=>{
    this.setState({
      visible:false,
    })
  };
  revokeData=()=>{
    this.props.dispatch({
      type:'subsidiaryCollect/revokeData',
      query:this.state.query,
      reason:this.state.reason,
    });
    this.setState({
      visible:false,
      reason:'',
    });
  };
  seasonHandle=(e)=>{
    this.setState({
      reason:e.target.value
    })
  };
  //query中包含年月和状态，通过此函数给年月状态赋值
  queryChangeHandle=({key,value})=>{
    this.state.query[key]=value;
    this.setState({})
  };
  render(){
    let {list, tableHeader, currState, loading,summaryData}=this.props;
    return(
      <Spin spinning={loading}>
        <div className={Styles.container}>
          <div className={Styles.searchHead}>
            <div>
              <span>年份</span>
              <span>
                <Select
                  style={{width:'100%'}}
                  placeholder="请选择"
                  onChange={(value)=> this.queryChangeHandle({key:'arg_year',value:value})}
                  value={this.state.query.arg_year}
                >
                <Option value={(new Date().getFullYear()-2).toString()}>{(new Date().getFullYear()-2).toString()}</Option>
                <Option value={(new Date().getFullYear()-1).toString()}>{(new Date().getFullYear()-1).toString()}</Option>
                <Option value={(new Date().getFullYear()).toString()}>{(new Date().getFullYear()).toString()}</Option>
              </Select>
            </span>
            </div>
            <div>
              <span>状态</span>
              <span>
              <Select
                style={{width:'100%'}}
                placeholder="请选择"
                onChange={(value)=>this.queryChangeHandle({key:'arg_state_code',value})}
                value={this.state.query.arg_state_code}
              >
                <Option value="1">已审核</Option>
                <Option value="2">未审核</Option>
              </Select>
            </span>
            </div>
            <div className={Styles.btsGroup}>
              <Button type='primary' onClick={this.dataSearch}>查询</Button>
              <Button type='primary' onClick={this.insertData}>生成</Button>
              <Button type='primary' onClick={this.publishData} disabled={currState!=='2'||!list.length}>发布</Button>
              <Button type='primary' onClick={this.exportExcel} disabled={currState!=='1'||!list.length}>导出</Button>
              <Button type='danger' disabled={currState!=='1'||!list.length} onClick={this.inputReason}>撤销</Button>
            </div>
          </div>
          <div className={Styles.content}>
            {
              list.length !== 0
                ? //两个服务，其中一个服务get_summary_sum_data查询期初期末的信息，还有一些其他的信息待定，不知道哪个服务中，summaryData 代表期初期末数据，tableHeader表头
                <Tabs defaultActiveKey="aa" tabPosition='left'>
                  <TabPane tab='期初期末' key='aa'>
                    <BeginEnd summaryData={summaryData} list={list} tableHeader={tableHeader}/>
                  </TabPane>
                  {
                    list.map((i,index)=>  //两个服务，其中一个服务get_summary_data查询每个项目的信息 data 代表每条数据，tableHeader表头
                      <TabPane tab={<Tooltip title={i.proj_name} placement="topRight"><span className={Styles.titleStyle1}>{i.proj_code}</span></Tooltip>} key={index}>
                        <SubsidiaryTab2 data={i} header={tableHeader}/>
                      </TabPane>)
                  }
                </Tabs>
                :
                <div style={{textAlign:'center',color:'#ccc',minHeight:'500px',paddingTop:'20px'}}>暂无数据</div>
            }
          </div>

          <Modal visible={this.state.visible}
                 title={'撤销原因'}
                 onOk={this.revokeData}
                 onCancel={this.cancelModule}
          >
            <TextArea rows={4} value={this.state.reason} onChange={this.seasonHandle}/>
          </Modal>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps(state) {
  const { list, tableHeader,currState,summaryData} = state.subsidiaryCollect;
  return {
    loading: state.loading.models.subsidiaryCollect,
    list,
    tableHeader,
    currState,
    summaryData
  };
}
export default connect(mapStateToProps)(SubsidiaryCollect)
