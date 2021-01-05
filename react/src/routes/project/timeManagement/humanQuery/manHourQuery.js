/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：工时管理普通角色界面。
 */
import React from 'react';
import SquareTab from './squareTab';
import { Spin,Select,DatePicker } from 'antd';
import Style from '../review/review.less';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import ManHourCard from './manHourCard';
/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  功能：工时管理普通角色界面
 */
class ManHourQuery extends React.Component{
  constructor(props){
    super(props)
  }
  state={
    projInfo:'',
  };

  sTabsClick=(key,manHourPorjList)=>{
    const{dispatch,manTag} = this.props.data;
    dispatch({
      type:'manHourQuery/changeActiveSKey',
      activeSKey:key,
    });
    if (key === '1'){
      if(manTag === 1){
        dispatch({
          type:'manHourQuery/weekQuery',
        });
      }else if(manTag === 2){
        dispatch({
          type:'manHourQuery/weekQueryPM',
          projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:''),
        });
      }else if(manTag === 3){
        dispatch({
          type:'manHourQuery/weekQueryDM',
          projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:''),
        });
      }
    }else if(key ==='2'){
      if(manTag === 1){
        dispatch({
          type:'manHourQuery/monthQuery',
        });
      }else if(manTag === 2){
        dispatch({
          type:'manHourQuery/monthQueryPM',
          projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:''),
        });
      }else if(manTag === 3){
        dispatch({
          type:'manHourQuery/monthQueryDM',
          projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:''),
        });
      }
    }else if(key ==='3'){
      if(manTag === 1){
        dispatch({
          type:'manHourQuery/seasonQuery',
        });
      }else if(manTag === 2){
        dispatch({
          type:'manHourQuery/seasonQueryPM',
          projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:''),
        });
      }else if(manTag === 3){
        dispatch({
          type:'manHourQuery/seasonQueryDM',
          projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:''),
        });
      }
    }else if(key ==='4'){
      if(manTag === 1){
        dispatch({
          type:'manHourQuery/selfDefinedQuery',
          date:this.state.date,
        });
      } else if(manTag === 2){
        dispatch({
          type:'manHourQuery/selfDefinedQueryPM',
          date:this.state.date,
          projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:''),
        });
      }else if(manTag === 3){
        dispatch({
          type:'manHourQuery/selfDefinedQueryDM',
          date:this.state.date,
          projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:''),
        });
      }
    }
  };
  changeProjName=(value)=>{
    const { dispatch,manTag,activeSKey } =this.props.data;
    this.setState({
      projInfo:value,
    });
    if (activeSKey === '1'){ //本周
      if(manTag === 2){ //项目经理
        dispatch({
          type:'manHourQuery/weekQueryPM',
          projInfo:value,
        });
      }else if(manTag === 3){
        dispatch({
          type:'manHourQuery/weekQueryDM',
          projInfo:value,
        });
      }
    }else if(activeSKey ==='2'){
      if(manTag === 2){
        dispatch({
          type:'manHourQuery/monthQueryPM',
          projInfo:value,
        });
      }else if(manTag === 3){
        dispatch({
          type:'manHourQuery/monthQueryDM',
          projInfo:value,
        });
      }
    }else if(activeSKey ==='3'){
      if(manTag === 2){
        dispatch({
          type:'manHourQuery/seasonQueryPM',
          projInfo:value,
        });
      }else if(manTag === 3){
        dispatch({
          type:'manHourQuery/seasonQueryDM',
          projInfo:value,
        });
      }
    }else if(activeSKey ==='4'){
      this.setState({
        date:null
      });
      if(manTag === 2){
        dispatch({
          type:'manHourQuery/selfDefinedQueryPM',
          projInfo:value,
        });
      }else if(manTag === 3){
        dispatch({
          type:'manHourQuery/selfDefinedQueryDM',
          projInfo:value,
        });
      }
    }
  };
  disabledDate=(value)=>{
    if(value){
      let lastDate =  new Date().valueOf();
      return value.valueOf() > lastDate
    }
  };
  onChangeDatePicker = (value,manHourPorjList) => {
    const { dispatch,manTag } =this.props.data;
    this.setState({
      date:value,
    });
    if(manTag === 1){
      dispatch({
        type:'manHourQuery/selfDefinedQuery',
        date:value,
      });
    }else if(manTag === 2){
      dispatch({
        type:'manHourQuery/selfDefinedQueryPM',
        date:value,
        projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:'')
      });
    }else if(manTag === 3){
      dispatch({
        type:'manHourQuery/selfDefinedQueryDM',
        date:value,
        projInfo:this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_id:'')
      });
    }
  };
  render(){
    const { manHourPorjList,manTag,weekList,monthList,seasonList,selfDefinedList,dispatch,detailList,tabIsDisable,activeSKey } =this.props.data;
    const titleOption = manHourPorjList.map((item,index)=>{
      return (
        <Option value={item.proj_id} key={index}>
          {item.proj_name}
        </Option>
      )
    });
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>

         <div className={Style.wrap}>
           <div style={{marginBottom:'20px'}}>
             {
               manTag !== 1?
                 <div>
                   <span>团队名称：</span>
                   <Select onChange={(value)=>this.changeProjName(value)} style={{minWidth:'500px'}} size="large" value={this.state.projInfo!==''?this.state.projInfo:(manHourPorjList.length !==0?manHourPorjList[0].proj_name:'')} placeholder="请选择团队名称">
                     {titleOption}
                   </Select>
                 </div>
                 :
                 []
             }
           </div>
           {
             tabIsDisable === true ?
               ''
               :
               <SquareTab
                 activeKey= {activeSKey}
                 onTabsClick={(key)=>this.sTabsClick(key,manHourPorjList)}>
                 <div name="本周" id="1">
                   <ManHourCard list={weekList} flag="1" dispatch={dispatch} detailData={detailList}/>
                 </div>
                 <div name="本月" id="2">
                   <ManHourCard list={monthList} flag="2" dispatch={dispatch} detailData={detailList}/>
                 </div>
                 <div name="本季度" id="3">
                   <div>说明：最右侧显示的百分数表示工时饱和度</div>
                   <ManHourCard list={seasonList} flag="3" dispatch={dispatch} detailData={detailList}/>
                 </div>
                 <div name="自定义" id="4" style={{position:'relative'}}>
                   <RangePicker
                     onChange={(value)=>this.onChangeDatePicker(value,manHourPorjList)}
                     format = {dateFormat}
                     disabledDate={this.disabledDate}
                     value={this.state.date}
                     style={{position:'absolute',left: '400px', top: '-49px'}}
                     allowClear={false}
                   />
                   <ManHourCard list={selfDefinedList} flag="4" dispatch={dispatch} detailData={detailList} date={this.state.date}/>
                 </div>
               </SquareTab>
           }
         </div>
      </Spin>
    )
  }
}
export default ManHourQuery;
