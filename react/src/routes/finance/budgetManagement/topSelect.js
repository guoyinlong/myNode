/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：年度预算
 */
import React from 'react';
import moment from 'moment';
import { Select,DatePicker,Button,Upload,Input,Col,Checkbox } from 'antd';
import style from './budgetStyle.less';
import SelectDeptModule from './selectDeptModule';

//const dateFormat = 'YYYY-MM';
const {MonthPicker} = DatePicker;
const Option = Select.Option;
const { TextArea } = Input;
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default class TopSelectInfo extends React.Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  // 限制月份的选择
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment().valueOf();
      return value.valueOf() > lastDate
    }
  };

  render() {
    const { flag,onChangeDatePicker,onChangeOu,onChangeSeason,onChangeEditionInfo,onChangeDept,onChangeDeptOnlyOne,queryData,exportExcel,downloadBudgetTemp,cancelBudget, uploadM, roleFlag, dataFlag } = this.props;
    const { ouList,deptList,dateInfo,seasonInfo,ouInfo,deptInfo,editionInfo,checkList,deptFlag,deptInfoOnlyOne,role } = this.props.data;
    let ouListOption = ouList.map((item) => {
      return (
        <Option key={item.dept_id+'-'+item.dept_name}>
          {item.dept_name}
        </Option>
      )
    });
    let plainOptions=[];
    let DeptOptions=[];
    for(let i=0;i<deptList.length;i++){
      plainOptions.push(<Col span={20} key={i}><Checkbox value={deptList[i].dept_name}>{deptList[i].dept_name}</Checkbox></Col>);
      DeptOptions.push(<Option key={deptList[i].dept_id+'-'+deptList[i].dept_name}>{deptList[i].dept_name.split('-').length>1?deptList[i].dept_name.split('-')[1]:deptList[i].dept_name}</Option>);
    }
    return (
      <div>
        {
          flag === '1' || flag === '3'?
            <div className={style.titleSelect}>年度：
              <Select showSearch style={{ width: 70}}  value={dateInfo} onSelect={onChangeDatePicker}>
                <Option value={ (new Date().getFullYear()-2).toString() }>{ (new Date().getFullYear()-2).toString() }</Option>
                <Option value={ (new Date().getFullYear()-1).toString() }>{ (new Date().getFullYear()-1).toString() }</Option>
                <Option value={ (new Date().getFullYear()).toString() }>{ (new Date().getFullYear()).toString() }</Option>
              </Select>
            </div>
            :
            null
        }
        {
          flag === '2' || flag === '4' || flag === '5' || flag === '6'?
            <div className={style.titleSelect}>年月：
              <MonthPicker style={{ width: 100}} onChange={this.props.onChangeDatePicker} value={moment(dateInfo?dateInfo:'', 'YYYY-MM')} allowClear={false} disabledDate={this.disabledDate}/>
            </div>
            :
            null
        }
        {
          flag === '3' ?
            <div style={{display:'inline-block',marginTop:'10px',marginLeft:20}}>季度：
              <Select mode="multiple"  style={{width: 120}} placeholder="请选择季度" value={seasonInfo} onChange={onChangeSeason}>
                <Option value="1">第一季度</Option>
                <Option value="2">第二季度</Option>
                <Option value="3">第三季度</Option>
                <Option value="4">第四季度</Option>
              </Select>
            </div>
            :
            null
        }
        {
          flag !== '6'?
            <div className={style.titleSelect}>OU：
              <Select showSearch style={{ width: 180}}  value={ouInfo} onSelect={onChangeOu} >
                {ouListOption}
              </Select>
            </div>:null
        }

        {
          flag === '1' || flag === '2' || flag === '3' || flag === '4'?
            roleFlag === true ?
              deptFlag === true ?
                <div className={style.titleSelect}>部门：
                  <Select style={{ width: 200}} value={deptInfoOnlyOne} onSelect={onChangeDeptOnlyOne} disabled={ouInfo.split('-')[1]==='联通软件研究院'}>
                    {flag!=='3'?<Option key={"全部"}>{"全部"}</Option>:null}
                    {DeptOptions}
                  </Select>
                </div>
                :
                <div className={style.titleSelect}>部门：
                  <TextArea autosize={{ maxRows: 3 }} style={{ width: 200, verticalAlign: 'middle'}}  value={deptInfo} onClick={(e)=>this.refs.selectDeptModule.showModule(e,deptInfo)} disabled={ouInfo.split('-')[1]==='联通软件研究院'}/>
                </div>
              :<div className={style.titleSelect}>部门：
                <Select style={{ width: 200}} value={deptList[0].dept_name} onSelect={onChangeDeptOnlyOne}>
                  {DeptOptions}
                </Select>
              </div>
            :null
        }
        {
          flag === '2' || flag === '4'?
            <div className={style.titleSelect}>费用项维度：
              <Select  style={{ width: 100}}  value={editionInfo} onSelect={onChangeEditionInfo} >
                <option value='1'>简版</option>
                <option value='0'>完整版</option>
              </Select>
            </div>
            :
            null
        }
        {
          flag === '5'?
            <div className={style.titleSelect}>统计类型：
              <Select  style={{ width: 100}}  value={editionInfo} onSelect={onChangeEditionInfo} >
                <option value='1'>月统计</option>
                <option value='2'>年统计</option>
              </Select>
            </div>
            :
            null
        }
        <div className={style.titleSelect}>
          <Button type="primary" onClick={queryData}>查询</Button>
        </div>
        {
          (flag === '1' || flag ==='3') && role===true?
            <div className={style.titleSelect}>
              <Button type="primary" onClick={downloadBudgetTemp} disabled={ouInfo.split('-')[1]==='联通软件研究院'}>{'模板下载'}</Button>
            </div>
            :
            null
        }
        {
          (flag === '1' || flag ==='3') && role===true?
            <div className={style.titleSelect}>
              <Upload  {...uploadM}>
                <Button type="primary" disabled={ouInfo.split('-')[1]==='联通软件研究院'||dataFlag!==0}>导入</Button>
              </Upload>
            </div>
            :
            null
        }
        {
          (flag === '1' || flag ==='3') && role===true?
            <div className={style.titleSelect}>
              <Button type="primary" onClick={cancelBudget} disabled={ouInfo.split('-')[1]==='联通软件研究院'||dataFlag===0}>{'撤销'}</Button>
            </div>
            :
            null
        }
        <div className={style.titleSelect}>
          <Button type="primary" onClick={exportExcel} >导出</Button>
        </div>

        <SelectDeptModule ref="selectDeptModule" flag={flag} plainOptions = {plainOptions} onChangeDept={onChangeDept} checkList={checkList} dispatch={this.props.dispatch}/>
      </div>
    );
  }
}
