/*
 * 作者：刘东旭
 * 日期：2017-10-11
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：加计扣除-首页列表(v1.0)
 * 修改：2017-11-13
 */
import React from 'react'; //引入react
import {connect} from 'dva'; //从dva中引入connect
import {Form, Button, Input, Select, DatePicker, Row, Col, message} from 'antd'; //从antd中引入所有需要的组件
import style from './subsidiaryList.css'; //引入本页样式文件
import ListContent from '../../../../components/finance/KakeDeducting/subsidiaryList/ListContent'; //引入列表内容组件
import {routerRedux} from 'dva/router';
import Cookie from 'js-cookie';

//时间插件汉化
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const FormItem = Form.Item; //定义表单中item组件
const Option = Select.Option; //定义选择组件中的选项组件
const {MonthPicker} = DatePicker; //定义年月选择组件
const dateFormat = 'YYYY-M-D'; //定义日期获取格式
/*
 * 作者：刘东旭
 * 邮箱：liudx100@chinaunicom.cn
 * 日期：2017-10-24
 * 功能：页面主体结构，渲染搜索组件和列表内容组件
 */
class subsidiaryList extends React.Component {
  state = {
    expand: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      proName: '', //项目名称
      proCode: '',//项目编号
      comCode: '', //ou
      proType: '', //项目类型
      feeType: '', //费用类型
      stat: '', //年&月统计
      year: '', //年
      month: '', //月

      searchProType: '', //查询的项目类型
      searchFeeType: '', //查询的费用类型
      searchYear: '', //查询的年
      searchMonth: '', //查询的月

      derivedProjectCode: '', //导出的项目编号
      derivedProjectOu: '', //导出的项目ou
      derivedProType: '', //导出的项目类型
      derivedFeeType: '', //导出的费用类型
      derivedYear: '', //导出的年
      derivedMonth: '', //导出的月
      derivedStatus: '', //导出的状态

      createAllYear: '', //全部生成的年
      createAllMonth: '', //全部生成的月
    };
  };


  /* == 查询部分 START== */

//查询时获取项目类型和费用类型
  searchProType = (value) => {
    this.setState({
      searchProType: value.split('++')[0], //取得项目类型
      searchFeeType: value.split('++')[1]  //取得费用类型
    })
  };

  //获取查询日期
  searchSetYear = (value) => {
    this.setState({
      searchYear: value.format(dateFormat).split('-')[0], //日期格式化只取年
      searchMonth: value.format(dateFormat).split('-')[1] //日期格式化只取月
    });
  };


