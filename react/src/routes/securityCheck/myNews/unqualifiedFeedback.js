/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：对不合格的反馈消息页面
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './tzstyle.less';
import { Select, Input, DatePicker, Radio, Button, Icon, Popconfirm, Tooltip,Form,Upload,Modal} from "antd";
import FileUpload from './setFileUoload.js';  
import PicShow from './picShow';
import { routerRedux } from 'dva/router';



class duibuhegefankui extends React.Component {
  state = {
   inputvalue:"",
   inforid:"",
   previewVisible: false,
   previewImage: '',
};

handleCancel = () => this.setState({ previewVisible: false })
handlePreview = (file) => {
this.setState({
  previewImage: file.url || file.thumbUrl,
  previewVisible: true,
});
}
//上传需要
saveData = (values) => {
  this.setState({
    showData:values,
    importDataLength:values.length,
  })
};
returnInput=(e)=>{
  this.setState({
    inputvalue:e.target.value
  })
}
returnModel =(value,value2)=>{
	let saveData = {
		startTime: this.state.beginTime,
		endTime: this.state.endTime,
		otherOu: this.state.value
	}
	saveData['otherOu'] = (this.props.roleType == '1' || this.props.roleType == '2' ) ? 0 : 1 //除安委办之外涉及分院字段都为0
	if(value2!==undefined){
		this.props.dispatch({
			type:'duibuhegefankui/'+value,
			record : value2,
			saveData
		})
	}else{
		this.props.dispatch({
			type:'duibuhegefankui/'+value,
		})
	}
};
returnModel2 =()=>{
  const {inputvalue,inforid} = this.state;
  const {examineImgId} =this.props
  // console.log(inputvalue,examineImgId);
  //在此做提交操作，比如发dispatch等
  this.props.dispatch({
    type: 'duibuhegefankui/Submit', 
         argReform:JSON.parse(examineImgId),//图片
        argreformDesc:inputvalue ,  //整改描述
        argInfoId:inforid    //消息id

 
  })
  this.setState({
    InputValue : ""
  })
	

};

componentDidMount() {
  const{inforid}=this.state
  const{arg_state}=this.props.location.query
  this.setState({
    inforid:arg_state
  })
 console.log(this.state.inforid)
//  const query = this.props.match.location.search
//  const arr = query.split('&') // ['?s=', 'f=7']
// const successCount = arr[0].substr(3) // '1'
// const failedCount = arr[1].substr(2) // '7'
// console.log(successCount,failedCount,"参数")
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
    const{taskList,examineImgId}=this.props
    return (
      <div className={styles.outerField}>
         <div className={styles.title}>
         对不合格的反馈消息页面
          </div>
          <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
        <div className={styles.out}> 
          <div className={styles.lineOut1}>
            <span className={styles.lineKey}>
               安全主体
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{this.props.taskList[0].assetsName}</span>
          </div>
           <div className={styles.lineOut2}>
            <span className={styles.lineKey}>
               所属区域
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{this.props.taskList[0].assetsArea}</span>
          </div>

          <div className={styles.lineOut1}>
          <span className={styles.lineKey}>
              责任人员
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{this.props.taskList[0].dutyUserName}</span>
          </div>

          <div className={styles.lineOut2}>
            <span className={styles.lineKey}>
            所属部门
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{this.props.taskList[0].dutyDeptName}</span>
          </div>

          <div className={styles.lineOuti}>
            <span className={styles.lineKey}>
            情况反馈
            </span>
            <span className={styles.lineColon}>:</span>

            {/* <span className={styles.img1}>
              <img src={this.props.taskList[0].img} />
            </span> */}
          </div>
          <div className={styles.lineOuti}>
            
            <span className={styles.lineColon}></span>
            <span>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
								<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
							</Modal>
							<div style={{width:420,overflow:"hidden", marginLeft: 190}}>
							<PicShow 
									fileList = {examineImgId!=undefined?examineImgId:[]} 
									visible = {this.state.previewVisible} 
									handlePreview = {this.handlePreview}/>
							</div>
                </span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               检查情况
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{this.props.taskList[0].examinState}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            建议
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{this.props.taskList[0].reformOpinion}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            情况等级
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{this.props.taskList[0].problemLevel=="severe"?"严重":(
              this.props.taskList[0].problemLevel=="poor"?"差":(
                this.props.taskList[0].problemLevel=="average"?"一般":(
                  this.props.taskList[0].problemLevel=="mild"?"轻微":(
                    this.props.taskList[0].problemLevel=="good"?"好":(
                      this.props.taskList[0].problemLevel=="well"?"良好":(
                        this.props.taskList[0].problemLevel=="perfect"?"非常好":""
                      )
                    )
                  )
                )
              )
            )}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               截止时间
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{this.props.taskList[0].endTime}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               整改情况
            </span>
            <span className={styles.lineColon}>:</span>
          
          </div>
          {
            this.props.taskList[0].reformSet.map((person,k) => {
              return (
                <div key={k}>
                  <div className={styles.lineOut}>
                          <span className={styles.lineKey}>
                            
                          </span>
                          <span className={styles.lineColon}></span>
                          {/* {
                            person.img.split(",").map((person,k) => {
                              return (
                                <span key={k} className={styles.img1}>
                                  <img src={person} />
                                </span>
                              )
                            })
                          } */}
                            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                              <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                            </Modal>
                            <div style={{width:420, minHeight: '300px', marginLeft: 200}}>
                            <PicShow 
                                fileList = {examineImgId!=undefined?examineImgId:[]} 
                                visible = {this.state.previewVisible} 
                                handlePreview = {this.handlePreview}/>
                            </div>
                          
                    </div>
                        <div className={styles.lineOut}>
                          <span className={styles.lineKey}>
                            描述
                          </span>
                          <span className={styles.lineColon}>:</span>
                          <span>{person.appraiseDesc}</span>
                        </div>
                        <div className={styles.lineOut}>
                          <span className={styles.lineKey}>
                            评价
                          </span>
                          <span className={styles.lineColon}>:</span>
                          <span>{person.appraiseContent}</span>
                        </div>
                </div>
               
              )
            })
          }
          
        </div>
        {taskList[0].infoState==0? 
        <div className={styles.out2}>
          <div className={styles.lineOut}>
              <span className={styles.lineKey}>
              整改说明
              </span>
              <span className={styles.lineColon}>:</span>
           <div style = {{width: 300,marginLeft: 10, marginTop: 13}}>
                              <FileUpload dispatch={this.props.dispatch} fileList ={examineImgId}  loading = {this.props.loading}
                              pageName='duibuhegefankui' len = {this.props.examineImgId && this.props.examineImgId.length}/>
                            </div>
                            <Modal visible={this.props.previewVisible} footer={null} onCancel={()=>this.returnModel('handleCancel')}>
                                <img alt="example" style={{ width: '100%' }} src={this.props.previewImage} />
                            </Modal>
          
            </div>
            <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               描述
            </span>
            <span className={styles.lineColon}>:</span>
            <Input style={{width:'300px'}} value={this.state.inputvalue} onChange={this.returnInput}/>
          </div>
          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSubmit} onClick={()=>this.returnModel2()}>提交</Button>
            </div>
          </div>

          </div>
          :""}
      </div>
    )
  }
}

const form1 = Form.create()(duibuhegefankui);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.duibuhegefankui,
    ...state.duibuhegefankui
  };
}
export default connect(mapStateToProps)(form1);
