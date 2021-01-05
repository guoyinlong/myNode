/**
 * 作者：耿倩倩
 * 创建日期：2017-11-01
 * 邮箱：gengqq3@chinaunicom.cn
 * 功能：财务-全成本-项目全成本管理-项目全成本预算执行情况管理
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Select, DatePicker, Input, Row, Col, Button, Spin, message, Tooltip, Modal } from 'antd';
import { routerRedux } from 'dva/router';
const dateFormat = 'YYYY-MM-DD';
import { exportExlData } from './exportExlData'
import styles from '../../../../components/finance/table.less'
import commonStyle from '../costCommon.css';
import costmainten from './../../cost/feeManager/costmainten.less';
import moment from 'moment';
import { TagDisplay } from '../costCommon.js'
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const { MonthPicker } = DatePicker;
const Option = Select.Option;

class BudgetExecuteManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OU: this.props.location.query.ou || localStorage.ou,
      stateParam: this.props.location.query.stateParam || '1',
      projCode: this.props.location.query.projCode || '请选择项目名称',
      visible: false
      //textValue:''
    };
  };

  isInArray = (projListData, projCode) => {
    for (let i = 0; i < projListData.length; i++) {
      if (projCode === projListData[i].proj_code) {
        return true;
      }
    }
    return false;
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元
   */
  selectOu = (value) => {
    const { dispatch } = this.props;
    this.setState({
      OU: value,
      projCode: '请选择项目名称',
      //textValue:'',
    });
    // 根据OU和年份获取项目列表
    dispatch({
      type: 'projCostBudgetExecuteManage/changeOu',
      ou: value,
      //QYearMonth:this.state.yearMonth === '' ? this.props.lastDate : this.state.yearMonth,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变年月
   */
  onChangeDatePickerB = (value) => {
    const { dispatch, endTime } = this.props;
    const { stateParam } = this.state;
    dispatch({
      type: 'projCostBudgetExecuteManage/changeDate',
      ou: this.state.OU,
      //QYearMonth:value,
      beginTime: value,
      endTime,
      projCode: this.state.projCode,
      stateParam
    });
    // dispatch({
    //   type:'projCostBudgetExecuteManage/queryProjectBudgetGoing',
    //   yearMonth:value,
    //   projCode:this.state.projCode,
    //   stateParam,
    //   ou:this.state.OU,
    // });
  };
  onChangeDatePickerE = (value) => {
    const { dispatch, beginTime } = this.props;
    const { stateParam } = this.state;
    dispatch({
      type: 'projCostBudgetExecuteManage/changeDate',
      ou: this.state.OU,
      beginTime,
      endTime: value,
      projCode: this.state.projCode,
      stateParam
    });
    // dispatch({
    //   type:'projCostBudgetExecuteManage/queryProjectBudgetGoing',
    //   yearMonth:value,
    //   projCode:this.state.projCode,
    //   stateParam,
    //   ou:this.state.OU,
    // });
  };
  // 改变统计类型
  stateParamChange = (value) => {
    this.setState({
      stateParam: value
    });
    // const {yearMonth } =this.state;
    // let yearMonth1 = yearMonth !=='' ? yearMonth : this.props.lastDate;
    let { dispatch } = this.props;
    dispatch({
      type: 'projCostBudgetExecuteManage/changeStateParam',
      projCode: this.state.projCode,
      stateParam: value,
      ou: this.state.OU,
    });
  };
  // 改变项目名称
  handleProjNameChange = (value) => {
    this.setState({
      projCode: value,
      //textValue:value,
    });
    const { stateParam } = this.state;
    //let yearMonth1 = yearMonth !=='' ? yearMonth : this.props.lastDate;
    let { dispatch } = this.props;
    dispatch({
      type: 'projCostBudgetExecuteManage/queryProjectBudgetGoing',
      //yearMonth:yearMonth1,
      projCode: value,
      stateParam,
      ou: this.state.OU,
    });
  };
  // 输入项目编号
  handleProjCodeChange = (e) => {
    if (e.target.value.length === 14) {
      this.setState({
        projCode: e.target.value
      });
      const { yearMonth, stateParam } = this.state;
      let yearMonth1 = yearMonth !== '' ? yearMonth : this.props.lastDate;
      let { dispatch } = this.props;
      dispatch({
        type: 'projCostBudgetExecuteManage/queryProjectBudgetGoing',
        yearMonth: yearMonth1,
        projCode: e.target.value,
        stateParam,
        ou: this.state.OU,
      });
    } else if (e.target.value !== '') {
      message.info('请输入正确的项目编号');
    }
  };
  // 输入项目编号
  changeText = (e) => {
    this.setState({
      textValue: e.target.value
    });
    // if( e.target.value.length === 14 ){
    //   this.setState ({
    //     projCode: e.target.value
    //   });
    // }
  };
  expExl = () => {
    const { list } = this.props;
    if (list !== null && list.length !== 0) {
      exportExlData(list, "预算执行情况", this.props.projInfoOne, this.props.projInfoTwo, this.props.columns)
    } else {
      message.info("查询结果为空！")
    }
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-20
   * 功能：限定月份
   */
  disabledDate = (value) => {
    if (value) {
      let lastDate = this.props.lastDate.valueOf();
      return value.valueOf() > lastDate
    }
  };
  handleOK_BP = () => {
    const {dispatch} = this.props
    this.setState({
      visible: true
    })
    dispatch({
      type: 'projCostBudgetExecuteManage/cost_BP_detail_query_comp',
      ou: this.state.OU,
      stateParam: this.state.stateParam,
      projCode: this.state.projCode
    })
  }
  handleCancel_BP = () => {
    this.setState({
      visible: false
    })
  }
  goback = ()=>{
    const {dispatch, history_param} = this.props
    dispatch(
      routerRedux.push({
        pathname: '/financeApp/cost_proj_fullcost_mgt/comprehensive_query',
        query: {history_param}
      })
    );
  }
  render() {
    const { stateParamList, projList, ouList, projInfoOne, loading, list, projInfoTwo, columns } = this.props;
    // 表格点击事件添加
    columns && columns.map(item => {
      if (item.title === '类别') {
        item.render = (text, row) => {
          if (row.fee_name === 'BP专项') {
            return (
              <div style={{ textAlign: 'left' }} onClick={this.handleOK_BP}>
                <Tooltip title={row.fee_name} style={{ width: '30%' }}>
                  <div style={{ width: '195px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '5px' }}><a>{row.fee_name}</a></div>
                </Tooltip>
              </div>
            )
          } else {
            return (
              <div style={{ textAlign: 'left' }}>
                <Tooltip title={row.fee_name} style={{ width: '30%' }}>
                  <div style={{ width: '195px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '5px' }}>{row.fee_name}</div>
                </Tooltip>
              </div>
            )
          }
        }
      }
    }
    )
    // if(this.isInArray(projList,this.state.projCode) === false){
    //   this.setState({
    //     projCode : '请选择项目名称'
    //   })
    // }
    //组织单元列表
    let ouList1;
    if (ouList.length !== 0) {
      ouList1 = ouList.map((item) => {
        return (
          <Option key={item.dept_name}>
            {item.dept_name}
          </Option>
        )
      });
    }
    //部门列表，同时去前缀
    const projNameList = projList.map((item) => {
      return (
        <Option key={item.proj_code}>
          {item.proj_name}
        </Option>
      )
    });
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    //console.log(this.props)
    return (
      <Spin tip="Loading..." spinning={loading}>
        <div id='tableBox' className={commonStyle.container}>
          {
            this.props.goback_btn ? <Button type={'primary'} onClick={this.goback}>返回</Button> : null
          }
          <br/><br/>
          {/*查询条件开始*/}
          <div style={{ textAlign: 'left', paddingLeft: '15px' }}>
            <span style={{ display: 'inline-block', marginRight: '20px' }}>OU：
            <Select showSearch style={{ width: 200 }} value={this.state.OU} onSelect={this.selectOu}>
                {ouList1}
              </Select>
            </span>
            <span style={{ display: 'inline-block', marginRight: '20px' }}>统计类型：
            <Select
                value={stateParamList[0] ? this.state.stateParam : null}
                onChange={this.stateParamChange}
                style={{ minWidth: '125px' }}
              >
                {stateParamList.map((i, index) => <Option key={index} value={i.state_code}>{i.state_name}</Option>)}
                <Option key="4" value="4">自定义</Option>
              </Select>
            </span>
            {
              this.state.stateParam !== '3' ?
                <span style={{ display: 'inline-block', marginRight: '20px' }}>开始时间：
                <MonthPicker
                    className={costmainten.dateInput}
                    onChange={this.onChangeDatePickerB}
                    value={this.props.beginTime}
                    placeholder="请选择年月"
                    disabledDate={this.disabledDate}
                    disabled={!(this.state.stateParam === '4')}
                    allowClear={false} />
                </span>
                :
                null
            }

            <span style={{ display: 'inline-block' }}>结束时间：
            <MonthPicker
                className={costmainten.dateInput}
                onChange={this.onChangeDatePickerE}
                value={this.props.endTime}
                placeholder="请选择年月"
                disabledDate={this.disabledDate}
                disabled={!(this.state.stateParam === '4')}
                allowClear={false} />
            </span>
            {/*<span style={{display:'inline-block',marginRight:'20px'}}>项目编码：*/}
            {/*<Input*/}
            {/*style={{width:'150px'}}*/}
            {/*placeholder="可输入项目编码查询"*/}
            {/*onBlur={this.handleProjCodeChange}*/}
            {/*onChange={this.changeText}*/}
            {/*value={this.isInArray(projList,this.state.projCode) === false?'':this.state.textValue}*/}
            {/*/>*/}
            {/*</span>*/}
            <br />
            <span style={{ display: 'inline-block', marginTop: '10px' }}>项目名称：
            <Select showSearch
                optionFilterProp="children"
                onChange={this.handleProjNameChange}
                dropdownMatchSelectWidth={false}
                value={this.isInArray(projList, this.state.projCode) === false ? '请选择项目名称' : this.state.projCode}
                style={{ minWidth: '400px' }}>
                <Option value='请选择项目名称'>请选择项目名称</Option>
                {projNameList}
              </Select>
            </span>
            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              {
                list.length !== 0 ?
                  <Button type="primary" onClick={this.expExl}>导出</Button>
                  :
                  <Button disabled onClick={this.expExl}>导出</Button>
              }
            </span>
          </div>

          {/*查询条件结束*/}
          {projInfoOne.proj_name ?
            /*查询结果结束*/
            <div style={{ marginTop: '20px' }}>
              {/*项目信息开始*/}
              <div>
                <div>
                  <h3 style={{
                    textAlign: 'left',
                    paddingLeft: '15px',
                    fontWeight: '600'
                  }}>项目名称：{projInfoOne.proj_name}</h3>
                </div>
                <Row style={{ textAlign: 'left', paddingLeft: '15px', marginTop: '10px' }}>
                  <Col span={6}>
                    <b>项目编码：</b>{projInfoOne.proj_code}
                  </Col>
                  <Col span={6}>
                    <b>PMS编码：</b>{projInfoOne.pms_code}
                  </Col>
                  <Col span={6}>
                    <b>项目周期：</b>{projInfoOne.begin_time} 到 {projInfoOne.end_time}
                  </Col>
                  <Col span={6}>
                    <b>项目状态：</b><TagDisplay proj_tag={projInfoOne.proj_tag} />
                  </Col>
                </Row>
                <Row style={{ textAlign: 'left', paddingLeft: '15px', marginTop: '10px' }}>
                  <Col span={6}>
                    <b>项目经理：</b>{projInfoOne.proj_manager}
                  </Col>
                  <Col span={6}>
                    <b>项目成员数量(人)：</b>{projInfoOne.staff_num}
                  </Col>
                  <Col span={12}>
                    <b>主责部门：</b>{projInfoOne.dept_name_primary}
                  </Col>
                </Row>
                <Row style={{ textAlign: 'left', paddingLeft: '15px', marginTop: '10px' }}>
                  <Col span={6}>
                    <b>投资替代额(元)：</b>{projInfoTwo.replace_money}
                  </Col>
                  <Col span={6}>
                    <b>确认投资替代额(元)：</b>{projInfoTwo.confirm_replace_money}
                  </Col>
                  <Col span={6}>
                    <b>预计利润(元)：</b>{projInfoTwo.budget_profit}
                  </Col>
                  <Col span={6}>
                    <b>实际利润(元)：</b>{projInfoTwo.real_profit}
                  </Col>
                </Row>
                <Row style={{ textAlign: 'left', paddingLeft: '15px', marginTop: '10px' }}>
                  <Col span={24}>
                    <b>参与部门：</b>{projInfoOne.dept_name_second}
                  </Col>
                </Row>
              </div>
              {/*项目信息结束*/}
              {/*表格开始*/}
              {/*表格结束*/}
            </div>
            /*查询结果结束*/
            : null
          }
          {
            list.length !== 0 ?
              <div style={{ textAlign: 'left', marginTop: '20px' }}>
                {
                  this.props.columns.length > 3 ?
                    <Table columns={this.props.columns}
                      dataSource={this.props.list}
                      pagination={false}
                      //loading={loading}
                      scroll={{ x: this.props.columnsWidth, y: 400 }}
                      className={styles.financeTable}
                    />
                    :
                    <Table columns={this.props.columns}
                      dataSource={this.props.list}
                      pagination={false}
                      //loading={loading}
                      className={styles.financeTable}
                    />
                }
                <p style={{ marginTop: "20px" }}>
                  <span>注：</span><br/>
                  <span>项目至今统计：预算数为项目总预算，即平台中所填预算总和。</span><br/>
                  <span>自定义：预算数为统计区间内的年度预算数加和，以前年份取12月预算。</span>
                </p>
              </div>
              :
              null
          }
          <Modal
            title={'BP专项详情'}
            visible={this.state.visible}
            onCancel={this.handleCancel_BP}
            footer={null}
            width='80%'
          >
            <Table dataSource={this.props.dataSource_BP} columns={this.props.columns_BP} className={styles.financeTable} />
          </Modal>
        </div>
      </Spin>
    );
  }
}


function mapStateToProps(state) {
  //const { list,ouList,stateParamList,projList,projInfoOne,lastDate,projBudgetGoingList,projInfoTwo,columns,columnsWidth,projListRetVal,projName } = state.projCostBudgetExecuteManage;
  return {
    loading: state.loading.models.projCostBudgetExecuteManage,
    ...state.projCostBudgetExecuteManage
  };
}

export default connect(mapStateToProps)(BudgetExecuteManage);
