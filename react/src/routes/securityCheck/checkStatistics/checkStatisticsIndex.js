/**
 * 作者：郭银龙 
 * 日期：2020-5-18
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：统计报告首页
 */ 
import React from 'react'; 
import {connect } from 'dva';
import {Table, Modal, Input, Button, DatePicker, Row, Col, Select, TreeSelect, Radio, message,Pagination} from 'antd';
const { Search } = Input;
import styles from './style.less';
import { routerRedux } from 'dva/router';
connect(() => ({})) 
class checkStatisticsIndex extends React.Component {
  state={
    inputvalue:"",
  } 
  onInputValue=e=>{
    this.setState({
      inputvalue:e.target.value
      
    })
    // console.log(e,this.state.inputvalue)
    this.props.dispatch({
      type: "checkStatisticsIndex/reportNews",
        argCondition:this.state.inputvalue,
      })
  }
  onPressEnter=()=>{
    this.props.dispatch({
      type: "checkStatisticsIndex/reportNews",
        argCondition:this.state.inputvalue,
      })
  }
  
   //点击新建
    newReport = () => {
      
      this.props.dispatch(routerRedux.push({
        pathname:"/adminApp/securityCheck/checkStatistics/createReport",
      }));
  
    }; 
    //查看详情
    reportInFor=(e)=>{
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/securityCheck/checkStatistics/createdReportInfor', 
        query: {
          argNotificationId:JSON.parse(JSON.stringify(e.statisticsId)),
          statisticsStatus:JSON.parse(JSON.stringify(e.statisticsStatus)),
     
        }
      }));
    }
    changePage = (page) => {
       //分页
      //  console.log(page)
      this.props.dispatch({
        type: "checkStatisticsIndex/reportNews", page})
    }

   
    render() {
        const columns = [
            {  
                title: "序号",
                key:(text,record,index)=>`${index+1}`,
                render:(text,record,index)=>`${index+1}`,
            },
            {  
                title: "报告名称",
                dataIndex: "statisticsName",
                key: "statisticsName",
               
            },
            {
                title: "报告类型",
                dataIndex: "setType",
                key: "setType",
               
            },
            {
                title: "状态",
                dataIndex: "statisticsStatus",
                key: "statisticsStatus",
               
            },
            {
                title: "不合格",
                dataIndex: "failUnm",
                key: "failUnm",
               
            },
            {
                title: "操作",
                dataIndex: "operation",
                key: "operation",
                render: (text,e) => {
                    return (
                        <div className = {styles.editStyle}>
                            <a onClick = {() => this.reportInFor(e)}>详情</a>&nbsp;&nbsp;
                           
                        </div>
                    );
                }
            }
        ];
     
        return (
         
            <div style={{backgroundColor:"#fff"}} >
                 <h2 style = {{textAlign: 'center',marginBottom:"40px"}}>年度/半年度安全检查数据统计</h2>
               <div>
               <div style = {{overflow:"hidden",margin:"20px"}}>
                                        <div>
                                                <Search
                                                   
                                                    placeholder="任务名称"
                                                    onSearch={this.onPressEnter}
                                                    style={{ width: 300,marginBottom:20}}
                                                    onChange ={this.onInputValue }
                                                    // onPressEnter={this.onPressEnter}
                                                    />
                                                      <div style = {{float:"right"}}>
                                                        {
                                                        this.props.roleType=="1"||this.props.roleType=="2"?
                                                        <Button type = "primary" className = {styles.btn} onClick = {this.newReport}>新建报告</Button>
                                                        :""
                                                        }
                                                            
                                                        </div>
                                        </div>
                                      


                                     
                                        <div>
                                        <Table 
                                            key = {this.props!=""?this.props.key:""}
                                            // rowSelection = {this.rowSelection()}
                                            columns = {columns}
                                            className = {styles.orderTable}
                                            dataSource = {this.props!=""?this.props.reportList:""}
                                            // loading = {this.props.loading}
                                            pagination={false}
                                        />
                                        <Pagination
                                          current = {this.props.pageCount   !=""?this.props.pageCount:1}
                                          pageSize = {10}
                                          total = {this.props.allCount!=""?this.props.allCount:1}
                                          onChange = {this.changePage}
                                          style = {{textAlign: 'center', marginTop: '20px'}}
                                          />
                                        </div>
                                    
                        </div>
               </div>


            </div>
        );
    }
}

// export default checkStatisticsIndex;
function mapStateToProps (state) {

  return {
    loading: state.loading.models.checkStatisticsIndex,
    ...state.checkStatisticsIndex
  };
}
export default connect(mapStateToProps)(checkStatisticsIndex);