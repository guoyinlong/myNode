/**
 * 作者：张楠华
 * 日期：2017-09-20
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：个人考核考核状态柱状图显示
 */
import React from 'react';
import {connect} from 'dva';
import {Table, Select, Button,Icon,Tooltip} from 'antd';
import message from '../../../components/commonApp/message'
const Option = Select.Option;
const {Column} = Table;
import styles from '../../../components/common/table.less'
import Style from '../../../components/employer/employer.less'
import {exportExlValue} from "./exportExlValue"
import {exportExlCheck} from "./exportExlCheck"
import {OU_HQ_NAME_CN} from '../../../utils/config'
import StateEchart from './stateEchart'
import { Spin } from 'antd';
/**
 * 作者：张楠华
 * 创建日期：2017-09-20
 * 功能：如果deptname为OU，则返回合计
 */
function checkDeptName(text,record) {
  if (record.deptname == "ou") {
    return <div style={{textAlign: "left", whiteSpace: 'normal'}}>合计</div>
  }
  if (record.deptname != "ou" ) {
    return <div style={{textAlign: "left", whiteSpace: 'normal'}}>{record.deptname.split('-')[1]}</div>
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-09-20
 * 功能：转化未填报信息
 */
function checkFinishPerson(text, record) {
    return <div>{record.finishperson}</div>
}
/**
 * 作者：张楠华
 * 创建日期：2017-09-20
 * 功能：表格和柱状图切换
 */
class SwitchBarTable extends React.Component {
  render() {
    const {ischeck, checkList, valueList,ou,temp} = this.props;
    if (ischeck == 1) {
      return (
        <div>
          <StateEchart checkList={checkList} ou={ou} temp={temp} ischeck={ischeck}/>
        </div>);
    } else {
      return (
        <div>
        <StateEchart valueList={valueList} ou={ou} temp={temp} ischeck={ischeck}/>
      </div>);
    }
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-09-20
 * 功能：指标填表和指标评价转化
 */
class SwitchTable extends React.Component {
  render() {
    const {ischeck, checkList, valueList, loading} = this.props;
    if (ischeck == 1) {
      return (
        <div>
          <Table dataSource={checkList} pagination={false} className={styles.orderTable} loading={loading} style={{marginTop:'25px'}}>
            <Column
              title="部门"
              dataIndex="deptname"
              key="deptname"
              render={(text, record) => checkDeptName(text, record)}
              width="240px"
            />
            <Column
              title="未填报"
              dataIndex="noFill"
              className="nofill"
              key="noFill"
              width="150px"
            />
            <Column
              title="已填报"
              dataIndex="numdept"
              key="numdept"
              width="150px"
            />
            <Column
              title="待审核"
              dataIndex="Pending_audit"
              key="Pending_audit"
              width="150px"
            />
            <Column
              title="已审核"
              dataIndex="Audited"
              key="Audited"
              width="150px"
            />
            <Column
              title="合计"
              dataIndex="allmun"
              key="allmun"
              width="150px"
            />
          </Table>
        </div>
      );
    } else {
      return (
        <div>
          <Table dataSource={valueList} pagination={false} className={styles.orderTable} loading={loading} style={{marginTop:'25px'}}>
            <Column
              title="部门"
              dataIndex="deptname"
              key="deptname1"
              render={(text, record) => checkDeptName(text, record)}
              width="240px"
            />
            <Column
              title="完成情况已填报"
              dataIndex="finishperson"
              key="finishperson"
              render={(text, record) => checkFinishPerson(text, record)}
              width="150px"
            />
            <Column
              title="待评价"
              dataIndex="pending_evaluation"
              key="pending_evaluation"
              width="150px"
            />
            <Column
              title="待评级"
              dataIndex="evaluation_completion"
              key="evaluation_completion"
              width="150px"
            />
            <Column
              title="考核完成"
              dataIndex="assessment_completed"
              key="assessment_completed"
              width="150px"
            />
            <Column
              title="合计"
              dataIndex="allnum"
              key="allnum1"
              width="150px"
            />
          </Table>
        </div>
      );
    }
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-09-20
 * 功能：实现考核状态展示
 */
class statistic extends React.Component {
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：初始化，ou从localStorage中获取，控制权限
   */
  constructor(props) {
    super(props);
    this.state = {
      company_type: localStorage.ou,
      index_type: 0,
      year_type: new Date().getFullYear().toString(),
      season_type: Math.floor((new Date().getMonth() + 1 + 2) / 3).toString(),
      displayWay: 'table',
      displayTabBar:'',
      displayBarTab:'none',
      temp:false,
      yearList:[]
    }
  }

  componentDidMount=()=>{
    let tYear = new Date().getFullYear()
    let yearList=[]
     for(let i=2016;i<=tYear;i++){
      yearList.push(i)
     }
    this.setState({
      yearList: yearList
    });
    }
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：组织单元改变传值
   */
  handleChange1 = (value) => {
    this.setState({
      company_type: value,
      temp:true,
    })
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：考核阶段改变传值
   */
  handleChange2 = (value) => {
    this.setState({
      index_type: value,
      temp:true,
    })
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：考核年度改变传值
   */
  handleChange3 = (value) => {
    this.setState({
      year_type: value,
      temp:true,
    })
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：考核季度改变传值
   */
  handleChange4 = (value) => {
    this.setState({
      season_type: value,
      temp:true,
    })
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：切换至table或者切换至
   */
  switchDisplay1 = () => {
    this.setState({
      displayWay: this.state.displayWay == 'table' ? 'bar' : 'table',
      displayTabBar:'none',
      displayBarTab:'',
      temp:true,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：切换至table或者切换至
   */
  switchDisplay2 = () => {
    this.setState({
      displayWay: this.state.displayWay == 'table' ? 'bar' : 'table',
      displayTabBar:'',
      displayBarTab:'none',
      temp:true,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：点击查询按钮，给module传值，再与后台交互。
   */
  queryState = () => {
    const {dispatch} = this.props;
    this.setState({
      temp:false,
    });
    if(this.state.index_type==0){
      dispatch({
        type: 'statistic/checkState',
        arg_company_type: this.state.company_type,
        arg_year_type: this.state.year_type,
        arg_season_type: this.state.season_type,
      })
    }else{
      dispatch({
        type: 'statistic/valueState',
        arg_company_type: this.state.company_type,
        arg_year_type: this.state.year_type,
        arg_season_type: this.state.season_type,
      })
    }

  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-20
   * 功能：初始化，导出数据--指标填报，指标评价
   */
  exportExl2 = () => {
    const {checkList, valueList} = this.props;
    const data1 = {"title": [{"value": "部门"}, {"value": "未填报"}, {"value": "已填报"}, {"value": "待审核"}, {"value": "已审核"}, {"value": "合计"}]};
    const data2 = {"title": [{"value": "部门"}, {"value": "完成情况已填报"}, {"value": "待评价"}, {"value": "待评级"}, {"value": "考核完成"}, {"value": "合计"}]};
    if (checkList != null && checkList.length != 0) {
      exportExlCheck(checkList, "指标填报情况", data1.title)
    } else if (valueList != null && valueList.length != 0) {
      exportExlValue(valueList, "指标评价情况", data2.title)
    } else {
      message.info("查询结果为空！")
    }
  };

  render() {
    const {list, loading, checkList, valueList, ischeck} = this.props;
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    if (valueList.length) {
      valueList.map((i, index) => {
        i.key = index;
      })
    }
    if (checkList.length) {
      checkList.map((i, index) => {
        i.key = index;
      })
    }
    //返回ouList放入组织单元
    const OuList = list.map((item, index) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    //判断是否是本院，如果为分院登录，设置组织单元不可选。
    const isLocal = localStorage.ou == OU_HQ_NAME_CN ? false : true;
    return (
      <div className={Style.wrap} style={{whiteSpace: 'nowrap', overflowX: 'auto'}}>
        <div style={{textAlign: 'left'}}>
          组织单元：
          <Select showSearch style={{width: 160}} value={this.state.company_type} onSelect={this.handleChange1}
                  defaultValue={localStorage.ou} disabled={isLocal}>
            {OuList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          考核阶段：
          <Select showSearch style={{width: 100}} value={this.state.index_type == 1 ? '指标评价' : "指标填报"}
                  onSelect={this.handleChange2} defaultValue="指标填报">
            <Option value="0">指标填报</Option>
            <Option value="1">指标评价</Option>
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          考核年度：
          <Select showSearch style={{width: 100}} value={this.state.year_type} onSelect={this.handleChange3}
                  defaultValue={new Date().getFullYear().toString()}>
           {this.state.yearList.map(el => {
            return <Option value={el+""} key={el+""} >{el}</Option>;
            })}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          考核季度：
          <Select showSearch style={{width: 100}} value={this.state.season_type} onSelect={this.handleChange4}
                  defaultValue={Math.floor((new Date().getMonth() + 1 + 2) / 3).toString()}>
            <Option value="1">第一季度</Option>
            <Option value="2">第二季度</Option>
            <Option value="3">第三季度</Option>
            <Option value="4">第四季度</Option>
            <Option value="0">年度考核</Option>
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" icon="search" onClick={this.queryState}>查询</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        {this.props.ischeck == 1 ?
          <div>
            <h3 style={{float:'left',textAlign: 'left', marginTop: '20px', fontSize: '29px', fontFamily: '宋体', fontWeight: 'bold'}}>
              指标填报情况
            </h3>&nbsp;&nbsp;&nbsp;&nbsp;
            {this.state.displayWay === 'table' ?
            <Tooltip title="柱状图显示">
              <Icon type = 'zhuzhuangtu' style={{marginTop: '28px',fontSize:20,cursor:'pointer'}} onClick={this.switchDisplay1}/>
            </Tooltip>
            :
            <Tooltip title="表格显示">
              <Icon type = 'liebiao' style={{marginTop: '28px',fontSize:20,cursor:'pointer'}} onClick={this.switchDisplay2}/>
            </Tooltip>
          }
          </div>
          :
          <div>
            <h3 style={{float:'left',textAlign: 'left', marginTop: '20px',  fontSize: '29px', fontFamily: '宋体', fontWeight: 'bold'}}>
              指标评价情况
            </h3>&nbsp;&nbsp;&nbsp;&nbsp;
              {this.state.displayWay === 'table' ?
                <Tooltip title="柱状图显示">
                  <Icon type = 'zhuzhuangtu' style={{marginTop: '28px',fontSize:20,cursor:'pointer'}} onClick={this.switchDisplay1}/>
                </Tooltip>
                :
                <Tooltip title="表格显示">
                  <Icon type = 'liebiao' style={{marginTop: '28px',fontSize:20,cursor:'pointer'}} onClick={this.switchDisplay2}/>
                </Tooltip>
              }
          </div>
        }
        <div style={{display:this.state.displayTabBar}}>
          <SwitchTable  checkList={checkList} valueList={valueList} loading={loading} ischeck={ischeck}/>
          <div style={{textAlign: "right", marginTop: '10px'}}><Button type="primary" icon="download"
                                                                       onClick={this.exportExl2}>导出</Button></div>
        </div>
        <div style={{display:this.state.displayBarTab}}>
          {loading == true ? <div style={{textAlign:'center'}}><Spin /></div>:null}
          <SwitchBarTable checkList={checkList} valueList={valueList} ischeck={ischeck} ou={this.state.company_type} temp={this.state.temp}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {list, query, valueList, checkList, ischeck} = state.statistic;
  return {
    loading: state.loading.models.statistic,
    list,
    valueList,
    checkList,
    query,
    ischeck,
  };
}

export default connect(mapStateToProps)(statistic);
