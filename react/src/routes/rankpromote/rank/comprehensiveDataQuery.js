/**
 * 文件说明: 员工职级薪档信息对接全面激励报告
 * 作者：jintingZhai
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-02-04
 **/
import React, { Component } from 'react';
import { Button, Select, Table, message, Card, Input } from "antd";
import { connect } from "dva";
import Cookie from "js-cookie";
import styles from './style.less';
import styles2 from './mainten.less';
import tableStyle from './table.less';
import exportExlRank from './exportExlRank';

const { Option } = Select;

class comprehensiveDataQuery extends Component {
  constructor(props) {
    super(props);

    let dept_id = Cookie.get('dept_id');

    const yearNow = new Date().getFullYear();
    const ou_search = Cookie.get('OUID');
    const user_id = Cookie.get('userid');
    this.state = {
      ou: ou_search,
      dept: dept_id,
      promotion_path: 'all',
      year: yearNow,
      user_id: user_id,
      user_id_input: '',
    };
  }

  //选择部门
  handleDeptChange = (value) => {
    this.setState({
      dept: value
    })
  };

  //选择类型
  handleTypeChange = (value) => {
    this.setState({
      promotion_path: value
    });
  }

  //选择年份
  handleYearChange = (value) => {
    this.setState({
      year: value
    });
  };
  //输入用户id
  handleIdChange = (e) => {
    this.setState({
      user_id_input: e.target.value
    });
  };
  //输入用户id-校验
  isForam(idStr) {
    let result = idStr.match(/^[0](\d){6}$/);
    if (result === null) {
      return false;
    } else {
      return true;
    }
  }

  //查询
  search = () => {
    let ou_search = this.state.ou;
    if (ou_search === null) {
      //防止没有值，默认为登录员工所在院
      ou_search = Cookie.get('OUID');
    }
    let arg_params = {};

    arg_params["arg_user_id"] = this.state.user_id_input;
    arg_params["arg_page_size"] = 10;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_id"] = ou_search;
    arg_params["arg_dept_id"] = this.state.dept;
    arg_params["arg_promotion_path"] = this.state.promotion_path;
    arg_params["arg_year"] = this.state.year;

    const { dispatch } = this.props;
    if ((this.state.user_id_input !== '' && this.isForam(this.state.user_id_input) || this.state.user_id_input === '')) {
      //TODO 根据条件进行查询
      dispatch({
        type: 'comprehensive_data_query_model/comprehensiveDataQuery',
        query: arg_params
      });
    } else {
      message.error("用户ID需为0开头的7位数字，或者默认为空！");
      return;
    }

  };

