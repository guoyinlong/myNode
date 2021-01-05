/**
 * 作者：张楠华
 * 创建日期：2018-12-20
 * 邮箱：zhangnh6@chinaunicom.cn
 *文件说明：
 */
import { message } from 'antd';
import * as timeConfigService from '../../../services/project/timeManagement';
import moment from "moment";

export default {
    namespace:'workdayManage',

    state:{
        // **************************工作日管理***********************
        workDays: "", // 查询所选月份的工作日天数
        month_days: "",// 月份天数
        yearAndMonth: moment(), // 选择的月份
        holidayList: [],// 节假日的列表
        value: '', // 选择的日期
        // **************************工作日管理***********************
    },
    reducers:{
        initData(state) {
            return {
                ...state,
              workDays: "", // 查询所选月份的工作日天数
              month_days: "",// 月份天数
              yearAndMonth: moment(), // 选择的月份
              holidayList: [],// 节假日的列表
              value: '', // 选择的日期
            }
        },

        save(state, action) {
            return {...state,...action.payload};
        },
    },
    effects:{
        // **************************工作日管理***********************
        * holidayQuery({ value }, { call,put }) {
          let postData = {
            arg_total_year: value.year().toString(),
            arg_total_month: (value.month() + 1).toString()
          };
          const data = yield call(timeConfigService.queryHolidaydayS, postData);

          if (data.RetCode === "1") {
            yield put({
              type: "save",
              payload: {
                workDays: data.legal_month_days,
                month_days: data.month_days,
                holidayList: data.DataRows,
                yearAndMonth: value, // 选择的月份
              }
            });
          }
        },

        * onPanelChange({ value }, { put }) {
            yield put({
                type: "save",
                payload: {
                    workDays: '',
                    month_days: '',
                    holidayList: [],
                    yearAndMonth: value,
                }
            });
            yield put({
                type: "holidayQuery",
                value,
            });
        },

        // holidayList 格式都是YYYY-MM-DD  yearAndMonth 格式YYYYMMDD
        * selectDate({ value }, { select, put }) {
            let { yearAndMonth } = yield select(state => state.workdayManage);
            // 如果所选月份与holidayList月份不一致，将holidayList置空
            if (yearAndMonth.month() !== value.month() ) {
                yield put({
                    type: "save",
                    payload: {
                        holidayList: [],
                        yearAndMonth: value
                    }
                });

                yield put({
                    type: "holidayQuery",
                    value,
                });
                message.info('您已切换到'+ (value.month() + 1) + '月！')
            } else {
                yield put({
                    type: "save",
                    payload: {
                        yearAndMonth: value
                    }
                });
                yield put({
                    type: "dealHolidayList",
                    value,
                });
            }
        },

        // 将选择的日期放进holidaylist
        * dealHolidayList ({ value }, { select, put }) {
            let { holidayList, month_days } = yield select(state => state.workdayManage);
            // 然后将选择的日期放进去
            let newHolidayList;
            //判断value是否在holidayList里面，如果在则删除，如果不在加进去
            let inHoliday = holidayList.filter(item => item.holiday_date === value.format("YYYY-MM-DD").toString())[0];
            if (inHoliday) {
                newHolidayList = holidayList.filter(item2 =>
                    item2.holiday_date !== value.format("YYYY-MM-DD").toString());//如果在里面，将item里holiday_date 等于value的删除
            } else {
                newHolidayList = holidayList.filter(item3 =>
                    item3.holiday_date !== value.format("YYYY-MM-DD").toString());
                //如果不在里面，将value加进去，三个字段：一个holiday_date：2018-10-9，
                //holiday_weekday
                //holiday_tag:1
                newHolidayList.push({
                    holiday_date: value.format('YYYY-MM-DD').toString(),
                    holiday_weekday: '周' + "日一二三四五六".charAt(value.format("d")),
                    holiday_tag: "1"
                });
            }
            let arg_newHolidayList = newHolidayList.map((item4)=>{
                return ({
                    holiday_date: item4.holiday_date,
                    holiday_weekday: item4.holiday_weekday,
                    holiday_tag: item4.holiday_tag,

                })
            });
            yield put({
                type: "save",
                payload: {
                    yearAndMonth: value,
                    holidayList: JSON.parse(JSON.stringify(arg_newHolidayList)),
                    workDays: Number(month_days) - arg_newHolidayList.length,
                }
            });
        },

        // 提交已经选区的假日
        *confirmHoliday ({ }, { call, select, put }) {
            let { month_days, workDays, yearAndMonth, holidayList } =
                yield select(state => state.workdayManage);

            let postData = {
                arg_standard_year: yearAndMonth.year().toString(),
                arg_standard_month: (yearAndMonth.month() + 1).toString(),
                arg_month_days: month_days,
                arg_legal_month_days: workDays,
                date_list: JSON.stringify(holidayList),
            };
            const data = yield call(timeConfigService.settingHolidayS, postData);
            if (data.RetCode === "1") {
                message.info("设置成功！");
            } else {
                message.info("设置失败！");
            }

            yield put({
                type: "holidayQuery",
                value:yearAndMonth,
            });
        },
        // **************************工作日管理***********************
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/projectApp/timesheetManage/workdayManage') {
                    dispatch({type:'holidayQuery',value:moment()});
                    dispatch({type:'initData'})
                }
            });
        },
    }
}
