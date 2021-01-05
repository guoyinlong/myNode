/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：后三张表的topselect
 */
import React from 'react';
import moment from 'moment';
import { Select,DatePicker,Button } from 'antd';
import style from '../budgetStyle.less';
const {MonthPicker} = DatePicker;
const Option = Select.Option;
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default class TopSelectInfo extends React.Component{

  constructor(props){
    super(props);
  }
  render() {
    const { changeSelect,queryData,expExl,flag } = this.props;
    const { ouList,ouInfo,dateInfo,stateInfo,stateList,list } = this.props.data;
    return (
      <div>
        {
          flag === '1' || flag === '2' || flag === '3'?
            <div className={style.titleSelect}>年月：
              <MonthPicker style={{ width: 160}} value={dateInfo} onChange={(value)=>changeSelect(value,'dateInfo')} allowClear={false}/>
            </div>
            :
            ''

        }
        {
          flag === '3'?
          <div className={style.titleSelect}>OU：
            <Select showSearch style={{ width: 200}}  value={ouInfo} onSelect={(value)=>changeSelect(value,'ouInfo')} >
              {ouList.map((item) => <Option key={item.dept_name}>{item.dept_name}</Option>)}
            </Select>
          </div>
            :
            ''
        }
        {
          flag === '3' || flag === '1'?
          <div className={style.titleSelect}>统计类型：
            <Select style={{ width: 160}}  value={stateInfo} onSelect={(value)=>changeSelect(value,'stateInfo')} >
              {stateList.map((i,index)=><Option key={index} value={i.state_code}>{i.state_name}</Option>)}
            </Select>
          </div>
            :
            ''
        }
        <div className={style.titleSelect}>
          <Button type="primary" onClick={queryData}>查询</Button>
        </div>
        <div className={style.titleSelect}>
            <Button onClick={expExl} disabled={!list.length}>导出</Button>
        </div>
        <div style={{textAlign:'right',marginTop:'10px'}}>金额单位：元</div>
      </div>
    );
  }
}
