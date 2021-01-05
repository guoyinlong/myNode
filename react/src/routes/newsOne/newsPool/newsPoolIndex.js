/**
 * 作者：贾茹
 * 日期：2020-9-28
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-新闻宣传资源池模块首页列表
 */
import React from 'react';
import {connect } from 'dva';
import styles from '../index.less';
import { Table, Spin, Button, Select,Input,Pagination,TreeSelect, } from "antd";
import { routerRedux } from 'dva/router';
// const { Option, OptGroup } = Select;

class NewsPoolIndex extends React.Component{
  state = {
    isUploadingFile: false, // 是否正在上传文件
    author:[{stateName:'文稿作者',key:'0'},{stateName:'图片作者',key:'1'},{stateName:'视频编辑人员',key:'2'},{stateName:'H5编辑人员',key:'3'}],
    buttonValue:false
  };
 
   columns = [
    {
      title: "序号",
      dataIndex: "index",
      width: "2%",
      render: (text, record, index) => {
        return index + 1;
      }
    }, 
    {
      title: "稿件标题",
      dataIndex: "newsName",
      width: "15%",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left",color: record.isUrgent==true?"red":""}}>{text}</div>;
      }
    },
    {
      title: "拟发布渠道",
      dataIndex: "pubChannels",
      width: "13%",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left",color: record.isUrgent==true?"red":"" }}>{text}</div>;
      }
    },
    {
      title: "单位",
      dataIndex: "deptName",
      width: "15%",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left",color: record.isUrgent==true?"red":"" }}>{text}</div>;
      }
    },{
      title: "稿件类型",
      dataIndex: "manuscriptType",
      width: "10%",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left",color: record.isUrgent==true?"red":"" }}>{text}</div>;
      }
    },
    {
      title: "提交时间",
      dataIndex: "createTime",
      width: "10%",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" ,color: record.isUrgent==true?"red":""}}>{text}</div>;
      }
    },
    {
      title: "状态",
      dataIndex: "materialState",
      width: "10%",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left",color: record.isUrgent==true?"red":"" }}>{text}{record.isUrgent==true?"(紧急)":""}</div>;
      }
    },
    {
      title: "操作",
      dataIndex: "doing",
      width: "25%",
      render: (text, record, index) => {
        return <div style={{ display: "flex" }}>
                    <Button
                      type='primary'
                      style={{marginLeft:'10px'}} 
                      key="详情"                       
                      onClick={()=>this.handleButton("详情",record)}
                    >
                    详情
                    </Button>
                    <Button
                      type='primary'
                      style={{marginLeft:'10px'}}
                      key="下载"                        
                      onClick={()=>this.handleButton("下载",record)}
                    >
                    下载
                    </Button>
                    {record.materialState=="未处理"?
                      <Button
                      type='primary'
                      style={{marginLeft:'10px'}} 
                      disabled={this.state.buttonValue}
                      key="处理"                       
                      onClick={(e)=>this.handleButton("处理",record,"1")}
                    >
                    处理
                    </Button>
                     :""
                      } 
                    
                  
                    
                </div>;
      }
    },
  ];
  //处理按钮情况
  handleButton = (i,record,buttonValue) =>{
    if(i === "详情"){
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/manuscriptManagement/manuscriptDetails',
        query: {
          newsId:JSON.parse(JSON.stringify(record.newsId)),
        }
      }))
    }else if(i === "下载"){
      this.props.dispatch({
        type:'newsPoolIndex/queryNewsPoolDown',
        record:JSON.stringify(record)
      })
    }else if(i === "处理"){
      this.props.dispatch({
        type:'newsPoolIndex/newsHandle',
        record:JSON.stringify(record)//record.newsId
      })
     
     
    }
   
    }
   //选中状态下拉框数据
   handleChannelChange=(value)=>{
       this.props.dispatch({
         type:'newsPoolIndex/handleChannelChange',
         record: value,
       })
     };
      //传递数据给model层
  returnModel =(value,value2)=>{
    if(value2!==undefined){
      this.props.dispatch({
        type:'newsPoolIndex/'+value,
        record : value2,
      })
    }else{
      this.props.dispatch({
        type:'newsPoolIndex/'+value,
      })
    }

  };
  //分页
  handlePageChange =(page)=>{
    // return
    this.props.dispatch ({
      type : "newsPoolIndex/handleSearch",
      page : page,
    })
  };
  //主办部门院级部门联动
  handleProvinceChange = value => {
    this.setState({
      cities: this.props.deptsData[value],
      secondCity: this.props.deptsData[value][0],
    });
    this.props.dispatch({
      type:'newsPoolIndex/saveProvinceChange',
      record: value,
    })
  };

  onSecondCityChange = value => {
    this.setState({
      secondCity: value,
    });
    this.props.dispatch({
      type:'newsPoolIndex/onSecondCityChange',
      record: value,
    })
  };
