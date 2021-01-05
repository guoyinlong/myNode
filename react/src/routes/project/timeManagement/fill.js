/*
 * 作者：刘东旭
 * 日期：2017-11-17
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：工时管理routes层
 */

import React from 'react'; //引入react
import {connect} from 'dva'; //从dva引入connect
import style from './fill.less' //引入样式文件
import {Form, Button, Tabs, Checkbox, Table, InputNumber, Spin, message, Modal} from 'antd';

const FormItem = Form.Item; //表单组
const TabPane = Tabs.TabPane; //标签组
const CheckboxGroup = Checkbox.Group; //多选组
const confirm = Modal.confirm; //确认对话框

/* 组件EditableCell START*/
//点击编辑调用此方法，显示input或value
const EditableCell = ({editable, value, onChange}) => (
  <div>
    {editable
      ? <InputNumber min={0.0} max={24.0} step={0.5} defaultValue={0.0}
                     style={{margin: '-5px 0', width: 70, textAlign: 'center',}} value={value}
                     onChange={value => onChange(value)}/>
      : value
    }
  </div>
);
/* 组件EditableCell END*/

//模拟表格数据
const data = []; //主责项目
const dataOther = []; //配责项目

//表格组件
class Fill extends React.Component {
  constructor(props) {
    super(props);
    //表头
    this.columns = [
      {
        title: "",
        dataIndex: "value",
        key: "value",
        width: '11%',
      }, {
        title: "星期一",
        dataIndex: "Monday",
        render: (text, record) => this.renderColumns(text, record, 'Monday'),
      }, {
        title: "星期二",
        dataIndex: "Tuesday",
        render: (text, record) => this.renderColumns(text, record, 'Tuesday'),
      }, {
        title: "星期三",
        dataIndex: "Wednesday",
        render: (text, record) => this.renderColumns(text, record, 'Wednesday'),
      }, {
        title: "星期四",
        dataIndex: "Thursday",
        render: (text, record) => this.renderColumns(text, record, 'Thursday'),
      }, {
        title: "星期五",
        dataIndex: "Friday",
        render: (text, record) => this.renderColumns(text, record, 'Friday'),
      }, {
        title: "星期六",
        dataIndex: "Saturday",
        render: (text, record) => this.renderColumns(text, record, 'Saturday'),
      }, {
        title: "星期日",
        dataIndex: "Sunday",
        render: (text, record) => this.renderColumns(text, record, 'Sunday'),
      }, {
        title: "活动类型合计",
        dataIndex: "typeTotal",
        width: '11%',
      }
    ];
    //表头END

    //主责列合计表头
    this.columnsFooter = [
      {
        title: "合计",
        dataIndex: "value",
        key: "value",
        width: '11%',
      }, {
        title: "星期一合计",
        dataIndex: "Monday",
        width: '11%',
      }, {
        title: "星期二合计",
        dataIndex: "Tuesday",
        width: '11%',
      }, {
        title: "星期三合计",
        dataIndex: "Wednesday",
        width: '11%',
      }, {
        title: "星期四合计",
        dataIndex: "Thursday",
        width: '11%',
      }, {
        title: "星期五合计",
        dataIndex: "Friday",
        width: '11%',
      }, {
        title: "星期六合计",
        dataIndex: "Saturday",
        width: '11%',
      }, {
        title: "星期日合计",
        dataIndex: "Sunday",
        width: '11%',
      }, {
        title: "活动类型总计",
        dataIndex: "typeTotal",
        width: '11%',
      }
    ];
    //主责列合计表头END

    //配责列合计表头
    this.columnsFooterOther = [
      {
        title: "合计",
        dataIndex: "value",
        key: "value",
        width: '11%',
      }, {
        title: "星期一合计",
        dataIndex: "Monday",
        width: '11%',
      }, {
        title: "星期二合计",
        dataIndex: "Tuesday",
        width: '11%',
      }, {
        title: "星期三合计",
        dataIndex: "Wednesday",
        width: '11%',
      }, {
        title: "星期四合计",
        dataIndex: "Thursday",
        width: '11%',
      }, {
        title: "星期五合计",
        dataIndex: "Friday",
        width: '11%',
      }, {
        title: "星期六合计",
        dataIndex: "Saturday",
        width: '11%',
      }, {
        title: "星期日合计",
        dataIndex: "Sunday",
        width: '11%',
      }, {
        title: "活动类型总计",
        dataIndex: "typeTotal",
        width: '11%',
      }
    ];
    //配责列合计表头END

    this.state = {
      formLayout: 'inline', //声明表单为行内布局样式
      checked: [], //活动类型初始数据
      data, //主责表格数据
      dataFooter: [{
        key: 'dataFooter',
        value: '合计',
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
        typeTotal: 0,
      }], //主责列合计数据
      dataOther, //配责表格数据
      dataFooterOther: [{
        key: 'dataFooterOther',
        value: '合计',
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
        typeTotal: 0,
      }], //配责列合计数据
      defaultOptions: [], //已有主责项目活动类型
      defaultOptionsOther: [], //已有配责项目活动类型
      saveButtonState: false, //保存按钮可点状态
      commitButtonState: false, //提交按钮可点状态
      showState: {display: 'block'},
      newStates: '-', //主责项目用户操作状态
      newStatesOther: '-', //配责项目用户操作状态
      limit24: 0, //判断一天内工时是否超过24小时，0为没超过，1为超过
      limit24Other: 0, //判断一天内工时是否超过24小时，0为没超过，1为超过
    };

  }

