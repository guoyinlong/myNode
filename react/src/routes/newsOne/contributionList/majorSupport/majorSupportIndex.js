/**
 * 作者：韩爱爱
 * 日期：2020-11-09
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单-重大活动支撑首页
 */
import React, { Component }  from  'react'
import {connect} from "dva";
import styles from "../../index.less";
import {Button, DatePicker, Input, Pagination, Table} from "antd";
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
class majorSupportIndex  extends Component{
  constructor(props){
    super(props);
    this.state= {}
  }
  returnModel = (value,value1,value2) =>{
    if(value!==undefined){
      this.props.dispatch({
        type:'majorSupportIndex/'+value,
        record : value1,
        text:value2,
      })
    }else{
      this.props.dispatch({
        type:'majorSupportIndex/'+value,
      })
    }
  };
  changeDate = (date,dateString) => {
    this.props.dispatch({
      type:'majorSupportIndex/changeDate',
      startTime: dateString,
    })
  };
  //控制页数传递
  handlePageChange =(page)=>{
    this.props.dispatch ({
      type : "majorSupportIndex/changePage",
      page : page,
    })
  };
  render() {
    const  recordColumns =  [
      {
        title: "序号",
        dataIndex: "",
        width: "3%",
        render: (text, record, index) => {
          return index + 1;
        }
      }, {
        title: "活动名称",
        dataIndex: "activityName",
        width: "8%",
        render: (text, record, index) => {
          return <div style={{ textAlign: "left" }}>{text}</div>;
        }
      }, {
        title: "活动时间",
        dataIndex: "activityTime",
        width: "8%",
        render: (text, record, index) => {
          return <div style={{ textAlign: "center" }}>{text}</div>;
        }
      }, {
        title: "担任的任务",
        dataIndex: "job",
        width: "12%",
        render: (text, record, index) => {
          return <div style={{ textAlign: "left" }}>{text}</div>;
        }
      },{
      title: "状态",
      dataIndex: "state",
      width: "8%",
      render: (text, record, index) => {
      return <div style={{ textAlign: "left" }}>{text}</div>;
       }
      },{
        title: "操作",
        dataIndex: "button",
        width: "12%",
        render: (text, record, index) => {
          return(
            <div style={{ textAlign: "left" }}>
              <Button
                type="primary"
                onClick={(e)=>this.returnModel('emptyDetail',e, record)}
              >
                详情
              </Button>
              { record.state == "草稿"||record.state=="退回" ?
                <span>
                  <Button
                    type="primary"
                    onClick={(e)=>this.returnModel('modifyDetail',e, record)}
                    style={{marginLeft:'2px'}}
                  >
                    修改
                  </Button>
                  <Button
                    type="primary"
                    style={{marginLeft:'2px'}}
                    onClick={(e)=>this.returnModel('deleteDetail',e, record)}
                  >
                    删除
                  </Button>
                </span>
              :
                <span>
                  {
                    record.state == "审核通过"?
                      <Button
                        type="primary"
                        style={{marginLeft:'2px'}}
                        onClick={(e)=>this.returnModel('downloadMaterial',e,record)}
                      >
                        下载
                      </Button>
                      :
                      null
                  }
                </span>
              }
            </div>
          )
        }
      },
    ];
    const {pageCurrent, pageDataCount, pageSize, recordDataSource, loading } =this.props;
    return(
      <div className={styles.outerField} >
        <div className={styles.out}>
          <h2 style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'22px'}}>重大活动支撑</h2>
          <div className={styles.searchStyle}>
              <span>
               活动名称:
               <Input style={{width:'170px',marginLeft:'10px',resize:"none"}} value={this.props.mobileName} onChange={(e) =>this.returnModel("mobileVlaue",e)}/>
              </span>
            <span style={{marginLeft:'30px'}}>
               活动时间:
               <DatePicker
                 style={{width:'170px',marginLeft:'10px',}}
                 showTime={{ defaultValue: moment('YYYY/MM/DD') }}
                 placeholder="培训时间"
                 format="YYYY-MM-DD"
                 allowClear={false}
                 value={this.props.cobileTime == '' ? null :moment(this.props.cobileTime, dateFormat)}
                 onChange = {this.changeDate}
               />
            </span>
            <Button
              type="primary"
              style={{float:'right',marginLeft:'10px'}}
              onClick={(e)=>this.returnModel('handleMaterial',e)}
            >
              上传
            </Button>
            <Button
              type="primary"
              style={{float:'right'}}
              onClick={(e)=>this.returnModel('emptyMaterial',e)}
            >
              清空
            </Button>
            <Button
              type="primary"
              style={{float:'right',marginRight:'10px'}}
              onClick={(e)=>this.returnModel('inquiryMaterial',e)}
            >
              查询
            </Button>
          </div>
          <div className={styles.tableDiv}>
            <Table
              className = { styles.tableStyle }
              dataSource = { recordDataSource }
              columns = {recordColumns}
              style = {{ marginTop: "20px" }}
              bordered={true}
              pagination={ false }
            />
            <div style={{textAlign: 'center', marginTop: '20px'}}>
              {loading !== true ?
              <div style={{textAlign: 'center', marginTop: '20px'}}>
                <Pagination
                  current = {Number(pageCurrent)}
                  total = {Number(pageDataCount)}
                  pageSize = {pageSize}
                  onChange = {(page) => this.handlePageChange(page)}
                />
              </div>
              :
              null
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.majorSupportIndex,
    ...state.majorSupportIndex
  };
}

export default connect(mapStateToProps)(majorSupportIndex);