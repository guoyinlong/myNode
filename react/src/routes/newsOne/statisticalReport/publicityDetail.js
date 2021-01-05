/**
 * 作者：郭银龙
 * 创建日期： 2020-10-20
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 宣传组织详情
 */


import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import {Button,Input,Select ,Tabs,Table ,Modal} from 'antd'
import styles from './setNewstyle.less'
const Option = Select.Option;
const { TabPane } = Tabs;
const { TextArea } = Input;
class publicityDetail extends React.PureComponent {
    state = {
        previewVisible: false,
        previewImage: '',
        visible: false,//modole显示
    }

callback=(e)=> {
        if(e==1){
        //     this.props. dispatch({
        //         type:"publicityDetail/queryUserInfo",
        //       })
        }else if(e==2){
            this.props. dispatch({
                type:"publicityDetail/gaojianhuanjie",
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
        type: "publicityDetail/handle", 
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
            type:'publicityDetail/'+value,
            record : value2,
        })
    }else{
        this.props.dispatch({
            type:'publicityDetail/'+value,
        })
    }
};

	//----------------------页面渲染----------------------//
	render() {
        const {  detailList,reportList} = this.props;
        const columns = [
                {  
                    title: "序号",
                    key:(text,record,index)=>`${index+1}`,
                    render:(text,record,index)=>`${index+1}`,
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
						<h2 style = {{textAlign:'center',marginBottom:30}}>宣传组织详情</h2>
                        <Button style = {{float: 'right', marginLeft:10}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button>
            {this.props.pass=="1"?"":
            <span>
               {this.props.difference=="审核"?
                        <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel('onAgree',)}size="default" type="primary" >
                        同意
                      </Button>
                     :""}
                      {this.props.difference=="审核"? 
                        <Button style = {{float: 'right'}} onClick={()=>this.showModal()}  size="default" type="primary" >
                        退回
                      </Button>
                     :""} 
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
                       <TabPane tab="宣传组织详情" key="1">
                        <div style = {{overflow:"hidden",margin:"20px" }}>
                  
                                <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                             提交人
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                                <span>{detailList.createByName}</span>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                             单位
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <span>{detailList.deptName}</span>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                             思想文化宣传队名称
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <span>{detailList.thoughtName}</span>
                                            
                                    </div>
                                    <div className={styles.lineOut}>
                                                        <span className={styles.lineKey}>
                                                            
                                                            思想文化宣传队队长/新闻宣传员
                                                        </span>
                                                        <span className={styles.lineColon}>：</span>
                                                        <span>{detailList.thoughtCaptain}</span>
                                    </div>
                                    <div className={styles.lineOut}>
                                                        <span className={styles.lineKey}>
                                                            
                                                            思想文化宣传队队员
                                                        </span>
                                                        <span className={styles.lineColon}>：</span>
                                                        <span>{detailList.thoughtTeam}</span>
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
    loading: state.loading.models.publicityDetail, 
    ...state.publicityDetail
  };
}
export default connect(mapStateToProps)(publicityDetail);
