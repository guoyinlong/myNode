/**
 * 作者：贾茹
 * 日期：2020-9-28
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-宣传渠道备案模块首页列表
 */
import React from 'react';
import {connect } from 'dva';
import { Table, Spin, Button, Select,Input,Pagination,Popconfirm } from "antd";
import { routerRedux } from 'dva/router';
import styles from '../index.less';

class PublicityChannelsIndex extends React.Component{
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
          title: "宣传渠道类型",
          dataIndex: "pubChannelType",
          width: "100px",
        
          render: (text, record, index) => {
            return <div style={{ textAlign: "left" }}>{text}</div>;
          }
        }, {
          title: "宣传渠道名称",
          dataIndex: "pubChannelName",
          width: "250px",
          render: (text, record, index) => {
            return <div style={{ textAlign: "center" }}>{text}</div>;
          }
        }, {
          title: "主办单位",
          dataIndex: "hostDept",
          width: "450px",
          render: (text, record, index) => {
            return <div style={{ textAlign: "left" }}>{text}</div>;
          }
        }, {
          title: "申请名义",
          dataIndex: "applyReason",
          width: "150px",
          render: (text, record, index) => {
            return <div style={{ textAlign: "left" }}>{text}</div>;
          }
        }, {
          title: "备案时间",
          dataIndex: "createTime",
          width: "200px",
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
          width: "280px",     
          render: (text, record, index) => {
            return <div style={{ textAlign: "left" }}>{
                     record.state === "退回"|| record.state === "草稿"?
                       <div>
                          <Button
                            type='primary'
                            style={{marginLeft:'10px',marginRight:'10px'}}
                            key="修改"
                            onClick={()=>this.handleButton("修改",record)}
                          >
                          修改
                          </Button>
                           <Popconfirm
                              title="确定要删除该议题吗?"
                              onConfirm={() => this.handleButton("删除",record)}
                            >
                            <Button
                              type='primary'
                              // style={{marginLeft:'10px',marginRight:'10px'}}
                              key="删除"
                             /*  onClick={()=>this.handleButton('删除',record)} */
                            >
                            删除
                            </Button>
                          </Popconfirm> 
                        </div>
                        :
                        <Button
                        type='primary'
                        style={{marginLeft:'10px',marginRight:'10px'}}
                        key="详情"
                        onClick={()=>this.handleButton("详情",record)}
                      >
                        详情
                      </Button>
                    
                      
                    
    
                  }
                    </div>;
          }
        },
      ];
      handleButton =(i,record)=>{
          if(i === "详情"){
            this.props.dispatch(routerRedux.push({
              pathname: '/adminApp/newsOne/publicityChannelsIndex/publicityChannelsDetails',
              query: {
                record:JSON.stringify(record)
              }
            }))
          }else if(i === "修改"){
            this.props.dispatch(routerRedux.push({
              pathname: '/adminApp/newsOne/publicityChannelsIndex/publicityChannelsReset',
              query: {
                record:JSON.stringify(record)
              }
            }))
          }else if(i === "删除"){
            this.props.dispatch({
              type:'publicityChannelsIndex/deletePublicityChannel',
              record : record,
            })
          }
      };    
       //传递数据给model层
      returnModel =(value,value2)=>{
        if(value2!==undefined){
          this.props.dispatch({
            type:'publicityChannelsIndex/'+value,
            record : value2,
          })
        }else{
          this.props.dispatch({
            type:'publicityChannelsIndex/'+value,
          })
        }
    
      };
      //宣传数据类型下拉框数据传递
      handleChannelTypeChange=(value)=>{
        this.props.dispatch({
          type:'publicityChannelsIndex/saveData',
          record: value,
        })
      };

      //点击新增跳转到填报页面
      goChannelWrite = ()=>{
        this.props.dispatch(routerRedux.push({
          pathname: '/adminApp/newsOne/publicityChannelsIndex/publicityChannelsWrite',
        }))
      };
     //控制页数传递
     handlePageChange =(page)=>{
      this.props.dispatch ({
        type : "publicityChannelsIndex/changePage",
        page : page,
      })
    };

  render() {
    return (
      <div className={styles.outerField}>
      <div className={styles.out}>
        <div className={styles.title}>
          宣传渠道备案模块       
        </div>
        <div className={styles.searchStyle}>
            <span>宣传渠道类型：
              <Select style={{width:'170px'}} value={ this.props.channelTypeName } onChange={this.handleChannelTypeChange}>
                {this.props.channelTypes.map((i)=><Select.Option key={i.channelName} value={i.channelName}>{i.channelName}</Select.Option>)}
              </Select>
            </span>
            <span className={styles.searchTitle}>宣传渠道名称：
               <Input value={ this.props.channelName } style={{width:'170px'}} onChange={(e)=>this.returnModel('handleChannelTypeChange',e)} placeholder="请输入渠道名称"/>
            </span>
            <Button
              type="primary"
              style={{float:'right',marginLeft:'10px'}}
              onClick={()=>this.returnModel('exportChannels')}
              
            >
              导出
            </Button>
            <Button
              type="primary"
              style={{float:'right',fontSize:'18px'}}
              onClick={this.goChannelWrite}
            >
              新增
            </Button>
           {/*  <Button
              type="primary"
              style={{float:'right',marginRight:'10px'}}
              onClick={()=>this.returnModel('handleClear')}
              
            >
              清空
            </Button> */}
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
    loading: state.loading.models.publicityChannelsIndex,
    ...state.publicityChannelsIndex
  };
}
export default connect(mapStateToProps)(PublicityChannelsIndex);
