/**
 * 作者：郭银龙
 * 创建日期： 2020-10-08
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件发布填报
 */
 
import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import {  Button,Input,DatePicker,Select,Table,Popconfirm,TreeSelect,Icon,message } from 'antd'
import styles from './setNewstyle.less'
import moment from 'moment';
import FileUpload from './import.js';   
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD HH:mm:ss'; 
 class feedbackFilling extends React.PureComponent {
  state={
  }
    returnModel =(value,value2)=>{
        let saveData = {
            startTime: this.props.startTime,
        }
        if(value2!==undefined){
            this.props.dispatch({
                type:'feedbackFilling/'+value,
                record : value2,
                saveData,
            })
        }else{
            this.props.dispatch({
                type:'feedbackFilling/'+value,
            })
        }
    };
    //得到时间保存时间
    changeDate = (date,dateString) => {
      this.props.dispatch({
        type:"feedbackFilling/changeDate",
        dateString
      });
          };
  
 
	//----------------------页面渲染----------------------//
	render() {
        const {  qudaoDataList,manuscriptNameList} = this.props;
        // 愿稿件名称列表
        let manuscriptList = manuscriptNameList.length === 0 ? [] : manuscriptNameList.map((item,index) => {
          return <Option  value={item.newsId}>{item.newsName}</Option>
        })
    
     //渠道
     qudaoDataList.length == 0 ? [] : qudaoDataList.map((item,index) => { 
      item.key = index;
      item.title = item.channelName
      item.value = item.id
      item.disabled = true;
      item.children.map((v, i) => {
      v.key = index + '-' + i;
      v.title = v.channelName
      v.value = v.channelName
      })
    });
    const  columns1 = [
      {
        title: '序号',
        dataIndex: '',
        width: '8%',
        key:'index',
        render: (text, record, index) => {
          return (<span>{index+1}</span>);
        },
      }, {
        title: '文件名称',
        dataIndex: 'upload_name',
        key:'key',
        width: '40%',
        render: (text) => {
          return <div style={{ textAlign: 'left' }}>{text}</div>;
        },
      }, {
        title: '操作',
        dataIndex: '',
        key:'opration',
        width: '22%',
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              <Popconfirm
                title="确定删除该文件吗?"
                // onConfirm={(e) => this.deleteUpload(e,record)}
                onConfirm={(e)=>this.returnModel('deleteEvidenceFile',record)}
              >
                <Button
                  type="primary"
                  size="small"
                >
                  删除
                </Button>
              </Popconfirm>
  
  
            </div>
          );
        },
      }, 
    ]
    const  columns2 = [
      {
        title: '序号',
        dataIndex: '',
        width: '8%',
        key:'index',
        render: (text, record, index) => {
          return (<span>{index+1}</span>);
        },
      }, {
        title: '文件名称',
        dataIndex: 'upload_name',
        key:'key',
        width: '40%',
        render: (text) => {
          return <div style={{ textAlign: 'left' }}>{text}</div>;
        },
      }, {
        title: '操作',
        dataIndex: '',
        key:'opration',
        width: '22%',
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              <Popconfirm
                title="确定删除该文件吗?"
                // onConfirm={(e) => this.deleteUpload(e,record)}
                onConfirm={(e)=>this.returnModel('deleteEvidenceFile2',record)}
              >
                <Button
                  type="primary"
                  size="small"
                >
                  删除
                </Button>
              </Popconfirm>
  
  
            </div>
          );
        },
      }, 
    ]

	return(
            
            <div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>稿件发布反馈填报</h2>
                        <div style = {{overflow:"hidden",margin:"20px" }}>
                                <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b> 原稿件名称
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            {/* <Input style={{width:'570px'}} placeholder = "请输入" value={this.props.theme}  onChange={(e)=>this.returnModel('theme',e)}/> */}
                                            <Select
                                                showSearch
                                                style={{ minWidth: 200 ,maxWidth:500}}
                                                placeholder="请选择"
                                                value={this.props.theme} 
                                                onChange={(e)=>this.returnModel('theme',e)}
                                              >
                                                {manuscriptList}
                                              </Select>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b> 发布稿件标题
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <Input style={{width:'570px'}} placeholder = "请输入" value={this.props.title}  onChange={(e)=>this.returnModel('title',e)}/>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b>发布时间
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <span>
                                            <DatePicker onChange = {this.changeDate} 
                                                      placeholder="发布时间"
                                                      format="YYYY-MM-DD HH:mm:ss"
                                                      showTime={{ defaultValue: moment('YYYY/MM/DD HH:mm:ss') }}
                                                      style = {{width:200, marginRight:10}}
                                                      value={this.props.startTime == '' ? null : moment(this.props.startTime, dateFormat)}
                                                      />
                                            </span>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                                <b className={styles.lineStar}>*</b>
                                                发布渠道
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                        <TreeSelect
                                            showSearch
                                            value={this.props.channelValue}
                                            style={{ minWidth: "200px", maxWidth: 940 }}
                                            dropdownStyle={{ maxHeight: 500, minHeight: 200,width: 540 , overflow: 'auto' }}
                                            placeholder="请选择"
                                            treeData={qudaoDataList}
                                            allowClear
                                            multiple
                                            treeDefaultExpandAll
                                            onChange={(e)=>this.returnModel('onChannel',e)}
                                        >
                                        </TreeSelect>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b> 发布稿件信息
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <FileUpload dispatch={this.props.dispatch} passFuc = {this.saveData} pageName='saveUploadFile'/>
                                            <Table
                                            columns={ columns1 }
                                            loading={ this.props.loading }
                                            dataSource={ this.props.tableUploadFile }
                                            className={ styles.orderTable }
                                            pagination = { false }
                                            style={{width:500,marginTop:'10px',marginLeft:200}}
                                            bordered={ true }
                                            />
                                            
                                    </div>
                                    <div className={styles.lineOut}>
                                        <span className={styles.lineKey}>
                                            <b className={styles.lineStar}></b> 稿件影响力统计
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <FileUpload dispatch={this.props.dispatch} passFuc = {this.saveData} pageName='saveUploadFile2'/>
                                            <Table
                                            columns={ columns2 }
                                            loading={ this.props.loading }
                                            dataSource={ this.props.tableUploadFile2 }
                                            className={ styles.orderTable }
                                            pagination = { false }
                                            style={{width:500,marginTop:'10px',marginLeft:200}}
                                            bordered={ true }
                                            /> 
                                    </div>
                                  
                                    <div className = {styles.buttonOut}>
                                                    <Button type="primary"
                                                    onClick={()=>this.returnModel('saveSubmit','提交')}
                                                    >提交</Button>
                                                   
                                                     <Button style = {{marginLeft: 5}}  size="default" type="primary" >
                                                      <a href="javascript:history.back(-1)">取消</a>
                                                    </Button>
                                    </div>
                          </div>
               

            </div>
		)
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.feedbackFilling, 
    ...state.feedbackFilling
  };
}
export default connect(mapStateToProps)(feedbackFilling);
