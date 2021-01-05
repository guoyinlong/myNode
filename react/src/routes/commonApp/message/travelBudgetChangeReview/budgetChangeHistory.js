/**
 * 作者：薛刚
 * 创建日期：2018-10-15
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现差旅费预算变更填报页面
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Breadcrumb } from 'antd';
import styles from './budgetChangeModify.less';

class budgetChangeHistory extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      reasonValue: ''
    }
  }

  columns = (deptCountArray, budgetArray) => {
    return [{
      title: '部门',
      dataIndex: 'dept_name',
      width: '30%',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = 0;
        for(let i=0; i<deptCountArray.length; i++) {
          if (index == deptCountArray[i].index) {
            obj.props.rowSpan = deptCountArray[i].span;
          }
        }
        if (index == budgetArray.length-1) {
          obj.props.colSpan = 2;
        }
        return obj;
      },
    }, {
      title: '预算类型',
      dataIndex: 'type',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if(row.code && row.code.length > 0) {
          obj.children = row.code.concat('预算');
        }
        if (index == budgetArray.length-1) {
          obj.props.colSpan = 0;
        }
        return obj;
      }
    }, {
      title: '差旅费预算（资本化）',
      dataIndex: 'capital',
      render:(value, row, index)=>{
        if(index == budgetArray.length-1) {
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        } else{
          value = value.fee.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }
      }
    }, {
      title: '差旅费预算（费用化）',
      dataIndex: 'expense',
      render:(value, row, index)=>{
        if(index == budgetArray.length-1) {
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        } else {
          value = value.fee.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return <span>{value}</span>;
        }
      }
    }, {
      title: '部门合计',
      dataIndex: 'sum',
      render: (value, row, index) => {
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = 0;
        for(let i=0; i<deptCountArray.length; i++) {
          if (index == deptCountArray[i].index) {
            obj.props.rowSpan = deptCountArray[i].span;
          }
        }
        return obj;
      }
    }]
  };

  // 将数据源转换成格式，统计各个部门的个数，做合并单元格
  changeDataSource = (budgetArray) => {
    const map = {}, group = [], result = [];
    for(let i=0; i<budgetArray.length; i++) {
      const data = budgetArray[i];
      if(!map[data.dept_name]){
        group.push({
          dept_name: data.dept_name,
          budget: [data]
        });
        map[data.dept_name] = data;
      }else {
        for(var j = 0; j < group.length; j++){
          const dj = group[j];
          if(dj.dept_name == data.dept_name){
            dj.budget.push(data);
            break;
          }
        }
      }
    }
    for(let i=0; i<group.length; i++) {
      const dataByDept = group[i];
      const budgetList = dataByDept.budget;
      let sumByDept = 0;
      budgetList.forEach((item) => {
        if(item.hasOwnProperty('capital')){
          sumByDept += Number(item.capital.fee);
        }
        if(item.hasOwnProperty('expense')){
          sumByDept += Number(item.expense.fee);
        }
      })
      result.push({
        dept: dataByDept.dept_name,
        count: budgetList.length,
        total: sumByDept
      });
    }
    return result;
  }

  render() {
    const { projTravelBudgetList, projInfo } = this.props;
    let list = null;
    if(projTravelBudgetList.length !==0 ) {
      list = new Array();
      projTravelBudgetList.map((data, index) => {
        const budget = data.budget;
        const countArray = this.changeDataSource(budget);
        // 处理数据，合并单元格
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
        const columns = this.columns(rowSpanArray, budget);
        const totalInfo = data.total_info;
        let totalList = [];
        totalInfo.map((info, index) => {
          const typeTotal = info.total.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          totalList.push(
            <label key={index}>
              <span>{info.code.length > 0 ? info.code.concat('预算') : info.type}</span>合计：{typeTotal}元
            </label>
          )
        })
        list.push(
          <div key={index}>
            <div className={styles.sum}>
              <label>年度：<span>{data.year}</span></label>
              {totalList}
            </div>
            <Table
              bordered
              dataSource={budget}
              columns={columns}
              pagination={false}
              className={styles.table}
              />
          </div>
        )
      })
    }

    return (
      <div className={styles.container}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/taskList'>任务列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item>审批记录</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.title}>
          <h2>{projInfo.projName}</h2>
          <h3>差旅费预算变更</h3>
        </div>
        {list}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.budgetChangeApply,
    ...state.budgetChangeApply
}
}

export default connect(mapStateToProps)(budgetChangeHistory);
