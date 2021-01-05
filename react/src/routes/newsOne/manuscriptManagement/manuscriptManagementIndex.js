/**
 * 作者：郭银龙
 * 日期：2020-9-28
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：稿件管理
 */ 
import React from 'react'; 
import {connect } from 'dva';
import {Table, Input, Button, DatePicker, Select, Popconfirm, message,Pagination} from 'antd';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
class manuscriptManagement extends React.Component {
  state={
    inputvalue1:"",
    inputvalue2:"",
    inputvalue3:"",
    inputvalue4:"",
    time:"",
  } 
  //监听 稿件名称
  onInputValue1=e=>{
    this.setState({
      inputvalue1:e.target.value
    })
  }
    //监听申请时间
    onTime=(date, dateString)=>{
      this.setState({
          time:dateString
          
        })
  }
  //监听状态
  handleChange=(select)=>{
       this.setState({
      inputvalue2:select
    })
  }
  //监听单位
  onInputValue3=(e)=>{
       this.setState({
      inputvalue3:e.target.value
    })
  }
  //监听提交人
  onInputValue4=(e)=>{
       this.setState({
      inputvalue4:e.target.value
    })
  }
    //清空
    empty=()=>{
        this.setState({
            inputvalue1:"",
            inputvalue2:"", 
            inputvalue3:"",
            inputvalue4:"",
            time:""
        })
        this.props.dispatch({
          type: "manuscriptManagement/reportNews",
          })
    }
     //搜索
     sousuo=()=>{
       const{inputvalue1,time,inputvalue2,inputvalue3,inputvalue4}=this.state
       this.props.dispatch({
      type: "manuscriptManagement/reportNews",
      inputvalue1:inputvalue1,
      time:time,
      inputvalue2:inputvalue2,
      inputvalue3:inputvalue3,
      inputvalue4:inputvalue4,
      })
    }
    //新增
    newAdd=()=>{
        this.props.dispatch(routerRedux.push({
            pathname:this.props.location.pathname+'/setNewManuscript', 
          }));
    }
    //查看详情
    manuscriptInFor=(e)=>{
      this.props.dispatch(routerRedux.push({
        pathname:this.props.location.pathname+'/manuscriptDetails', 
        query: {
          newsId:JSON.parse(JSON.stringify(e.newsId)),
        }
      }));
    }
     //修改
     manuscriptSet=(e)=>{
      this.props.dispatch(routerRedux.push({
        pathname:this.props.location.pathname+'/manuscriptRevision', 
        query: {
          newsId:JSON.parse(JSON.stringify(e.newsId)),
        }
      }));
    }
    confirm=(e)=> {
      this.props.dispatch({
          type: "manuscriptManagement/delete", 
          id:e.id
      })
    }
    
