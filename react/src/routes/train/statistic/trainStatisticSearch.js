/**
 * 文件说明: 培训查询的界面
 * 作者：shiqingpei
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-07-08
 **/
import React, { Component } from 'react';
import { Button, Select, Table, Tabs, Card, Checkbox } from "antd";
import { connect } from "dva";
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import styles from '../train.less';
import ReactEcharts from 'echarts-for-react';
import exportExcel from "./ExcelExport";


const { Option } = Select;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;

class trainStatisticSearch extends Component {
	constructor(props) {
		super(props);
		let dept_name = Cookie.get('dept_name');
		const yearNow = new Date().getFullYear();
		this.state = {
			ou: null,
			dept: dept_name,
			type: '1',
			year: yearNow,

			/**
			 * 新增培训级别(全院级，分院级，部门级), 
			 * 课程级别(初中高级),
			 * 培训时间(到季度),
			 * 培训类型(内训、外训),
			*/
			train_level: '全部',
			class_level: '全部',
			train_time: '全部',
			train_kind: '全部',
			train_category: '1',
			temp: '1',
			/*新增 begin*/
			newPlanAddVisible: false,
			//用户角色
			GeneralVisible: false,
			BranchAndDepartmentVisible: false,
			//创建类型标志
			trainPlanType: '',
			newTrainPlanType: '',
			/*新增 end*/

			loading: 'false',
			/**新增自定义列 */
			checkedList: [],
			indeterminate: false,
			checkAll: false,
		};
	}

	/**新增自定义列 */
	onChange = checkedList => {
		this.setState({
			checkedList,
			indeterminate: !!checkedList.length && checkedList.length < this.plainOptions.length,
			checkAll: checkedList.length === this.plainOptions.length,
		});
	};

	onCheckAllChange = e => {
		this.setState({
			checkedList: e.target.checked ? this.plainOptions : [],
			indeterminate: false,
			checkAll: e.target.checked,
		});
	};

	//改变OU，触发查询部门服务，重新获取该OU下的部门和职务列表。 done
	handleOuChange = (value) => {
		this.setState({
			ou: value,
			dept: '',
		});
		const { dispatch } = this.props;
		/**查询该机构下的部门的服务 */
		dispatch({
			type: 'statistic_do_model/getDept',
			arg_param: value
		});

	};

	//选择部门 done
	handleDeptChange = (value) => {
		this.setState({
			dept: value
		})
	};

	//选择计划类型 done
	handleTypeChange = (value) => {
		this.setState({
			type: value
		});
	};

	//选择培训年份 done
	handleYearChange = (value) => {
		this.setState({
			year: value
		});
	};

	//选择培训级别 done
	handleTrainLevelChange = (value) => {
		this.setState({
			train_level: value
		});
	};

	//选择课程级别 done
	handleClassLevelChange = (value) => {
		this.setState({
			class_level: value
		});
	};

	//选择展示情况
	handleCategoryChange = (value) => {
		this.setState({
			temp: value
		});
		if (value === '4') {
			this.setState({
				dept: '全部'
			});
		}
	};

	//选择培训类型 done
	handleTrainKindChange = (value) => {
		this.setState({
			train_kind: value
		});
	};

	//选择培训时间 done
	handleTrainTimeChange = (value) => {
		this.setState({
			train_time: value
		})
	};

	//清空查询条件，只保留OU
	clear = () => {
		this.setState({
			dept: '',
		});
	};

	//获取季度开始时间  2019 第一季度
	getStartTime(year, season) {
		let date = '';
		switch (season) {
			case '第一季度':
				date = '-01-01';
				break;
			case '第二季度':
				date = '-04-01';
				break;
			case '第三季度':
				date = '-07-01';
				break;
			case '第四季度':
				date = '-10-01';
				break;
			default:
				date = '-01-01';
		}
		return year + date;
	}

	//获取季度结束时间
	getEndTime(year, season) {
		let date = '';
		switch (season) {
			case '第一季度':
				date = '-04-01';
				break;
			case '第二季度':
				date = '-07-01';
				break;
			case '第三季度':
				date = '-10-01';
				break;
			case '第四季度':
				date = '-12-31';
				break;
			default:
				date = '-12-31';
		}
		return year + date;
	}

