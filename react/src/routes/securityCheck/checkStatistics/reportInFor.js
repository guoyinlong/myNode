/**
 * 作者：郭银龙
 * 日期：2019-5-19 
 * 邮箱：guoyl@itnova.com.cn
 * 功能：报告详情
 */ 
import React  from 'react';
import {connect } from 'dva';
import { Table, Button,DatePicker,Tabs,Collapse, message, Modal, Input, Spin, Pagination, Upload , Badge, Menu, Dropdown, Icon} from 'antd'
import styles from '../../securityCheck/securityCheck.less'
const dateFormat = 'YYYY-MM-DD';
const { Panel } = Collapse;
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;                                                                                                                           
class xqReport extends React.PureComponent {
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

	columns = [{
			key: 'key',
			dataIndex: 'key',
			title: '序号1'
		},
		{
			key: 'deptName',
			dataIndex: 'deptName',
			title: '部门'
		},
		{
			key: 'depYesNum',
			dataIndex: 'depYesNum',
			title: '被表扬人员'
		}];
	minColumns = [
		{
			key: 'key',
			dataIndex: 'key',
			title: '序号2'
		},
		{
			key: 'userName',
			dataIndex: 'userName',
			title: '表扬人员'
		},
		{
			key: 'count',
			dataIndex: 'count',
			title: '次数'
		}
	]
	deptColumns = [{
		key: 'key',
		dataIndex: 'key',
		title: '序号1'
	},
	{
		key: 'deptName',
		dataIndex: 'deptName',
		title: '部门'
	},
	{
		key: 'depNoNum',
		dataIndex: 'depNoNum',
		title: '不合格人数'
	},
	{
		key: 'depNum',
		dataIndex: 'depNum',
		title: '安全隐患次数'
	} ];

	deptminColumns = [{
		key: 'key',
		dataIndex: 'key',
		title: '序号'
	},
	{
		key: 'userName',
		dataIndex: 'userName',
		title: '责任人员'
	},
	{
		key: 'examinTime',
		dataIndex: 'examinTime',
		title: '检查时间'
	},
	{
		key: 'noticeOptName',
		dataIndex: 'noticeOptName',
		title: '检查人员'
	},
	{
		key: 'questionTypeId',
		dataIndex: 'questionTypeId',
		title: '安全隐患问题'
	} ];



