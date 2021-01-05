/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：部门分摊查询界面展示
 */
import React from 'react';
import { connect } from 'dva';
import { Select,Table,Button,DatePicker,message } from 'antd';
import styles from '../../../../components/finance/table.less'
import Style from '../../../../components/employer/employer.less'
import {exportExlDeptApportion} from "./exportExlDeptApportion";
const Option = Select.Option;
const { MonthPicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
/**
 * 作者：张楠华
 * 创建日期：2017-10-16
 * 功能：展示部门分摊查询界面
 */
class deptApportionManage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ou:'',
      deptShareYear:'',
      deptShareMonth:'',
      statisticType:'',
    };
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元
   */
  selectOu=(value)=>{
    this.setState({
      ou:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变年份
   */
  changeYear=(value)=>{
    this.setState({
      deptShareYear:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变月份
   */
  changeMonth=(value)=>{
    this.setState({
      deptShareMonth:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择统计类型
   */
  selectStatisticType=(value)=>{
    this.setState({
      statisticType:value
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：查询部门分摊情况
   */
  deptApportionChange=()=>{
    const { dispatch } = this.props;
    const { ou,deptShareYear,deptShareMonth,statisticType } = this.state;
    if( ou === ''){
      message.info('OU不能为空');
      return null;
    }
    if( deptShareYear === ''){
      message.info('年份不能为空');
      return null;
    }if( deptShareMonth === ''){
      message.info('月份不能为空');
      return null;
    }else{
      dispatch({
        type:'deptApportionManage/deptApportionQuery',
        ou,
        deptShareYear,
        deptShareMonth,
        statisticType,
      });
    }
  };
  //表格数据
  columns = [
    {
      title: '部门名称',
      dataIndex: '部门',
      key:'deptName',
      width:'200px',
      fixed:'left',
      render: (text, record) => {
        if(record.hasOwnProperty("部门")){
          if(record.部门 === '部门分摊成本合计' || record.部门 === '全部'){
            return(
              <div style={{textAlign:"left",whiteSpace:'normal'}}>
                <strong>{record.部门}</strong>
              </div>
            )
          }else{
            return(
              <div style={{textAlign:"left",whiteSpace:'normal'}}>
                {record.部门.split('-')[1]}
              </div>
            )
          }
        }
      },
    },
    {
      title: '当月平均人数',
      dataIndex:'当月平均人数',
      key:'averageNumber',
      width:'130px',
    },
    {
      title: '通用设备租金',
      dataIndex: '通用设备租金',
      key:'equipmentRental',
      width:'130px',
    },
    {
      title: '房租',
      dataIndex: '房租',
      key:'rent',
      width:'100px',
    },
    {
      title: '物业管理费',
      dataIndex: '物业管理费',
      key:'PropertyManageFee',
      width:'120px',
    },
    {
      title: '水电取暖费',
      dataIndex: '水电取暖费',
      key:'heatingFee',
      width:'120px',
    },
    {
      title: '修理维护费',
      dataIndex: '修理维护费',
      key:'MaintenanceFee',
      width:'120px',
    },
    {
      title: '公用车辆使用费',
      dataIndex: '公用车辆使用费',
      key:'BusUseFee',
      width:'130px',
    },
    {
      title: '公共通信费',
      dataIndex: '公共通信费',
      key:'communicationFee',
      width:'120px',
    },
    {
      title: '其他',
      dataIndex: '其他',
      key:'elseFee',
      width:'100px',
    },
    {
      title: '小计',
      dataIndex: '小计',
      key:'totalFee',
      width:'100px',
      fixed:'right',
    }
  ];
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：导出数据
   */
  expExl=()=>{
    const {list,headerName} = this.props;
    if(list !== null && list.length !== 0 && headerName.length !== 0){
      exportExlDeptApportion(list, "部门分摊情况", headerName)
    }else{
      message.info("查询结果为空！")
    }
  };

  render() {
    const { list,loading,ouList,stateParamList,headerName } = this.props;
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    //组织单元列表
    let ouList1;
    if(ouList.length !== 0){
      ouList1 = ouList.map((item) => {
        return (
          <Option key={item.dept_name}>
            {item.dept_name}
          </Option>
        )
      });
    }
    //统计类型参数
    let stateParam;
    if(stateParamList.length !== 0){
      stateParam = stateParamList.map((item) => {
        return (
          <Option key={item.state_code}>
            {item.state_name}
          </Option>
        )
      });
    }
    //表头参数
    let deptListData;
    let columns=[];
    let columns1=[];
    let columns2=[];
    let columns3=[];
    if(headerName.length !== 0){
        deptListData = JSON.parse(headerName).map((item) => {
          return (
            <Option key={item}>
              {item}
            </Option>
          )
        });
        //表格数据
        for(let i=1;i<deptListData.length-1;i++){
          columns2[i] ={
            title: deptListData[i].key,
            dataIndex: deptListData[i].key,
            key:deptListData[i].key,
            width:'150px',
          };
        }
      columns1 = [
        {
          title: '部门名称',
          dataIndex: '部门',
          key:'deptName',
          width:'200px',
          fixed:'left',
          render: (text, record) => {
            if(record.hasOwnProperty("部门")){
              if(record.部门 === '部门分摊成本合计' || record.部门 === '全部'){
                return(
                  <div style={{textAlign:"left",whiteSpace:'normal'}}>
                    <strong>{record.部门}</strong>
                  </div>
                )
              }else{
                return(
                  <div style={{textAlign:"left",whiteSpace:'normal'}}>
                    {record.部门.split('-')[1]}
                  </div>
                )
              }
            }
          },
        }
      ];
      columns3 = [
        {
          title: '小计',
          dataIndex: '小计',
          key:'totalFee',
          width:'100px',
          fixed:'right',
        }
      ];
      columns = columns1.concat(columns2);
      columns = columns.concat(columns3);
      }
    let objScroll={
      x:1100,
      y:400
    };
    if(headerName.length !==0 && JSON.parse(headerName).length>6){
      objScroll.x=300+(JSON.parse(headerName).length-2)*150;
    }
    return (
      <div className={Style.wrap}>
        <div style={{textAlign: 'left'}}>
          部门/OU：
          <Select showSearch style={{ width: 160}}  onSelect={this.selectOu} placeholder="请选择OU">
            {ouList1}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          年份：
          <DatePicker style={{ width: 160}} format='YYYY' onChange={(value)=>this.changeYear(value)} placeholder="请选择年份"/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          月份：
          <MonthPicker style={{ width: 160}} onChange={(value)=>this.changeMonth(value)} placeholder="请选择月份"/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          统计类型：
          <Select showSearch style={{ width: 160}}  onSelect={this.selectStatisticType} placeholder="请选择统计类型">
            {stateParam}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.deptApportionChange}>查询</Button>
          <div id="table1" style={{marginTop:'20px'}}>
          <Table columns={columns}
                 dataSource={list}
                 pagination={false}
                 loading={loading}
                 scroll={objScroll}
                 className={styles.financeTable}
          />
          </div>
          <div style={{textAlign:"right", marginTop:'10px'}}><Button type="primary" onClick={this.expExl}>导出</Button></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { list,ouList,headerName,stateParamList} = state.deptApportionManage;
  return {
    loading: state.loading.models.deptApportionManage,
    list,
    ouList,
    headerName,
    stateParamList
  };
}

export default connect(mapStateToProps)(deptApportionManage);