	//统计信息查询点击  点击查询时根据所选展示情况，再显示所需要的列名
	search = () => {
		this.setState({
			train_category: this.state.temp,
		});
		let ou_search = this.state.ou;
		if (ou_search === null) {
			//防止没有值，默认为登录员工所在院
			ou_search = Cookie.get('OU');
		}
		let arg_params = {};
		arg_params["arg_page_size"] = 10;
		arg_params["arg_page_current"] = 1;
		arg_params["arg_ou_name"] = ou_search;

		if (this.state.dept !== '') {
			arg_params["arg_dept_name"] = this.state.dept; //部门传参加上前缀
		}
		if (this.state.train_level !== '') {
			arg_params["arg_train_level"] = this.state.train_level;
		}
		if (this.state.class_level !== '') {
			arg_params["arg_class_level"] = this.state.class_level;
		}
		if (this.state.train_time !== '') {
			arg_params["arg_train_time"] = this.state.train_time;
		}
		if (this.state.train_kind !== '') {
			arg_params["arg_train_kind"] = this.state.train_kind;
		}
		if (this.state.year !== '') {
			arg_params["arg_year"] = this.state.year;
		}
		if (this.state.train_category !== '') {
			arg_params["arg_category"] = this.state.temp;
		}

		/**新增参数 */
		arg_params["arg_is_use"] = '0';  //启用
		/**这里加上函数 */
		arg_params["arg_train_start_time"] = this.getStartTime(this.state.year, this.state.train_time);
		arg_params["arg_train_end_time"] = this.getEndTime(this.state.year, this.state.train_time);

		/**根据所选类 */
		if (this.state.temp === '1') {
			this.showColumn = this.statisticColumn1;
		} else if (this.state.temp === '2') {
			this.showColumn = this.statisticColumn2;
		} else if (this.state.temp === '3') {
			this.showColumn = this.statisticColumn3;
		} else if (this.state.temp === '4') {
			this.showColumn = this.statisticColumn4;
		}

		const { dispatch } = this.props;
		//TODO 根据条件进行查询
		dispatch({
			type: 'statistic_do_model/trainStatisticDataQuery',
			query: arg_params
		});
	};

	//导出应该是根据当前搜索的条件，查询完后再导出
	exportExcel = () => {
		const { statisticList } = this.props;
		const exportType = this.state.train_category;
		let condition = {};
		if (exportType === '1') {
			condition = {
				'培训级别': 'train_level',
				'培训时间': 'train_time',
				'培训计划数': 'train_sum',
				'培训计划完成数': 'train_done_sum',
				'培训计划执行情况(百分比)': 'train_done_situation',
				'培训经费': 'train_fee',
				'培训经费使用情况': 'train_done_fee',
				'培训经费执行情况(百分比)': 'train_fee_done_situation'
			};
		} else if (exportType === '2') {
			condition = {
				'培训类型': 'train_kind',
				'培训时间': 'train_time',
				'培训计划数': 'train_sum',
				'培训计划完成数': 'train_done_sum',
				'培训计划执行情况(百分比)': 'train_done_situation',
				'培训经费': 'train_fee',
				'培训经费使用情况': 'train_done_fee',
				'培训经费执行情况(百分比)': 'train_fee_done_situation'
			};
		} else if (exportType === '3') {
			condition = {
				'课程级别': 'class_level',
				'培训时间': 'train_time',
				'培训计划数': 'train_sum',
				'培训计划完成数': 'train_done_sum',
				'培训计划执行情况(百分比)': 'train_done_situation',
				'培训经费': 'train_fee',
				'培训经费使用情况': 'train_done_fee',
				'培训经费执行情况(百分比)': 'train_fee_done_situation'
			};
		} else if (exportType === '4') {
			condition = {
				'部门': 'deptname',
				'培训时间': 'train_time',
				'培训计划数': 'train_sum',
				'培训计划完成数': 'train_done_sum',
				'培训计划执行情况(百分比)': 'train_done_situation',
				'培训经费': 'train_fee',
				'培训经费使用情况': 'train_done_fee',
				'培训经费执行情况(百分比)': 'train_fee_done_situation'
			};
		}

		if (statisticList && statisticList.length > 0) {
			exportExcel(statisticList, '培训计划统计数据', condition);
		} else {
			message.info("无统计数据，无法导出");
		}
	};

