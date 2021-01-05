/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：部门分摊管理界面展示
 */
import React from 'react';
import { connect } from 'dva';
import { Select,Table,Button,DatePicker,Popconfirm,message,Spin } from 'antd';
import styles from '../../../../components/finance/table.less'
import Style from '../costCommon.css'
import { rightControl } from '../../../../components/finance/rightControl'
const Option = Select.Option;
const { MonthPicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const dateFormat = 'YYYY-MM';
import exportExl from '../../../../components/commonApp/exportExl';
import config from '../../../../utils/config'
/**
 * 作者：张楠华
 * 创建日期：2017-10-18
 * 功能：格式化数据
 */
function MoneyComponent({text}) {
  if(text === '0.0'){
    return <div style={{textAlign:'right',letterSpacing:1}}>-</div>
  }else{
    return <div style={{textAlign:'right',letterSpacing:1}}>{text?format(parseFloat(text)):text}</div>
  }
}
function format (num) {
  return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
/**
 * 作者：张楠华
 * 创建日期：2017-10-16
 * 功能：展示部门分摊管理界面
 */

class deptApportionManage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ou:localStorage.ou,
      deptShareMonth:null,
      statisticType:'1',
    };
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元
   */
  selectOu=(value)=>{
    const { deptShareMonth,statisticType } = this.state;
    const { dispatch } = this.props;
    this.setState({
      ou:value,
    });
    dispatch({
      type:'deptApportionManage/deptApportionQueryManage',
      ou:value,
      deptShareMonth:deptShareMonth !== null ? deptShareMonth : this.props.recentMonth,
      statisticType,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变月份
   */
  changeMonth=(value)=>{
    const { ou,statisticType } = this.state;
    const { dispatch } = this.props;
    this.setState({
      deptShareMonth:value,
    });
    dispatch({
      type:'deptApportionManage/deptApportionQueryManage',
      ou,
      deptShareMonth:value,
      statisticType,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择统计类型
   */
  selectStatisticType=(value)=>{
    const { ou,deptShareMonth } = this.state;
    const { dispatch } = this.props;
    this.setState({
      statisticType:value
    });
    dispatch({
      type:'deptApportionManage/deptApportionQueryManage',
      ou,
      deptShareMonth:deptShareMonth !== null ? deptShareMonth : this.props.recentMonth,
      statisticType:value
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：生成部门分摊数据
   */
  generateData=()=>{
    const { dispatch } = this.props;
    const { ou,deptShareMonth,statisticType } = this.state;
    dispatch({
      type:'deptApportionManage/generateData',
      ou,
      deptShareMonth:deptShareMonth !== null ? deptShareMonth : this.props.recentMonth,
      statisticType
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：发布部门分摊数据
   */
  publicData=()=>{
    const { dispatch } = this.props;
    const { ou,deptShareMonth,statisticType } = this.state;
    dispatch({
      type:'deptApportionManage/publicData',
      ou,
      deptShareMonth:deptShareMonth !== null ? deptShareMonth : this.props.recentMonth,
      statisticType
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：撤销发布部门分摊数据
   */
  cancelPublicData=()=>{
    const { ou,deptShareMonth,statisticType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type:'deptApportionManage/cancelPublicData',
      ou,
      deptShareMonth:deptShareMonth !== null ? deptShareMonth : this.props.recentMonth,
      statisticType
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：表格数据
   */
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
    const {list} = this.props;
    let tab=document.querySelector('#table1 table');
    if(list !== null && list.length !== 0){
      exportExl()(tab,'部门分摊数据')
    }else{
      message.info("查询结果为空！")
    }
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-27
   * 功能：判断是否只为查询
   */
  isOnlySelect=()=>{
    const { rightData } = this.props;
    return !rightControl(config.generateDeptData,rightData) && !rightControl(config.publicDeptData,rightData) && !rightControl(config.cancelPublicDeptData,rightData)
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-8
   * 功能：限定月份
   */
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment().valueOf();
      return value.valueOf() > lastDate
    }
  };
  render() {
    const { ou,deptShareMonth } = this.state;
    const { list,loading,ouList,stateParamList,headerName,stateFlag,recentMonth,rightData } = this.props;
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    //组织单元列表
    let ouList1;
    if( ouList.length !== 0){
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
      console.log(deptListData)
      //表格数据
      for(let i=1;i<deptListData.length-1;i++){
        deptListData[i].key === '通用资产折旧摊销_其它' ?
        columns2[i] ={
          title: deptListData[i].key,
          dataIndex: '通用资产折旧摊销',
          key:deptListData[i].key,
          width:160,
          render:(text,record)=>i === 1 ? <div style={{textAlign:'right',letterSpacing:1}}>{parseInt(text)}</div>:<MoneyComponent text={record['通用资产折旧摊销']}/>
        }
        :
        columns2[i] = {
          title: deptListData[i].key,
          dataIndex: deptListData[i].key,
          key:deptListData[i].key,
          width:160,
          render:(text,record)=>i === 1 ? <div style={{textAlign:'right',letterSpacing:1}}>{parseInt(text)}</div>:<MoneyComponent text={record[deptListData[i].key]}/>
        }
      }
      columns1 = [
        {
          title: '部门名称',
          dataIndex: '部门',
          key:'deptName',
          width:200,
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
          width:160,
          fixed:'right',
          render:(text,record)=><MoneyComponent text={text}/>
        }
      ];
      columns = columns1.concat(columns2);
      columns = columns.concat(columns3);
    }
    let text1;
    let text2;
    let text3;
    if(deptShareMonth !== null){
      text1 =`确定生成${deptShareMonth.format(dateFormat).split("-")[0]}${deptShareMonth.format(dateFormat).split("-")[1]}'${ou}'的部门分摊情况吗?`;
      text2 =`确定发布${deptShareMonth.format(dateFormat).split("-")[0]}${deptShareMonth.format(dateFormat).split("-")[1]}'${ou}'的部门分摊情况吗?`;
      text3 =`确定撤销${deptShareMonth.format(dateFormat).split("-")[0]}${deptShareMonth.format(dateFormat).split("-")[1]}'${ou}'的部门分摊情况吗?`;
    }else if(recentMonth.length !== 0){
      text1 =`确定生成${recentMonth.format(dateFormat).split("-")[0]}${recentMonth.format(dateFormat).split("-")[1]}'${ou}'的部门分摊情况吗?`;
      text2 =`确定发布${recentMonth.format(dateFormat).split("-")[0]}${recentMonth.format(dateFormat).split("-")[1]}'${ou}'的部门分摊情况吗?`;
      text3 =`确定撤销${recentMonth.format(dateFormat).split("-")[0]}${recentMonth.format(dateFormat).split("-")[1]}'${ou}'的部门分摊情况吗?`;
    }
    let objScroll={
      x:1100,
      y:500
    };
    if(headerName.length !==0 && JSON.parse(headerName).length>6){
      objScroll.x=360+(JSON.parse(headerName).length-2)*160;
    }
    return (
      <Spin tip="Loading..." spinning={loading}>
      <div className={Style.container}>
        <div style={{textAlign: 'left'}}>
          OU：
          <Select showSearch style={{ width: 160}}  value={this.state.ou} onSelect={this.selectOu} placeholder="请选择OU">
            {ouList1}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          月份：
          <MonthPicker style={{ width: 160}} format='YYYY-MM' value={moment(deptShareMonth !== null ? deptShareMonth:recentMonth,'YYYY-MM')} onChange={(value)=>this.changeMonth(value)} disabledDate={this.disabledDate}/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          统计类型：
          <Select showSearch style={{ width: 160}}  value={this.state.statisticType} onSelect={this.selectStatisticType} placeholder="请选择统计类型">
            {stateParam}
          </Select>
            {/*<Button type="primary" onClick={this.deptApportionChange}>查询</Button>*/}
            {
              rightControl(config.generateDeptData,rightData) ?
                stateFlag.length === 0 || stateFlag === "0" ?
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text1} onConfirm={this.generateData} okText="确定" cancelText="取消">
                      <Button disabled>生成</Button>
                    </Popconfirm>
                  </span>
                  :
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text1} onConfirm={this.generateData} okText="确定" cancelText="取消">
                      <Button type="primary">生成</Button>
                    </Popconfirm>
                  </span>
                :
                null
            }
            {
              rightControl(config.publicDeptData,rightData) ?
                stateFlag.length === 0 || stateFlag === "0" || stateFlag === '3'?
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text2} onConfirm={this.publicData} okText="确定" cancelText="取消">
                      <Button disabled>发布</Button>
                    </Popconfirm>
                  </span>
                  :
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text2} onConfirm={this.publicData} okText="确定" cancelText="取消">
                      <Button type="primary">发布</Button>
                    </Popconfirm>
                  </span>
                :
                null
            }
            {/*已发布：stateFlag = 0*/}
            {
              rightControl(config.cancelPublicDeptData,rightData) ?
                stateFlag.length === 0 || stateFlag === "2" || stateFlag === "3" ?
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text3} onConfirm={this.cancelPublicData} okText="确定" cancelText="取消">
                      <Button disabled>撤销</Button>
                    </Popconfirm>
                  </span>
                  :
                  <span style={{display:'inline-block',marginLeft:'10px'}}>
                    <Popconfirm title={text3} onConfirm={this.cancelPublicData} okText="确定" cancelText="取消">
                      <Button type="primary">撤销</Button>
                    </Popconfirm>
                  </span>
                :
                null
            }
            {
              list.length !== 0 ?
                <span style={{display:'inline-block',marginLeft:'10px'}}>
                  <Button type="primary" onClick={this.expExl}>导出</Button>
                </span>
                :
                <span style={{display:'inline-block',marginLeft:'10px'}}>
                  <Button disabled onClick={this.expExl}>导出</Button>
                </span>
            }
          <div style={{marginTop:'10px'}}>
            {
              stateFlag.length === 0 || stateFlag === '3' ||(this.isOnlySelect() && stateFlag === '2')?
                null
                :
                (
                  stateFlag === "0" ?
                    <span style={{float:'left'}}><strong>状态：</strong><span style={{color:'red'}}>已发布</span></span>
                    :
                    <span style={{float:'left'}}><strong>状态：</strong><span style={{color:'blue'}}>待审核</span></span>
                )
            }
            {
              this.isOnlySelect() && stateFlag === '2' || list.length === 0 ?
                null
                :
                <div style={{textAlign:'right'}}>金额单位：元</div>
            }
          </div>
          {
            this.isOnlySelect() && stateFlag === '2' ?
              null
              :
              <div style={{marginTop:'10px'}}>
                <Table columns={columns}
                       dataSource={list}
                       pagination={false}
                       //loading={loading}
                       className={styles.financeTable}
                       scroll={objScroll}
                />
              </div>
          }
          <div id="table1" style={{marginTop:'10px'}}>
            <Table columns={columns}
                   dataSource={list}
                   pagination={false}
                   //loading={loading}
                   className={styles.financeTable}
                   style={{display:"none"}}
            />
          </div>
        </div>
      </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {
  const { list,ouList,headerName,stateParamList,stateFlag,rightData,recentMonth } = state.deptApportionManage;
  return {
    loading: state.loading.models.deptApportionManage,
    list,
    ouList,
    headerName,
    stateParamList,
    stateFlag,
    rightData,
    recentMonth
  };
}

export default connect(mapStateToProps)(deptApportionManage);
