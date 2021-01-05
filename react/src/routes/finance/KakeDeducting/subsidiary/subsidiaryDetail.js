/**
 * 作者：刘东旭
 * 日期：2018-04-26
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：财务加计扣除研发支出辅助账详情页面
 */
import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {
  Collapse,
  Tabs,
  Radio,
  Button,
  Row,
  Col,
  Icon,
  Modal,
  Input,
  Popconfirm,
  message,
  Tooltip,
  Form,
  Badge
} from 'antd';
import style from './subsidiaryDetail.css'; //引入本页样式文件
import Cookie from 'js-cookie';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item; //定义表单中item组件


import BalanceData from './subsidiaryDetaiBalance.js';
import {DatePicker, Select} from "antd/lib/index";

class SubsidiaryDetail extends React.Component {
  state = {
    expand: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      listPageFormData: [], //上级页面传递过来的参数
      modalVisible: false, //弹窗开关
    };
  };

  // 点击返回按钮
  goListPage = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: '/financeApp/cost_proj_divided_mgt/divided_mainpage_mgt', // 回到列表页
    }));
  };


  componentWillMount() {
    const {dispatch} = this.props;
    const formData = JSON.parse(this.props.location.query.formData); //从上个页面传过来的参数

    // 页面初始化查询：查询项目数据
    dispatch({
      type: 'subsidiaryDetail/getSubsidiayDetail', //指向models层的一个方法
      formData
    });

    // 页面初始化查询：查询表头信息
    dispatch({
      type: 'subsidiaryDetail/getHeadData', //指向models层的一个方法
      formData: {
        arg_proj_type: formData.arg_proj_type, //项目类型自主研发/委托研发
      }
    });
    this.setState({
      listPageFormData: formData
    })
  }


  //点击导出触发此函数,按月导出
  handleDerivedDetail = () => {
    const {dispatch} = this.props;
    const formData = JSON.parse(this.props.location.query.formData); //从上个页面传过来的参数
    const derivedProjectCode = formData.arg_proj_code;
    const derivedProjectOu = formData.arg_ou;
    const derivedProType = formData.arg_proj_type;
    const derivedFeeType = formData.arg_fee_type;
    const derivedYear = formData.arg_year;
    const derivedMonth = formData.arg_month;
    const derivedStatus = formData.arg_state_code;
    dispatch({
      type: 'subsidiaryList/derivedMonth',
      derivedProjectCode, derivedProjectOu, derivedProType, derivedFeeType, derivedYear, derivedMonth, derivedStatus
    });
  };

  /* == 撤销部分 START == */
  // 撤销模态框显示隐藏
  modalChange = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: modalVisible ? false : true
    });
  };

  // 输入撤的原因
  revocationReason = (e) => {
    let text = e.target.value.trim();
    if (text.length > 50) {
      this.setState({
        textNumFlag: true
      })
    } else {
      this.setState({
        text,
        textNumFlag: false
      })
    }
  };

  // 撤销操作
  revocation = () => {
    const {dispatch} = this.props;
    const {listPageFormData, text} = this.state;
    const postData = {
      arg_proj_type: listPageFormData.arg_proj_type,
      arg_fee_type: listPageFormData.arg_fee_type,
      arg_year: listPageFormData.arg_year,
      arg_month: listPageFormData.arg_month,
      arg_staffid: Cookie.get('staff_id'),
      arg_proj_code: listPageFormData.arg_proj_code,
      arg_ou: listPageFormData.arg_ou,
      arg_revoke_reason:text
    };
    if (!text) {
      message.info("请输入撤销原因");
      return;
    }
    dispatch({
      type: 'subsidiaryDetail/revocation',
      postData
    });
    this.setState({modalVisible: false})
  };

  /* == 撤销部分 END == */

