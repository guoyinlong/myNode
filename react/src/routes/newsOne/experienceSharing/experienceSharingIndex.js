/**
 * 作者：贾茹
 * 日期：2020-9-28
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-案例与经验分享模块首页列表
 */
import React from 'react';
import {connect } from 'dva';
import { Table, Spin, Button, Select,Input,Pagination,Popconfirm ,message} from "antd";
import { routerRedux } from 'dva/router';
import styles from '../index.less';

class ExperienceSharingIndex extends React.Component{
    state = {
        isUploadingFile: false, // 是否正在上传文件
      };
    columns = [
      {
        title: "序号",
        dataIndex: "",
        width: "50px",
    
        render: (text, record, index) => {
          return index + 1;
        }
      }, {
        title: "案例经验分享标题",
        dataIndex: "titleName",
        width: "300px",
      
        render: (text, record, index) => {
          return <div style={{ textAlign: "left" }}>{text}</div>;
        }
      },{
        title: "分享单位",
        dataIndex: "shareDeptName",
        width: "300px",
        render: (text, record, index) => {
          return <div style={{ textAlign: "left" }}>{text}</div>;
        }
      },{
        title: "分享人",
        dataIndex: "shareByName",
        width: "150px",
        render: (text, record, index) => {
          return <div style={{ textAlign: "left" }}>{text}</div>;
        }
      },{
        title: "状态",
        dataIndex: "state",
        width: "150px",
        render: (text, record, index) => {
          return <div style={{ textAlign: "left" }}>{text}</div>;
        }
      },{
        title: "操作",
        dataIndex: "button",
        key:"button",
        width: "200px",
    
        render: (text, record, index) => {
          return <div>
                      {record.state === "退回"||record.state === "草稿"?
                      <div>
                        <Button
                          type='primary'
                          style={{marginLeft:'10px'}}                        
                          onClick={()=>this.handleButton('修改',record)}
                        >
                        
                        修改
                        </Button>
                        <Button size="default" type="primary"   style= {{marginLeft: "10px",marginTop:10}}>
                                <Popconfirm
                                    title="是否确认删除?"
                                    onConfirm={() => this.confirm(record)}
                                    onCancel={this.cancel}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <a href="#">删除</a>
                                </Popconfirm>
                            </Button>
                       
                    </div>
                           
                        :
                          <Button
                          type='primary'
                          style={{marginLeft:'10px'}}                        
                          onClick={()=>this.handleButton('成果展示',record)}
                        >
                        
                         成果展示
                        </Button>
                    
                          
                        } 
                      
                  </div>;
        }
      },
    ];
      //案例标题下拉框数据传递
    handleNameChange=(value)=>{
          this.props.dispatch({
            type:'experienceSharingIndex/handleNameChange',
            record: value,
          })
        };
        //传递数据给model层
    returnModel =(value,value2)=>{
      if(value2!==undefined){
        this.props.dispatch({
          type:'experienceSharingIndex/'+value,
          record : value2,
        })
      }else{
        this.props.dispatch({
          type:'experienceSharingIndex/'+value,
        })
      } 
    };
    //控制页数传递
    handlePageChange =(page)=>{
      this.props.dispatch ({
        type : "experienceSharingIndex/changePage",
        page : page,
      })
    };
    //点击新增跳转到填报页面     
    goChannelWrite = ()=>{
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/experienceSharingIndex/experienceSharingWrite'
      }))
    }
    //点击成果展示
    handleButton = (i,record) =>{
      if(i === "修改"){
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/experienceSharingIndex/experienceSharingReset',
          query: {
            record:record.id
          }
        }))
      }else if(i === "成果展示"){
        this.props.dispatch(routerRedux.push({
          pathname: '/adminApp/newsOne/experienceSharingIndex/experienceSharingDetails',
          query: {
            record:record.id
          }
        }))
      }
     
      }
      
       //删除
    confirm=(record)=> {
      this.props.dispatch({
          type: "experienceSharingIndex/delete", 
          record:record.id
      })
      }
      cancel=()=> {
      message.error('删除失败');
      }

  render() {
    return (
      <div className={styles.outerField}>
      <div className={styles.out}>
        <div className={styles.title}>
          案例与经验分享列表      
        </div>
        <div className={styles.searchStyle}>
            <span>案例标题：
              <Select style={{width:'350px'}} value={ this.props.nameSelected } onChange={this. handleNameChange}/*  allowClear={ true } */>
                {this.props.handleName.map((i)=><Select.Option key={i.titleName} value={i.titleName}>{i.titleName}</Select.Option>)}
              </Select>
            </span>
          
            <Button
              type="primary"
              style={{float:'right',fontSize:'18px'}}
              onClick={this.goChannelWrite}
            >
              新增
            </Button>
            <Button
              type="primary"
              style={{float:'right',marginRight:'10px'}}
              onClick={(e)=>this.returnModel('handleSearch','点击查询')}
            >
              查询
            </Button>
          </div>
          <div className={styles.tableDiv}>
            <Table
              className = { styles.tableStyle }
              dataSource = { this.props.channelsDataSource }
              columns = { this.columns }
              style = {{ marginTop: "20px" }}
              bordered={true}
              pagination={ false }
            />
            {this.props.loading !== true?
              <div style={{textAlign:'center',marginTop:'20px'}}>
                <Pagination
                  current={Number(this.props.pageCurrent)}
                  total={Number(this.props.pageDataCount)}
                  pageSize={this.props.pageSize}
                  onChange={(page) => this.handlePageChange(page)}
                />
              </div>
              :
              null
            }
          </div>
    
      </div>
    </div>
    );
  }
}

function mapStateToProps (state) {
   
  return {
    loading: state.loading.models.experienceSharingIndex,
    ...state.experienceSharingIndex
  };
}
export default connect(mapStateToProps)(ExperienceSharingIndex);
