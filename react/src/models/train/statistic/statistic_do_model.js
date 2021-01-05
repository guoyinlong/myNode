/**
 * 文件说明：统计查询
 * 作者：shiqingpei
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-07-08
 **/
import Cookie from "js-cookie";
import * as trainService from "../../../services/train/trainService";
import * as hrService from "../../../services/hr/hrService";
import * as statisticService from '../../../services/train/statistic/statisticService'
// import * as overtimeService from "../../services/overtime/overtimeService"
import { message } from "antd";
import { routerRedux } from "dva/router";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../../utils/config';

const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
	auth_ou_flag = OU_NAME_CN;
}

export default {
	namespace: 'statistic_do_model',
	state: {
		ouList: [],
		deptList: [],
		currentPage: null,
		total: null,
		statisticList: [], //统计后的数据
		detailList: [],    //具体课程数据
		permission: '',
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
		saveOU(state, { ouList: DataRows }) {
			return { ...state, ouList: DataRows };
		},
		saveDept(state, { deptList: DataRows }) {
			return { ...state, deptList: DataRows };
		},
	},

	effects: {
		/**2019.8.20 新增统计查询的初始化方法,初始化界面，不用进行查询*/
		*trainStatisticInit({ query }, { call, put }) {
			//从服务获取OU列表
			let postData_getOU = {};
			postData_getOU["arg_tenantid"] = auth_tenantid;
			const { DataRows: getOuData } = yield call(hrService.getOuList, postData_getOU);
			yield put({
				type: 'saveOU',
				ouList: getOuData
			});

			//从服务获取所属OU下的部门列表
			let postData_getDept = {};
			postData_getDept["argtenantid"] = auth_tenantid;
			const { DataRows: getDeptData } = yield call(hrService.getDeptInfo, postData_getDept);
			let pureDeptData = [];   //存储去除前缀后的部门数据
			for (let i = 0; i < getDeptData.length; i++) {
				if (getDeptData[i].dept_name.split('-')[0] === auth_ou_flag && getDeptData[i].dept_name.split('-')[1]) {
					if (!getDeptData[i].dept_name.split('-')[2]) { //纪委去重
						pureDeptData.push(getDeptData[i].dept_name.split('-')[1]);
					}
				}
			}
			yield put({
				type: 'saveDept',
				deptList: pureDeptData
			});

			//查询登录人员的角色
			let queryData = {};
			let flag = '';
			queryData["arg_user_id"] = Cookie.get('userid');
			const roleData = yield call(trainService.trainCheckRole, queryData);

			if (roleData.RetCode === '1') {
				flag = roleData.DataRows[0].role_level;
				yield put({
					type: 'save',
					payload: {
						permission: flag,
					}
				});
			} else {
				message.error(roleData.RetVal);
			}

			//初始化进入界面不用进行查询
			yield put({
				type: 'save',
				payload: {
					statisticList: [],
					detailList: [],
					total: 0,
					currentPage: 1,
				}
			});

		},

		/**2019.8.20 新增服务获取对应部门  */
		*getDept({ arg_param }, { call, put }) {
			let postData_getDept = {};
			postData_getDept["argtenantid"] = auth_tenantid;
			const { DataRows: getDeptData } = yield call(hrService.getDeptInfo, postData_getDept);
			let pureDeptData = [];//存储去除前缀后的部门数据
			for (let i = 0; i < getDeptData.length; i++) {
				if (arg_param === OU_HQ_NAME_CN) { //联通软件研究院本部
					arg_param = OU_NAME_CN; //联通软件研究院
				}
				if (getDeptData[i].dept_name.split('-')[0] === arg_param && getDeptData[i].dept_name.split('-')[1]) {
					if (!getDeptData[i].dept_name.split('-')[2]) { //纪委去重
						pureDeptData.push(getDeptData[i].dept_name.split('-')[1]);
					}
				}
			}
			yield put({
				type: 'saveDept',
				deptList: pureDeptData
			});
		},

		/**数据查询 begin */

		/**2019.8.20 新增培训统计信息查询 */
		*trainStatisticQuery({ param }, { call, put }) {
			param.arg_ou_id = Cookie.get("OUID");

			yield put({
				type: 'save',
				payload: {
					statisticList: [],
					loading: true,
				}
			});

			console.log("参数" + JSON.stringify(param));
			const statisticData = yield call(statisticService.trainStatisticDataQuery, param);
			if (statisticData.RetCode === '1') {
				yield put({
					type: 'save',
					payload: {
						statisticList: statisticData.DataRows,
						loading: false,
					}
				});
			}
		},

		/**数据查询 end */
		*trainStatisticDataQuery({ query }, { call, put }) {
			//统计信息查询
			yield put({
				type: 'trainStatisticQuery',
				param: query,
			});
		},
	},
	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname, query }) => {
				if (pathname === '/humanApp/train/trainStatistic/statistic_search') {
					/**培训计划统计的查询列表 初始化 */
					dispatch({ type: 'trainStatisticInit', query });
				} else if (pathname === '/humanApp/train/trainPlanList') {

					dispatch({ type: 'trainStatisticInit', query });
				}
			});
		}
	},
};