  //渲染表格中填报处为input
  renderColumns(text, record, column) {
    let editableState;
    if (this.state.saveButtonState === true) {
      editableState = false
    } else {
      editableState = true
    }
    return (
      <EditableCell
        editable={editableState}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)} //内容改变时调用handleChange方法
      />
    );
  }

  //改变input内容时执行函数
  handleChange(value, key, column) {
    //主责项目工时填报及合计
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      if (value == '' || value % 0.5 != 0) {
        value = 0.0
      }
      target[column] = value; //让文本框输入即现时内容
    }

    //主责表格行求和
    let options = newData.map(v =>
      ({
        ...v,
        typeTotal: parseFloat(v.Monday) + parseFloat(v.Tuesday) + parseFloat(v.Wednesday) + parseFloat(v.Thursday) + parseFloat(v.Friday) + parseFloat(v.Saturday) + parseFloat(v.Sunday)
      })
    );
    this.setState({data: options});

    //主责表格列求和
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekData = week.map((day, idx) => newData.reduce((item, v) => item + parseFloat(v[day]), 0));

    //一天内有工时超过24小时则将判断值传入状态机
    if (weekData[0] > 24 || weekData[1] > 24 || weekData[2] > 24 || weekData[3] > 24 || weekData[4] > 24 || weekData[5] > 24 || weekData[6] > 24) {
      this.setState({limit24: 1})
    } else {
      this.setState({limit24: 0})
    }

    let allTime = weekData[0] + weekData[1] + weekData[2] + weekData[3] + weekData[4] + weekData[5] + weekData[6];
    let totalData = [{
      key: 'dataFooter',
      value: '合计',
      Monday: weekData[0],
      Tuesday: weekData[1],
      Wednesday: weekData[2],
      Thursday: weekData[3],
      Friday: weekData[4],
      Saturday: weekData[5],
      Sunday: weekData[6],
      typeTotal: allTime,
    }];

    this.setState({
      dataFooter: totalData
    });

