/*
 * 作者：张楠华
 * 日期：2018-6-28
 * 邮箱：zhangnh6@chinaunicom.cn
 * 说明：加计扣除-表6(v1.0)
 */

import React from 'react'; //引入react
import {connect} from 'dva'; //从dva中引入connect
import { Collapse, Form, Button, Select,Tooltip,Spin } from 'antd'; //从antd中引入所有需要的组件
import style from './costpool.css'; //引入本页样式文件
import Styles from '../../../../components/finance/subsidiaryCollect/subsidiaryCollect.less'
//时间插件汉化
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
//时间插件汉化结束

const FormItem = Form.Item; //定义表单中item组件
const Panel = Collapse.Panel;
const Option = Select.Option; //定义选择组件中的选项组件

//渲染本页面
class costpool extends React.Component{

  state = {
    year : (new Date().getFullYear()).toString(),
    stateCode : '1'
  };
  onChangeYear = (value) =>{
    this.setState({
      year : value,
    });
  };
  onChangeStateCode = (value) =>{
    this.setState({
      stateCode : value,
    });
  };
  queryCollect = () =>{
    this.props.dispatch({
      type : "costPool/queryCollect",
      year : this.state.year,
      stateCode : this.state.stateCode,
    })
  };
  expExl = () =>{
    const { year } = this.state;
    window.open(`/microservice/cosservice/divided/ExportCollectExcel?arg_state_code=1&arg_year=${year}`)
  };
  render() {
    const { list,title,loading } = this.props;
    return (
      <Spin spinning={loading}>
        <div  className={style.container}>
          <div style={{marginBottom : "30px"}}>
            年度：
            <Select onChange={this.onChangeYear} style={{width: 100}}
                    value={this.state.year}>
              <Option value={(new Date().getFullYear()-2).toString()}>{(new Date().getFullYear()-2).toString()}</Option>
              <Option value={(new Date().getFullYear()-1).toString()}>{(new Date().getFullYear()-1).toString()}</Option>
              <Option value={(new Date().getFullYear()).toString()}>{(new Date().getFullYear()).toString()}</Option>
            </Select>&nbsp;&nbsp;
            状态：
            <Select onChange={this.onChangeStateCode} style={{width: 100}}
                    value={this.state.stateCode}>
              <Option value='1'>已审核</Option>
              <Option value='2'>待审核</Option>
            </Select>
            <Button type="primary" htmlType="submit" className={style.selectMargin} onClick={this.queryCollect}>查询</Button>
            <Button type="primary" className={style.selectMargin} onClick={this.expExl}>导出</Button>
          </div>
          <hr style={{marginBottom: 40}}/>
          {
            title.length !==0?title.map((i,index)=>{
              return (
                <Collapse defaultActiveKey={['1']} accordion key={index+1}>
                  <Panel header={i.name} key={index+1}>
                    <div className={Styles.subsidiaryItemHalf2}>
                      {
                        i.list.map((k,kdx)=>
                          <div key={kdx}>
                            <Tooltip title={k.name} placement="topRight">
                              <span>{k.name}</span>
                            </Tooltip>
                            {
                              list.map((iList,indexList)=>{
                                if(k.name === iList.fee_name){
                                  return(
                                    <span key={indexList}>{iList.cost_loan}</span>
                                  )
                                }
                              })
                            }
                          </div>
                        )
                      }
                    </div>
                  </Panel>
                </Collapse>
              )
            }):<div style={{textAlign:'center',color:'#ccc',minHeight:'500px',paddingTop:'20px'}}>暂无数据</div>
          }
        </div>
      </Spin>
    );
  }

}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.costPool,
    ...state.costPool
  };
}
export default connect(mapStateToProps)(costpool);
