/**
 * 文件说明: 培训统计配置查询界面
 * 作者：wangfujiang
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-08-19
 **/
import React, { Component } from 'react';
import { Button, Form, Input, Modal, Select, Table, TextArea, Tabs, Row, FormItem, Pagination, Switch } from "antd";
import { connect } from "dva";
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import styles from '../train.less';
import exportExcel from "../ExcelExport";
import DynAddClass from "../DynAddClass";
import message from "../../../components/commonApp/message";

import ReactEcharts from 'echarts-for-react';

const { Option } = Select;
const TabPane = Tabs.TabPane;

class train_config_query extends Component {
  constructor(props) {
    super(props);
    const yearNow = new Date().getFullYear();
    this.state = {
      year: yearNow,
      querytype: '',
      trainyear: yearNow,
      traintime: '',
      trainlevel: '',
      classlevel: '',
      traintype: '',
      showDivFlag: false,
    };
  }
  //动态表头
  comColumns = [];
  excleColums = {};
  //查看图形统计
  showDivFlagOperation = () => {
    if (this.state.showDivFlag) {
      this.setState({
        showDivFlag: false
      });
    } else {
      this.setState({
        showDivFlag: true
      });
    }
  };
  //查询
  search = () => {
    if (this.state.querytype === '' || this.state.querytype === null) {
      message.info("查询类型不能为空！");
    } else {
      let arg_params = {};
      arg_params.arg_page_size = 100;
      arg_params.arg_page_current = 1;
      arg_params.arg_querytype = this.state.querytype;
      arg_params.arg_trainyear = ' and train_year= \'' + this.state.trainyear + '\' ';
      if (this.state.traintime !== '0' && this.state.traintime !== 0 && this.state.traintime !== null && this.state.traintime !== '') {
        arg_params.arg_traintime = ' and train_time= \'' + this.state.traintime + '\' ';
      } else {
        arg_params.arg_traintime = ' and 1=1 ';
      }
      if (this.state.trainlevel !== '0' && this.state.trainlevel !== 0 && this.state.trainlevel !== null && this.state.trainlevel !== '') {
        arg_params.arg_trainlevel = ' and train_level like \'%' + this.state.trainlevel + '%\' ';
      } else {
        arg_params.arg_trainlevel = ' and 1=1 ';
      }
      if (this.state.classlevel !== '0' && this.state.classlevel !== 0 && this.state.classlevel !== null && this.state.classlevel !== '') {
        arg_params.arg_classlevel = ' and class_level= \'' + this.state.classlevel + '\' ';
      } else {
        arg_params.arg_classlevel = ' and 1=1 ';
      }
      if (this.state.traintype !== '0' && this.state.traintype !== 0 && this.state.traintype !== null && this.state.traintype !== '') {
        arg_params.arg_traintype = ' and train_kind= \'' + this.state.traintype + '\' ';
      } else {
        arg_params.arg_traintype = ' and 1=1 ';
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'train_query_model/trainConfigQuery',
        query: arg_params
      });
    }
  }

  //处理分页
  handlePageChange = (page) => {
    //TODO获取参数
    let queryParams = {};
    queryParams["arg_page_current"] = page;   //初始化当前页码为1
    queryParams["arg_page_size"] = 10;  //初始化页面显示条数为10
  };
  //导出应该是根据当前搜索的条件，查询完后再导出
  exportExcel = () => {
    const { tableDataList } = this.props;
    let condition = this.excleColums;
    if (tableDataList.length > 0) {
      exportExcel(tableDataList, '统计数据', condition);
    } else {
      message.info("无数据");
    }
  }
  //选择查询类型
  queryTypeChange = (value) => {
    this.setState({
      querytype: value
    });
  }
  trainYearChange = (value) => {
    this.setState({
      trainyear: value
    });
  }
  trainTimeChange = (value) => {
    this.setState({
      traintime: value
    });
  }
  trainLevelChange = (value) => {
    this.setState({
      trainlevel: value
    });
  }
  classLevelChange = (value) => {
    this.setState({
      classlevel: value
    });
  }
  trainTypeChange = (value) => {
    this.setState({
      traintype: value
    });
  }

  render() {
    //获取前三年的年份
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

    const { loading, tableDataList, query_sql_list, query_title, excle_title } = this.props;
    let querysqllist = query_sql_list.map((item) => {
      return (
        <Option key={item.id}>
          {item.query_name}
        </Option>
      )
    });
    let columns = [];
    if (query_title !== null && query_title !== '') {
      columns = JSON.parse(query_title);
      this.comColumns = JSON.parse(query_title);
      this.excleColums = JSON.parse(excle_title);
    }
    let totalparam = 0;
    let plan_fee = 0;
    let use_fee = 0;
    let end_fee = 0;
    let plan_class = 0;
    let use_class = 0;
    let end_class = 0;
    let plan_hour = 0;
    let use_hour = 0;
    let end_hour = 0;
    if (tableDataList.length >= 1) {
      totalparam = tableDataList[tableDataList.length - 1];
      plan_fee = totalparam.plan_fee;
      use_fee = totalparam.use_fee;
      end_fee = plan_fee - use_fee;
      plan_class = totalparam.plan_class;
      use_class = totalparam.use_class;
      end_class = plan_class - use_class;
      plan_hour = totalparam.plan_hour;
      use_hour = totalparam.use_hour;
      end_hour = plan_hour - use_hour;
    }

    const option = {
      title: {
        text: '费用使用情况',
        subtext: '费用使用比例',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['未使用' + end_fee, '已使用' + use_fee]
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: end_fee, name: '未使用' + end_fee },
            { value: use_fee, name: '已使用' + use_fee }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    const option1 = {
      title: {
        text: '课程培训情况',
        subtext: '已完成比例',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['已完成' + use_class, '未完成' + end_class]
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: use_class, name: '已完成' + use_class },
            { value: end_class, name: '未完成' + end_class }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    const option2 = {
      title: {
        text: '课时情况',
        subtext: '已完成比例',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['已完成' + use_hour, '未完成' + end_hour]
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: use_hour, name: '已完成' + use_hour },
            { value: end_hour, name: '未完成' + end_hour }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };


    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h2>培训统计自定义查询</h2></Row>
        <div style={{ marginBottom: '15px' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;选择查询类型：
          <Select style={{ width: 500 }} onSelect={this.queryTypeChange} placeholder="请选择查询类型">
            {querysqllist}
          </Select>
          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            {/*<Button type="primary" onClick={()=>this.search()}>{'新增'}</Button>*/}
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.exportExcel()}>{'导出'}</Button>
          </div>
          <br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;培训年度：
          <Select style={{ width: 200 }} defaultValue={currentDate} onSelect={this.trainYearChange} >
            {yearList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;培训时间：
          <Select style={{ width: 200 }} defaultValue='0' onSelect={this.trainTimeChange} >
            <Option value='0'>全部</Option>
            <Option value='第一季度'>第一季度</Option>
            <Option value='第二季度'>第二季度</Option>
            <Option value='第三季度'>第三季度</Option>
            <Option value='第四季度'>第四季度</Option>
            <Option value='全年执行'>全年执行</Option>
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;培训级别：
          <Select style={{ width: 200 }} defaultValue='0' onSelect={this.trainLevelChange} >
            <Option value='0'>全部</Option>
            <Option value='全院级'>全院级</Option>
            <Option value='分院级'>分院级</Option>
            <Option value='部门级'>部门级</Option>
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;课程级别：
          <Select style={{ width: 200 }} defaultValue='0' onSelect={this.classLevelChange} >
            <Option value='0'>全部</Option>
            <Option value='初级'>初级</Option>
            <Option value='中级'>中级</Option>
            <Option value='高级'>高级</Option>
          </Select>
          <br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;培训类型：
          <Select style={{ width: 220 }} defaultValue='0' onSelect={this.trainTypeChange} >
            <Option value='0'>全部</Option>
            <Option value='线上培训'>线上培训</Option>
            <Option value='内训-内部讲师'>内训-内部讲师</Option>
            <Option value='内训-外请讲师'>内训-外请讲师</Option>
            <Option value='外训-参加集团或分子公司培训'>外训-参加集团或分子公司培训</Option>
            <Option value='外训-外派培训'>外训-外派培训</Option>
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={tableDataList}
          pagination={false}
          loading={loading}
          bordered={true}
          scroll={{ x: '100%', y: 450 }}
        />
        <br></br>

        <p>是否图形展示：<Switch onChange={this.showDivFlagOperation} />
        </p>
        <br />
        <div style={{ height: 400, display: this.state.showDivFlag ? "" : "none" }}>
          <ReactEcharts
            style={{ height: 350, width: '33%', display: 'block', float: 'left' }}
            notMerge={true}
            lazyUpdate={true}
            option={option} />
          <ReactEcharts
            style={{ height: 350, width: '33%', display: 'block', float: 'left' }}
            notMerge={true}
            lazyUpdate={true}
            option={option1} />
          <ReactEcharts
            style={{ height: 350, width: '33%', display: 'block', float: 'left' }}
            notMerge={true}
            lazyUpdate={true}
            option={option2} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_query_model,
    ...state.train_query_model,
  };
}
export default connect(mapStateToProps)(train_config_query);



