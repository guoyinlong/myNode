/**
 * 作者：郭银龙
 * 创建日期： 2020-10-08
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件发布情况详情
 */ 

import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import {  Button, Table} from 'antd'
import styles from './setNewstyle.less'
class releaseDetails extends React.PureComponent {

     //点击下载附件
  downloadUpload = (e,record) =>{
    let url =record.RelativePath;
    window.open(url);
  }; 
	//----------------------页面渲染----------------------//
	render() {
        const {dataList ,tableUploadFile,tableUploadFile2} = this.props;
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
                    <Button
                        type="primary"
                        size="small"
                        onClick={(e) => this.downloadUpload(e,record)}
                        >下载
                    </Button>
        
        
                  </div>
                );
              },
            }, 
          ]
	return(
            
            <div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>稿件发布情况详情</h2>
                        <Button style = {{float: 'right'}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button>
                        {dataList!=""?
                       
                        <div style = {{overflow:"hidden",margin:"20px" }}>
                  
                            <div className={styles.lineOut}>
                                    <span className={styles.lineKey}>
                                    提交人
                                    </span>
                                    <span className={styles.lineColon}>：</span>
                                            {dataList.createByName}
                            </div>
                            <div className={styles.lineOut}>
                                    <span className={styles.lineKey}>
                                    提交单位
                                    </span>
                                    <span className={styles.lineColon}>：</span>
                                            {dataList.deptName}
                            </div>
                            <div className={styles.lineOut}>
                                    <span className={styles.lineKey}>
                                    原稿件名称
                                    </span>
                                    <span className={styles.lineColon}>：</span>
                                            {dataList.newsName}
                            </div>
                            <div className={styles.lineOut}>
                                    <span className={styles.lineKey}>
                                    发布稿件标题
                                    </span>
                                    <span className={styles.lineColon}>：</span>
                                            {dataList.releaseNewsName}
                            </div>
                            <div className={styles.lineOut}>
                                    <span className={styles.lineKey}>
                                    发布时间
                                    </span>
                                    <span className={styles.lineColon}>：</span>
                                            {dataList.startTime}
                            </div>
                            <div className={styles.lineOut}>
                                    <span className={styles.lineKey}>
                                    发布渠道
                                    </span>
                                    <span className={styles.lineColon}>：</span>
                                            {dataList.releaseChannel}
                            </div>
                            <div className={styles.lineOut}>
                                    <span className={styles.lineKey}>
                                    发布稿件信息
                                    </span>
                                    <span className={styles.lineColon}>：</span>
                                    <Table
                                        columns={ columns1 }
                                        loading={ this.props.loading }
                                        dataSource={ tableUploadFile }
                                        className={ styles.orderTable }
                                        pagination = { false }
                                        style={{width:500,marginTop:'10px',marginLeft:200}}
                                        bordered={ true }
                                        />
                            </div>
                            <div className={styles.lineOut}>
                                    <span className={styles.lineKey}>
                                    稿件影响力统计
                                    </span>
                                    <span className={styles.lineColon}>：</span>
                            </div>
                            <div className={styles.lineOut}>
                                        <span className={styles.lineKey}>
                                        </span>
                                        <span className={styles.lineColon}></span>
                                        <Table
                                        columns={ columns1 }
                                        loading={ this.props.loading }
                                        dataSource={ tableUploadFile2 }
                                        className={ styles.orderTable }
                                        pagination = { false }
                                        style={{width:500,marginTop:'10px',marginLeft:200}}
                                        bordered={ true }
                                        />
                            </div>
                            
                        </div>
                    :""}

            </div>
		)
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.releaseDetails, 
    ...state.releaseDetails
  };
}
export default connect(mapStateToProps)(releaseDetails);
