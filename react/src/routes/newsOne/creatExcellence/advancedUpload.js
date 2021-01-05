/**
 * 作者：窦阳春
 * 日期：2020-10-13 
 * 邮箱：douyc@itnova.com.cn
 * 功能：争优创先首页-新闻宣传先进集体/单位
 */
import React, { Component } from 'react'
import {connect } from 'dva';
import {
  Row,
  Col,
  TreeSelect,
  Input,
  Button,
  Upload,
  message, Icon
} from 'antd';
const { TextArea } = Input;
import styles from '../../newsOne/style.less'
import Cookie from "js-cookie";
class AdvancedUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outputHTML: '', // 编辑器输出内容
      value: this.props.checkValue,
      uploadFile:{
        name: 'filename',
        multiple: true,
        showUploadList: false,
        action: '/filemanage/fileupload',
        data:{
          argappname:'writeFileUpdate',
          argtenantid:Cookie.get('tenantid'),
          arguserid:Cookie.get('userid'),
          argyear:new Date().getFullYear(),
          argmonth:new Date().getMonth()+1,
          argday:new Date().getDate()
        },
      },
    }
  }
  materialModel =(value,value2,value3)=>{
    let saveData = {
      startTime: this.props.startTime,
    };
    let outputHTML =this.state.outputHTML;
    if(value2!==undefined){
      this.props.dispatch({
        type:'advancedUpload/'+value,
        record : value2,
        saveData,
        outputHTML,
        name : value3,
      })
    }else{
      this.props.dispatch({
        type:'advancedUpload/'+value,
      })
    }
  };
  //图片格式
  beforeUpload =(file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' ||file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('您只能上传JPG / PNG文件!');
    }
    return isJpgOrPng
  }
  render() {
    let {pageFlag, year,deptData, selectdept, commentTin, author, pictureListArr, } = this.props;
    const mateIstems=author.length == 0 ? [] :author.map((item, index)=>(
      <div   style={{marginTop:10}} key={index}>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>新闻宣传先进{pageFlag == 'u'?'单位': '集体'}：</Col>
          <Col span={9} className={styles.colRight}>
            <TreeSelect
              style={{ width: "100%" }}
              labelInValue={true}
              value = {selectdept[index]}
              dropdownStyle={{ maxHeight: 800, overflow: 'auto' }}
              treeData={deptData}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear ={false}
              onChange={(e)=>this.materialModel('deptValue', e,index)}/>
          </Col>
          <Col span={4} className={styles.colRight} style={{marginLeft:'10px'}}>
            <Icon
              style={{marginRight:10}}
              className="dynamic-delete-button"
              type="plus-circle"
              onClick={ (e)=>this.materialModel('add',e,item)}
            />
            {(author).length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={()=>this.materialModel('remove',index) }
              />
            ) : null}
          </Col>
        </Row>
        <div className={styles.opinionAddRoeDiv}>
          <Row>
            <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>事迹介绍或评语：</Col>
            <Col span={8} className={styles.colRight}>
              <TextArea rows={4}
                        style={{width: '100%',resize: "none"}}
                        value = {commentTin[index]}
                        onChange={(e)=>this.materialModel('comment',e.target.value,index)}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.opinionAddRoeDiv}>
          <Row>
            <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>照片展示：</Col>
            <Col span={8} className={styles.colRight}>
              <Upload
                {...this.state.uploadFile}
                listType="picture-card"
                className="avatar-uploader"
                beforeUpload={this.beforeUpload}
                onChange={(info)=>this.materialModel('pictureChange',info.file,index)}
              >
                {pictureListArr[index]?
                  <img src={pictureListArr[index].RelativePath}  alt="avatar" style={{ width: '100%' ,height:'100%'}} />
                  :
                  <div >
                    <Icon type={this.props.loading[index] ? 'loading' : 'plus'} />
                    <div>请上传图片</div>
                  </div>
                }
              </Upload>
            </Col>
          </Row>
        </div>
      </div>
    ));
    return (
        <div className={styles.pageContainer}>
          <h2 style = {{textAlign:'center',marginBottom:30}}>评优评选结果上传</h2>
          <div className={styles.opinionAddRoeDiv}>
            <Row>
              <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>时间：</Col>
              <Col span={20} className={styles.colRight}>
                <Input value={year} style={{width: '45%'}} disabled/>
              </Col>
            </Row>
            {mateIstems}
          </div>
          <div style={{width:'250px',margin:'20px auto'}}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" style={{marginLeft:'30px'}} onClick={()=>this.materialModel("submissionTopic",'提交')}>提交</Button>
              <Button type="primary" style={{float:'right'}} onClick={()=>this.materialModel("submissionTopic",'取消')}>取消</Button>
            </div>
          </div>
        </div>
      //  </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.advancedUpload, 
    ...state.advancedUpload
  };
}

export default connect(mapStateToProps)(AdvancedUpload);
