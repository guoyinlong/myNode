/**
 * 文件说明: 员工职级薪档信息自定义统计查询功能
 * 作者：jintingZhai
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-02-04
 **/
import React, { Component } from 'react';
import { Button, Select, Table, message, Pagination, Card, Input } from "antd";
import { connect } from "dva";
import Cookie from "js-cookie";
import styles from './style.less';
import exportExcel from "./ExcelExport";

const { Option } = Select;

class personRankPromotionQuery extends Component {
  constructor(props) {
    super(props);

    let dept_id = Cookie.get('dept_id');

    const yearNow = new Date().getFullYear();
    const ou_search = Cookie.get('OUID');
    const user_id = Cookie.get('userid');
    this.state = {
      ou: ou_search,
      dept: dept_id,
      promotion_path: '1',
      year: yearNow,
      user_id: user_id,
      user_id_input: '',
      defaultType: "1",
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

    if (this.props.permission === '1') {
      arg_params["arg_user_id"] = Cookie.get('userid');
    } else if (this.props.permission === '2' && this.state.dept !== '') {
      if (this.state.user_id_input !== '') {
        arg_params["arg_user_id"] = this.state.user_id_input;
      } else {
        arg_params["arg_user_id"] = '';
      }
    }
    arg_params["arg_page_size"] = 10;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_id"] = ou_search;
    arg_params["arg_dept_id"] = this.state.dept;
    arg_params["arg_promotion_path"] = this.state.promotion_path;
    arg_params["arg_year"] = this.state.year;
    arg_params["arg_flag"] = this.props.permission;
    const { dispatch } = this.props;
    if ((this.state.user_id_input !== '' && this.isForam(this.state.user_id_input) || this.state.user_id_input === '')) {
      if (this.state.promotion_path === '') {
        message.error("请选择晋升路径！");
        return;
      } else {
        //TODO 根据条件进行查询
        dispatch({
          type: 'person_rank_promotion_query_model/personRankPromotionQuery',
          query: arg_params
        });
      }
    } else {
      message.error("用户ID需为0开头的7位数字，或者默认为空！");
      return;
    }

  };

  /**必修两个字段都有 */
  comColumns = [
    { title: '姓名', dataIndex: 'user_name' },
    { title: '部门', dataIndex: 'deptname', },
    { title: '年度', dataIndex: 'year', },
    { title: '晋升路径', dataIndex: 'promotion_path', },
    { title: '职级', dataIndex: 'rank_level', },
    { title: '薪档', dataIndex: 'rank_grade', },
    { title: '人才标识', dataIndex: 'talents_name' },
    { title: '生效日期', dataIndex: 'effective_time' },
    { title: '剩余考核积分', dataIndex: 'bonus_points' },
    { title: '是否走新员工晋级', dataIndex: 'new_user_path' },
  ];

  //处理分页
  handlePageChange = (page) => {
    //TODO获取参数
    let queryParams = {};

    queryParams["arg_ou_id"] = this.state.ou_id;
    queryParams["arg_user_id"] = this.state.user_id;
    queryParams["arg_dept_id"] = this.state.dept;
    queryParams["arg_promotion_path"] = this.state.promotion_path;
    queryParams["arg_year"] = this.state.year;
    queryParams["arg_page_current"] = page;   //初始化当前页码为1
    queryParams["arg_page_size"] = 10;  //初始化页面显示条数为10

    const { dispatch } = this.props;
    //TODO
    dispatch({
      type: 'person_rank_promotion_query_model/personRankPromotionQuery',
      query: queryParams
    });
  };


  //导出应该是根据当前搜索的条件，查询完后再导出
  exportExcel = () => {

    const { tableDataListTotal } = this.props;
    let condition = {};

    condition = {
      '姓名': 'user_name',
      '部门': 'deptname',
      '年度': 'year',
      '晋升路径': 'promotion_path',
      '职级': 'rank_level',
      '薪档': 'rank_grade',
      '人才标识': 'talents_name',
      '生效日期': 'effective_time',
      '剩余考核积分': 'bonus_points',
      '是否走新员工晋级': 'new_user_path',
    };

    if (tableDataListTotal.length > 0) {
      exportExcel(tableDataListTotal, '职级薪档数据', condition);
    } else {
      message.info("无职级薪档数据！");
    }
  };

  render() {

    const { loading, tableDataList, ouList, deptList, permission, pathDataList } = this.props;

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
    if (deptDataList !== undefined && deptDataList && deptDataList.length > 0) {
      deptOptionList = deptDataList.map(item =>
        <Option value={item.court_dept_id}>{item.court_dept_name}</Option>
      );
    }
    //选择路径
    let pathData = pathDataList;
    let pathOptionList = '';
    //let pathOptionInit = '';
    if (pathData !== undefined && pathData && pathData.length > 0) {
      //pathOptionInit = pathData[0].path_name;
      pathOptionList = pathData.map(item => {
        return (
          <Option value={item.path_id}>{item.path_name}</Option>
        )
      });
    }

    //获取前5年、后三年的年份
    let date = new Date;
    let yearArray = [];
    for (let i = 0; i < 3; i++) {
      yearArray.push(date.getFullYear() + i);
    }
    for (let i = 0; i < 5; i++) {
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
            <Select style={{ width: '10%' }} defaultValue={auth_ou} disabled={true}>
              {ouOptionList}
            </Select>

            &nbsp;&nbsp;&nbsp;&nbsp;部门：
                <Select style={{ width: '8%' }} onSelect={this.handleDeptChange} value={this.state.dept} disabled={permission === '2' ? false : true}>
              {deptOptionList}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;路径：
                <Select style={{ width: '24%' }} onSelect={this.handleTypeChange} defaultValue={'应用绩效积分等调整薪档'}>
              {pathOptionList}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;年份：
                <Select style={{ width: '8%' }} onSelect={this.handleYearChange} defaultValue={currentDate}>
              {yearList}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;用户ID：
                <Input style={{ width: '10%' }} onChange={this.handleIdChange} defaultValue={''} />

            <div className={styles.btnLayOut}>
              <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
              &nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={() => this.exportExcel()}>{'导出'}</Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={tableDataList}
            pagination={true}
            loading={loading}
            bordered={true}
          />
          {/* <br></br> */}
          {/* <div style={{textAlign: 'center'}}> */}
          {/*加载完才显示页码*/}
          {/* {loading !== true ? */}
          {/* <Pagination current={this.props.currentPage} */}
          {/* total={Number(this.props.total)} */}
          {/* pageSize={10} */}
          {/* onChange={this.handlePageChange} */}
          {/* /> */}
          {/* : */}
          {/* null */}
          {/* } */}
          {/* </div> */}
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
  } = state.person_rank_promotion_query_model;
  return {
    loading: state.loading.models.person_rank_promotion_query_model,
    ...state.person_rank_promotion_query_model,
    tableDataList,
    ouList,
    deptList,
    total,
    currentPage
  };
}
export default connect(mapStateToProps)(personRankPromotionQuery);

