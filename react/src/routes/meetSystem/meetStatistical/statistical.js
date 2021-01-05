/**
 * 作者：卢美娟
 * 日期：2018-5-24
 * 邮箱：lumj14@chinaunicom.cn
 * 功能：会议室统计页面
 */
import { connect } from 'dva';
import React from 'react';
import {Row, Col, Card, Table, Badge,Button,Cascader } from 'antd'; //引入antd中的Row、Col组件
import RoomUsageTime from '../../../components/meetSystem/roomUsageTime';
import RoomUsageFrequency from '../../../components/meetSystem/roomUsageFrequency';
import DeptUsageTime from '../../../components/meetSystem/deptUsageTime';
import DeptUsageFrequency from '../../../components/meetSystem/deptUsageFrequency';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';
import Cookie from 'js-cookie';

class Statistical extends React.Component {
    constructor (props) {
        super(props);
    };

    state = {
      startTime:moment().format('YYYY-MM-DD'),
      endTime:moment().format('YYYY-MM-DD'),
    };

    gotoLimited = () => {
      const {dispatch}=this.props;
      dispatch(routerRedux.push({
        pathname:'/adminApp/meetSystem/limited'
      }));
    }

    gotoForced = () => {
      const {dispatch}=this.props;
      dispatch(routerRedux.push({
        pathname:'/adminApp/meetSystem/forced'
      }));
    }

    onChange = (value) => {
      // alert(value)
    }

    disabledDate = (current) => {
      return current && current.valueOf() < Date.parse('2017-01-01');
    }

    disabledDate2 = (current) => {
      return current.valueOf() > Date.now();
    }

    getStartTime = (date,dateString) => {
      this.setState({
        startTime: dateString
      })
    }

    getEndTime = (date,dateString) =>{
      this.setState({
        endTime: dateString
      })
    }

    render () {

        return (
            <div>
              <div style = {{marginBottom:20}}>
              {(Cookie.get('OUID') == 'e65c02c2179e11e6880d008cfa0427c4')?
                <div>
                  <Button type = 'primary' style = {{marginRight:20,}} onClick = {this.gotoLimited}>查看限制人员</Button>
                  <Button type = 'primary'  onClick = {this.gotoForced}>查看被强制取消</Button>
                </div>
                :
              null
              }

              </div>
              查询时间段：&nbsp;&nbsp;
              <MonthPicker defaultValue={moment(new Date(), monthFormat)} onChange={this.getStartTime} disabledDate={this.disabledDate} format={monthFormat} style = {{marginBottom:10}}/> ~ &nbsp;
              <MonthPicker defaultValue={moment(new Date(), monthFormat)} onChange={this.getEndTime}  disabledDate={this.disabledDate2} format={monthFormat} style = {{marginBottom:10}}/>
              {/*统计维度：<Cascader size="large" defaultValue={['按月份', '四月']} options={options} onChange={this.onChange} style = {{marginBottom:10}}/>*/}

    
              <Card style = {{marginBottom:10}} title={<div>会议室预定时长 <span style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>单位：（小时）</span></div>} bordered={false}>
                <RoomUsageTime beginTime={this.state.startTime} endTime={this.state.endTime}/>
              </Card>

              <Card style = {{marginBottom:10}}  title={<div>会议室预定频次 <span style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>单位：（次）</span></div>} bordered={false}>
                <RoomUsageFrequency beginTime={this.state.startTime} endTime={this.state.endTime}/>
              </Card>

              <Card title={<div>部门预定时长 <span style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>单位：（小时）</span></div>} bordered={false}>
                <DeptUsageTime beginTime={this.state.startTime} endTime={this.state.endTime}/>
              </Card>
              <br/>
              <Card title={<div>部门预定频次 <span style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>单位：（次）</span></div>} bordered={false}>
                <DeptUsageFrequency beginTime={this.state.startTime} endTime={this.state.endTime}/>
              </Card>

            </div>
        )
    }
}


function mapStateToProps(state) {
  const { list, query} = state.statistical;
  return {
    loading: state.loading.models.statistical,
    list,
    query,

  };
}
export default connect(mapStateToProps)(Statistical);
