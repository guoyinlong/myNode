/**
 * 作者：邓广晖
 * 创建日期：2017-11-07
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：每月每周项目报告信息
 */
import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/grid';
import {Table, Input, Progress,message,Button,Tooltip,Spin,Modal} from 'antd';
import {connect} from 'dva';
import styles from './projReport.less';
import request from '../../../../utils/request';
import moment from 'moment';

moment.locale('zh-cn');

const TextArea = Input.TextArea;
const confirm = Modal.confirm;

/**
 * 作者：邓广晖
 * 创建日期：2018-01-17
 * 功能：转变为千分位
 * @param value 输入的值
 */
function change2Thousands (value) {
  if(value !== undefined){
    return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }else{
    return '';
  }
}

/**
 * 作者：邓广晖
 * 创建日期：2017-11-07
 * 功能：新增月报功能页面
 */
class ProjReportAdd extends React.PureComponent {
  constructor(props) { super(props);}

  componentWillUpdate(nextProps) {
    //如果是查看月报
    if(this.props.queryData.operateType === 'view'){
      let evLineChart = echarts.init(document.getElementById('statisticsChart'));
      let xAxisName = [];
      let acValue = [];
      let evValue = [];
      let pvValue = [];
      let earnPostData = {
        transjsonarray:JSON.stringify({
          condition:{
            proj_id:this.props.queryData.proj_id,
            tag:'2'
          },
          sequence:[{"year":"0"},{"month":"0"}]
        })
      };
      const earnResData = request('/microservice/standardquery/project/monthevdataquery',earnPostData);
      earnResData.then((earnData)=>{
        if(earnData.RetCode === '1'){
          //所有pv值
          let pvPostData = {
            transjsonarray:JSON.stringify({
              condition:{
                proj_id:this.props.queryData.proj_id,
                tag:'0'
              },
              sequence:[{"year":"0"},{"month":"0"}]
            })
          };
          const pvResData = request('/microservice/standardquery/project/monthevdataquery',pvPostData);
          pvResData.then((pvData)=>{
            for(let j = 0; j < pvData.DataRows.length; j++){
              xAxisName.push(pvData.DataRows[j].month);
              pvValue.push((Number(pvData.DataRows[j].pv)/10000).toFixed(2));
              let acValueData = '0';
              let evValueData = '0';
              for(let i = 0; i < earnData.DataRows.length; i++){
                if(pvData.DataRows[j].month === earnData.DataRows[i].month &&
                  pvData.DataRows[j].year === earnData.DataRows[i].year){
                  acValueData = (Number(earnData.DataRows[i].ac)/10000).toFixed(2);
                  evValueData = (Number(earnData.DataRows[i].ev)/10000).toFixed(2);
                  break;
                }
              }
              acValue.push(acValueData);
              evValue.push(evValueData);
            }
            let option = {
              title: { text: '挣值分析图', subtext: ''},
              tooltip: { trigger: 'axis'},
              legend: { data: ['AC', 'EV', 'PV']},
              toolbox: {
                show: true,
                feature: {
                  mark: {show: true},
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
                }
              },
              calculable: true,
              xAxis: [{ type: 'category', boundaryGap: false, data: xAxisName, name: '月'}],
              yAxis: [
                {
                  type: 'value',
                  axisLabel: {
                    formatter: '{value}'
                  },
                  name: '万元'
                }
              ],
              series: [
                { name: 'AC', type: 'line', data: acValue,},
                { name: 'EV', type: 'line', data: evValue,},
                { name: 'PV', type: 'line', data: pvValue,}
              ]
            };
            evLineChart.setOption(option);
          });
        }
      });
    }

    //如果是新增月报
    if(this.props.queryData.operateType === 'add'){
      let evLineChart = echarts.init(document.getElementById('statisticsChart'));
      let xAxisName = [];
      let acValue = [];
      let evValue = [];
      let pvValue = [];
      for(let j = 0; j < nextProps.allPvDataList.length; j++){
        xAxisName.push(nextProps.allPvDataList[j].month);
        pvValue.push((Number(nextProps.allPvDataList[j].pv)/10000).toFixed(2));
        let acValueData = '0';
        let evValueData = '0';
        for(let i = 0; i < nextProps.earnData.length; i++){
          if(nextProps.allPvDataList[j].month === nextProps.earnData[i].month &&
            nextProps.allPvDataList[j].year === nextProps.earnData[i].year){
            acValueData = nextProps.earnData[i].ac;
            evValueData = nextProps.earnData[i].ev;
            break;
          }
        }
        acValue.push(acValueData);
        evValue.push(evValueData);
      }
      let option = {
        title: { text: '挣值分析图', subtext: ''},
        tooltip: { trigger: 'axis'},
        legend: { data: ['AC', 'EV', 'PV']},
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        xAxis: [{ type: 'category', boundaryGap: false, data: xAxisName, name: '月'}],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            },
            name: '万元'
          }
        ],
        series: [
          { name: 'AC', type: 'line', data: acValue,},
          { name: 'EV', type: 'line', data: evValue,},
          { name: 'PV', type: 'line', data: pvValue,}
        ]
      };
      evLineChart.setOption(option);
    }
  }

  /**
   * 作者：邓广晖
   * 创建日期：2017-12-04
   * 功能：改变文本域
   * @param e 输入事件
   * @param optType 输入框类型
   * @param maxLength 最大输入长度
   */
  setTextArea = (e,optType,maxLength) =>{
    let value = e.target.value;
    if(value.length > maxLength){
      value = value.substring(0,maxLength);
    }
    this.props.dispatch({
      type:'projReportAdd/setTextArea',
      value:value,
      optType:optType
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-12-19
   * 功能：改变里程碑的进度值
   * @param e 输入事件
   * @param index 输入框索引
   * @param item 具体某一项里程碑数据
   */
  changeMileValue = (e,index,item) => {
    //先将非数值去掉
    let value = e.target.value.replace(/[^\d.]/g, '');
    //如果以小数点开头，或空，改为0
    if (value === '.') { value = '0'}
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'))
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //最多2位小数
      value = value.substring(0, value.indexOf('.') + 3);
    }
    if (Number(value) > Number(item.maxVal) || Number(value) < Number(item.minVal)) {
      message.error("输入完成度为在 " + item.minVal +' 到 ' + item.maxVal +' 之间的两位小数！');
      value = value.substring(0,value.length-1);
    }
    if (Number(value) > 95) {
      //maxVal的值一般为95，如果maxVal的值大于了95，需要强制将大于95的值设置为95
      value = '95';
    }
    this.props.dispatch({
      type:'projReportAdd/changeMileValue',
      value:value,
      index:index
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-12-20
   * 功能：保存或者提交数据
   * @param opt_type 保存或者提交  save 为保存，submit为提交
   */
  saveOrSubmit = (opt_type) => {
    this.props.dispatch({
      type:'projReportAdd/saveOrSubmit',
      opt_type:opt_type
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-02-23
   * 功能：月报提交时的弹出框
   */
  submitConfirm = () => {
    let thisMe = this;
    confirm({
      title: '确定提交' + this.props.queryData.actualMonth + '月月报吗？',
      onOk() {
        thisMe.props.dispatch({
          type:'projReportAdd/saveOrSubmit',
          opt_type:'submit'
        });
      },
      onCancel() {
      },
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-12-26
   * 功能：返回上一页
   */
  rerurnBack = () => {
    history.back();
  };

  columns = [
    {
      title: '年份',
      dataIndex: 'year'
    }, {
      title: '月份',
      dataIndex: 'month'
    }, {
      title: 'PV',
      dataIndex: 'pv'
    }, {
      title: 'EV',
      dataIndex: 'ev'
    }, {
      title: 'AC',
      dataIndex: 'ac'
    }, {
      title: 'SPI',
      dataIndex: 'spi',
      render:(value,row,index)=>{
        if(value === 'Infinity' || value === 'NaN'){
          return '-';
        }else{
          return value;
        }
      }
    }, {
      title: 'CPI',
      dataIndex: 'cpi',
      render:(value,row,index)=>{
        if(value === 'Infinity' || value === 'NaN'){
          return '-';
        }else{
          return value;
        }
      }
    }
  ];

  render() {
    let mileStoneProgress = this.props.mileStoneList.map((item,index)=>{
      return (
        <div key={index} style={{margin:'10px 10px 20px 10px'}}>
          <div>{(index+1).toString() + '.' + item.mile_name}</div>
          {/*查看月报的时候乘以100*/}
          {this.props.queryData.operateType === 'view'?
            <Progress
              percent={Number((Number(item.initVal)*100).toFixed(2))}
              format={percent=>`${percent}%`}
              style={{height:20}}
            />
            :
            <div>
              <div style={{display:'inline-block',width:'80%'}}>
                <Progress
                  percent={Number((Number(item.initVal)).toFixed(2))}
                  format={percent=>`${percent}%`}
                  style={{height:20}}
                />
              </div>
              {this.props.mileStoneState === 'notChange'?
                <div style={{display:'inline-block',width:'15%',marginLeft:15}}>
                  <Input
                    value={item.initVal}
                    disabled={item.minVal === '100'}
                    onChange={(e)=>this.changeMileValue(e,index,item)}
                  />
                </div>
                :
                <div style={{display:'inline-block',width:'15%',marginLeft:15}}>
                  <Input
                    value={item.initVal}
                    disabled={true}
                  />
                </div>
              }

            </div>
          }
        </div>
      );
    });

    let purchaseColumns = [{
      title:'',
      dataIndex:'intro'
    }];

    for (let i = 0; i < this.props.purchaseCostTypeList.length; i++){
      purchaseColumns.push({
        title:this.props.purchaseCostTypeList[i],
        dataIndex:'fee' + i.toString(),
        render: (value, row, index) => {
          return (<div>{change2Thousands(value)}</div>);
        },
      });
    }

    let operateColumns = [{
      title:'',
      dataIndex:'intro'
    }];

    for (let i = 0; i < this.props.operateCostTypeList.length; i++){
      operateColumns.push({
        title:this.props.operateCostTypeList[i],
        dataIndex:'fee' + i.toString(),
        render: (value, row, index) => {
          return (<div>{change2Thousands(value)}</div>);
        },
      });
    }

    let carryOutColumns = [{
      title:'',
      dataIndex:'intro'
    }];

    for (let j = 0; j < this.props.carryOutCostTypeList.length; j++){
      carryOutColumns.push({
        title:this.props.carryOutCostTypeList[j],
        dataIndex:'fee' + j.toString(),
        render: (value, row, index) => {
          return (<div>{change2Thousands(value)}</div>);
        },
      });
    }

    return (
      <div>
        {/*标题区域*/}
        <div style={{textAlign:'center'}}>
          <div>
            <span className={styles.headTitleName}>{this.props.queryData.proj_name}</span>
            &nbsp;&nbsp;
            <span className={styles.headTitleName}>{this.props.queryData.actualMonth +'月月报'}</span>
            &nbsp;&nbsp;
            <span style={{fontSize:'16px'}}>{'(' + this.props.queryData.monthStartTime + '~' + this.props.queryData.monthEndTime + ')'}</span>
          </div>
          <div style={{marginTop:8}}>
            <span >{'生产编码：' + this.props.queryData.proj_code}</span>
            &nbsp;&nbsp;
            <span >{'项目经理：' + this.props.queryData.mgr_name}</span>
          </div>
        </div>
        {/*返回按钮区域*/}
        <div style={{textAlign:'right',marginBottom:8}}>
          <Button type='primary' onClick={this.rerurnBack}>{'返回'}</Button>
        </div>
        {/*第一块区域*/}
        <div className={styles.firstSection}>
          <div className={styles.reportAddWorkPlan}>
            {/*工作计划*/}
            <div>工作计划</div>
            <p>本月主要工作</p>
            <TextArea
              rows={8}
              placeholder={this.props.workPlanThisMonth === undefined || this.props.workPlanThisMonth === ''?'不高于1000字':''}
              disabled={this.props.queryData.operateType === 'view'}
              value={this.props.workPlanThisMonth}
              className={styles.textAreaStyle}
              onChange={(e)=>this.setTextArea(e,'workPlanThisMonth',1000)}
            />
            <br/><br/>
            <p>下月工作计划</p>
            <TextArea
              rows={8}
              placeholder={this.props.workPlanNextMonth === undefined || this.props.workPlanNextMonth === ''?'不高于1000字':''}
              disabled={this.props.queryData.operateType === 'view'}
              value={this.props.workPlanNextMonth}
              className={styles.textAreaStyle}
              onChange={(e)=>this.setTextArea(e,'workPlanNextMonth',1000)}
            />
          </div>
          <div className={styles.reportMileStone}>
            {/*里程碑*/}
            <div>
              <span>里程碑完成情况</span>
              &nbsp;&nbsp;&nbsp;
              <span style={{color:'red'}}>{this.props.mileStoneFinishState + '%'}</span>
            </div>
            {this.props.mileStoneState === 'change'?
              <div style={{textAlign:'center',color:'red'}}>
                <span>{this.props.mileStoneTagVal}</span>
              </div>
              :
              null
            }
            <Spin tip={'加载中…'} spinning={this.props.mileDataLoading}>
              {mileStoneProgress}
            </Spin>
          </div>
        </div>
        {/*第二块区域*/}
        <div className={styles.secondSection}>
          {/*表格区域*/}
          <div className={styles.dataStatisticTable}>
            <div>挣值数据统计(万元)</div>
            {this.props.queryData.operateType === 'add' && Number(this.props.currentPv) === 0?
              <div style={{textAlign:'center',color:'red'}}>{'项目当月PV值为空，请检查项目是否配置投资替代额！'}</div>
              :
              null
            }
            {this.props.queryData.operateType === 'add' && Number(this.props.currentAC) === 0?
              <div style={{textAlign:'center',color:'red'}}>{'项目当月AC值为空，项目产生人工成本数据后方可提交月报！'}</div>
              :
              null
            }
            <br/>
            <Table dataSource={this.props.earnData}
                   columns={this.columns}
                   bordered={true}
                   pagination={false}
            />
          </div>
          {/*图表区域*/}
          <div className={styles.dataStatisticChart} id='statisticsChart'>
          </div>
        </div>

        {/*第三块区域*/}
        <div className={styles.thirdSection}>
          {/*直接成本管理*/}
          <div>直接成本管理</div>
          {/*采购成本*/}
          <div style={{padding:10}}>
            <div className={styles.beforeTable}>采购成本</div>
            <div style={{display:'inline-block',width:'90%'}}>
              {this.props.purchaseCostTypeList.length?
                <Table dataSource={this.props.purchaseCostTableData}
                       columns={purchaseColumns}
                       bordered={true}
                       pagination={false}
                       className={styles.commonTable}
                />
                :
                <span>本月无数据</span>
              }

            </div>
          </div>
          {/*运行成本*/}
          <div style={{padding:10}}>
            <div className={styles.beforeTable}>运行成本</div>
            <div style={{display:'inline-block',width:'90%'}}>
              {this.props.operateCostTypeList.length?
                <Table dataSource={this.props.operateCostTableData}
                       columns={operateColumns}
                       bordered={true}
                       pagination={false}
                       className={styles.commonTable}
                />
                :
                <span>本月无数据</span>
              }

            </div>
          </div>
          {/*实施成本*/}
          <div style={{padding:10}}>
            <div className={styles.beforeTable}>实施成本</div>
            <div style={{display:'inline-block',width:'90%'}}>
              {this.props.carryOutCostTypeList.length?
                <Table dataSource={this.props.carryOutCostTableData}
                       columns={carryOutColumns}
                       bordered={true}
                       pagination={false}
                       className={styles.commonTable}
                />
                :
                <span>本月无数据</span>
              }
            </div>
          </div>
          {/*人工成本*/}
          <div style={{padding:10}}>
            <div className={styles.beforeTable}>人工成本</div>
            <div style={{display:'inline-block',width:'90%'}}>
              {this.props.humanCostData.length?
                <div>
                  <span>本月人工成本：</span><span>{change2Thousands(this.props.humanCostData[0].month_fee)}</span>
                  <span style={{marginLeft:'50px'}}>累计人工成本：</span><span>{change2Thousands(this.props.humanCostData[0].fee)}</span>
                </div>
                :
                <span>本月无数据</span>
              }
            </div>
          </div>
        </div>

        {/*第四块区域*/}
        <div className={styles.forthSection}>
          <div className={styles.shareCostAndMemberManage}>
            {/*分摊成本*/}
            <div>
              <span style={{fontWeight:'bold'}}>分摊成本</span>
              <span style={{marginLeft:'25px'}}>本期分摊成本：</span><span>{change2Thousands(this.props.shareCostThis)}</span>
              <span style={{marginLeft:'50px'}}>累计分摊成本：</span><span>{change2Thousands(this.props.shareCostAll)}</span>
            </div>

            {/*人员管理*/}
            <div>
              <span style={{fontWeight:'bold'}}>人员管理</span>
              <span style={{marginLeft:'25px'}}>上期人员数量：</span><span>{change2Thousands(this.props.staffTotalLast)}</span>
              <span style={{marginLeft:'20px'}}>本期人员数量：</span><span>{change2Thousands(this.props.staffTotalThis)}</span>
              <span style={{marginLeft:'20px'}}>本期人员变化：</span><span>{change2Thousands(this.props.staffTotalChange)}</span>
            </div>
          </div>
          <div className={styles.divationAnalysis}>
            {/*偏差分析*/}
            <div>偏差分析</div>
            <p>成本偏差分析</p>
            <TextArea
              rows={5}
              placeholder={this.props.costOffset === undefined || this.props.costOffset === ''?'不高于500字':''}
              disabled={this.props.queryData.operateType === 'view'}
              value={this.props.costOffset}
              className={styles.textAreaStyle}
              onChange={(e)=>this.setTextArea(e,'costOffset',500)}
            />
            <br/><br/>
            <p>进度偏差分析</p>
            <TextArea
              rows={5}
              placeholder={this.props.progressOffset === undefined || this.props.progressOffset === ''?'不高于500字':''}
              disabled={this.props.queryData.operateType === 'view'}
              value={this.props.progressOffset}
              className={styles.textAreaStyle}
              onChange={(e)=>this.setTextArea(e,'progressOffset',500)}
            />
          </div>
        </div>

        {/*备注区域*/}
        <div style={{background:'white',marginTop:17,padding:10}}>
          <div style={{textAlign:'center',fontSize:'18px',fontWeight:'bold',marginBottom:10}}>备注</div>
          <TextArea
            rows={3}
            placeholder={this.props.mark === undefined || this.props.mark === ''?'不高于100字':''}
            disabled={this.props.queryData.operateType === 'view'}
            value={this.props.mark}
            className={styles.textAreaStyle}
            onChange={(e)=>this.setTextArea(e,'mark',100)}
          />
        </div>
        {/*保存和提交按钮*/}
        {this.props.queryData.operateType === 'add'?
          <div className={styles.buttonSection}>
            <Button type='primary' onClick={()=>this.saveOrSubmit('save')}>{'保存'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {this.props.hasFullCostCount?
              <Button type='primary' onClick={this.submitConfirm}>{'提交'}</Button>
              :
              <Tooltip title={this.props.fullCostVal}>
                <Button type='primary' disabled={true}>{'提交'}</Button>
              </Tooltip>
            }
          </div>
          :
          null
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.projReportAdd,
    ...state.projReportAdd
  }
}

export default connect(mapStateToProps)(ProjReportAdd);
