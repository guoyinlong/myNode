/**
 * 作者： 张枫
 * 创建日期： 2019-11-21
 * 邮箱: zhangf142@chinaunicom.cn
 * 功能： 常用资料-目录配置
 */
import React from 'react';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Table, Button,Collapse,Modal,Input,Popconfirm,message} from 'antd';
import styles from './toDoList/toDoList.less';
const { Panel } = Collapse;
class DirectoryConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };
  columns = [
    {
      title: "序号",
      dataIndex: "key",
      render: (index) => {
        return(
          <div>{index+1}</div>
          )
      }
    },
    {
      title: "二级目录名称",
      dataIndex: "spPathName",
      render: (text) => {
        return(
          <div>{text}</div>
        )
      }
    },
    {
      title: "创建日期",
      dataIndex: "creationDate",
      render: (text) => {
        return(
          <div>{text}</div>
        )
      }
    },
    {
      title: "创建人",
      dataIndex: "spFounferName",
      key: "spFounferName",
      render: (text) => {
        return(
        <div>{text}</div>
        )
      }
    },
    {
      title: "操作",
      dataIndex: "option",
      key: "option",
      render: (text,record) => {
        return(
          <div>
            <Button type="primary" size = "small" disabled = {record.state ==1 ? false :true} onClick = {(e)=>this.setThirdVisible(e,record,"addThiDic")} style = {{marginRight:"3px"}}>增加三级目录</Button>
            <Button type="primary" size = "small" disabled = {record.state ==1 ? false :true}  onClick = {(e)=>this.setThirdVisible(e,record,"updateThiDic")} style = {{marginRight:"3px"}}>修改</Button>
            <Popconfirm onConfirm = {()=>this.delDic(record.spPathId)} title ="确认删除?">
              <Button disabled = {record.state ==1 ? false :true} type="primary" size = "small" onClick = {(e)=>this.delInfo(e)}>删除</Button>
            </Popconfirm>
          </div>
          )
      }
    }
  ];
  secColumns = [
    {
      title: "序号",
      dataIndex: "key",
      render: (index) => {
        return(
          <div>{index+1}</div>
          )
      }
    },
    {
      title: "三级目录名称",
      dataIndex: "tpPathName",
      render: (text) => {
        return(
          <div>{text}</div>
          )
      }
    },
    {
      title: "创建日期",
      dataIndex: "creationDate",
      render: (text) => {
        return(
          <div>{text}</div>
        )
      }
    },
    {
      title: "创建人",
      dataIndex: "tpFounferName",
      key: "tpFounferName",
      render: (text) => {
        return(
        <div>{text}</div>
        )
      }
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text,record) => {
        return(
          <div>
            <Button type="primary" size="small" style = {{marginRight:"3px"}} disabled = {record.state ==1 ? false :true} onClick = {()=>this.setInnerThirdVisible(record)} >修改</Button>
            <Popconfirm onConfirm = {()=>this.delDic(record.tpPathId)} title ="确认删除?">
              <Button type="primary" size = "small" disabled = {record.state ==1 ? false :true} onClick = {(e)=>this.delInfo(e)}>删除</Button>
            </Popconfirm>
          </div>
          )
      }
    }
  ];
  // 设置模态框状态
  setVisible = (data)=>{
    this.props.dispatch({
      type:"directoryConfig/setVisible",
      para : data,
    })
  }
  setSecVisible = (e,data,para)=>{
    e.stopPropagation();
    this.props.dispatch({
      type:"directoryConfig/setSecVisible",
      data : data,
      para : para,
    })
  }
  setThirdVisible =(e,record,para)=>{
    e.stopPropagation();
    this.props.dispatch({
      type:"directoryConfig/setThiVisible",
      record : record,
      para :para,
    })
  }
  // z最内层table 设置
  setInnerThirdVisible =(record)=>{
    this.props.dispatch({
      type:"directoryConfig/setInnerThirdVisible",
      record : record,
    })
  }
  // 保存目录数据
  saveDic = (e)=>{
    this.props.dispatch({
      type:"directoryConfig/saveDic",
      data:e.target.value
    })
  }
  //  提交
  confirmAddDic =(data)=>{
    this.props.dispatch({
      type:"directoryConfig/confirmAddDic",
      data:data,
    })
  }
  // 取消 模态框
  cancel =( data )=>{
    this.props.dispatch({
      type:"directoryConfig/cancel",
      data:data,
    })
  }
  // 删除目录
  delDic =(data)=>{
    this.props.dispatch({
      type:"directoryConfig/delDic",
      data:data,
    })
  }
  delInfo =(e)=>{
    e.stopPropagation();
  }
  // 点击修改 展示模态框

  confirmReviseDic=( data )=>{
    this.props.dispatch({
      type:"directoryConfig/confirmReviseDic",
      data : data
    })
  }
  // 返回到常用资料页面
  goBack=()=>{
    this.props.dispatch(routerRedux.push({
      pathname: "/adminApp/commonDataSystem/commonData"
    }));
  }
  render() {
    const { directoryList ,isAddDicVisible,isAddSecDicVisible,isAddThiDicVisible,isUpdateDicVisible,isUpdateSecDicVisible,isUpdateThiDicVisible } = this.props
    const panelList  = directoryList.map((item,index)=>{
      // 给一级目录添加key
      item.key = index;
      // 给二级目录添加key
      if(item.secondPath != undefined){
        var secondPathList =JSON.parse(item.secondPath) ;
        secondPathList.map(( item,index)=>{item.key = index;})
        // 如果一级目录有权限 则赋值二级目录也有权限 state =1
        if(item.state != undefined && item.state == 1){
          secondPathList.map(( item,index)=>{
            item.state = 1;
          })
        }
        // 把一级标题  放到二级中
        secondPathList.map(( interItem,index)=>{
          interItem.firstName = item.path_name;
        })
      }
    const expandedRowRender = (record)=> {
      if(record.thirdPath != null){
        var thirdPathList =JSON.parse(record.thirdPath) ;
        // 给三级目录添加key
        thirdPathList.map(( item,index)=>{
          item.key = index;
        })
        // 如果二级可见 则三级设置为可见 state 1
        if(record.state != undefined && record.state == 1){
          thirdPathList.map(( item,index)=>{
            item.state = 1;
          })
        }
        // 把一级、二级标题  放到三级标题中
        thirdPathList.map(( interItem,index)=>{
          interItem.firstName = record.firstName;
          interItem.secondName = record.spPathName;
        })

      }
      return (
        <Table
          columns={this.secColumns}
          dataSource={thirdPathList }
          pagination = {false}
          //className = {styles.orderTable}
        />
      );
    };
      const path = (
        <Panel
          header={
            <div>
              <span>
              {item.path_name}
              </span>
              <span style={{float:'right'}}>
                <Button  type = "primary" size="small" style = {{marginRight:"3px"}} disabled ={item.state == 1 ? false:true} onClick = {(e)=>this.setSecVisible(e,item,"addSecDic")}>增加二级目录</Button>
                <Button type = "primary" size="small" style = {{marginRight:"3px"}} disabled ={item.state == 1 ? false:true} onClick = {(e)=>this.setSecVisible(e,item,"updateDic")}>修改</Button>
                <Popconfirm onConfirm = {()=>this.delDic(item.path_id)} title ="确认删除?">
                  <Button type = "primary" size="small" disabled ={item.state == 1 ? false:true} onClick = {(e)=>this.delInfo(e)} style={{marginRight:"5px"}}>删除</Button>
                </Popconfirm>
              </span>
            </div>
            }
          key = {item.path_id}
        >
          <Table
            dataSource = { item.secondPath == undefined ? [] :secondPathList}
            columns = { this.columns }
            expandedRowRender={ expandedRowRender }
            pagination = { false }
           // className = {styles.orderTable}
          >
          </Table>
        </Panel>
      )
      return path
    })

    return(
      <div className = {styles.blackWrapper}>
        <h2 style = {{textAlign:"center",marginBottom:"40px"}}>目录配置</h2>
        <div style={{textAlign:"right",marginBottom:"5px"}}>
          <Button  type = "primary" onClick = {()=>this.setVisible("addDic")}  disabled = {this.props.roleType == 1 ? false:true}>增加一级目录</Button>
          <Button type = "primary" style={{marginLeft:"5px"}} onClick = {this.goBack}>返回</Button>
        </div>
        <Collapse>
          { panelList }
        </Collapse>
        <Modal
          title = {"增加一级目录"}
          visible = {isAddDicVisible}
          onOk = {()=> this.confirmAddDic("addDic") }
          onCancel = { ()=>this.cancel("addDic")}
          key = {this.props.modalKey}
        >
          <Input  onChange = {(e)=>this.saveDic(e)}></Input>
        </Modal>
        <Modal
          title = {"增加二级目录"}
          visible = {isAddSecDicVisible}
          onOk = {()=> this.confirmAddDic("addSecDic") }
          onCancel = { ()=>this.cancel("addSecDic") }
          key = {this.props.modalKey+"1"}
        >
          <div><span>一级目录：</span><span>{this.props.secDic.path_name}</span></div>
          <div><span>二级目录：</span><span><Input style = {{width:"300px"}} onChange = {(e)=>this.saveDic(e)}></Input></span></div>
        </Modal>
        <Modal
          title = {"增加三级目录"}
          visible = {isAddThiDicVisible}
          onOk = {()=> this.confirmAddDic("addThiDic") }
          onCancel = { ()=>this.cancel("addThiDic") }
           key = {this.props.modalKey+"2"}
        >
          <div><span>一级目录：</span><span>{this.props.thiDic.firstName}</span></div>
          <div><span>二级目录：</span><span>{this.props.thiDic.spPathName}</span></div>
          <div><span>三级目录：</span><span><Input style={{width:"300px"}} onChange = {(e)=>this.saveDic(e)}></Input></span></div>
        </Modal>
        <Modal
          title = {"修改一级目录"}
          visible = {isUpdateDicVisible}
          onOk = {()=> this.confirmReviseDic("updateDic") }
          onCancel = { ()=>this.cancel("updateDic")}
          key = {this.props.modalKey+"3"}
        >
          <div>
            <span>一级目录：</span>
            <span><Input defaultValue = {this.props.secDic.path_name} onChange = {(e)=>this.saveDic(e)} style ={{width:"300px"}}></Input></span>
          </div>
        </Modal>
        <Modal
          title = {"修改二级目录"}
          visible = {isUpdateSecDicVisible}
          onOk = {()=> this.confirmReviseDic("updateSecDic") }
          onCancel = { ()=>this.cancel("updateSecDic")}
          key = {this.props.modalKey+"4"}
        >
          <div><span>一级目录：</span><span>{this.props.thiDic.firstName}</span></div>
          <div><span>二级目录：</span><span><Input defaultValue = {this.props.thiDic.spPathName} style = {{width:"300px"}} onChange = {(e)=>this.saveDic(e)}></Input></span></div>
        </Modal>
        <Modal
          title = {"修改三级目录"}
          visible = {isUpdateThiDicVisible}
          onOk = {()=> this.confirmReviseDic("updateThiDic") }
          onCancel = { ()=>this.cancel("updateThiDic")}
          key = {this.props.modalKey+"5"}
        >
          <div><span>一级目录：</span><span>{this.props.innerThiDic.firstName}</span></div>
          <div><span>二级目录：</span><span>{this.props.innerThiDic.secondName}</span></div>
          <div><span>三级目录：</span><span><Input defaultValue = {this.props.innerThiDic.tpPathName} style = {{width:"300px"}} onChange = {(e)=>this.saveDic(e)}></Input></span></div>
        </Modal>
      </div>

    )
  }
};
function mapStateToprops (state) {
  return {
    loading: state.loading.models.directoryConfig,
    ...state.directoryConfig
  };
};
export default connect (mapStateToprops)(DirectoryConfig);
