/**
 * 作者：窦阳春
 * 日期：2020-10-27
 * 邮箱：douyc@itnova.com.cn
 * 文件说明：新闻共享平台-舆情管理新增页面
 */
import { message } from "antd";
import { routerRedux } from "dva/router";
import viewArray from "material-ui/svg-icons/action/view-array";
import * as Services from '../../../services/newsOne/newsOneServers';

function isNumber(nubmer) {
	var re = /^\d+$/;
	if (re.test(nubmer)) {
		 return true;
	}else{
			return false;
	}
}
var date = new Date();
var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
let currentDate = date.getFullYear() +'-' + ( date.getMonth() + 1 ) + '-' + day
export default {
	namespace: 'opinionAdd',
	state: {
		id: '', //修改跳转页面id
    deptData: [],
		deptValue: '',
    titleTime: currentDate, //标题时间
    publishTime: '', //发布时间
    superviseStartTime: '', //监督开始时间
    superviseEndTime: '', //监督结束时间
    superviseNum: 0, //监督次数
    insideGoodSupervise: '', //对内了解舆情 正面舆情：
    insideBadSupervise: '', //对内了解舆情 负面舆情：
    outSideGoodSupervise: '', //对外了解舆情 正面舆情：
    outSideBadSupervise: '', //对外了解舆情 负面舆情：
    goodAction: '', //针对正面舆情
		badAction: '', //针对负面舆情
		pubTypeNum: [''], //数字
		pubTypeValue: [], //宣传类型
		channelValue: [''], //宣传渠道一级
		channeloneNum: [''],
		channelNum: [[]],
		channelTwo: [[]],
		channelTwoList: [], //宣传渠道二级
		titleName: '',
		pubChannelList: [
			{
				channelName: '对外媒介',
				second: []
			},
			{
				channelName: '集团层面',
				second: []
			},
			{
				channelName: '软件研究院层面',
				second: []
			},
		],

    divNum: [0],
    channelTwoNum: [[0]],
    length: 0,
    channelDivNum: [0],
    channelLength: 0,
	channelTwoLength: [0],
	taskid:"",
	},
	reducers: {
		save(state, action) {
			return { ...state,
				...action.payload
			};
    },
	},

	effects: {
		*saveValue({value, flag, time}, {put, select}) { // 保存填选字段
			value = value == undefined ? '' : value;
			let {pubTypeValue, pubTypeNum, channelValue, channeloneNum, channelNum, channelTwo} = yield select(v=>v.opinionAdd)
			let params = {}
			if(time == undefined && ((flag == 'superviseNum' || flag.indexOf('pubTypeNum') > -1) && ( value!=='' && isNumber(value) == false))) {
				message.destroy();
				message.info("请输入数字！")
				return
			}
			if(time == undefined) {
				let index = flag.slice(-1) || '';
				if(flag.indexOf('pubTypeValue') > -1) {
					pubTypeValue[index] = value 
					params[flag.substring(0, flag.length-1)] = pubTypeValue;
				}else if(flag.indexOf('pubTypeNum') > -1) {
					pubTypeNum[index] = value
					params['pubTypeNum'] = pubTypeNum;
				}else if(flag.indexOf('channelValue') > -1) {
					channelValue[index] = value
					params['channelValue'] = channelValue;
				}else if(flag.indexOf('channeloneNum') > -1) {
					channeloneNum[index] = value
					params['channeloneNum'] = channeloneNum;
				}else if(flag.indexOf('channelTwo') > -1) {
					index = flag.slice(0, flag.length-1).slice(-1); //行索引
					let twoIndex = flag.slice(-1) //二级行索引
					channelTwo[index][twoIndex] = value
				}else if(flag.indexOf('channelNum') > -1) {
					index = flag.slice(0, flag.length-1).slice(-1); //行索引
					let twoIndex = flag.slice(-1) //二级行索引
					channelNum[index][twoIndex] = value
				}else{
					params[flag] = value 
				}
			}else if(time!=undefined) {
				if(time == "start_end") {
					params = {
						superviseStartTime: value[0],
						superviseEndTime: value[1]
					}
				}else if(time.indexOf('Time') > -1) {
					params[time] = value
				}
			}
			yield put({
				type: 'save',
				payload: params
			})
		},
		*addTypeDiv({}, {put, select}) { //增加一级div循环数组
			let { divNum, length, } = yield select(v=>v.opinionAdd)
			if(length < 2) {
				let len1 = length+1
				divNum.push(len1);
				yield put({
					type: 'save',
					payload: {
						divNum,
						length: len1,
					}
				})
			}else {return}
		},
		*addChannelTwoDiv({i}, {put, select}) {
			let { channelTwoNum, channelTwoLength, channelTwoList} = yield select(v=>v.opinionAdd);
			if(channelTwoLength[i] < channelTwoList[i].length - 1) { //本行长度小于本行对应的二级渠道长度减1（因为长度从0开始计算）
				let len1 = channelTwoLength[i] + 1;
				channelTwoLength[i] = len1;
				channelTwoNum[i] = [...channelTwoNum[i], len1];
				yield put({
					type: 'save',
					payload: {
						channelTwoNum,
						channelTwoLength: channelTwoLength,
					}
				})
			}else {return}
		},
		*removeChannelDiv({index}, {put, select}) { //减少宣传渠道div 减少时对应行二级数据清空
			let { channelValue, channelNum, channelTwo, channeloneNum, channelTwoList, channelDivNum, channelLength, channelTwoNum, channelTwoLength } = yield select(v=>v.opinionAdd);
			channelLength--;
			channelDivNum.splice(index, 1);
			channelTwoLength[index] = 0; //删除行的二级行长度为0 
			channelTwoNum[index] = [0]; //删除行的二级行数量为0

			channelValue.splice(index, 1);
			channeloneNum.splice(index, 1);
			channelTwo.splice(index, 1);
			channelNum.splice(index, 1);
			channelTwoList.splice(index, 1)
			yield put({
				type: 'save',
				payload: {
					channelValue,
					channelNum,
					channelTwo,
					channeloneNum,
					channelTwoList,
					channelDivNum,
					channelLength,
					channelTwoNum,
					channelTwoLength
				}
			})
		},
		*removeChannelTwoDiv({index, twoIndex}, {put, select}) { 
			let { channelNum, channelTwo, channelTwoNum, channelTwoLength} = yield select(v=>v.opinionAdd);
			channelTwoLength[index]--;
			channelTwoNum[index].splice(twoIndex,1); //减去第i行的第twoIndex行
			channelTwo[index].splice(twoIndex, 1);
			channelNum[index].splice(twoIndex, 1);
			yield put({
				type: 'save',
				payload: {
					channelTwo,
					channelNum,
					channelTwoLength,
					channelTwoNum
				}
			})
		},
		*removeTypeDiv({index}, {put, select}) {
			let {pubTypeValue, pubTypeNum, divNum, length} = yield select(v=>v.opinionAdd)
			length--;
			divNum.splice(index, 1);
			pubTypeValue.splice(index, 1);
			pubTypeNum.splice(index, 1);
			yield put({
				type: 'save',
				payload: {
					pubTypeValue,
					pubTypeNum,
					divNum,
					length
				}
			})
		},
		*init({query}, {call, put}) { //进入查询 
			if(JSON.stringify(query) == '{}') { //新增页面
				yield put({
					type: 'save',
					payload: {
						deptValue: '',
						titleTime: currentDate, //标题时间
						publishTime: '', //发布时间
						superviseStartTime: '', //监督开始时间
						superviseEndTime: '', //监督结束时间
						superviseNum: 0, //监督次数
						insideGoodSupervise: '', //对内了解舆情 正面舆情：
						insideBadSupervise: '', //对内了解舆情 负面舆情：
						outSideGoodSupervise: '', //对外了解舆情 正面舆情：
						outSideBadSupervise: '', //对外了解舆情 负面舆情：
						goodAction: '', //针对正面舆情
						badAction: '', //针对负面舆情
						pubTypeNum: [''], //数字
						pubTypeValue: [], //宣传类型
						channelValue: [''], //宣传渠道一级
						channeloneNum: [''],
						channelNum: [[]],
						channelTwo: [[]],
						channelTwoList: [[]], //宣传渠道二级
						divNum: [0],
						channelTwoNum: [[0]],
						length: 0,
						channelDivNum: [0],
						channelLength: 0,
						channelTwoLength: [0],
						taskid:"",
						difference:query.difference,
					}
				})
			}else {//修改页面
				if(query.difference=="审核"){
					let recData = {
                        approval_id: query.newsId,
                    };
					let response = yield call(Services.showTodoApprovalDetail, recData)
					var modifyData =response.dataRows.projApply.businessObj
					var taskid=response.dataRows.taskId
					var tableId=response.dataRows.projApply.tableId
					var difference=query.difference
					
				}else{
					var modifyData = yield call(Services.queryPubSentimentItem, {id: query.newsId})
				}
					if(modifyData.retCode == '1') {
						let {endTime, startTIme, measuresUp, titleName, feedbackUnit, releaseTime, foreignDown, foreignUp, internalDown, 
						internalUp, titleTime, measuresDown, num, pubChannel, pubType} = modifyData.dataRows;
						pubChannel = pubChannel[0] == null ? [] : pubChannel;
						let typeNum = pubType.map((v, i)=> {return v.typeNum});
						let typeName = pubType.map((v, i)=> {return v.typeName});
						let channeloneNum = pubChannel.map((v, i)=> {return v.channelNum});
						let channelName = pubChannel.map((v, i)=> {return v.channelName});
						let channelTwoName = pubChannel.map((v)=> {return v.second.length> 0 ? v.second.map((item) => {return item.channelName} ) : ['']});
						let channelTwoNum = pubChannel.map((v)=> {return v.second.length> 0 ? v.second.map((item) => {return item.channelNum} ) : ['']});
						var divNum = [], channeloneDivNum = [];
						for(var i = 0;i < typeNum.length;i++) {divNum[i] = i}
						for(var i = 0;i < channeloneNum.length;i++) {channeloneDivNum[i] = i};
						let resData = {}, channelTwoListData = [];
						channelTwoListData.length = channelName.length;
						resData = yield call(Services.queryChannelInPubSentiment, {name: '', flag: 1})
						if(resData.retCode == '1') {
							var secondArr = channelName.map((v)=> {return resData.dataRows.filter((item)=> {return item.name == v }) })
							secondArr = secondArr.map((v)=>{return v[0].second});
							yield put({ //接口完成后需要把请求回来的数据保存到state里
								type: 'save', 
								payload: {
									deptValue: feedbackUnit,
									titleTime, //标题时间
									publishTime: releaseTime, //发布时间
									superviseStartTime: startTIme, //监督开始时间
									superviseEndTime: endTime, //监督结束时间
									superviseNum: Number(num), //监督次数
									insideGoodSupervise: internalUp, //对内了解舆情 正面舆情：
									insideBadSupervise: internalDown, //对内了解舆情 负面舆情：
									outSideGoodSupervise: foreignUp, //对外了解舆情 正面舆情：
									outSideBadSupervise: foreignDown, //对外了解舆情 负面舆情：
									goodAction: measuresUp, //针对正面舆情
									badAction: measuresDown, //针对负面舆情
									pubTypeNum: JSON.stringify(pubType) !== '[]' ? typeNum : [''], //数字
									pubTypeValue: JSON.stringify(pubType) !== '[]' ? typeName : [], //宣传类型
									channelValue: JSON.stringify(pubChannel) !== '[]' ? channelName : [''], //宣传渠道一级
									channeloneNum: JSON.stringify(pubChannel) !== '[]' ? channeloneNum : [''], //宣传渠道一级循环篇数
									channelNum: JSON.stringify(pubChannel) !== '[]' ? channelTwoNum: [[]],
									channelTwo: JSON.stringify(pubChannel) !== '[]' ? channelTwoName: [[]],
									channelTwoList: JSON.stringify(pubChannel) !== '[]' ? secondArr: [[]], //宣传渠道二级
									titleName,
									divNum: JSON.stringify(pubType) !== '[]' ? JSON.parse(JSON.stringify(divNum)) : [0], //宣传类型级循环数组
									channelTwoNum: JSON.stringify(pubChannel) !== '[]' ? JSON.parse(JSON.stringify(channelTwoNum)) : [[0]],//宣传渠道二级循环数组,(虚拟数组，只需每行循环数组长度跟每行返回的数据数组长度保持一致)
									length:  JSON.stringify(pubChannel) !== '[]' ? typeNum.length-1 : 0, //宣传类型循环长度
									channelDivNum: JSON.stringify(pubChannel) !== '[]' ? channeloneDivNum : [0], //宣传渠道一级循环数组
									channelLength: JSON.stringify(pubChannel) !== '[]' ? channeloneDivNum.length -1 : 0,//宣传渠道循环长度
									channelTwoLength: JSON.stringify(pubChannel) !== '[]' ? channelTwoNum.map((v)=>{return v.length - 1}) : [0], //推算二级长度数组 
									tableId:tableId?tableId:"",
									taskid:taskid?taskid:"",
									difference:difference?difference:""

								}
							})
						}
					}else{
						message.error("查询失败" + modifyData.retVal);
					}
				
				
				
			}
			let data = yield call(Services.queryDept) //部门查询
			if(data.retCode == '1') {
        		data.dataRows.map((v,i)=> v.key = i)
				yield put({
					type: 'save',
					payload: {
						deptData: data.dataRows,
						id: query.newsId || 'addPage',
					}
				})
			}else{
				message.error( '查询失败' + data.retVal)
			}
		},
		*addChannelTwoListData({}, {put, select}) { //新增一级||二级选择框数据，虚拟占位作用，避免报错
			let {channelTwoList, channelTwo, channelNum, channelDivNum, channelLength, channelTwoNum, channelTwoLength,} = yield select(v=>v.opinionAdd);
			if(channelLength < 2) {
				let len2 = channelLength+1 
				channelDivNum.push(len2);
				channelTwoList = [...channelTwoList, []];
				channelTwo = [...channelTwo, []];
				channelNum = [...channelNum, []];
				yield put({
					type: 'save',
					payload: {
						channelTwoList,
						channelTwo,
						channelNum,
						channelLength: len2,
						channelDivNum,
						channelTwoNum: [...channelTwoNum, [0]],
						channelTwoLength: [...channelTwoLength, 0]
					}
				})
			}else {return}
		},
		*queryChannelInPubSentiment({flag, value, index}, {call, put, select}) { //查找二级渠道数据
			let {channelTwoList, channelTwo, channelNum, channelTwoNum, channelTwoLength} = yield select(v=>v.opinionAdd);
			channelTwoLength[flag.slice(-1)] = 0; //删除行的二级行长度为0 
      channelTwoNum[flag.slice(-1)] = [0]; //删除行的二级行数量为0
			let channel = yield call(Services.queryChannelInPubSentiment, {name: value, flag: 0})
			channelTwoList[index] = JSON.parse(JSON.stringify(channel.dataRows[0].second))
			channelTwo[index] = []
			channelNum[index] = []
			yield put({
				type: 'save',
				payload: {
					channelTwoList,
					channelTwo, //清空二级
					channelNum,
					channelTwoNum,
					channelTwoLength
				}
			})
		},
		*cancel({}, {put}) {
			yield put({
				type: 'save',
				payload: {
					deptValue: '',
					titleTime: currentDate, //标题时间
					publishTime: '', //发布时间
					superviseStartTime: '', //监督开始时间
					superviseEndTime: '', //监督结束时间
					superviseNum: 0, //监督次数
					insideGoodSupervise: '', //对内了解舆情 正面舆情：
					insideBadSupervise: '', //对内了解舆情 负面舆情：
					outSideGoodSupervise: '', //对外了解舆情 正面舆情：
					outSideBadSupervise: '', //对外了解舆情 负面舆情：
					goodAction: '', //针对正面舆情
					badAction: '', //针对负面舆情
					pubTypeNum: [''], //数字
					pubTypeValue: [], //宣传类型
					channelValue: [''], //宣传渠道一级
					channeloneNum: [''],
					channelNum: [[]],
					channelTwo: [[]],
					channelTwoList: [], //宣传渠道二级
					divNum: [0],
					channelTwoNum: [[0]],
					length: 0,
					channelDivNum: [0],
					channelLength: 0,
					channelTwoLength: [0]
				}
			})
		},
		*action({todo}, {call, put, select}) {
			let {deptValue, titleTime,  publishTime, superviseStartTime, superviseEndTime, superviseNum, 
			insideGoodSupervise, insideBadSupervise, outSideGoodSupervise, outSideBadSupervise, goodAction, badAction, id, pubTypeNum, pubTypeValue,
			channelValue, channeloneNum, channelNum, channelTwo,taskid,tableId,difference} = yield select(v=>v.opinionAdd)
			let postData = {};
			//--------宣传类型数据处理-----------//
			pubTypeValue.length = pubTypeNum.length 
			var pubType = pubTypeValue.map((v, i) => {
				return {
					typeName: v,
					typeNum: pubTypeNum[i]
				}
			})
			pubType = pubType.filter((v) => {
				return v.typeName != '' && v.typeName != undefined && v.typeNum != '' && v.typeNum != undefined
			})
			//--------宣传渠道数据处理-----------//
			channelValue.length = channeloneNum.length ;
			var pubChannel = channelValue.map((v, i) => {
				return {
					channelName: v,
					channelNum: channeloneNum[i],
					second: []
				}
			})
			pubChannel = pubChannel.filter((v) => { //过滤一级
				return v.channelName != '' && v.channelName != undefined && v.channelNum != '' && v.channelNum != undefined
			})
			pubChannel.map((v, i) => { //加对应二级
				channelTwo[i].length = channelNum[i].length
				v.second = channelTwo[i].map((vv, ii) => {
					return {
						channelName : vv,
						channelNum: channelNum[i][ii]
					}
				})
			})
			pubChannel.map((v, i) => { //过滤二级
				v.second = v.second.filter((vv, ii) => {
					return vv.channelName != '' && vv.channelName != undefined && vv.channelNum != '' && vv.channelNum != undefined
				})
			});
			if(todo == 'save' ) {
				if(deptValue == '' || titleTime == '') {
					message.destroy();
					message.info("标题时间和反馈单位不能为空！")
					return
				}
			}else if(todo == 'submit') {
				if(deptValue == '' || titleTime == '' || publishTime == '' || superviseStartTime == '' || superviseEndTime == '' || superviseNum === ''
				|| insideGoodSupervise == '' || insideBadSupervise == '' || outSideGoodSupervise == '' || outSideBadSupervise == '' || goodAction == ''
				|| badAction == '' || JSON.stringify(pubType) == '[]' || JSON.stringify(pubChannel) == '[]'
				|| JSON.stringify(pubChannel) == "[]" ) {
					message.destroy();
					message.info("请输入必填字段！")
					return
				}
			}
			postData = {
				titleTime,
				feedbackUnit: deptValue,
				releaseTime: publishTime,
				pubType: JSON.stringify(pubType),
				pubChannel:JSON.stringify(pubChannel),
				startTIme: superviseStartTime,
				endTime: superviseEndTime,
				num: Number(superviseNum),
				internalUp: insideGoodSupervise,
				internalDown: insideBadSupervise,
				foreignUp: outSideGoodSupervise,
				foreignDown: outSideBadSupervise,
				measuresUp: goodAction,
				measuresDown: badAction,
				// id:tableId?tableId:id,//稿件id
				taskId:taskid,//环节id
			}
			let resData = id == 'addPage' ? yield call(Services.addPubSentiment, {...postData, flag: todo == 'submit' ? 1 : 0})
			: yield call(Services.updatePubSentiment, {...postData, flag: todo == 'submit' ? 1 : 0,id:tableId?tableId:id})
			if(resData.retCode == '1') {
				message.success(todo == 'submit' ? '提交成功' : "保存成功")
				if(difference){
					yield put(routerRedux.push('/adminApp/newsOne/myReview'));	
				}else{
				yield put(routerRedux.push('/adminApp/newsOne/opinionManagementIndex'));	
				}
				
			}else {
				message.error(todo == 'submit' ? '提交失败：' : "保存失败：" + resData.retVal)
			}
		}
	},

	subscriptions: {
		setup({
			dispatch,
			history
		}) {
			return history.listen(({
				pathname,
				query
			}) => {
				if (pathname === '/adminApp/newsOne/opinionManagementIndex/opinionAdd'
				 || pathname === '/adminApp/newsOne/opinionManagementIndex/opinionModify') { //此处监听的是连接的地址  //
					dispatch({
						type: 'init',
						query
					});
				}
			});
		},
	},
};