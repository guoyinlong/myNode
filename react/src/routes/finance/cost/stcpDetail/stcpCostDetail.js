/**
 * 作者：杨青
 * 日期：2018-5-8
 * 邮箱：yangq416@chinaunicom.cn
 * 文件说明：科技创新项目支出明细表
 */
import React from 'react';
import {connect } from 'dva';
import {Table, Input, Button, message, DatePicker, Tabs,  Select,  Divider,  Spin, Col, Row} from 'antd';
import style from '../../../../components/finance/table.less';
import moment from 'moment';
import { exportExlOneStcpProjCostDetail } from './exportExlOneStcpProjCostDetail';
import { exportExlAllStcpProjCostDetail } from './exportExlAllStcpProjCostDetail';
import commonStyle from '../costCommon.css';
const TabPane = Tabs.TabPane;
const { MonthPicker } = DatePicker;
const Option = Select.Option;

class StcpCostDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      projCode:'请选择项目名称',
      textValue:'',
      year:'',
      month:'',
    };
  }
  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：科技创新项目支出明细表--月份改变时，进行查询
   */
  onChangeDatePickerOne=(date, dateString)=>{
    if (dateString!==''){
      let year = dateString.split("-")[0];
      let month = parseInt(dateString.split("-")[1]);
      this.setState({
        year:year,
        month:month,
      });
      let searchData={
        arg_total_year:year,
        arg_total_month:month,
        arg_total_type:'3',
        arg_pms_proj_code:this.state.projCode,
      };
      this.searchOneStcpProjCostDetail(searchData);
    }
  }
  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：科技创新项目支出汇总表--月份改变时，进行查询
   */
  onChangeDatePickerAll=(date, dateString)=>{
    if (dateString!==''){
      let stcpAllYear = dateString.split("-")[0];
      let stcpAllMonth = parseInt(dateString.split("-")[1]);
      let searchData={
        arg_total_year:stcpAllYear,
        arg_total_month:stcpAllMonth,
        arg_total_type:'3',
      };
      const {dispatch}=this.props;
      dispatch({
        type:'stcpCostDetail/searchAllStcpProjCostDetail',
        searchData:searchData,
      });
    }
  }
  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：限制月份的选择
   */
  disabledDate=(value)=>{
    const time =  new Date().toLocaleDateString();
    if(value){
      var lastDateValue =  moment(time).valueOf();
      return value.valueOf() >= lastDateValue
    }
  }
  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：标签切换时执行
   */
  callback = (key) => {
    //console.log(key);
  };

  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：改变项目名称
   */
  handleProjNameChange = (value) => {
    this.setState({
      projCode:value,
      textValue:value,
    });
    let searchData={
      arg_total_year:this.state.year===''?this.props.year:this.state.year,
      arg_total_month:this.state.month===''?this.props.month:this.state.month,
      arg_total_type:'3',
      arg_pms_proj_code:value,
    };
    this.searchOneStcpProjCostDetail(searchData);
  };
  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：输入项目编号
   */
  handleProjCodeChange = (e) => {
    if (e.target.value.length ===14){
      this.setState ({
        projCode: e.target.value,
      });
      let searchData={
        arg_total_year:this.state.year===''?this.props.year:this.state.year,
        arg_total_month:this.state.month===''?this.props.month:this.state.month,
        arg_total_type:'3',
        arg_pms_proj_code:e.target.value,
      };
      this.searchOneStcpProjCostDetail(searchData);
    }else if(e.target.value !==''){
      message.info('请输入正确的项目编号');
    }
  };
  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：输入项目编号
   */
  changeText = (e) => {
    this.setState ({
      textValue: e.target.value,
    });
  };
  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：查询某个科技创新项目的支出明细
   */
  searchOneStcpProjCostDetail = (searchData)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'stcpCostDetail/searchOneStcpProjCostDetail',
      searchData:searchData,
    });
  };
  isInArray =(projListData,projCode)=>{
    for(let i = 0; i < projListData.length; i++){
      if(projCode === projListData[i].pms_proj_code){
        return true;
      }
    }
    return false;
  };
  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：导出科技创新项目支出明细表
   */
  expExlOne=()=>{
    const {oneProjDetail,oneProjColumns, projName, projCode, rowNum } = this.props;
    if(oneProjDetail !== null && oneProjDetail.length !== 0){
      exportExlOneStcpProjCostDetail(oneProjDetail, "科技创新项目支出明细表", projName, projCode, oneProjColumns, rowNum)
    }else{
      message.info("查询结果为空！")
    }
  };
  /**
   * 作者：杨青
   * 创建日期：2018-05-10
   * 功能：导出科技创新项目支出汇总表
   */
  expExlAll =()=>{
    const {allProjColumns,allProjDetail, rowNum } = this.props;
    if(allProjDetail !== null && allProjDetail.length !== 0){
      exportExlAllStcpProjCostDetail(allProjDetail, "科技创新项目支出汇总表", allProjColumns, rowNum)
    }else{
      message.info("查询结果为空！")
    }
  };
  render() {
    const{ projList, projName, projCode, oneProjDetail, allProjDetail } = this.props;
    const projNameList = projList.map((item) => {
      return (
        <Option key={item.pms_proj_code}>
          {item.pms_proj_name}
        </Option>
      )
    });
    let time;
    if (this.state.year===''){
      time = this.props.year+'-'+this.props.month;
    }else{
      time = this.state.year+'-'+this.state.month;
    }
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={commonStyle.container}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="科技创新项目支出明细表" key="1">
              <span>
                {'月份：'}
                <MonthPicker onChange={this.onChangeDatePickerOne} value={moment(time,'YYYY-MM')} disabledDate = {this.disabledDate}/>
              </span>&nbsp;&nbsp;
              <span style={{display:'inline-block',marginTop:'10px'}}>{'项目名称：'}
                <Select showSearch
                    optionFilterProp="children"
                    dropdownMatchSelectWidth={false}
                    onChange={this.handleProjNameChange} value={this.isInArray(projList,this.state.projCode) === false?'请选择项目名称':this.state.projCode} style={{width:'400px'}}>
                  <Option value='请选择项目名称'>{'请选择项目名称'}</Option>
                    {projNameList}
                </Select>
              </span>&nbsp;&nbsp;
              <span style={{display:'inline-block',marginRight:'20px'}}>
                {'项目编码：'}
                <Input
                  style={{width:'150px'}}
                  placeholder="可输入项目编码查询"
                  onBlur={this.handleProjCodeChange}
                  onChange={this.changeText}
                  value={this.isInArray(projList,this.state.projCode) === false?'':this.state.textValue}
                />
              </span>&nbsp;&nbsp;
              <span>

                  <Button type="primary" style={{marginRight: '10px', marginBottom: '10px'}} onClick={this.expExlOne} disabled={!projName}>{'导出'}</Button>

              </span>
              {
                projName?
                  <div style={{marginTop:'20px'}}>
                    <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>
                      <Col span={25}>
                        <b>项目名称：</b>{projName}<br/>
                      </Col>
                    </Row>
                    <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>
                      <Col span={25}>
                        <b>项目编码：</b>{projCode}
                      </Col>
                    </Row>
                    <div style={{marginTop:'20px'}}>
                      <Table columns={this.props.oneProjColumns} dataSource={oneProjDetail} className={style.financeTable} pagination={false} scroll={{y:360}}/>
                    </div>
                  </div>
                  :
				  <div style={{marginTop:'20px'}}>
                    <Table columns={this.props.oneProjColumns} dataSource={oneProjDetail} className={style.financeTable} loading={this.props.loading} pagination={false} scroll={{y:360}}/>
                  </div>
              }
            </TabPane>
            <TabPane tab="科技创新项目支出汇总表" key="2">
              <span>
                {'月份：'}
                <MonthPicker onChange={this.onChangeDatePickerAll} value={moment(this.props.stcpAllYear+'-'+this.props.stcpAllMonth,'YYYY-MM')} disabledDate = {this.disabledDate}/>
              </span>&nbsp;&nbsp;
              <span>
                <Button type="primary" style={{marginRight: '10px', marginBottom: '10px'}} onClick={this.expExlAll} disabled={!this.props.expExlorNot}>{'导出'}</Button>
              </span>
              <div id ="table1" style={{marginTop:'20px'}}>
                <Table columns={this.props.allProjColumns} dataSource={allProjDetail} className={style.financeTable} pagination={false} scroll={{y:380}}/>
              </div>

            </TabPane>
          </Tabs>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.stcpCostDetail,
    ...state.stcpCostDetail
  };
}
export default connect(mapStateToProps)(StcpCostDetail);
