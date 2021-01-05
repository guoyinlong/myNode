/**
 * 作者：郭银龙
 * 日期：2020-4-29
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：员工督查反馈消息页面
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './fkstyle.less';
import { Select, Input, DatePicker, Radio, Button, Icon, Popconfirm, Tooltip,Form,Upload,Modal} from "antd";
const { Option, OptGroup } = Select;
import PicShow from './picShow';
import { routerRedux } from 'dva/router';



class yuangongducha extends React.Component {
  state = {
   
    value1:"",
    value2:[],
    inforid:"",//消息id
    previewVisible: false,
    previewImage: '',
}
handleCancel = () => this.setState({ previewVisible: false })
handlePreview = (file) => {
  this.setState({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
}
  //反馈
  returnFk=()=>{
    const {value1,value2,inforid} = this.state;
    // console.log(value1,value2,inforid,"反馈");
    // 在此做提交操作，比如发dispatch等
    let  datalist={
      argOpinion:value1,//内容
      argInfoId:inforid,  //消息id
      type:0 //0代表反馈，1代表通知责任人员，2代表结束流程 
    }
    this.props.dispatch({
      type: 'yuangongducha/Submit',
      datalist
    })
    this.setState({
        value1 : "",
       
    })

  };
  //通知责任人员
  returnTz =()=>{
    const {value1,value2,inforid} = this.state;
  // console.log("通知责任人员",inforid)
  let datalist={
    argOpinion:value1,//内容
    argInfoId:inforid,  //消息id
    type:1 //0代表反馈，1代表通知责任人员，2代表结束流程  
  }
  this.props.dispatch({
    type: 'yuangongducha/Submit',
    datalist
  })
  this.setState({
    value1 : "",
   
})

};
//结束流程
returnJs =()=>{
  const {value1,value2,inforid} = this.state;
    // console.log("结束流程",inforid)
    let datalist={
      argOpinion:value1,//内容
      argInfoId:inforid,  //消息id
      argCopy:value2,   //0-本部/分部全员 1-本部全员 2-分院全员 3-部门全员 |
        type:2 //0代表反馈，1代表通知责任人员，2代表结束流程  
    }
    this.props.dispatch({
      type: 'yuangongducha/Submit',
      datalist

    })
    this.setState({
      value1 : "",
     
  })
  };
  onChange1 = (e) => {
    console.log(e.target.value);
    this.setState({
        value1: e.target.value,
      });
};

returnModel =(value,value2)=>{
	
	
  // console.log(value,value2,"qeqe")
  // return
	if(value2!==undefined){
		this.props.dispatch({
			type:'yuangongducha/'+value,
			record : value2,
			
		})
		
	}else{
		this.props.dispatch({
			type:'yuangongducha/'+value,
			
		})
		
	}
};

componentDidMount() {
  // const{inforid}=this.state
  const{arg_state}=this.props.location.query
  this.setState({
    inforid:arg_state
  })
}
goBackPage = () => {
  this.props.dispatch( routerRedux.push({
    pathname:'/adminApp/securityCheck/myNews',
    query: {
      ontabs:JSON.parse(JSON.stringify(this.props.taskList[0].infoState))
    }
  }));
   
}

  render(){
    const{taskList,examineImgId,roleList,roleObject} =this.props
    let roleListData = roleList.length == 0 ? [] : roleList.map((item) => { // 通知对象
			return <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>
		})
    return (
      <div className={styles.outerField}>
       
         <div className={styles.title}>
         员工督查反馈
          </div>
         <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
         {taskList.length>0?
        
        <div className={styles.out}>
          
        
     
        <div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               安全主体
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].assetsName}</span>
          </div>

           <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               所属区域
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].assetsArea}</span>
          </div>

          <div className={styles.lineOut}>
          <span className={styles.lineKey}>
              责任人员
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].dutyUserName}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            所属部门
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].dutyDeptName}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            情况反馈
            </span>
            <span className={styles.lineColon}>:</span>

           <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
								<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
							</Modal>
							<div style={{width:500,overflow:"hidden", marginLeft: 90}}>
							<PicShow 
									fileList = {examineImgId} 
									visible = {this.state.previewVisible} 
									handlePreview = {this.handlePreview}/>
							</div>
          </div>
          
         
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               督查建议
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{taskList[0].situation}</span>
          </div>


          </div>
 
               {taskList[0].infoState==0?   
               <div>

               
          <div className={styles.lineOut}>
          <b className={styles.lineStar}>*</b>
            <span className={styles.lineKey}>
            
            通知内容
            </span>
            <span className={styles.lineColon}>:</span>
            <Input style={{width:'300px'}} value={this.state.value1} onChange={this.onChange1} />
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            抄送
            </span>
            <span className={styles.lineColon}>:</span>
                           
                                <Select mode="multiple"
                                      value={roleObject}
                                      // onChange={this.onChange2}
                                      onChange={(e)=>this.returnModel('roleListData',e)}
                                      style={{ minWidth: "200px", maxWidth: 570 }}
                                      placeholder = "请选择"
                                      >
                                               {roleListData}
                                    </Select>
          </div>

     
          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSubmit} onClick={this.returnFk}>反馈</Button>
              <Button type="primary" className={styles.buttonSubmit} onClick={this.returnTz}>通知责任人员</Button>
              <Button type="primary" className={styles.buttonSubmit} onClick={this.returnJs}>结束流程</Button>
            </div>
          </div>
          </div>
          :""}
    
          </div>
       
        :""}   
      </div>
    )
  }
}

const form1 = Form.create()(yuangongducha);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.yuangongducha,
    ...state.yuangongducha
  };
}
export default connect(mapStateToProps)(form1);
