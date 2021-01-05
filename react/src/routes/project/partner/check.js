/**
 * 作者：张枫
 * 创建日期：2018-02-28
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：合作伙伴信息审核
 */
import React from 'react';
import { connect } from 'dva';
import {Button,Select,Table,Pagination,Popconfirm,Tooltip} from 'antd';
import PreviewTable from './previewTable.js';
import styles from './partner.less';
const Option = Select.Option;

class Check extends React.PureComponent {
  constructor(props)
  {
    super(props)
    this.setVisible= this.setVisible.bind(this);
  }
  state = {
    isPreviewTableVisible:false,
    isButtonVisible : true,
  };
  columns=[
    {
    title:'年月',
    dataIndex:'total_year_month',
    width:'8%',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'项目名称',
    dataIndex:'proj_name',
    width:'15%',
    render: (text) => {
      return <p>{text}</p>
    }
  },
  {
    title:'合作伙伴',
    dataIndex:'partner_name',
    width:'10%',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'高级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_h',
      width:'6%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_h',
      width:'6%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_h',
      width:'6%',
      render: (text) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'中级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_m',
      width:'6%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_m',
      width:'6%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_m',
      width:'6%',
      render: (text) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'初级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_l',
      width:'6%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_l',
      width:'6%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_l',
      width:'6%',
      render: (text) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'服务评价',
    dataIndex:'serviceList',
    width:'10%',
    render: (text, record) => {
      return(
        <p>
          {record.service_sum}
          &nbsp;
          <Tooltip
            title={
              record.total_month < 7?
            <div style={{width:'150px'}}>
              <p>{"团队能力表现"}<span>{record.stability_score}</span></p>
              <p>{"出勤率"}<span >{record.attend_score}</span></p>
              <p>{"交付时率"}<span >{record.delivery_score}</span></p>
              <p>{"交付质量"}<span >{record.quality_score}</span></p>
              <p>{"内部管理能力"}<span >{record.manage_score}</span></p>
            </div>:
            <div style={{width:'150px'}}>
              <p>{"资源投入率"}<span>{record.invest_score}</span></p>
              <p>{"资源稳定性"}<span>{record.stability_score}</span></p>
              <p>{"资源覆盖率"}<span >{record.attend_score}</span></p>
              <p>{"交付及时率"}<span >{record.delivery_score}</span></p>
              <p>{"交付质量"}<span >{record.quality_score}</span></p>
              <p>{"管理规范性"}<span >{record.manage_score}</span></p>
           </div>
            }
          >
            <span style={{ marginLeft: '5px', color: '#FA7252', textDecoration: 'underline' }}>详情</span>
          </Tooltip>
        </p>
      )
    }
  }];
  /**
   * 作者：张枫
   * 日期：2019-02-27
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：保存查询数据
   **/
  saveCheckInfo=(value,typeItem)=>{
    this.props.dispatch({
      type: 'check/saveCheckInfo',
      value:value,
      typeItem:typeItem,
    });
  }
  /**
   * 作者：张枫
   * 日期：2019-02-27
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：设置退回预览弹框可见
   **/
  confirmCheck=()=>{
    this.setState({
      isPreviewTableVisible:true,
    });
  }
  /**
   * 作者：张枫
   * 日期：2019-02-27
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：设置退回预览弹框不可见
   **/
  setVisible = (item)=>{
    if(item=="ok"){
      this.props.dispatch({
        type: 'check/retreatService',
      });
      // 模态框确定退回
      this.setState({
        isPreviewTableVisible:false,
      });
    }else if(item=="cancel"){
      this.setState({
        isPreviewTableVisible:false,
      });
    }
  }
  /**
   * 作者：张枫
   * 日期：2019-02-27
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：服务评价审核-确定
   **/
  checkWorkloadService = ()=>{
    this.props.dispatch({
      type: 'check/checkWorkloadService',
    });
  }
  /**
   * 作者：张枫
   * 日期：2019-02-27
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：服务评价审核勾选数据
   **/
  rowSelectionChange=(selectedRowKeys, selectedRows)=>{
    this.props.dispatch({
      type: 'check/saveSelectedInfo',
      selectedRows:selectedRows,
      selectedRowKeys:selectedRowKeys,
    });
  }
  handlePageChange =(page)=>{
    this.props.dispatch({
      type: 'check/handlePageChange',
      page : page,
    });
  }
  render(){
    const {checkList, selectedShowList, selectedRowKeys,} =this.props;
    const dept_project_List = this.props.deptProjectList.map((item)=>{
      return(
        <Option value={item.proj_code} key={item.proj_id}>{item.proj_name}</Option>
      )
    });
    const month_list = this.props.monthList.map((item)=>{
      return(
        <Option value={item.key} key={item.key}>{item.name}</Option>
      )
    });
    const year_list = this.props.yearList.map((item)=>{
      return(
        <Option value={item} key={item}>{item}</Option>
      )
    });
    // 多行可选
    const rowSelection ={
      selectedRowKeys,
      onChange :this.rowSelectionChange,
    };
    return (
      <div className={styles.container}>
        <span>
          <span className={styles.label}>年度：</span>
          <Select
            value={this.props.projParam.arg_total_year}
            className={styles.selectWidth4Year}
            onChange={(value)=>this.saveCheckInfo(value,'year')}
            >
            {year_list}
          </Select>
          <span className={styles.label}>月份：</span>
          <Select
            placeholder="全部"
            className={styles.selectWidth4Month}
            mode="multiple"
            onChange={(value)=>this.saveCheckInfo(value,'month')}>
            {month_list}
          </Select>
          <span className={styles.label}>项目名称：</span>
          <Select
            placeholder="全部"
            className={styles.selectWidth4Proj}
            mode="multiple"
            onChange={(value)=>this.saveCheckInfo(value,'project')}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            dropdownMatchSelectWidth={false}>
            {dept_project_List}
          </Select>
        </span>
        <div>
          <Table
            columns={this.columns}
            rowSelection={rowSelection}
            dataSource = {checkList}
            pagination = {false}
            className={styles.table}
            bordered = {true}
          >
          </Table>
          <PreviewTable
            visible={this.state.isPreviewTableVisible}
            data = {selectedShowList}
            setVisible={this.setVisible}
            retreatService ={this.retreatService}
          >
          </PreviewTable>
        </div>
        {checkList.length != 0 ?
          <div>
            <div className={styles.page}>
              <Pagination
                current={this.props.page}
                total={Number(this.props.rowCount)}
                pageSize={this.props.pageSize}
                onChange={this.handlePageChange}
                />
            </div>
            <div className={styles.btn}>
              <span>
                <Button
                  onClick={this.confirmCheck}
                  disabled = {this.props.isButtonVisible}
                >退回</Button>
               &nbsp;
               <Popconfirm
                 placement="topRight"
                 okText='确定'
                 onConfirm={this.checkWorkloadService}
                 title="确认审核通过吗？"
                 >
                 <Button
                     type ="primary"
                     disabled = {this.props.isButtonVisible}
                 >确定</Button>
               </Popconfirm>
              </span>
            </div>
          </div> : null
        }
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
   loading:state.loading.models.check,
   ...state.check
   }
}
export default connect(mapStateToProps)(Check);

