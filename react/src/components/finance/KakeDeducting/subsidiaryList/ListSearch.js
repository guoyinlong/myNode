/*
 * 作者：刘东旭
 * 邮箱：liudx100@chinaunicom.cn
 * 日期：2017-11-17
 * 说明：加计扣除-搜索功能表单(v1.0)
 */

import React from 'react'; //引入react
import {Form, Button, Input, Select, DatePicker, Row, Col, message} from 'antd'; //从antd中引入所有需要的组件

//时间插件汉化
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
//时间插件汉化结束

/*
 * 作者：刘东旭
 * 日期：2017-11-17
 * 说明：检索功能
 */
const FormItem = Form.Item; //定义表单中item组件
const Option = Select.Option; //定义选择组件中的选项组件
const {MonthPicker} = DatePicker; //定义年月选择组件
const dateFormat = 'YYYY-M-D'; //定义日期获取格式

export default class FormSearch extends React.Component {
  state = {
    expand: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      proName: '', //项目名称
      proCode: '', //项目编号
      comCode: '', //公司编号
      allCode: '请先选择项目', //项目编号+公司编号
      proType: '', //项目类型
      feeType: '', //费用类型
      status: '', //状态
      stat: '', //年&月统计
      year: '', //年
      month: '', //月
    };
  };

//获取项目编号和公司编号
  setProCode = (value) => {
    this.setState({
      allCode: value,
      proCode: value.split('-')[0], //取得项目编号
      comCode: value.split('-')[1]  //取得公司编号
    })
  };

//获取项目类型和费用类型
  setProType = (value) => {
    this.setState({
      proType: value.split('-')[0], //取得项目类型
      feeType: value.split('-')[1]  //取得费用类型
    })
  };

//获取状态
  setStatus = (value) => {
    this.setState({
      status: value
    })
  };

//获取年&月统计
  setStat = (value) => {
    this.setState({
      stat: value
    })
  };

//获取年
  setYear = (value) => {
    this.setState({
      year: value.format(dateFormat).split('-')[0], //日期格式化只取年
      month: value.format(dateFormat).split('-')[1] //日期格式化只取月
    });
  };


//点击查询触发此函数
  handleSearch = () => {
    const {dispatch} = this.props;
    const {proType, feeType, year, month} = this.state;
    if (proType === '') {
      message.info('请选择项目类型');
      return null;
    }
    if (feeType === '') {
      message.info('请选择费用类型');
      return null;
    }
    if (year === '') {
      message.info('年份不能为空');
      return null;
    }
    if (month === '') {
      message.info('月份不能为空');
      return null;
    } else {
      dispatch({
        type: 'subsidiaryList/searchList',
        proType, feeType, year, month
      });
    }
  };

  //点击生成触发此函数
  handleCreate = () => {
    const {dispatch} = this.props;
    const {proType, feeType, year, month} = this.state;
    if (proType === '') {
      message.info('请选择项目类型');
      return null;
    }
    if (feeType === '') {
      message.info('请选择费用类型');
      return null;
    }
    if (year === '') {
      message.info('年份不能为空');
      return null;
    }
    if (month === '') {
      message.info('月份不能为空');
      return null;
    } else {
      dispatch({
        type: 'subsidiaryList/CreateList',
        proType, feeType, year, month
      });
    }
  };

  render() {
    const {DataRows} = this.props.data;
    let nameData;
    if (DataRows !== undefined) {
      nameData = DataRows
    }

    //防止key缺失警告
    if (nameData !== undefined) {
      nameData.map((i, index) => {
        i.key = index;
      })
    }

    let projName = [];
    for (let i in nameData) {
      projName.push(<Option key={nameData[i].key}
                            value={nameData[i].proj_code + '-' + nameData[i].com_code}>{nameData[i].proj_name}</Option>)
    }

//配置表单中标题和内容部分的宽度占比
    const formItemLayout = {
      colon: false,
      labelCol: {style: {width: 100, float: 'left'}},
      wrapperCol: {style: {float: 'left'}},
    };

    return (
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={16}>
            <FormItem {...formItemLayout} label="项目名称">
              <Select
                showSearch
                placeholder="项目名称"
                style={{width: 450}}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={(value) => this.setProCode(value)}
              >
                {projName}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="项目编号">
              <p className='projCode' style={{color: '#777777'}}>{this.state.allCode}</p>
            </FormItem>
          </Col>

        </Row>
        <Row>
          <Col span={6}>
            <FormItem {...formItemLayout} label="类型">
              <Select
                placeholder="请选择"
                style={{width: 150}}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onSelect={this.setProType}
              >
                <Option value="自主研发-费用化">自主研发-费用化</Option>
                <Option value="自主研发-资本化">自主研发-资本化</Option>
                <Option value="委托研发-费用化">委托研发-费用化</Option>
                <Option value="委托研发-资本化">委托研发-资本化</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label="状态">
              <Select
                placeholder="请选择"
                style={{width: 150}}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onSelect={this.setStatus}
              >
                <Option value="未生成">未生成</Option>
                <Option value="待审核">待审核</Option>
                <Option value="已审核">已审核</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label="统计">
              <Select
                defaultValue="月统计"
                style={{width: 150}}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onSelect={this.setStat}
              >
                <Option value="月统计">月统计</Option>
                <Option value="年统计">年统计</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label="年月">
              <MonthPicker
                size="large"
                placeholder="请选择"
                style={{width: 150}}
                onChange={(value) => this.setYear(value)}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{
            marginBottom: '50px',
            paddingLeft: 100
          }}>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button type="primary" style={{marginLeft: 8}} onClick={this.handleCreate}>生成</Button>
            <Button type="primary" style={{marginLeft: 8}}>导出</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const ListSearch = Form.create()(FormSearch);
