/**
 * 作者：郭银龙
 * 日期：2020-5-8
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：督查反馈
 */
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
import { Select, Input, DatePicker, Radio, Button, Icon, Popconfirm, Tooltip,Form,Upload} from "antd";
import PicShow from './picShow';
const { Option } = Select;


class SealComApply extends React.Component {
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



  render(){
    const{taskList,examineImgId}=this.props
    return (
      <div className={styles.outerField}>
         <div className={styles.title}>
         员工督查反馈
          </div>
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
							<div style={{width:420, minHeight: '300px', marginLeft: 200}}>
							<PicShow 
									fileList = {examineImgId!=undefined?examineImgId:[]} 
									visible = {this.state.previewVisible} 
									handlePreview = {this.handlePreview}/>
							</div>
          </div>
         
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               督查建议
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{this.props.taskList[0].situation}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            通知内容
            </span>
            <span className={styles.lineColon}>:</span>
            <Input style={{width:'300px'}} value={this.state.value1} onChange={this.onChange1}/>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            抄送
            </span>
            <span className={styles.lineColon}>:</span>
                            <Select 
                            //  value={this.state.value2}
                              onChange={this.onChange2} style={{ minWidth: "200px", maxWidth: 570 }}
								placeholder = "请选择">
								<Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="tom">Tom</Option>
							</Select>
                              {/* <Select
                                    defaultValue="请选择"
                                    style={{ width: '200px', marginTop: '20px', marginLeft: '-5px' }}
                                    onChange={this.changeTypeName}
                                    >
                                    {(goodsListType || []).map((item, index) => {
                                        return (
                                        <Option value={item.typeId} key={DataUtils.generateKey(index)}>{item.typeName}</Option>
                                        )
                                    })}
                                    </Select> */}
                                {/* <Col span={8}>
                                    <Select
                                    defaultValue="请选择"
                                    style={{ width: '200px', marginTop: '20px' }}
                                    onChange={this.changeGoodsName}
                                    >
                                    {goodsNames}
                                    </Select>
                                </Col> */}
          </div>

         
          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSubmit} onClick={this.returnFk}>反馈</Button>
              <Button type="primary" className={styles.buttonSubmit} onClick={this.returnTz}>通知责任人员</Button>
              <Button type="primary" className={styles.buttonSubmit} onClick={this.returnJs}>结束流程</Button>
            </div>
          </div>

          </div>
      </div>
    )
  }
}

const form1 = Form.create()(SealComApply);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.sealComApply,
    ...state.sealComApply
  };
}
export default connect(mapStateToProps)(form1);