     cancel=(e)=> {
      message.error('删除失败');
    }
       //分页
    changePage = (page) => {
      this.props.dispatch({
        type: "manuscriptManagement/reportNews", page})
    }

   
    render() {
        const columns = [
            {  
                title: "序号",
                key:(text,record,index)=>`${index+1}`,
                render:(text,record,index)=>`${index+1}`,
            },
            {  
                title: "稿件名称",
                dataIndex: "newsName",
                key: "newsName",
               
            },
            {
                title: "申请时间",
                dataIndex: "createTime",
                key: "createTime",
                // render : ( text )=>{
                //   return (
                //     <div>{ (text).substring(0,10) }</div>
                //   )
                // }
            },
            {
                title: "发布渠道",
                dataIndex: "pubChannels",
                key: "pubChannels",
               
            },
            {
                title: "状态",
                dataIndex: "state",
                key: "state",
               
            },
            {
                title: "操作",
                dataIndex: "operation",
                key: "operation",
                render: (text,e) => {
                    return (
                        <div className = {styles.editStyle}>
                            <Button size="default" type="primary"  onClick = {() => this.manuscriptInFor(e)}  style= {{marginRight: "10px"}}>详情</Button>
                            {e.state=="草稿"||e.state=="退回"?
                             <Button size="default" type="primary"  onClick = {() => this.manuscriptSet(e)} style= {{marginRight: "10px"}}>修改</Button>
                            :""}
                            {e.state=="草稿"||e.state=="退回"?
                            <Button size="default" type="primary"   style= {{marginRight: "10px"}}>
                             <Popconfirm
                                title="是否确认删除?"
                                onConfirm={() => this.confirm(e)}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a href="#">删除</a>
                            </Popconfirm>
                        </Button>
                        :""}
                           
                        </div>
                    );
                }
            }
        ];
        return (
         
            <div style={{backgroundColor:"#fff"}} >
               <span style={{display:'inline-flex',height: "20px",margin:"10px"}}>
                  <span className={styles.bgAnnouncement}></span>
                  <span  style={{display:'inline-flex',height: "20px",marginLeft:"10px",color:"#ff0000"}}>
                    {this.props.Notice!=undefined?this.props.Notice[0].typeName:""}
                  </span>
                </span>
                 <h2 style = {{textAlign: 'center',marginBottom:"40px"}}>稿件管理</h2>
               <div>
               <div style = {{overflow:"hidden",margin:"20px"}}>
                    <div >
                                        稿件名称： <Input
                                                    style={{ width: 200,marginBottom:20,marginRight:20}}
                                                     onChange ={this.onInputValue1 }
                                                     value={this.state.inputvalue1}
                                                     placeholder={"请输入稿件名称"}
                                                     />
                                        申请时间：   
                                        <DatePicker 
                                                    style={{ width: 200,marginBottom:20,marginRight:20}}
                                                    value={this.state.time == '' ? null : moment(this.state.time, dateFormat)}
                                                    format={dateFormat}
                                                     onChange={this.onTime} />
                                         状态： <Select
                                                    style={{ width: 200 }} onChange={this.handleChange}
                                                    value={this.state.inputvalue2}>
                                                    <Option value="draft">草稿</Option>
                                                    <Option value="back">退回</Option>
                                                    <Option value="sdm">待部门经理审核</Option>
                                                    <Option value="passed">审核通过</Option>
                                                    <Option value="accept">被受理</Option>
                                                    </Select>
                      </div>
                      <div >
    &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;单位： <Input
                                                 value={this.state.inputvalue3}
                                                    style={{ width: 200,marginBottom:20,marginRight:20}}
                                                     onChange ={this.onInputValue3 }
                                                     placeholder={"请输入单位"}
                                                     />
                &nbsp;&nbsp;&nbsp;&nbsp;提交人：  <Input
                                                 value={this.state.inputvalue4}
                                                    style={{ width: 200,marginBottom:20,marginRight:20}}
                                                     onChange ={this.onInputValue4 }
                                                     placeholder={"请输入提交人"}
                                                     />
                                                    
                                                  
                                                    <div style= {{float: "right"}}>
                                                    <Button size="default" type="primary" onClick={this.empty} style= {{marginRight: "10px"}}>清空</Button>
                                                    <Button size="default" type="primary" onClick={this.sousuo} style= {{marginRight: "10px"}}>搜索</Button>
                                                    <Button size="default" type="primary" onClick={this.newAdd} style= {{marginRight: "10px"}}>新增</Button>
                                                    </div>
                        </div>
                                <div>
                                        <Table 
                                            key = {this.props!=""?this.props.key:""}
                                            // rowSelection = {this.rowSelection()}
                                            columns = {columns}
                                            className = {styles.orderTable}
                                            dataSource = {this.props.reportList!=""?this.props.reportList:[]}
                                            // loading = {this.props.loading}
                                            style={{clear:"both"}}
                                            pagination={false}
                                        />
                                        <Pagination
                                          current = {this.props.pageCurrent   !=""?this.props.pageCurrent:1}
                                          pageSize = {10}
                                          total = {this.props.allCount!=""?this.props.allCount:1}
                                          onChange = {this.changePage}
                                          style = {{textAlign: 'center', marginTop: '20px',marginBottom: '20px'}}
                                          />
                                  </div>
                                    
                        </div>
               </div>


            </div>
        );
    }
}

// export default manuscriptManagement;
function mapStateToProps (state) {

  return {
    loading: state.loading.models.manuscriptManagement,
    ...state.manuscriptManagement
  };
}
export default connect(mapStateToProps)(manuscriptManagement);