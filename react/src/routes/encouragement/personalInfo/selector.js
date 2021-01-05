/**
 * 作者：罗玉棋
 * 日期：2019-09-17
 * 邮件：809590923@qq.com
 * 文件说明：下拉选项组件
 */
import React from "react";
import { Select } from "antd";
import * as service from "../../../services/encouragement/personalServices";
const { Option } = Select;

class Selector extends React.Component {
  state = {
    options: [],
    yearList:[]
  };
  componentDidMount = async () => {
    const { fieldName } = this.props;
    if (fieldName!="年度") {
      const data = await service.wordbookQuery({ arg_field_name: fieldName });
      if (data && data.DataRows && data.RetCode == 1) {
        this.setState({
          options: data.DataRows
        });
      }
    }else{
      var i=2015;
      var tYear = new Date().getFullYear()
      var  yearList=[]
       for(;i<=tYear;i++){
        yearList.push(i)
       }
      this.setState({
        yearList: yearList
      });
    }
  };

  render() {
    const { options,yearList } = this.state;
    return (
      yearList.length>0?
      <Select {...this.props}>
        {yearList.map(el => {
          return <Option value={el} key={el}>{el}</Option>;
        })}
      </Select>
      :
      <Select {...this.props}>
        {options.map(item => {
          return <Option value={item.code} key={item.code}>{item.name}</Option>;
        })}
      </Select>

    );
  }
}

export default Selector;
