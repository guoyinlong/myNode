/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：安全检查通知详情页
 */
import React from 'react';
import Cookie from 'js-cookie';
import {connect } from 'dva';
import styles from './xqstyle.less';
import {Form,Button,Modal} from "antd";
import PicShow from './picShow';
import { routerRedux } from 'dva/router';




class anquanjianchatongzhixiangqing extends React.Component {
  state =  {
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
goBackPage = () => {
  // console.log(this.props.taskList[0].noticeState,this.props.taskList[0])
  this.props.dispatch( routerRedux.push({
    pathname:'/adminApp/securityCheck/Notification',
    query: {
      ontabs:JSON.parse(JSON.stringify(this.props.taskList[0].noticeState))
    }
  }));
   
}

  render(){

const{taskList,examineImgId}=this.props
// console.log(examineImgId,12345);
    return (
      
      <div className={styles.outerField}>

        <div className={styles.title}>
        安全检查通知
          </div>
         <Button style = {{float: 'right',marginRight:"10%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a>返回</a>
							</Button>
          {this.props.taskList.length>0?
        <div className={styles.out}> 
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               发布人
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].createUserName}</span>
          </div>
           <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               检查时间
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].startTime.substring(0,16)}～{taskList[0].endTime.substring(0,16)}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               创建时间
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].createTime.substring(0,16)}</span>
          </div>
          <div className={styles.lineOut}>
          <span className={styles.lineKey}>
            检查主题
            </span>
            <span className={styles.lineColon}>:</span>
    <span> {taskList[0].taskTitle}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            检查方式
            </span>
            <span className={styles.lineColon}>:</span>
            <span>
            
              {taskList[0].taskType=="safeCheck"?"安委办统查"
                    :(taskList[0].taskType=="safeSpotCheck"?"安委办抽查"
                      :(taskList[0].taskType=="specialCheck"?"专项检查"
                          :(taskList[0].taskType=="branchSafeCheck"?"分院统查"
                                  :(taskList[0].taskType=="branchSportCheck"?"分院抽查"
                                          :(taskList[0].taskType=="branchSpecialCheck"?"分院专项检查"
                                                :(taskList[0].taskType=="deptSportCheck"?"部门抽查"
                                                        :(taskList[0].taskType=="staffSelfCheck"?"员工自查":(
                                                          (taskList[0].taskType=="deptSelfCheck"?"部门自查":(
                                                            (taskList[0].taskType=="deptEoCheck"?"部门间互查":(
                                                              (taskList[0].taskType=="deptSafeCheck"?"部门统查":(
                                                                (taskList[0].taskType=="workNotified"?"工作通知":null
                                                              )
                                                            )
                                                          )
                                                        ))
                                                  )
                                            )
                                      )
                                )
                        )
                    
              )))))
                }</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               检查对象
            </span>
            <span className={styles.lineColon}>:</span>
              <span>{taskList[0].examineObj}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               通知对象
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{(taskList[0].noticeScopetype)=="0"?"本部/分院全员":(
                    (taskList[0].noticeScopetype)=="1"?"本部全员":(
                      (taskList[0].noticeScopetype)=="2"?"分院全员":(
                        (taskList[0].noticeScopetype)=="3"?"部门全员":"部分可见"
              
                        )
                    
                      )
            )}</span>
          </div>       
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
              是否涉及分院
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{(taskList[0].otherOu)=="0"?"涉及":"不涉及"}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            检查要求
            </span>
            <span className={styles.lineColon}>:</span>
              <span>{taskList[0].demand}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            检查内容
            </span>
            <span className={styles.lineColon}>:</span>
           <span>{taskList[0].examineContent}</span>
          </div>   
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            检查规范
            </span>
            <span className={styles.lineColon}>:</span>            
          </div>
          <div className={styles.lineOut}>
          <span className={styles.lineKey}>
            </span>
           <span>
           
              <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
								<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
							</Modal>
							<div style={{width:420,  marginLeft: 200}}>
							<PicShow 
									fileList = {examineImgId!=undefined?examineImgId:[]} 
									visible = {this.state.previewVisible} 
									handlePreview = {this.handlePreview}/>
							</div>
         
          </span>
        
          </div>
    
        </div>
      
:""}

      </div>
    )
  }
}

const form1 = Form.create()(anquanjianchatongzhixiangqing);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.anquanjianchatongzhixiangqing,
    ...state.anquanjianchatongzhixiangqing
  };
}
export default connect(mapStateToProps)(form1);
