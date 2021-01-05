/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：人员变动查询界面展示
 */
import React from 'react';
import { connect } from 'dva';
import { Select,Table,Button,DatePicker,Popconfirm,message } from 'antd';
import styles from '../../../../components/finance/table.less'
import Style from '../../../../components/employer/employer.less'
import exportExl from '../../../../components/commonApp/exportExl'
const Option = Select.Option;
const { MonthPicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const dateFormat = 'YYYY-MM';
/**
 * 作者：张楠华
 * 创建日期：2017-10-16
 * 功能：展示人员变动界面
 */
class personnelChangesManage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ou:'',
      personChangeDate:'',
    };
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元
   */
  selectOu=(value)=>{
    this.setState({
      ou:value
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变年份
   */
  changeDate=(value)=>{
    this.setState({
      personChangeDate:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：查询人员变动情况
   */
  queryPersonChange=()=>{
    const { dispatch } = this.props;
    const { ou,personChangeDate } = this.state;
    if( ou === ''){
      message.info('OU不能为空');
      return null;
    }
    if( personChangeDate === ''){
      message.info('年月不能为空');
      return null;
    }else{
      dispatch({
        type:'personnelChangesManage/queryPersonChange',
        ou:ou,
        personChangeDate:personChangeDate,
      });
    }
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

  render() {
    const { list,loading,ouList,headerName } = this.props;
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
    if(headerName !== '' ||headerName.length !== 0){
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
    }
    return (
      <div className={Style.wrap}>
        <div style={{textAlign: 'left'}}>
          部门/OU：
          <Select showSearch style={{ width: 160}}  onSelect={this.selectOu} placeholder="请选择OU">
            {ouList1}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          日期：
          <MonthPicker style={{ width: 160}} onChange={(value)=>this.changeDate(value)} placeholder="请选择日期"/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.queryPersonChange}>查询</Button>
          <div id="table1" style={{marginTop:'20px'}}>
            <Table columns={columns}
                   dataSource={list}
                   pagination={false}
                   loading={loading}
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
  const { list,ouList,headerName} = state.personnelChangesManage;
  return {
    loading: state.loading.models.personnelChangesManage,
    list,
    ouList,
    headerName
  };
}

export default connect(mapStateToProps)(personnelChangesManage);
