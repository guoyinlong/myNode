/**
 * 作者：薛刚
 * 创建日期：2018-03-06
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：合作伙伴信息查询
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Select, Table, Pagination, Popconfirm, Tooltip ,message} from 'antd';
import PreviewTable from './previewTable.js';
import styles from './partner.less';
import { exportExcelPartner } from './exportExlPartner.js'

const Option = Select.Option;

class Query extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  columns = [{
    title: '年月',
    dataIndex: 'total_month',
    width: '6%',
    render: (text, record, index) => {
      return <p>{text}</p>
    }
  },{
    title: '项目名称',
    dataIndex: 'proj_name',
    width: '20%',
    render: (text, record, index) => {
      return <p>{text}</p>

    }
  },{
    title: '合作伙伴',
    dataIndex: 'partner_name',
    width: '8%',
    render: (text, record, index) => {
      return <p>{text}</p>
    }
  },{
    title: '高级工作量',
    children: [{
      title: '标准',
      dataIndex: 'month_work_cnt_h',
      width: '6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title: '额外',
      dataIndex: 'other_month_work_cnt_h',
      width: '6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title: '合计',
      dataIndex: 'workload_sum_h',
      width: '6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    }],
  },{
    title: '中级工作量',
    children: [{
      title: '标准',
      dataIndex: 'month_work_cnt_m',
      width: '6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title: '额外',
      dataIndex: 'other_month_work_cnt_m',
      width: '6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title: '合计',
      dataIndex: 'workload_sum_m',
      width: '6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    }],
  },{
    title: '初级工作量',
    children: [{
      title: '标准',
      dataIndex: 'month_work_cnt_l',
      width: '6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title: '额外',
      dataIndex: 'other_month_work_cnt_l',
      width: '6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    },{
      title: '合计',
      dataIndex: 'workload_sum_l',
      width: '6%',
      render: (text, record, index) => {
        return <p>{text}</p>
      }
    }],
  },{
    title: '服务评价',
    dataIndex: 'service_sum',
    width: '10%',
    render: (text, record, index) => {
      return(
        <p>{record.service_sum}
          <Tooltip
          //判断  获取年份
            title={
              record.month < 7 ?
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
   * 日期：2019-03-07
   * 邮箱：xueg@chinaunicom.cn
   * 说明：保存查询数据
   **/
  saveSelectInfo = (value, typeItem) => {
    const { dispatch } = this.props;
    const status = value[0];
    dispatch({
      type: 'partnerInfoQuery/saveSelectInfo',
      value: value,
      typeItem: typeItem,
      status,
    });
  }

  /**
   * 作者：薛刚
   * 日期：2019-03-18
   * 邮箱：xueg@chinaunicom.cn
   * 说明：保存项目列表数据
   **/
  getProjectList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'partnerInfoQuery/queryProjectList',
    });
  }

  /**
   * 作者：薛刚
   * 创建日期：2019-3-10
   * 功能：动态页码查询功能
   * @param page 页码
   */
  handlePageChange = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'partnerInfoQuery/handlePageChange',
      page: page
    });
  };

  /**
   * 作者：薛刚
   * 创建日期：2013-3-10
   * 功能：导出查询外包工作量
   */
  exportExcel = () => {
    const list = this.props.exportWorkloadList;
    const user = this.props.user.key;
    const year = this.props.user.year;
    let header_level1 = [
      "项目名称	",
      "合作方",
      "统计时间",
      "服务评价",
      "高级工作量（人/月）",
      "中级工作量（人/月）",
      "初级工作量（人/月）",
      "合作方负责人签字",
      "团队负责人签字",
    ];
    //1~6
    const header_level2 = [
      "团队成员稳定性",
      "出勤率",
      "交付时率",
      "交付质量",
      "内部管理能力",
      "合计",
      "标准",
      "额外",
      "合计",
      "标准",
      "额外",
      "合计",
      "标准",
      "额外",
      "合计",
    ];
    //7~12
    const header_level3 = [
      "资源投入率",
      "资源稳定性",
      "资源覆盖率",
      "交付时率",
      "交付质量",
      "管理规范性",
      "合计",
      "标准",
      "额外",
      "合计",
      "标准",
      "额外",
      "合计",
      "标准",
      "额外",
      "合计",
    ];
    //1~6
    let headerKey1 = [
      "proj_name",
      "partner_name",
      "total_month",
      "stability_score",
      "attend_score",
      "delivery_score",
      "quality_score",
      "manage_score",
      "service_sum",
      "month_work_cnt_h",
      "other_month_work_cnt_h",
      "workload_sum_h",
      "month_work_cnt_m",
      "other_month_work_cnt_m",
      "workload_sum_m",
      "month_work_cnt_l",
      "other_month_work_cnt_l",
      "workload_sum_l",
    ];
    //7~12111333222
    let headerKey2 = [
      "proj_name",
      "partner_name",
      "total_month",
      "invest_score",
      "stability_score",
      "attend_score",
      "delivery_score",
      "quality_score",
      "manage_score",
      "service_sum",
      "month_work_cnt_h",
      "other_month_work_cnt_h",
      "workload_sum_h",
      "month_work_cnt_m",
      "other_month_work_cnt_m",
      "workload_sum_m",
      "month_work_cnt_l",
      "other_month_work_cnt_l",
      "workload_sum_l",
    ];
    if (list !== null && list.length !== 0 && user == "") {
      message.info("导出前请先选择日期，1~6与7~12月份的不能同时导出！");
      return ''
    }
    if (list !== null && list.length !== 0) {
      if (user == "y"  || year !== '2020') {
        exportExcelPartner(
          list,
          "合作伙伴服务确认单",
          header_level1,
          header_level2,
          headerKey1,
          this.props.deptName,
          this.props.total
        );
      } else {
        exportExcelPartner(
          list,
          "合作伙伴服务确认单",
          header_level1,
          header_level3,
          headerKey2,
          this.props.deptName,
          this.props.total
        );
      }
    } else {
      message.info("查询结果为空");
    }
  };
  // 判断上下半年
  monthDecide = (key, value) => {
    if (value.length > 0) {
      if (value.some(v => v > 6)) {
        return key <= 6
      } else {
        return key > 6
      }
    }
  }
  // 删除月份选项
  deselect = value => {
    const {monthValue, dispatch} = this.props;
    let res = monthValue.filter(v => v != value)
    dispatch({
      type: 'partnerInfoQuery/save',
      payload: {
        monthValue: res
      }
    })
  }


  render(){
    const { monthValue, monthSta, yearList, monthList, deptList, projList, partnerList, workloadList, workload_h, workload_m, workload_l} = this.props;
    const year_list = yearList.map((item)=>{
      return (
        <Option value={item} key={item}>{item}</Option>
      )
    });
    // 月份添加全部
    const month_list = monthList.map((item)=>{
      return (
        <Option value={item.key} key={item.key} disabled={this.monthDecide(item.key, monthValue)}>{item.name}</Option>
      );
    });
    // 部门添加全部
    const dept_list = deptList.map((item)=>{
      return (
        <Option value={item.pu_dept_id} key={item.pu_dept_id}>{item.pu_dept_name.split('-')[1]}</Option>
      )
    });

    // 项目添加全部
    const project_list = projList.map((item)=>{
      return (
        <Option value={item.proj_code} key={item.proj_id}>
          {item.proj_name}
        </Option>
      )
    });

    // 合作伙伴添加全部
    const partner_list = partnerList.map((item)=>{
      return (
        <Option value={item.partner_id} key={item.partner_id}>{item.partner_name}</Option>
      )
    });

    return (
      <div className={styles.container}>
        <section>
          <span className={styles.label}>年度：</span>
          <Select
            value={this.props.params.arg_total_year}
            className={styles.selectWidth4Year}
            onChange={(value) => this.saveSelectInfo(value, 'year')}>
            {year_list}
          </Select>
          <span className={styles.label}>月份：</span>
          <Select
            className={styles.selectWidth4Month}
            placeholder="全部"
            mode="multiple"
            onChange={(value) => this.saveSelectInfo(value, 'month')}
            onDeselect={this.deselect}
            value={monthValue}
            >
            {month_list}
          </Select>
          <span className={styles.label}>部门名称：</span>
          <Select
            className={styles.selectWidth4Dept}
            placeholder="全部"
            mode="multiple"
            onChange={(value) => this.saveSelectInfo(value, 'dept')}>
            {dept_list}
          </Select>
          <span className={styles.label}>项目名称：</span>
          <Select
            className={styles.selectWidth4ProjSearch}
            placeholder="全部"
            mode="multiple"
            onChange={(value) => this.saveSelectInfo(value, 'project')}
            onFocus={(value) => this.getProjectList(value)}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            dropdownMatchSelectWidth={false}>
            {project_list}
          </Select>
          <span className={styles.label}>合作伙伴：</span>
          <Select
            className={styles.selectWidth4Partner}
            placeholder="全部"
            mode="multiple"
            onChange={(value) => this.saveSelectInfo(value, 'partner')}>
            {partner_list}
          </Select>
        </section>
        <section className={styles.toTop}>
          <span className={styles.label}>高级工作量：
            <label className={styles.workloadSum}>{workload_h}</label>人月
          </span>
          <span className={styles.label}>中级工作量：
            <label className={styles.workloadSum}>{workload_m}</label>人月
          </span>
          <span className={styles.label}>初级工作量：
            <label className={styles.workloadSum}>{workload_l}</label>人月
          </span>
        </section>
        <Table
          columns={this.columns}
          dataSource={workloadList}
          pagination={false}
          className={styles.table}
          bordered={true}
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
        {
          workloadList.length != 0 ?
            <div className={styles.btn}>
              <Button type="primary" onClick={this.exportExcel}>导出</Button>
            </div>
            : null
        }
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
   loading: state.loading.models.partnerInfoQuery,
   ...state.partnerInfoQuery
   }
}
export default connect(mapStateToProps)(Query);

