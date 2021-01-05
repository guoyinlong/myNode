/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：员工自查任务
 */
import React from 'react';
import {connect } from 'dva';
import styles from './xqstyle.less';
import {Form,Button,Modal} from "antd";
import PicShow from './picShow';
import { routerRedux } from 'dva/router';
class yanGongZiCha extends React.Component {
  constructor(props) {super(props);}
  state={
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
  goBackPage = () => {
    this.props.dispatch( routerRedux.push({
      pathname:'/adminApp/securityCheck/myNews',
      query: {
        ontabs:JSON.parse(JSON.stringify(this.props.taskList[0].infoState))
      }
    }));
     
  }
  render(){
    const {taskList,examineImgId} = this.props 
    return (
      <div className={styles.outerField}>

        <div className={styles.out}>
          <div className={styles.title}>
        员工自查任务
          </div>
          <div className={styles.zhu}>
        注:请前往钉钉端处理
          </div>
          <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
              { taskList.length>0?<div>
                
              
             
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
            
              {taskList[0].taskType==="safeCheck"?"安委办统查"
                    :(taskList[0].taskType==="safeSpotCheck"?"安委办抽查"
                      :(taskList[0].taskType==="specialCheck"?"专项检查"
                          :(taskList[0].taskType==="branchSafeCheck"?"分院统查"
                                  :(taskList[0].taskType==="branchSportCheck"?"分院抽查"
                                          :(taskList[0].taskType==="branchSpecialCheck"?"分院专项检查"
                                                :(taskList[0].taskType==="deptSportCheck"?"部门抽查"
                                                        :(taskList[0].taskType==="staffSelfCheck"?"员工自查":(
                                                          (taskList[0].taskType==="deptSelfCheck"?"部门自查":(
                                                            (taskList[0].taskType==="deptEoCheck"?"部门间互查":(
                                                              (taskList[0].taskType==="deptSafeCheck"?"部门统查":(
                                                                (taskList[0].taskType==="workNotified"?"工作通知":null
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
            <span>{taskList[0].noticeScopetype==0?"本部/分院全员":(
              taskList[0].noticeScopetype==1?"本部全员":(
                taskList[0].noticeScopetype==2?"分院全员":(
                  taskList[0].noticeScopetype==3?"部门全员":"部分可见"
                )
              )
            )}</span>
          </div>
        
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
              是否涉及分院
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].otherOu===0?"涉及":"不涉及"}</span>
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
                             <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                              <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                            </Modal>
                            <div style={{width:420, overflow:"hidden", marginLeft: 90}}>
                            <PicShow 
                                fileList = {examineImgId} 
                                visible = {this.state.previewVisible} 
                                handlePreview = {this.handlePreview}/>
                            </div>
        
          </div>
    
          
      </div>:<div style={{textAlign:'center'}}>暂无数据</div>}
          

          
        </div>
      </div>
    )
  }
}

const form1 = Form.create()(yanGongZiCha);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.yanGongZiCha,
    ...state.yanGongZiCha
  };
}
export default connect(mapStateToProps)(form1);
