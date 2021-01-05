/*
 * 作者：王福江
 * 创建日期：2019-11-13
 * 邮件：wangfj80@chinaunicom.cn
 * 文件说明：评议人信息管理
 */
import React from 'react';
import {connect} from 'dva';
import { Table,Tabs, Spin, Form,Row, Input, Select, Button, Popconfirm, Icon, Modal} from 'antd';
import styles from './style.less';
import Cookie from 'js-cookie';
import message from "../../components/commonApp/message";
import exportExl from './exportExl';
import {routerRedux} from "dva/router";

let nowyear = new Date().getFullYear();

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {TextArea} = Input;

class startAppraise extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      start_button: true,
      ou_name: Cookie.get('OU'),
      appraise_type:'all',
      modalVisible: false,
      modalVisible2: false,
      oragan_year: new Date().getFullYear(),
      tabs_type: '1',
      query_year: new Date().getFullYear(),
      show_ouname: '',
      show_ouid: '',
      fist_total_num: '0',
      fist_tag1_num: '0',
      fist_tag2_num: '0',
      fist_tag3_num: '0',
      fist_tag4_num: '0',
      second_total_num: '0',
      second_tag1_num: '0',
      second_tag2_num: '0',
      second_tag3_num: '0',
      second_tag4_num: '0',
    }
  }
  columns = [
    { title: '序号', dataIndex: 'indexID',width: '5%'},
    { title: '用户编号', dataIndex: 'user_id' ,width: '10%'},
    { title: '用户名称', dataIndex: 'user_name' ,width: '10%'},
    { title: '组织机构', dataIndex: 'ou_name' ,width: '13%'},
    { title: '原任单位及职务', dataIndex: 'before_post' ,width: '13%'},
    { title: '现任单位及职务', dataIndex: 'now_post' ,width: '13%'},
    { title: '任职日期', dataIndex: 'recognation_time' ,width: '10%'},
    { title: '状态', dataIndex: '' ,width: '13%',
      render: (text, record, index) => {
        if(record.state==='1'){
          return (
            <span>未首次评议</span>
          );
        }else if(record.state==='11'){
          return (
            <span>首次评议进行中</span>
          );
        }else if(record.state==='2'){
          return (
            <span>未复评</span>
          );
        }else if(record.state==='22'){
          return (
            <span>复评进行中</span>
          );
        }else if(record.state==='3'){
          return (
            <span>评议完成</span>
          );
        }

      }},
    { title: '操作', dataIndex: '', width: '26%',
      render: (text, record, index) => {
        if(record.state>1) {
          return (
            <div>
                <Button
                  type='primary'
                  size='small'
                  onClick={() => this.setModalVisible(record)}
                >{'评议结果'}
                </Button>
            </div>
          );
        }
      }
    }
  ];
  columns2 = [
    { title: '序号', dataIndex: 'indexID',width: '5%'},
    { title: '机构名称', dataIndex: 'deptname' ,width: '15%'},
    { title: '年份', dataIndex: 'year' ,width: '15%'},
    { title: '需评议数量', dataIndex: 'organize_total_num' ,width: '15%'},
    { title: '已评议数量', dataIndex: 'organize_done_num' ,width: '15%'},
    { title: '状态', dataIndex: 'state' ,width: '15%',
      render: (text, record, index) => {
        if(record.state==='1'){
          return (
            <span>正在评议</span>
          );
        }else if(record.state==='2'){
          return (
            <span>评议完成</span>
          );
        }else{
          return (
            <span>未评议</span>
          );
        }
    }},
    { title: '操作', dataIndex: '', width: '20%',
      render: (text, record, index) => {
        if(record.state>=1) {
          return (
            <div>
              <Button
                type='primary'
                size='small'
                onClick={() => this.setModalVisible2(record)}
              >{'评议结果'}
              </Button>
            </div>
          );
        }else {
            return (
              <div>

                <Popconfirm
                  title="确定发起评议吗？"
                  onConfirm={()=>this.startOraganAppraise(record)}
                >
                  <Button
                    type='primary'
                    size='small'
                  >{'发起评议'}
                  </Button>
                </Popconfirm>
              </div>
            );
        }
      }
    }
  ];

  columsPrint = [
    {
      title:'员工编号',
      dataIndex:'user_id',
      render: (value,row)=>{
        const obj = {
          children: value,
          props: {},
        };
        if(row.advice_type==='认同'){
          obj.props.rowSpan = 4;
        }else{
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },{
      title:'姓名',
      dataIndex:'user_name',
      render: (value,row)=>{
        const obj = {
          children: value,
          props: {},
        };
        if(row.advice_type==='认同'){
          obj.props.rowSpan = 4;
        }else{
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },{
      title:'评议类型',
      dataIndex:'apprise_type',
      render: (value,row)=>{
        const obj = {
          children: value,
          props: {},
        };
        if(row.advice_type==='认同'){
          obj.props.rowSpan = 4;
        }else{
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },{
      title:'意见选项',
      dataIndex:'advice_type'
    },{
      title:'对提拔该干部的看法',
      dataIndex:'total_advice',
      children: [
        {
          title: '总体',
          dataIndex: 'zongti',
          children: [
            {
              title: '数量',
              dataIndex: 'tag_num',
            }
          ]
        },
        {
          title: '本单位班子成员',
          dataIndex: 'dwbz',
          children: [
            {
              title: '数量',
              dataIndex: 'tag1_num',
            }
          ]
        },
        {
          title: '本单位中层',
          dataIndex: 'dwzc',
          children: [
            {
              title: '数量',
              dataIndex: 'tag2_num',
            }
          ]
        },
        {
          title: '其他',
          dataIndex: 'qt',
          children: [
            {
              title: '数量',
              dataIndex: 'tag3_num',
            }
          ]
        }
      ]
    },
  ];
    /*{
      title:'交接部门',
      dataIndex:'dept_name',
      width:'10%',
      render: (value,row)=>{
        const obj = {
          children: value,
          props: {},
        };
        if(depArray.indexOf(row.dept_id)===-1){
          /!**未找到 *!/
          depArray.push(row.dept_id);
          obj.props.rowSpan = row.deptSpanValue;
        }else{
          /!**找到 *!/
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },{
      title:'办理人签字',
      dataIndex:'user_sign',
      width:'10%',
      render:this.renderContent
    },{
      title:'部门经理签字',
      dataIndex:'dept_mgr_sign',
      width:'10%',
      render:(value,row)=>{
        const obj = {
          children: value,
          props: {},
        };
        if(deptmgrArray.indexOf(row.dept_id)===-1){
          /!**未找到 *!/
          deptmgrArray.push(row.dept_id);
          obj.props.rowSpan = row.deptMgrSpanValue;
        }else{
          /!**找到 *!/
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    }
  ];
  renderContent = (value) => {
    const obj = {
      children: value,
      props: {},
    };
    return obj;
  };*/

  changeTabs =(key)=>{
    const { dispatch } = this.props;

    if(key === "2")
    {
      this.setState({
        tabs_type: '2'
      });

      let arg_param = {
        arg_year: this.state.query_year
      };
      dispatch({type : "startAppraiseModel/queryOrganAppraise",arg_param:arg_param})
    }
  }
  //改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表。
  handleOuChange = (value) => {
    this.setState({
      ou_name: value
    });
    let arg_param = {
      arg_ou_name:value,
      arg_appraise_type:this.state.appraise_type
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'startAppraiseModel/queryStartAppraise',
      arg_param: arg_param
    });
  };
  handleTypeChange = (value) => {
    if(value==='1'||value==='21'){
      this.setState({
        start_button: false
      });
    }else{
      this.setState({
        start_button: true
      });
    }
    if(value==='21'){
      value = '2';
    }
    this.setState({
      appraise_type: value
    });
    let arg_param = {
      arg_ou_name: this.state.ou_name,
      arg_appraise_type: value
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'startAppraiseModel/queryStartAppraise',
      arg_param: arg_param
    });
  };
  //刷新
  freshButton = () => {
    let arg_param = {
      arg_ou_name:this.state.ou_name,
      arg_appraise_type:this.state.appraise_type
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'startAppraiseModel/queryStartAppraise',
      arg_param:arg_param
    });
  };
  //刷新
  freshButton2 = () => {
    /*let arg_param = {
      arg_ou_name:this.state.ou_name,
      arg_appraise_type:this.state.appraise_type
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'startAppraiseModel/queryStartAppraise',
      arg_param:arg_param
    });*/
  };
  //发起评议
  startAppraise = () => {
    this.setState({
      start_button: false
    });
/*    let falg = false;
    let personDataList = this.props.personDataList;
    for (let i=0;i<personDataList.length;i++){
      if(personDataList[i].state==='1'||personDataList[i].state==='2'){
        falg = true;
      }
    } */
    if(this.props.personDataList.length<=0){
       message.error("没有需要评议人员！");
    }else{
      //console.log("发起评议！");
      let arg_param = {
        arg_ou_name:this.state.ou_name,
        arg_appraise_type:this.state.appraise_type
      };
      const {dispatch} = this.props;
      dispatch({
        type: 'startAppraiseModel/startPersonAppraise',
        arg_param:arg_param
      });
    }
  };
  //个人评议结果
  setModalVisible = (record) => {
    let arg_type = '0';
    if(record.state==='11'){
      arg_type = '1';
    }else if(record.state==='2'){
      arg_type = '1';
    }else if(record.state==='22'){
      arg_type = '0';
    }else if(record.state==='3'){
      arg_type = '0';
    }
    let arg_param = {
      arg_id: record.id,
      arg_type:arg_type
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'startAppraiseModel/queryPersonInfo',
      arg_param:arg_param
    });
    this.setState({
      modalVisible: true
    });
  };
  //组织机构评议结果
  setModalVisible2 = (record) => {
    console.log("record==="+JSON.stringify(record));
    this.setState({
      oragan_year:record.year,
      modalVisible2: true,
      show_ouname: record.deptname,
      show_ouid: record.deptid
    });
    let arg_param = {
      arg_ou_id: record.deptid,
      arg_year: record.year
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'startAppraiseModel/queryOrganInfo',
      arg_param:arg_param
    });
    /*let arg_param = {
      arg_id: record.id
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'startAppraiseModel/queryPersonInfo',
      arg_param:arg_param
    });
    this.setState({
      modalVisible: true
    });*/
  };
  startOraganAppraise = (record) => {
      //console.log("发起评议！");
      let arg_param = {
        arg_year:this.state.query_year,
        arg_ou_id:record.deptid
      };
      const {dispatch} = this.props;
      dispatch({
        type: 'startAppraiseModel/startOraganAppraise',
        arg_param:arg_param
      });
  }
  handleOK = () => {
    this.setState({
      modalVisible: false
    });
  };
  handleOK2 = () => {
    this.setState({
      modalVisible2: false
    });
  };
  onChangeDatePickerOne=(dateString)=>{
    if (dateString!==''){
      this.setState({
        query_year:dateString
      });
    }
    let arg_param = {
      arg_year: dateString
    };
    const {dispatch} = this.props;
    dispatch({
      type: 'startAppraiseModel/queryOrganAppraise',
      arg_param: arg_param
    });
  }
  // 点击导出按钮
  exportTable=()=>{
    let ou_name  = this.state.ou_name;
    let tableName = '';
    let exportTitleList = [];
    if(this.state.appraise_type==='2'){
      tableName = ou_name + '-首次评议结果';
      exportTitleList = [
        { title: '序号', dataIndex: 'indexID'},
        { title: '员工编号', dataIndex: 'user_id'},
        { title: '员工姓名', dataIndex: 'user_name'},
        { title: '组织结构', dataIndex: 'ou_name'},
        { title: '原任单位及职务', dataIndex: 'before_post'},
        { title: '现任单位及职务', dataIndex: 'now_post'},
        { title: '需评议量', dataIndex: 'fist_total_num'},
        { title: '认同', dataIndex: 'fist_tag1_num'},
        { title: '基本认同', dataIndex: 'fist_tag2_num'},
        { title: '不了解', dataIndex: 'fist_tag3_num'},
        { title: '不认同', dataIndex: 'fist_tag4_num'},
      ];
    }else if(this.state.appraise_type==='3'){
      tableName = ou_name + '-复评结果';
      exportTitleList = [
        { title: '序号', dataIndex: 'indexID'},
        { title: '员工编号', dataIndex: 'user_id'},
        { title: '员工姓名', dataIndex: 'user_name'},
        { title: '组织结构', dataIndex: 'ou_name'},
        { title: '原任单位及职务', dataIndex: 'before_post'},
        { title: '现任单位及职务', dataIndex: 'now_post'},
        { title: '需评议量', dataIndex: 'second_total_num'},
        { title: '认同',     dataIndex: 'second_tag1_num'},
        { title: '基本认同', dataIndex: 'second_tag2_num'},
        { title: '不了解', dataIndex: 'second_tag3_num'},
        { title: '不认同', dataIndex: 'second_tag4_num'},
      ];
    }
    const {personDataList} = this.props;

    console.log("personDataList==="+JSON.stringify(personDataList));
    console.log("exportTitleList==="+JSON.stringify(exportTitleList));

    if(personDataList !== null && personDataList.length !== 0){
      exportExl( personDataList, tableName, exportTitleList )
    }else{
      message.info("导出数据为空！")
    }
  }

  render() {
    const { appraiseInfo} = this.props;
    const { personDataList, organDataList, ouList ,appraisePersonInfo} = this.props;
    const auth_ou = Cookie.get('OU');
    const ouOptionList = ouList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
	/*
    let flag = true;
    if(this.state.appraise_type==='1'){
      for (let i=0;i<personDataList.length;i++) {
        if(personDataList[i].state==='1'){
          flag = false;
        }
      }
    }else if(this.state.appraise_type==='2'){
      for (let i=0;i<personDataList.length;i++) {
        if(personDataList[i].state==='2'){
          flag = false;
        }
      }
    }
    */
    let yearlist = [];
    for(let i=0;i<10;i++){
      yearlist.push({year:nowyear-i})
    }
    const yearOptionList = yearlist.map((item) => {
      return (
        <Option key={item.year}>
          {item.year}
        </Option>
      )
    });

    if(appraisePersonInfo.length>0){
      this.setState({
        fist_total_num: appraisePersonInfo[0].fist_total_num,
        fist_tag1_num: appraisePersonInfo[0].fist_tag1_num,
        fist_tag2_num: appraisePersonInfo[0].fist_tag2_num,
        fist_tag3_num: appraisePersonInfo[0].fist_tag3_num,
        fist_tag4_num: appraisePersonInfo[0].fist_tag4_num,
        second_total_num: appraisePersonInfo[0].second_total_num,
        second_tag1_num: appraisePersonInfo[0].second_tag1_num,
        second_tag2_num: appraisePersonInfo[0].second_tag2_num,
        second_tag3_num: appraisePersonInfo[0].second_tag3_num,
        second_tag4_num: appraisePersonInfo[0].second_tag4_num,
      });
    }
    let tabtype = true;
    if(this.state.tabs_type==='1'){
      if(this.state.appraise_type==='2'||this.state.appraise_type==='3'){
        tabtype = false;
      }
    }

    const {commentData1,commentData2,commentData3} = this.props;
    //类型1
    let data1list = commentData1.map((item) => {
      let commentarr = item.checkbox_name.split(',');
      let numarr = item.result_num.split(',');
      let conmnentjson = [];
      for (let i=0;i<commentarr.length;i++){
        let param = {check_name: commentarr[i]};
        conmnentjson.push(param);
      }
      let num = 0;
      let infolist = conmnentjson.map((item2) => {
        return (
          <td width='25%' valign='top'>
            <p align='center'><h3>{item2.check_name}:&nbsp;&nbsp;&nbsp;&nbsp;{numarr[num++]}</h3><br/></p>
          </td>
        )
      });
      return (
        <table border="1" cellSpacing="0" width='100%' align="center">
          <tr align="center">
            <td width="100%" valign="center" colSpan="4"><p><h3><strong>{item.comment_name}</strong></h3></p><br/>
            </td>
          </tr>
          <tr align="center">
            {infolist}
          </tr>
        </table>
      )
    });
    //类型2
    let data2list = commentData2.map((item) => {
      let commentarr = item.checkbox_name.split(',');
      let numarr = item.result_num.split(',');
      let conmnentjson = [];
      for (let i=0;i<commentarr.length;i++){
        let param = {check_name: commentarr[i]};
        conmnentjson.push(param);
      }
      let num = 0;
      let infolist = conmnentjson.map((item2) => {
        return (
          <tr align="center">
            <td width="85%" valign="center" colSpan="3"><p>&nbsp; {item2.check_name}</p><br/></td>
            <td width="15%" valign="center"><p align="right">{numarr[num++]}</p></td>
          </tr>
        )
      });
      return(
        <table border="1" cellSpacing="0" width='100%' align="center">
          <tr align="center">
            <td width="100%" valign="center" colSpan="4"><br/><p><h3><strong>{item.comment_name}</strong></h3></p><br/>
            </td>
          </tr>
          {infolist}
        </table>
      )
    });
    //类型3
   let data3list = commentData3.map((item) => {
      return(
        <table border="1" cellSpacing="0" width='100%' align="center">
          <tr align="center">
            <td width="100%" valign="top" colSpan="4"><p><br/><h3>
              <strong>{item.comment_name}</strong><strong> </strong></h3></p>
              <p><textarea style={{background: 'transparent'}} disabled={true}  cols="100">{item.result_num}</textarea></p>
            </td>
          </tr>
        </table>
      )
    });

    return(
      <Spin tip={'加载中…'} spinning={this.props.loading}>
        <div style={{padding: '13px 15px 16px 15px', background: 'white'}}>
          <div style={{textAlign:'center',fontSize:'20px',marginBottom:'10px'}}>评议管理</div>
          <div>
            <Tabs onChange = { this.changeTabs }>
              <TabPane tab = "干部评议" key = "1">

                <span>组织单元：</span>
                <Select style={{width: 160}}  onSelect={this.handleOuChange} defaultValue={auth_ou}>
                  {ouOptionList}
                </Select>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>评议类型：</span>
                <Select style={{width: 160}}  onSelect={this.handleTypeChange} defaultValue='all'>
                  <Option key={'1'}>{'首次评议'}</Option>
                  <Option key={'2'}>{'首次评议结果'}</Option>
                  <Option key={'21'}>{'复评'}</Option>
                  <Option key={'3'}>{'复评结果'}</Option>
                  <Option key={'all'}>{'全部'}</Option>
                </Select>
                <span style={{float:'right'}}>
                    <Button onClick={this.startAppraise} type='primary' disabled={this.state.start_button}>
                        <Icon type="reload" />{'发起评议'}
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" disabled={tabtype} onClick={this.exportTable}>导出评议结果</Button>&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <Button onClick={this.freshButton} type='primary'>
                        <Icon type="reload" />{'刷新'}
                    </Button>
                </span>
                <br/>
                <Table
                  scroll={{y: 500 }}
                  pagination={{ pageSize: 50 }}
                  dataSource={personDataList}
                  columns={this.columns}
                  className={styles.tableStyle}
                  bordered={true}
                />
              </TabPane>
              <TabPane tab = "组织机构评议" key = "2">
                <span> 年份： </span>
                <Select style={{width: 160}}  onSelect={this.onChangeDatePickerOne} defaultValue={nowyear}>
                  {yearOptionList}
                </Select>
                <span style={{float:'right'}}>
                    <Button onClick={this.freshButton} type='primary'>
                        <Icon type="reload" />{'刷新'}
                    </Button>
                </span>
                <br/>
                <Table
                  scroll={{y: 500 }}
                  pagination={{ pageSize: 50 }}
                  dataSource={organDataList}
                  columns={this.columns2}
                  className={styles.tableStyle}
                  bordered={true}
                />
              </TabPane>
            </Tabs>
          </div>

          <Modal
            width={'1000px'}
            onCancel={this.handleOK}
            visible={this.state.modalVisible}
            title={'评议结果'}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.handleOK}>
                关闭
              </Button>
            ]}
          >
            <div className={styles.boxW} style={{display:'block'}}>
              <Table dataSource={appraiseInfo} columns={this.columsPrint} pagination={false} bordered size="middle">
              </Table>
            </div>
           {/* <div className={styles.titleBox}>
                <div className={styles.titleOneBox}>
                  <div className={styles.titleOneStyles}>首次民主评议</div>
                  <div>
                    总测评数量：<span className={styles.spanname}>{this.state.fist_total_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    未测评数量：<span className={styles.spanname}></span>&nbsp;&nbsp;&nbsp;&nbsp;
                    认同：<span className={styles.spanname}>{this.state.fist_tag1_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    基本认同：<span className={styles.spanname}>{this.state.fist_tag2_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    不认同：<span className={styles.spanname}>{this.state.fist_tag3_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    不了解：<span className={styles.spanname}>{this.state.fist_tag4_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                </div>
                <div className={styles.titleOneBox}>
                  <div className={styles.titleOneStyles}>复评</div>
                  <div>
                    总测评数量：<span className={styles.spanname}>{this.state.second_total_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    未测评数量：<span className={styles.spanname}></span>&nbsp;&nbsp;&nbsp;&nbsp;
                    认同：<span className={styles.spanname}>{this.state.second_tag1_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    基本认同：<span className={styles.spanname}>{this.state.second_tag2_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    不认同：<span className={styles.spanname}>{this.state.second_tag3_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    不了解：<span className={styles.spanname}>{this.state.second_tag4_num}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                </div>
            </div>*/}
          </Modal>

          <Modal
            width={'800px'}
            visible={this.state.modalVisible2}
            onCancel={this.handleOK2}
            title={'评议结果'}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.handleOK2}>
                关闭
              </Button>
            ]}
          >
            <div style={{height: '100%', overflow: 'scroll'}}>
              <div className="sidebar1" style={{width: '5%', float: 'left'}}>
                <span>&nbsp;</span>
              </div>
              <div className="content" style={{width: '90%', float: 'left'}}>
                <Row span={2} style={{textAlign: 'center'}}><h2>{this.state.show_ouname}（单位）{this.state.oragan_year}年度选人用人工作民主评议结果</h2></Row>
                <br/>
                <Form style={{align: 'center', marginTop: '10'}}>
                  {data1list}
                  {data2list}
                  {data3list}
                </Form>
              </div>
              <div className="sidebar2" style={{width: '5%', float: 'left'}}>
                <span>&nbsp;</span>
              </div>
            </div>
          </Modal>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.startAppraiseModel,
    ...state.startAppraiseModel
  };
}
startAppraise = Form.create()(startAppraise);
export default connect(mapStateToProps)(startAppraise);