/* == 发布 START == */

  // 发布操作
  publishData = () => {
    const {dispatch} = this.props;
    const {listPageFormData} = this.state;
    const postData = {
      arg_proj_type: listPageFormData.arg_proj_type,
      arg_fee_type: listPageFormData.arg_fee_type,
      arg_year: listPageFormData.arg_year,
      arg_month: listPageFormData.arg_month,
      arg_proj_code: listPageFormData.arg_proj_code,
      arg_ou: listPageFormData.arg_ou,
    };
    dispatch({
      type: 'subsidiaryDetail/publishData',
      postData,
      otherData: {
        arg_staffid: Cookie.get('staff_id')
      }
    })
  };

  /* == 发布 END == */

  render() {
    const {dataList, tableHead} = this.props;
    const formData = JSON.parse(this.props.location.query.formData); //从上个页面传过来的参数
    //const stateCode = formData.arg_state_code;
    const stateCode = dataList[0] ? dataList[0].state_code : formData.arg_state_code;

    const formItemLayout = {
      colon: false,
      style: {marginBottom: 0},
      labelCol: {span: 12, style: {fontWeight: 'bold', paddingRight: 10}},
      wrapperCol: {span: 12},
    };

    const formItemLayout2 = {
      style: {marginBottom: 0},
      labelCol: {style: {float: 'left', fontWeight: 'bold', paddingRight: 10}},
      wrapperCol: {style: {float: 'left'}},
    };

    return (
      <div className={style.container}>
        <Form
          onSubmit={this.handleSearch}
        >
          <Row>
            {dataList[0] ?
              <div className={style.tableHead}>
                <Row style={{marginBottom: 10}}>
                  <Col span={24}>
                    <h2>
                      {dataList[0].proj_name}({formData.arg_year}-{formData.arg_month})
                    </h2>
                  </Col>
                </Row>
                <Col span={8}>
                  <FormItem {...formItemLayout2} label="项目编号">
                    <p>{dataList[0].proj_code}</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout2} label="研发类型">
                    <p>{dataList[0].proj_type}</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout2} label="费用类型">
                    <p>{dataList[0].fee_type}</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout2} label="金额单位">
                    <p>元(列至角分）</p>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout2} label="">
                    <Badge status="warning" text={dataList[0].state_code === '2' ? '待审核' : '已发布'}/>
                  </FormItem>
                </Col>
              </div> : null}
          </Row>

          <Row>
            <Tabs defaultActiveKey={'0'}>
              <TabPane tab="期初期末" key="0">
                <BalanceData data={{dataList, tableHead}}/>
              </TabPane>
              {
                dataList.map((v, indexV) =>
                  <TabPane tab={"凭证" + (indexV + 1)} key={indexV + 'v'}>
                    <Collapse defaultActiveKey={['1', '2']} className={style.coll}>
                      {tableHead[0] ? tableHead[0].list.map((item, itemIndex) =>
                          <Panel header={item.name} key={itemIndex}>
                            {item.list?item.list.map((cell, cellIndex) =>
                              cell.list ? cell.list.map((child, childIndex) =>
                                  <Col span={12} key={childIndex}>
                                    <FormItem {...formItemLayout} label={child.name}>
                                      <p>{v[child['englishName']]}</p>
                                    </FormItem>
                                  </Col>
                                )
                                :
                                <Col span={12} key={cellIndex}>
                                  <FormItem {...formItemLayout} label={cell.name}>
                                    <p>{v[cell['englishName']]}</p>
                                  </FormItem>
                                </Col>
                            ):[]}
                          </Panel>
                        )
                        : null}
                    </Collapse>
                  </TabPane>
                )
              }
            </Tabs>
          </Row>

          <Row>
            <Col style={{
              textAlign: 'right',
              marginTop: '24px'
            }}>
              <Popconfirm title="确定发布该数据吗?" onConfirm={this.publishData} okText="确定" cancelText="取消">
                <Button type="primary" disabled={stateCode == 1 || stateCode == undefined}>发布</Button>
              </Popconfirm>
              <Button type="primary" style={{marginLeft: 8}}  disabled={stateCode == 2 || stateCode == undefined} onClick={this.handleDerivedDetail}>导出</Button>
              <Button type="danger" style={{marginLeft: 8}} onClick={this.modalChange} disabled={stateCode == 2 || stateCode == undefined}>撤销</Button>
              <Button style={{marginLeft: 8}} onClick={this.goListPage}>返回</Button>
            </Col>


            <Modal visible={this.state.modalVisible} title="确定撤销发布吗？" onCancel={this.modalChange}
                   footer={[<Button key="back" onClick={this.modalChange}>关闭</Button>,
                     <Button key="submit" type="primary" onClick={this.revocation}>确定</Button>]}
            >
              <div>
                <p>请输入撤销原因，字数控制在50字以内:</p>
                <Input type="textarea" autosize={{minRows: 3, maxRows: 6}} onChange={this.revocationReason}
                       value={this.state.text}/>
                {this.state.textNumFlag ? <span style={{color: 'red'}}>您输入的字数已达到50字！</span> : null}
              </div>
            </Modal>

          </Row>
        </Form>
      </div>

    );
  }
}

function mapStateToProps(state) {
  const {dataList, tableHead} = state.subsidiaryDetail;
  return {
    dataList, tableHead
  }
}


export default connect(mapStateToProps)(SubsidiaryDetail);
