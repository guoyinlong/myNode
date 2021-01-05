/**
 * 作者：王旭东
 * 创建日期：2018-9-5
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：填写退回的工时
 */
import React, {PureComponent} from "react";
import {connect} from "dva";
import {Table, Modal, Icon, Select, DatePicker, Checkbox, InputNumber, Button, Spin} from "antd";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
import moment from "moment";
import style from "./style.less";
import cookie from "js-cookie";

//点击编辑调用此方法，显示input或value
const EditableCell = ({editable, value, onChange}) => (
  <div>
    {editable
      ? <InputNumber
        min={0}
        max={24}
        step={0.5}
        style={{textAlign: "center"}}
        value={value}
        defaultValue={0}
        onChange={value => onChange(value)}
      />
      : value
    }
  </div>
);

class AddReturnTime extends PureComponent {
  state = {
    okWindow: false, // 确认弹窗
  };

  // 选择项目
  selectChange = (v) => {
    const {dispatch} = this.props;
    dispatch({
      type: "addReturnTime/selectChange",
      selectProj: v
    });
  };

  // 不能选择时间,
  disabledDate = (current) => {
    if (this.props.maxMonth === "" || this.props.maxMonth === undefined) {
      return (
        current.year() > moment().year()
        || (current.year() === moment().year() && current.month() > moment().month())
      )
    } else {
      if (moment(this.props.maxMonth).year() === moment().year()) {
        return (current.month() <= moment(this.props.maxMonth).month()
          || current.month() > moment().month())
      } else if (moment(this.props.maxMonth).year() < moment().year()) {
        return (
          current.year() < moment(this.props.maxMonth).year()
          || current.year() > moment().year()
          || (current.year() === moment(this.props.maxMonth).year() && current.month() <= moment(this.props.maxMonth).month())
          || (current.year() === moment().year() && current.month() > moment().month())
        )
      }
    }
  };


  // 活动列表选择的值
  CheckboxGroupChange = (value) => {
    const {dispatch} = this.props;
    dispatch({
      type: "addReturnTime/CheckboxGroupChange",
      value: value,
    });
  };

  // 判断一个日期2018-7-8在另外两个日期之间,包含端点日期
  AisbetweenBandC = (Atime, BTime, CTime) => {
    return (new Date(Atime).getTime() >= new Date(BTime).getTime() &&
      new Date(Atime).getTime() <= new Date(CTime).getTime()
    )
  }

  // 渲染可编辑表格 三个参数分别为 当前格内内容 行内容 列标签（dataIndex）
  renderColumns = (text, record, column) => {
    let {IsCommit, invalid_date, effective_date, timeSelect, task_type} = this.props;
    let begintime = timeSelect.weekStart;
    let endtime = timeSelect.weekEnd;
    let editableState = true;

    if (record.activityName === "合计" || IsCommit === '1') {
      editableState = false;
    }

    let week = ['mon', 'tues', 'wed', 'thur', 'fri', 'sat', 'sun']

    // 项目开始时间左边的不可编辑
    if (effective_date !== '') {
      if (this.AisbetweenBandC(effective_date, begintime, endtime)) {
        // 周日返回的是0，需要改成7
        if (new Date(effective_date).getDay() === 0) {
          if (week.indexOf(column) + 1 < 7) {
            editableState = false;
          }
        } else if (week.indexOf(column) + 1 < new Date(effective_date).getDay()) {
          editableState = false;
        }

      }
    }

    // 项目结束时间右边的不可编辑
    if (invalid_date !== '') {
      if (this.AisbetweenBandC(invalid_date, begintime, endtime)) {
        // 将周日改成7
        if (new Date(invalid_date).getDay() === 0) {
          if (week.indexOf(column) + 1 > 7) {
            editableState = false;
          }
        } else if (week.indexOf(column) + 1 > new Date(invalid_date).getDay()) {
          editableState = false;
        }
      }
    }

    // 如果跨月，上个月的工时不能补录
      if(task_type === 'makeup_timesheet_back'){
          if (new Date(begintime).getMonth() !== new Date(endtime).getMonth()) {
              // 找到跨月周的前一个月最后一天周几
              let lastDayDate = new Date(new Date(begintime).getFullYear(),
                  new Date(begintime).getMonth() + 1, 0).getDay()

              if (lastDayDate === 0) {
                  console.log('跨月的最后一天不可能是周日！所以不会打印！')
              } else {
                  if (week.indexOf(column) + 1 <= lastDayDate) {
                      editableState = false;
                  }
              }
          }
      }


    return (
      <EditableCell
        editable={editableState}
        value={text}
        maxMonthDays={Number(this.props.maxMonthDays)}
        onChange={value => this.handleChange(value, column, record)}
      />
    );
  };