render() {
  const { cities } = this.state;
  const { checkObjectAndContentList,channelsDataSource} = this.props;   
        checkObjectAndContentList.length == 0 ? [] : checkObjectAndContentList.map((item, index) => { //申请单位
			    item.key = index;
                item.title = item.deptName
                item.value = item.deptId
                item.disabled = true
                item.children.map((v, i) => {
                  v.key = index + '-' + i;
                  v.title = v.deptName
                  v.value = v.deptId
			})
        });
return (
  <div className={styles.outerField}>
  <div className={styles.out}>
    <div className={styles.title}>
      新闻宣传资源池      
    </div>
    <div className={styles.searchStyle}>
        <span>拟发布渠道：
        <TreeSelect
          style={{ width: '200px' }}
          value={this.props.channelsChecked}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={this.props.channelTypes}
          placeholder="请选择发布渠道"
          treeDefaultExpandAll
          onChange={(e)=>this.returnModel('handleChannelChange',e)}
      />
        </span>
        <span style = {{marginLeft:'20px'}}>
          {/* 作者名字： */}
          <Select style={{width:'120px'}} 
           value={ this.props.author_type_name} 
           onChange={(e)=>this.returnModel('authorTypeName',e)}>
            {this.state.author.map((i)=><Select.Option key={i.stateName} value={i.stateName}>{i.stateName}</Select.Option>)}
          </Select>
           <Input value={ this.props.author } style={{width:'150px'}} onChange={(e)=>this.returnModel('handleAuthorChange',e)} placeholder="请输入查询作者名字"/>
        </span>
        <span style = {{marginLeft:'20px'}}>状态：
              <Select style={{width:'150px'}} placeholder="请选择稿件状态" value={ this.props.stateSelected } onChange={(e)=>this.returnModel('handleStateChange',e)}/*  allowClear={ true } */>
                {this.props.states.map((i)=><Select.Option key={i.stateName} value={i.stateName}>{i.stateName}</Select.Option>)}
              </Select>
            </span>
      </div>
      <div className={styles.searchStyle}>
      <span>稿件名称：
           <Input value={ this.props.manuscriptTitle } style={{width:'170px'}} onChange={(e)=>this.returnModel('handleManuscriptTitleChange',e)} placeholder="请输入稿件名称"/>
      </span>
      
        <span style = {{marginLeft:'21px'}}>单位：</span>
        <TreeSelect
							showSearch
							style={{ width: '25%' }}
							value={this.props.checkObject}
              dropdownStyle={{ maxHeight: 500, minHeight: 200,minWidth: 500, overflow: 'auto' }}
							placeholder="请选择单位"
							treeData={checkObjectAndContentList}
							allowClear
              /* multiple */
							treeDefaultExpandAll
							onChange={(e)=>this.returnModel('onObjectChange',e)}
						>
						</TreeSelect>
           

        
        
        <Button
          type="primary"
          style={{float:'right',marginRight:'10px'}}
          onClick={()=>this.returnModel('handleSearch')}
        >
          查询
        </Button>
        <Button
          type="primary"
          style={{float:'right',marginRight:'10px'}}
          onClick={()=>this.returnModel('handleClear')}
          
        >
          清空
        </Button>
        
      </div>
      <div className={styles.tableDiv}>
        <Table
          className = { styles.tableStyle }
          dataSource = { this.props.channelsDataSource }
          columns = { this.columns }
          style = {{ marginTop: "20px",color:"red" }}
          bordered={true}
          pagination={ false }
        />
       <Pagination
          current = {this.props.pageCurrent!=""?this.props.pageCurrent:1}
          pageSize = {10}
          total = {this.props.allCount!=""?this.props.allCount:1}
          onChange = {(page)=>this.handlePageChange(page)}
          style = {{textAlign: 'center', marginTop: '20px',marginBottom: '20px'}}
          />
      </div>

  </div>
</div>
);
}
}

function mapStateToProps (state) {
   
  return {
    loading: state.loading.models.newsPoolIndex,
    ...state.newsPoolIndex
  };
}
export default connect(mapStateToProps)(NewsPoolIndex);
