/**
 * 作者：王旭东
 * 创建日期：2018-8-23
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：拆分之后的工时填报
 */
import React, {PureComponent} from "react";
import {connect} from "dva";
import {Table, Modal, Select,Checkbox, InputNumber, Button, Spin} from "antd";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
import moment from "moment";
import style from "./style.less";
// import cookie from "js-cookie";

//点击编辑调用此方法，显示input或value
const EditableCell = ({editable, value, onChange,disabled}) => (
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

class AddTime extends PureComponent {
  state = {
    okWindow: false, // 确认弹窗
  };

  // 选择项目
  selectChange = (v) => {
    const {dispatch} = this.props;
    dispatch({
      type: "addTime/selectChange",
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
      type: "addTime/CheckboxGroupChange",
      value: value,
    });
  };

  // 判断一个日期2018-7-8在另外两个日期之间,包含端点日期
  AisbetweenBandC = (Atime,BTime,CTime) => {
    return ( new Date(Atime).getTime() >= new Date(BTime).getTime() &&
      new Date(Atime).getTime() <= new Date(CTime).getTime()
    )
  }
  // 渲染可编辑表格 三个参数分别为 当前格内内容 行内容 列标签（dataIndex）
  renderColumns = (text, record, column) => {
    let { IsCommit, invalid_date, effective_date, begintime, endtime } = this.props;
    let editableState = true;

    if (record.activityName === "合计" || IsCommit === '1') {
      editableState = false;
    }

    let week = ['mon','tues','wed','thur','fri','sat','sun']

    // 项目开始时间左边的不可编辑
    if(effective_date !== '' && invalid_date !== '') {
      if (this.AisbetweenBandC(effective_date,begintime,endtime )) {
        // 周日返回的是0，需要改成7
        if(new Date(effective_date).getDay() === 0 ) {
          if (week.indexOf(column) + 1 < 7 ) {
            editableState = false;
          }
        }else if (week.indexOf(column) + 1 < new Date(effective_date).getDay() ){
          editableState = false;
        }
      } else if(Date.parse(effective_date) < Date.parse(begintime) && Date.parse(invalid_date) < Date.parse(begintime) ) {
        editableState = false;
      } else if (Date.parse(effective_date) >Date.parse(endtime) ) {
        editableState = false;
      }
    }
    // 项目结束时间右边的不可编辑
    if(invalid_date !== '') {
      if (this.AisbetweenBandC(invalid_date,begintime,endtime )) {
        // 将周日为 0
        if (new Date(invalid_date).getDay() === 0) {
          if (week.indexOf(column) + 1 > 7 ) {
            editableState = false;
          }
        }else if (week.indexOf(column) + 1 > new Date(invalid_date).getDay()) {
          editableState = false;
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
  windowColumns =  [
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
      type: "addTime/saveAndSubmit",
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
      type: "addTime/handleChange",
      value: value,
      column: column,
      record: record
    });
  }

  render() {
    const {allProjectTime, allActivityList, selectProjectKey, totalHours, IsCommit, hasProject, isOutDate, hasConditions} = this.props;
    // 填写了几个项目？
    let addProjNum = 0
    allProjectTime.forEach((allPrItem)=> {
      if (allPrItem.activity_list && allPrItem.activity_list.length!== 0 ) {
        addProjNum = addProjNum + 1
      }
    })

    // 取出当前页面的工时数据
    let thisProjectData;
    if (allProjectTime.filter((projItem) => projItem.proj_pms_key === selectProjectKey).length !== 0) {
      thisProjectData =
        allProjectTime.filter((projItem) => projItem.proj_pms_key === selectProjectKey)[0]
    }else{
      thisProjectData={};
    }

    // 全部活动
    let options = [];
    if (allActivityList.length !== 0) {
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
    let projectCode; // 选中的生产编码和PMS编码
    if (allProjectTime.filter((item) => item.proj_pms_key === selectProjectKey).length !== 0) {
      let projectData = allProjectTime.filter(
        (item) => item.proj_pms_key === selectProjectKey)[0];
      tableData =projectData .activity_list;

      // 生产编码
      projectCode = projectData.proj_code;
      if (projectData.pms_code) {
        projectCode = projectCode + ' / '+ projectData.pms_code
      }
    }

    // 确认，弹框的表格数据
    let tableDataW; // 每一个项目的表格数据
    let allTimeTable; // 每一个项目的合计数据
    let windowTableList = allProjectTime.map((tableProjItem, index) => {
      // 表格数据
      tableDataW = tableProjItem.activity_list;
      allTimeTable = tableProjItem.allTimeTable;

      return (
        <div key={index} >
          <div style={{marginTop: '10px'}}>
            <span style={{color: 'black', fontSize:'16px',fontWeight: 'bold' }}>{tableProjItem.proj_show_name}</span>
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
          {
            hasProject ?
              <div style={{paddingLeft: 32, paddingRight: 20}}>
                <div style={{background: 'white', marginTop: '15px'}}>
                  <span >本周工时 : </span>
                  <span style={{marginLeft: "10px"}}>{this.props.begintime} 至 {this.props.endtime}</span>
                  <span style={{marginLeft: "140px"}}>工时总数 : </span>
                  <span style={{marginLeft: "5px" }}>{totalHours}（小时）</span>
                  <span style={{marginLeft: "47px"}}>工时填写情况 : </span>&nbsp;&nbsp;
                  <span style={{marginLeft: "5px"}}>
                共参与 {allProjectTime.length} 个项目，已填 {addProjNum} 个，未填 {allProjectTime.length-addProjNum} 个
              </span>
                </div>
                <div style={{margin: "20px 0"}}>
                  <span style={{marginRight: "5px"}}>团队/PMS名称 : </span>
                  <Select
                    style={{width: '410px' }}
                    onChange={this.selectChange}
                    value={selectProjectKey}
                  >
                    {optionList}
                  </Select>
                  <span style={{marginLeft: "50px"}}>生产/PMS编码 : </span>
                  <span style={{marginLeft: "8px"}}>{projectCode}</span>
                </div>
                <div style={{border: '1px solid #D8D8D8', borderRadius: '6px'}}>
                  <div style={{margin: '20px 20px'}}>
                    <span>当前状态 ：</span>
                    <span style={{color: '#FA7252'}}>
                      {/* {thisProjectData ? thisProjectData.show_status ? thisProjectData.show_status : '-':''} */}
                      
                      {
                        hasConditions 
                        ? "您没有参与任何项目或者项目已经结项请联系项目经理" 
                        : thisProjectData 
                        ? thisProjectData.show_status 
                        ? thisProjectData.show_status 
                        : '-'
                        :''
                      }
                      </span>
                  </div>
                  {
                    IsCommit !== '1' ?
                      <div style={{margin: '20px 20px'}}>
                        <span>活动类型 ：</span>
                        <div style={{margin: '10px 0px'}}>
                          <CheckboxGroup
                            disabled={IsCommit==='1' || hasConditions}
                            className={style.checkBoxGroup}
                            options={options}
                            value={checkOptions}
                            onChange={(value) => this.CheckboxGroupChange(value)}
                          />
                        </div>
                      </div>
                      :
                      ''
                  }

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
                {
                  IsCommit!=='1'?
                    <div style={{margin: '20px 0px'}}>
                      <Button
                        disabled={IsCommit==='1' || hasConditions}
                        type="default"
                        onClick={() => this.saveAndSubmit('save')}>保存</Button>
                      <Button
                        disabled={IsCommit==='1'||isOutDate==='1' || hasConditions}
                        style={{marginLeft: '10px'}}
                        type="primary"
                        onClick={() => this.OKClick()}>提交</Button>
                    </div>
                    :
                    ''
                }


                {/*提交弹窗*/}
                <Modal
                  width={'730px'}
                  title={<h2 style={{textAlign: 'center'}}>本周工时预览</h2>}
                  visible={this.state.okWindow}
                  onOk={() => this.saveAndSubmit('submit')}
                  onCancel={this.handleCancel}
                  okButtonProps={{ textAlign: 'center' }}
                  cancelButtonProps={{  textAlign: 'center' }}
                >
                  {windowTableList}
                  <div>
                    <h3 style={{fontSize:'18px',color: '#FA7252'}}>请确认工时，总计 {totalHours} 小时。 如果没有问题，请点击确认按钮提交。</h3>
                  </div>
                </Modal>

                <div style={{color: '#FA7252', fontStyle: 'italic', marginTop: 32}}>
                  <p>提示：</p>
                  <p>1、若参与多个项目，请全部填报后一起保存/提交</p>
                  <p>2、填报的工时只能在 {this.props.begintime + ' 至 ' + this.props.endtime} 期间提交，且所有项目只能提交一次</p>
                  <p>3、填报的工时以0.5小时为一个单位</p>
                </div>

              </div>
              :
              <div style={{paddingLeft: 32, paddingRight: 20}}>
                <div style={{background: 'white'}}>
                  <span>本周工时 : </span>
                  <span style={{marginLeft: "10px", fontWeight:'bold'}}>{this.props.begintime}至{this.props.endtime}</span>
                  <span style={{marginLeft: "140px"}}>工时总数 : </span>
                  <span style={{marginLeft: "5px" , fontWeight:'bold'}}>{totalHours}（小时）</span>
                  <span style={{marginLeft: "39px"}}>工时填写情况 : </span>&nbsp;&nbsp;
                  <span style={{marginLeft: "5px",  fontWeight:'bold'}}>
                共参与 {allProjectTime.length} 个项目，已填 {addProjNum} 个，未填 {allProjectTime.length-addProjNum} 个
              </span>
                </div>
                <div style={{margin: "20px 0"}}>
                  <span style={{marginRight: "5px"}}>团队/PMS名称 : </span>
                  <Select
                    style={{width: '410px' ,fontWeight:'bold'}}
                    onChange={this.selectChange}
                    value={selectProjectKey}
                  >
                    {optionList}
                  </Select>
                  <span style={{marginLeft: "50px"}}>生产/PMS编码 : </span>
                  <span style={{marginLeft: "8px",  fontWeight:'bold'}}>{projectCode}</span>
                </div>
              </div>
          }

        </div>
      </Spin>
    );
  }
}


function mapStateToProps(state) {
  return {
    loading: state.loading.models.addTime,
    ...state.addTime
  }
}

export default connect(mapStateToProps)(AddTime);