//点击查询触发此函数,按类别查询
  handleSearch = () => {
    const {dispatch} = this.props;
    const {searchProType, searchFeeType, searchYear, searchMonth} = this.state;
    if (searchProType === '') {
      message.info('请选择要查询的项目类型');
      return null;
    }
    if (searchFeeType === '') {
      message.info('请选择要查询的费用类型');
      return null;
    }
    if (searchYear === '') {
      message.info('查询年份不能为空');
      return null;
    }
    if (searchMonth === '') {
      message.info('查询月份不能为空');
      return null;
    } else {
      dispatch({
        type: 'subsidiaryList/searchList',
        searchProType, searchFeeType, searchYear, searchMonth
      });
    }
  };

  /* == 查询部分 END== */


  /* == 导出部分 START== */

  //获取导出的项目编号和公司编号
  derivedSetProCode = (value) => {
    this.setState({
      derivedProjectCode: value.split('++')[0], //取得项目编号
      derivedProjectOu: value.split('++')[1], //取得项目ou
    })
  };

  //导出时获取项目类型和费用类型
  derivedProType = (value) => {
    this.setState({
      derivedProType: value.split('++')[0], //取得项目类型
      derivedFeeType: value.split('++')[1]  //取得费用类型
    })
  };

  //获取导出日期
  derivedSetYear = (value) => {
    this.setState({
      derivedYear: value.format(dateFormat).split('-')[0], //日期格式化只取年
      derivedMonth: value.format(dateFormat).split('-')[1] //日期格式化只取月
    });
  };

  //获取导出状态
  derivedSetStatus = (value) => {
    this.setState({
      derivedStatus: value
    })
  };

  //点击导出触发此函数,按月导出
  handleDerived = () => {
    const {dispatch} = this.props;
    const {derivedProjectCode, derivedProjectOu, derivedProType, derivedFeeType, derivedYear, derivedMonth, derivedStatus} = this.state;
    if (derivedProjectCode === '') {
      message.info('请选择要导出的项目');
      return null;
    }
    if (derivedProjectOu === '') {
      message.info('请选择要导出的项目');
      return null;
    }
    if (derivedProType === '') {
      message.info('请选择要导出的类型');
      return null;
    }
    if (derivedFeeType === '') {
      message.info('请选择要导出的类型');
      return null;
    }
    if (derivedStatus === '') {
      message.info('请选择导出的状态');
      return null;
    }
    if (derivedYear === '') {
      message.info('导出年份不能为空');
      return null;
    }
    if (derivedMonth === '') {
      message.info('导出月份不能为空');
      return null;
    } else {
      dispatch({
        type: 'subsidiaryList/derivedMonth',
        derivedProjectCode, derivedProjectOu, derivedProType, derivedFeeType, derivedYear, derivedMonth, derivedStatus
      });
    }
  };

  //点击导出触发此函数,按年导出
  handleDerivedYear = () => {
    const {dispatch} = this.props;
    const {derivedProjectCode, derivedProjectOu, derivedProType, derivedFeeType, derivedYear, derivedMonth} = this.state;
    if (derivedProjectCode === '') {
      message.info('请选择要导出的项目');
      return null;
    }
    if (derivedProjectOu === '') {
      message.info('请选择要导出的项目');
      return null;
    }
    if (derivedProType === '') {
      message.info('请选择要导出的类型');
      return null;
    }
    if (derivedFeeType === '') {
      message.info('请选择要导出的类型');
      return null;
    }
    if (derivedYear === '') {
      message.info('导出年份不能为空');
      return null;
    }
    if (derivedMonth === '') {
      message.info('导出月份不能为空');
      return null;
    } else {
      dispatch({
        type: 'subsidiaryList/derivedYear',
        derivedProjectCode, derivedProjectOu, derivedProType, derivedFeeType, derivedYear, derivedMonth
      });
    }
  };

  /* == 导出部分 END== */


  /* == 生成部分 START== */

  //获取全部生成日期
  createAllSetYear = (value) => {
    this.setState({
      createAllYear: value.format(dateFormat).split('-')[0], //日期格式化只取年
      createAllMonth: value.format(dateFormat).split('-')[1] //日期格式化只取月
    });
  };

  //点击全部生成触发此函数
  handleCreateAll = () => {
    const {dispatch} = this.props;
    const {createAllYear, createAllMonth} = this.state;
    if (createAllYear === '') {
      message.info('全部生成的年份不能为空');
      return null;
    }
    if (createAllMonth === '') {
      message.info('全部生成的月份不能为空');
      return null;
    } else {
      dispatch({
        type: 'subsidiaryList/createAll',
        createAllYear, createAllMonth
      });
    }
  };

  /* == 生成部分 END== */


  /*
   *修改人：陈红华
   *功能：点击查看按钮，页面跳转到数据详情页面，将费用类型，项目类型，年，月，项目编号，公司编码参数带到详情页面
   */

  /*
  key
:
0
projectBeginTime:"2017-08-01"
projectCode:"YZQ17BE0000002"
projectDate:"2017-12"
projectEndTime:"2018-02-28"
projectFlag:"1"
projectName:"2017年中国联通总部cBSS2.0号卡资源管理迭代研发项目"
projectOu:"联通软件研究院本部"
projectAllType:"自主研发资本化"
projectType: "自主研发" ,
feeType: "资本化",
  */
  lookDetail = (record) => {
    const {projectType, feeType, projectDate, projectCode, projectOu, projectFlag} = record;
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: '/financeApp/cost_proj_divided_mgt/divided_mainpage_mgt/divided_support_mgt',
      query: {
        formData: JSON.stringify(
          {
            arg_proj_type: projectType,
            arg_fee_type: feeType,
            arg_year: projectDate.split('-')[0],
            arg_month: projectDate.split('-')[1],
            arg_proj_code: projectCode,
            arg_ou: projectOu,
            arg_state_code: projectFlag,
          }
        )
      }
    }));
  };


  /*
   *修改人：陈红华
   *功能：点击生成按钮，进行数据的生成操作
   */
  createData = (record, index) => {
    const {dispatch} = this.props;
    const {feeType, projectType, projectCode, projectOu} = record;
    const {year, month} = this.props.data;
        dispatch({
          type: 'subsidiaryList/singleCreate',
          postData: {
            arg_proj_type: projectType,
            arg_fee_type: feeType,
            arg_year: year,
            arg_month: month,
            arg_staffid: Cookie.get('staff_id'),
            arg_proj_code: projectCode,
            arg_ou: projectOu,
          },
          index
        })
  };


  render() {
    const {data, projectOption} = this.props;
    let projName = [];
    if (projectOption) {
      for (let i = 0; i < projectOption.length; i++) {
        projName.push(
          <Option key={projectOption[i].pms_code}
                  value={
                    projectOption[i].pms_code + '++'
                    + projectOption[i].ou + '++'
                    + projectOption[i].proj_name
                  }>
            {projectOption[i].pms_code}
          </Option>
        )
      }
    }


//配置表单中标题和内容部分的宽度占比
    const formItemLayout = {
      colon: false,
      labelCol: {style: {width: 100, float: 'left'}},
      wrapperCol: {style: {float: 'left'}},
    };


    return (
      <div className={style.container}>
        <Form style={{marginBottom: 40}}>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="类型">
                <Select
                  placeholder="请选择"
                  style={{width: 150}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onSelect={this.searchProType}
                >
                  <Option value="自主研发++费用化">自主研发-费用化</Option>
                  <Option value="自主研发++资本化">自主研发-资本化</Option>
                  <Option value="委托研发++费用化">委托研发-费用化</Option>
                  <Option value="委托研发++资本化">委托研发-资本化</Option>
                </Select>
              </FormItem>
              <FormItem {...formItemLayout} label="年月">
                <MonthPicker
                  size="large"
                  placeholder="请选择"
                  style={{width: 150}}
                  onChange={(value) => this.searchSetYear(value)}
                />
              </FormItem>
              <Button type="primary" onClick={this.handleSearch} style={{marginLeft: 100}}>查询</Button>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="项目编号">
                <Select
                  showSearch
                  placeholder="编号"
                  style={{width: 150}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={(value) => this.derivedSetProCode(value)}
                >
                  {projName}
                </Select>
              </FormItem>
              <FormItem {...formItemLayout} label="类型">
                <Select
                  placeholder="请选择"
                  style={{width: 150}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onSelect={this.derivedProType}
                >
                  <Option value="自主研发++费用化">自主研发-费用化</Option>
                  <Option value="自主研发++资本化">自主研发-资本化</Option>
                  <Option value="委托研发++费用化">委托研发-费用化</Option>
                  <Option value="委托研发++资本化">委托研发-资本化</Option>
                </Select>
              </FormItem>
              <FormItem {...formItemLayout} label="年月">
                <MonthPicker
                  size="large"
                  placeholder="请选择"
                  style={{width: 150}}
                  onChange={(value) => this.derivedSetYear(value)}
                />
              </FormItem>
              <FormItem {...formItemLayout} label="状态">
                <Select
                  placeholder="请选择"
                  style={{width: 150}}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onSelect={this.derivedSetStatus}
                >
                  <Option value="2">未审核</Option>
                  <Option value="1">已审核</Option>
                </Select>
              </FormItem>
              <Button type="primary" style={{marginLeft: 100}} onClick={this.handleDerived}>按月导出</Button>
            {/*  <Button type="primary" style={{marginLeft: 8}} onClick={this.handleDerivedYear}>按年导出</Button>*/}
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="年月">
                <MonthPicker
                  size="large"
                  placeholder="请选择"
                  style={{width: 150}}
                  onChange={(value) => this.createAllSetYear(value)}
                />
              </FormItem>
              <Button type="primary" style={{marginLeft: 100}} onClick={this.handleCreateAll}>全部生成</Button>
            </Col>
          </Row>
        </Form>

        <h4>查询结果：</h4>
        <hr/>
        <ListContent data={data} lookDetail={this.lookDetail} createData={this.createData}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {data, projectName, allProject, projectOption} = state.subsidiaryList;
  return {
    data, projectName, allProject, projectOption
  }
}

export default connect(mapStateToProps)(subsidiaryList);
