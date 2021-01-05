/**
 *  作者: 张枫
 *  创建日期: 2018-11-06
 *  邮箱：zhangf142@chinaunicom.cn
 *  文件说明：code-smell图形组件。
 */
/*
import React from 'react';
import {Button,Modal,Tabs} from 'antd';
import ReactEcharts from 'echarts-for-react';
const TabPane = Tabs.TabPane;
class Sum extends React.Component {
  state = {
  };
  getOption=(sumData)=>{
    let option = {
      title : {
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: []
      },

      series : [
        {
          name: '汇总-Bug Vulnerability CodeSmell',
          type: 'pie',
          //radius : '55%',
          //center: ['50%', '60%'],
          radius : '70%',
          center: ['50%', '60%'],
          data:[],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
      option.legend.data = sumData.GroupMem;
      option.series[0].data = sumData.DataRows;
    return option;
  };
  render(){
    const { sumData } = this.props;
    return(
      <div >
        <ReactEcharts
          option={this.getOption(sumData)}
          style={{height: 300}}
        />
      </div>
    )
  }
}
export default  Sum

*/


import React from 'react';
import {Button,Modal,Tabs} from 'antd';
import ReactEcharts from 'echarts-for-react';
const TabPane = Tabs.TabPane;
class Sum extends React.Component {
  state = {
  };
  getOption=(sumData)=>{
    let data = {
      'symbolSize': 47,
    }
    let option = {

      /*
      title : {
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: []
      },
     */
      tooltip : {
     // trigger: 'item',
      //formatter: "{a} <br/>{b} : {c}"
      formatter: "{b}:{c}个 "
    },
      series : [
        {
         // name: '',
          type: 'treemap',
          roam:false,
          data:[data],
          breadcrumb:{show:false},
          top:'35px',
        }
      ]
    };
    //option.legend.data = sumData.GroupMem;
    option.series[0].data = sumData.DataRows;
    return option;
  };
  render(){
    const { sumData } = this.props;
    return(
      <div >
        <ReactEcharts
          option={this.getOption(sumData)}
          style={{height: 300}}
        />
      </div>
    )
  }
}
export default  Sum


