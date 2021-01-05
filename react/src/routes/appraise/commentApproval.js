/**
 * 作者：翟金亭
 * 创建日期：2019-11-19
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：干部管理-评议功能
 */
import React ,{Component} from 'react';
import {connect} from "dva";
import {routerRedux} from "dva/router";
import styles from './commentInfo.less';
import { Button, Table, Spin, Icon, Form, Tabs, message, Radio, Row } from 'antd';
import Cookie from "js-cookie";

const TabPane = Tabs.TabPane;

class CommentApproval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //提交状态
      isSubmitClickable : true,
      //提交的评议意见
      choiseViewData : [],
      //组织结构
      Ou_Name : Cookie.get('OU'),
    };
  };

    columns = [
        {
            title:'被测评对象的基本情况',
            children:[
              {
                title:'姓名',
                dataIndex:'person_name',
                width:100,
              },
              {
                title:'出生年月',
                dataIndex:'person_birth',
                width:100,
              },
              {
                title:'原任职务',
                dataIndex:'person_befor_post',
                width:100,
              },
              {
                title:'现任职务',
                dataIndex:'person_now_post',
                width:100,
              },
              {
                title:'任职时间',
                dataIndex:'person_recognation_time',
                width:100,
              },
            ]
        },
        { title: '对提拔干部的看法', dataIndex: '',
            render: (text,record,) => {
                return(
                    <Radio.Group buttonStyle="solid" onChange ={this.setView.bind(this,record) }>
                        <Radio.Button value="1">认同</Radio.Button>
                        <Radio.Button value="2">基本认同</Radio.Button>
                        <Radio.Button value="3">不认同</Radio.Button>
                        <Radio.Button value="4">不了解</Radio.Button>
                    </Radio.Group>
                )
            }
        },
    ];
    //刷新
    freshButton = () => {
      location.reload();
    };

    //关闭
    closeButton = () => {
        const{dispatch} = this.props;
        dispatch(routerRedux.push({
            pathname:'/commonApp',
          }));
    };

    //选择评议意见
    setView (record,value){
        let tempData = this.props.commentPersonInfo;
        let record_id = record.record_id;
        for(let i=0; i<tempData.length; i++){
          if(tempData[i].record_id === record_id){
            tempData[i].person_view = value.target.value;
            break;
          }
        }
        this.setState({
            choiseViewData : tempData
        });
    };    
 
    //提交
    handleOKEdit = () => {
        const { commentPersonInfo, approval_batch, appraisePersonType } = this.props;
        const {dispatch} = this.props;
        let transferApprovalList = [];
        if( commentPersonInfo.length !== this.state.choiseViewData.length ){
            message.info("请评议所有待评议人员！");
            return;
        }else{
            for(let i =0; i< this.state.choiseViewData.length; i++ ){
                if( !this.state.choiseViewData[i].person_view ){
                    message.info("请评议所有待评议人员！");
                    return;
                }
            }
            this.state.choiseViewData.map((item) => {
                let tempDatas ={
                arg_batch_id : approval_batch,
                arg_record_id : item.record_id,
                arg_user_id : Cookie.get("userid"),
                arg_view : item.person_view,
                arg_appraise_person_type : appraisePersonType[0].person_type,
                }
                 transferApprovalList.push(tempDatas);
            })

            return new Promise((resolve) => {
                dispatch({
                    type:'manageAppraiseModel/commentApprovalOperation',
                    transferApprovalList,
                    resolve
                });
            }).then((resolve) => {
                if(resolve === 'success'){
                    message.info("评议成功！");
                    this.setState({
                        isSubmitClickable: false
                    });
                    dispatch(routerRedux.push({
                        pathname:'/commonApp',
                    }));
                }
                if(resolve === 'false'){
                    message.error("评议出现了问题，请稍后！");
                    this.setState({
                        isSubmitClickable: false
                    });
                    dispatch(routerRedux.push({
                        pathname:'/commonApp',
                    }));
                }
            }).catch(() => {
                this.setState({
                    isSubmitClickable: false
                });
                dispatch(routerRedux.push({
                    pathname:'/commonApp',
                }));
            });
        }
    };

    render() {
        const { evaluationTime, commentPersonInfo } = this.props;
        let recognation_time = '';
        if(commentPersonInfo && commentPersonInfo[0]){
            recognation_time = commentPersonInfo[0].person_recognation_time.slice(0,4);
        }
        return (
            <Spin spinning={this.props.loading}>
                <div>
                <br/>
                    <span style={{float:'right'}}>
                        <Button onClick={this.freshButton} type='primary'>
                            <Icon type="reload" />{'刷新'}
                        </Button>
                    </span>
                </div>
                <br/>

                <div style={{background: 'white', padding: '10px 10px 10px 10px'}}>
                    <Tabs
                        defaultActiveKey = 't1'
                    >
                        <TabPane tab= {this.state.Ou_Name +'-'+ recognation_time + '年'+ (evaluationTime === '1' ? '新' : '' )+'提拔常设机构负责人民主评议'+ (evaluationTime === '1' ? '' : '(复评)' )+'表' } key="t1">
                            <div className={styles.titleBox}>
                            <Table
                                columns={this.columns}
                                dataSource={commentPersonInfo}
                                pagination={true}
                                width={'100%'}
                                bordered= {true}    
                            />                                  
                            </div>
                            <Row span={2} style={{ textAlign: 'center' }}>
                                <Button 
                                    type="primary"
                                    style={{marginRight: '10px'}}
                                    onClick={this.handleOKEdit}
                                    disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}
                                </Button>
                                &nbsp;&nbsp;
                                <Button
                                    type="primary"
                                    style={{marginRight: '10px'}}
                                    onClick={this.closeButton}>关闭
                                </Button>
                                </Row>
                        </TabPane>
                    </Tabs>
                </div>
            </Spin>
        );
    }
}

function mapStateToProps(state) {
    return {
      loading: state.loading.models.manageAppraiseModel,
      ...state.manageAppraiseModel
    };
  }

  CommentApproval = Form.create()(CommentApproval);
export default connect(mapStateToProps)(CommentApproval);