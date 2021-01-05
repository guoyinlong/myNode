/**
 * 作者：窦阳春
 * 日期：2019-4-27
 * 邮箱：douyc@itnova.com.cn
 * 功能：安委办--检查中
 */
import React  from 'react';
import {connect } from 'dva';
import Cookies from 'js-cookie';
import { Table, Button,DatePicker,Tabs,Collapse, message, Modal, Input, Spin, Pagination } from 'antd'
import styles from '../../securityCheck/securityCheck.less'
import PicShow from './picShow';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const { Panel } = Collapse;
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;                                                                                                                              
class checkDetailing extends React.PureComponent {
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
	}
	disabledEndDate = (current) => { 
		var dateTime=new Date();
		dateTime=dateTime.setDate(dateTime.getDate()-1);
		dateTime=new Date(dateTime);
		return current.valueOf() < dateTime;
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
		}, {
		title: '操作',
		dataIndex: 'opera',
		key: 'opera',
		render: (text, record) => {
			const {typeChoose, roleType} = this.props
			if(roleType!='' && roleType == '1') { //安委办登录
				if(typeChoose!=''&&(typeChoose=='安委办统查'||typeChoose=='安委办抽查'||typeChoose=='专项检查')){
					if(record.selfYard!=undefined &&( parseInt(record.wRectification) >= 1) ) { //安委办本部数据,待整改数量大于0
						return (
							<div>
								<Button disabled = {(record.informReform == '0') ? false : true} //状态为待整改或初始值为0不置灰
								 size="small" type="primary" onClick={() => this.outModal('notify', record)}>通知整改</Button> &nbsp;
							</div>
						)
					}
				}
			}else if(roleType!='' && roleType == '2') {//分院登录
				if(typeChoose!=''&&(typeChoose=='分院检查'||typeChoose=='分院抽查'||typeChoose=='专项检查')){
					if(parseInt(record.wRectification) && typeChoose!='部门自查' && typeChoose!='部门互查'>= 1){
						return (
							<div>
								<Button disabled = {(record.informReform == '0') ? false : true}
								size="small" type="primary" onClick={() => this.outModal('notify', record)}>通知整改</Button> &nbsp;
							</div>
						)
					}
				}
			}
		}
	}];
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
			dataIndex: 'opera',
			key: 'opera',
			render: (text, record) => {
				return (
					<div>
						<Button size="small" type="primary" onClick={() => this.outModal('details', record) }>详情</Button> &nbsp;
					</div>
				)
			}
		}
	]
	deptColumns = [
		{
			key: 'key',
			dataIndex: 'key',
			title: '序号'
		},
		{
			key: 'examinStateDesc',
			dataIndex: 'examinStateDesc',
			title: '表扬/待整改'
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
			dataIndex: 'opera',
			key: 'opera',
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
				type: 'checkDetailing/queryItem',
				record
			})
		}else if(value == 'notify') {
			this.setState({
				notifyVisible: true,
				notifyRecord:record
			})
		}
	}
	hideDetails = (value, deptId) => {
		if(value == 'details') {
			this.setState({
				detailVisible: false
			})
		}else if(value == 'notify') {
			this.setState({
				notifyVisible: false,
				beginTime: '',
				endTime: '',
				notifyRequire: '',
			})
		}else if(value == 'notifySend') { //确认发送整改通知
			let data = {
				taskId: this.props.query.taskId,
				deptId: deptId!==undefined? deptId :(this.state.notifyRecord.deptId!=undefined ?this.state.notifyRecord.deptId: ''),
				reformStartTime: this.state.beginTime,
				reformEndTime: this.state.endTime,
				reformOpinion: this.state.notifyRequire
			}
			if(data.reformStartTime == '' && data.reformOpinion!=undefined) {
				message.destroy()
				message.info("请输入整改时限")
			}else if(data.reformOpinion == '' && data.reformStartTime != ''){
				message.destroy()
				message.info("请输入整改要求")
			}else if(data.reformOpinion != '' && data.reformStartTime != '' && data.reformOpinion.length>50){
				message.destroy()
				message.info("整改要求不能大于50字")
			}else{
				this.props.dispatch({
					type:'checkDetailing/notify',
					data
				})
				this.setState({
					notifyVisible: false
				})
			}
		}
	}
	componentWillReceiveProps = () => {
		if(this.props.notifyFlag == '1'){
			this.setState({
				notifyRequire: '',
				beginTime: '',
				endTime: '',
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
		if(e.target.value.length<=50){
			this.setState({notifyRequire: e.target.value})
		}else if(e.target.value.length == 51){
			message.destroy()
			message.info("整改要求不能大于50字")
		}
	}
	changeTabs = (key) => {
    if(key == '1') {

    }else if(key == '2') {
			if(window.location.hash.indexOf('/securityCheck/safeCheck') > -1 || window.location.hash.indexOf('/securityCheck/branchCheck') > -1) {
				this.props.dispatch({
					type: 'checkDetailing/queryCourtyardAndDeptAndStaff' //查询表格
				})
			}else if(window.location.hash.indexOf('/securityCheck/deptCheck') > -1) {
				this.props.dispatch({
					type: 'checkDetailing/queryStaffByDept' //查询表格
				})
			}
    }
	}
	changePage = (page) => { //分页
    this.props.dispatch({type: "checkDetailing/changePage", page})
  }
	//----------------------页面渲染----------------------//
	render() {
		let {createUserName, startTime, endTime, theme, typeChoose, checkObject,roleObject, detailsList,
			checkValue, checkContent, checkRequire, createTime, examineImgId, oneMenu, deptTableData} = this.props
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
							</div>
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
						</TabPane>
							<TabPane tab="检查详情" key="2">
							{
								window.location.hash.indexOf('/securityCheck/safeCheck') > -1 || window.location.hash.indexOf('/securityCheck/branchCheck') > -1 ?
								<Collapse defaultActiveKey="0">
								{panelList}
								</Collapse> : 
								<div>
									{
										this.props.allCount > 0 ?
										<div>
													<span className={styles.detailLineKey}>
														整改时限
													</span>
													<span className={styles.lineColon}>：</span>
													<RangePicker  onChange = {this.changeDate}  style = {{width:200, marginRight:10}}
													value={   
													this.state.beginTime=== ''
													|| this.state.endTime===''
													? null : [moment(this.state.beginTime, dateFormat), moment(this.state.endTime, dateFormat)]}
													format={dateFormat}/>
													<span className={styles.detailLineKey}>
														整改要求
													</span>
													<span className={styles.lineColon}>：</span>
													<Input style={{width:'40%'}} value={this.state.notifyRequire} onChange={(e)=>this.notifyRequire(e)}/>
													<Button style={{float:"right"}} size="default" type="primary" 
													onClick={()=>this.hideDetails('notifySend', Cookies.get("dept_id"))} 
													disabled = {deptTableData.informReform!=undefined ? (deptTableData.informReform == '0' ? false : true) : false}
													>通知整改</Button>
										</div>
										: ''
									}
									<Table style = {{marginBottom:10, marginTop: 10}}
										columns = {this.deptColumns}
										dataSource = {deptTableData}
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
						</Tabs>
						<Modal title = "通知整改"
							visible = {this.state.notifyVisible}
							onOk={()=>this.hideDetails('notifySend')}
							onCancel={()=>this.hideDetails('notify')}>
							<div className={styles.lineOut}>
								<span className={styles.detailLineKey}>
									整改时限
								</span>
								<span className={styles.lineColon}>：</span>
								<RangePicker  onChange = {this.changeDate}  style = {{width:200, marginRight:10}}
									disabledDate={this.disabledEndDate}
									value={   
									this.state.beginTime=== ''
									|| this.state.endTime===''
									? null : [moment(this.state.beginTime, dateFormat), moment(this.state.endTime, dateFormat)]}
									format={dateFormat}/>
							</div>
							<div className={styles.lineOut}>
								<span className={styles.detailLineKey}>
									整改要求
								</span>
								<span className={styles.lineColon}>：</span>
								<Input style={{width:'300px'}} value={this.state.notifyRequire} onChange={(e)=>this.notifyRequire(e)}/>
							</div>
						</Modal>
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
								<div style={{overflow: 'hidden',padding:20, display: 'flex',justifyContent:'center'}}>
									<PicShow 
										fileList = {(detailsList.imgs!=undefined&&detailsList.imgs!='')?JSON.parse(detailsList.imgs):[]}
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
    loading: state.loading.models.checkDetailing, 
    ...state.checkDetailing
  };
}

export default connect(mapStateToProps)(checkDetailing);
