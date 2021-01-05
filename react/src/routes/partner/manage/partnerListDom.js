/**
 * 文件说明：合作伙伴
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2017-10-25
 */
import React from 'react'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Progress,Collapse } from 'antd';
import Style from './partnerListDom.less';
import Cookie from 'js-cookie';

const year = new Date().getFullYear();
const month = new Date().getMonth()+1;
const Panel = Collapse.Panel;

class CreateListDom extends React.Component {
    
    clincItem = (year,month)=> {
        const{dispatch}=this.props;
        let query={
            'arg_kpi_year':year,
            'arg_kpi_month':month,
            'arg_user_id':Cookie.get('userid')
        };
        dispatch(routerRedux.push({
            pathname:'/projectApp/purchase/detail',query
        }));
    }
    
    createHearder = (year)=> {
        return (
            <div className={Style.title}>
                <h3>{`${year}年度`}</h3>
            </div>
        )
    }
    
    getStateCon = (state)=> {
        let kpiState = '';
        switch(state){
            case '0':
                kpiState = '待填写'
                break;
            case '1':
                kpiState = '待审核'
                break;
            case '2':
                kpiState = '待评价'
                break;
            case '4':
                kpiState = '待评级'
                break;
            case '5':
                kpiState = '已结束'
                break;
            default:
                kpiState = '待填写'
        }
        return kpiState;
    }
    
    createItem = ()=> {
        
        if(this.props.data.length == 0) {
            return(
                <div>
                    <div className={Style.container}>
                        <Collapse  bordered={false} defaultActiveKey={['1']}>
                            <Panel header={this.createHearder(year)} key="1">
                                <div onClick={()=>{this.clincItem(new Date().getFullYear(),new Date().getMonth()+1)}} className={Style.div_addKpi}>+</div>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            )
        } else {
            let isShow = false;
            let monthData = JSON.parse(this.props.data[0].info);
            if(this.props.data[0].kpi_year == year  && monthData[monthData.length-1].kpi_month != month) {
                isShow = true;
            }
            
            return( this.props.data.map((item,index)=>{
                
                return (
                    <div key={index}>
                        <div className={Style.container}>
                            <Collapse  bordered={false} defaultActiveKey={['1']}>
                                <Panel header={this.createHearder(item.kpi_year)} key="1">
                                    {
                                        JSON.parse(item.info).map((item,index)=>{
                                            return(
                                                <div key={index} className={Style.firstDiv} onClick={()=>{this.clincItem(item.kpi_year,item.kpi_month)}}>
                                                    <div>
                                                        <span className={Style.month}>{`${item.kpi_month}月`}</span>
                                                        <span className={Style.score}>?</span>
                                                        <span className={Style.progress}><Progress type="circle" percent={75} width={80} format={() => this.getStateCon(item.state)}/></span>
                                                    </div>
                                                    <div className={Style.secDiv}>
                                                        <span>考核得分  ??</span>
                                                        <span>贡献度  ??</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    {isShow&&item.kpi_year==year?<div onClick={()=>{this.clincItem(new Date().getFullYear(),new Date().getMonth()+1)}} className={Style.div_addKpi}>+</div>:''}
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                )
            }))
        }  
    }
  
    render(){
        return (
            <div>
                {this.createItem()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        state
    };
}
export default connect(mapStateToProps)(CreateListDom) 

//export default CreateListDom
