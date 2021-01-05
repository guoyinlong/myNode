/**
 * 作者：窦阳春
 * 日期：2019-4-27
 * 邮箱：douyc@itnova.com.cn
 * 功能：安委办--检查中
 */
import React  from 'react';
import {connect } from 'dva';
import { Table, Button, Radio,Tabs,Collapse,Pagination , Modal, Input,Select, Spin, Card } from 'antd'
import styles from '../../securityCheck/securityCheck.less'
import Cookies from 'js-cookie';
import PicShow from './picShow'; //图片展示
import FileUpload from './fileUpload.js';        //上传功能组件
import Statistics from './statistics.js' //统计图
const {Option} = Select;    
const { TextArea } = Input;
const { Panel } = Collapse;
const TabPane = Tabs.TabPane;                                                                                                                         
class checkFinish extends React.PureComponent {
	constructor(props) {super(props);}
	state = {
		detailVisible: false,
		recordData: [], //详情record存放
		notifyVisible: false,
		beginTime: '',
		endTime: '',
		notifyRequire: '',
		notifyRecord: [], //通知整改record存放
		previewVisible: false,
		previewImage: '',
		notifyValue: '0'
	}
	handleCancel = () => this.setState({ previewVisible: false })
	handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
	columns = [{
			key: 'key',
			dataIndex: 'key',
			title: '序号'
		},
		{
			key: 'deptName',
			dataIndex: 'deptName',
			title: '部门'
		},
		{
			key: 'praise',
			dataIndex: 'praise',
			title: '表扬'
		},
		{
			key: 'wRectification',
			dataIndex: 'wRectification',
			title: '待整改'
		},
		{
			key: 'informReformDesc',
			dataIndex: 'informReformDesc',
			title: '状态'
		}];
	deptColumns = [
		{
			key: 'key',
			dataIndex: 'key',
			title: '序号'
		},
		{
			key: 'examinStateDesc',
			dataIndex: 'examinStateDesc',
			title: '整改状态'
		},
		{
			key: 'staffName',
			dataIndex: 'staffName',
			title: '责任人员'
		},
		{
			key: 'assetsName',
			dataIndex: 'assetsName',
			title: '安全主体'
		},
		{
			key: 'assetsArea',
			dataIndex: 'assetsArea',
			title: '所属区域'
		},
		{
			key: 'inspectSituation',
			dataIndex: 'inspectSituation',
			title: '检查情况'
		},
		{
			key: 'problemleLevel',
			dataIndex: 'problemleLevel',
			title: '问题等级'
		},
		{
			key: 'inspectTime',
			dataIndex: 'inspectTime',
			title: '检查时间'
		},
		{
			title: '操作',
			dataIndex: '',
			key: '',
			render: (text, record) => {
				return (
					<div>
						<Button size="small" type="primary" onClick={() => this.outModal('details', record) }>详情</Button> &nbsp;
					</div>
				)
			}
		}
	]
	minColumns = [
		{
			key: 'key',
			dataIndex: 'key',
			title: '序号'
		},
		{
			key: 'examinStateDesc',
			dataIndex: 'examinStateDesc',
			title: '整改状态'
		},
		{
			key: 'staffName',
			dataIndex: 'staffName',
			title: '责任人员'
		},
		{
			key: 'assetsName',
			dataIndex: 'assetsName',
			title: '安全主体'
		},
		{
			key: 'assetsArea',
			dataIndex: 'assetsArea',
			title: '所属区域'
		},{
			title: '操作',
			dataIndex: '',
			key: '',
			render: (text, record) => {
				return (
					<div>
						<Button size="small" type="primary" onClick={() => this.outModal('details', record) }>详情</Button> &nbsp;
					</div>
				)
			}
		}
	]
	outModal = (value, record) => {
		if(value == 'details') {
			this.setState({
				detailVisible: true,
				recordData:record
			})
			this.props.dispatch({
				type: 'checkFinish/queryItem',
				record
			})
		}
	}
	hideDetails = (value) => {
		if(value == 'details') {
			this.setState({
				detailVisible: false
			})
		}
	}
	//得到时间保存时间
	changeDate = (date,dateString) => {
		const beginTime = dateString[0];
		const endTime = dateString[1];
		this.setState({
			beginTime,
			endTime,
		});
	};
	// 整改要求
	notifyRequire = (e) => {
		this.setState({notifyRequire: e.target.value})
	}
	changeTabs = (key) => {
		let hash = window.location.hash
		if(key == '2') {
			this.props.dispatch({
				type: 'checkFinish/queryInspectDetail' //查询统计结果
			})
			if(hash.indexOf('/securityCheck/safeCheck') > -1 || hash.indexOf('/securityCheck/branchCheck') > -1) {
				this.props.dispatch({
					type: 'checkFinish/queryCourtyardAndDeptAndStaff' //查询表格
				})
			}else if(hash.indexOf('/securityCheck/deptCheck') > -1) {
				this.props.dispatch({
					type: 'checkFinish/queryStaffByDept' //查询表格
				})
			}
    }
	}
	changePage = (page) => { //分页
    this.props.dispatch({type: "checkFinish/changePage", page})
  }
	checkResultModify = (e, value) => { //修改检查结果
    let value1 = e.target.value;
    if(value1.length >= 200){
      value1 = value1.substring(0,200)
		}
    this.props.dispatch({
      type: 'checkFinish/checkResultModify',
			value1,
			valueContent: value
    })
	}
	returnModel = (value1, value) => { //noticeObjectChoose
		if(value1 == 'notification') {
			this.setState({
				notifyValue: '1'
			})
		}
		this.props.dispatch({
			type: 'checkFinish/' + value1,
			value1,
			value,
			path: window.location.hash
		})
	}
	//----------------------页面渲染----------------------//
	render() {
		const {createUserName, startTime, endTime, theme, typeChoose, checkObject,roleObject, detailsList,
			checkValue, checkContent, checkRequire, createTime, examineImgId, oneMenu, noticeObject, 
			statisticsData, deptTableData, queryCheckSub, examContent, result2, nextRequest} = this.props;
			let hash = window.location.hash
			const panelList = (oneMenu!=undefined && oneMenu.length > 0) ? oneMenu.map((item, index) => {
				item.key = index+1; //一级加key值
				if(item.yardName.indexOf('联通')> -1) { //安委办下面本部数据
					item.dept.map((v, i)=>{v.selfYard = '1'})
				}
				if(item.dept != undefined){ //二级加key值
					var deptList =JSON.parse(JSON.stringify(item.dept)) ;
					deptList.map((item,index)=>{
						item.key = index+1;
						if(item.informReform == '0') {
							item.informReformDesc = '待通知'
						}else if(item.informReform == '1') {
							item.informReformDesc = '已通知'
						}
					})
				}
				const expandedRowRender = (record)=> { //三级数据
					if(record.staff.length > 0){
						var staffList = JSON.parse(JSON.stringify(record.staff));
						staffList.map((v, i) => {v.key = i+1;}) //三级加key值
					}
					return (
						<Table
							columns={this.minColumns}
							dataSource={staffList}
							pagination = {false}
							className = {styles.orderTable}
						/>
					);
				};
				const path = (
					<Panel
						header={
							(<div>
								<span>{item.yardName}</span>
								<span style = {{float: 'right'}}>表扬：{item.praise} &nbsp;待整改：{item.wRectification} &nbsp;</span>
							</div>)
							}
						key = {index+''}
					>
					<Table className={styles.orderTable}   
					columns={this.columns} 
					dataSource = {deptList}
					expandedRowRender={ expandedRowRender }
					pagination = {false}
					/>
					</Panel>
				)
				return path
			}) : ''
		let noticeObjectData = noticeObject.length == 0 ? [] : noticeObject.map((item, i) => { // 通知对象
			return <Option key={i} value={item.roleId}>{item.roleName}</Option>
		})
		return(
			<Spin tip="加载中..." spinning={this.props.loading}>
					<div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>检查任务详情</h2>
            <Button style = {{float: 'right'}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button>
						<Tabs onChange={this.changeTabs} defaultActiveKey={"1"}>
							<TabPane tab="任务详情" key="1">
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									发布人
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{createUserName}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									检查时间
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{startTime + '~' + endTime}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									检查主题
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{theme}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									检查方式
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{typeChoose}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									检查对象
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{checkObject}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									通知对象
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{roleObject}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									是否涉及分院
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{checkValue == 0 ? '否' : '是'}</span>
							</div>
							<div className={styles.lineOut} style={{overflow:'hidden'}}>
							<div className={styles.lineKey} style={{float: 'left'}}>
									检查内容
								</div>
								<div className={styles.lineColon} style={{float: 'left'}}>：</div>
								<div style={{float: 'left', width: 600}}>{checkContent}</div>
							</div>
							<div className={styles.lineOut} style={{clear: 'both'}}>
								<span className={styles.lineKey}>
									检查要求
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{checkRequire}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									创建时间
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{createTime}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									检查规范
								</span>
								<span className={styles.lineColon}>：</span>
								<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
									<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
								</Modal>
								<div style={{width:420, minHeight: '300px', marginLeft: 200}}>
								{
									examineImgId.length && examineImgId.length > 0 
									?
									<PicShow 
										fileList = {examineImgId} 
										visible = {this.state.previewVisible} 
										handlePreview = {this.handlePreview}/>
									: ''
								}
								</div>
							</div>
						</TabPane>
							<TabPane tab="检查详情" key="2">
								{
									statisticsData.ourHospital 
									?<Card title={
									<span style = {{fontWeight:900}}>
										{window.location.hash.indexOf("deptCheck")>-1? "本部门数据统计：" : '本院各部门数据统计：'}
										</span>}>
										<Statistics statisticsData = {statisticsData.ourHospital}/>
									</Card> 
									: ''
								}
								{
									statisticsData.ou ? 
									<Card title={<span style = {{fontWeight:900}}>各分院数据统计：</span>}>
										<Statistics statisticsData = {statisticsData.ou}/>
									</Card> : ''
								}
								{
									(hash.indexOf('/securityCheck/safeCheck') > -1 || hash.indexOf('/securityCheck/branchCheck') > -1) ? <Collapse>{panelList}</Collapse>
									: 
									<div>
										<Table style = {{marginBottom:10}}
										columns = {this.deptColumns}
										dataSource = {this.props.resDataTable}
										className={styles.orderTable}
										bordered={true}
										loading={this.props.loading}
										pagination={false}/>
										<Pagination
										current = {this.props.pageCurrent}
										pageSize = {10}
										total = {this.props.allCount}
										onChange = {this.changePage}
										style = {{textAlign: 'center'}}
										/>
									</div>
								}
								
							</TabPane>
							<TabPane tab="检查报送" key="3">
								<div style={{width: '100%',height: '100%',marginLeft: 17}}>
									{queryCheckSub.taskId!=undefined ?
									<div>
										<div style={{fontWeight:900, marginBottom:15}}>检查内容（请写明具体检查内容）：</div>
										<div style={{display: 'block', marginBottom:15}}>
										<TextArea placeholder="不能超过200字" 
											value = {examContent}
											onChange={(e) => this.checkResultModify(e, 'examContent')} rows={1} style={{width: '90%', verticalAlign: 'top'}}>
										</TextArea>
										</div> 
										<div style={{fontWeight:900, marginBottom:15}}>检查问题（请写明具体问题）：</div>
										<div style={{display: 'block', marginBottom:15}}>
										<TextArea placeholder="不能超过200字" 
											value = {result2}
											onChange={(e) => this.checkResultModify(e, 'result2')} rows={1} style={{width: '90%', verticalAlign: 'top'}}>
										</TextArea>
										</div>
										<div style={{fontWeight:900, marginBottom:15}}>下一步要求（请提出具体要求问题）：</div>
										<div style={{display: 'block', marginBottom:15}}>
										<TextArea placeholder="不能超过200字" 
											value = {nextRequest}
											onChange={(e) => this.checkResultModify(e, 'nextRequest')} rows={1} style={{width: '90%', verticalAlign: 'top'}}>
										</TextArea>
										</div>
									</div>
										:''
									}
									<div style = {{width: 570, marginTop:15 }}>
											<FileUpload dispatch={this.props.dispatch} pageName = 'checkFinish'
											 fileList = {(this.props.imgs!=""&&this.props.imgs!=null)?this.props.imgs: []}
											 len = {this.props.examineImgIdArr && this.props.examineImgIdArr.length}/>
									</div>
									<Modal visible={this.props.previewVisible} footer={null} onCancel={()=>this.returnModel('handleCancel')}>
											<img alt="example" style={{ width: '100%' }} src={this.props.previewImage} />
									</Modal>
									<Button type="primary"  style={{ marginTop:15 }}
										onClick={()=>this.returnModel('saveModify','保存')}>保存</Button>
										{
											hash.indexOf('/securityCheck/safeCheck') > -1  //安委办报送安委办领导 0
											? <Button type="primary" style = {{marginLeft: 5}} 
											disabled ={(queryCheckSub.isNoticeLead!=undefined&&queryCheckSub.isNoticeLead=='1')||this.props.isNoticeLeadFlag=='1'?true: false}
											onClick={()=>this.returnModel('submitted','0')}>报送安委办领导</Button>
											: hash.indexOf('/securityCheck/branchCheck') > -1 //安全接口人报送给安委办 1
											? <Button type="primary" style = {{marginLeft: 5}}
											disabled ={(queryCheckSub.isNoticeLead!=undefined&&queryCheckSub.isNoticeLead=='1')||this.props.isNoticeLeadFlag=='1'?true: false}
											onClick={()=>this.returnModel('submitted','1')}>报送安委办</Button>
											: hash.indexOf('/securityCheck/deptCheck') > -1 && Cookies.get('OUID') == 'e65c02c2179e11e6880d008cfa0427c4' //1本院安全员报送安委办
											? <Button type="primary" style = {{marginLeft: 5}}
											disabled ={(queryCheckSub.isNoticeLead!=undefined&&queryCheckSub.isNoticeLead=='1')||this.props.isNoticeLeadFlag=='1'?true: false}
											onClick={()=>this.returnModel('submitted','1')}>报送安委办</Button>
											: hash.indexOf('/securityCheck/deptCheck') > -1 && Cookies.get('OUID') != 'e65c02c2179e11e6880d008cfa0427c4' //2分院安全员报送分院办公室安全接口人
											? <Button type="primary" style = {{marginLeft: 5}}
											disabled ={(queryCheckSub.isNoticeLead!=undefined&&queryCheckSub.isNoticeLead=='1')||this.props.isNoticeLeadFlag=='1'?true: false}
											onClick={()=>this.returnModel('submitted','2')}>报送办公室安全接口人</Button>
											: ''
										}
									{
										queryCheckSub.isNotice!=undefined
										?
										<Button type="primary" style = {{marginLeft: 5}} disabled = {queryCheckSub.isNotice=='1'||this.props.isNoticeFlag=='1'?true:false}
											onClick={()=>this.returnModel('notification')}>通报</Button>
										: ''
									}
									{
										this.state.notifyValue == '1' 
										?
										<span>
												<b className={styles.lineStar}>*</b>
												<span>通报对象</span> 
												<Select mode="multiple"
													value={this.props.noticeObjectChoose}
													onChange={(value)=>this.returnModel('noticeObjectChoose', value)}
													style={{ minWidth: "200px", maxWidth: 570, marginLeft:15 }}
													placeholder = "请选择"
													>
													{noticeObjectData}
												</Select>
										</span>
										: ''
									}
								</div>
							</TabPane>
						</Tabs>
						
						<Modal title = '详情' visible={this.state.detailVisible}
							onOk={()=>this.hideDetails('details')}
							onCancel={()=>this.hideDetails('details')}>
							<div className={styles.lineOut}>
								<span className={styles.detailLineKey}>
									责任人员
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{detailsList.assetsArea!=undefined? detailsList.userName : ''}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.detailLineKey}>
									安全主体
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{detailsList.assetsArea!=undefined? detailsList.assetsName : ''}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.detailLineKey}>
									所属区域
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{detailsList.assetsArea!=undefined? detailsList.assetsArea : ''}</span>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.detailLineKey}>
									检查时间
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{detailsList.assetsArea!=undefined? detailsList.examineTime : ''}</span>
							</div> 
							<div className={styles.lineOut}>
								<span className={styles.detailLineKey}>
									检查详情
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{detailsList.assetsArea!=undefined > 0? detailsList.examinState : ''}</span>
							</div> 
							<div className={styles.lineOut}>
								<span className={styles.detailLineKey}>
									问题等级
								</span>
								<span className={styles.lineColon}>：</span>
								<span>{detailsList.assetsArea!=undefined ? detailsList.problemLevelDesc : ''}</span>
							</div> 
							<div className={styles.lineOut}>
								<span className={styles.detailLineKey}> 
									情况详情
								</span>
								<span className={styles.lineColon}>：</span>
								<div style={{width:420, minHeight: '300px', margin: '0 auto', marginTop: 10}}>
									<PicShow 
										fileList = {(detailsList.imgs!==undefined&&detailsList.imgs!=''&&detailsList.imgs!=null)?JSON.parse(detailsList.imgs):[]}
										visible = {this.state.previewVisible} 
										handlePreview = {this.handlePreview}/>
								</div>
							</div> 
						</Modal>
					</div>
			 </Spin> 
		)
					
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.checkFinish, 
    ...state.checkFinish
  };
}

export default connect(mapStateToProps)(checkFinish);
