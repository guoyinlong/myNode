/**
 * 作者：张楠华
 * 日期：2017-12-5
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：活动类型维护
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../components/employer/employer.less'
import styles from '../../../components/common/table.less'
import { Row,Col, Input, Button, Tabs, Modal, Table,Select,message,Popconfirm } from 'antd';
const TabPane = Tabs.TabPane; //标签组
const Option = Select.Option;
class ActivityTypeMaintenance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      visible1:false,//修改通用
      visible2:false,//修改特殊
      visible3:false,//添加通用
      visible4:false,//添加特殊
      ou:localStorage.ou,
      ouSp:localStorage.ou,
      projCode:'请选择团队名称',
      projCodeSp:'请选择团队名称',
      typeValue:'',
      describeValue:'',
      typeValueSp:'',
      describeValueSp:'',
      recordComActivity:'',
      recordComDes:'',
      recordSpActivity:'',
      recordSpDes:'',
      recordCom:'',
      recordSp:'',

    }
  }
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：查询ou
   */
  queryOu=(key)=>{
    if(key ==='2'){
      this.setState({
        ou:this.state.ou,
        projCode:this.state.projCode,
      });
      this.props.dispatch({
        type:'activityTypeMaintenance/queryOu',
      });
      this.props.dispatch({
        type:'activityTypeMaintenance/getProjListSp',
        ou:this.state.ou,
      });
    }
  };
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：选择ou
   */
  selectOu=(value)=>{
    this.setState({
      ou:value,
      projCode:'请选择团队名称',
    });
    this.props.dispatch({
      type:'activityTypeMaintenance/getProjList',
      ou:value
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：查询特定活动类型结果
   */
  handleProjNameChange=(value)=>{
    this.setState({
      projCode:value,
    });
    this.props.dispatch({
      type:'activityTypeMaintenance/querySpActivity',
      ou:this.state.ou,
      projCode:value,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：选择ou
   */
  selectOuSp=(value)=>{
    this.setState({
      ouSp:value,
      projCodeSp:'请选择团队名称',
      ou:this.state.ou,
      projCode:this.state.projCode,
    });
    this.props.dispatch({
      type:'activityTypeMaintenance/getProjListAdd',
      ouSp:value
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：新增中选择项目
   */
  handleProjNameChangeSp=(value)=>{
    this.setState({
      projCodeSp:value,
    });
  };
   /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：修改通用活动类型
   */
  modifyCom=()=>{
    const { recordComActivity,recordComDes,recordCom } =this.state;
    this.props.dispatch({
      type:'activityTypeMaintenance/modifyComActivity',
      recordComActivity:recordComActivity,
      recordComDes:recordComDes,
      recordCom:recordCom,
    });
    this.setState({
      visible1:false,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：修改特殊活动类型
   */
  modifySp=()=>{
    const { recordSpActivity,recordSpDes,recordSp } =this.state;
    this.props.dispatch({
      type:'activityTypeMaintenance/modifySpActivity',
      recordSpActivity:recordSpActivity,
      recordSpDes:recordSpDes,
      recordSp,
    });
    this.setState({
      visible2:false,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：添加通用
   */
  addCom=()=>{
    const {typeValue,describeValue} = this.state;
    this.props.dispatch({
      type:'activityTypeMaintenance/addComActivity',
      typeValue,
      describeValue,
    });
    this.setState({
      visible3:false,
      typeValue:'',
      describeValue:'',
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：添加特殊
   */
  addSp=()=>{
    const {typeValueSp,describeValueSp,ouSp,projCodeSp} = this.state;
    if(projCodeSp !== '请选择团队名称'){
      this.props.dispatch({
        type:'activityTypeMaintenance/addSpActivity',
        typeValueSp,
        describeValueSp,
        ouSp,
        projCodeSp
      });
      this.props.dispatch({
        type:'activityTypeMaintenance/getProjListSp',
        ou:ouSp
      });
      this.setState({
        visible4:false,
        typeValueSp:'',
        describeValueSp:'',
        ou:ouSp,
        projCode:projCodeSp,
        ouSp:localStorage.ou,
        projCodeSp:'请选择团队名称',
      });
    }else{
      message.info('请选择团队名称');
    }
  };
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：删除通用类型
   */
  deleteComType=(record)=>{
    this.props.dispatch({
      type:'activityTypeMaintenance/delComActivity',
      recordCom:record,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-12-5
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：删除特定类型
   */
  deleteSpType=(record)=>{
    this.props.dispatch({
      type:'activityTypeMaintenance/delSpActivity',
      recordSp:record,
      ou:this.state.ou,
      projCode:this.state.projCode,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框 修改通用
   */
  showModal1=(record)=>{
    this.setState({
      visible1:true,
      recordCom:record,
      recordComActivity:record.activity_name,
      recordComDes:record.remarks,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消 修改通用
   */
  handleCancel1=()=>{
    this.setState({
      visible1:false
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框 修改特殊
   */
  showModal2=(record)=>{
    this.setState({
      visible2:true,
      recordSp:record,
      recordSpActivity:record.activity_name,
      recordSpDes:record.remarks,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消 修改特殊
   */
  handleCancel2=()=>{
    this.setState({
      visible2:false
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框
   */
  showModal3=()=>{
    this.setState({
      visible3:true
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消 添加通用
   */
  handleCancel3=()=>{
    this.setState({
      visible3:false,
      typeValue:'',
      describeValue:'',
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框
   */
  showModal4=()=>{
    this.props.dispatch({
      type:'activityTypeMaintenance/getProjListAdd',
      ouSp:localStorage.ou,
    });
    this.setState({
      visible4:true
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消 添加特殊
   */
  handleCancel4=()=>{
    this.setState({
      visible4:false,
      typeValueSp:'',
      describeValueSp:'',
      ouSp:localStorage.ou,
      projCodeSp:'请选择团队名称'
    })
  };
  columns1 = [
    {
      title: '活动类型',
      dataIndex: 'activity_name',
      key:'activityType',
    },
    {
      title: '活动描述',
      dataIndex: 'remarks',
      key:'activity',
    },
    {
      title: '操作',
      dataIndex: '',
      key:'operation',
      render:(text,record)=>{
        return (
          <div>
            <a onClick={()=>this.showModal1(record)}>修改</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <Popconfirm title={`确定要删除该条记录吗？`} onConfirm={()=>this.deleteComType(record)}  okText="确定"
                        cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
          )
      }
    }
  ];
  changeType=(e)=>{
    this.setState({
      typeValue:e.target.value,
    })
  };
  changeDescribe=(e)=>{
    this.setState({
      describeValue:e.target.value,
    })
  };
  changeTypeSp=(e)=>{
    this.setState({
      typeValueSp:e.target.value,
    })
  };
  changeDescribeSp=(e)=>{
    this.setState({
      describeValueSp:e.target.value,
    })
  };
  changeTypeModifyCom=(e)=>{
    this.setState({
      recordComActivity:e.target.value,
    })
  };
  changeDescribeModifyCom=(e)=>{
    this.setState({
      recordComDes:e.target.value,
    })
  };
  changeTypeModifySp=(e)=>{
    this.setState({
      recordSpActivity:e.target.value,
    })
  };
  changeDescribeModifySp=(e)=>{
    this.setState({
      recordSpDes:e.target.value,
    })
  };
  render() {
    const {ouList,projList,list,spList,loading,projectList} = this.props;
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    let columns2;
    if (spList.length) {
      spList.map((i, index) => {
        i.key = index;
      });
      columns2 = [
        {
          title: 'OU',
          dataIndex: 'ou',
          key:'ou',
        },
        {
          title: '团队名称',
          dataIndex: 'proj_name',
          key:'projName',
        },
        {
          title: '活动类型',
          dataIndex: 'activity_name',
          key:'actType',
        },
        {
          title: '活动描述',
          dataIndex: 'remarks',
          key:'act',
        },
        {
          title: '操作',
          dataIndex: 'opCrl',
          key:'opCrl',
          render:(text,record)=>{
            return (
              <div>
                <a onClick={()=>this.showModal2(record)}>修改</a>&nbsp;&nbsp;&nbsp;&nbsp;
                <Popconfirm title={`确定要删除该条记录吗？`} onConfirm={()=>this.deleteSpType(record)}  okText="确定"
                            cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              </div>
            )
          }
        }
      ];
    }
    const ouList1 = ouList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    //部门列表，同时去前缀
    const projNameList = projList.map((item) => {
      return (
        <Option key={item.proj_code}>
          {item.proj_name}
        </Option>
      )
    });
    //部门列表，同时去前缀
    const projectNameList = projectList.map((item) => {
      return (
        <Option key={item.proj_code}>
          {item.proj_name}
        </Option>
      )
    });
    return (
      <div className={Style.wrap}>
        <Tabs defaultActiveKey="1" onTabClick={this.queryOu}>
          <TabPane tab='通用活动类型' key="1">
            <div style={{textAlign:'right'}}>
              <Button type="primary" onClick={this.showModal3}>新增</Button>
            </div>
            <div id="table1" style={{marginTop:'10px'}}>
              <Table columns={this.columns1}
                     dataSource={list}
                     pagination={true}
                     loading={loading}
                     className={styles.orderTable}
              />
            </div>
          </TabPane>
          <TabPane tab='特有活动类型' key="2">
            <div style={{textAlign:'left',paddingLeft:'15px'}}>
              <span style={{display:'inline-block'}}>OU：
                <Select showSearch style={{ width: 160}}  value={this.state.ou} onSelect={this.selectOu} >
                  {ouList1}
                </Select>
              </span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span style={{display:'inline-block',marginTop:'10px'}}>团队名称：
                <Select onChange={this.handleProjNameChange} placeholder="请选择团队名称" style={{minWidth:'400px'}} value={this.state.projCode}>
                  <Option value="请选择团队名称">请选择团队名称</Option>
                  {projNameList}
                </Select>
              </span>
            </div>
            <div style={{textAlign:'right'}}>
              <Button type="primary" onClick={this.showModal4}>新增</Button>
            </div>
            <div id="table2" style={{marginTop:'10px'}}>
              <Table columns={columns2}
                     dataSource={spList}
                     pagination={true}
                     loading={loading}
                     className={styles.orderTable}
              />
            </div>
          </TabPane>
        </Tabs>
          <Modal
            title="修改通用活动类型"
            visible={this.state.visible1}
            onCancel={this.handleCancel1}
            onOk={this.modifyCom}
          >
            <Row>
              <Col offset={6} span={4}>活动类型：</Col>
              <Col span={8}>
                <Input value={this.state.recordComActivity} onChange={this.changeTypeModifyCom}/>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col offset={6} span={4}>活动描述：</Col>
              <Col span={8}><Input value={this.state.recordComDes} onChange={this.changeDescribeModifyCom}/></Col>
            </Row>
          </Modal>
          <Modal
            title="修改特有活动类型"
            visible={this.state.visible2}
            onCancel={this.handleCancel2}
            onOk={this.modifySp}
            width='700px'
          >
            <Row style={{marginTop:'10px'}}>
              <Col offset={4} span={4}>OU：</Col>
              <Col span={8}>
                <Input disabled value={this.state.recordSp.ou}>
                </Input>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col offset={4} span={4}>团队名称：</Col>
              <Col span={8}>
                <Input disabled style={{minWidth:'400px'}} value={this.state.recordSp.proj_name}>
                </Input>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col offset={4} span={4}>活动类型：</Col>
              <Col span={8}>
                <Input value={this.state.recordSpActivity} onChange={this.changeTypeModifySp}/>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col offset={4} span={4}>活动描述：</Col>
              <Col span={8}><Input value={this.state.recordSpDes} onChange={this.changeDescribeModifySp}/></Col>
            </Row>
          </Modal>
          <Modal
            title="新增通用活动类型"
            visible={this.state.visible3}
            onCancel={this.handleCancel3}
            onOk={this.addCom}
          >
            <Row>
              <Col offset={6} span={4}>活动类型：</Col>
              <Col span={8}>
                <Input value={this.state.typeValue} onChange={this.changeType}/>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col offset={6} span={4}>活动描述：</Col>
              <Col span={8}><Input value={this.state.describeValue} onChange={this.changeDescribe}/></Col>
            </Row>
          </Modal>
          <Modal
            title="新增特定活动类型"
            visible={this.state.visible4}
            onCancel={this.handleCancel4}
            onOk={this.addSp}
            width="700px"
          >
            <Row>
              <Col offset={4} span={4}>OU：</Col>
              <Col span={8}>
                <Select style={{ width: 400}}  value={this.state.ouSp} onSelect={this.selectOuSp} >
                  {ouList1}
                </Select>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col offset={4} span={4}>团队名称：</Col>
              <Col span={8}>
                <Select onChange={this.handleProjNameChangeSp} placeholder="请选择团队名称" style={{minWidth:'400px'}} value={this.state.projCodeSp}>
                  <Option value="请选择团队名称">请选择团队名称</Option>
                  {projectNameList}
                </Select>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col offset={4} span={4}>活动类型：</Col>
              <Col span={8}>
                <Input style={{ width: 400}} value={this.state.typeValueSp} onChange={this.changeTypeSp}/>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col offset={4} span={4}>活动描述：</Col>
              <Col span={8}><Input style={{ width: 400}} value={this.state.describeValueSp} onChange={this.changeDescribeSp}/></Col>
            </Row>
          </Modal>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.activityTypeMaintenance,
    ...state.activityTypeMaintenance
  };
}
export default connect(mapStateToProps)(ActivityTypeMaintenance);
