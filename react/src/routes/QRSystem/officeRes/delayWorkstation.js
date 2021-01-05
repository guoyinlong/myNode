/**
  * 作者： 王均超
  * 创建日期：2019-09-02
  * 邮箱:  wangjc@itnova.com.cn
  * 功能： 延期工位
  */
import React from 'react';
import styles from './delayWorkstation.less';
import { Button, Modal, Input, Table, message, DatePicker, Row, Col, Icon } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';


const { TextArea } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

class DelayWorkstation extends React.Component {


  constructor(props) {

    super(props);
    this.state = {
      isPNameVisible: false,
      isPCNameVisible: false,
      isUNameVisible: false,
      searchText: "",
      dataIndex: "",
      searchObject: {},
      searchValue: "",
      searchContent: {},
      isShowDetailModal: false,
      // 推迟的原因
      delayReason: false,
      // 延期开始时间
      delayStartDate: null,
      // 延期结束时间
      delayEndDate: null,
      // 查看详情选中的 modal
      detailObj: null,
      PName: "",//项目组名称
      PCName: "",//项目负责人
      UName: ""//员工姓名
    };
  }

  // 延期人员table表头
  explicitimplicitchange = (name, visible) => {
    const { PName, PCName, UName } = this.state
    if (name == "ex_project_name") {
      this.setState(
        { isPNameVisible: visible, searchText: PName },
        () => this.searchInput.focus()
      )
    } else if (name == "ex_project_charger_name") {
      this.setState(
        { isPCNameVisible: visible, searchText: PCName },
        () => this.searchInput.focus()
      )
    }
    else if (name == "user_name") {
      this.setState(
        { isUNameVisible: visible, searchText: UName },
        () => this.searchInput.focus()
      )
    }
  }
  filterDropdown = (dataIndex, title) => {
    return (
      <div className="custom-filter-dropdown">
        <div className={styles.search}>
          <Input
            className={styles.searchInput}
            ref={ele => this.searchInput = ele}
            placeholder={title}
            value={this.state.searchText}
            onChange = {(e) => this.onInputChange(e,dataIndex)}
            onPressEnter = {() => this.onSearch(dataIndex)}
          />
          <Button type="primary" onClick={() => this.onSearch(dataIndex)}>搜索</Button>
        </div>
      </div>
    )
  }
  //当输入框的内容改变时
  onInputChange = (e, index) => {
    if (index == "ex_project_name") {
      this.setState({
        PName: e.target.value,
        searchObject: {
          ...this.state.searchObject,
          PName: e.target.value
        }
      });
    } else if (index == "ex_project_charger_name") {
      this.setState({
        PCName: e.target.value,
        searchObject: {
          ...this.state.searchObject,
          PCName: e.target.value
        }
      });
    } else if (index == "user_name") {
      this.setState({
        UName: e.target.value,
        searchObject: {
          ...this.state.searchObject,
          UName: e.target.value
        }
      });
    };
    this.setState({ searchText: e.target.value });
  };
  //当搜索时
  onSearch = (dataIndex) => {
    const { searchText, searchObject } = this.state;
    this.setState({
      isPNameVisible: false,
      isPCNameVisible: false,
      isUNameVisible: false,
      dataIndex,
      searchValue: searchText,
      searchContent: searchObject
    });
  };
  //根据筛选条件生成新的数据源
  // getNewData = (recordList, dataIndex, searchText) => {
  //   if (!dataIndex) return recordList;
  //   const reg = new RegExp(searchText);
  //   return recordList.filter(v => {
  //     return reg.test(v[dataIndex])
  //   })
  // }

  getNewData = (delayList,searchObject) => {
    const reg1 = new RegExp(searchObject.PName);
    const reg2 = new RegExp(searchObject.PCName);
    const reg3 = new RegExp(searchObject.UName);
    return delayList.filter(v => {
        return reg1.test(v.ex_project_name) && reg2.test(v.ex_project_charger_name) && reg3.test(v.user_name)
    })
};

  //延期人员查看
  showDetailModal = (itemObj) => {
    this.setState({
      isShowDetailModal: true,
      detailObj: itemObj
    });
  };

  handleOk = e => {
    this.setState({
      isShowDetailModal: false
    });
  };

  handleCancel = e => {
    this.setState({
      isShowDetailModal: false
    });
  };

