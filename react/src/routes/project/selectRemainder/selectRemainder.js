import React from "react";
import {connect} from "dva";
import {Button, Row, Col, Input, Table, Menu, Dropdown, message, Select} from "antd";
import AdvancedSearchForm from './advancedSearchForm.js';
import moment from 'moment';
import exportExl from '../../../components/commonApp/exportExl';
import styles from './projectTable.less';


const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  }, {
    title: '年度',
    dataIndex: 'year',
    key: 'year',
  }, {
    title: '季度',
    dataIndex: 'season',
    key: 'season',
  }, {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  }, {
    title: '评A余数',
    dataIndex: 'remainderA',
    key: 'remainderA',
  }, {
    title: '评B余数',
    dataIndex: 'remainderB',
    key: 'remainderB',
  }, {
    title: '评C余数',
    dataIndex: 'remainderC',
    key: 'remainderC',
  },
];


//创建router类，继承React的Component类
class selectRemainder extends React.Component {
  constructor(props) {
    super(props);
    this.projQuery = this.projQuery.bind(this);
  }

  projQuery = (value) => {
    this.props.dispatch({
      type: 'selectRemainder/projQuery',
      payload: value
    });
  }
  exportExcel = () => {
    let year = this.props.projectData[0].year
    let season = this.props.projectData[0].season
    if (year === undefined || season === undefined) {
      message.error('当前时间没有余数信息', 6);
      return
    }
    let tab = document.querySelector('table');
    let title = year + "年 " + "第" + season + "季度 " + "部门评级余数信息";
    exportExl()(tab, title);

  }
  //     handleChange(event) {
  //     this.setState({year: event.target.year});
  //     this.setState({season: event.target.season});
  //   };

  onOUNameChange= (value) =>{

    this.props.dispatch({
      type: "selectRemainder/updateDepartmentName",
      departmentName: value
    });
  }

  onClickBtn = (type) => {
    if (type === 'query') {

      this.props.dispatch({
        type: "selectRemainder/queryData",
      });
    } else if (type === 'reset') {

      this.props.dispatch({
        type: "selectRemainder/updateDepartmentName",
        departmentName: ""
      });

      this.props.dispatch({
        type: "selectRemainder/inited",
      });
    } else {
      this.props.dispatch({
        type: "selectRemainder/exportExl",
      });
    }
  }

  render() {
    const {years, projectData, departmentName, year, season, deptList} = this.props;
    const deptOption = deptList.map((item, index) => {
      return (
        <Option key={index} value={item}>{item}</Option>
      )
    })

    var dataSource = projectData.map((item, index, ary) => {
      item.key = index;
      return item;
    });
    return (

      <div className={styles.container}>
        <div className={styles.title}>部门评级余数信息</div>
        <div className={styles.screen}>
          <Row>
            <Col span={12} className={styles.select}>
              <AdvancedSearchForm yearData={years} year={year} season={season} handleChange={this.projQuery}/>
            </Col>
          </Row>
        <Row>
            <Col span={12} >
              <div>部门名称:&nbsp;&nbsp;<Select style={{width: "300px"}} value={departmentName}
                                                                 onChange={this.onOUNameChange}>
              {deptOption}
            </Select></div>
            </Col>
          </Row>
          <Row>
            <Col span={3} className={styles.select}>
              <Button onClick={() => this.onClickBtn("reset")}
                      type="primary">清空条件</Button>
            </Col>
            <Col span={2} className={styles.select}>
              <Button onClick={() => this.onClickBtn("query")}
                      type="primary">查询</Button>
            </Col>
            <Col span={2} className={styles.select}>
              <Button onClick={() => this.exportExcel()}
                      type="primary">导出</Button>
            </Col>

          </Row>
        </div>
        <Row gutter={16}>
          <div>
            <Table className={styles.orderTable} dataSource={dataSource} columns={columns}/>

          </div>
        </Row>
      </div>
    )
  }
}

//数据映射
const mapStateToProps = (state) => {
  return {
    ...state.selectRemainder,
  };
};


//
export default connect(mapStateToProps)(selectRemainder);
