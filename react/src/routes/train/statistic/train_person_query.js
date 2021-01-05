/**
 * 文件说明: 培训统计配置查询界面
 * 作者：wangfujiang
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-08-19
 **/
import React, { Component } from 'react';
import { Button, Switch, Select, Table, Tabs, Row } from "antd";
import { connect } from "dva";
import styles from '../train.less';
import exportExcel from "../ExcelExport";
import message from "../../../components/commonApp/message";

import ReactEcharts from 'echarts-for-react';

const { Option } = Select;

class train_config_query extends Component {
  constructor(props) {
    super(props);
    const yearNow = new Date().getFullYear();
    this.state = {
      year: yearNow,
      querytype: this.props.queryType ? this.props.queryType : value,
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
  };

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
  };
  trainYearChange = (value) => {
    this.setState({
      trainyear: value
    });
  };
  trainTimeChange = (value) => {
    this.setState({
      traintime: value
    });
  };
  trainLevelChange = (value) => {
    this.setState({
      trainlevel: value
    });
  };
  classLevelChange = (value) => {
    this.setState({
      classlevel: value
    });
  };
  trainTypeChange = (value) => {
    this.setState({
      traintype: value
    });
  };
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

    const { loading, tableDataList, query_sql_list, query_title, excle_title, queryType, queryYear } = this.props;

    let querysqllist = query_sql_list.map((item) => {
      return (
        <Option key={item.id} value={item.id}>
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
    let plan_grade = 0;
    let use_grade = 0;
    let end_grade = 0;
    let plan_hour = 0;
    let use_hour = 0;
    let end_hour = 0;
    if (tableDataList.length >= 1) {
      totalparam = tableDataList[tableDataList.length - 1];
      plan_grade = totalparam.class_grade;
      if (totalparam.is_get_credit !== undefined && totalparam.is_get_credit !== null && totalparam.is_get_credit !== '') {
        use_grade = totalparam.is_get_credit;
      }
      end_grade = plan_grade - use_grade;

      plan_hour = totalparam.train_hour;
      if (totalparam.get_hour !== undefined && totalparam.get_hour !== null && totalparam.get_hour !== '') {
        use_hour = totalparam.get_hour;
      }
      end_hour = plan_hour - use_hour;
    }

    const option1 = {
      title: {
        text: '获取积分情况',
        subtext: '获取积分比例',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['未获取 ' + (!end_grade || end_grade === 'undefined' ? 0 : end_grade), '已获取 ' + (!use_grade || use_grade === 'undefined' ? 0 : use_grade)]
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: use_grade, name: '已获取' + (!use_grade || use_grade === 'undefined' ? 0 : use_grade) },
            { value: end_grade, name: '未获取' + (!end_grade || end_grade === 'undefined' ? 0 : end_grade) }
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
        data: ['已完成 ' + (!use_hour || use_hour === 'undefined' ? 0 : use_hour), '未完成 ' + (!end_hour || end_hour === 'undefined' ? 0 : end_hour)]
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: use_hour, name: '已完成 ' + (!use_hour || use_hour === 'undefined' ? 0 : use_hour) },
            { value: end_hour, name: '未完成 ' + (!end_hour || end_hour === 'undefined' ? 0 : end_hour) }
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
        <Row span={2} style={{ textAlign: 'center' }}><h2>个人培训统计查询</h2></Row>
        <div style={{ marginBottom: '15px' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;选择查询类型：
          <Select style={{ width: 500 }} defaultValue={queryType === '2001' ? '已学习课程信息统计' : '计划内未学课程统计'} onSelect={this.queryTypeChange} placeholder="请选择查询类型">
            {querysqllist}
          </Select>
          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.exportExcel()}>{'导出'}</Button>
          </div>
          <br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;培训年度：
          <Select style={{ width: 200 }} defaultValue={queryYear ? queryYear : currentDate} onSelect={this.trainYearChange} >
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
          rowClassName={(record,index)=>{
            let className='Tleft';
            return className;
          }
        }
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



