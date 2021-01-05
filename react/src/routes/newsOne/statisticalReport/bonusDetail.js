/**
 * 作者：郭银龙
 * 创建日期： 2020-10-20
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 加分项详情
 */


import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import {Button,Input,Select,Table ,Tabs,Modal} from 'antd'
import styles from './setNewstyle.less'
const Option = Select.Option;
const { TabPane } = Tabs;
const { TextArea } = Input;
class bonusDetail extends React.PureComponent {
    state = {
        previewVisible: false,
        previewImage: '',
        visible: false,//modole显示 
    }
        //点击下载附件
        downloadUpload = (e,record) =>{
                let url =record.RelativePath;
                window.open(url);
        }; 
        callback=(e)=> {
                if(e==1){
                    this.props. dispatch({
                        type:"bonusDetail/queryUserInfo",
                      })
                }else if(e==2){
                    this.props. dispatch({
                        type:"bonusDetail/gaojianhuanjie",
                        })
                }
            }
        //退回
        showModal = () => {
            // this.props.dispatch({
            //     type: "bonusDetail/setPoints", 
            //     score:e.score,
            // })
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
                type: "bonusDetail/handle", 
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
                    type:'bonusDetail/'+value,
                    record : value2,
                })
            }else{
                this.props.dispatch({
                    type:'bonusDetail/'+value,
                })
            }
        };
	//----------------------页面渲染----------------------//
	render() {
        const {  detailList,reportList} = this.props;
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
                },
                 {
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
	return(
            <div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>加分项详情</h2>
                        <Button style = {{float: 'right',marginLeft:10}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button>
                        {this.props.pass=="1"?"":
                        <span>
                        {this.props.difference=="审核"?
                         <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel('onAgree',)}size="default" type="primary" >
                        同意
                      </Button>
                     :""}
                      {this.props.taskName=="办公室新闻宣传管理员修改积分"?"":(this.props.difference=="审核"? 
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
                       {detailList?
                       <Tabs defaultActiveKey="1" 
                       onTabClick={(e)=>this.callback(e)}
                       style={{clear:"both"}}
                       >
                       <TabPane tab="加分项详情" key="1">
                       <div style = {{overflow:"hidden",margin:"20px" }}>
                                <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            加分事项
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                                <span>{detailList.newsName}</span>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            获得单项奖励
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <span>{detailList.isRewarded==0?"院级奖励":(detailList.isRewarded==1?"集团级奖励":(detailList.isRewarded==2?"集团级以上":""))}</span>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            证明材料
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <Table
                                            columns={ columns1 }
                                            loading={ this.props.loading }
                                            dataSource={JSON.parse(detailList.evidence) }
                                            className={ styles.orderTable }
                                            pagination = { false }
                                            style={{width:500,marginTop:'10px',marginLeft:200}}
                                            bordered={ true }
                                            />
                                            
                                    </div>
                          </div>
                        </TabPane>
                        <TabPane tab="审批环节" key="2">
                        <Table 
                        key = {this.props.key}
                                columns = {columns}
                                className = {styles.orderTable}
                                dataSource = {reportList}
                                pagination={false}
                        />
                        </TabPane>

                        </Tabs>
                        
                          :""}
            </div>
		)
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.bonusDetail, 
    ...state.bonusDetail
  };
}
export default connect(mapStateToProps)(bonusDetail);
