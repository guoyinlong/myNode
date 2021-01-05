/**
 * 作者：薛刚
 * 创建日期：2018-03-11
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：合作伙伴信息撤回
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Select, Table, Pagination, Popconfirm, Tooltip } from 'antd';
import PreviewTable from './previewTable.js';
import styles from './partner.less';
const Option = Select.Option;

class Recall extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  columns=[{
    title:'年月',
    dataIndex:'total_year_month',
    width:'8%',
    render: (value, record, index) => {
      const obj = {
        children: value,
        props: {},
      };
      return obj
    }
  },{
    title:'项目名称',
    dataIndex:'proj_name',
    width:'15%',
    render: (value, record, index) => {
      const obj = {
        children: value,
        props: {},
      };
      return obj
    }
  },{
    title:'合作伙伴',
    dataIndex:'partner_name',
    width:'10%',
    render: (text, record, index) => {
      return <p>{text}</p>
    }
  },{
    title:'高级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_h',
      width:'6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_h',
      width:'6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_h',
      width:'6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'中级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_m',
      width:'6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_m',
      width:'6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_m',
      width:'6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'初级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_l',
      width:'6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_l',
      width:'6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_l',
      width:'6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'服务评价',
    dataIndex:'serviceList',
    width:'10%',
    render: (text, record, index) => {
      return(
        <p>{record.service_sum}
          <Tooltip
          //判断  获取年份
            title={
              record.total_month < 7 ?
            <div style={{ width:'150px' }}>
              <p><span>团队能力表现</span><span style ={{marginLeft:'5px'}}>{record.stability_score}</span></p>
              <p><span>出勤率</span><span style ={{marginLeft:'5px'}}>{record.attend_score}</span></p>
              <p><span>交付时率</span><span style ={{marginLeft:'5px'}}>{record.delivery_score}</span></p>
              <p><span>交付质量</span><span style ={{marginLeft:'5px'}}>{record.quality_score}</span></p>
              <p><span>内部管理能力</span><span style ={{marginLeft:'5px'}}>{record.manage_score}</span></p>
            </div> :
            <div style={{ width:'150px' }}>
              <p><span>资源投入率</span><span style ={{marginLeft:'5px'}}>{record.invest_score}</span></p>
              <p><span>资源稳定性</span><span style ={{marginLeft:'5px'}}>{record.stability_score}</span></p>
              <p><span>资源覆盖率</span><span style ={{marginLeft:'5px'}}>{record.attend_score}</span></p>
              <p><span>交付及时率</span><span style ={{marginLeft:'5px'}}>{record.delivery_score}</span></p>
              <p><span>交付质量</span><span style ={{marginLeft:'5px'}}>{record.quality_score}</span></p>
              <p><span>管理规范性</span><span style ={{marginLeft:'5px'}}>{record.manage_score}</span></p>
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
   * 作者：薛刚
   * 日期：2019-03-11
   * 邮箱：xueg@chinaunicom.cn
   * 说明：保存查询数据
   **/
  saveCheckInfo = (value,typeItem) => {
    this.props.dispatch({
      type: 'recall/saveCheckInfo',
      value: value,
      typeItem: typeItem,
    });
  }

  /**
   * 作者：薛刚
   * 日期：2019-03-11
   * 邮箱：xueg@chinaunicom.cn
   * 说明：服务评价撤回-确定
   **/
  recallWorkloadService = ()=>{
    this.props.dispatch({
      type: 'recall/recallWorkloadService',
    });
  }

  /**
   * 作者：薛刚
   * 日期：2019-03-11
   * 邮箱：xueg@chinaunicom.cn
   * 说明：服务评价撤回勾选数据
   **/
  rowSelectionChange=(selectedRowKeys, selectedRows)=>{
    this.props.dispatch({
      type: 'recall/saveSelectedInfo',
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
    });
  }

  /**
   * 作者：薛刚
   * 创建日期：2019-3-12
   * 功能：动态页码查询功能
   * @param page 页码
   */
  handlePageChange = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recall/handlePageChange',
      page: page
    });
  };

  render(){
    const { checkList, selectedRowKeys } = this.props;
    const dept_project_List = this.props.deptProjectList.map((item)=>{
      return(
        <Option value={item.proj_code} key={item.proj_id}>{item.proj_name}</Option>
      )
    });
    const month_list = this.props.monthList.map((item)=>{
      return(
        <Option value={item.key} key={item.name}>{item.name}</Option>
      )
    });
    const year_list = this.props.yearList.map((item)=>{
      return(
        <Option value={item} key={item}>{item}</Option>
      )
    });
    // 多行可选
    const rowSelection = {
      selectedRowKeys,
      onChange: this.rowSelectionChange,
    };
    return (
      <div className={styles.container}>
        <span>
          <span className={styles.label}>年度：</span>
          <Select
            value={this.props.projParam.arg_total_year}
            className={styles.selectWidth4Year}
            onChange={(value)=>this.saveCheckInfo(value,'year')}>
            {year_list}
          </Select>
          <span className={styles.label}>月份：</span>
          <Select
            className={styles.selectWidth4Month}
            mode="multiple"
            placeholder="全部"
            onChange={(value)=>this.saveCheckInfo(value,'month')}>
            {month_list}
          </Select>
          <span className={styles.label}>项目名称：</span>
          <Select
            className={styles.selectWidth4Proj}
            mode="multiple"
            placeholder="全部"
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
          {this.props.loading !== true ?
            <div className={styles.page}>
              <Pagination
                current={this.props.page}
                total={Number(this.props.rowCount)}
                pageSize={this.props.pageSize}
                onChange={this.handlePageChange}
                />
            </div>
            :
            null
          }
        </div>
        {
          checkList.length != 0 ?
          <div className={styles.btn}>
            <Popconfirm
              placement="topRight"
              okText='确定'
              onConfirm={this.recallWorkloadService}
              title="确认撤回吗？"
            >
              <Button type ="primary" disabled={selectedRowKeys.length == 0}>撤回</Button>
            </Popconfirm>
          </div>
          : null
        }
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
   loading: state.loading.models.recall,
   ...state.recall
   }
}
export default connect(mapStateToProps)(Recall);