	getColumn(value) {
		let ret = {};
		switch (value) {
			case '培训经费':
				ret = { title: '培训经费', dataIndex: 'train_fee' };
				break;
			case '培训使用经费':
				ret = { title: '培训使用经费', dataIndex: 'train_done_fee' };
				break;
			case '培训经费执行情况':
				ret = { title: '培训经费执行情况', dataIndex: 'train_fee_done_situation' };
				break;
			case '培训人数':
				ret = { title: '培训人数', dataIndex: 'train_num' };
				break;
			case '计划培训课时':
				ret = { title: '计划培训课时', dataIndex: 'train_hour' };
				break;
			case '实际完成课时':
				ret = { title: '实际完成课时', dataIndex: 'train_hour_done' };
				break;
			default:
				ret = {};
		}
		return ret;
	};

	showColumn = [];
	/**培训级别统计信息列名 */
	statisticColumn1 = [
		{ title: '培训级别', dataIndex: 'train_level' },
		{ title: '培训时间', dataIndex: 'train_time' },
		{ title: '培训计划数', dataIndex: 'train_sum' },
		{ title: '培训计划完成数', dataIndex: 'train_done_sum' },
		{ title: '培训计划执行情况', dataIndex: 'train_done_situation' },
	];

	/**培训类型统计信息列名 */
	statisticColumn2 = [
		{ title: '培训类型', dataIndex: 'train_kind' },
		{ title: '培训时间', dataIndex: 'train_time' },
		{ title: '培训计划数', dataIndex: 'train_sum' },
		{ title: '培训计划完成数', dataIndex: 'train_done_sum' },
		{ title: '培训计划执行情况', dataIndex: 'train_done_situation' },
	];


	/**课程级别统计信息列名 */
	statisticColumn3 = [
		{ title: '课程级别', dataIndex: 'class_level' },
		{ title: '培训时间', dataIndex: 'train_time' },
		{ title: '培训计划数', dataIndex: 'train_sum' },
		{ title: '培训计划完成数', dataIndex: 'train_done_sum' },
		{ title: '培训计划执行情况', dataIndex: 'train_done_situation' },
	];

	/**部门级别统计信息列名 */
	statisticColumn4 = [
		{ title: '部门', dataIndex: 'deptname' },
		{ title: '培训时间', dataIndex: 'train_time' },
		{ title: '培训计划数', dataIndex: 'train_sum' },
		{ title: '培训计划完成数', dataIndex: 'train_done_sum' },
		{ title: '培训计划执行情况', dataIndex: 'train_done_situation' },
	];

	/**具体信息列名 */
	detailColumn = [
		{ title: '', dataIndex: '' },
		{ title: '', dataIndex: '' },
	];

	plainOptions = ['培训经费', '培训使用经费', '培训经费执行情况', '培训人数', '计划培训课时', '实际完成课时'];
	defaultCheckedList = [];

