/**
 *  作者: 崔晓林
 *  创建日期: 2020-4-30
 *  邮箱：cuixl@itnovacom.cn
 *  文件说明：已立项项目的信息展示主页，包括四部分
 */
import React from 'react';
import { Tabs,Button, Row, Col,} from 'antd';
import NotChangeBasicInfo from '../projMessage/changeBasicInfoDetail';
import Attachment from '../projMessage/projAttachmentDetail';
import MileInfoQuery from '../projMessage/mileInfoDetail'
import { connect } from "dva";
import { routerRedux } from 'dva/router';





const TabPane = Tabs.TabPane;


class ProjDetail extends React.Component {
      
     /**
     * 功能：项目备案一键推送
     */
      // gorecord = () => {
      //  const { dispatch } = this.props;
      //   dispatch(routerRedux.push({
      //   pathname: '/projectApp/projRecord/projChild',
      //   }));
      //   };
      

      gorecord = () => {
        this.props.dispatch({
          type: "projDetail/projDetailPush",
          // value: arg_proj_id,
          // objParam: objParam,
        });
        };



     /**
     * 功能：返回项目历史列表页面
     */
      goBack = () => {
      const { dispatch } = this.props;
        dispatch(routerRedux.push({
        pathname: '/projectApp/projRecord/projChild',
        query: this.props.query,
        }));
        };

  
    render() {
        const { dispatch, projectInfo, mileInfoList, fore_workload, attachmentList,pms_list } = this.props;
        // console.log(attachmentList);
       // console.log(projectInfo);
      //  console.log(this.props.query)
        
        return (
         <div style={{ paddingTop: 13, paddingBottom: 16, background: "white" }}>
           <div style={{paddingTop:20}}>
                <p style={{ fontWeight: 600, fontSize: '25px', textAlign: 'center', marginBottom: 20, padding: 0 }}>
                        {this.props.query.proj_name}
               </p>
             </div>
             <Row gutter={16}>
              <Col span={5} offset={19}>
               <Button 
              onClick={() => this.gorecord()}
              type="primary"
              disabled={this.props.query.record_state=="1"?true:false}
              >
                一键推送
              </Button>
              <Button
                style={{ marginLeft:10,marginTop:10 }}
                onClick={() => this.goBack()}
                type="primary"
              >
                返回
              </Button>
            </Col>
            </Row>
              <Tabs>           
                  <TabPane tab="基本信息" key="1">
                        <NotChangeBasicInfo
                            notChangeBasicInfo={projectInfo}
                            pms_list={pms_list}
                            replaceMoneyList={this.props.replaceMoneyList}
                          />
                    </TabPane>
                    <TabPane tab="里程碑" key="2">
                    <div style={{padding:10}}>
                        <MileInfoQuery
                            ref="mileInfoQuery"
                            dispatch={dispatch}
                            mileInfoList={mileInfoList}
                            fore_workload={fore_workload}
                        />
                      </div>
                    </TabPane>
                    <TabPane tab="附件" key="5">
                    <div style={{padding:10}}>
                        <Attachment
                            proj_id={this.props.proj_id}
                            dispatch={dispatch}
                            attachmentList={attachmentList}
                        />
                        </div>
                    </TabPane>             
               </Tabs>
         </div>
        );
    }
}
function mapStateToProps(state) {
        return {
            loading: state.loading.models.projDetail,
            ...state.projDetail,
        };
    }
export default connect(mapStateToProps)(ProjDetail);
