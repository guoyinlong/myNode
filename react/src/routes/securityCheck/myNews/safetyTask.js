/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：员工整改通知
 */ 
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './tzstyle.less';
import { Select, Input, DatePicker, Radio, Button, Icon, Popconfirm, Tooltip,Form,Upload,Modal} from "antd";
import FileUpload from './setFileUoload';        //上传功能组件
import PicShow from './picShow';
import { routerRedux } from 'dva/router';
  class yuanGongTongZhiZhengGai extends React.Component {
  state = 
  {
    InputValue:"",
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


handleGetInputValue = (event) => {
  this.setState({
    InputValue : event.target.value,
  })
};
handlePost = () => {
  const {InputValue,inforid} = this.state;
  const {examineImgId} =this.props
  // console.log(InputValue,examineImgId,inforid);
  //在此做提交操作，比如发dispatch等
  this.props.dispatch({
    type: 'yuanGongTongZhiZhengGai/Submit',
    // payload: {
         argReform:examineImgId,//图片
        argreformDesc:InputValue ,  //整改描述
        argInfoId:inforid    //消息id
    // },
 
  })
  this.setState({
    InputValue : ""
  })
  
 
};
returnModel =(value,value2)=>{
	let saveData = {
		startTime: this.state.beginTime,
		endTime: this.state.endTime,
		otherOu: this.state.value
	}
	saveData['otherOu'] = (this.props.roleType == '1' || this.props.roleType == '2' ) ? 0 : 1 //除安委办之外涉及分院字段都为0
	if(value2!==undefined){
		this.props.dispatch({
			type:'yuanGongTongZhiZhengGai/'+value,
			record : value2,
			saveData
		})
	}else{
		this.props.dispatch({
			type:'yuanGongTongZhiZhengGai/'+value,
		})
	}
};

componentDidMount() {
  const{inforid}=this.state
  const{arg_state}=this.props.location.query
  this.setState({
    inforid:arg_state
  })
//  console.log(this.state.inforid)
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
    const { taskList,examineImgId,examineImgId2}= this.props
    return (
      <div className={styles.outerField}>

         <div className={styles.title}>
        通知整改
          </div>
           <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
          
    {taskList.length>0?
    
      <div>
        <div className={styles.out}>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               安全主体
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList!=""?taskList[0].assetsName:""}</span>
          </div>

           <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               所属区域
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList!=""?taskList[0].assetsArea:""}</span>
          </div>
  
                     <div className={styles.lineOut}>
                      <span className={styles.lineKey}>
                          责任人员
                        </span>
                        <span className={styles.lineColon}>:</span>
                        <span>{taskList!=""?taskList[0].dutyUserName:""}</span>
                      </div>

                      <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        所属部门
                        </span>
                        <span className={styles.lineColon}>:</span>
                        <span>{taskList!=""?taskList[0].dutyDeptName:""}</span>
                      </div>

         



          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            <h4>情况反馈</h4>
            </span>
            <span className={styles.lineColon}>:</span>
           
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
             
            </span>
            <span className={styles.lineColon3}></span>
            <div className={styles.lineOutimg}>
            <span>
            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
          <div style={{width:420,overflow:"hidden", marginLeft: 90}}>
          <PicShow 
              fileList = { examineImgId2==""?[]:examineImgId2  } 
              visible = {this.state.previewVisible} 
              handlePreview = {this.handlePreview}/>
          </div>
            </span>
        </div>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               检查情况
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{taskList!=""?taskList[0].examinState:""}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            建议
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList!=""?taskList[0].reformOpinion:""}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            情况等级
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{(taskList!=""?taskList[0].problemLevel:"")=="severe"?"严重":(
              (taskList!=""?taskList[0].problemLevel:"")=="poor"?"差":(
                (taskList!=""?taskList[0].problemLevel:"")=="average"?"一般":(
                  (taskList!=""?taskList[0].problemLevel:"")=="mild"?"轻微":(
                    (taskList!=""?taskList[0].problemLevel:"")=="good"?"好":(
                      (taskList!=""?taskList[0].problemLevel:"")=="well"?"良好":(
                        (taskList!=""?taskList[0].problemLevel:"")=="perfect"?"非常好":""
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
            <span>{taskList!=""?taskList[0].endTime.substring(0,16):""}</span>
          </div>
          
        </div>
        
        <div className={styles.out}>
           
          {
            taskList[0].reformSet.map((person,k) => {
              return (
                <div key={k}>
                  <div className={styles.lineOut}>
                          <span className={styles.lineKey}>
                          整改说明
                          </span>
                          <span className={styles.lineColon}>:</span>
                         {person.examineImg.length>0?

                       <div>
                          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                              <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                            </Modal>
                            <div style={{width:420,  marginLeft: 100,}}>
                            <PicShow 
                                fileList = {JSON.parse(person.examineImg)} 
                                visible = {this.state.previewVisible} 
                                handlePreview = {this.handlePreview}/>
                            </div>
                            </div>
                            :""}
                          
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

          {taskList[0].infoState==0?   
          <div> 
          <div className={styles.lineOut}>
              <span className={styles.lineKey}>
              <b className={styles.lineStar}>*</b>
              整改说明
              </span>
              <span className={styles.lineColon}>:</span>
              <div className={styles.pupload}>
              <div style = {{width: 300,marginLeft: 10, marginTop: -18}}>
              <FileUpload dispatch={this.props.dispatch}  fileList ={examineImgId} loading = {this.props.loading} pageName='yuanGongTongZhiZhengGai'
								len = {this.props.examineImgId && this.props.examineImgId.length} />

							</div>
							<Modal visible={this.props.previewVisible} footer={null} onCancel={()=>this.returnModel('handleCancel')}>
                  <img alt="example" style={{ width: '100%' }} src={this.props.previewImage} />
              </Modal>
                 
              </div>
            </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            <b className={styles.lineStar}>*</b>
               描述
            </span>
            <span className={styles.lineColon}>:</span>
            <Input style={{width:'300px'}} value={this.state.InputValue} onChange={this.handleGetInputValue} />
          </div>
          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSubmit} onClick={this.handlePost}>提交</Button>
            </div>
          </div>
          </div>
          
          :""}
         
          </div>
      
             </div>  
  :""}
      
      </div>
    )
  }
}

const form1 = Form.create()(yuanGongTongZhiZhengGai);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.yuanGongTongZhiZhengGai,
    ...state.yuanGongTongZhiZhengGai
  };
}
export default connect(mapStateToProps)(form1);
