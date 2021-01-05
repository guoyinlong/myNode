/**
 * 作者：翟金亭
 * 创建日期：2019-11-19
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：干部管理-待评议界面
 */
import React ,{Component} from 'react';
import {connect} from "dva";
import {routerRedux} from "dva/router";
import styles from './commentInfo.less';
import { Button, Table, Spin, Form, Tabs, Row } from 'antd';

const TabPane = Tabs.TabPane;

class ApprovalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //提交状态
      isSubmitClickable : true,
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

    render() {
        const { evaluationTime, commentPersonInfo } = this.props;
        let recognation_time = '';
        if(commentPersonInfo && commentPersonInfo[0]){
            recognation_time = commentPersonInfo[0].person_recognation_time.slice(0,4);
        }        
        return (
            <Spin spinning={this.props.loading}>
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

ApprovalInfo = Form.create()(ApprovalInfo);
export default connect(mapStateToProps)(ApprovalInfo);