/**
 * 作者：郭银龙
 * 日期：2020-4-29
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：督查建议反馈
 */
import React from 'react'; 
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './fkstyle.less';
import { Select, Input, DatePicker, Radio, Button, Icon, Popconfirm, Tooltip,Form,Upload,Modal} from "antd";
import PicShow from './picShow';
const { Option } = Select;
import { routerRedux } from 'dva/router';



class duchajianyifankui extends React.Component {

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
  this.props.dispatch( routerRedux.push({
    pathname:'/adminApp/securityCheck/Notification',
    query: {
      ontabs:JSON.parse(JSON.stringify(this.props.taskList[0].noticeState))
    }
  }));
   
}
  render(){
    const{taskList,examineImgId}=this.props
    return (
      <div className={styles.outerField}>
         <div className={styles.title}>
         督查反馈
          </div>
          <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
                            <a >返回</a>
                        </Button>
        <div className={styles.out}>
          {taskList.length>0?
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

          {/* <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            情况反馈
            </span>
            <span className={styles.lineColon}>:</span>
           
          </div>
          <div className={styles.lineOut}>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
								<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
							</Modal>
							<div style={{width:420, height:100, marginLeft: 100}}>
							<PicShow 
									fileList = {examineImgId!=undefined?examineImgId:[]} 
									visible = {this.state.previewVisible} 
									handlePreview = {this.handlePreview}/>
							</div>
          </div> */}
         
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

const form1 = Form.create()(duchajianyifankui);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.duchajianyifankui,
    ...state.duchajianyifankui
  };
}
export default connect(mapStateToProps)(form1);
