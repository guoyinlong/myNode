/**
 *  作者: 张枫
 *  创建日期: 2018-11-06
 *  邮箱：zhangf142@chinaunicom.cn
 *  文件说明：代码质量bug级别图形组件
 */
import React from 'react';
import {Button,Modal,Tabs} from 'antd';
import ReactEcharts from 'echarts-for-react';
const TabPane = Tabs.TabPane;
class VulSum extends React.Component {
  state = {
  };
  getOption=( vulData )=>{
    let option = {
      title : {
        text: 'Vulnerability'
      },
      legend :{

      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {
          type : 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {},
      series: [],
    };
    option.xAxis.data = vulData.StaffNam;
    for (let i = 0 ;i < parseInt(vulData.Week) ;i++) {
      let obj = {};
      obj.type = "bar";
      obj.name = vulData.Date[i];
      obj.data = vulData.DataRows[i].data;
      option.series.push(obj);
    }
    return option;
  };
  render(){
    const { vulData } = this.props;
    return(
      <div >
        {
          <ReactEcharts
            option={this.getOption(vulData)}
            style={{height: 300}}
            notMerge={true}
          />
        }
      </div>
    )
  }
}

export default  VulSum