  //延期人员开始 结束时间选择
  changeDate = ( date,dateString)=>{
    const{dispatch} = this.props;
    dispatch({
      type:"delayWorkstation/saveDate",
      data:dateString
    })
  }

  // // 延期开始时间
  // delayStartDateChange = (data, dataString) => {
  //   this.props.dispatch({ type: "delayWorkstation/saveStartDate", data: dataString })
  // }

  // // 延期到期时间
  // delayEndDateChange = (data, dataString) => {
  //   this.props.dispatch({ type: "delayWorkstation/saveEndDate", data: dataString })
  // }

  // delayStartDateChange = (date,dateString) => {
  //   const {dispatch} = this.props;

  //   if(dateString == undefined || dateString == null || dateString == ''){
  //     message.error("请选择开始时间");
  //     return;
  //   }
  //   this.setState({
  //     startTime: dateString
  //   },()=>{
  //     if(dateString > this.state.endTime){
  //       message.error("开始时间不能大于结束时间");
  //       return;
  //     }
  //     var data = {
  //       arg_begin_time: this.state.startTime,
  //     }
  //     dispatch({
  //       type:'delayWorkstation/saveStartDate',
  //       data,
  //     })
  //   })

  // }

  // delayEndDateChange = (date,dateString) =>{
  //   const {dispatch} = this.props;
  //   if(dateString == undefined || dateString == null || dateString == ''){
  //     message.error("请选择结束时间");
  //     return;
  //   }

  //   this.setState({
  //     endTime: dateString
  //   },()=>{
  //     if(dateString < this.state.startTime){
  //       message.error("结束时间不能小于开始时间");
  //       return;
  //     }
  //     var data = {
  //       arg_end_time: this.state.endTime,
  //     }
  //     dispatch({
  //       type:'delayWorkstation/saveEndDate',
  //       data,
  //     })
  //   })

  // }

  //申请时间
  beginTime = (date, dateString) => {
    if (dateString[0] == "" && dateString[1] == "") {
      this.props.dispatch({
        type: "delayWorkstation/clearApplyDate"
      });
    } else {
      this.props.dispatch({
        type: "delayWorkstation/beginTime",
        data: dateString
      });
    };
  };
  //到期时间
  endTime = (date, dateString) => {
    if (dateString[0] == "" && dateString[1] == "") {
      this.props.dispatch({
        type: "delayWorkstation/clearExpireDate"
      });
    } else {
      this.props.dispatch({
        type: "delayWorkstation/endTime",
        data: dateString
      });
    };
  };




  //延期按钮
  goToSubmit = () => {
    this.props.dispatch({ type: "delayWorkstation/flowSubmit" })
  }

  //填写延期人员申请原因
  saveDelayReason = (e) => {
    this.props.dispatch({ type: "delayWorkstation/saveDelayReason", data: e.target.value })
  }

