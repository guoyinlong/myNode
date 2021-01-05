/**
 * 文件说明：合作伙伴指标评价
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2018-06-15
 */
import { Row,Collapse,Popconfirm,Button } from 'antd';
import Style from '../partnerItem.less';
import { connect } from 'dva';
import GetScore from './getScore';
import AddDom from '../itemBox';

const Panel = Collapse.Panel;

class partnerItem extends React.Component {
    
    kpiScore = 0;
    itemArr = [];   // 保存业务指标
    fixedArr = [];  // 保存固定指标
    
    handlePassClick = () => {
        let parArr = [];
        this.fixedArr.map((item, index) => {
            parArr.push({arg_kpi_name:item.kpi_name,arg_score:item.score})
        })
        this.itemArr.map((item, index) => {
            parArr.push({arg_kpi_name:item.kpi_name,arg_score:item.score})
        })
        
        const {dispatch} = this.props;
        
        dispatch({
            type:'assessDetailModels/pmPass',
            params:{
                arg_user_id:this.props.param.userId,
                arg_kpi_year:this.props.param.year,
                arg_kpi_month:this.props.param.month,
                arg_kpi_info:JSON.stringify(parArr)
            }
        });
    };
    
    changeScore = (value,num,type,index)=> {
        let scoreDom = [...document.getElementsByName('kpiScore')];
        this.kpiScore = 0;
        if(type == '固定指标') {
            //this.fixedArr[index].score = value;
        } else {
            this.itemArr[index].score = value;
        }
        if(scoreDom.length>0) {
            scoreDom.map((item,index)=>{
                if(num == index) {
                    this.kpiScore+=parseFloat(value);
                } else {
                    this.kpiScore+=parseFloat(item.value);
                }
            })
            this.props.handlSetScore(this.kpiScore.toFixed(1));
        }
    }
    
    createHearder = (type,name,item)=> {
        return (
            <div className={Style.typeTitle}>
                <div>
                    {name}
                    {type==0?<div onClick={(e)=>{e.stopPropagation();this.addItem()}} className={Style.addKpi}><span>+</span>{'添加指标'}</div>:''}
                </div>
                <div className={Style.scoreTable}>
                    <GetScore list={item}/>
                </div>
            </div>
        )
    }
    
    componentWillMount(){
        if(this.props.detail.length>0){
            this.props.detail.map((item,index)=>{
                if(item.kpi_type_id == '0') {
                    //item.kpi_score = item.target_score;
                    this.fixedArr.push(item);
                    this.kpiScore += parseFloat(item.score);
                } else {
                    //item.kpi_score = item.target_score;
                    item.score = item.target_score;
                    this.itemArr.push(item);
                    this.kpiScore += parseFloat(item.target_score);
                }
                /*if(item.target_score != '') {
                    this.kpiScore += parseInt(item.target_score);
                }*/
            })
        }
        this.props.handlSetScore(this.kpiScore.toFixed(1));
    };
    
    render() {
        return (
            <div className={`${Style.KpiTypesBox} ${Style.arr}`}>
                <Collapse  bordered={false} defaultActiveKey={['1']}>
                    <Panel header={this.createHearder(1,'固定指标',this.fixedArr)} key="1">
                        <Row>
                        {this.fixedArr.map((item, index) => {
                            return (
                                <AddDom handlChangeScore={(value,num)=>{this.changeScore(value,num,'固定指标',index)}}  checkerName={item.checker_name} checkerId={item.checker_id} data={item} isEdit={'assess1'} key={index} itemIndex={index}/>
                            );
                        })}
                        </Row>
                    </Panel>
                </Collapse>
                
                <Collapse  bordered={false} defaultActiveKey={['1']}>
                    <Panel header={this.createHearder(1,'业务指标',this.itemArr)} key="1">
                        <Row>
                        {this.itemArr.map((item, index) => {
                            let mylength = this.fixedArr.length+index;
                            return (
                                <AddDom handlChangeScore={(value,num)=>{this.changeScore(value,num,'业务指标',index)}}  checkerName={item.checker_name} checkerId={item.checker_id} data={item} isEdit={'assess2'} key={index} itemIndex={mylength}/>
                            );
                        })}
                        </Row>
                    </Panel>
                </Collapse>
                <div className={Style.submit}>
                    <Popconfirm title="确定要提交吗？" okText="确定" cancelText="取消" onConfirm={()=>this.handlePassClick()}>
                        <Button type="primary">提交</Button>
                    </Popconfirm>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.assessDetailModels
    };
}
export default connect(mapStateToProps)(partnerItem) 