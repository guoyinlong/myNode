/**
 * 作者：窦阳春
 * 日期：2019-4-13
 * 邮箱：douyc@itnova.com.cn
 * 功能：安委办检查/分院检查/部门检查首页
 */
import React  from 'react';
import {connect } from 'dva';
import { Table, Button,DatePicker, Popconfirm, Input, Select, Pagination, Spin } from 'antd'
import styles from '../../securityCheck/securityCheck.less'
import { routerRedux } from 'dva/router';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
// const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
const Search = Input.Search; 
const {Option} = Select;    
let data = {	RowCount: 10 }                                                                                                                                         
class securityOfficeIndex extends React.PureComponent {
	constructor(props) {super(props);}
	state = {
    searchKeyword: '', //关键字
    beginTime: '', 
    endTime: '',
    stateChoose: '0', //状态
  }

  // 表格
	columns = [
		{
			key: 'key',
			dataIndex: 'key',
			title: '序号'
		},
		{
			key: 'taskTitle',
			dataIndex: 'taskTitle',
			title: '任务名称'
		},
		{
			key: 'taskTime',
			dataIndex: 'taskTime',
			title: '检查时间'
		},
		{
			key: 'taskTypeDesc',
			dataIndex: 'taskTypeDesc',
			title: '检查方式'
		},
		{
			key: 'taskStatusDesc',
			dataIndex: 'taskStatusDesc',
			title: '状态'
    },
    {
			key: 'createTime',
			dataIndex: 'createTime',
			title: '创建时间'
    },
		{
			key: 'handle',
			dataIndex: 'handle',
			title: '操作',
		  	render:(text,record) => {
          if (record.taskStatusDesc == '草稿') {
            return (
              <div>
                <Button size="small" type="primary" onClick={() =>this.gotoModify(record)}>修改</Button>
                <Popconfirm title = '确定删除' onConfirm = {()=>this.delTask( record )}>
                  <Button type = "primary" size="small" style = {{marginLeft : '3px'}}>删除</Button>
							  </Popconfirm>
              </div>
            )}
				return (
					<div>
						<Button size="small" type="primary" onClick={() =>this.gotoDetail(record)}>详情</Button>
					</div>
				)
			}
		}
	]
  //----------------------方法----------------------//
  gotoDetail = (record) => { //跳转详情页
    let pathCheck = '/checkDetailing'
    if(record.taskStatusDesc == '检查中') {//跳转检查中
      pathCheck = '/checkDetailing'
    }else if(record.taskStatusDesc == '检查完成') {//检查完成
      pathCheck = '/checkFinish'
    }
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname + pathCheck,
      query:  {
        record: JSON.stringify(record)
      }
    }))
  } 
  gotoModify = (record) => { //修改
		this.props.dispatch(routerRedux.push({
			pathname: this.props.location.pathname + '/modifyTask',
			query:  {
				record: JSON.stringify(record)
			}
		}))
  }	
	delTask = (record) => { // 删除草稿
    const {dispatch} = this.props;
		dispatch({
			type: 'securityOfficeIndex/delTask',
			record
		})
	}
	taskNameSearch = (value) => { //任务名称
    const {dispatch} = this.props;
    this.setState({searchKeyword: value})
    data['taskTitle'] = value;
    data['taskStatus'] = this.state.stateChoose
    data['startTime'] = this.state.beginTime
    data['endTime'] = this.state.endTime
    if(this.state.stateChoose == '0') { //状态为全部的时候不传状态
      data['taskStatus'] && delete data['taskStatus']
    }
    dispatch({
      type:"securityOfficeIndex/queryTaskList",
      data,
    });
  }
  inputChange = (e) => {
    this.setState({searchKeyword: e.target.value})
  }
  //得到时间保存时间
  changeDate = (date,dateString) => {
    const beginTime = dateString[0];
    const endTime = dateString[1];
    this.setState({
        beginTime,
        endTime,
    });
    data['taskTitle'] = this.state.searchKeyword;
    data['taskStatus'] = this.state.stateChoose
    data['startTime'] = beginTime
    data['endTime'] = endTime
    if(this.state.stateChoose == '0') { //状态为全部的时候不传状态
      data['taskStatus'] && delete data['taskStatus']
    }
    this.props.dispatch({
      type:"securityOfficeIndex/queryTaskList",
      data
    });
};
  //状态
  onStateChange = (value) => {
    this.setState({
      stateChoose: value,
    });
    data['taskTitle'] = this.state.searchKeyword;
    data['taskStatus'] = value;
    data['startTime'] = this.state.beginTime
    data['endTime'] = this.state.endTime
    if(value == '0') { //状态为全部的时候不传状态
      data['taskStatus'] && delete data['taskStatus']
    }
    this.props.dispatch({
      type:"securityOfficeIndex/queryTaskList",
      data
    });
  }
  empty = () => { //清空
    this.setState({
      searchKeyword: '', 
      beginTime: '', 
      endTime: '',
      stateChoose: '0', 
    })
    this.props.dispatch({
      type: "securityOfficeIndex/queryTaskList",
    })
  }
  changePage = (page) => { //分页
    this.props.dispatch({type: "securityOfficeIndex/changePage", page})
  }
  newTask = () => { //跳转到新建任务页面
    this.props.dispatch(routerRedux.push({
			pathname: this.props.location.pathname + '/setNewTask',
		}))
  }
	//----------------------页面渲染----------------------//
	render() {
    const {stateList, tableData} = this.props
    // 状态Option
    const stateListOption = stateList.length === 0 ? ''
    : stateList.map((item, index) => (
        <Option key={item.id} value={item.id}>{item.stateName}</Option>
	))
		return(
			<Spin tip="加载中..." spinning={this.props.loading}>
					<div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>检查任务栏</h2>
            <Search placeholder="任务名称"  
               value = {this.state.searchKeyword}
               onSearch = {value=>this.taskNameSearch(value)} 
               onChange={(e)=>this.inputChange(e)}
               style = {{width:200, marginRight:10}}/>
            时间：<RangePicker  onChange = {this.changeDate}  style = {{width:200, marginRight:10}}
                 value={   // 判断开始时间和结束时间是不是''是就显示null， 否则显示自己设置的值
                 this.state.beginTime=== ''
                 || this.state.endTime===''
                 ? null : [moment(this.state.beginTime, dateFormat), moment(this.state.endTime, dateFormat)]}
                 format={dateFormat}/>
            状态：
            <Select value={this.state.stateChoose} style={{ width: "200px" }} onChange={(value)=>this.onStateChange(value)} style = {{width:200}}>
            {stateListOption}
						</Select>
            <div style= {{float: "right"}}>
              <Button size="default" type="primary" onClick={this.empty} style= {{marginRight: "10px"}}>清空</Button>
              <Button size="default" type="primary" onClick={this.newTask}>新建任务</Button>
            </div>
            <Table style= {{marginTop: "10px"}} 
            columns = {this.columns}
            dataSource = {tableData}
            className={styles.orderTable}
            bordered={true}
            loading={this.props.loading}
            pagination={false}/>
            <Pagination
            current = {this.props.pageCurrent}
            pageSize = {10}
            total = {this.props.allCount}
            onChange = {this.changePage}
            style = {{textAlign: 'center', marginTop: '20px'}}
            />
          </div>
			 </Spin>
		)
					
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.securityOfficeIndex, 
    ...state.securityOfficeIndex
  };
}

export default connect(mapStateToProps)(securityOfficeIndex);
