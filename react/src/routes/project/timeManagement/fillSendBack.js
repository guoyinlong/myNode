/*
 * 作者：刘东旭
 * 日期：2017-12-06
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：工时管理-退回处理
 */

import React from 'react'; //引入react
import {connect} from 'dva'; //从dva引入connect
import style from './fill.less' //引入样式文件
import {Form, Button, Tabs, Checkbox, Table, InputNumber, message, Modal} from 'antd';
const FormItem = Form.Item; //表单组
const TabPane = Tabs.TabPane; //标签组
const CheckboxGroup = Checkbox.Group; //多选组
const confirm = Modal.confirm; //确认对话框


/* 组件EditableCell START*/
//点击编辑调用此方法，显示input或value
const EditableCell = ({editable, value, onChange}) => (
  <div>
    {editable
      ? <InputNumber min={0} max={24} step={0.5} defaultValue={0}
                     style={{margin: '-5px 0', width: 70, textAlign: 'center',}} value={value}
                     onChange={value => onChange(value)}/>
      : value
    }
  </div>
);
/* 组件EditableCell END*/

//模拟表格数据
const data = []; //主责项目

//表格组件
class FillSendBack extends React.Component {
  constructor(props) {
    super(props);

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
      defaultOptions: [], //已有主责项目活动类型
      saveButtonState: false, //保存按钮可点状态
      commitButtonState: false, //提交按钮可点状态
      showState: {display: 'block'},
      makeUpTrue: [], //是否可以补录状态
      limit24: 0, //判断一天内工时是否超过24小时，0为没超过，1为超过
    };
  }

  //渲染表格中填报处为input
  renderColumns(text, record, column) {
    let editableState;
    if (this.state.commitButtonState === true) {
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
    if(weekData[0] > 24 || weekData[1] > 24 || weekData[2] > 24 || weekData[3] > 24 || weekData[4] > 24 || weekData[5] > 24 || weekData[6] > 24){
      this.setState({limit24: 1})
    }else {
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

  //提交功能
  overCommit() {
    const {limit24} = this.state; //获取24小时限制判断值
    const dataFooter = [...this.state.dataFooter]; //主责项目工时列合计
    if (dataFooter[0].typeTotal <= 0) {
      message.info('请填报后再提交！');
    } else if(limit24 == 1){
      message.info('抱歉，每天工时不能超过24小时！')
    }else {
      let endData = [...this.state.data];  //获取主责项目
      const urlParam = this.props.location.query; //获取地址传来的参数
      const beginTime = urlParam.begin_time; //获取开始时间
      const endTime = urlParam.end_time; //获取结束时间
      const approvedStatus = urlParam.approved_status; //获取状态

      //将填报后的最新数据传给models层
      const {dispatch} = this.props;
      confirm({
        title: '确认提交？',
        onOk() {
          console.log('确定提交');
          dispatch({
            type: 'fillSendBack/fillCommitTime',
            endData, beginTime, endTime, approvedStatus
          });
        },
        onCancel() {
          console.log('取消提交');
        },
      });
    }
  }



  //删除功能
  overDelete() {
      //将填报后的最新数据传给models层
      const {dispatch} = this.props;
      confirm({
        title: '确认删除？',
        onOk() {
          console.log('删除');
          dispatch({
            type: 'fillSendBack/deleteTime'
          });
        },
        onCancel() {
          console.log('取消');
        },
      });

  }




  /* ==== 将本周工时填报情况插入表格 START==== */
  componentWillReceiveProps() {
    const {currentWeek} = this.props; //本周工时填报情况返回数据
    const urlParam = this.props.location.query; //参与的项目
    const projectCode = urlParam.proj_code; //参与的项目编码

    //判断本周工时填报内容返回数据是否为空
    if (currentWeek.DataRows !== [] && currentWeek.DataRows !== undefined) {
      let currentData = [];
      let defaultOptionsData = [];
      if (currentWeek.DataRows.length > 0) {

        //遍历本周工时返回数据
        currentWeek.DataRows.map(item => {

          //判断项目是否为主责项目
          if (item.proj_code === projectCode && item.staff_id === localStorage.staffid) {

            //判断是否已经提交过
            if (currentWeek.IsCommit == 1 || currentWeek.isOutDate == 1) {
              this.setState({saveButtonState: true}); //若已经提交过，则保存按钮不可点
              this.setState({commitButtonState: true}); //若已经提交过，则提交按钮不可点
              this.setState({showState: {display: 'none'}})
            }

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

          }
        });

        //如果拼接主责项目本周已有的活动类型不为空，传入活动类型默认勾选状态机
        if (defaultOptionsData !== []) {
          this.setState({defaultOptions: defaultOptionsData});
        }

      }
    }
  }

  /* ==== 将本周工时填报情况插入表格 END==== */


  componentWillMount() {
    const urlParam = this.props.location.query; //获取地址传来的参数
    const beginTime = urlParam.begin_time; //获取开始时间
    const endTime = urlParam.end_time; //获取结束时间
    const approvedStatus = urlParam.approved_status; //获取状态
    const projectCode = urlParam.proj_code; //获取项目编号
    const projectName = urlParam.proj_name; //获取项目名称
    const taskType = urlParam.task_type; //获取本周还是补录，week_timesheet_back：本周，makeup_timesheet_back：补录

    // 判断获取的起止时间是否为空
    if (beginTime && endTime) {
      const {dispatch} = this.props;
      dispatch({
        type: 'fillSendBack/fillCheckProject',
        beginTime, endTime, approvedStatus, projectCode, projectName
      });

      //定义format
      Date.prototype.format = function () {
        let s = '';
        s += this.getFullYear() + '-';          // 获取年份。
        s += (this.getMonth() + 1) + "-";         // 获取月份。
        s += this.getDate();                 // 获取日。
        return (s);                          // 返回日期。
      };

      //得到每天日期
      function getDayAll(begin, end) {
        let dateAllArr = new Array();
        let ab = begin.split("-");
        let ae = end.split("-");
        let db = new Date();
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
        let de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        let unixDb = db.getTime();
        let unixDe = de.getTime();
        for (let k = unixDb; k <= unixDe;) {
          dateAllArr.push((new Date(parseInt(k))).format().toString());
          k = k + 24 * 60 * 60 * 1000;
        }
        return dateAllArr;
      }
      let result = getDayAll(beginTime, endTime); //将结果传进result里

      //判断每天工时是否可补录状态
      let makeUpDay = [];
      result.map(item => {
        let judge = 0;
        let currentMonth = (new Date().getMonth() + 1).toString();
        let activeDate = item.split("-");
        if (currentMonth === activeDate[1] || taskType === 'week_timesheet_back') {
          judge = 1
        }else {
          judge = 0
        }
        makeUpDay.push(judge)
      });

      this.setState({
        makeUpTrue: makeUpDay,
      })
    } // 判断获取的起止时间是否为空 END

  }

  render() {
    const urlParam = this.props.location.query;
    const projectCode = urlParam.proj_code;
    const projectName = urlParam.proj_name;


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
    const {currentWeek} = this.props; //本周工时退回情况返回数据
    const {activityType} = this.props; //主责项目活动类型类型
    /* ==== 在render层获取models返回的数据 END==== */


    let returnReasons = '';
    if (currentWeek.DataRows) {
      returnReasons = currentWeek.DataRows[0].approvedby;
    }


    /* ==== 在render层获取state START==== */
    const dataFooter = [...this.state.dataFooter]; //主责项目工时列合计
    /* ==== 在render层获取state END==== */


    /* ==== 遍历活动类型，并将其写成checBkox选择项 START==== */
    //主责项目
    let options = activityType.map(item => ({
      key: item.activity_code,
      label: item.activity_name,
      value: projectCode + '++' + item.activity_code + '++' + item.activity_name + '++' + projectName, //项目编号 ++ 活动类型编号 ++ 活动类型名称 ++ 项目名称
      name: projectCode
    }));

    /* ==== 遍历活动类型，并将其写成checBkox选择项 END==== */


    //表头
    const {makeUpTrue} = this.state;
    let columns = [
      {
        title: "",
        dataIndex: "value",
        key: "value",
        width: '11%',
      }, {
        title: "星期一",
        dataIndex: "Monday",
        width: '11%',
        render: (text, record) => {
          if (makeUpTrue[0] === 1) {
            return this.renderColumns(text, record, 'Monday')
          } else {
            return text
          }
        }
      }, {
        title: "星期二",
        dataIndex: "Tuesday",
        width: '11%',
        render: (text, record) => {
          if (makeUpTrue[1] === 1) {
            return this.renderColumns(text, record, 'Tuesday')
          } else {
            return text
          }
        }

      }, {
        title: "星期三",
        dataIndex: "Wednesday",
        width: '11%',
        render: (text, record) => {
          if (makeUpTrue[2] === 1) {
            return this.renderColumns(text, record, 'Wednesday')
          } else {
            return text
          }
        }
      }, {
        title: "星期四",
        dataIndex: "Thursday",
        width: '11%',
        render: (text, record) => {
          if (makeUpTrue[3] === 1) {
            return this.renderColumns(text, record, 'Thursday')
          } else {
            return text
          }
        }
      }, {
        title: "星期五",
        dataIndex: "Friday",
        width: '11%',
        render: (text, record) => {
          if (makeUpTrue[4] === 1) {
            return this.renderColumns(text, record, 'Friday')
          } else {
            return text
          }
        }
      }, {
        title: "星期六",
        dataIndex: "Saturday",
        width: '11%',
        render: (text, record) => {
          if (makeUpTrue[5] === 1) {
            return this.renderColumns(text, record, 'Saturday')
          } else {
            return text
          }
        }
      }, {
        title: "星期日",
        width: '11%',
        dataIndex: "Sunday",
        render: (text, record) => {
          if (makeUpTrue[6] === 1) {
            return this.renderColumns(text, record, 'Sunday')
          } else {
            return text
          }
        }
      }, {
        title: "活动类型合计",
        dataIndex: "typeTotal",
        width: '11%',
      }
    ];
    //表头END

    return (
      <div className='fillContainer'>
        <Form layout={formLayout}>
          <div>
            <FormItem
              label="退回原因"
              {...formItemLayout}
            >
              <span>{returnReasons}</span>
            </FormItem>
          </div>
          <FormItem
            label="本周工时"
            {...formItemLayout}
          >
            <span>{urlParam.begin_time + ' 至 ' + urlParam.end_time}</span>
          </FormItem>
          <FormItem
            label="工作总时"
            {...formItemLayout}
          >
            <span style={{fontWeight: 'bold'}}>{dataFooter[0].typeTotal}</span>
          </FormItem>
          <Tabs defaultActiveKey="1" className={style.fillTabs} style={{marginTop: '32px', marginBottom: '32px'}}>
            <TabPane tab={urlParam.proj_name} key="1">
              <FormItem
                label="活动类型"
                {...formItemLayout}
                style={this.state.showState}
              >
                <CheckboxGroup
                  options={options}
                  value={this.state.defaultOptions}
                  onChange={value => this.onChange(value)}
                  disabled={this.state.commitButtonState}
                />
              </FormItem>
              <Table dataSource={this.state.data} columns={columns} pagination={false} className='mainTable'
                     style={{marginTop: '16px'}}/>
              <Table dataSource={this.state.dataFooter} columns={this.columnsFooter} showHeader={false}
                     pagination={false} className={style.mainTable}/>
            </TabPane>
          </Tabs>
          <FormItem {...buttonItemLayout} style={this.state.showState}>
            <Button type="primary" onClick={() => this.overCommit()} disabled={this.state.commitButtonState}>提交</Button>
            <Button type="danger" onClick={() => this.overDelete()} style={{marginLeft:16}}>删除</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {activityType, currentWeek} = state.fillSendBack;
  return {activityType, currentWeek};
}

export default connect(mapStateToProps)(FillSendBack);
