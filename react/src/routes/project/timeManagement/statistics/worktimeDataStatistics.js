/**
 *  作者: 张楠华
 *  创建日期: 2018-2-7
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：工时占比。
 */
import React from 'react';
import {connect } from 'dva';
import { Button,Select,message,DatePicker,Upload,Spin,Input,Icon } from 'antd';
import TableSearch from './tableSearch';
import Style from './statistic.less'
const dateFormat = 'YYYY-MM';
const { MonthPicker } = DatePicker;
const Option = Select.Option;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class worktimeMonthRatio extends React.Component{
  getParam = () =>{
    const {dateRadio,ouRadio} = this.state;
    const formData = {"arg_ou_year":dateRadio.format(dateFormat).split('-')[0],"arg_ou_month":parseInt(dateRadio.format(dateFormat).split('-')[1]),"arg_ou":ouRadio};
    return formData;
  };
  constructor(props){
    super(props);
    this.state={
      ouRadio:localStorage.ou,
      dateRadio:moment(),

      import: {
        action: "/microservice/alltimesheet/timesheet/ImportStaffforHoursRatio",
        method: "POST",
        data: this.getParam,
        name: "outsourcer",
        multiple: false,
        showUploadList: false,
        //listType: 'text',
        accept: '.xlsx,.xls',
        onChange:(info)=> {
          if (info.file.status === 'done') {
            if (info.file.response.RetCode === '1') {
              message.success(`${info.file.name} 导入成功！`);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 导入失败！.`);
            }else if(info.file.response.RetCode === '0'){
              message.info(info.file.response.RetVal);
            }
          }
        }
      }
    }
  }
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变年月
   */
  onchangeRadioDate = (value) => {
    this.setState({
      dateRadio:value,
    });
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/queryMonthRadio',
      ou:this.state.ouRadio,
      date:value,
    });
  };
  onchangeRadioOu = (value) => {
    this.setState({
      ouRadio:value,
    });
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/queryMonthRadio',
      date:this.state.dateRadio,
      ou:value,
    });
  };
  //导出tab2.
  exportTab2=()=>{
    let beginTime1 = this.state.dateRadio.format(dateFormat).split('-')[0];
    let endTime1 = parseInt(this.state.dateRadio.format(dateFormat).split('-')[1]);
    let exportUrl='/microservice/alltimesheet/timesheet/ExportAllStaffProjHoursRatio?'+'arg_year='+beginTime1+'&arg_month='+endTime1+'&arg_ou='+this.state.ouRadio;
    window.open(exportUrl);
  };
  //模板下载
  downloadTemp =() =>{
    location.href = "/filemanage/download/timesheet/月工时占比模板.xls";
  };
  genRadio= () => {
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/genRadio',
      date:this.state.dateRadio,
      ou:this.state.ouRadio,
    });
  };
  calRadio= () => {
    const { dispatch } = this.props;
    dispatch({
      type:'worktimeDataStatistics/calRadio',
      date:this.state.dateRadio,
      ou:this.state.ouRadio,
    });
  };
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment().valueOf();
      return value.valueOf() > lastDate
    }
  };
  render() {
    const {ouList,dataHasRadioNum,radioList} = this.props;
    const columnsRadio = [];
    if(radioList.length && dataHasRadioNum >2 ){
      columnsRadio.push(
        {
          title: '序号',
          dataIndex: 'staff_sort',
          fixed: 'left',
          width:'100px',
        },
        {
          title: '员工编号',
          dataIndex: 'staff_id',
          fixed: 'left',
          width:'100px',
        },
        {
          title: '姓名',
          dataIndex: 'staff_name',
          fixed: 'left',
          width:'100px',
        },
        {
          title: '部门',
          dataIndex: 'staff_dept',
          fixed: 'left',
          width:'100px',
        }
        );
    }else{
      columnsRadio.push(
        {
          title: '序号',
          dataIndex: 'staff_sort',
          width:'100px',
        },
        {
          title: '员工编号',
          dataIndex: 'staff_id',
          width:'100px',
        },
        {
          title: '姓名',
          dataIndex: 'staff_name',
          width:'100px',
        },
        {
          title: '部门',
          dataIndex: 'staff_dept',
          width:'100px',
        }
      );
    }
    for(let i=0;i<dataHasRadioNum;i++){
      columnsRadio.push(
        {
          title:'参与项目'+(i+1),
          dataIndex:'proj_name'+i,
          width:'200px',
        },
        {
          title:'项目'+(i+1)+'占比',
          dataIndex:'proj_ratio'+i,
          width:'100px',
        },
      );
    }
    if(radioList.length){
      radioList.map((i,index)=>{
        i.key = index;
      });
    }
    const needSearch = ['staff_name','staff_dept'];
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          {
            this.props.noRule ?
              <div>
                <div style={{textAlign:'left',paddingLeft:'15px'}}>
                  <div style={{display:'inline-block',marginTop:'10px'}}>
                    年月：
                    <MonthPicker
                      onChange={this.onchangeRadioDate}
                      format = {dateFormat}
                      value={this.state.dateRadio}
                      allowClear={false}
                      disabledDate={this.disabledDate}
                    />
                  </div>
                  <span style={{display:'inline-block',paddingLeft:'15px'}}>OU：
                  <Select showSearch style={{ width: 160}}  value={this.state.ouRadio} onSelect={this.onchangeRadioOu} >
                    {ouList.map((item) => {return (<Option key={item.dept_name}>{item.dept_name}</Option>)})}
                  </Select>
                </span>
                  {/*<Upload  {...this.state.import}>*/}
                    {/*<Button type="primary"  style={{marginRight:20,marginLeft:20}}>导入</Button>*/}
                  {/*</Upload>*/}
                  <Button type="primary" onClick={this.genRadio} disabled={this.props.isGenCalMonthRatio === '1'} style={{marginLeft:20,marginRight:20}}>生成</Button>
                  <Button type="primary" onClick={this.calRadio} disabled={this.props.isGenCalMonthRatio !== '1'} style={{marginRight:20}}>撤销</Button>
                  <Button type="primary" onClick={this.exportTab2} disabled={this.props.radioList.length === 0} style={{marginRight:20}}>导出</Button>
                  {/*<Button type="primary" onClick={this.downloadTemp} style={{marginRight:20}}>模板下载</Button>*/}
                </div>
                <div style={{marginTop: '20px'}}>
                  <TableSearch columns = {columnsRadio} dataSource={radioList} needSearch={needSearch} scroll={{ x: dataHasRadioNum*300+400 }}/>
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
export default connect(mapStateToProps)(worktimeMonthRatio);