  comColumns = [
    {
      title: '员工编号',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
      fixed: 'left'
    },
    {
      title: '姓名',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 100,
      fixed: 'left',
    },
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 100,
      fixed: 'left'
    },
    {
      title: '岗位职级信息',
      children: [
        {
          title: '职级信息（22级）',
          dataIndex: 'rank_information_22',
          width: 100,
        },
        {
          title: '职级信息（T职级）',
          dataIndex: 'rank_information_T',
          width: 100,
        },
        {
          title: '绩效职级（T职级）',
          dataIndex: 'rank_performance_T ',
          width: 100,
        },
        {
          title: '岗位信息',
          dataIndex: 'post_information',
          width: 100,
        },
        {
          title: '同级岗位任职开始时间',
          dataIndex: 'same_level_position_start_time',
          width: 100,
        },
      ]
    },
    {
      title: '晋升信息',
      children: [
        {
          title: '职级调整时间',
          dataIndex: 'rank_adjust_time',
          width: 100,
        },
        {
          title: '职级调整路径',
          dataIndex: 'rank_adjust_path',
          width: 100,
        },
        {
          title: '职级调整后结果',
          dataIndex: 'rank_adjust_result',
          width: 100,
        },
        {
          title: '薪档调整时间',
          dataIndex: 'salary_adjust_time',
          width: 100,
        },
        {
          title: '薪档调整路径',
          dataIndex: 'salary_adjust_path',
          width: 100,
        },
        {
          title: '薪档调整后的结果',
          dataIndex: 'salary_adjust_result',
          width: 100,
        },
        {
          title: '薪档晋升积分剩余情况',
          dataIndex: 'salary_promotion_remain_redits',
          width: 100,
        },
        {
          title: '是否G/D档封顶',
          dataIndex: 'if_G_D_grade_stop',
          width: 100,
        },
        {
          title: 'G/D档封顶年份',
          dataIndex: 'G_D_grade_stop_year',
          width: 100,
        },
      ]
    },
  ];

  // 点击导出按钮
  exportTable = () => {
    let OU = Cookie.get("OU");

    //导出表名称
    var tableName = OU + '-' + '职级薪档对接全面激励报告数据';

    //数据源
    const { tableDataList } = this.props;
    if (tableDataList !== null && tableDataList.length !== 0) {
      exportExlRank(tableDataList, tableName)
    } else {
      message.info("导出数据为空！")
    }
  }

  render() {

    const { loading, tableDataList, ouList, deptList, pathDataList } = this.props;

    let columns = this.comColumns;

    const ouOptionList = ouList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });

    //选择部门
    let deptDataList = deptList;
    let deptOptionList = '';
    if (deptDataList !== undefined) {
      deptOptionList = deptDataList.map(item =>
        <Option value={item.court_dept_id}>{item.court_dept_name}</Option>
      );
      deptOptionList.push(
        < Option value='all' > 全部</Option >
      )
    };

    //选择路径
    let pathData = pathDataList;
    let pathOptionList = '';

    if (pathData !== undefined) {
      pathOptionList = pathData.map(item =>
        <Option value={item.path_id}>{item.path_name}</Option>
      );
      pathOptionList.push(
        < Option value='all' > 全部</Option >
      )
    }


    //获取前5年、后三年的年份
    let date = new Date;
    let yearArray = [];

    for (let i = 0; i < 3; i++) {
      yearArray.push(date.getFullYear() - i);
    }

    const currentDate = date.getFullYear();
    const yearList = yearArray.map((item) => {
      return (
        <Option key={item} value={item.toString()}>
          {item}
        </Option>
      )
    });

    // 这里为每一条记录添加一个key，从0开始
    if (tableDataList.length) {
      tableDataList.map((i, index) => {
        i.key = index;
      })
    }

    const auth_ou = Cookie.get('OU');

    return (
      <div>
        <Card>
          <div style={{ marginBottom: '15px' }}>
            <span>组织机构：</span>
            <Select style={{ width: 160 }} defaultValue={auth_ou} disabled={true}>
              {ouOptionList}
            </Select>

            &nbsp;&nbsp;&nbsp;&nbsp;部门：
                <Select style={{ width: 200 }} onSelect={this.handleDeptChange} value={this.state.dept} disabled={false}>
              {deptOptionList}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;路径：
                <Select style={{ width: '20%' }} onSelect={this.handleTypeChange} defaultValue={"all"}>
              {pathOptionList}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;年份：
                <Select style={{ width: 120 }} onSelect={this.handleYearChange} defaultValue={currentDate}>
              {yearList}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;用户ID：
                <Input style={{ width: 120 }} onChange={this.handleIdChange} defaultValue={''} />
            <br />
            <br />
            <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" disabled={tableDataList && tableDataList[0] ? false : true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
          </div>

          <div className={styles2.costmaintenTable + ' ' + tableStyle.orderTable} style={{ marginTop: '15px' }}>
            <Table
              columns={columns}
              dataSource={tableDataList}
              scroll={{ x: 1700, y: 400 }}
              loading={loading}
            />
          </div>

          <div id='exportTable' className={styles2.costmaintenTable + ' ' + tableStyle.orderTable} scroll={{ x: 1700, y: 400 }} style={{ display: "none" }}>
            <Table
              columns={this.columns}
              dataSource={tableDataList}
              loading={loading}
            />
          </div>
        </Card>
      </div>);
  }
}

function mapStateToProps(state) {
  const {
    tableDataList,
    ouList,
    deptList,
    total,
    currentPage
  } = state.comprehensive_data_query_model;
  return {
    loading: state.loading.models.comprehensive_data_query_model,
    ...state.comprehensive_data_query_model,
    tableDataList,
    ouList,
    deptList,
    total,
    currentPage
  };
}
export default connect(mapStateToProps)(comprehensiveDataQuery);

