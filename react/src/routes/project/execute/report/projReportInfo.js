/**
 * 作者：邓广晖
 * 创建日期：2017-11-06
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：每月每周项目报告信息
 */
import React from 'react';
import {Collapse, Button, Tabs, Table,Spin,Upload} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import styles from './projReport.less';
import Cookie from 'js-cookie';
import config from '../../../../utils/config';
import moment from 'moment';
moment.locale('zh-cn');
const dataFormat = 'YYYY-MM-DD HH:mm:ss';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;


/**
 * 作者：邓广晖
 * 创建日期：2017-11-06
 * 功能：项目报告信息总览
 */
class ProjReportInfo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  weekFromStart = '0';  //第几个周，点击上传时更新这个值

  preFileUrl = '';      //更新文件时，保存前一个文件的相对地址

  state={
    //上传文件
    uploadFile:{
      name: 'filename',
      multiple: false,
      showUploadList: false,
      action: '/filemanage/fileupload',
      data:{
        argappname:'projectFile',
        argtenantid: Cookie.get('tenantid'),
        arguserid:Cookie.get('userid'),
        argyear:new Date().getFullYear(),
        argmonth:new Date().getMonth()+1,
        argday:new Date().getDate()
      },
      onChange:(info)=>{
        const status = info.file.status;
        if (status === 'done') {
          if(info.file.response.RetCode ===  '1'){
            const{dispatch} = this.props;
            dispatch({
              type:'projReportInfo/addWeekReport',
              fileParams:{
                proj_id:this.props.proj_id,                             //项目id
                proj_week:this.weekFromStart,                           //第几个周
                url:info.file.response.filename.AbsolutePath,           //绝对地址
                rel_url:info.file.response.filename.RelativePath,       //相对地址
                file_name:info.file.response.filename.OriginalFileName, //文件名
                creat_time:moment().format(dataFormat),                 //上传时间
              }
            });
            return true;
          }else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            return false;
          }
        }
      }
    },
    //更新文件
    updateFile:{
      name: 'filename',
      multiple: false,
      showUploadList: false,
      action: '/filemanage/fileupload',
      data:{
        argappname:'projectFile',
        argtenantid: Cookie.get('tenantid'),
        arguserid:Cookie.get('userid'),
        argyear:new Date().getFullYear(),
        argmonth:new Date().getMonth()+1,
        argday:new Date().getDate()
      },
      onChange:(info)=>{
        const status = info.file.status;
        if (status === 'done') {
          if(info.file.response.RetCode ===  '1'){
            const{dispatch} = this.props;
            dispatch({
              type:'projReportInfo/updateWeekReport',
              fileParams:{
                update:{
                  url:info.file.response.filename.AbsolutePath,           //绝对地址
                  rel_url:info.file.response.filename.RelativePath,       //相对地址
                  file_name:info.file.response.filename.OriginalFileName, //文件名
                },
                condition:{
                  proj_id:this.props.proj_id,                             //项目id
                  proj_week:this.weekFromStart,                           //第几个周
                }
              },
              preFileUrl:this.preFileUrl,                                 //更新前一个文件的相对地址
            });
            return true;
          }else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            return false;
          }
        }
      }
    },
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-11-07
   * 功能：返回项目报告列表
   */
  goBack = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname: 'projectApp/projExecute/report',
      query: this.props.queryData
    }));
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-11-07
   * 功能：跳转到新增月报页面
   * @param operateType 操作类型，分为  新增（add）  和  查看（view）
   */
  addMonthReport = (operateType) => {
    this.props.dispatch(routerRedux.push({
      pathname: 'projectApp/projExecute/report/projReportAdd',
      query:{
        proj_id: this.props.queryData.proj_id,
        proj_name: this.props.queryData.proj_name,
        begin_time: this.props.queryData.begin_time,
        end_time: this.props.queryData.end_time,
        proj_code:this.props.queryData.proj_code,
        mgr_name:this.props.queryData.mgr_name,
        replace_money:this.props.queryData.replace_money,
        actualYear:this.props.yearPaneIndex,
        actualMonth:this.props.monthTabIndex,
        monthFromProjStart:this.props.monthFromProjStart,
        monthStartTime:this.props.monthStartTime,
        monthEndTime:this.props.monthEndTime,
        operateType:operateType
      }
    }));
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-11-09
   * 功能：折叠面板切换
   * @param key 面板的索引key
   */
  switchPane = (key) => {
    if (key !== undefined) {
      this.props.dispatch({
        type: 'projReportInfo/switchPane',
        yearIndex: key
      });
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-11-09
   * 功能：tab切换
   * @param key tab的索引
   */
  switchTab = (key) => {
    this.props.dispatch({
      type: 'projReportInfo/switchMonthTabTable',
      monthIndex: key
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-12-07
   * 功能：点击上传时，更新当前是第几个周次
   * @param row 表格一条数据
   */
  setWeeks = (row) => {
    this.weekFromStart = row.weekFromStart.toString();
    //如果存在文件的相对地址，说明有文件
    if('relativePath' in row){
      this.preFileUrl = row.relativePath
    }
  };

  colomns = [
    {
      title: '周次',
      dataIndex: '',
      width: '7%',
      render: (value, row) => {
        return '第' + (row.week).toString() + '周'
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: '12%',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: '12%',
    },
    {
      title: '创建时间',
      dataIndex: 'creat_time',
      width: '14%',
    },
    {
      title: '状态',
      dataIndex: 'state_show',
      width: '10%',
      render:(value,row) =>{
        if(row.state === '1'){
          return value;
        }else{
          return <div style={{color:'red'}}>{value}</div>
        }
      }
    },
    {
      title: '操作',
      dataIndex: '',
      width: '30%',
      render: (value,row) => {
        if(row.state === '1'){
          return (
            <div>
              <p style={{lineHeight:'17px'}}>{row.fileName}</p><br/>
              {this.props.isSelfProj?
                <Upload {...this.state.updateFile}>
                  <a onClick={() => this.setWeeks(row)}>更新</a>
                </Upload>
                :
                <span style={{color:'gray'}}>更新</span>
              }
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a href={row.relativePath}>下载</a>
            </div>
          )
        }else{
          return (this.props.isSelfProj?
              <Upload {...this.state.uploadFile}>
                <a onClick={() => this.setWeeks(row)}>上传</a>
              </Upload>
            :
              <span style={{color:'gray'}}>上传</span>
          )
        }
      }
    }
  ];

  render() {
    let panelList = [];
    for (let j = 0; j < this.props.collapsePanelList.length; j++) {
      let tabPaneList = [];
      for (let i = parseInt(this.props.oneYearMonthStart); i <= parseInt(this.props.oneYearMonthEnd); i++) {
        let tabPaneName = (i).toString() + '月';
        tabPaneList.push(
          <TabPane tab={tabPaneName} key={i}>
            {this.props.addReportVisible === true?
              <div>
                <div style={{float:'left',marginTop:10}}>
                  {this.props.monthHaveReport?
                    <span>月报已提交({this.props.monthStartTime + '~' + this.props.monthEndTime})</span>
                    :
                    <span style={{color:'red'}}>月报待提交({this.props.monthStartTime + '~' + this.props.monthEndTime})</span>
                  }
                </div>
                <div className={styles.addReport}>
                  {this.props.isSelfProj?
                    <div>
                      {this.props.monthHaveReport?
                        <Button type='primary' onClick={()=>this.addMonthReport('view')}>查看月报</Button>
                        :
                        <div>
                          {/*已经过了项目结束时间时，可添加  或者  当月以前的可新增，当月项目还结束时，不可新增*/}
                          {this.props.canAddReport?
                            <Button type='primary' onClick={()=>this.addMonthReport('add')}>新增月报</Button>
                            :
                            <Button type='primary' disabled={true}>新增月报</Button>
                          }
                        </div>

                      }
                    </div>

                    :
                    <div>
                      {this.props.monthHaveReport?
                        <Button type='primary' onClick={()=>this.addMonthReport('view')}>查看月报</Button>
                        :
                        <Button type='primary' disabled={true}>查看月报</Button>
                      }
                    </div>

                  }
                </div>
              </div>
              :
              null
            }
            <Table dataSource={this.props.dateTableList}
                   columns={this.colomns}
                   pagination={false}
                   bordered={true}
                   className={styles.reportInfoTable}
            />
          </TabPane>
        );
      }
      panelList.push(
        <Panel
          header={this.props.collapsePanelList[j] + '年'}
          key={this.props.collapsePanelList[j]}
          className={styles.panelStyle}>
          <Tabs type="card" onTabClick={this.switchTab} activeKey={this.props.monthTabIndex}>
            {tabPaneList}
          </Tabs>
        </Panel>
      );
    }

    return (
      <Spin tip={config.IS_LOADING} spinning={this.props.tableDataLoadSpin}>
        <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
          <div className={styles.headTitleName}>{this.props.proj_name}</div>
          <div className={styles.headTime}>
            <span>项目开始时间：{this.props.begin_time}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>项目结束时间：{this.props.end_time}</span>
          </div>
          <div style={{textAlign:'right',marginBottom:5}}>
            <Button type='primary' onClick={this.goBack}>返回</Button>
          </div>
          {this.props.collapsePanelList.length?
            <Collapse defaultActiveKey={this.props.collapsePanelList[0]}
                      accordion
                      onChange={this.switchPane}>
              {panelList}
            </Collapse>
            :
            null
          }
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.projReportInfo,
    ...state.projReportInfo
  }
}

export default connect(mapStateToProps)(ProjReportInfo);
