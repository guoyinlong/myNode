/**
 * 作者：郭银龙
 * 日期：2020-5-13
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：抄送页面（员工督查）
 */
import React from 'react'; 
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './fkstyle.less';
import { Select, Input, DatePicker, Radio, Button, Icon, Popconfirm, Tooltip,Form,Upload,Modal} from "antd";
import PicShow from './picShow';
const { Option } = Select;
import { routerRedux } from 'dva/router';
 
class chaosongyemian extends React.Component {
  state = {
   
    value1:"",
    value2:"",
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
    const {value1,value2} = this.state;
    console.log(value1,value2,"反馈");
    //在此做提交操作，比如发dispatch等
    // this.state.dispatch({
    //   argReform:"",//图片
    //   argreformDesc:InputValue ,  //整改描述
    //   argInfoId:""    //消息id
    // })
    this.setState({
        value1 : "",
        value2 : ""
    })

  };
  //通知责任人员
  returnTz =()=>{
  console.log("通知责任人员")

};
//结束流程
returnJs =()=>{
    console.log("结束流程")
  
  };
onChange1 = (e) => {
    console.log(e.target.value);
    this.setState({
        value1: e.target.value,
      });
};
onChange2 = (value) => {
    console.log(`${value}`);
    this.setState({
        value2: `${value}`,
      });
}

goBackPage = () => {
  this.props.dispatch( routerRedux.push({
    pathname:'/adminApp/securityCheck/Notification',
    query: {
      ontabs:JSON.parse(JSON.stringify(this.props.taskList[0].noticeState))
    }
  }));
   
}

  render(){
    const {taskList,examineImgId} =this.props
    return (
      <div className={styles.outerField}>
         <div className={styles.title}>
         督查反馈
          </div>
           <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
        <div className={styles.out}>
         
       
              {this.props.taskList.length>0?
              
           
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
            <span>{taskList[0].dutyUsername}</span>
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
            <span>
                      <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                      </Modal>
                      <div style={{width:420,overflow:"hidden", marginLeft: 90}}>
                      <PicShow 
                          fileList = {examineImgId!=undefined?examineImgId:[]} 
                          visible = {this.state.previewVisible} 
                          handlePreview = {this.handlePreview}/>
                      </div>
            </span>
            
          </div>
          
           <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               督查建议
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{taskList[0].advice}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               通知内容
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{taskList[0].checkCase}</span>
          </div>
         
          
          </div>
 :""}
          </div>
      </div>
    )
  }
}

const form1 = Form.create()(chaosongyemian);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.chaosongyemian,
    ...state.chaosongyemian
  };
}
export default connect(mapStateToProps)(form1);
