/**
 * 作者：张楠华
 * 创建日期：2018-12-20
 * 邮箱：zhangnh6@chinaunicom.cn
 *文件说明：
 */
import React from "react";
import { Spin, Button, Calendar, Badge } from "antd";
import { connect } from "dva";
import moment from "moment/moment";
import style from "./statistics/statistic.less";

class workdayManage extends React.PureComponent {
    state = {};
    // **************************工作日管理***********************

    // 工作日管理-日历年月变化
    onPanelChange = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: "workdayManage/onPanelChange",
            value: value
        });
    };
    // 日历-根据日期 返回日期格子内的内容
    getListData = (value) => {
        let holidayList = this.props.holidayList;
        let listData = [];
        holidayList.forEach((item) => {
            if (moment(item.holiday_date).format("YYYY-MM-DD").toString() === value.format("YYYY-MM-DD").toString()) {
                listData = [
                    { type: "success", content: "节假日" }
                ];
            }
        });
        return listData || [];
    };
    // 将日期内显示的内容渲染成列表
    dateCellRender = (value) => {
        const listData = this.getListData(value);
        return (
            <ul className={style.events}>
                {
                    listData.map(item => (
                        <li key={item.content}>
                            <Badge status={item.type} text={item.content}/>
                        </li>
                    ))
                }
            </ul>
        );
    };
    // 点击选中某个日期
    selectDate = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: "workdayManage/selectDate",
            value: value
        });
    };
    // 提交按钮
    confirmHoliday = () => {
        const { dispatch } = this.props;
        dispatch({
            type: "workdayManage/confirmHoliday"
        });

    };
    // **************************工作日管理***********************

    render() {
        return (
            <Spin tip={"加载中…"} spinning={this.props.loading}>
                <div className={style.wrap}>
                    <div><p style={{textAlign: 'center', fontSize: '20px', marginBottom: '10px'}}>工作日管理</p></div>
                    <div>
                        <div style={{position:'relative'}}>
                          <div style={{marginTop:'10px'}}>
                            <Button type='primary' onClick={this.confirmHoliday}>提交</Button>
                          </div>
                          <div style={{position:'absolute',top:'40px',fontSize:'16px'}}>
                            {moment(this.props.yearAndMonth).month() + 1}月工作日：
                            {this.props.holidayList.length ? this.props.month_days - this.props.holidayList.length : this.props.month_days}
                            天
                          </div>
                        </div>
                        <Calendar
                          dateCellRender={this.dateCellRender}
                          onPanelChange={this.onPanelChange}
                          onSelect={this.selectDate}
                          mode={'month'}
                          className={style.calendarStyle}
                        />
                    </div>
                </div>
            </Spin>
        );
    }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.workdayManage,
    ...state.workdayManage
  };
}
export default connect(mapStateToProps)(workdayManage);
