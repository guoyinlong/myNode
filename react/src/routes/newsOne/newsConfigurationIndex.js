/**
 * 作者：窦阳春
 * 日期：2020-10-14
 * 邮箱：douyc@itnova.com.cn
 * 文件说明：新闻共享平台-新闻模块首页列表
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, Spin, Table, Modal, Button, Input, Row, Col, message, Popconfirm, Pagination, InputNumber, Select, Icon} from 'antd';
const { Option, OptGroup } = Select; 
const { TabPane } = Tabs;
import styles from '../newsOne/style.less'
import Cookies from 'js-cookie'
import TextArea from 'antd/lib/input/TextArea';
import FileUpload from './fileUpload';
import FileImport from './import.js';

class NewsConfigurationIndex extends React.Component{
  state = {
    channelAddTwo: '',
    channelTwoTitle: '',
    actionFlag: '',
    parentId: '',
    pageFlag: 1,
    addOneTitle: '新增一级拟宣传渠道',
    modiPageRecord: '',
    modifyPage: ''
  };
  changeTab =(key, flag) => {
    this.setState({
      pageFlag: key,
      addOneTitle: key==1 ? '新增一级拟宣传渠道' : key==2 ? '新增宣传类型' :  key==4 ? '新增宣传奖项类型' : key==7 ? '文件上传' : ''
    })
    const {dispatch} = this.props;
    key == 5 ?
    dispatch({
      type: 'newsConfigurationIndex/publicNoticeSet',
      flag
    })
    : key == 2 ?
    dispatch({
      type: 'newsConfigurationIndex/queryPromotionType',
    })
    : key == 3 ?
    dispatch({
      type: 'newsConfigurationIndex/queryPubPlan',
    })
    : key == 4 ? 
    dispatch({
      type: 'newsConfigurationIndex/queryPubReward',
    })
    : key == 6 ? 
    dispatch({
      type: 'newsConfigurationIndex/queryNewsPub',
    })
    : key == 7 ?
    dispatch({
      type: 'newsConfigurationIndex/querySecretFile',
    })
    : null;
  }
  add = (flag, value, actionFlag) => {
    const {parentId, pageFlag, modiPageRecord, modifyPage} = this.state;
    this.props.dispatch({
      type: 'newsConfigurationIndex/' + flag,
      value,
      actionFlag, 
      parentId: parentId,
      pageFlag,
      modiPageRecord,
      modifyPage
    })
  };
  addFile = () => { //新增相关文件
    this.props.dispatch({
      type: 'newsConfigurationIndex/addFile'
    })
  }
  saveChange = (flag, value) => {
    let valueData = value
    if(value.length > 200) {
      valueData = value.substring(0,200)
      message.destroy()
      message.info("不能超过200字！")
    }
    this.props.dispatch({
      type: 'newsConfigurationIndex/saveChange', flag, value: valueData
    })
  }
  stopPropagations=(e)=>{
    e ? e.stopPropagation() : null
  }
  ouModalTwoChannel = (record, flag, e) => {
    e ? e.stopPropagation() : null
    this.setVisible('channelTwoVisible', true)
    let channelTwoTitle = flag == 'add' ? '新增二级拟宣传渠道' :flag == 'modifyOneChannel' ? '修改一级拟宣传渠道名称' 
    : flag == 'modifyTwoChannel' ? '修改二级拟宣传渠道名称' : flag == 'modiPage2' ? '修改宣传类型名称' 
    : flag=='modiPage4' ? '修改年度宣传奖项名称' : ''
    this.setState({
      channelAddTwo: record.id, 
      channelTwoTitle, 
      channelName: flag,
      actionFlag: flag == 'add' ? 'add' : flag == 'modifyOneChannel' ? 'modify1' : flag=='modifyTwoChannel' ? 'modify2'
      : flag == 'modiPage2' ? 'modiPage2' : flag == 'modiPage3' ? 'modiPage3' : flag == 'modiPage4' ? 'modiPage4': flag == 'modiPage6' ? 'modiPage6' : '',
      parentId: record.parentId,
    }) 
    this.props.dispatch({
      type: 'newsConfigurationIndex/saveChange',
      flag: 'channelTwoName',
      value: flag!= 'add' ? record.channelName : '',
      value: flag == 'add' ? '' : flag == 'modifyOneChannel' || flag == 'modifyTwoChannel' ? record.channelName 
      : flag == 'modiPage2' ? record.typeName : flag == 'modiPage3' ? record.typeName 
      : flag == 'modiPage4' ? record.typeName : ''
    })
  }
  downLoad = (record) => { //相关文件 下载
    // let url = "/filemanage/filedownload?fileIdList="+ '1e6d0e430982494185fa6e827ddc5af8';
    let url = "/filemanage/filedownload?fileIdList="+ record.fileId;
    window.open(url,  '_blank');
  }
  delChannel = (record, level, servicesName, putAction, parentId, e) => {
    e ? e.stopPropagation() : null
    this.props.dispatch({
      type: 'newsConfigurationIndex/delChannel',
      id: record.id, level, parentId, servicesName, putAction, record
    })
  }
  columns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "",
      render : ( index )=>{
        return (
          <div> { index }</div>
        )
      }
    },
    {
      title : "拟宣传/发布渠道",
      dataIndex : "channelName",
      key : "channelName",
    },{
      title : "配置人",
      dataIndex : "createUserName",
      key : "createUserName",
    },{
      title : "部门单位",
      dataIndex : "createUserDept",
      key : "createUserDept",
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render: (text, record)=> {
        return (
          <div>
            <Button type="primary" size="small" onClick={(e)=>this.ouModalTwoChannel(record, 'add', e)}>添加</Button> &nbsp;
            {/* 二级渠道添加模态框 */}
            <Modal
              title= {this.state.channelTwoTitle}
              maskStyle = {{backgroundColor: 'rgba(0, 0, 0, 0.1)'}}
              visible = {this.props.channelTwoVisible}
              onOk={()=>this.add('channelTwoName', this.state.channelAddTwo, this.state.actionFlag)}
              onCancel={()=>this.setVisible('channelTwoVisible', false)}> 
              名称：
              <Input 
                style={{width:'65%'}} value={this.props.channelTwoName} 
                onChange={(e)=>this.saveChange('channelTwoName', e.target.value)}/>
            </Modal>
            <Button type="primary" size="small" onClick={(e)=>this.ouModalTwoChannel(record, 'modifyOneChannel', e)}>修改</Button> &nbsp;
            <Popconfirm title="确定删除？" onConfirm={(e)=>this.delChannel(record, 'one', 'pubChannelDel', 'pubChannelQueryOne', '', e)}>
              <Button type="primary" size="small" onClick={(e)=>this.stopPropagations(e)}
                disabled={record.isContainChild == '1' ? true : false}
              >删除</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  promotionTypeColumns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "key",
    },
    {
      title : "宣传类型",
      dataIndex : "typeName",
      key : "typeName",
    },
    {
      title : "配置人",
      dataIndex : "createUserName",
      key : "createUserName",
    },
    {
      title : "操作",
      dataIndex : "",
      key : "",
      render: (text, record)=> {
        return (
          <div>
            <Button type='primary' size="small" onClick={()=>this.ouModalTwoChannel(record, 'modiPage2')}>修改</Button> &nbsp;
            <Popconfirm title="确定删除？" onConfirm={()=>this.delChannel(record, 'pageFlag2', 'deletePromotionType', 'queryPromotionType')}>
              <Button type="primary" size="small" >删除</Button>
            </Popconfirm>
          </div>
        )
      }
    },
  ]
  innerColumns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "key",
    },
    {
      title : "名称",
      dataIndex : "channelName",
      key : "channelName",
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render: (text, record)=> {
        return (
          <div>
            <Button type="primary" size="small" onClick={()=>this.ouModalTwoChannel(record, 'modifyTwoChannel')}>修改</Button> &nbsp;
            <Popconfirm title="确定删除？" onConfirm={()=>this.delChannel(record, 'two', 'pubChannelDel', 'pubChannelQueryTwo', record.parentId)}>
              <Button type="primary" size="small">删除</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ];
  planColumns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "key",
    },
    {
      title : "宣传部门或分院",
      dataIndex : "deptOrOuName",
      key : "deptOrOuName",
    },
    {
      title : "宣传事项",
      dataIndex : "publicityMatters",
      key : "publicityMatters",
    },
    {
      title : "拟宣传平台",
      dataIndex : "publicityPlatform",
      key : "publicityPlatform",
    },
    {
      title : "拟宣传次数",
      dataIndex : "publicityNumber",
      key : "publicityNumber",
    },
    {
      title : "配置人",
      dataIndex : "createUserName",
      key : "createUserName",
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render: (text, record)=> {
        return (
          <div>
            <Button type="primary" size="small" 
            onClick={()=>this.setVisible('visible', true, 'modiPage3', record)}>修改</Button> &nbsp;
            <Popconfirm title="确定删除？" onConfirm={()=>this.delChannel(record, 'pageFlag3', 'deletePubPlan', 'queryPubPlan')}>
              <Button type="primary" size="small">删除</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  rewardColumns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "key",
    },
    {
      title : "年度奖项类型",
      dataIndex : "typeName",
      key : "typeName",
    },
    {
      title : "配置人",
      dataIndex : "createUserName",
      key : "createUserName",
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render: (text, record)=> {
        return (
          <div>
            <Button type="primary" size="small" 
            onClick={()=>this.ouModalTwoChannel(record, 'modiPage4')}>修改</Button> &nbsp;
            <Popconfirm title="确定删除？" onConfirm={()=>this.delChannel(record, 'pageFlag4', 'deletePubReward', 'queryPubReward')}>
              <Button type="primary" size="small">删除</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  fileColumns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "key",
    },
    {
      title : "文件类型",
      dataIndex : "publicityMatters",
      key : "publicityMatters",
    },
    {
      title : "文件名称",
      dataIndex : "typeName",
      key : "typeName",
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render: (text, record)=> {
        return (
          <div>
            <Button type="primary" size="small" 
              onClick={()=>this.downLoad(record)}
            >下载
            </Button> &nbsp;
            <Popconfirm title="确定删除？" onConfirm={()=>this.delChannel(record, 'pageFlag7', 'deleteSecret', 'querySecretFile')}>
              <Button type="primary" size="small">删除</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  newsConfigColumns = [  
    {
      title : "序号",
      dataIndex : "key",
      key : "key",
    },
    {
      title : "院级/分院",
      dataIndex : "ouName",
      key : "ouName",
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render: (text, record)=> {
        return (
          <div>
            <Button type="primary" size="small" onClick={(e)=>this.setVisible('visible', true, 'addPage6', record, e)}>新增</Button>
          </div>
        )
      }
    }
  ];
  newsConfigInnerColumns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "key",
    },
    {
      title : "宣传员名称",
      dataIndex : "publicistName",
      key : "publicistName",
    },
    {
      title : "部门",
      dataIndex : "deptName",
      key : "deptName",
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render: (text, record)=> {
        return (
          <div>
            <Button type="primary" size="small" onClick={()=>this.setVisible('visible', true, 'modiPage6', record)}>修改</Button> &nbsp;
            <Popconfirm title="确定删除？"  onConfirm={()=>this.delChannel(record, 'pageFlag6', 'deletePublicist', 'queryNewsPub')}>
              <Button type="primary" size="small">删除</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  // 展开table
  changeExpandedRows = ( expanded,record)=>{
    this.props.dispatch({
      type : 'newsConfigurationIndex/pubChannelQueryTwo',
      record,
    })
  }
  expandedRowKeysMan = ( expanded,record)=>{
    this.props.dispatch({
      type : 'newsConfigurationIndex/expandedRowKeysMan',
      record,
    })
  }
  setVisible = (flag, value, page, record, e) => {
    e ? e.stopPropagation() : null
    let str = page == 'modiPage3' ? 'modiPage3' : page == 'addPage3' ? 'addPage3' 
    : page == 'addPage6' ? 'addPage6' : page == 'modiPage6' ? 'modiPage6': '';
    this.setState({
      modifyPage: str,
      modiPageRecord: record,
      addOneTitle: page == 'modiPage6' ? '修改新闻宣传员' : page == 'modiPage3' ? '修改年度宣传计划名称' :
                   page == 'addPage6' ? '新增新闻宣传员' : page == 'addPage3' ? '新增年度宣传计划名称' : this.state.addOneTitle
    })
    page == 'modiPage3' || page == 'modiPage6' ? this.props.dispatch({type: 'newsConfigurationIndex/savePageRecord', record, page}) :
    page == 'addPage6' ? this.props.dispatch({type: 'newsConfigurationIndex/queryDeptByOuId', record}) : null
    this.props.dispatch({
      type: 'newsConfigurationIndex/setVisible',
      value, flag
    })
  }
  changePage = (page) => {
    this.props.dispatch({
      type: 'newsConfigurationIndex/changePage',
      page, pageFlag: this.state.pageFlag
    })
  }
  downloadTemp =() =>{ //模板下载
    window.open('/filemanage/upload/portalFileUpdate/10010/2020/11/18/0893287/0c24c20b57204c5f95c216094f1459b7/宣传计划模板.xlsx', '_self')
  }
  saveData = () => {
    this.props.dispatch({
      type: 'newsConfigurationIndex/queryPubPlan'
    })
  }
  newsConfigExpandedRows = (record) => {
    return(
      <Table
        className = {styles.orderTable}
        pagination={false}
        dataSource = { record.publicists }
        columns = {this.newsConfigInnerColumns}
      >
      </Table>
    )
  }
  render() {
    let {channelName, chanelList, visible, allCount, pageCurrent1, publicNotice, promotionTypeList,
       allCount2, allCount3, allCount4, allCount7, pageCurrent2, pageCurrent3, pageCurrent4, pageCurrent7, planList, xuanNum, 
       planDept, planDeptDataList, flatDataList, flatData, rewardList, fileList, fileTypeValue, newsConfigList,
       newsPersonDept, newsPerson, planNewsManDept, fileData } = this.props;
    const {addOneTitle, pageFlag, modifyPage} = this.state;
    let deptName = Cookies.get('deptname')
    let userName = Cookies.get('username')
    const expandedRowRender = ( record )=>{
      return(
        <Table
          className = {styles.orderTable}
          pagination={false}
          dataSource = { record.chanelListTwo }
          columns = {this.innerColumns }
        >
        </Table>
      )
    }
    let planDeptList = planDeptDataList.length == 0 ? [] : planDeptDataList.map((item) => { //部门列表
      return <Option key={item.deptId} value={item.deptId}>{ item.deptName.substring(item.deptName.indexOf('-')+1) }</Option>
    })
    newsPersonDept = newsPersonDept.length == 0 ? [] : newsPersonDept.map((item, i) => { //宣传员部门列表
      return <Option key={i} value={item.deptId}>{ item.deptName.substring(item.deptName.indexOf('-')+1) }</Option>
    })
    newsPerson = newsPerson.length == 0 ? [] : newsPerson.map((item, i) => { //宣传员部门人员列表
      return <Option key={i+1} value={item.userId}>{ item.userName.substring(item.userName.indexOf('-')+1) }</Option>
    })
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
          <h2 style = {{textAlign:'center',marginBottom:30}}>新闻配置</h2>
          <div>
          <Tabs defaultActiveKey="1" onChange={this.changeTab}>
            <TabPane tab="拟宣传/发布渠道配置" key="1">
            <Button style = {{float: 'right', marginBottom: 10}} size="default" type="primary" onClick={()=>this.setVisible('visible', true)}>新增</Button>
            <Modal
              title = {addOneTitle}
              visible = {visible}
              onOk={pageFlag != 7 ? ()=>this.add('channel') : ()=>this.addFile()}
              onCancel={()=>this.setVisible('visible', false)}
            >
              {
                pageFlag == 1 || pageFlag == 2 || pageFlag == 4 ?
                <div>
                  <Row>
                    <Col span={7} style={{textAlign: 'right'}}>
                      {pageFlag==1?'新增渠道类型：' : pageFlag==2 ? '新增宣传类型：'  : pageFlag==4 ? '新增宣传奖项类型：' : pageFlag == 6 ? '新增新闻宣传员' : ''}
                    </Col>
                    <Col span={14}>
                      <Input 
                        placeholder="请输入" value={channelName} 
                        onChange={(e)=>this.saveChange('channelName', e.target.value)}/>
                    </Col>
                  </Row>
                  {pageFlag != 4 ? 
                  <Row style={{marginTop: 10}}>
                    <Col span={7} style={{textAlign: 'right'}}>部门：</Col>
                    <Col span={17}>{deptName}</Col>
                  </Row>  : ''}
                  <Row style={{marginTop: 10}}>
                    <Col span={7} style={{textAlign: 'right'}}>新闻宣传人：</Col>
                    <Col span={17}>{userName}</Col>
                  </Row>
                </div>
                : pageFlag == 3 ?
                <div>
                  <Row>
                    <Col span={7} style={{textAlign: 'right'}}>部门：</Col>
                    <Col span={17}>
                      <Select value={planDept} style={{ minWidth: '65%' }}  onChange={(value)=>this.saveChange('planDept',value)}>
                        {planDeptList}
                      </Select>
                    </Col>
                  </Row>
                  <Row style={{marginTop: 10}}>
                    <Col span={7} style={{textAlign: 'right'}}>宣传事项：</Col>
                    <Col span={17}>
                      <Input 
                        style={{width: '65%'}}
                        placeholder="请输入" value={channelName} 
                        onChange={(e)=>this.saveChange('channelName', e.target.value)}/></Col>
                  </Row>
                  <Row style={{marginTop: 10}}>
                    <Col span={7} style={{textAlign: 'right'}}>拟宣传平台：</Col>
                    <Col span={17}>
                      <Select style={{width:'300px'}} 
                      value={flatData} 
                      onChange={(item)=>this.saveChange('flatData', item)} 
                      allowClear={ true }>
                      {flatDataList.length > 0 ? flatDataList.map((i,index)=>
                        <OptGroup label={i.channelName} key={index}>
                          {(i.children).map((item)=>
                            <Option value={(item.channelName)} key={item.id}>{item.channelName}</Option>
                          )}
                        </OptGroup>
                      ): null}
                      </Select>
                    </Col>
                  </Row>
                  <Row style={{marginTop: 10}}>
                    <Col span={7} style={{textAlign: 'right'}}>拟宣传次数：</Col>
                    <Col span={17}>
                      <InputNumber min={0} value={xuanNum} style={{width: '30%'}} onChange={(value)=>this.saveChange('xuanNum', value)}/>
                    </Col>
                  </Row>
                </div>
                : pageFlag == 6 ?
                <div>
                  <Row>
                    <Col span={7} style={{textAlign: 'right'}}>部门：</Col>
                    <Col span={17}>
                      <Select value={planNewsManDept} style={{ minWidth: '65%' }}  
                      onChange={(value)=>this.saveChange('planNewsManDept',value)}
                      disabled = {modifyPage == 'modiPage6' ? true : false}>
                        {newsPersonDept}
                      </Select>
                    </Col>
                  </Row>
                  <Row style={{marginTop: 10}}>
                    <Col span={7} style={{textAlign: 'right'}}>新增宣传员：</Col>
                    <Col span={17}>
                      <Select value={channelName} style={{ minWidth: '65%' }}  onChange={(value)=>this.saveChange('channelName',value)}>
                        {newsPerson}
                      </Select>
                    </Col>
                  </Row>
                </div>
                : pageFlag == 7 ?
                <div>
                  <Row>
                    <Col span={7} style={{textAlign: 'right'}}>文件类型：</Col>
                    <Col span={17}>
                      <Select value={fileTypeValue} style={{ minWidth: '65%' }}  onChange={(value)=>this.saveChange('fileTypeValue',value)}>
                        <Option key={1} value={'保密文件'}>保密文件</Option>
                        <Option key={2} value={'积分规则文件'}>积分规则文件</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row style={{marginTop: 10}}>
                    <Col span={7} style={{textAlign: 'right'}}>
                    </Col>
                    <Col span={11}>
                      <FileUpload dispatch={this.props.dispatch} fileData = {fileData}/>
                    </Col>
                  </Row>
                </div>
                : ''
              }
            </Modal>
            <Table style={{clear: 'both'}}
                className = { styles.orderTable }
                dataSource = { chanelList }
                columns = { this.columns } 
                bordered = { true }
                defaultExpandAllRows={false}
                expandedRowRender = { expandedRowRender }
                onExpand = { this.changeExpandedRows }
                onRowClick = { (record)=>this.changeExpandedRows('', record) }
                expandedRowKeys = {this.props.expandedRowKeys}
                pagination = {false}
              >
              </Table>
              <Pagination defaultCurrent={1} total={allCount} pageCurrent = {pageCurrent1} onChange = {this.changePage}
              style={{textAlign: 'center', margin: '10px 0px'}}/>
            </TabPane>
            <TabPane tab="宣传类型配置" key="2">
              <Button style = {{float: 'right', marginBottom: 10}} size="default" type="primary" onClick={()=>this.setVisible('visible', true)}>新增</Button>
              <Table style={{clear: 'both'}}
                className = {styles.orderTable}
                pagination={false}
                dataSource = { promotionTypeList }
                columns = {this.promotionTypeColumns }
              >
              </Table>
              <Pagination defaultCurrent={1} total={allCount2} pageCurrent = {pageCurrent2} onChange = {this.changePage}
              style={{textAlign: 'center', margin: '10px 0px'}}/>
            </TabPane>
            <TabPane tab="宣传计划配置" key="3">
              <div style = {{float:'right', marginLeft:10}}><FileImport dispatch={this.props.dispatch} passFuc = {this.saveData}/></div> {/* 导入按钮 */}
              <Button style = {{float: 'right', marginBottom: 10}} size="default" type="primary" onClick={()=>this.setVisible('visible', true, 'addPage3')}>新增</Button>
              <Button style = {{float:'right', marginRight:10}}  onClick={this.downloadTemp}><Icon type = 'download'/>模板下载</Button>
              <Table style={{clear: 'both'}}
                className = {styles.orderTable}
                pagination={false}
                dataSource = { planList }
                columns = {this.planColumns }
              >
              </Table>
              <Pagination defaultCurrent={1} total={allCount3} pageCurrent = {pageCurrent3} onChange = {this.changePage}
              style={{textAlign: 'center', margin: '10px 0px'}}/>
            </TabPane>
            <TabPane tab="宣传奖项配置" key="4">
              <Button style = {{float: 'right', marginBottom: 10}} size="default" type="primary" 
              onClick={()=>this.setVisible('visible', true)}>新增</Button>
              <Table style={{clear: 'both'}}
                className = {styles.orderTable}
                pagination={false}
                dataSource = { rewardList }
                columns = {this.rewardColumns }
              />
              <Pagination defaultCurrent={1} total={allCount4} pageCurrent = {pageCurrent4} onChange = {this.changePage}
              style={{textAlign: 'center', margin: '10px 0px'}}/>
            </TabPane>
            <TabPane tab="宣传公告配置" key="5">
              <TextArea value={publicNotice} onChange={(e)=>this.saveChange('publicNotice', e.target.value)}/>
              <Button style={{marginTop: 10}} type="primary" onClick={()=>this.changeTab(5, 'confirm')}>确定</Button>
            </TabPane>
            <TabPane tab="新闻宣传员配置" key="6">
              <span className = {styles.orderTableNewsConfig}>
                <Table
                  className = {styles.orderTable}
                  bordered = { true }
                  dataSource = {newsConfigList}
                  columns = {this.newsConfigColumns }
                  expandedRowRender = { this.newsConfigExpandedRows }
                  onExpand = { (expanded, record)=>this.expandedRowKeysMan(expanded, record) }
                  onRowClick = { (record)=>this.expandedRowKeysMan('', record) }
                  expandedRowKeys = {this.props.expandedRowKeysMan}
                  />
              </span> 
            </TabPane>
            <TabPane tab="相关文件上传" key="7">
              <Button style = {{float: 'right', marginBottom: 10}} size="default" type="primary" onClick={()=>this.setVisible('visible', true)}>新增</Button>
              <Table style={{clear: 'both'}}
                className = {styles.orderTable}
                pagination={false}
                dataSource = { fileList }
                columns = {this.fileColumns }
              />
              <Pagination defaultCurrent={1} total={allCount7} pageCurrent = {pageCurrent7} onChange = {this.changePage}
              style={{textAlign: 'center', margin: '10px 0px'}}/>
            </TabPane>
          </Tabs>
          </div>
        </div>
       </Spin>
    );
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.newsConfigurationIndex,
    ...state.newsConfigurationIndex
  };
}
export default connect(mapStateToProps)(NewsConfigurationIndex);
