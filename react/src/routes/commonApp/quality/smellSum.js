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
class SmellSum extends React.Component {
  state = {
  };
  getOption=( smellData )=>{
    let option = {
      title : {
        text: 'Code smell'
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
    option.xAxis.data = smellData.StaffNam;
    for (let i = 0 ;i < parseInt(smellData.Week) ;i++) {
      let obj = {};
      obj.type = "bar";
      obj.name = smellData.Date[i];
      obj.data = smellData.DataRows[i].data;
      option.series.push(obj);
    }
    return option;
  };
  render(){
    const { smellData } = this.props;
    return(
      <div >
        {
          <ReactEcharts
            option={this.getOption(smellData)}
            style={{height: 300}}
            notMerge={true}
          />
        }
      </div>
    )
  }
}
export default  SmellSum



