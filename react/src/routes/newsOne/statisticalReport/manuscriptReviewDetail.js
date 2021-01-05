/**
 * 作者：郭银龙
 * 创建日期： 2020-10-20
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件复核详情
 */


import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import {Button,Select,Tabs,Table ,Modal,Input} from 'antd'
import styles from './setNewstyle.less'
const { TabPane } = Tabs;
const { TextArea } = Input;
class manuscriptReviewDetail extends React.PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    visible: false,//modole显示
}

  //----------------------页面渲染----------------------//
  callback=(e)=> {
    if(e==1){
    //     this.props. dispatch({
    //         type:"reviewDetail/queryUserInfo",
    //       })
    }else if(e==2){
        this.props. dispatch({
            type:"manuscriptReviewDetail/gaojianhuanjie",
            })
    }
    }
     //退回
  showModal = () => {
    // this.props.dispatch({
    //     type: "manuscriptReviewDetail/setPoints", 
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
        type: "manuscriptReviewDetail/handle", 
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
            type:'manuscriptReviewDetail/'+value,
            record : value2,
        })
    }else{
        this.props.dispatch({
            type:'manuscriptReviewDetail/'+value,
        })
    }
};
	render() {
        const {  detailList,reportList} = this.props;
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
						<h2 style = {{textAlign:'center',marginBottom:30}}>稿件复核详情</h2>
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
                      {this.props.taskName=="办公室新闻宣传管理员修改积分"?""
                      :(this.props.difference=="审核"? 
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
                          {/* <Input  style={{width:'60%'}} value={this.props.tuihuiValue}
                          onChange={(e)=>this.returnModel('tuihui',e.target.value)}
                            /> */}
                      </Modal>
                       {detailList!=''?
                       <Tabs defaultActiveKey="1" 
                       onTabClick={(e)=>this.callback(e)}
                       style={{clear:"both"}}
                       >
                       <TabPane tab="稿件复核详情" key="1">
                       <div style = {{overflow:"hidden",margin:"20px" }}>
                                <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            稿件名称
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                                <span>{detailList.newsName}</span>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            稿件发布时间
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <span>{detailList.releaseTime}</span>
                                    </div>
                                   
                                    {
                                    detailList.author.length == 0 ? [] : detailList.author.map((item) => { 
                                    return  <div className={styles.lineOut}>
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
                                              发布渠道
                                              </span>
                                              <span className={styles.lineColon}>：</span>
                                              <span>{detailList.releaseChannels}</span>
                                    </div>
                                    <div className={styles.lineOut}>
                                              <span className={styles.lineKey}>
                                              复核说明
                                              </span>
                                              <span className={styles.lineColon}>：</span>
                                              <span>{detailList.checkExplain}</span>
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
    loading: state.loading.models.manuscriptReviewDetail, 
    ...state.manuscriptReviewDetail
  };
}
export default connect(mapStateToProps)(manuscriptReviewDetail);
