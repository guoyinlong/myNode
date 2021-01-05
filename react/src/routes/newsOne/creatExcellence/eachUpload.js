/**
 * 作者：韩爱爱
 * 日期：2020-11-03
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：争优创先首页-优秀新闻宣传组织者/个人
 */
import React, { Component } from 'react'
import {connect} from "dva";
import styles from "../style.less";
import {Tabs, Table, Button, Col, Icon, Input, message, Row, Select, TreeSelect, Upload, Pagination} from "antd";
import Cookie from "js-cookie";
const { TextArea } = Input;
const { TabPane } = Tabs;
class eachUpload extends Component {
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
      importFile:{
        name: 'file',
        accept:'.xls,.xlsx',
        multiple: false,
        showUploadList: false,
        action: '/microservice/newsmanager/evaluateUpload',
        data:{
          uploadTime:this.props.year,//时间
          type:this.props.pageFlag
        },
      }
    }
  }
  //添加-删去
  returnModel =(value,value2,value3)=>{
    let saveData = {
      startTime: this.props.startTime,
    };
    let outputHTML =this.state.outputHTML;
    if(value2!==undefined){
      this.props.dispatch({
        type:'eachUpload/'+value,
        record : value2,
        saveData,
        outputHTML,
        name : value3,
      })
    }else{
      this.props.dispatch({
        type:'eachUpload/'+value
      })
    }
  };
//导入表格
  imporDataColumns = [
    {
      key: 'key',
      dataIndex: 'key',
      title: '序号',
      width:'5%',
      render:(text, record, key)=>{
        return (<span>{key+1}</span>)
      }
    },
    {
      key: 'image',
      dataIndex: 'image',
      title: '照片',
      width:'10%',
      render: (text, record)=> {
        return (
          <div>
            <Upload
              {...this.state.uploadFile}
              listType="picture-card"
              className="avatar-uploader"
              beforeUpload={this.beforeUpload}
              onChange={(info)=>this.returnModel('imgChange',info.file,record)}
            >
              {text.length != '0'?
                <img src={text.RelativePath}  alt="avatar" style={{ width: '100%'}} />
                :
                <div>
                  <Icon type={this.props.loading[record.key] ? 'loading' : 'plus'} />
                  <div>请上传图片</div>
                </div>
              }
            </Upload>
          </div>
        )
      }
    },
    {
      key: 'name',
      dataIndex: 'name',
      width:'10%',
      title: '姓名'
    },
    {
      key: 'deptName',
      dataIndex: 'deptName',
      title: <div>优秀新闻宣传{this.props.pageFlag == 'o'?'组织者': '个人'}单位</div>,
      width:'15%',
    },
    {
      key: 'comment',
      dataIndex: 'comment',
      title: '事迹介绍或评语',
      width:'20%',
    },
    {
      key: '',
      dataIndex: '',
      title: '操作',
      width:'5%',
      render: (text, record)=> {
        return (
          <div>
            <Button type='primary' size="small" onClick={(e)=> this.returnModel('details', record, e)}>删除</Button>
          </div>
        )
      }
    },
  ];
  //图片格式
  beforeUpload =(file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' ||file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('您只能上传JPG / PNG文件!');
    }
    return isJpgOrPng
  };
  render(){
    let {pageFlag, year,deptData, deptValue,  commentTin, author, pictureListArr,checkContentList, authorBy,selectdept} = this.props;
    //添加-删去
    const  personalUpload = author.length == 0 ? [] :author.map((item, index)=> (
      <div   style={{marginTop:10}} key={index}>
        <Row>
          <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>优秀新闻宣传{pageFlag == 'o'?'组织者': '个人'}：</Col>
          <Col span={9} className={styles.colRight}>
            <TreeSelect
              style={{ minWidth: "100%", maxWidth:"100%"}}
              labelInValue={true}
              value = {selectdept[index]}
              dropdownStyle={{ maxHeight: 800,width: 540, overflow: 'auto' }}
              treeData={deptData}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear ={false}
              onChange={(e)=>this.returnModel('deptValue',e,index)}
            />
          </Col>
          <Col span={2} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>姓名：</Col>
          <Col span={4} className={styles.colRight}>
            <TreeSelect
              showSearch
              style={{ minWidth: "100%", maxWidth: '100%'  }}
              dropdownStyle={{ maxHeight: 500, minHeight: 200,width: 540 , overflow: 'auto' }}
              placeholder="请选择"
              treeData={checkContentList}
              allowClear ={false}
              treeDefaultExpandAll
              value={this.props.authorBy[index]}
              onChange={(e)=>this.returnModel('onAuthorList',e,index)}
            >
            </TreeSelect>
          </Col>
          <Col span={4} className={styles.colRight} style={{marginLeft:'10px'}}>
            <Icon
              style={{marginRight:'10px'}}
              className="dynamic-delete-button"
              type="plus-circle"
              onClick={ (e)=>this.returnModel('add',e,item)}
            />
            { (author).length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={()=>this.returnModel('remove',index) }
              />
            ) : null}
          </Col>
        </Row>
        <div className={styles.opinionAddRoeDiv}>
          <Row>
            <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>事迹介绍或评语：</Col>
            <Col span={9} className={styles.colRight}>
              <TextArea rows={4}
                        style={{width: '100%',resize: "none"}}
                        value = {commentTin[index]}
                        onChange={(e)=>this.returnModel('comment',e.target.value,index)}
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
                onChange={(info)=>this.returnModel('pictureChange',info.file,index)}
              >
                {pictureListArr[index]?
                  <img src={pictureListArr[index].RelativePath}  alt="avatar" style={{ width: '100%',height:'100hv' }} />
                  :
                  <div>
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
    //导入
    const imporData =(
        <div>
          <Table className={styles.orderTable}
                 columns = {this.imporDataColumns}
                 dataSource = {this.props.imporDataList}
                 bordered={true}
                 pagination={{
                   current:Number(this.props.subDataCurrent),
                   total:Number(this.props.subDataCount),
                   pageSize:5,
                   onChange:(e,page) => this.returnModel('handlePageChange',e,page)
                 }}
          />
        </div>
      );
    return (
      <div className={styles.pageContainer}>
        <h2 style = {{textAlign:'center',marginBottom:30}}>评优评选结果上传</h2>
        <div className={styles.opinionAddRoeDiv}>
          <Row>
            <Col span={4} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>时间：</Col>
            <Col span={20} className={styles.colRight}>
              <Input value={year} style={{width: '45%'}} disabled/>
              <Upload
                {...this.state.importFile}
                listType="picture"
                className="avatar-uploader"
                onChange={(info)=>this.returnModel('importClick',info.file)}
              >
                <Button type="primary" style={{marginLeft:'35px'}}>导入</Button>
              </Upload>
            </Col>
          </Row>
        </div>
        <div className={styles.opinionAddRoeDiv}>
          {this.props.showImpor === 'false'?
            personalUpload
            :
            imporData
          }
        </div>
        <div style={{width:'250px',margin:'30px auto'}}>
          <div style={{margin:'0 auto'}}>
            <Button type="primary" style={{marginLeft:'30px'}} onClick={()=>this.returnModel("submissionTopic",'保存')}>提交</Button>
            <Button type="primary" style={{float:'right'}} onClick={()=>this.returnModel("submissionTopic",'取消')}>取消</Button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.eachUpload,
    ...state.eachUpload
  };
}

export default connect(mapStateToProps)(eachUpload);