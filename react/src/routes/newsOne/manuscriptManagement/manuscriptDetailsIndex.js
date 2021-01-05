/**
 * 作者：郭银龙
 * 日期：2020-9-28
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：稿件详情
 */ 

import React  from 'react';
import {connect } from 'dva';
import {  Tabs,Button,Table,Modal,Input} from "antd";
const { TabPane } = Tabs;
const { TextArea } = Input;
import styles from './setNewstyle.less'
import PicShow from './picShow';

class manuscriptDetails extends React.PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    visible: false,//modole显示
}

    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
    this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
    });
    }
  //点击下载附件
  downloadUpload = (e,record) =>{
    let url =record.RelativePath;
    window.open(url,"_self");
  }; 

    callback=(e)=> {
        if(e==1){
            // this.props. dispatch({
            //     type:"manuscriptDetails/gaojiandetail",
            //   })
        }else if(e==2){
            this.props. dispatch({
                type:"manuscriptDetails/gaojianhuanjie",
              })
        }
      }

  //退回
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  //确定
  handleOk = () => {
    this.setState({
      visible: false, 
    });
    this.props.dispatch({
        type: "manuscriptDetails/handle", 
    })
  };
//取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  //回退原因填写
  returnModel =(value,value2)=>{
    if(value2!==undefined){
        this.props.dispatch({
            type:'manuscriptDetails/'+value,
            record : value2,
        })
    }else{
        this.props.dispatch({
            type:'manuscriptDetails/'+value,
        })
    }
};
	//----------------------页面渲染----------------------//
	render() {
        const{gaojianList,reportList,auth,examineImgId,outputHTML,tableUploadFile}=this.props
        const columns = [
          {  
              title: "序号",
              key:(text,record,index)=>`${index+1}`,
              render:(text,record,index)=>`${index+1}`,
          },
          {  
              title: "状态",
              dataIndex: "failUnm",
              key: "failUnm",
             
          },
          {
              title: "环节名称",
              dataIndex: "taskName",
              key: "taskName",
             
          },
          {
              title: "审批人",
              dataIndex: "userName",
              key: "userName",
             
          },
          {
              title: "审批意见",
              dataIndex: "commentDetail",
              key: "commentDetail",
             
          },
          {
              title: "审批时间",
              dataIndex: "commentTime",
              key: "commentTime",
             
          },
          // {
          //     title: "审批时长",
          //     dataIndex: "createTime",
          //     key: "createTime",
             
          // },
      ];
        const columns2 = [
            {  
                title: "序号",
                key:(text,record,index)=>`${index+1}`,
                render:(text,record,index)=>`${index+1}`,
            },
            {  
                title: "宣传事项",
                dataIndex: "xuanchuanshixiang",
                key: "xuanchuanshixiang",
               
            },
            {
                title: "频次",
                dataIndex: "pinci",
                key: "pinci",
               
            },
            {
                title: "备注",
                dataIndex: "beizhu",
                key: "beizhu",
               
            }
            
        ];
         //附件上传
         const  columnsv = [
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
                <h2 style = {{textAlign:'center',marginBottom:30}}>稿件详情</h2>
               
						<Button style = {{float: 'right', marginLeft:10}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button>
            
            {this.props.pass=="1"?"":
            <span>
                {this.props.taskName=="项目经理审核"||this.props.taskName=="支部书记审核"||this.props.taskName=="部门经理审核"?
                  <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel('onAgree',"true")}size="default" type="primary" >
                  跳过分院主管院长
                </Button>:""
                }
                {this.props.taskName=="分院办公室新闻宣传审核员审核"? 
                  <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel('onAgree',"true")}size="default" type="primary" >
                  跳过分院办公室主任
                </Button>
                :""
                } 
               {this.props.type=="审核"?
                <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel('onAgree',gaojianList.news.id)}size="default" type="primary" >
                同意
              </Button>
              :""}
            
              {this.props.taskName=="本部新闻宣传员从新闻宣传资源池选择稿件（紧急）"||this.props.taskName=="本部新闻宣传员从新闻宣传资源池选择稿件"
              ?
                ""
              :(this.props.type=="审核"?
              <Button style = {{float: 'right'}} onClick={()=>this.showModal()}  size="default" type="primary" >
                退回
              </Button>
              :"")}
              
            </span>
           }
              <Modal
                  title="退回原因"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  >
                    <TextArea value={this.props.tuihuiValue} rows={4} 
                    onChange={(e)=>this.returnModel('tuihui',e.target.value)}/>
              </Modal>
            {gaojianList!=""?
            <Tabs defaultActiveKey="1" 
            onTabClick={(e)=>this.callback(e)}
            style={{clear:"both"}}
            >
            <TabPane tab="稿件审批" key="1">
            <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                      稿件名称
                    </span>
                    <span className={styles.lineColon}>：</span>
                            {gaojianList.news.newsName}
          	</div>
            <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                     新闻事实发生时间
                    </span>
                    <span className={styles.lineColon}>：</span>
                    {gaojianList.news.createTime}
          	</div>
            <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                     提交人
                    </span>
                    <span className={styles.lineColon}>：</span>
                    {gaojianList.news.createByName}
          	</div>
            <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                        申请单位
                    </span>
                    <span className={styles.lineColon}>：</span>
                    {gaojianList.news.deptName}
            </div>
            <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                        审核流程
                    </span>
                    <span className={styles.lineColon}>：</span>
                    {gaojianList.news.auditProcess}
            </div>
            {
                auth.length === 0 ? [] : auth.map((item,index) => { 
                    return  <div className={styles.lineOut} key={index}>
                                    <span className={styles.lineKey}>
                                        {item.authorTypeName}
                                    </span>
                                    <span className={styles.lineColon}>：</span>
                                    {item.authorDeptName}-{item.authorBy}
                            </div>
                        })
            }
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                            稿件类型
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.manuscriptType}
            </div>
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        是否原创
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.isOriginal==true?"是":"否"}
            </div>
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        是否已领取其他专项奖励
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.isReceive==true?"是":"否"}
            </div>
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        素材是否涉密
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.isSecret==true?"是":"否"}
            </div>
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        宣传素材上传
                        </span>
                        <span className={styles.lineColon}>：</span>
                        <Table
                            columns={ columnsv }
                            // loading={ this.props.loading }
                            dataSource={ tableUploadFile}
                            className={ styles.orderTable }
                            pagination = { false }
                            style={{width:500,marginTop:'10px',marginLeft:200}}
                            bordered={ true }
                            /> 
            </div>
            {/* <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        </span>
                        <span className={styles.lineColon}></span>
                        <div style={{width:400,display:"inline-block",marginTop:-30}}>
                            {outputHTML.replace(/<[^>]+>/gi, '')}
                                <span>
                                        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                                        </Modal>
                                        <div style={{width:420,overflow:"hidden", marginLeft: 10}}>
                                        <PicShow 
                                            fileList = {examineImgId!=undefined?examineImgId:[]} 
                                            visible = {this.state.previewVisible} 
                                            handlePreview = {this.handlePreview}/>
                                        </div>
                                </span>
                            </div>
            </div> */}
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        拟宣传渠道
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.pubChannels}
            </div>
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        宣传类型
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.pubType}
            </div>
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        宣传形式
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.pubForm}
            </div>
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        紧急程度
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.isUrgent==true?"紧急":"一般"}
            </div>
            {gaojianList.news.isUrgent==true?
                    <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        紧急原因
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.urgentText}
                    </div>
            :""}
           
            <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        紧是否符合年度宣传计划
                        </span>
                        <span className={styles.lineColon}>：</span>
                        {gaojianList.news.isYearPlan==true?"是":"否"}
            </div> 
            {/* <div className={styles.lineOut}>
                        <span className={styles.lineKey}>
                        </span>
                        <span className={styles.lineColon}></span>
                        <Table 
                        style={{width:400,display:"inline-block"}}
                            key = {gaojianList.news.biaoge.key}
                            columns = {columns2}
                            className = {styles.orderTable}
                            dataSource = {gaojianList.news.biaoge}
                            pagination={false}
                        />
            </div> */}
            
          
                
            </TabPane>
            <TabPane tab="审批环节" key="2" >
            <Table 
                   key = {this.props.key}
                    columns = {columns}
                    className = {styles.orderTable}
                    dataSource = {reportList}
                    pagination={false}
                />
            </TabPane>
           
          </Tabs>
          
       :"" }
          </div>
		)
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.manuscriptDetails, 
    ...state.manuscriptDetails
  };
}
export default connect(mapStateToProps)(manuscriptDetails);