	render() {

		const { loading, ouList, deptList, permission } = this.props;

		console.log("加载状态" + loading);
		const { statisticList } = this.props;

		const ouOptionList = ouList.map((item) => {
			return (
				<Option key={item.OU}>
					{item.OU}
				</Option>
			)
		});

		let deptOptionList = deptList.map((item) => {
			return (
				<Option key={item}>
					{item}
				</Option>
			)
		});

		//获取前三年的年份
		let date = new Date;
		let yearArray = [];
		for (let i = 0; i < 3; i++) {
			yearArray.push(date.getFullYear() - i);
		}
		const currentDate = date.getFullYear();

		const yearList = yearArray.map((item) => {
			return (
				<Option key={item} value={item.toString()}>
					{item}
				</Option>
			)
		});

		let showColumnList = [];
		this.showColumn.forEach((item, j) => {
			showColumnList.push(item.title);
		});

		if (this.state.checkedList.length > 0) {
			for (let i = 0; i < this.plainOptions.length; i++) {
				if (showColumnList.indexOf(this.plainOptions[i]) > -1 && this.state.checkedList.indexOf(this.plainOptions[i]) > -1) {
					/**如果两者都有，则不需要修改 */
				} else if (showColumnList.indexOf(this.plainOptions[i]) <= -1 && this.state.checkedList.indexOf(this.plainOptions[i]) > -1) {
					/**列没有，选中有。将这个加到列中 */
					this.showColumn.push(this.getColumn(this.plainOptions[i]));
					showColumnList.push(this.plainOptions[i]);
				} else if (showColumnList.indexOf(this.plainOptions[i]) > -1 && this.state.checkedList.indexOf(this.plainOptions[i]) <= -1) {
					/**列有，选中没有。将列中的这个删掉 */
					for (let j = 0; j < this.showColumn.length; j++) {
						if (this.showColumn[j].title === this.plainOptions[i]) {
							this.showColumn.splice(j, 1);
						}
					}
					for (let j = 0; j < showColumnList.length; j++) {
						if (showColumnList[j] === this.plainOptions[i]) {
							showColumnList.splice(j, 1);
						}
					}
				} else {
					/**两者都没有，不用管 */
				}
			}
		} else {
			/**从showColumn中删掉 */
			for (let i = 0; i < this.plainOptions.length; i++) {
				for (let j = 0; j < this.showColumn.length; j++) {
					if (this.showColumn[j].title === this.plainOptions[i]) {
						this.showColumn.splice(j, 1);
					}
				}
				for (let j = 0; j < showColumnList.length; j++) {
					if (showColumnList[j] === this.plainOptions[i]) {
						showColumnList.splice(j, 1);
					}
				}
			}
		}

		let charts = [];
		if (statisticList !== null && statisticList !== undefined && statisticList.length !== 0) {
			if (statisticList.length && statisticList.length > 0) {
				for (let i = 0; i < statisticList.length; i++) {
					if (statisticList[i].train_num) {
						statisticList[i].train_num = parseInt(statisticList[i].train_num);
					}
				}
			}

			/**计划完成情况是一定要显示的 */
			/**根据选择的列名展示相应的图形 */
			if (showColumnList.indexOf('培训经费') > -1 || showColumnList.indexOf('培训使用经费') > -1) {
				/**显示预算情况 */
			}
			if (showColumnList.indexOf('计划培训课时') > -1 || showColumnList.indexOf('实际完成课时') > -1) {
				/**显示课时完成情况 */
			}

			for (let i = 0; i < statisticList.length; i++) {
				let textTitle1 = '';
				let textTitle2 = '';
				let textTitle3 = '';
				if (this.state.train_category === '1') {
					// textTitle1 = statisticList[i].train_level + statisticList[i].train_time + '预算情况';
					textTitle2 = statisticList[i].train_level + statisticList[i].train_time + '完成情况';
					if (showColumnList.indexOf('培训经费') > -1 || showColumnList.indexOf('培训使用经费') > -1) {
						/**显示预算情况 */
						textTitle1 = statisticList[i].train_level + statisticList[i].train_time + '预算情况';
					} if (showColumnList.indexOf('计划培训课时') > -1 || showColumnList.indexOf('实际完成课时') > -1) {
						/**显示课时完成情况 */
						textTitle3 = statisticList[i].train_level + statisticList[i].train_time + '课时情况';
					}
				} else if (this.state.train_category === '2') {
					// textTitle1 = statisticList[i].train_kind + statisticList[i].train_time + '预算情况';
					textTitle2 = statisticList[i].train_kind + statisticList[i].train_time + '完成情况';
					if (showColumnList.indexOf('培训经费') > -1 || showColumnList.indexOf('培训使用经费') > -1) {
						/**显示预算情况 */
						textTitle1 = statisticList[i].train_kind + statisticList[i].train_time + '预算情况';
					}
					if (showColumnList.indexOf('计划培训课时') > -1 || showColumnList.indexOf('实际完成课时') > -1) {
						/**显示课时完成情况 */
						textTitle3 = statisticList[i].train_kind + statisticList[i].train_time + '课时情况';
					}
				} else if (this.state.train_category === '3') {
					// textTitle1 = statisticList[i].class_level + statisticList[i].train_time + '预算情况';
					textTitle2 = statisticList[i].class_level + statisticList[i].train_time + '完成情况';
					if (showColumnList.indexOf('培训经费') > -1 || showColumnList.indexOf('培训使用经费') > -1) {
						/**显示预算情况 */
						textTitle1 = statisticList[i].class_level + statisticList[i].train_time + '预算情况';
					}
					if (showColumnList.indexOf('计划培训课时') > -1 || showColumnList.indexOf('实际完成课时') > -1) {
						/**显示课时完成情况 */
						textTitle3 = statisticList[i].class_level + statisticList[i].train_time + '课时情况';
					}
				} else if (this.state.train_category === '4') {
					textTitle2 = statisticList[i].train_time + '完成情况';
					if (showColumnList.indexOf('培训经费') > -1 || showColumnList.indexOf('培训使用经费') > -1) {
						/**显示预算情况 */
						textTitle1 = statisticList[i].train_time + '预算情况';
					}
					if (showColumnList.indexOf('计划培训课时') > -1 || showColumnList.indexOf('实际完成课时') > -1) {
						/**显示课时完成情况 */
						textTitle3 = statisticList[i].train_time + '课时情况';
					}
				}

				let opt1 = {};
				let opt3 = {};
				let opt5 = {};
				let opt6 = {};
				if (showColumnList.indexOf('培训经费') > -1 || showColumnList.indexOf('培训使用经费') > -1) {
					console.log(showColumnList);
					opt1 = {
						title: {
							text: textTitle1,
							subtext: '',
							x: 'center'
						},
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b} : {c} ({d}%)"
						},
						legend: {
							// orient: 'vertical',
							left: 'center',
							bottom: 10
						},
						series: [
							{
								name: '预算情况',
								type: 'pie',
								radius: '55%',
								center: ['50%', '60%'],
								data: [
									{ value: statisticList[i].train_done_fee, name: '实际花出金额' },
									{ value: statisticList[i].train_fee - statisticList[i].train_done_fee, name: '未花出金额' },
								],
								itemStyle: {
									emphasis: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									},
									normal: {
										color: function (params) {
											var colorList = ['#B50729', '#1B2E4B'];
											return colorList[params.dataIndex]
										}
									}
								}
							}
						]
					};
					opt3 = {
						title: {
							text: textTitle1,
							subtext: '',
							x: 'center'
						},
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow'
							}
						},
						xAxis: {
							type: 'category',
							data: ['实际花出金额', '未花出金额']
						},
						yAxis: {
							type: 'value'
						},
						legend: {
							// orient: 'vertical',
							left: 'center',
							bottom: 10
						},
						series: [{
							data: [statisticList[i].train_done_fee, statisticList[i].train_fee - statisticList[i].train_done_fee],
							type: 'bar',
							barWidth: 60,
							itemStyle: {
								normal: {
									color: function (params) {
										var colorList = ['#B50729', '#1B2E4B'];
										return colorList[params.dataIndex]
									}
								}
							}
						}]
					};
				}
				if (showColumnList.indexOf('计划培训课时') > -1 || showColumnList.indexOf('实际完成课时') > -1) {
					opt5 = {
						title: {
							text: textTitle3,
							subtext: '',
							x: 'center'
						},
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b} : {c} ({d}%)"
						},
						legend: {
							// orient: 'vertical',
							left: 'center',
							bottom: 10
						},
						series: [
							{
								name: '课时情况',
								type: 'pie',
								radius: '55%',
								center: ['50%', '60%'],
								data: [
									{ value: statisticList[i].train_hour_done, name: '实际完成课时' },
									{ value: statisticList[i].train_hour - statisticList[i].train_hour_done, name: '未完成课时' },
								],
								itemStyle: {
									emphasis: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									},
									normal: {
										color: function (params) {
											var colorList = ['#B50729', '#1B2E4B'];
											return colorList[params.dataIndex]
										}
									}
								}
							}
						]
					};
					opt6 = {
						title: {
							text: textTitle3,
							subtext: '',
							x: 'center'
						},
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow'
							}
						},
						xAxis: {
							type: 'category',
							data: ['实际完成课时', '未完成课时']
						},
						yAxis: {
							type: 'value'
						},
						legend: {
							left: 'center',
							bottom: 10
						},
						series: [{
							data: [statisticList[i].train_hour_done, statisticList[i].train_hour - statisticList[i].train_hour_done],
							type: 'bar',
							barWidth: 60,
							itemStyle: {
								normal: {
									color: function (params) {
										var colorList = ['#B50729', '#1B2E4B'];
										return colorList[params.dataIndex]
									}
								}
							}
						}]
					};
				}

				/**完成情况必须有 */
				let opt4 = {
					title: {
						text: textTitle2,
						subtext: '',
						x: 'center'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					xAxis: {
						type: 'category',
						data: ['已完成培训数', '未完成培训数']
					},
					yAxis: {
						type: 'value'
					},
					legend: {
						left: 'center',
						bottom: 10
					},
					series: [{
						data: [statisticList[i].train_done_sum, statisticList[i].train_sum - statisticList[i].train_done_sum],
						type: 'bar',
						barWidth: 60,
						itemStyle: {
							normal: {
								color: function (params) {
									var colorList = ['#B50729', '#1B2E4B'];
									return colorList[params.dataIndex]
								}
							}
						},
					}]
				};
				let opt2 = {
					title: {
						text: textTitle2,
						subtext: '',
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						left: 'center',
						bottom: 10
					},
					series: [
						{
							name: '完成情况',
							type: 'pie',
							radius: '55%',
							center: ['50%', '60%'],
							data: [
								{ value: statisticList[i].train_done_sum, name: '已完成培训数' },
								{ value: statisticList[i].train_sum - statisticList[i].train_done_sum, name: '未完成培训数' },
							],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								},
								normal: {
									color: function (params) {
										var colorList = ['#B50729', '#1B2E4B'];
										return colorList[params.dataIndex]
									}
								}
							}
						}
					]
				};


				let pic2 = [];
				let pic1 = [<ReactEcharts
					style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
					notMerge={true}
					lazyUpdate={true}
					option={opt2} />];
				pic1.push(<ReactEcharts
					style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
					notMerge={true}
					lazyUpdate={true}
					option={opt4} />);

				if (showColumnList.indexOf('培训经费') > -1 || showColumnList.indexOf('培训使用经费') > -1) {
					console.log("培训经费");
					if (pic1.length < 4) {
						pic1.push(
							<ReactEcharts
								style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
								notMerge={true}
								lazyUpdate={true}
								option={opt1} />
						);
						pic1.push(
							<ReactEcharts
								style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
								notMerge={true}
								lazyUpdate={true}
								option={opt3} />
						);
					} else {
						pic2.push(
							<ReactEcharts
								style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
								notMerge={true}
								lazyUpdate={true}
								option={opt1} />
						);
						pic2.push(
							<ReactEcharts
								style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
								notMerge={true}
								lazyUpdate={true}
								option={opt3} />
						);
					}
				}

				if (showColumnList.indexOf('计划培训课时') > -1 || showColumnList.indexOf('实际完成课时') > -1) {
					console.log("培训课时");
					if (pic1.length < 4) {
						pic1.push(
							<ReactEcharts
								style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
								notMerge={true}
								lazyUpdate={true}
								option={opt5} />
						);
						pic1.push(
							<ReactEcharts
								style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
								notMerge={true}
								lazyUpdate={true}
								option={opt6} />
						);
					} else {
						pic2.push(
							<ReactEcharts
								style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
								notMerge={true}
								lazyUpdate={true}
								option={opt5} />
						);
						pic2.push(
							<ReactEcharts
								style={{ height: 400, width: '25%', display: 'block', float: 'left' }}
								notMerge={true}
								lazyUpdate={true}
								option={opt6} />
						);
					}
				}

				charts.push(
					<div>
						<div>
							{pic1}
						</div>
						<div>
							{pic2}
						</div>
					</div>
				);
			}
		}

		// 这里为statisticList添加一个key，从0开始
		if (statisticList && statisticList.length > 0) {
			statisticList.map((i, index) => {
				i.key = index;
				if (i.train_num) {
					parseInt(i.train_num);
				}
			})
		}

		const auth_ou = Cookie.get('OU');

		return (
			<div>
				<Card>
					<div style={{ marginBottom: '15px' }}>

						<span>按</span>&nbsp;&nbsp;
						{
							permission === '2' ?
								<Select style={{ width: 160 }} onSelect={this.handleCategoryChange} defaultValue={'1'} disabled={false}>
									<Option value='1'>培训级别</Option>
									<Option value='2'>培训类型</Option>
									<Option value='3'>课程级别</Option>
									<Option value='4'>部门维度</Option>
								</Select>
								:
								<Select style={{ width: 160 }} onSelect={this.handleCategoryChange} defaultValue={'1'} disabled={false}>
									<Option value='1'>培训级别</Option>
									<Option value='2'>培训类型</Option>
									<Option value='3'>课程级别</Option>
								</Select>
						}

						&nbsp;&nbsp;情况展示
						<br></br>
						<br></br>
						组织机构：
            <Select style={{ width: '16%', color: '#000' }} onSelect={this.handleOuChange} defaultValue={auth_ou} disabled={true}>
							{ouOptionList}
						</Select>
						&nbsp;&nbsp;&nbsp;&nbsp;部门：
						<Select disabled={permission !== '2' || this.state.temp === '4' ? true : false} style={{ color: '#000', width: '16%' }} onSelect={this.handleDeptChange} value={this.state.dept}>
							{deptOptionList}
						</Select>
						&nbsp;&nbsp;&nbsp;&nbsp;培训级别：
            <Select style={{ width: '16%' }} defaultValue={this.state.train_level} onSelect={this.handleTrainLevelChange}>
							<Option value='全部'>全部</Option>
							<Option value='全院级'>全院级</Option>
							<Option value='分院级'>分院级</Option>
							<Option value='部门级'>部门级</Option>
						</Select>
						&nbsp;&nbsp;&nbsp;&nbsp;课程级别：
                <Select style={{ width: '10%' }} defaultValue={this.state.class_level} onSelect={this.handleClassLevelChange}>
							<Option value='全部'>全部</Option>
							<Option value='初级'>初级</Option>
							<Option value='中级'>中级</Option>
							<Option value='高级'>高级</Option>
						</Select>
						<br></br>
						<br></br>
						培训类型：
            <Select style={{ width: '16%' }} defaultValue={this.state.train_kind} onSelect={this.handleTrainKindChange}>
							<Option value='全部'>全部</Option>
              <Option value='外训-外派培训'>外训-外派培训</Option>
              <Option value='内训-内部讲师培训'>内训-内部讲师培训</Option>
              <Option value='内训-外聘讲师培训'>内训-外聘讲师培训</Option>
							<Option value='内训-参加集团或分子公司培训'>内训-参加集团或分子公司培训</Option>
							<Option value='培训班'>培训班</Option>
              <Option value='线上培训'>线上培训</Option>
						</Select>
						&nbsp;&nbsp;&nbsp;&nbsp;培训年份：
                <Select style={{ width: '12%' }} onSelect={this.handleYearChange} defaultValue={currentDate}>
							{yearList}
						</Select>
						&nbsp;&nbsp;&nbsp;&nbsp;培训时间：
                <Select style={{ width: '16%' }} onSelect={this.handleTrainTimeChange} defaultValue={this.state.train_time}>
							<Option value='全部'>全部</Option>
							<Option value='第一季度'>第一季度</Option>
							<Option value='第二季度'>第二季度</Option>
							<Option value='第三季度'>第三季度</Option>
							<Option value='第四季度'>第四季度</Option>
							<Option value='全年执行'>全年执行</Option>
						</Select>
						<div className={styles.btnLayOut}>
							<Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
							&nbsp;&nbsp;&nbsp;
							&nbsp;&nbsp;&nbsp;
                  <Button type="primary" onClick={() => this.exportExcel()}>{'导出'}</Button>
						</div>
					</div>
					<div>
						<span>选择需要展示的列</span>
					</div>
					<br></br>
					<div>
						<Checkbox
							style={{ float: 'left', display: 'block' }}
							indeterminate={this.state.indeterminate}
							onChange={this.onCheckAllChange}
							checked={this.state.checkAll}
						>
							全选
         			</Checkbox>
						<CheckboxGroup
							style={{ float: 'left', display: 'block' }}
							options={this.plainOptions}
							value={this.state.checkedList}
							onChange={this.onChange}
						/>
					</div>
					<br></br>
					{/* 汇总情况不用加分页 */}
					<Table
						columns={this.showColumn}
						dataSource={statisticList}
						pagination={false}
						loading={loading}
						bordered={true}
					/>
					<br></br>
					<br></br>
					<div>
						{charts}
					</div>
				</Card>
			</div>);
	}
}

function mapStateToProps(state) {
	const {
		ouList,
		deptList,
		currentPage,
		total,
		statisticList, //统计后的数据
	} = state.statistic_do_model;
	return {
		loading: state.loading.models.statistic_do_model,
		...state.statistic_do_model,
		ouList,
		deptList,
		currentPage,
		total,
		statisticList
	};
}
export default connect(mapStateToProps)(trainStatisticSearch);

