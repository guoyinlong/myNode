/**
  * 作者： 卢美娟
  * 创建日期： 2018-06-13
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 规章制度-平台子管理员管理
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon, Input,Button,Row, Col,Card,Checkbox,Modal} from 'antd';
import moment from 'moment';;
import { routerRedux } from 'dva/router';
import styles from './ruleRegulation/regulationM.less';


class SubEditType extends React.Component{

  state = {
    deptVisible: false,
    typeArr: [],
    num:0,
    subRoleList: [],
  }

  hideDeptModel=(flag)=>{
    if(flag=='confirm'){
      //将某一项item的id带过来
    }
    this.setState({deptVisible: false})
  }

  showModal = (i) => {
    this.setState({
      deptVisible: true,
      num: i
      //在这个地方将每一项的item代入，如这个子管理员已经被分配的管理列表
    })
    typeArr[i].push(i)
  }

  distributeModule = (subRole, categoryid) => {

  }

  checkedClear = (categoryid,userid,username) => {
    const {dispatch} = this.props;
    var data = {
      arg_userid: userid,
      arg_username: username,
      arg_category_id: categoryid,
      arg_type: '0', //取消
    }
    dispatch({
      type:'subEditType/assignCategoryClear',
      data,
    })
  }

  checkedChoose = (categoryid,userid,username) => {
    const {dispatch} = this.props;
    var data = {
      arg_userid: userid,
      arg_username: username,
      arg_category_id: categoryid,
      arg_type: '1', //增加
    }
    dispatch({
      type:'subEditType/assignCategoryChoose',
      data,
    })
  }

  componentWillReceiveProps(newProps){
    if(newProps.subRoleList){
      this.setState({
        subRoleList: newProps.subRoleList
      })
    }
  }


  render(){
    // const {subRoleList} = this.props;
    const {subRoleList} = this.state;

    var subContent = (category,userid,username) => {
      var subRes = [];
      for(let j = 0; j < category.length; j++){
        // if(category[j].children.length > 0){
        //   var tempname;
        //   for(let k = 0; k < category[j].children.length; k++){
        //     tempname = category[j].categoryname + '-' + category[j].children[k].categoryname;
        //     if(category[j].canOperate == '1'){
        //         subRes.push(<span><Checkbox value={tempname} >{tempname}</Checkbox></span>)
        //     }
        //     else{
        //         subRes.push(<span><Checkbox value={tempname}>{tempname}</Checkbox></span>)
        //     }
        //   }
        //
        // }else{
        //   if(category[j].canOperate == '1'){
        //     subRes.push(<span><Checkbox  value={category[j].categoryname} >{category[j].categoryname}</Checkbox></span>)
        //   }
        //   else{
        //     subRes.push(<span><Checkbox value={category[j].categoryname} >{category[j].categoryname}</Checkbox></span>)
        //   }
        // }

        if(category[j].canOperate == '1'){
          subRes.push(<span><Checkbox defaultChecked value={category[j].categoryname} onChange = {()=>this.checkedClear(category[j].id,userid,username)}>{category[j].categoryname}</Checkbox></span>)
        }
        else{
          subRes.push(<span><Checkbox value={category[j].categoryname} onChange = {()=>this.checkedChoose(category[j].id,userid,username)}>{category[j].categoryname}</Checkbox></span>)
        }

      }
      return subRes;
    }
    var content = () => {
      var res = [];
      if(subRoleList){
        for(let i = 0; i < subRoleList.length; i++){
          res.push(
            <div>
              <Row key = {i}>
                <Col span = {24}>
                  <Card>
                    <span style={{padding:7,display:'inline-block',width:'10%',fontWeight:'bold',fontSize:'17px'}}>{subRoleList[i].username}</span>
                     <Row>
                      {subContent(subRoleList[i].category,subRoleList[i].userid,subRoleList[i].username)}
                     </Row>

                  </Card>
                </Col>
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
           <h2 style = {{textAlign:'center'}}>平台子管理员管理</h2>
           <div style = {{marginTop:30}} className = {styles.lightInfo}>请为下列平台子管理员分配权限</div>
           <div style = {{marginTop:30}}>
             {content()}
           </div>
       </div>
    );
  }

}

function mapStateToProps (state) {
  const {query,subRoleList,categoryList} = state.subEditType;  //lumj
  return {
    loading: state.loading.models.subEditType,
    query,
    subRoleList,
    categoryList
  };
}


export default connect(mapStateToProps)(SubEditType);
