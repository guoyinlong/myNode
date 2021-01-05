/**
  * 作者： 卢美娟
  * 创建日期： 2018-06-13
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 规章制度-类别管理
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon,Input,Button,Row, Col,Card,Tag,Tooltip,Modal,message} from 'antd';
import moment from 'moment';;
import { routerRedux } from 'dva/router';
import styles from './ruleRegulation/regulationM.less';

class EditType extends React.Component{

  state = {
    tags: ['子类别1'],
    inputVisible: false,
    inputValue: '',
    modalVisible: false,
    subModalVisible: false,
    modalDeleteVisible: false,
    typeFlag: 0, //0-新增一级类别；1-新增二级类别,
    typeName:'',//新增/修改的类别名称
    subTypeName:'', //新增的子类别名称
    categoryId:'',//规章制度id
    subCategoryId:'',//二级规章制度id
  }

  handleClose = (subid) => {
     const {dispatch} = this.props;
      dispatch({
        type: 'editType/categoryDel',
        arg_id: subid,
      })
   }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
   }

  handleInputChange = (e) => {
     this.setState({ inputValue: e.target.value });
   }

  addOnelevelType = (flag,id,name) => {
    this.setState({
      modalVisible:true,
      typeFlag:flag,
      categoryId:id,
      typeName:name,
    })
  }

  deleteType = (id) => {
    this.setState({
      modalDeleteVisible: true,
      categoryId: id,
    })
  }

  hideConfirm = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'editType/categoryDel',
      arg_id: this.state.categoryId,
    })
    this.setState({modalDeleteVisible: false})
  }

  addSubType = (id) => {
    this.setState({
      subModalVisible: true,
      subCategoryId: id,
    })
  }

  handleCancel = () => {
    this.setState({modalVisible:false})
  }

  subhandleCancel = () =>{
    this.setState({
      subModalVisible:false,
      subTypeName: ''
    })
  }

  handleSubmit = (flag,typeName) => {
    const {dispatch} = this.props;
    if(typeName == '' || typeName == undefined || typeName == null){
      message.info("名称不能为空！");
      return;
    }
    else if(typeName.replace(/\s/g, "").length == 0){
      message.info("名称不能只有空格！");
      return;
    }
    if(flag === '0'){ //新建
      var data = {
        arg_category_name: typeName
      }
      dispatch({
        type: 'editType/categoryAdd',
        data,
      })
    }
    if(flag === '1'){ //修改
      var data2 = {
        arg_category_name: typeName,
        arg_id: this.state.categoryId,
      }
      dispatch({
        type: 'editType/categoryEdit',
        data2,
      })
    }
    this.setState({modalVisible:false})
  }

  handleSubSubmit = (subid,subname) => {
    const {dispatch} = this.props;
    if(subname == '' || subname == undefined || subname == null){
      message.info("子类别名称不能为空！");
      return;
    }
    else if(subname.replace(/\s/g, "").length == 0){
      message.info("子类别名称不能只有空格！");
      return;
    }
    var data = {
      arg_category_name: subname,
      arg_parent_id: subid
    }
    dispatch({
      type: 'editType/categoryAdd',
      data,
    })
    this.setState({
      subModalVisible:false,
      subTypeName:'',
    })
  }

  getTypeName = (e) => {
    this.setState({typeName: e.target.value})
  }

  getSubTypeName = (e) => {
    this.setState({subTypeName: e.target.value})
  }

  hideModal = () => {
    this.setState({modalDeleteVisible: false})
  }

  saveInputRef = input => this.input = input

  render(){
    const {categoryList,canOperate} = this.props;

    var subContent = (children) =>{
      var subRes = [];
      if(children){
        for(let j = 0; j < children.length; j++){
          subRes.push(
            <span>
              <span style = {{marginLeft:10}}>{children[j].categoryname}</span>
              <Tooltip title = "删除子类别"><Icon type="close"  onClick = {()=>this.deleteType(children[j].id)}/></Tooltip>
              <Tooltip title = "编辑子类别"><Icon type="edit"  onClick = {()=>this.addOnelevelType('1',children[j].id,children[j].categoryname)}/></Tooltip>
            </span>
          );
        }
      }
      return subRes;
    }

    var content = () => {
      var res = [];
      if(categoryList){
        for(let i = 0; i < categoryList.length; i++){
          res.push(
            <div>
              <Row key = {i}>
                <Card>
                  <Col span = {20}>
                      <span style={{padding:7,display:'inline-block',width:'10%',fontSize:17}}>{categoryList[i].categoryname}</span>
                      {
                        categoryList[i].canOperate === '1' ?
                          <div style = {{marginTop:10}}>
                               {subContent(categoryList[i].children)}
                               <Tooltip title = '新增子类别'><Icon type="plus"  onClick = {()=>this.addSubType(categoryList[i].id)} style = {{marginLeft:10}}/></Tooltip>
                          </div>
                        : ''
                      }

                  </Col>

                  {
                    (categoryList[i].canOperate === '1' && canOperate == '1') ? //只有平台管理员可以编辑，删除
                      <Col span = {4}>
                        <Button onClick = {()=>this.addOnelevelType('1',categoryList[i].id,categoryList[i].categoryname)}>编辑</Button>&nbsp;&nbsp;&nbsp;
                        <Button onClick = {()=>this.deleteType(categoryList[i].id)} type = 'primary'>删除</Button>
                      </Col>
                      : ''
                  }

                </Card>
              </Row>
              <div style = {{height:10}}></div>
            </div>
          )
        }
      }

      return res;
    }

    return(
      <div className = {styles.pageContainer}>
          <h2 style = {{textAlign:'center'}}>类别管理</h2>
          <div style = {{marginTop:30}}>
            {content()}
          </div>
          {
            (canOperate == '1')?
              <div style = {{textAlign:'center',marginTop:30}}>
                <Button type = 'primary' onClick = {()=>this.addOnelevelType('0')}>添加类别</Button>
              </div>
            : ''
          }

          <Modal visible={this.state.modalVisible} width='600px' title={(this.state.typeFlag === '0')?'添加':'编辑'}   onCancel={this.handleCancel}   onOk={()=>this.handleSubmit(this.state.typeFlag,this.state.typeName)}>
            <span>类别名称：</span>
            <Input onChange = {this.getTypeName} style = {{marginTop:20,marginBottom:20}} value = {this.state.typeName}/>
          </Modal>

          <Modal visible={this.state.subModalVisible} width='600px' title='添加子类别' onCancel={this.subhandleCancel}   onOk={()=>this.handleSubSubmit(this.state.subCategoryId,this.state.subTypeName)}>
            <span>子类别名称：</span>
            <Input onChange = {this.getSubTypeName} style = {{marginTop:20,marginBottom:20}} value = {this.state.subTypeName}/>
          </Modal>

          <Modal
              title="确认删除"
              visible={this.state.modalDeleteVisible}
              onOk={this.hideConfirm}
              onCancel={this.hideModal}
              okText="确认"
              cancelText="取消"
            >
              <p>您确定删除此类别吗？</p>
          </Modal>
      </div>
    );
  }

}

function mapStateToProps (state) {
  const {query,categoryList,canOperate} = state.editType;  //lumj
  return {
    loading: state.loading.models.editType,
    query,
    categoryList,
    canOperate
  };
}


export default connect(mapStateToProps)(EditType);
