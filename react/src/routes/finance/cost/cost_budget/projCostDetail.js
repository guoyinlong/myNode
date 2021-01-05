/**
 * 作者：张楠华
 * 创建日期：2018-1-3
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：财务-全成本-项目全成本管理-项目成本明细
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Select, DatePicker,Button,Spin,message,Popconfirm } from 'antd';
import styles from '../../../../components/finance/table.less'
import commonStyle from '../costCommon.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const {MonthPicker} = DatePicker;
const Option = Select.Option;
import exportExl from '../../../../components/commonApp/exportExl';
import { rightControl } from '../../../../components/finance/rightControl';
import * as config from '../../../../services/finance/costServiceConfig.js';

class ProjCostDetail extends React.Component{
  constructor(props){
    super(props);
    this.state={
      OU:localStorage.ou,
      yearMonth: '',
      stateParam:'2',
      projType:'科研项目',
    };
  };
  /**
   * 作者：张楠华
   * 创建日期：2018-1-3
   * 功能：选择组织单元
   */
  selectOu = (value) => {
    const { dispatch} = this.props;
    const { yearMonth,stateParam,projType} = this.state;
    let yearMonth1 = yearMonth !=='' ? yearMonth : this.props.lastDate;
    this.setState({
      OU:value,
    });
    dispatch({
      type:'projCostDetail/getProjCostDetail',
      OU:value,
      yearMonth:yearMonth1,
      stateParam,
      projType,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2018-1-3
   * 功能：改变年月
   */
  onChangeDatePicker = (value) => {
    const { dispatch } = this.props;
    this.setState({
      yearMonth:value,
    });
    const {OU,stateParam,projType} = this.state;
    dispatch({
      type:'projCostDetail/getProjCostDetail',
      yearMonth:value,
      stateParam,
      OU,
      projType,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2018-1-3
   * 功能：改变统计类型
   */
  stateParamChange = (value) => {
    this.setState({
      stateParam: value
    });
    const {OU,yearMonth,projType } =this.state;
    let yearMonth1 = yearMonth !=='' ? yearMonth : this.props.lastDate;
    let {dispatch} = this.props;
    dispatch({
      type:'projCostDetail/getProjCostDetail',
      yearMonth:yearMonth1,
      stateParam:value,
      OU,
      projType,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2018-1-3
   * 功能：改变项目类型
   */
  selectProjType = (value) => {
    this.setState({
      projType:value,
    });
    const { OU,yearMonth,stateParam } =this.state;
    let yearMonth1 = yearMonth !=='' ? yearMonth : this.props.lastDate;
    let {dispatch} = this.props;
    dispatch({
      type:'projCostDetail/getProjCostDetail',
      yearMonth:yearMonth1,
      projType:value,
      stateParam,
      OU,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2018-1-3
   * 功能：导出
   */
  expExl=()=>{
    const {list} = this.props;
    let tab=document.querySelector('#table1 table');
    if(list.length !== 0){
      exportExl()(tab,'项目成本明细表')
    }else{
      message.info("查询结果为空！")
    }
  };

  /**
   * 作者：张楠华
   * 创建日期：2018-5-3
   * 功能：同步
   */
  syn=()=>{
    const { dispatch } = this.props;
    const { OU,yearMonth,stateParam,projType } =this.state;
    let yearMonth1 = yearMonth !=='' ? yearMonth : this.props.lastDate;
    dispatch({
      type:'projCostDetail/syn',
      yearMonth : yearMonth1,
      OU,
      projType,
      stateParam,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2018-1-3
   * 功能：限定月份
   */
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment().valueOf();
      return value.valueOf() > lastDate
    }
  };
  render(){
    const { stateParamList,ouList,lastDate,loading,list,rightCrl }=this.props;
    //组织单元列表
    let ouList1;
    if(ouList.length !== 0){
      ouList1 = ouList.map((item) => {
        return (
          <Option key={item.dept_name}>
            {item.dept_name}
          </Option>
        )
      });
    }
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    return(
      <Spin tip="Loading..." spinning={loading}>
        <div id='tableBox' className={commonStyle.container}>
          <div style={{textAlign:'left',paddingLeft:'15px'}}>
            <span style={{display:'inline-block'}}>OU：
              <Select showSearch style={{ width: 200}} value={this.state.OU} onSelect={this.selectOu} >
                <Option value="联通软件研究院">联通软件研究院</Option>
                {ouList1}
              </Select>
            </span>
            <span style={{display:'inline-block',marginLeft:'20px'}}>项目类型：
              <Select style={{ width: 125}}  value={this.state.projType} onSelect={this.selectProjType}>
                <Option value="科研项目">科研项目</Option>
                <Option value="普通项目">普通项目</Option>
              </Select>
            </span>
            <span style={{display:'inline-block',marginLeft:'20px'}}>年月：
                <MonthPicker
                  onChange={this.onChangeDatePicker}
                  value={lastDate ? moment(this.state.yearMonth !=='' ? this.state.yearMonth : lastDate, 'YYYY-MM'):null}
                  placeholder="请选择年月"
                  disabledDate={this.disabledDate}
                  allowClear={false} />
            </span>
            <span style={{display:'inline-block',marginLeft:'20px',marginRight:'20px'}}>统计类型：
              <Select
                value={stateParamList[0] ? this.state.stateParam : null}
                onChange={this.stateParamChange}
                style={{minWidth:'125px'}}
              >
                {stateParamList.map((i,index)=><Option key={index} value={i.state_code}>{i.state_name}</Option>)}
              </Select>
            </span>
            <div style={{display:'inline-block'}}>
              {
                rightControl(config.projCostDetailSyn,rightCrl) ?
                  <Popconfirm title="确定同步数据吗?" onConfirm={this.syn}  okText="确定" cancelText="取消">
                    <Button type="primary" disabled={this.state.projType ==='普通项目'}>同步</Button>&nbsp;&nbsp;
                  </Popconfirm>
                  :
                  null
              }
              {/*<Button type="primary" onClick={this.syn} disabled={this.state.projType ==='普通项目'}>同步</Button>&nbsp;&nbsp;*/}
              <Button type="primary" onClick={this.expExl} disabled={list.length ===0}>导出</Button>
            </div>
            <div style={{textAlign:'right',marginTop:'5px'}}>单位：元</div>
          </div>
          {
            this.props.columnsWidth>1050?
              <div style={{marginTop:'10px'}}>
                <Table columns={this.props.columns}
                       dataSource={this.props.list}
                       pagination={false}
                       className={styles.financeTable}
                       scroll={{ x: this.props.columnsWidth, y: 400 }}
                />
              </div>
              :
              <div style={{marginTop:'10px'}}>
                <Table columns={this.props.columns}
                       dataSource={this.props.list}
                       pagination={false}
                       className={styles.financeTable}
                       scroll={{ x: this.props.columnsWidth, y: 401 }}
                />
              </div>
          }

          <div id="table1"  style={{marginTop:'10px'}}>
            <Table columns={this.props.columns}
                   dataSource={this.props.list}
                   pagination={false}
                   className={styles.financeTable}
                   style={{display:"none"}}
            />
          </div>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.projCostDetail,
    ...state.projCostDetail,
  };
}
export default connect(mapStateToProps)(ProjCostDetail);
