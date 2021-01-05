/**
 *  作者: 张枫
 *  创建日期: 2018-11-06
 *  邮箱：zhangf142@chinaunicom.cn
 *  文件说明：代码质量bug级别图形组件
 */

import React from 'react';
import {Button,Modal,Tabs} from 'antd';
import ReactEcharts from 'echarts-for-react';


import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';


const TabPane = Tabs.TabPane;
class BugSum extends React.Component {
  getOption=( bugData )=>{
    let option = {
      title : {
        text: 'Bug'
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
       // axisLabel:
       // {interval: 0},
        data: []
      },
      yAxis: {},
      series: [],
    };

    option.xAxis.data = bugData.StaffNam;
    for (let i = 0 ;i < parseInt(bugData.Week) ;i++) {
      let obj = {};
      obj.type = "bar";
      obj.name = bugData.Date[i];
      obj.data = bugData.DataRows[i].data;
      option.series.push(obj);
    }
    return option;
  };
  render(){
    const { bugData } = this.props;
    return(
      <div >
        {
          <ReactEcharts
            option={this.getOption(bugData)}
            style={{height: 300}}
            notMerge={true}
            lazyUpdate={true}
            theme={"theme_name"}
          />
        }
      </div>
    )
  }
}

export default  BugSum









