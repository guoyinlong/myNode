/**
 * 作者：韩爱爱
 * 日期：2020-11-18
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训申请-首页
 */
import React, { Component }  from  'react'
import {connect} from "dva";
import styles from '../../index.less'
import {Button, DatePicker, Input, Pagination, Select, Table, TreeSelect} from "antd";
import {routerRedux} from "dva/router";
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
class trainAppIndex extends Component {
  constructor(props){
    super(props);
    this.state= {}
  }
  returnModel = (e,record) =>{
    if(e == "handleMaterial"){//填报
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/trainAppIndex/trainAppWrite',
      }));
    }
    if(e == "emptyDetail"){ //详情
      let str = record.material == undefined ?false:true
      if(str != false){
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/trainAppIndex/trainAppDetail',
          query:{
            record:record.id,
            name:'上传'
          }
        }));
      }else {
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/trainAppIndex/trainAppDetail',
          query:{
            record:record.id
          }
        }));
      }
    } 
    if(e == "updateData"){//修改
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/trainAppIndex/trainAppModify',
        query: {
          record:JSON.stringify(record.id)
        }
      }));
      
    }
    if(record!==undefined){
      this.props.dispatch({
        type:'trainAppIndex/'+e,
        record : record,
      })
    }else{
      this.props.dispatch({
        type:'trainAppIndex/'+e,
      })
    }
  };
  changeDate = (date,dateString) => {
    this.props.dispatch({
      type: 'trainAppIndex/changeDate',
      startTime: dateString,
    })
  };
  //分页
  handlePageChange =(page)=>{
    this.props.dispatch ({
      type : "trainAppIndex/handlePageChange",
      page : page,
    })
  };
  render() {
    const  recordColumns =  [
      {
        title: "序号",
        dataIndex: "key",
        width: "3%",

        render: (text, record, index) => {
          return index + 1;
        }
      }, {
        title: "培训名称",
        dataIndex: "trainName",
        width: "10%",

        render: (text, record, index) => {
          return <div style={{ textAlign: "left" }}>{text}</div>;
        }
      }, {
        title: "申请时间",
        dataIndex: "trainTime",
        width: "8%",
        render: (text, record, index) => {
          return <div style={{ textAlign: "center" }}>{text}</div>;
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
        width: "10%",
        render: (text, record, index) => {
          return(<div style={{ textAlign: "left" }}>
              <Button
                type="primary"
                onClick={()=>this.returnModel('emptyDetail',record)}
                style={{marginLeft:'2px'}}
              >
                详情
              </Button>
              {record.state === "退回"|| record.state === "草稿"?
                <span style={{ textAlign: "left" }}>
                  <Button
                    type="primary"
                    onClick={()=>this.returnModel('updateData',record)}
                    style={{marginLeft:'2px'}}
                  >
                    修改
                  </Button>
                  <Button
                    type='primary'
                    style={{marginLeft:'2px'}}
                    onClick={()=>this.returnModel('deletData', record)}
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
                        onClick={(e)=>this.returnModel('emptyDownload',record)}
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
    return(
      <div className={styles.outerField} >
        <div className={styles.out}>
          <h2 style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'22px'}}>培训申请</h2>
          <div className={styles.searchStyle}>
             <span>
               名称：
               <Input value={this.props.appNmae}
                      style={{width:'165px'}}
                      onChange={(e) =>this.returnModel("otherVlaue",e)}
               />
             </span>
            <span style={{marginLeft:'30px'}}>
              时间：
              <DatePicker
                // showTime={{ defaultValue: moment('YYYY/MM/DD') }}
                onChange = {this.changeDate}
                format="YYYY-MM-DD"
                style = {{width:200, marginRight:10}}
                allowClear={false}
                value={this.props.cultiTime == '' ? null : moment(this.props.cultiTime, dateFormat)}
              />
             </span>
            <Button
              type="primary"
              style={{float:'right',marginLeft:'10px'}}
              onClick={(e)=>this.returnModel('handleMaterial',e)}
            >
              新增
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
              dataSource = { this.props.recordDataSource }
              columns = {recordColumns}
              style = {{ marginTop: "20px" }}
              bordered={true}
              pagination={ {
                current:Number(this.props.pageCurrent),
                total:Number(this.props.pageDataCount),
                pageSize:Number(10),
                onChange:(page) => this.handlePageChange(page)
              } }
            />
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.trainAppIndex,
    ...state.trainAppIndex
  };
}

export default connect(mapStateToProps)(trainAppIndex);