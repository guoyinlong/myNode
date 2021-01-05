/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：项目工时查询界面。
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../review/review.less'
import { Select,DatePicker,Row,Col,Spin,Button,Table,Modal,Pagination } from 'antd';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
import PMSDetail from './PMSDetail'
//import styles from '../../../components/common/table.less'
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class timeQuery extends React.Component{
  constructor(props){
    super(props);
  }
  state = {

  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元，默认查出来全部的。
   */
  // handlePageChange = (page) => {
  //   const {dispatch} = this.props;
  //   dispatch({
  //     type:'timeQuery/handlePageChange',
  //     page:page
  //   });
  //   //this.setState({page: page}, ()=> {this.total()})
  // };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元，默认查出来全部的。 默认全部，查询
   */
  selectOu = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type:'timeQuery/getProjList',
      ou:value,
    });
    dispatch({
      type:'timeQuery/queryTimeSheet',
      projCode:'全部',
      ou:value,
      date:[moment(new Date().getFullYear().toString()+'-01-01'),moment()],
      page:1,
    })
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：
   */
  changePage = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeQuery/queryTimeSheet',
      projCode: this.props.projCode,
      ou: this.props.ou,
      date:this.props.date,
      page: page,
    })
  };
  /**
   *  作者: 张楠华
   *  创建日期: 2017-11-28
   *  邮箱：zhangnh6@chinaunicom.cn
   *  功能：查询工时信息。
   */
  handleProjNameChange =(value)=> {
    const { projectList } = this.props;
    let startTime;
    for(let i=0;i<projectList.length;i++){
      if(value === projectList[i].proj_code){
        startTime = moment(projectList[i].begin_time);
        break;
      }else{
        startTime = moment(new Date().getFullYear().toString()+'-01-01');
      }
    }
    let endTime = moment();
    this.props.dispatch({
      type:'timeQuery/queryTimeSheet',
      projCode:value,
      ou:this.props.ou,
      date:[startTime ,endTime],
      page:1,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变年月
   */
  onChangeDatePicker = (value) => {
    if(value.length === 0){
      return;
    }
    this.props.dispatch({
      type:'timeQuery/queryTimeSheet',
      projCode:this.props.projCode,
      ou:this.props.ou,
      date:value,
      page:1,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框
   */
  showModal=(i)=>{
    this.setState({
      visible:true,
    });
    this.props.dispatch({
      type:'timeQuery/timeSheetDetail',
      projCode:i.proj_code,
      date:this.props.date,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：取消模态框
   */
  handleCancel=()=>{
    this.setState({
      visible:false
    })
  };
  render() {
    const {ouList,projectList,list,DetailList} = this.props;
    //组织单元列表
    let ouList1;
    if(ouList.length !== 0){
      ouList1 = ouList.map((item) => {
        return (
          <Option key={item.OU}>
            {item.OU}
          </Option>
        )
      });
    }
    //部门列表，同时去前缀
    const projNameList = projectList.map((item) => {
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
    if (DetailList.length) {
      DetailList.map((i, index) => {
        i.key = index;
      })
    }
    let columns = [
      {
        title: '活动类型',
        dataIndex: 'activity_name',
        key:'activity_name',
      },
      {
        title: '所用工时',
        dataIndex: 'total_hours',
        key:'total_hours',
      }
    ];
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
      <div className={Style.wrap}>
        <div style={{textAlign:'left',paddingLeft:'15px'}}>
          主建单位：
          <Select showSearch style={{ width: 160}}  value={this.props.ou} onSelect={this.selectOu} >
            {ouList1}
          </Select>&nbsp;&nbsp;&nbsp;&nbsp;
          团队名称：
          <Select onChange={this.handleProjNameChange} placeholder="请选择团队名称" style={{minWidth:'400px'}} value={this.props.projCode} dropdownMatchSelectWidth={false}>
            <Option value="全部">全部</Option>
            {projNameList}
          </Select>
          <div style={{marginTop:'10px'}}>
            日期：
            <RangePicker
              onChange={this.onChangeDatePicker}
              defaultValue={[moment(new Date().getFullYear().toString()+'-01-01'),moment()]}
              format = {dateFormat}
              value={this.props.date}
              allowClear={false}
            />
          </div>
          <div style={{marginTop:'10px'}}>
            <hr/>
          </div>
          {
            list.map((i)=>{
                return(
                  <div style={{marginTop:'20px'}} className={Style.cardWrap} key={i.proj_code}>
                    {/*项目信息开始*/}
                    <div style={{border:(i.total_all-i.total_use)/i.total_all <0.1 ? '1px solid red': (0.2>(i.total_all-i.total_use)/i.total_all >0.1 ? '1px solid #FA7154':'1px solid #f2f2f2'),padding:'15px'}}>
                      <div>
                        <h3 style={{textAlign:'left',paddingLeft:'15px',fontWeight:'600',display:'inline-block'}}>团队名称：{i.proj_name}</h3>
                        {i.has_pms ==='1'?<PMSDetail pmsDetailData={this.props.pmsDetailList} state={this.props} dispatch={this.props.dispatch} projCode={i.proj_code}/>:''}
                      </div>
                      <div style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>部门名称：{i.dept_name}</div>
                      <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>
                        <Col span={8}>
                          <b>生产编码：</b>{i.proj_code}
                        </Col>
                        <Col span={8}>
                          <b>项目类别：</b>{i.proj_type}
                        </Col>
                        <Col span={8}>
                          <b>项目经理：</b>{i.mgr_name}
                        </Col>
                      </Row>
                      <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>
                        <Col span={8}>
                          <b>总工时：</b>{parseFloat(i.total_all).toFixed(1)}
                        </Col>
                        <Col span={8}>
                          <b>已用工时：</b>
                          {
                            i.hasOwnProperty('total_use')?
                              parseFloat(i.total_use).toFixed(1)
                              :
                              null
                          }&nbsp;&nbsp;
                          <Button onClick={()=>this.showModal(i)}>明细</Button>
                        </Col>
                        <Col span={8}>
                          <b>剩余工时：</b>
                            <div style={{display:'inline', color:(i.total_all-i.total_use)/i.total_all <0.1 ? 'red': (0.2>(i.total_all-i.total_use)/i.total_all >0.1 ? '#FA7154':'black')}}>
                              {
                                i.hasOwnProperty('total_use')?
                                  parseFloat(i.total_all-i.total_use).toFixed(1)
                                :
                                  parseFloat(i.total_all).toFixed(1)
                              }
                            </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )
              })
          }
        </div>
        <Modal
          title="活动明细"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          cancelText='返回'
          footer={null}
        >
          <Table columns={columns}
                 dataSource={DetailList.filter(item=>item.hasOwnProperty('total_hours'))}
                 pagination={true}
                 loading={this.props.loading}
                 //className={styles.orderTable}
          />
        </Modal>
        {this.props.loading !== true?
          <div className={Style.page}>
            <Pagination current={this.props.page}
                        total={Number(this.props.rowCount)}
                        pageSize={5}
                        defaultCurrent={1}
                        onChange={this.changePage}
            />
          </div>
          :
          null
        }
      </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.timeQuery,
    ...state.timeQuery
  };
}
export default connect(mapStateToProps)(timeQuery);
