/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：人员变动管理界面展示
 */
import React from 'react';
import { connect } from 'dva';
import { Select,Table,Button,DatePicker,Popconfirm,message,Spin } from 'antd';
import styles from '../../../../components/finance/table.less'
import Style from '../costCommon.css'
import exportExl from '../../../../components/commonApp/exportExl'
import { rightControl } from '../../../../components/finance/rightControl'
import config from '../../../../utils/config'
const Option = Select.Option;
const { MonthPicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const dateFormat = 'YYYY-MM';
function MoneyComponent({text}) {
  if(text === '0'){
    return <div style={{textAlign:'right',letterSpacing:1}}>-</div>
  }else{
    return <div style={{textAlign:'right',letterSpacing:1}}>{text}</div>
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-10-16
 * 功能：展示人员变动管理界面
 */
class personnelChangesManage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ou:localStorage.ou,
      personChangeDate:'',
    };
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元
   */
  selectOu=(value)=>{
    const { dispatch } = this.props;
    const { personChangeDate } = this.state;
    this.setState({
      ou:value
    });
    dispatch({
      type:'personnelChangesManage/queryPersonChange',
      ou:value,
      personChangeDate:personChangeDate !== '' ? personChangeDate : this.props.recentMonth,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变年份
   */
  changeDate=(value)=>{
    const { dispatch } = this.props;
    const { ou } = this.state;
    this.setState({
      personChangeDate:value,
    });
    dispatch({
      type:'personnelChangesManage/queryPersonChange',
      ou:ou,
      personChangeDate:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：同步人员变动情况
   */
  synChange=()=>{
    const { dispatch } = this.props;
    const { ou,personChangeDate } = this.state;
    dispatch({
      type:'personnelChangesManage/synChange',
      ou:ou,
      personChangeDate:personChangeDate !== ''? personChangeDate : this.props.recentMonth,
    });
  };
  //表格数据
  columns = [
    {
      title: '部门名称',
      dataIndex: 'dept_name',
      key:'dept_name',
      render: (text, record) => {
        if(record.dept_name === '合计'){
          return(
            <div style={{textAlign:"left",whiteSpace:'normal'}}>
              <strong>{record.dept_name}</strong>
            </div>
          )
        }else{
          return(
            <div style={{textAlign:"left",whiteSpace:'normal'}}>
              {record.dept_name.split('-')[1]}
            </div>
          )
        }
      },
    },
    {
      title: '上月底人数',
      dataIndex: 'up_month_num',
      key:'up_month_num',
    },
    {
      title: '部门间调动(+/-)',
      dataIndex: 'move_per_num',
      key:'move_per_num',
    },
    {
      title: '本月新增人数',
      dataIndex: 'add_per_num',
      key:'add_per_num',
    },
    {
      title: '本月离职人数',
      dataIndex: 'del_per_num',
      key:'del_per_num',
    },
    {
      title: '本月底',
      dataIndex: 'latle_month',
      key:'latle_month',
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
      exportExl()(tab,'人员变动情况')
    }else{
      message.info("查询结果为空！")
    }
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
    const { ou,personChangeDate } = this.state;
    const { list,loading,ouList,headerName,recentMonth } = this.props;
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    //组织单元列表
    let ouList1;
    if(ouList !== '' || ouList.length !== 0){
       ouList1 = ouList.map((item) => {
        return (
          <Option key={item.dept_name}>
            {item.dept_name}
          </Option>
        )
      });
    }
    //表头参数
    let columns=[];
    if(headerName !== '' || headerName.length !== 0){
      columns = [
        {
          title: '部门名称',
          dataIndex: 'dept_name',
          key:'dept_name',
          render: (text, record) => {
            if(record.dept_name === '合计'){
              return(
                <div style={{textAlign:"left",whiteSpace:'normal'}}>
                  <strong>{record.dept_name}</strong>
                </div>
              )
            }else{
              return(
                <div style={{textAlign:"left",whiteSpace:'normal'}}>
                  {record.dept_name.split('-')[1]}
                </div>
              )
            }
          },
        },
        {
          title: '上月底人数',
          dataIndex: 'up_month_num',
          key:'up_month_num',
          render:(text,record)=><MoneyComponent text={text}/>
        },
        {
          title: '部门间调动(+/-)',
          dataIndex: 'move_per_num',
          key:'move_per_num',
          render:(text,record)=><MoneyComponent text={text}/>
        },
        {
          title: '本月新增人数',
          dataIndex: 'add_per_num',
          key:'add_per_num',
          render:(text,record)=><MoneyComponent text={text}/>
        },
        {
          title: '本月离职人数',
          dataIndex: 'del_per_num',
          key:'del_per_num',
          render:(text,record)=><MoneyComponent text={text}/>
        },
        {
          title: '本月底',
          dataIndex: 'latle_month',
          key:'latle_month',
          render:(text,record)=><MoneyComponent text={text}/>
        }
      ];
    }
    let text;
    if(personChangeDate !== ''){
      text =`确定同步${personChangeDate.format(dateFormat)}'${ou}'的人员变动情况吗?`;
    }else if(recentMonth.length !== 0){
      text =`确定同步${recentMonth.format(dateFormat)}'${ou}'的人员变动情况吗?`;
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
          <MonthPicker style={{ width: 160}} value={moment(personChangeDate !== '' ? personChangeDate : recentMonth, 'YYYY-MM')} onChange={(value)=>this.changeDate(value)} disabledDate={this.disabledDate}/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {
            rightControl(config.personalSyn,this.props.rightData) ?
              <Popconfirm title={text} onConfirm={this.synChange} okText="确定" cancelText="取消">
                <Button type="primary">同步</Button>
              </Popconfirm>
              :
              null
          }
          &nbsp;&nbsp;&nbsp;&nbsp;
          {
            list.length !== 0 ?
              <Button type="primary" onClick={this.expExl}>导出</Button>
              :
              <Button disabled onClick={this.expExl}>导出</Button>
          }
          {
            list.length !== 0 ?
              <div style={{margin:'10px'}}><strong>状态：</strong><span style={{color:'red'}}>已发布</span></div>
              :
              null
          }
          <div id="table1" style={{marginTop:'10px'}}>
            <Table columns={columns}
                   dataSource={list}
                   pagination={false}
                   //loading={loading}
                   className={styles.financeTable}
            />
          </div>
        </div>
      </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {
  const { list,ouList,headerName,rightData,recentMonth } = state.personnelChangesManage;
  return {
    loading: state.loading.models.personnelChangesManage,
    list,
    ouList,
    headerName,
    rightData,
    recentMonth
  };
}

export default connect(mapStateToProps)(personnelChangesManage);
