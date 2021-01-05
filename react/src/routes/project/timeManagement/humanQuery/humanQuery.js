/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：人员查询界面，普通角色和项目经理。
 */
import React from 'react';
import Style from '../review/review.less'
import { Select,DatePicker,Row,Col,Button,Modal,Table,Spin,Pagination  } from 'antd';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class HumanQuery extends React.Component{
  constructor(props){
    super(props)
  }
  state = {
    ou : localStorage.ou,
    projCode : '',
    date:[moment('2016-01-01'),moment()],
    timeSheetState:'',
    page:1,
    visible:false,
    visible1:false,
  };
  /**
   *  作者: 张楠华
   *  创建日期: 2017-11-28
   *  邮箱：zhangnh6@chinaunicom.cn
   *  功能：默认第一个，通过项目名称改变查人员信息。
   */
  handleProjNameChange =(value)=> {
    const { projectList } = this.props;
    let startTime;
    for(let i=0;i<projectList.length;i++){
      if(value === projectList[i].proj_code){
        startTime = moment(projectList[i].begin_time);
        break;
      }else{
        startTime = moment('2016-01-01');
      }
    }
    let endTime = moment();
    this.setState({
      projCode:value,
      date:[startTime,endTime],
      page:1
    },()=>{
      this.props.dispatch({
        type:'humanQuery/humanQuery',
        projCode:value,
        date:this.state.date,
        timeSheetState:this.state.timeSheetState,
        page:1
      });
    });

  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改变年月
   */
  onChangeDatePicker = (value) => {
    this.setState({
      date:value,
      page:1
    });
    if(value.length === 0){
      return;
    }
    this.props.dispatch({
      type:'humanQuery/humanQuery',
      projCode:this.state.projCode,
      date:value,
      timeSheetState:this.state.timeSheetState,
      page:1
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：改状态
   */
  timeSheetStateChange = (value) => {
    this.setState({
      timeSheetState:value,
      page:1
    });
    this.props.dispatch({
      type:'humanQuery/humanQuery',
      projCode:this.state.projCode,
      date:this.state.date,
      timeSheetState:value,
      page:1
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
      type:'humanQuery/timeSheetDetail',
      projCode:i.proj_code,
      staffId:i.staff_id,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框
   */
  showModal1=(i)=>{
    this.setState({
      visible1:true,
    });
    this.props.dispatch({
      type:'humanQuery/timeSheetDetail1',
      ...this.state,
      projCode:i.proj_code,
      staffId:i.staff_id,
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
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：取消模态框
   */
  handleCancel1=()=>{
    this.setState({
      visible1:false
    })
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：
   */
  changePage = (page) => {
    const { dispatch } = this.props;
    this.setState({
      page:page,
    });
    dispatch({
      type:'humanQuery/humanQuery',
      projCode:this.state.projCode,
      date:this.state.date,
      timeSheetState:this.state.timeSheetState,
      page:page,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-20
   * 功能：限定月份
   */
  disabledDate=(value)=>{
    if(value){
      let lastDate =  new Date().valueOf();
      return value.valueOf() > lastDate
    }
  };
  render() {
    const {projectList,list,DetailList,DetailList1} = this.props;
    let DetailListSort = [];
    for(let i= 0 ;i<DetailList.length;i++){
      if(i = DetailList.length-1){
        DetailListSort.push(DetailList[DetailList.length-1]);
      }
    }
    for(let i=0;i<DetailList.length-1;i++){
      DetailListSort.push(DetailList[i]);
    }
    if(DetailList.length === 1){
      DetailListSort.push(DetailList[0]);
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
    if (DetailList1.length) {
      DetailList1.map((i, index) => {
        i.key = index;
      })
    }
    let columns =[];
    if(this.props.isMgr === '0'){
      columns = [
        {
          title: '开始时间',
          dataIndex: 'startTime',
          key:'startTime',
        },
        {
          title: '结束时间',
          dataIndex: 'end_time',
          key:'end_time',
        },
        {
          title: '状态',
          dataIndex: 'approved_status',
          key:'approved_status',
        }
      ];
    }else{
      columns = [
        {
          title: '开始时间',
          dataIndex: 'startTime',
          key:'startTime',
        },
        {
          title: '结束时间',
          dataIndex: 'end_time',
          key:'end_time',
        },
        {
          title:'工时',
          dataIndex:'week_hours',
          key:'week_hours',
        },
        {
          title: '状态',
          dataIndex: 'approved_status',
          key:'approved_status',
        }
      ];
    }

    let columns1 = [
      {
        title: '开始时间',
        dataIndex: 'begin_time',
        key:'begin_time',
      },
      {
        title: '结束时间',
        dataIndex: 'end_time',
        key:'end_time',
      },
      {
        title:'周一',
        dataIndex:'mon',
        key:'mon',
      },
      {
        title:'周二',
        dataIndex:'tues',
        key:'tues',
      },
      {
        title:'周三',
        dataIndex:'wed',
        key:'wed',
      },
      {
        title:'周四',
        dataIndex:'thur',
        key:'thur',
      },
      {
        title:'周五',
        dataIndex:'fri',
        key:'fri',
      },
      {
        title:'周六',
        dataIndex:'sat',
        key:'sat',
      },
      {
        title:'周日',
        dataIndex:'sun',
        key:'sun',
      },
      {
        title:'总计',
        dataIndex:'week_hours',
        key:'week_hours',
      },
      {
        title: '状态',
        dataIndex: 'approved_status',
        key:'approved_status',
      }
    ];
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          <div style={{textAlign:'left',paddingLeft:'15px'}}>
            {
              this.props.tag !== 2 ?
                null
                :
                <span>
                组织单元：
                <Select showSearch style={{ width: 160}}  value={this.state.ou}>
                  <Option value={localStorage.ou}>{localStorage.ou}</Option>
                </Select>&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            }
            团队名称：
            <Select
              onChange={this.handleProjNameChange}
              placeholder="请选择团队名称"
              style={{minWidth:'400px'}}
              value={this.state.projCode === '' && projectList.length !==0? projectList[0].proj_code:this.state.projCode}>
              {projNameList}
            </Select>
            <div style={{marginTop:'10px'}}>
              累计工时日期：
              <RangePicker
                onChange={this.onChangeDatePicker}
                defaultValue={[moment('2017-11-1',dateFormat), moment('2017-11-1',dateFormat)]}
                format = {dateFormat}
                disabledDate={this.disabledDate}
                value={this.state.date}
              />&nbsp;&nbsp;&nbsp;&nbsp;
              本周工时状态：
              <Select onChange={this.timeSheetStateChange}  style={{width:160}} value={this.state.timeSheetState}>
                <Option value=''>全部</Option>
                <Option value='0'>已保存</Option>
                <Option value='1'>已提交</Option>
                <Option value='2'>审核通过</Option>
                <Option value='3'>已退回</Option>
                <Option value='8'>历史</Option>
              </Select>
            </div>
            <div style={{marginTop:'10px'}}>
              <hr/>
            </div>
            {
              list.map((i)=>{
                return(
                  <div style={{marginTop:'20px'}} className={Style.cardWrap} key={i.key}>
                    {/*项目信息开始*/}
                    <div style={{border:'1px solid #f2f2f2',padding:'15px'}}>
                      <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>
                        <Col span={8}>
                          <b style={{fontSize:'20px'}}>{i.staff_name}</b>
                        </Col>
                        <Col span={8}>
                          <b>员工编号：</b>{i.staff_id}
                        </Col>
                        <Col  span={8} style={{fontSize:'20px',textAlign:'right',paddingRight:10}}>
                          {/*<b>本周工时状态：</b>*/}
                          {
                            i.approved_status ==='工时数据缺失'?
                              <span style={{color:'red'}}>{i.approved_status}</span>
                              :
                              <span>{i.approved_status}</span>
                          }
                        </Col>
                        {/*<Col span={8}>*/}
                          {/**/}
                        {/*</Col>*/}
                      </Row>
                      {/*<div style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>*/}
                        {/*<h3>团队名称：{i.proj_name}</h3>*/}
                      {/*</div>*/}
                      <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>
                        <Col span={8}>
                          <b>累计审核通过工时：</b>{i.allhours}&nbsp;&nbsp;
                          <Button onClick={()=>this.showModal1(i)}>详情</Button>
                        </Col>
                        <Col span={8}>
                          <b>本月审核通过工时：</b>{i.monthhours}&nbsp;&nbsp;
                          <Button onClick={()=>this.showModal(i)}>审核详情</Button>
                        </Col>
                        <Col span={8}>
                          <b>本周工时：</b>{i.weekhours}
                        </Col>
                      </Row>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <Modal
            title="工时审核详情"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            cancelText='返回'
            footer={null}
          >
            <Table columns={columns}
                   dataSource={DetailListSort}
                   pagination={false}
                   loading={this.props.loading}
            />
          </Modal>
          <Modal
            title="累计工时审核详情"
            visible={this.state.visible1}
            onCancel={this.handleCancel1}
            cancelText='返回'
            footer={null}
            width='800px'

          >
            <Table columns={columns1}
                   dataSource={DetailList1}
                   pagination={true}
                   loading={this.props.loading}
            />
          </Modal>
          {this.props.loading !== true && list.length !==0?
            <div className={Style.page}>
              <Pagination current={this.state.page}
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

export default HumanQuery;