  // 表头
  columns = [
    {
      title: "",
      dataIndex: "activityName",
      key: "value",
      width: '15%',
    }, {
      title: "星期一",
      dataIndex: "mon",
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'mon'),
    }, {
      title: "星期二",
      dataIndex: "tues",
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'tues'),
    }, {
      title: "星期三",
      dataIndex: "wed",
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'wed'),
    }, {
      title: "星期四",
      dataIndex: "thur",
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'thur'),
    }, {
      title: "星期五",
      dataIndex: "fri",
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'fri'),
    }, {
      title: "星期六",
      dataIndex: "sat",
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'sat'),
    }, {
      title: "星期日",
      dataIndex: "sun",
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'sun'),
    }, {
      title: "活动类型合计",
      dataIndex: "total_hours",
      width: '15%',
    }
  ];

  // 弹窗的表格
  windowColumns = [
    {
      title: "",
      dataIndex: "activityName",
      key: "value",
      width: '15%',
    }, {
      title: "星期一",
      dataIndex: "mon",
      width: '10%',
    }, {
      title: "星期二",
      dataIndex: "tues",
      width: '10%',
    }, {
      title: "星期三",
      dataIndex: "wed",
      width: '10%',
    }, {
      title: "星期四",
      dataIndex: "thur",
      width: '10%',
    }, {
      title: "星期五",
      dataIndex: "fri",
      width: '10%',
    }, {
      title: "星期六",
      dataIndex: "sat",
      width: '10%',
    }, {
      title: "星期日",
      dataIndex: "sun",
      width: '10%',
    }, {
      title: "活动类型合计",
      dataIndex: "total_hours",
      width: '15%',
    }
  ];

  // 点击保存按钮和提交按钮
  saveAndSubmit = (saveOrSubmit) => {
    const {dispatch} = this.props;
    dispatch({
      type: "addReturnTime/saveAndSubmit",
      saveOrSubmit: saveOrSubmit
    });

    // 在弹窗页面点击确认时，将弹窗关闭
    if (saveOrSubmit === 'submit') {
      this.setState({
        okWindow: false,
      })
    }
  };
  // 点击第一层工时确认按钮
  OKClick = () => {
    this.setState({
      okWindow: true,
    })
  }
  // 弹窗的取消按钮
  handleCancel = () => {
    this.setState({
      okWindow: false,
    })
  }

  // 将编辑数据存储在state中 column保存了列属性
  handleChange(value, column, record) {
    const {dispatch} = this.props;
    dispatch({
      type: "addReturnTime/handleChange",
      value: value,
      column: column,
      record: record
    });
  }


  render() {
    const {allProjectTime, allActivityList, selectProjectKey, totalHours, IsCommit, timeSelect, approvedby} = this.props;
    // 当前周期的开始时间和结束时间
    let begintime;
    let endtime;
    begintime = timeSelect.weekStart;
    endtime = timeSelect.weekEnd;

    // 取出当前页面的工时数据
    let thisProjectData = allProjectTime[0];

    // 全部活动
    let options = [];
    if (allActivityList.length !== 0 && selectProjectKey !== '') {
      // 存在满足条件的对象 selectProjectKey 为 - 拼接串 前边是proj_id
      let activityListOne = allActivityList.filter(
        (item) => item.proj_id === selectProjectKey.split('-')[0]
      )[0];
      if (activityListOne) {
        // 存在activity_list属性
        if (activityListOne.activity_list) {
          options = activityListOne.activity_list.map(item => {
            return ({
              label: item.activity_name,
              value: item.activity_code
            })
          })
        }
      }
    }

    // 已有活动类型
    let checkOptions = [];
    if (allProjectTime.length !== 0) {
      if (allProjectTime.filter((item) => item.proj_pms_key === selectProjectKey)[0]) {
        // 找到活动列表的对象
        let checkListOne =
          allProjectTime.filter((projItem) => projItem.proj_pms_key === selectProjectKey)[0];
        // 对象包含活动列表属性
        if (checkListOne) {
          if (checkListOne.activity_list) {
            checkOptions = checkListOne.activity_list.map(checkItem => checkItem.activity_id);
          }
        } else {
          checkOptions = [];
        }
      }
    }

    // 下拉框的option
    let optionList;
    if (allProjectTime.length !== 0) {
      optionList = allProjectTime.map((item) => {
        return (
          <Option value={item.proj_pms_key} key={item.proj_pms_key} style={{ fontWeight:'bold'}}>
            {item.proj_show_name}{item.allTimeTable ? '--已填 '+ item.allTimeTable[0].total_hours: ''}
          </Option>
        )
      })
    }

    // 表格数据
    let tableData = [];
    if (allProjectTime.filter((item) => item.proj_pms_key === selectProjectKey).length !== 0) {
      let projectData = allProjectTime.filter(
        (item) => item.proj_pms_key === selectProjectKey)[0];
      tableData = projectData.activity_list;
      thisProjectData = projectData;

    }


    // 确认，弹框的表格数据
    let tableDataW; // 每一个项目的表格数据
    let allTimeTable; // 每一个项目的合计数据
    let windowTableList = allProjectTime.map((tableProjItem, index) => {
      // 表格数据
      tableDataW = tableProjItem.activity_list;
      allTimeTable = tableProjItem.allTimeTable;

      return (
        <div key={index}>
          <div style={{marginTop: '10px'}}>
            <span style={{color: 'black', fontSize: '16px', fontWeight: 'bold'}}>{tableProjItem.proj_show_name}</span>
          </div>
          <div style={{marginBottom: '20px', width: '700px'}}>
            <Table
              size="small"
              columns={this.windowColumns}
              dataSource={tableDataW}
              bordered={false}
              pagination={false}
            />
            <Table
              size="small"
              dataSource={allTimeTable ? allTimeTable : []}
              columns={this.windowColumns}
              showHeader={false}
              pagination={false}
              bordered={false}
            />
          </div>
        </div>
      )
    })

    return (
      <Spin tip='加载中' spinning={this.props.loading}>
        <div style={{paddingTop: 13, paddingBottom: 16, background: "white"}}>
          <div style={{paddingLeft: 32, paddingRight: 20}}>
            <div style={{background: 'white', marginTop: '15px'}}>
              <span>退回原因 : </span>
              <span style={{marginLeft: "10px"}}>
                {approvedby}
              </span>
            </div>
            <div style={{margin: "20px 0"}}>
              <span style={{marginRight: "5px"}}>团队/PMS名称 : </span>
              <Select
                style={{width: '410px'}}
                onChange={this.selectChange}
                value={selectProjectKey}
              >
                {optionList}
              </Select>
              <span style={{marginLeft: "50px"}}>本周工时 : </span>
              <span style={{marginLeft: "10px"}}>
                {timeSelect.weekStart + '至' + timeSelect.weekEnd}
              </span>
              {/*<span style={{marginLeft: "84px"}}>生产/PMS编码:</span>
              <span style={{marginLeft: "8px", fontWeight: 'bold'}}>{this.props.proj_code}</span>*/}
            </div>
            <div style={{border: '1px solid #D8D8D8', borderRadius: '6px'}}>
              <div style={{margin: '20px 20px'}}>
                <span>活动类型 ：</span>
                <div style={{margin: '10px 0px'}}>
                  <CheckboxGroup
                    className={style.checkBoxGroup}
                    options={options}
                    value={checkOptions}
                    onChange={(value) => this.CheckboxGroupChange(value)}
                    disabled={IsCommit === "1"}
                  />
                </div>
              </div>
              <div style={{margin: '20px 20px'}}>
                <Table
                  columns={this.columns}
                  dataSource={tableData}
                  bordered={false}
                  pagination={false}
                />
                <Table
                  dataSource={thisProjectData ? thisProjectData.allTimeTable : []}
                  columns={this.columns}
                  showHeader={false}
                  pagination={false}
                  bordered={false}
                />
              </div>
            </div>
            <div style={{margin: '20px 0px'}}>
              <Button
                disabled={IsCommit === "1"}
                type="primary"
                onClick={() => this.OKClick()}>提交</Button>
              <Button
                disabled={IsCommit === "1"}
                style={{marginLeft: '10px'}}
                type="default"
                onClick={() => this.saveAndSubmit('delete')}>删除</Button>
            </div>

            {/*提交弹窗*/}
            <Modal
              width={'730px'}
              title={<h2 style={{textAlign: 'center'}}>填写工时预览</h2>}
              visible={this.state.okWindow}
              onOk={() => this.saveAndSubmit('submit')}
              onCancel={this.handleCancel}
              okButtonProps={{textAlign: 'center'}}
              cancelButtonProps={{textAlign: 'center'}}
            >
              {windowTableList}
              <div>
                <h3 style={{fontSize: '18px', color: '#FA7252'}}>请确认工时，总计 {totalHours} 小时。 如果没有问题，请点击确认按钮提交。</h3>
              </div>
            </Modal>

            <div style={{color: '#FA7252', fontStyle: 'italic', marginTop: 32}}>
              <p>提示：</p>
              <p>1、若参与多个项目，请全部填报后一起保存/提交</p>
              <p>2、填报的工时只能在 {begintime + ' 至 ' + endtime} 期间提交，且所有项目只能提交一次</p>
              <p>3、填报的工时以0.5小时为一个单位</p>
            </div>

          </div>
        </div>
      </Spin>
    );
  }
}


function mapStateToProps(state) {
  return {
    loading: state.loading.models.addReturnTime,
    ...state.addReturnTime
  }
}

export default connect(mapStateToProps)(AddReturnTime);