  //勾选延期人员申请数据
  rowSelect = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({ type: "delayWorkstation/delayRowSelect", data: selectedRows })
  }

  //修改延期人员页码
  changePage = (page) => {
    this.props.dispatch({ type: "delayWorkstation/changePage", data: page })
  }

  //返回至办公资源首页
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/adminApp/compRes/officeResMain',
    }));
  };


  // 延期人员查看表
  getDetailModalHtml() {
    const { detailObj, isShowDetailModal } = this.state;
    if (isShowDetailModal) {
      return (
        <Modal
          title="人员详情表"
          visible={this.state.isShowDetailModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width='720px'
        >
          <div>
            <Row className={styles.rowStyle}>
              <Col span={12}>单位名称：{detailObj.ex_vendor}</Col>
              <Col span={12}>负责人：{detailObj.ex_charger_name}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>负责人电话：{detailObj.ex_charger_tel}</Col>
              <Col span={12}>项目组名称：{detailObj.ex_project_name}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>项目组编号：{detailObj.ex_project_id}</Col>
              <Col span={12}>项目所属部门：{detailObj.ex_project_dept_name}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>项目经理/负责人：{detailObj.ex_project_charger_name}</Col>
              <Col span={12}>项目负责人电话：{detailObj.ex_project_charger_tel}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>性质：{detailObj.prop}</Col>
              <Col span={12}>姓名：{detailObj.user_name}</Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={12}>身份证号：{detailObj.user_id}</Col>
              <Col span={12}>联系电话：{detailObj.tel}</Col>
            </Row>
          </div>
        </Modal>
      );
    } else {
      return "";
    }
  }



  render() {
    const { delayList } = this.props;
    const tableColumns = [
      {
        title: '申请时间',
        dataIndex: 'apply_time',
        width: 100,
      },
      {
        title: '项目组名称',
        dataIndex: 'ex_project_name',
        width: 100,
        render: (text) => {
          return (<div>{text}</div>)
        },
        filterDropdownVisible: this.state.isPNameVisible,
        onFilterDropdownVisibleChange: (visible) => this.explicitimplicitchange("ex_project_name", visible),
        filterDropdown: this.filterDropdown("ex_project_name", "项目组名称"),
        filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
      },

      {
        title: '开始时间',
        dataIndex: 'begin_time',
        width: 100,
      },
      {
        title: '到期时间',
        dataIndex: 'end_time',
        width: 100,
      },
      {
        title: '项目负责人',
        dataIndex: 'ex_project_charger_name',
        width: 100,
        render: (text) => {
          return (<div>{text}</div>)
        },
        filterDropdownVisible: this.state.isPCNameVisible,
        onFilterDropdownVisibleChange: (visible) => this.explicitimplicitchange("ex_project_charger_name", visible),
        filterDropdown: this.filterDropdown("ex_project_charger_name", "项目负责人"),
        filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
      },
      {
        title: '项目负责人电话',
        dataIndex: 'tel',
        width: 100,
      },
      {
        title: '员工姓名',
        dataIndex: 'user_name',
        width: 100,
        render: (text) => {
          return (<div>{text}</div>)
        },
        filterDropdownVisible: this.state.isUNameVisible,
        onFilterDropdownVisibleChange: (visible) => this.explicitimplicitchange("user_name", visible),
        filterDropdown: this.filterDropdown("user_name", "员工姓名"),
        filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
      },
      {
        title: '操作',
        width: 100,
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={this.showDetailModal.bind(this, record)}>查看</a>
          </span>
        )
      },
    ];

    //const delayList = this.getNewData(this.props.delayList, this.state.dataIndex, this.state.searchText)
    const modalHtml = this.getDetailModalHtml();
    const rowSelect = { onChange: this.rowSelect }
    const dataSource = this.getNewData(delayList,this.state.searchContent);
    return (
      <div className={styles.wrapper + ' ' + styles.delayWorkstation}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }} >延期工位</h2>
        <div className={styles.buttonWrapper}>
          <div>
            <span>申请部门：{Cookie.get("deptname")}</span>
          </div>
          <div >
            <Button type="primary" className={styles.buttonAdd} onClick={this.goToSubmit} >延期</Button>
            <Button type="primary" onClick={this.goBack} style={{ float: 'right', marginRight: -19 }}>返回</Button>
          </div>
        </div>

        <div className={styles['date-container']}>
          <div className={styles['delay-count']}>
            <span className={styles['label']}>延期数量：</span>
            <span className={styles['count']}>{this.props.StaffNum}</span>
          </div>
          <div>延期时间：<RangePicker onChange = {this.changeDate}></RangePicker></div>
          {/* <div className={styles['delay-start']}>
            延期开始时间：<DatePicker onChange={this.delayStartDateChange} />
          </div>
          <div className={styles['delay-end']}>
            延期到期时间：<DatePicker onChange={this.delayEndDateChange} />
          </div> */}
        </div>

        <div className={styles['delay-desc']}>
          <div className={styles['label']}>
            延期原因：
             </div>
          <div className={styles['text-area']}>
            <TextArea rows={3} onChange={this.saveDelayReason} />
          </div>
        </div>

        <div className={styles['date-range']}>
          <div className={styles['apply-date']}>
            申请时间查询：<RangePicker onChange={this.beginTime} />
          </div>
          <div className={styles['due-date']}>
            到期时间查询：<RangePicker onChange={this.endTime} />
          </div>
        </div>

        <div className={styles['table-container']}>
          <Table rowSelection={rowSelect} columns={tableColumns} rowKey="detail_id" dataSource={dataSource} className={styles.orderTable} />
        </div>
        {modalHtml}
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    loading: state.loading.models.delayWorkstation,
    ...state.delayWorkstation
  }
}

export default connect(mapStateToProps)(DelayWorkstation);
