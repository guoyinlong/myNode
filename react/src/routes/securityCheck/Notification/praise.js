/**
 * 作者：郭银龙
 * 日期：2020-5-13
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：表扬
 */
import React from 'react'; 
import {connect } from 'dva';
import styles from './fkstyle.less';
import { Form,Button,Modal} from "antd";
import PicShow from './picShow';
import { routerRedux } from 'dva/router';
class biaoyangye extends React.Component {
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
  console.log(this.props.taskList[0].noticeState,this.props.taskList[0])
  this.props.dispatch( routerRedux.push({
    pathname:'/adminApp/securityCheck/Notification',
    query: {
      ontabs:JSON.parse(JSON.stringify(this.props.taskList[0].noticeState))
    }
  }));
   
}

  render(){
    const{taskList,examineImgId}=this.props
            // console.log(taskList,123456);
    return (
      <div className={styles.outerField}>
         <div className={styles.title}>
         表扬
          </div>
          <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
              {taskList.length>0?
              
           
        <div className={styles.out}>
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
          </div>
          <div className={styles.lineOut}>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
								<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
							</Modal>
							<div style={{width:420,overflow:"hidden", marginLeft: 90}}>
							<PicShow 
									fileList = {examineImgId!=undefined?examineImgId:[]} 
									visible = {this.state.previewVisible} 
									handlePreview = {this.handlePreview}/>
							</div>
          </div>
         
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               检查情况
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{taskList[0].checkCase}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               检查建议
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{taskList[0].advice}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               评价等级
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{
            taskList[0].problemLevel==="severe"?"严重":(
                taskList[0].problemLevel==="poor"?"差":(
                    taskList[0].problemLevel==="average"?"一般":(
                        taskList[0].problemLevel==="mild"?"轻微":(
                            taskList[0].problemLevel==="good"?"好":(
                                taskList[0].problemLevel==="well"?"良好":(
                                    taskList[0].problemLevel==="perfect"?"非常好":null
                                )
                            )
                        )
                    )
                )
            )
            }</span>
          </div>
          </div>
          :""}
      
      
      </div> 
    )
  }
}
const form1 = Form.create()(biaoyangye);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.biaoyangye,
    ...state.biaoyangye
  };
}
export default connect(mapStateToProps)(form1);
