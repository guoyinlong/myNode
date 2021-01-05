/*
*项目计划文档下载
*Author: 任金龙
*Date: 2017年11月13日
*Email: renjl33@chinaunicom.cn
*/
import React from 'react';
import {connect} from 'dva';
import { Upload,Table,Select,Icon, Button , Menu, Tabs, Popconfirm, message } from 'antd';
import styles from './planInfo.less';
import Cookie from 'js-cookie';

import { routerRedux } from 'dva/router';

const Option = Select.Option;

/**
 * 序号
 * @param record
 * @param index
 * @returns {*}
 */
function projIndex(record, index) {
  if(record.level == 0 ){
    return index + 1;
  }else{
    return ((index + 1).toString());
  }
}

class projPlanDocDownload extends React.Component {
  constructor(props) {super(props);}
  state = {
    ou:'',
    dept:'',
    deptProj:'',
    projPlanType:'项目计划',
    uploadFile: {
      name: 'filename',
      multiple: false,
      showUploadList: false,
      action: '/filemanage/fileupload',
      beforeUpload: false,
      data: {
        argappname: 'projectFile',
        argtenantid: Cookie.get('tenantid'),
        arguserid: Cookie.get('userid'),
        argyear: new Date().getFullYear(),
        argmonth: new Date().getMonth() + 1,
        argday: new Date().getDate(),
      },
      onChange: (info) => {
        const status = info.file.status;
        let objFile = {};
        if (status === 'done') {
          if (info.file.response.RetCode == '1') {
            objFile.arg_doc_name = info.file.response.filename.OriginalFileName;
            objFile.arg_doc_byname = info.file.response.filename.OriginalFileName.split('.')[0];
            objFile.arg_doc_path = info.file.response.filename.RelativePath;
            objFile.arg_doc_url = info.file.response.filename.AbsolutePath;
            objFile.arg_doc_type=this.state.projPlanType;
            objFile.arg_doc_usrid=Cookie.get("staff_id");
            objFile.arg_doc_usrname=Cookie.get("username");
            objFile.arg_upload_time=new Date().getFullYear()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getDate();
            objFile.arg_projId=Cookie.get("projId");
            objFile.projPlanType=this.state.projPlanType;
           // console.log("======================")
            const {dispatch}=this.props;
            dispatch({
              type:'projPlanDocDownload/docInsert',
              query:objFile,
            });

          } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            return false;
          }
        }
      }
    }
  };

  //返回项目查询列表
  goBack = ()=> {
    let query={}
    query["postData"]=JSON.stringify(this.props.postData);
    query["condCollapse"]=this.props.condCollapse;
    //console.log("==="+this.props.condCollapse)
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/projectApp/projPrepare/projPlan',
      query:query,
    }));
  };

  /**
   * 当类型发生改变时
   */
  handleTypeChange = (value) => {
    this.setState ({
      projPlanType:value,
    });
    let params={};
    params["projId"]=Cookie.get("projId");
    params["projPlanType"]=value;
    const {dispatch} = this.props;
    dispatch({
      type:'projPlanDocDownload/searchDoc',
      arg_param: params
    });
  };
  /**
   * 取消确认
   * @param e
   */
   cancel2 = (e) =>{
     //console.log("hello")
   };
   /**
   * 删除文档
   * @param value
   */
   deleteDoc = (value) => {
    //debugger;
     let params={};
    params["doc_id"]=value;
    params["projId"]=Cookie.get("projId");
    params["projPlanType"]=this.state.projPlanType;
    //console.log(params);
    const {dispatch} = this.props;
    dispatch({
      type:'projPlanDocDownload/deleteDoc',
      arg_param: params
    });
  };

  columns = [
    {
      title:'序号',
      dataIndex: 'i',
      key:'i',
      render: (text, record, index) => projIndex(record, index)
    },
    {
      title:'文档类型',
      dataIndex:'doc_type',
      key:'doc_type'
    },
    {
      title:'文档名称',
      dataIndex:'doc_name',
      key:'doc_name',
    },
    {
      title:'上传时间',
      dataIndex:'upload_time',
      key:'upload_time',
    },
    {
      title:'上传者',
      dataIndex:'doc_usrname',
      key:'doc_usrname',
    },
    {
      title: '操作',
      dataIndex: '',
      key:'operation',
      render: (text, record) => <span><a href={record.doc_path}>下载</a>&nbsp;{(this.props.ismgr)?<Popconfirm title="确定删除此文档?"  onConfirm={() => this.deleteDoc(record.doc_id)} onCancel={this.cancel2} okText="确定" cancelText="取消">
        <Icon type='delete' />
      </Popconfirm>:null}
      </span>},
  ];

  render() {
    const{loading,dispatch,projPlanDocList,ismgr,isou,projName,isInOu} = this.props;

    projPlanDocList.map((item,index)=>{
      item.key = index;
    });
    return (
      <div className={styles.meetWrap}>
            <div style={{paddingTop:13,paddingBottom:12,background:'white'}}>
              <div><p style={{textAlign:'center',fontSize:'25px',fontWeight:600,marginBottom:'10px'}}>{projName}</p></div>
              <div >
                   <span>文档类型：</span>
                   <Select  style={{width: 220}}  optionFilterProp="children" notFoundContent="无法找到" searchPlaceholder="输入关键词" onSelect={this.handleTypeChange} value={this.state.projPlanType}>
                         <Option value="项目计划">项目计划</Option>
                         <Option value="评审记录文档">评审记录文档</Option>
                   </Select>
                   {
                     (ismgr)?
                        <Upload {...this.state.uploadFile}>
                          <Button type="primary" style={{marginLeft:'10px'}}>
                            <Icon type="upload" /> {'选择文件'}
                          </Button>
                        </Upload>
                       :null
                   }
                   <Button type="primary" htmlType="submit" style={{float:'right'}}
                        onClick={this.goBack}>返回</Button>
              </div>
            </div>
              <div >
                  <Table columns={this.columns}
                       dataSource={projPlanDocList}
                       pagination={false}
                       className={styles.orderTable}
                       loading={loading}
                       bordered={true}
                   />
              </div>
            </div>

    );
  }
}
function mapStateToProps (state) {
  const {
    postData,
    projPlanDocList,
    total,
    currentPage,
    ismgr,
    isshowmgr,
    isou,
    projName,
    isInOu,
    condCollapse
  } = state.projPlanDocDownload;
  return {
    loading: state.loading.models.projPlanDocDownload,
    postData,
    projPlanDocList,
    total,
    currentPage,
    isshowmgr,
    ismgr,
    isou,
    projName,
    isInOu,
    condCollapse
  };
}

export default connect(mapStateToProps)(projPlanDocDownload);
