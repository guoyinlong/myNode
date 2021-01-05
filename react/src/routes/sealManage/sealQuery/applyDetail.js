/**
 * 作者：窦阳春
 * 日期：2019-9-4
 * 邮箱：douyc@itnova.com.cn
 * 功能：个人查询 详情页面处理
 */
// import React from 'react';
// import {connect } from 'dva';
// import Cookie from 'js-cookie';
// import { DatePicker, Table, Tabs, Icon, Button, Form, Select, Row, Col, Popconfirm, message } from 'antd'
// import styles from './sealPersonalQuery.less'
// import { routerRedux } from 'dva/router';

// import { Record } from 'immutable';
// const TabPane = Tabs.TabPane;
// class ApplyDetail extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {

// 		}
//     }
//     // 返回个人查询页面
//     gotoPrevPage = () => {
//         this.props.dispatch(routerRedux.push({
//             pathname: '/adminApp/sealManage/sealPersonalQuery'
//         }))
//     }
//     // 切换tab tab key为1是用印配置页面 2为管理员配置页面
// 	changeTabs = (key) =>{
// 		const { dispatch } = this.props;
// 		// dispatch ({
// 		// 	type: 'applyDetail/initPage'
// 		// })
// 		if(key === '1') {
//             if (this.props.jump == "2") { // 由审批流程切换过来的路由不走查询服务
//                 return
//             }else {
//                 alert("jump=else")
//                 dispatch ({
//                     type: 'applyDetail/init',
//                 })
//             }
// 		}else if (key === '2') {
// 			dispatch ({ 
//                 type: 'applyDetail/handleProcess'
// 			})
// 		}
//     }
//     // 下载
//     download = (record) => {
//         console.log(record, 'record')
//         this.props.dispatch({
//             type: 'applyDetail/download',
//             record
//         })
//     }
//     // 下载申请单
//     downloadApply = () => {
//         alert("下载申请单")
//     }
//     columns = [
//         {
//             key: 'key',
//             dataIndex: 'key',
//             title: '序号',
//             render: (index) => {
//                 return (
//                     <span>{ index }</span>
//                 )
//             }
//         },
//         {
//             key: 'upload_name',
//             dataIndex: 'upload_name',
//             title: '文件名',
//             render : ( index ) => {
//                 return (
//                      <span> { index }</span>
//                 )
//             }
//         },
//         {
//             key: 'upload_number',
//             dataIndex: 'upload_number',
//             title: '份数',
//             render : ( index ) => {
//                 return (
//                      <span> { index }</span>
//                 )
//             }
//         },
//         {
//             key: 'upload_type',
//             dataIndex: 'upload_type',
//             title: '文件描述',
//             render : ( index ) => {
//                 return (
//                      <span> { index }</span>
//                 )
//             }
//         },
//         {
//             key: 'opera',
//             dataIndex: 'opera',
//             title: '操作',
//             render:(text, record) => {
//                 return (
//                     <div>
//                         {/* 需要修改 路径此时不存在 */}
//                         {/* <a href={`/filemanage/download/assetstemplate/${record.upload_name}.xlsx`}> */}
//                         <a href={`${record.upload_url}${record.upload_name}.xlsx`}>   
//                             <Button type="primary" onClick = {this.goAddPage}>下载</Button>
//                         </a>
//                     </div>
//                 )
//             }
//         }
//     ];
//     columns2 = [
//         {
//             key: 'key',
//             dataIndex: 'key',
//             title: '序号',
//             render: (index) => {
//                 return (
//                     <span>{ index }</span>
//                 )
//             }
//         },
//         {
//             key: 'pState',
//             dataIndex: 'pState',
//             title: '状态',
//             render : ( index ) => {
//                 return (
//                      <span> { index }</span>
//                 )
//             }
//         },
//         {
//             key: 'process_name',
//             dataIndex: 'process_name',
//             title: '环节名称',
//             render : ( index ) => {
//                 return (
//                      <span> { index }</span>
//                 )
//             }
//         },
//         {
//             key: 'approval_person',
//             dataIndex: 'approval_person',
//             title: '审批人',
//             render : ( index ) => {
//                 return (
//                      <span> { index }</span>
//                 )
//             }
//         },
//         {
//             key: 'approval_type',
//             dataIndex: 'approval_type',
//             title: '审批类型',
//             render : ( index ) => {
//                 return (
//                      <span> { index }</span>
//                 )
//             }
//         },
//         {
//             key: 'approval_desc',
//             dataIndex: 'approval_desc',
//             title: '审批意见',
//             render : ( index ) => {
//                 return (
//                      <span> { index }</span>
//                 )
//             }
//         },
//         {
//             key: 'approval_datetime',
//             dataIndex: 'approval_datetime',
//             title: '审批时间',
//             render : ( index ) => {
//                 return (
//                      <span> { index }</span>
//                 )
//             }
//         }
//     ];
//     data = [
//         {
//             key: 1,
//             filesName: '文件名1',
//             num: '5',
//             describe: '文件描述1',
//             index: '1'
//         },
//         {
//             key: 2,
//             filesName: '文件名2',
//             num: '2',
//             describe: '文件描述2',
//             index: '2'
//         },
//         {
//             key: 3,
//             filesName: '文件名3',
//             num: '3',
//             describe: '文件描述3',
//             index: '3'
//         }
//     ];
//     render() {
//         const {approvalList, applyList, sealFileData} = this.props
//         return (
//             <div className={styles.pageContainer}> 
//                 <Button
//                     type = "primary"
//                     style = {{ float: "right" }}
//                     onClick = {this.gotoPrevPage }>返回
//                 </Button>
//                 <Tabs defaultActiveKey={"1"} onChange={this.changeTabs}>
//                     <TabPane tab="申请详情" key="1">
//                         <h2 style = {{textAlign:'center'}}>{this.props.userName}使用详情页</h2>
//                         <div className = {styles.detailContent}>
//                             <Row className = {styles.rowStyle}>
//                                 <Col span = {6} style = {{ textAlign: "right" }}><b className={styles.lineStar}>*</b>申请时间：</Col>
//                                 <Col span = {18} style = {{ paddingLeft: "20px" }}>{this.props.createDate}</Col>
//                             </Row>
//                             <Row className = {styles.rowStyle}>
//                                 <Col span = {6} style = {{ textAlign: "right" }}><b className={styles.lineStar}>*</b>申请人：</Col>
//                                 <Col span = {18} style = {{ paddingLeft: "20px" }}>{this.props.userName}</Col>
//                             </Row>
//                             <Row className = {styles.rowStyle}>
//                                 <Col span = {6} style = {{ textAlign: "right" }}><b className={styles.lineStar}>*</b>需使用名章名称：</Col>
//                                 <Col span = {18} style = {{ paddingLeft: "20px" }}>{this.props.formName}</Col>
//                             </Row>
//                             <Row className = {styles.rowStyle}>
//                                 <Col span = {6} style = {{ textAlign: "right" }}><b className={styles.lineStar}>*</b>使用名章日期：</Col>
//                                 <Col span = {18} style = {{ paddingLeft: "20px" }}>{this.props.borrowDate} -- {this.props.returnDate}</Col>
//                             </Row>
//                             <Row className = {styles.rowStyle}>
//                                 <Col span = {6} style = {{ textAlign: "right" }}><b className={styles.lineStar}>*</b>使用名章事由：</Col>
//                                 <Col span = {18} style = {{ paddingLeft: "20px" }}>{this.props.reason}</Col>
//                             </Row>
//                             <Row className = {styles.rowStyle}>
//                                 <Col span = {6} style = {{ textAlign: "right" }}><b className={styles.lineStar}>*</b>用印材料是否涉密：</Col>
//                                 <Col span = {18} style = {{ paddingLeft: "20px" }}>{this.props.secret}</Col>
//                             </Row>
//                             <Row className = {styles.rowStyle}>
//                                 <Col span = {6} style = {{ textAlign: "right" }}>用印文件：</Col>
//                             </Row>
//                             <Row className = {styles.rowStyle}>
//                                 <Col span={24} style = {{ textAlign: "left", paddingLeft: "114px" }}>
//                                     <Table 
//                                         columns = {this.columns}
//                                         dataSource = { sealFileData }
//                                         className={styles.orderTable}
//                                         bordered={true}
//                                         pagination={true}
//                                     >
//                                     </Table>
//                                 </Col>
//                             </Row>
//                         </div>
//                         <Button type="primary" onClick={this.downloadApply} style={{marginLeft: "350px"}}>下载申请单</Button>
//                     </TabPane>
//                     <TabPane tab="审批流程" key="2">
//                         <Table
//                             columns = {this.columns2}
//                             dataSource = { approvalList }
//                             className={styles.orderTable}
//                             bordered={true}
//                             pagination={true}
//                         >  
//                         </Table>
//                     </TabPane>
//                 </Tabs>
//             </div>
//         )
//     }
// }
// function mapStateToProps (state) {
//   return {
//     loading: state.loading.models.applyDetail, // sealPersonalQuery命名空间下的state数据
//     ...state.applyDetail
//   };
// }

// export default connect(mapStateToProps)(ApplyDetail);