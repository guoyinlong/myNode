/**
 * 作者：韩爱爱
 * 日期：2020-11-06
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训备案-首页
 */
import React, { Component }  from  'react'
import {connect} from "dva";
import styles from '../../index.less'
import oStyles from '../../style.less';
import {Button, DatePicker, Pagination, Select, Table, TreeSelect} from "antd";
import {routerRedux} from "dva/router";
import moment from "./trainRecordUpload";
class trainingRecordIndex extends Component {
  constructor(props){
    super(props);
    this.state= {}
  }
  returnModel = (e,record,value2) =>{
    if(e == "handleMaterial"){//上传
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/trainingRecordIndex/trainRecordUpload',
      }));
    }if(e == "emptyDetail"){ //详情
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/trainingRecordIndex/trainRecordDetail',
        query: {
          record:record.trainId
        }
      }));
    }

    if(e!==undefined){
      this.props.dispatch({
        type:'trainingRecordIndex/'+e,
        record : record,
      })
    }else{
      this.props.dispatch({
        type:'trainingRecordIndex/'+e,
      })
    }
  };
  //控制页数传递
  handlePageChange =(page)=>{
    this.props.dispatch ({
      type : "trainingRecordIndex/changePage",
      page : page,
    })
  };
  render() {
    const {crewNname, firmLevel, recordDataSource, loading, pageCurrent, pageDataCount,pageSize } = this.props;
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
        title: "培训时间",
        dataIndex: "trainTime",
        width: "8%",
        render: (text, record, index) => {
          return <div style={{ textAlign: "center" }}>{text}</div>;
        }
      }, {
        title: "人员姓名",
        dataIndex: "personName",
        width: "10%",
        render: (text, record, index) => {
          return <div style={{ textAlign: "left" }}>{text}</div>;
        }
      }, {
        title: "院级/部门/分院级",
        dataIndex: "deptName",
        width: "20%",
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
        width: "10%",
        render: (text, record, index) => {
          return(<div className = {oStyles.editStyle}>
              {record.state === "退回"|| record.state === "草稿"?
                <div>
                  <Button
                    type="primary"
                    onClick={(e)=>this.returnModel('emptyMaterial',e)}
                  >
                    修改
                  </Button>
                  <Button
                    type='primary'
                    style={{marginLeft:'5px'}}
                    onClick={()=>this.handleButton('修改',e, record)}
                  >
                    删除
                  </Button>
                </div>
                :
                <div style={{ textAlign: "left" }}>
                  <Button
                    type="primary"
                    onClick={()=>this.returnModel('emptyDetail',record)}
                  >
                    详情
                  </Button>
                  <Button
                    type="primary"
                    style={{marginLeft:'2px'}}
                    onClick={(e)=>this.returnModel('emptyMaterial',e)}
                  >
                    下载
                  </Button>
                </div>
              }
            </div>
          )
        }
      },
    ];
    return(
      <div className={styles.outerField} >
        <div className={styles.out}>
          <h2 style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'22px'}}>培训备案</h2>
          <div className={styles.searchStyle}>
             <span >
               人员姓名：
                <TreeSelect
                  showSearch
                  value={this.props.channelName}
                  dropdownStyle={{ maxHeight: 500, minHeight: 200, overflow: 'auto' }}
                  style={{width:'165px'}}
                  placeholder="请选择"
                  treeData={this.props.crewNname}
                  treeDefaultExpandAll
                  onChange={(e)=>this.returnModel('nameObjectChange',e)}
                >
              </TreeSelect>
             </span>
            <span style={{marginLeft:'20px'}}>
                院级/部门级/分院级：
                <TreeSelect
                  showSearch
                  value={this.props.checkObject}
                  dropdownStyle={{ maxHeight: 500, minHeight: 200, overflow: 'auto' }}
                  style={{width:'300px'}}
                  placeholder="请选择"
                  treeData={this.props.checkObjectAndContentList}
                  treeDefaultExpandAll
                  onChange={(e)=>this.returnModel('onObjectChange',e)}
                >
              </TreeSelect>
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
            {loading !== true ?
              <div style={{textAlign: 'center', marginTop: '20px'}}>
                <Pagination
                  current={Number(pageCurrent)}
                  total={Number(pageDataCount)}
                  pageSize={Number(pageSize)}
                  onChange={(page) => this.handlePageChange(page)}
                />
              </div>
              :
              null
            }
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.trainingRecordIndex,
    ...state.trainingRecordIndex
  };
}

export default connect(mapStateToProps)(trainingRecordIndex);