//配责项目工时填报及合计
    const newDataOther = [...this.state.dataOther];
    const targetOther = newDataOther.filter(item => key === item.key)[0];
    if (targetOther) {
      if (value == '' || value % 0.5 != 0) {
        value = 0.0
      }
      targetOther[column] = value; //让文本框输入即现时内容
    }

    //配责表格行求和
    let optionsOther = newDataOther.map(v =>
      ({
        ...v,
        typeTotal: parseFloat(v.Monday) + parseFloat(v.Tuesday) + parseFloat(v.Wednesday) + parseFloat(v.Thursday) + parseFloat(v.Friday) + parseFloat(v.Saturday) + parseFloat(v.Sunday)
      })
    );
    this.setState({dataOther: optionsOther});

    //配责表格列求和
    const weekOther = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekDataOther = weekOther.map((day, idx) => newDataOther.reduce((item, v) => item + parseFloat(v[day]), 0));

    //一天内有工时超过24小时则将判断值传入状态机
    if (weekDataOther[0] > 24 || weekDataOther[1] > 24 || weekDataOther[2] > 24 || weekDataOther[3] > 24 || weekDataOther[4] > 24 || weekDataOther[5] > 24 || weekDataOther[6] > 24) {
      this.setState({limit24Other: 1})
    } else {
      this.setState({limit24Other: 0})
    }

    let totalDataOther = [{
      key: 'dataFooter',
      value: '合计',
      Monday: weekDataOther[0],
      Tuesday: weekDataOther[1],
      Wednesday: weekDataOther[2],
      Thursday: weekDataOther[3],
      Friday: weekDataOther[4],
      Saturday: weekDataOther[5],
      Sunday: weekDataOther[6],
      typeTotal: weekDataOther[0] + weekDataOther[1] + weekDataOther[2] + weekDataOther[3] + weekDataOther[4] + weekDataOther[5] + weekDataOther[6],
    }];
    this.setState({
      dataFooterOther: totalDataOther
    });
  }

  //主责项目——获取勾选的活动类型，增加tr行
  onChange(checkedValues) {
    this.setState({defaultOptions: checkedValues});
    const oldData = [...this.state.data];
    let arrayNew = checkedValues.map(item1 => {
      return oldData.find(item2 => item2.key === item1) || {
        key: item1,
        value: item1.split('++')[2],
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
        typeTotal: 0,
      }
    });
    this.setState({data: arrayNew});

    //主责表格列求和
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekData = week.map((day, idx) => arrayNew.reduce((item, v) => item + parseFloat(v[day]), 0));
    //一天内有工时超过24小时则将判断值传入状态机
    if (weekData[0] > 24 || weekData[1] > 24 || weekData[2] > 24 || weekData[3] > 24 || weekData[4] > 24 || weekData[5] > 24 || weekData[6] > 24) {
      this.setState({limit24: 1})
    } else {
      this.setState({limit24: 0})
    }

    let totalData = [{
      key: 'dataFooter',
      value: '合计',
      Monday: weekData[0],
      Tuesday: weekData[1],
      Wednesday: weekData[2],
      Thursday: weekData[3],
      Friday: weekData[4],
      Saturday: weekData[5],
      Sunday: weekData[6],
      typeTotal: weekData[0] + weekData[1] + weekData[2] + weekData[3] + weekData[4] + weekData[5] + weekData[6],
    }];
    this.setState({dataFooter: totalData});
  }

  //配责项目——获取勾选的活动类型，增加tr行
  onChangeOther(checkedValues) {
    this.setState({defaultOptionsOther: checkedValues});
    const oldData = [...this.state.dataOther];
    let arrayNew = checkedValues.map(item1 => {
      return oldData.find(item2 => item2.key === item1) || {
        key: item1,
        value: item1.split('++')[2],
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
        typeTotal: 0,
      }
    });
    this.setState({dataOther: arrayNew});

    //配责表格列求和
    const weekOther = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekDataOther = weekOther.map((day, idx) => arrayNew.reduce((item, v) => item + parseFloat(v[day]), 0));

    //一天内有工时超过24小时则将判断值传入状态机
    if (weekDataOther[0] > 24 || weekDataOther[1] > 24 || weekDataOther[2] > 24 || weekDataOther[3] > 24 || weekDataOther[4] > 24 || weekDataOther[5] > 24 || weekDataOther[6] > 24) {
      this.setState({limit24Other: 1})
    } else {
      this.setState({limit24Other: 0})
    }

    let totalDataOther = [{
      key: 'dataFooterOther',
      value: '合计',
      Monday: weekDataOther[0],
      Tuesday: weekDataOther[1],
      Wednesday: weekDataOther[2],
      Thursday: weekDataOther[3],
      Friday: weekDataOther[4],
      Saturday: weekDataOther[5],
      Sunday: weekDataOther[6],
      typeTotal: weekDataOther[0] + weekDataOther[1] + weekDataOther[2] + weekDataOther[3] + weekDataOther[4] + weekDataOther[5] + weekDataOther[6],
    }];
    this.setState({dataFooterOther: totalDataOther});
  }

  //保存功能
  overSubmit() {
    const {limit24, limit24Other} = this.state; //获取24小时限制判断值
    if (limit24 == 1 || limit24Other == 1) {
      message.info('抱歉，每天工时不能超过24小时！')
    } else if (limit24 == 0 && limit24Other == 0) {
      const newData = [...this.state.data]; //获取主责项目
      const newDataOther = [...this.state.dataOther]; //获取配责项目
      let endData = newData.concat(newDataOther); //合并为新数组
      //将填报后的最新数据传给models层
      const {dispatch} = this.props;
      dispatch({
        type: 'timeManagement/fillSaveTime',
        endData
      });
    }
  }

  //提交功能
  overCommit() {
    const {limit24, limit24Other} = this.state; //获取24小时限制判断值
    const dataFooter = [...this.state.dataFooter]; //主责项目工时列合计
    const dataFooterOther = [...this.state.dataFooterOther]; //配责项目工时列合计

    if (dataFooter[0].typeTotal + dataFooterOther[0].typeTotal <= 0) {
      message.info('请填报后再提交！');
    } else if(limit24 == 1 || limit24Other == 1){
      message.info('抱歉，每天工时不能超过24小时！')
    }else if (limit24 == 0 && limit24Other == 0) {
      const newData = [...this.state.data]; //获取主责项目
      const newDataOther = [...this.state.dataOther]; //获取配责项目
      let endData = newData.concat(newDataOther); //合并为新数组
      //将填报后的最新数据传给models层
      const {dispatch} = this.props;
      confirm({
        title: '确认提交？',
        onOk() {
          console.log('OK');

          dispatch({
            type: 'timeManagement/fillCommitTime',
            endData
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }

  }


  /* ==== 将本周工时填报情况插入表格 START==== */
  componentWillReceiveProps() {
    const {currentWeek} = this.props; //本周工时填报情况返回数据
    const {projectList} = this.props; //参与的项目

    //判断是否已经提交过
    if (currentWeek.IsCommit == 1) {
      this.setState({saveButtonState: true}); //保存按钮不可点
      this.setState({commitButtonState: true}); //提交按钮不可点
      this.setState({showState: {display: 'none'}})
    }

    //判断是否已经提交过,若未提交,并且在提交时间内
    if (currentWeek.IsCommit == 0 && currentWeek.isOutDate == 0) {
      this.setState({saveButtonState: false}); //保存按钮可点
      this.setState({commitButtonState: false}); //提交按钮可点
      this.setState({showState: {display: 'block'}})
    }

    //判断是否在提交时间范围内
    if (currentWeek.isOutDate == 1) {
      this.setState({commitButtonState: true}); //若已超时则提交按钮不可点
    }

    //判断本周工时填报内容返回数据是否为空
    if (currentWeek.DataRows !== [] && currentWeek.DataRows !== undefined && projectList !== undefined && projectList !== []) {
      let currentData = [];
      let currentDataOther = [];
      let defaultOptionsData = [];
      let defaultOptionsDataOther = [];

      if (currentWeek.DataRows.length > 0 && projectList.length > 0) {

        //遍历本周工时返回数据
        currentWeek.DataRows.map(item => {

          //判断项目是否为主责项目
          if (item.proj_code === projectList[0].proj_code && item.staff_id === localStorage.staffid) {

            this.setState({newStates: item.new_status}); //设置主责项目用户操作状态

            //重构数据为表格格式
            currentData.push(
              {
                key: item.proj_code + '++' + item.activity_id + '++' + item.activity_name + '++' + item.proj_name, //项目编号 ++ 活动类型编号 ++ 活动类型名称 ++ 项目名称
                value: item.activity_name,
                Monday: parseFloat(item.mon),
                Tuesday: parseFloat(item.tues),
                Wednesday: parseFloat(item.wed),
                Thursday: parseFloat(item.thur),
                Friday: parseFloat(item.fri),
                Saturday: parseFloat(item.sat),
                Sunday: parseFloat(item.sun),
                typeTotal: parseFloat(item.mon) + parseFloat(item.tues) + parseFloat(item.wed) + parseFloat(item.thur) + parseFloat(item.fri) + parseFloat(item.sat) + parseFloat(item.sun),
              }
            );

            //将重构后的本周工时数据保存到主责项目表格状态机
            this.setState({data: currentData});

            //拼接主责项目本周已有的活动类型，默认勾选
            defaultOptionsData.push(item.proj_code + '++' + item.activity_id + '++' + item.activity_name + '++' + item.proj_name); //项目编号 ++ 活动类型编号 ++ 活动类型名称 ++ 项目名称

            //主责表格列求和
            const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const weekData = week.map((day, idx) => currentData.reduce((item, v) => item + parseFloat(v[day]), 0));
            let totalData = [{
              key: 'dataFooter',
              value: '合计',
              Monday: weekData[0],
              Tuesday: weekData[1],
              Wednesday: weekData[2],
              Thursday: weekData[3],
              Friday: weekData[4],
              Saturday: weekData[5],
              Sunday: weekData[6],
              typeTotal: weekData[0] + weekData[1] + weekData[2] + weekData[3] + weekData[4] + weekData[5] + weekData[6],
            }];
            this.setState({dataFooter: totalData});

            //判断项目是否为配责项目
          } else if (item.proj_code === projectList[1].proj_code && item.staff_id === localStorage.staffid) {

            this.setState({newStatesOther: item.new_status}); //设置配责项目用户操作状态

            //重构数据为表格格式
            currentDataOther.push(
              {
                key: item.proj_code + '++' + item.activity_id + '++' + item.activity_name + '++' + item.proj_name, //项目编号 ++ 活动类型编号 ++ 活动类型名称 ++ 项目名称
                value: item.activity_name,
                Monday: parseFloat(item.mon),
                Tuesday: parseFloat(item.tues),
                Wednesday: parseFloat(item.wed),
                Thursday: parseFloat(item.thur),
                Friday: parseFloat(item.fri),
                Saturday: parseFloat(item.sat),
                Sunday: parseFloat(item.sun),
                typeTotal: parseFloat(item.mon) + parseFloat(item.tues) + parseFloat(item.wed) + parseFloat(item.thur) + parseFloat(item.fri) + parseFloat(item.sat) + parseFloat(item.sun),
              }
            );
            //将重构后的本周工时数据保存到配责项目表格状态机
            this.setState({dataOther: currentDataOther});

            //拼接配责项目本周已有的活动类型，默认勾选
            defaultOptionsDataOther.push(item.proj_code + '++' + item.activity_id + '++' + item.activity_name + '++' + item.proj_name); //项目编号 ++ 活动类型编号 ++ 活动类型名称 ++ 项目名称
            //配责表格列求和
            const weekOther = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const weekDataOther = weekOther.map((day, idx) => currentDataOther.reduce((item, v) => item + parseFloat(v[day]), 0));
            let totalDataOther = [{
              key: 'dataFooterOther',
              value: '合计',
              Monday: weekDataOther[0],
              Tuesday: weekDataOther[1],
              Wednesday: weekDataOther[2],
              Thursday: weekDataOther[3],
              Friday: weekDataOther[4],
              Saturday: weekDataOther[5],
              Sunday: weekDataOther[6],
              typeTotal: weekDataOther[0] + weekDataOther[1] + weekDataOther[2] + weekDataOther[3] + weekDataOther[4] + weekDataOther[5] + weekDataOther[6],
            }];
            this.setState({dataFooterOther: totalDataOther});
          }
        });

        //如果拼接主责项目本周已有的活动类型不为空，传入活动类型默认勾选状态机
        if (defaultOptionsData !== []) {
          this.setState({defaultOptions: defaultOptionsData});
        }

        //如果拼接配责项目本周已有的活动类型不为空，传入活动类型默认勾选状态机
        if (defaultOptionsDataOther !== []) {
          this.setState({defaultOptionsOther: defaultOptionsDataOther});
        }
      }
    }
  }

  /* ==== 将本周工时填报情况插入表格 END==== */


  render() {

    /* ==== 获取初始化时定义的表单布局样式，设定表达inline标题内容占比 START==== */
    const {formLayout} = this.state;
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
    } : null;
    const buttonItemLayout = formLayout === 'horizontal' ? {
      wrapperCol: {span: 14, offset: 4},
    } : null;
    /* ==== 获取初始化时定义的表单布局样式，设定表达inline标题内容占比 END==== */


    /* ==== 在render层获取models返回的数据 START==== */
    const {currentWeek} = this.props; //本周工时填报情况返回数据
    const {projectList} = this.props; //参与的项目
    const {activityType} = this.props; //主责项目活动类型类型
    const {activityType2} = this.props; //配责项目活动类型类型
    /* ==== 在render层获取models返回的数据 END==== */

    /* ==== 在render层获取state START==== */
    const dataFooter = [...this.state.dataFooter]; //主责项目工时列合计
    const dataFooterOther = [...this.state.dataFooterOther]; //配责项目工时列合计
    /* ==== 在render层获取state END==== */


    /* ==== 遍历所参与的项目 START==== */
    let pane = []; //定义标签页
    for (let i = 0; i < projectList.length; i++) {
      pane.push(
        projectList[i].proj_name
      )
    }
    /* ==== 遍历所参与的项目 END==== */


    /* ==== 遍历活动类型，并将其写成checBkox选择项 START==== */
    //主责项目
    let options = activityType.map(item => ({
      key: item.activity_code,
      label: item.activity_name,
      value: projectList[0].proj_code + '++' + item.activity_code + '++' + item.activity_name + '++' + projectList[0].proj_name, //项目编号 ++ 活动类型编号 ++ 活动类型名称 ++ 项目名称
      name: projectList[0].proj_code
    }));

    //配责项目
    let optionsOther;
    if (projectList.length > 1) {
      optionsOther = activityType2.map(item => ({
        key: item.activity_code,
        label: item.activity_name,
        value: projectList[1].proj_code + '++' + item.activity_code + '++' + item.activity_name + '++' + projectList[1].proj_name, // 项目编号 ++ 活动类型编号 ++ 活动类型名称 ++ 项目名称
        name: projectList[1].proj_code
      }));
    }
    /* ==== 遍历活动类型，并将其写成checBkox选择项 END==== */


    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div className='fillContainer'>
          <Form layout={formLayout}>
            <FormItem
              label="本周工时"
              {...formItemLayout}
            >
              <span>{currentWeek.FillDateBegin + ' 至 ' + currentWeek.FillDateEnd}</span>
            </FormItem>
            <FormItem
              label="工作总时"
              {...formItemLayout}
            >
              <span style={{fontWeight: 'bold'}}>{dataFooter[0].typeTotal + dataFooterOther[0].typeTotal}</span>
            </FormItem>

            <Tabs defaultActiveKey="1" className={style.fillTabs}>
              <TabPane tab={pane[0]} key="1">
                <FormItem
                  label="当前状态"
                  {...formItemLayout}
                >
                  <span style={{color: '#FA7252'}}>{this.state.newStates}</span>
                </FormItem>
                <FormItem
                  label="活动类型"
                  {...formItemLayout}
                  style={this.state.showState}
                >
                  <CheckboxGroup
                    options={options}
                    value={this.state.defaultOptions}
                    onChange={value => this.onChange(value)}
                    disabled={this.state.saveButtonState}
                  />
                </FormItem>
                <Table dataSource={this.state.data} columns={this.columns} pagination={false}
                       style={{marginTop: '16px'}}/>
                <Table dataSource={this.state.dataFooter} columns={this.columnsFooter} showHeader={false}
                       pagination={false}/>
              </TabPane>
              <TabPane tab={pane[1]} key="2">
                <FormItem
                  label="当前状态"
                  {...formItemLayout}
                >
                  <span style={{color: '#FA7252'}}>{this.state.newStatesOther}</span>
                </FormItem>
                <FormItem
                  label="活动类型"
                  {...formItemLayout}
                  style={this.state.showState}
                >
                  <CheckboxGroup
                    options={optionsOther}
                    value={this.state.defaultOptionsOther}
                    onChange={value => this.onChangeOther(value)}
                    disabled={this.state.saveButtonState}
                  />
                </FormItem>
                <Table dataSource={this.state.dataOther} columns={this.columns} pagination={false}
                       style={{marginTop: '16px'}}/>
                <Table dataSource={this.state.dataFooterOther} columns={this.columnsFooterOther} showHeader={false}
                       pagination={false}/>
              </TabPane>
            </Tabs>
            <FormItem {...buttonItemLayout} style={this.state.showState}>
              <Button type="default" onClick={() => this.overSubmit()} disabled={this.state.saveButtonState}
                      style={{marginRight: '16px'}}>保存</Button>
              <Button type="primary" onClick={() => this.overCommit()}
                      disabled={this.state.commitButtonState}>提交</Button>
            </FormItem>


            <div style={{color: '#FA7252', fontStyle: 'italic', marginTop: 32}}>
              <p>提示：</p>
              <p>1、若参与多个项目，请全部填报后一起保存/提交</p>
              <p>2、填报的工时只能在 {currentWeek.begintime + ' 至 ' + currentWeek.endtime} 期间提交，且所有项目只能提交一次</p>
              <p>3、填报的工时以0.5小时为一个单位</p>
            </div>

          </Form>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  const {projectList, activityType, activityType2, currentWeek} = state.timeManagement;
  return {projectList, activityType, activityType2, currentWeek, loading: state.loading.models.timeManagement};
}

export default connect(mapStateToProps)(Fill);
