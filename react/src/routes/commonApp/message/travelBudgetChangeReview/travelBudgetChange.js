/**
 * 作者：薛刚
 * 创建日期：2018-10-29
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现差旅费预算变更审核页面
 */
import React from 'react';
import { Link, routerRedux } from 'dva/router';
import { Table, Breadcrumb, Button, Tabs, Popover, Icon } from 'antd';
import styles from './travelBudgetChangeReview.less';

const TabPane = Tabs.TabPane;

class travelBudgetChange extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  travelBudgetColumns = (data) => {
    const column_info = styles['column-info'];
    const column_money = styles['column-money'];
    return [{
      title: '年度',
      dataIndex: 'year',
      className: column_info,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = 0;
        for(let i=0; i<data.year_rowspan.length; i++) {
          if(index == data.year_rowspan[i].index) {
            obj.props.rowSpan = data.year_rowspan[i].span;
          }
        }
        return obj;
      },
    },
      {
        title: '部门',
        dataIndex: 'dept_name',
        className: column_info,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          obj.props.rowSpan = 0;
          for(let i=0; i<data.dept_rowspan.length; i++) {
            if(index == data.dept_rowspan[i].index) {
              obj.props.rowSpan = data.dept_rowspan[i].span;
            }
          }
          return obj;
        },
      }, {
        title: '差旅费类型',
        dataIndex: 'fee_name',
        className: column_info,
        render: (value) => {
          const obj = {
            children: value,
            props: {},
          };
          return obj;
        }
      }, {
        title: '变更前',
        dataIndex: 'oldfee',
        className: column_money,
        render:(value, row, index)=>{
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }
      }, {
        title: '变更后',
        dataIndex: 'newfee',
        className: column_money,
        render:(value)=>{
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }
      }, {
        title: '变更情况',
        dataIndex: 'difffee',
        className: column_money,
        render: (value, index) => {
          const newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          let diffDiv = (
            <div>
              <span className={styles.inner_padding}>{newValue}</span>
              <Popover
                content={this.content(index)}
                placement="topRight"
                trigger="click">
                <Button className={styles.pms_button}>详情</Button>
              </Popover>
            </div>
          );
          if(Number(value) > 0) {
            diffDiv = (
              <div>
                <span className={styles.inner_up}>{newValue}</span>
                <Icon type={'arrow-up'} className={styles.inner_icon_up}/>
                <Popover
                  content={this.content(index)}
                  placement="topRight"
                  trigger="click">
                  <Button className={styles.pms_button}>详情</Button>
                </Popover>
              </div>
            );
          } else if(Number(value) < 0) {
            diffDiv = (
              <div>
                <span className={styles.inner_down}>{newValue}</span>
                <Icon type={'arrow-down'} className={styles.inner_icon_down}/>
                <Popover
                  content={this.content(index)}
                  placement="topRight"
                  trigger="click">
                  <Button className={styles.pms_button}>详情</Button>
                </Popover>
              </div>
            );
          }

          return diffDiv;
        }
      }];
  }

  content = (index) => {
    const dataSrc = JSON.parse(index.check_budget_info);
    const column_money = styles['column-money'];
    const columns = [
      {
        title: '预算类型',
        dataIndex: 'type',
        render: (value, row) => {
          if(row.pms_code && row.pms_code.length > 0) {
            return row.pms_code.concat('预算');
          }else {
            return value;
          }
        }
      },
      {
        title: '变更前',
        dataIndex: 'old_fee',
        className: column_money,
        render:(value)=>{
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }
      },
      {
        title: '变更后',
        dataIndex: 'new_fee',
        className: column_money,
        render:(value)=>{
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }
      },
      {
        title: '变更情况',
        dataIndex: 'diff_fee',
        className: column_money,
        render:(value)=>{
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }
      }
    ];
    return (
      <div className={styles.pop}>
        <div className={styles.title}>
          变更情况
        </div>
        <h4>{index.dept_name}</h4>
        <Table
          bordered
          dataSource={dataSrc}
          columns={columns}
          pagination={false}
          className={styles.table}
          />
      </div>
    )
  };

  historyColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => index + 1,
      width: '10%'
    },{
      title: '状态',
      dataIndex: 'current_state',
      width: '10%'
    },{
      title: '环节名称',
      dataIndex: 'current_link_name',
      width: '15%'
    },{
      title: '审批人',
      dataIndex: 'current_link_username',
      width: '10%'
    },{
      title:'审批类型',
      dataIndex:'current_opt_flag_show',
      width: '15%'
    },{
      title:'审批意见',
      dataIndex:'current_opt_comment',
      width: '20%'
    },{
      title:'审批时间',
      dataIndex:'current_opt_handle_time',
      width: '20%'
    }
  ];

  /**
   * 作者：薛刚
   * 创建日期：2018-10-29
   * 功能：将数据源转换成格式，统计各个部门的个数，做合并单元格
   * @param budgetArray 差旅费预算数组
   */
  changeDataSource = (budgetArray) => {
    const result = {};
    if(budgetArray.length > 0) {
      // 按照年度分组
      const year_result = this.groupByYear(budgetArray);
      // 按照年度和部门分组
      const dept_result = this.groupByYearAndDept(budgetArray);
      result.year_rowspan = year_result;
      result.dept_rowspan = dept_result;
    }
    return result;
  }

  /**
   * 作者：薛刚
   * 创建日期：2018-10-29
   * 功能：计算数据，实现合并行
   * @param countArray 带有count属性的数组
   */
  computeRowSpan = (countArray) => {
    const tmpArray = new Array();
    tmpArray[0] = 0;
    for(let i=1; i<countArray.length+1; i++) {
      tmpArray[i] = countArray[i-1].count;
    }

    const rowSpanArray = new Array();
    for(let m=0; m<countArray.length; m++) {
      const rowSpan = countArray[m].count;
      let rowSpanIndex = 0;
      for(let n=0; n<=m; n++){
        rowSpanIndex += tmpArray[n];
      }
      const spanObj = {
        index: rowSpanIndex,
        span: rowSpan
      }
      rowSpanArray.push(spanObj);
    }

    return rowSpanArray;
  }

  /**
   * 作者：薛刚
   * 创建日期：2018-10-29
   * 功能：根据年份分组
   * @param budgetArray 差旅费预算数组
   */
  groupByYear = (budgetArray) => {
    const map = {}, year_group = [], year_result = [];
    // 按照年进行分组，确定每年的数据行数
    for(let i=0; i<budgetArray.length; i++) {
      const data = budgetArray[i];
      if(!map[data.year]){
        year_group.push({
          year: data.year,
          budget: [data]
        });
        map[data.year] = data;
      }else {
        for(var j = 0; j < year_group.length; j++){
          const dj = year_group[j];
          if(dj.year == data.year){
            dj.budget.push(data);
            break;
          }
        }
      }
    }
    for(let i=0; i<year_group.length; i++) {
      const dataByYear = year_group[i];
      year_result.push({
        year: dataByYear.year,
        count: dataByYear.budget.length
      });
    }
    const year_row_span = this.computeRowSpan(year_result);
    return year_row_span;
  }

  /**
   * 作者：薛刚
   * 创建日期：2018-10-29
   * 功能：根据年份和部门分组
   * @param budgetArray 差旅费预算数组
   */
  groupByYearAndDept = (budgetArray) => {
    const map = {}, year_group = [], dept_group = [], year_dept_result = [];
    // 按照年进行分组，确定每年的数据行数
    budgetArray.map((budgetItem) => {
      if(!map[budgetItem.year]){
        year_group.push({
          year: budgetItem.year,
          budget: [budgetItem]
        });
        map[budgetItem.year] = budgetItem;
      }else {
        year_group.map((yearItem) => {
          if(yearItem.year == budgetItem.year){
            yearItem.budget.push(budgetItem);
            return true;
          }
        })
      }
    })

    // 再按照部门进行分组，确定每年每个部门的数据行数
    year_group.forEach((group) => {
      const year = group.year;
      const budgetList = group.budget;
      const dept_map = {};
      for(let m=0; m<budgetList.length; m++) {
        const dept_data = budgetList[m];
        if(!dept_map[dept_data.dept_name]){
          dept_group.push({
            year: year,
            dept_name: dept_data.dept_name,
            budget: [dept_data]
          });
          dept_map[dept_data.dept_name] = dept_data;
        }else {
          for(var n = 0; n < dept_group.length; n++){
            const dn = dept_group[n];
            if(dn.dept_name == dept_data.dept_name && dn.year == dept_data.year){
              dn.budget.push(dept_data);
              break;
            }
          }
        }
      }
    })

    for(let i=0; i<dept_group.length; i++) {
      const dataByYearAndDept = dept_group[i];
      year_dept_result.push({
        year: dataByYearAndDept.year,
        dept_name: dataByYearAndDept.dept_name,
        count: dataByYearAndDept.budget.length
      });
    }
    const year_dept_row_span = this.computeRowSpan(year_dept_result);
    return year_dept_row_span;
  }

  go2HistoryDetail = (projId, record, dispatch) => {
    dispatch(
      routerRedux.push({
        pathname: '/travelBudgetChangeReview/travelBudgetHistory',
        query: {
          arg_proj_id: projId,
          arg_check_id: record.check_id,
        }
      })
    );
  }

  render() {
    const {dataSrc, history, reviewOpt, returnOpt, status, projId, dispatch} = this.props;
    const data = this.changeDataSource(dataSrc.DataRows);
    const travelColumns = this.travelBudgetColumns(data);
    let link = (
      <div className={styles.phase}>
        <span>上一环节：{dataSrc.pre_link_name}</span>
        <span className={styles.current}>当前环节：{dataSrc.current_link_name}</span>
      </div>
    );
    if(status === '3') {
      link = null;
    }
    return (
      <div className={styles.container}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item>任务详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.title}>
          <h2>{dataSrc.proj_name}</h2>
          {link}
        </div>
        <Tabs defaultActiveKey="1" tabBarExtraContent={returnOpt}>
          <TabPane tab="差旅费预算变更" key="1">
            <h4>单位：元</h4>
            <Table
              bordered
              dataSource={dataSrc.DataRows}
              columns={travelColumns}
              pagination={false}
              className={styles.table}
              />
            {reviewOpt}
            { dataSrc.hasOwnProperty('return_reason') &&
            <div className={styles.return_reason}>
              <span>退回原因：</span>{dataSrc.return_reason == '' ? '无' : dataSrc.return_reason}
            </div>
            }
          </TabPane>
          <TabPane tab="审批环节" key="2">
            <Table
              bordered
              dataSource={history}
              columns={this.historyColumns}
              pagination={false}
              className={styles.table}
              style={{ cursor: 'pointer' }}
              onRowClick={(record) => this.go2HistoryDetail(projId, record, dispatch)}
              />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default travelBudgetChange;