	changeTabs = (key) => {
		// console.log(key,this.props.location.query.arg_yard_state)
    if(key == '1') {
		//查询合格
		// console.log("1","111111")
		
      
		  //查询本院
		//   console.log("查询合格查询本院")
		let data ={
			arg_statistics_id:JSON.parse(JSON.stringify(this.props.location.query.arg_statistics_id)),  // 是        统计任务的id                                       
			arg_yard_state : this.props.location.query.arg_yard_state,    //是        0、查询本部\本院多级表格     1、查询各分院多级表格 
			arg_item_state : 0    // 是        0、表扬     1、不合格 
	
		   }
				this.props.dispatch({
					
					
					type: 'xqReport/queryCourtyardAndDeptAndStaff' ,//查询表格
				
					data
				})
			
    }else if(key == '2') {
		//查询不合格
			// if(this.props.roleType == '1' || this.props.roleType == '2') {
				// 查询本院
				let data ={
					arg_statistics_id:JSON.parse(JSON.stringify(this.props.location.query.arg_statistics_id)),  // 是        统计任务的id                                       
					arg_yard_state :  this.props.location.query.arg_yard_state,    //是        0、查询本部\本院多级表格     1、查询各分院多级表格 
					arg_item_state : 1    // 是        0、表扬     1、不合格 
			
				   }
				this.props.dispatch({
					type: 'xqReport/queryCourtyardAndDeptAndStaff' ,//查询表格
				data
				})
			// }else if(this.props.roleType == '3' || this.props.roleType == '4') {
			// 	//查询多院
			// 	let data ={
			// 		arg_statistics_id:JSON.parse(JSON.stringify(this.props.location.query.arg_statistics_id)),  // 是        统计任务的id                                       
			// 		arg_yard_state :  1,    //是        0、查询本部\本院多级表格     1、查询各分院多级表格 
			// 		arg_item_state : 1    // 是        0、表扬     1、不合格 
			
			// 	   }
			// 	this.props.dispatch({
			// 		type: 'xqReport/queryCourtyardAndDeptAndStaff', //查询表格
			// 	data
			// 	})
			// }
    }
	}
	//----------------------页面渲染----------------------//
	render() {
		const {oneMenu, roleType} = this.props
		// console.log(this.props)
		//合格
			const onehegeList = oneMenu.map((item, index) => {
				item.key = index+1; //一级加key值
				if(item.ouName.indexOf('联通')> -1) { //安委办下面本部数据
					item.deptInfos.map((v, i)=>{v.selfYard = '1'})
				} 
				if(item.deptInfos != undefined){ //二级加key值
					var deptList =JSON.parse(JSON.stringify(item.deptInfos)) ;
					deptList.map((item,index)=>{
						item.key = index+1;
						
					})
				}
				const expandedRowRender = (record)=> { //三级数据
					// console.log(record, 'record')
					if(record.userInfos.length > 0){
						var staffList = JSON.parse(JSON.stringify(record.userInfos));
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
							//第一行折叠面板数据
							(<div>
								<span>{item.ouName}</span>
								<span style = {{float: 'right'}}>被表扬人数：{item.ouYesNum}&nbsp;&nbsp;</span>
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
			});
		//不合格
			const onebuhegepanelList = oneMenu.map((item, index) => {
				item.key = index+1; //一级加key值
				if(item.ouName.indexOf('联通')> -1) { //安委办下面本部数据
					item.deptInfos.map((v, i)=>{v.selfYard = '1'})
				}

				if(item.deptInfos != undefined){ //二级加key值
					var deptList =JSON.parse(JSON.stringify(item.deptInfos)) ;
					deptList.map((item,index)=>{
						item.key = index+1;
						
					})
				}
				const expandedRowRender = (record)=> { //三级数据
					// console.log(record, 'record')
					if(record.userInfos.length > 0){
						var staffList = JSON.parse(JSON.stringify(record.userInfos));
						staffList.map((v, i) => {v.key = i+1;}) //三级加key值
					}
					return (
						<Table
							columns={this.deptminColumns}
							dataSource={staffList}
							pagination = {false}
							className = {styles.orderTable}
						/>
					);
				};
				const path = (
					<Panel
						header={
							//第一行折叠面板数据
							(<div>
								<span>{item.ouName}</span>
								<span style = {{float: 'right'}}>不合格人数：{item.ouNoNum}&nbsp;&nbsp;</span>
							</div>)
							}
						key = {index+''}
					>
					<Table className={styles.orderTable}   
					columns={this.deptColumns} 
					dataSource = {deptList}
					expandedRowRender={ expandedRowRender }
					pagination = {false}
					/>
					</Panel>
				)
				return path
			});
	
		//合格
		const morhegeList = oneMenu.map((item, index) => {
			

			if(item.deptInfos != undefined){ //二级加key值
				var deptList =JSON.parse(JSON.stringify(item.deptInfos)) ;
				deptList.map((item,index)=>{
					item.key = index+1;
					
				})
			}
			const expandedRowRender = (record)=> { //三级数据
				// console.log(record, 'record')
				if(record.userInfos.length > 0){
					var staffList = JSON.parse(JSON.stringify(record.userInfos));
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
				
				<Table className={styles.orderTable}   
				columns={this.columns} 
				dataSource = {deptList}
				expandedRowRender={ expandedRowRender }
				pagination = {false}
				/>
			
			)
			return path
		}) ;
		//不合格
			const morbuhegeList = oneMenu.map((item, index) => {
					
		
						if(item.deptInfos != undefined){ //二级加key值
							var deptList =JSON.parse(JSON.stringify(item.deptInfos)) ;
							deptList.map((item,index)=>{
								item.key = index+1;
								
							})
						}
						const expandedRowRender = (record)=> { //三级数据
							// console.log(record, 'record')
							if(record.userInfos.length > 0){
								var staffList = JSON.parse(JSON.stringify(record.userInfos));
								staffList.map((v, i) => {v.key = i+1;}) //三级加key值
							}
							return (
								<Table
									columns={this.deptminColumns}
									dataSource={staffList}
									pagination = {false}
									className = {styles.orderTable}
								/>
							);
						};
						const path = (
						
							<Table className={styles.orderTable}   
							columns={this.deptColumns} 
							dataSource = {deptList}
							expandedRowRender={ expandedRowRender }
							pagination = {false}
							/>
						
						)
						return path
					}) ;

		return(
	
					<div className={styles.pageContainer} >
						<h2 style = {{textAlign:'center',marginBottom:30}}>报告详情</h2>
            				<Button style = {{float: 'right'}} size="default" type="primary" >
									<a href="javascript:history.back(-1)">返回</a>
							</Button>
						<Tabs onChange={this.changeTabs} defaultActiveKey={"1"}>
            					<TabPane tab="表扬" key="1">
							{/* {roleType == '1' || roleType == '2' ? */}
								<Collapse > 
								{onehegeList} 
								</Collapse>
								 {/* : 
								<div> {morhegeList}  </div>
							} */}
								
							</TabPane>

							<TabPane tab="不合格" key="2">
							{/* {roleType == '1' || roleType == '2' ?  */}
								<Collapse > 
								{onebuhegepanelList} 
								</Collapse>  
								{/* :
								  <div> {morbuhegeList} </div>
							}  */}
							</TabPane> 
						</Tabs> 
          </div> 
		) }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.xqReport, 
    ...state.xqReport
  };
}

export default connect(mapStateToProps)(xqReport);
