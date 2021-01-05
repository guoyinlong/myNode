/**
 * 作者：任华维
 * 日期：2017-10-21 
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：黑名单查询图表
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：图表组件
 */
function ChartModal({location,chartData}) {
    const {reqTimes,hitTimes,noHitTimes,drdsTimes} = chartData
    const option = {
              color: ['#55C9A6'],
              tooltip : {
                  trigger: 'axis',
                  axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                      type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  }
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  top: '3%',
                  containLabel: true
              },
              xAxis : [
                  {
                      type : 'category',
                      data : ['请求', '缓存命中', '缓存未命中', '查询drds数据库'],
                      axisTick: {
                          alignWithLabel: true
                      },
                      axisLabel :{
                          interval:0
                      }
                  }
              ],
              yAxis : [
                  {
                      type : 'value'
                  }
              ],
              series : [
                  {
                      name:'直接访问',
                      type:'bar',
                      barWidth: '60%',
                      data:[reqTimes, hitTimes, noHitTimes, drdsTimes]
                  }
              ]
          };

  return (
    <ReactEcharts option={option} style={{height: '300px', width: '100%'}} className={'react_for_echarts'}/>

  );
}
export default ChartModal;
