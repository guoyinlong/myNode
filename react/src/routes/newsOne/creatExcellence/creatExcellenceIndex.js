/**
 * 作者：窦阳春
 * 日期：2020-10-13 
 * 邮箱：douyc@itnova.com.cn
 * 功能：争优创先首页
 */
import React, { Component } from 'react'
import {connect } from 'dva';
import { Tabs, Table, Pagination, DatePicker, Input, Spin, Select, Modal, Button, Popconfirm, Icon } from 'antd';
const { TabPane } = Tabs;
const confirm = Modal.confirm;
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const {Option} = Select;    
import PicShow from './picShow.js' 
import styles from '../../newsOne/style.less'
import { routerRedux } from 'dva/router';
import style from 'material-ui/svg-icons/image/style';

class creatExcellence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      defaultKey: '1'
    }
  }
  callback =(key) => {
    key == 2 ?
    this.props.dispatch({
      type: 'creatExcellence/queryNewsReportLike'
    })
    : null
  }
  saveChange = (flag, value, time) => {
    this.props.dispatch({
      type: 'creatExcellence/saveValue',
      flag,
      value,
      time
    })
  }
  serch = () => {
    this.props.dispatch({
      type: 'creatExcellence/serch',
      yearCheck: this.props.yearCheck
    })
  }
  showConfirm = () => {
    let that = this
    confirm({
      title: '确定生成统计报告?',
      content: '',
      onOk() {
        that.props.dispatch({
          type: 'creatExcellence/tocreatExcellence'
        })
      }
    });
  }
  getYearData = () => {
    var myDate = new Date();       
    var thisYear = myDate.getFullYear();  // 获取当年年份
    var Section = thisYear - 2019;  // 声明一个变量 获得当前年份至想获取年份差 
    var arrYear = []; // 声明一个空数组 把遍历出的年份添加到数组里
    for(var i = 0;i<=Section;i++){
        arrYear.push(thisYear--)
    }
    return arrYear
  }
	handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (record) => {
    var image = !record.image ? record.uploadImage[0].response.filename : JSON.parse(record.image) 
    this.setState({
      previewImage: image.RelativePath,
      previewVisible: true,
    });
  }
  unitColumns = [
    {
      key: 'key',
      dataIndex: 'key',
      title: '序号'
    },
    {
      key: 'image',
      dataIndex: 'image',
      title: '人员/单位照片',
      render : ( text, record )=>{
        let fileData = !record.image ? [] : [JSON.parse(record.image)]
        return (
          <div id={styles.picShow}>
            {/* {
              record.image == "null" ? '' :
              <img src= {JSON.parse(record.image).RelativePath} style={{width: 40, height: 30, cursor: "pointer"}} onMouseOver={()=>this.mouseOver()} onClick={()=>this.handlePreview(JSON.parse(record.image))}></img>
            } */}
            {
              !record.image ? 
              // <div className={styles.picIcon} style={{width: '100%', textAlign: 'center'}}><Icon type="upload" /></div> 
              ''
              :<a href={JSON.parse(record.image).RelativePath}>
                <span className={styles.picIcon}><Icon type="download" /></span>
              </a>
            }
            <PicShow 
              fileList = {fileData} 
              uploadImage = {record.uploadImage} 
              id={record.id} flag={!record.image ? 0 : 1} 
              dispatch={this.props.dispatch} 
              advancedUnitType = {record.advancedUnitType}
              handlePreview = {()=>this.handlePreview(record)}/>
          </div>
        )
      }
    },
    {
      key: 'deptName',
      dataIndex: 'deptName',
      title: '奖项单位/姓名'
    },
    {
      key: 'deed',
      dataIndex: 'deed',
      title: '事迹介绍或评语'
    },
  ]
  reportColumns = [
    {
      key: 'key',
      dataIndex: 'key',
      title: '序号'
    },
    {
      key: 'reportName',
      dataIndex: 'reportName',
      title: '报告名称'
    },
    {
      key: 'createUserDeptName',
      dataIndex: 'createUserDeptName',
      title: '单位名称'
    },
    {
      key: 'createUserName',
      dataIndex: 'createUserName',
      title: '提交人'
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '提交时间'
    },
    {
      key: 'state',
      dataIndex: 'state',
      title: '状态'
    },
    {
      key: '',
      dataIndex: '',
      title: '操作',
      render: (text, record)=> {
        return (
          record.state == '草稿' || record.state == '退回' ?
          <span>
            <Button type='primary' size="small" onClick={(e)=> this.details(record, e)}>修改</Button> &nbsp;
            <Popconfirm onConfirm={(e)=>this.deleteNewsReport(record.id, e)} title="确定删除这条报告？">
              <Button onClick={(e)=>this.deleteNewsReport(record.id, e, 'deleBtn')} type='primary' size="small">删除</Button>
            </Popconfirm>
          </span>
          :<Button type='primary' size="small" onClick={(e)=> this.details(record, e)}>详情</Button>
        )
      }
    },
  ];
  details = (record, e) => {
    e ? e.stopPropagation() : null;
    let path = record.state == '草稿' || record.state == '退回'  ? 'newsReportModify' : 'newsReportDetail'
		this.props.dispatch(routerRedux.push({
			pathname: '/adminApp/newsOne/creatExcellence/' + path,
			query:  {
				record: JSON.stringify(record)
			}
		}))
  }
  deleteNewsReport = (id, e, btn) => {
    e.stopPropagation()
    btn == 'deleBtn' ? null :
    this.props.dispatch({
      type: 'creatExcellence/deleteNewsReport', id
    }) 
  }
  changePage = (page) => { //分页
    this.props.dispatch({
      type: 'creatExcellence/changePage',
      page
    })
  } 
  onLoadMore = (flag) => {
    this.props.dispatch({
      type: 'creatExcellence/loadMore', flag
    })
  }
  action = (flag) => {
    if(flag == 'add') {
      this.props.dispatch(routerRedux.push({
        pathname: '/adminApp/newsOne/creatExcellence/newsReportAdd'
      }))
    }
    let path = flag == 'query' ? 'queryNewsReportLike' : flag == 'empty' ? 'action' : 'query'
    this.props.dispatch({
      type: 'creatExcellence/' + path, flag
    })
  }
  goTodvancedUpload = (flag, defaultYear) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/newsOne/creatExcellence/advancedUpload', query: {flag, year: defaultYear}
    }))
  }
  //个人/组织个上传
  goEachUpload = (flag,yearCheck) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/newsOne/creatExcellence/eachUpload',
      query: {flag, year: yearCheck}
    }))
  }
  componentWillMount() {
    var data = isNaN(Number(location.href.substr(-1))) == true ? '1' : location.href.substr(-1);
    this.setState({defaultKey: data});
    data == '2' ? this.props.dispatch({
      type: 'creatExcellence/queryNewsReportLike'
    }) : null
  }
  render() {
    const {defaultYear, yearCheck, newsPublicityAdvancedUnitsList, newsPublicityAdvancedCollectivityList, newsReportData,
    goodNewsPublicityOrganizerList, goodNewsAdvancedPersonalList, organizerCount, personCount, unitCount, collectCount, newsReportCount,
    pageCurrent, reportName, pickTime} = this.props;
    let yearList = this.getYearData().map((item, i) => {
      return <Option key={i} value={item+''}>{item}</Option>
    })
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
         <div>
         <Tabs defaultActiveKey = {this.state.defaultKey} onChange={this.callback}>
          <TabPane tab="评优结果" key="1">
            <h2 style = {{textAlign:'center',marginBottom: 10}}>{defaultYear}年宣传评优结果展示</h2>
            年份：
            <Select value={yearCheck} style={{ minWidth: '8%' }}  onChange={(value)=>this.saveChange('yearCheck',value)}>
             {yearList}
           </Select> &nbsp;
           <Button style = {{margin: '0px 10px'}} size="default" type="primary" onClick={this.serch}>查询</Button>
           <div className={styles.resultList}>
             <h2 className={styles.resultListH2}>一、{defaultYear}年度软件研究院新闻宣传先进单位（{unitCount}个)</h2>
             <Button type='primary' size='small' onClick={()=>this.goTodvancedUpload('u', yearCheck)} style={{float: 'right', margin: 20}}>上传</Button>
           </div>
           <div> 
             <Table className={styles.tableCreatExcellence}
             columns = {this.unitColumns}
             dataSource = {newsPublicityAdvancedUnitsList}
             pagination = {false}
             />
             <div style={{display: newsPublicityAdvancedUnitsList.length==3?'block': 'none'}}>
               <Button onClick={()=>this.onLoadMore('unit')} className={styles.btnLoaingMore}>加载更多...</Button>
             </div>
           </div>
           <div className={styles.resultList}>
             <h2 className={styles.resultListH2}>二、{defaultYear}年度软件研究院新闻宣传先进集体（{collectCount}个）</h2>
             <Button type='primary' size='small' onClick={()=>this.goTodvancedUpload('c', yearCheck) } style={{float: 'right', margin: 20}}>上传</Button>
           </div>
           <div>
            <Table className={styles.tableCreatExcellence}
            columns = {this.unitColumns}
            dataSource = {newsPublicityAdvancedCollectivityList}
            pagination = {false}
            />
            <div style={{display: newsPublicityAdvancedCollectivityList.length==3?'block': 'none'}}>
              <Button onClick={()=>this.onLoadMore('collect')} className={styles.btnLoaingMore}>加载更多...</Button>
            </div>
            </div>
           <div className={styles.resultList}>
             <h2 className={styles.resultListH2}>三、{defaultYear}年度软件研究院优秀新闻宣传组织者（{organizerCount}个）</h2>
             <Button type='primary' size='small' onClick={()=>this.goEachUpload('o', yearCheck) }  style={{float: 'right', margin: 20}}>上传</Button>
           </div>
           <div>
             <Table className={styles.tableCreatExcellence}
             columns = {this.unitColumns}
             dataSource = {goodNewsPublicityOrganizerList}
             pagination = {false}
             />
             <div style={{display: goodNewsPublicityOrganizerList.length==3?'block': 'none'}}>
               <Button onClick={()=>this.onLoadMore('organizer')} className={styles.btnLoaingMore}>加载更多...</Button>
             </div>
           </div>
           <div className={styles.resultList}>
             <h2 className={styles.resultListH2}>四、{defaultYear}年度软件研究院优秀新闻先进个人（{personCount}个）</h2>
             <Button type='primary' size='small'  onClick={()=>this.goEachUpload('p', yearCheck) } style={{float: 'right', margin: 20}}>上传</Button>
           </div>
           <div>
             <Table className={styles.tableCreatExcellence}
             columns = {this.unitColumns}
             dataSource = {goodNewsAdvancedPersonalList}
             pagination = {false}
             />
             <div style={{display: goodNewsAdvancedPersonalList.length==5?'block': 'none'}}>
               <Button onClick={()=>this.onLoadMore('person')} className={styles.btnLoaingMore}>加载更多...</Button>
             </div>
           </div>
          </TabPane>
          <TabPane tab="新闻工作报告" key="2">
            <div>
            报告名称：<Input value={reportName} style={{width: 300}} onChange={(e)=>this.saveChange('reportName', e.target.value)}/> &nbsp;
            时间：
              <DatePicker 
                value={pickTime == '' ? null : moment(pickTime)}
                format={dateFormat}
                style={{ width: "20%" }}
                onChange={(value, dateString)=>this.saveChange(value, dateString, 'time')}/> &nbsp;
                <span className={styles.rightBtn}>
                  <Button onClick={()=>this.action('query')} type='primary' size='default' style={{marginRight: 5}}>查询</Button>
                  <Button onClick={()=>this.action('empty')} type='primary' size='default' style={{marginRight: 5}}>清空</Button>
                  <Button onClick={()=>this.action('add')} type='primary' size='default'>增加</Button>
                </span>
            </div>
            <div className={styles.newsReportTab}>
              <Table style={{marginTop: 10}}
              className = {styles.orderTable}
              dataSource = {newsReportData}
              columns = {this.reportColumns}
              onRowClick = {(record)=> this.details(record)}
              pagination = {false}
              />
            </div>
            <Pagination defaultCurrent={1} total={newsReportCount} pageCurrent = {pageCurrent} 
            onChange = {this.changePage} style={{textAlign: 'center', marginTop: 10}}/> 
          </TabPane>
        </Tabs>
         </div>
        </div>
     </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.creatExcellence, 
    ...state.creatExcellence
  };
}

export default connect(mapStateToProps)(creatExcellence);
