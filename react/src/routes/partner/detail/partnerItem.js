/**
 * 文件说明：合作伙伴指标录入
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2018-06-15
 */
import { Row,message, Col,Collapse,Input,InputNumber,Popconfirm,Icon,Button } from 'antd';
import Style from '../partnerItem.less';
import { connect } from 'dva';
import AddDom from '../itemBox';
import Cookie from 'js-cookie';

const Panel = Collapse.Panel;
const { TextArea } = Input;

class partnerItem extends React.Component {
    itemArr = [];   // 保存业务指标
    fixedArr = [];  // 保存固定指标
    kpi1Score = 0;
    kpi2Score = 0;
    
    state={
        itemArry:this.itemArr,
        totalScore:0
    }
    
    componentWillMount(){
        if(this.props.kpiObj.length>0){
            this.props.kpiObj.map((item,index)=>{
                if(item.kpi_type_id == '0') {
                    this.fixedArr.push(item);
                    if(item.target_score != '') {
                        this.kpi1Score += parseInt(item.target_score);
                    } 
                } else {
                    this.itemArr.push(item);
                    if(item.target_score != '') {
                        this.kpi2Score += parseInt(item.target_score);
                    }  
                }
            }) 
        }
        this.setState({
            itemArry:this.itemArr,
            totalScore:this.kpi1Score+this.kpi2Score
        });
        this.props.handlSetScore(this.kpi1Score+this.kpi2Score);
    }
    
    addItem = ()=> {
        this.itemArr.push({
            'kpi_type':'业务指标',
            'checker_name':this.fixedArr[0].checker_name,
            'target_score':''
        });
        this.setState({
          itemArry:this.itemArr
        })
    }
    
    createHearder = (type,name)=> {
        return (
            <div className={Style.typeTitle}>
                <div>
                    {name}
                    {type==0?<div onClick={(e)=>{e.stopPropagation();this.addItem()}} className={Style.addKpi}><span>+</span>{'添加指标'}</div>:''}
                </div>
            </div>
        )
    }
    
    deleteClick = (index)=> {
        this.itemArr.splice(index,1,'');
        this.setState({
          itemArry:this.itemArr
        })
        this.computeScore();
    }
    
    computeScore = ()=> {
        let subScore = 0;
        this.itemArr.map((item,index)=>{
            if(item != '') {
                if(item.target_score != '') {
                    subScore += parseFloat(item.target_score);
                }
            }
        })
        this.setState({
            totalScore:this.kpi1Score+subScore
        });
        this.props.handlSetScore(this.kpi1Score+subScore);
    }
    changeScore = (value,index)=> {
        this.itemArr[index].target_score = value;
        this.computeScore();
    }
    
    getParmData = (type)=> {
        const {dispatch} = this.props;
        let saveArr = [];
        let kpiNames = [...document.getElementsByName('kpiName')];
        let kpiScores = [...document.getElementsByName('kpiScore')];
        let kpiFinishs = [...document.getElementsByName('kpiFinish')];
        let kpiAssessments = [...document.getElementsByName('kpiAssessment')];
        let checkerNames = [...document.getElementsByName('checkerName')];
        let checkerIds = [...document.getElementsByName('checkerId')];
        
        if(type == 1) {
            if(kpiNames.length>0) {
                for(let i=0; i<kpiNames.length; i++) {
                    if(kpiNames[i].value == '') {
                        message.warning('指标名称不能为空！');
                        return;
                    }
                }
            }
            if(kpiScores.length>0) {
                for(let i=0; i<kpiScores.length; i++) {
                    if(kpiScores[i].value == '') {
                        message.warning('分数不能为空！');
                        return;
                    }
                }
            }
            if(kpiFinishs.length>0) {
                for(let i=0; i<kpiFinishs.length; i++) {
                    if(kpiFinishs[i].value == '') {
                        message.warning('完成目标不能为空！');
                        return;
                    }
                }
            }
            if(kpiAssessments.length>0) {
                for(let i=0; i<kpiAssessments.length; i++) {
                    if(kpiAssessments[i].value == '') {
                        message.warning('评价标准不能为空！');
                        return;
                    }
                }
            }
            
            if(this.state.totalScore != 100) {
                message.warning('总分数不能大于或小于100分！');
                return;
            }
        }

        this.fixedArr.map((item,index)=>{
            saveArr.push({
                'arg_kpi_type_id':item.kpi_type_id,
                'arg_kpi_type':item.kpi_type,
                'arg_kpi_name':item.kpi_name,
                'arg_kpi_content':item.kpi_content,
                'arg_formula':item.formula,
                'arg_target_score':item.target_score,
                'arg_checker_id':item.checker_id,
                'arg_checker_name':item.checker_name,
            });
        })
        
        if(kpiNames.length>0) {
            this.itemArr = [];
            kpiNames.map((item,index)=>{
                saveArr.push({
                    'arg_kpi_type_id':'1',
                    'arg_kpi_type':'业务指标',
                    'arg_kpi_name':kpiNames[index].value,
                    'arg_kpi_content':kpiFinishs[index].value,
                    'arg_formula':kpiAssessments[index].value,
                    'arg_target_score':kpiScores[index].value,
                    'arg_checker_id':checkerIds[index].innerText,
                    'arg_checker_name':checkerNames[index].innerText
                });
                this.itemArr.push({
                    'kpi_type_id':'1',
                    'kpi_type':'业务指标',
                    'kpi_name':kpiNames[index].value,
                    'kpi_content':kpiFinishs[index].value,
                    'formula':kpiAssessments[index].value,
                    'target_score':kpiScores[index].value,
                    'checker_id':checkerIds[index].innerText,
                    'checker_name':checkerNames[index].innerText
                });
            })
        }
        
        this.setState({
            itemArry:this.itemArr
        })
        let saveObj = {
            'arg_user_id': Cookie.get('userid'),
            'arg_kpi_year':new Date().getFullYear(),
            'arg_kpi_month':new Date().getMonth()+1,
            'arg_flag':type,
            'arg_kpi_info':JSON.stringify(saveArr)
        };
        dispatch({
            type:'partnerDetail/addKPI',
            params:saveObj
        });
    }
    
    kpiSubmit = ()=> {
        this.getParmData(1);
    }
    
    kpiSave = ()=> {
        this.getParmData(0);
    }
    
    render() {
        /*
         * 0 保存，
            1 提交(待审核)，
            2 审核通过(待评价)，
            3 不通过(待重新填写并提交)，
            4 已评价(提交后待评级)，
            5 评级结束，流程结束。
         */
        if(this.props.kpiObj[0].state == '1'||this.props.kpiObj[0].state == '2'||this.props.kpiObj[0].state == '4'||this.props.kpiObj[0].state == '5'){
            return (
                <div className={`${Style.KpiTypesBox} ${Style.arr}`}>
                    <Collapse  bordered={false} defaultActiveKey={['1']}>
                        <Panel header={this.createHearder(1,'固定指标')} key="1">
                            <Row>
                            {this.fixedArr.map((item, index) => {
                                return (
                                    <AddDom score={this.state.totalScore} checkerName={item.checker_name} checkerId={item.checker_id} data={item} isEdit={false} key={index} itemIndex={index} handlDel={(index)=>{this.deleteClick(index)}}/>
                                );
                            })}
                            </Row>
                        </Panel>
                    </Collapse>
                    
                    <Collapse  bordered={false} defaultActiveKey={['1']}>
                        <Panel header={this.createHearder(1,'业务指标')} key="1">
                            <Row>
                            {this.state.itemArry.map((item, index) => {
                                if(item != '') {
                                    return (
                                        <AddDom checkerName={this.props.title.checker_name} checkerId={this.props.title.checker_id} score={this.state.totalScore} handlChangeScore={(value,index)=>{this.changeScore(value,index)}} data={item} isEdit={false} key={'kpiScore'+index} itemIndex={index} handlDel={(index)=>{this.deleteClick(index)}}/>
                                    );
                                }  
                            })}
                            </Row>
                        </Panel>
                    </Collapse>
                </div>
            )
        } else {
            return (
                <div className={`${Style.KpiTypesBox} ${Style.arr}`}>
                    <Collapse  bordered={false} defaultActiveKey={['1']}>
                        <Panel header={this.createHearder(1,'固定指标')} key="1">
                            <Row>
                            {this.fixedArr.map((item, index) => {
                                return (
                                    <AddDom checkerName={item.checker_name} checkerId={item.checker_id} score={this.state.totalScore} data={item} isEdit={false} key={index} itemIndex={index} handlDel={(index)=>{this.deleteClick(index)}}/>
                                );
                            })}
                            </Row>
                            
                        </Panel>
                    </Collapse>
                    
                    <Collapse  bordered={false} defaultActiveKey={['1']}>
                        <Panel header={this.createHearder(0,'业务指标')} key="1">
                            <Row>
                            {this.state.itemArry.map((item, index) => {
                                if(item != '') {
                                    return (
                                        <AddDom checkerName={this.props.title.checker_name} checkerId={this.props.title.checker_id} score={this.state.totalScore} handlChangeScore={(value,index)=>{this.changeScore(value,index)}} data={item} isEdit={true} key={'kpiScore'+index} itemIndex={index} handlDel={(index)=>{this.deleteClick(index)}}/>
                                    );
                                }  
                            })}
                            </Row>
                        </Panel>
                    </Collapse>
                    <div className={Style.submit}>
                        <Button onClick={()=>this.kpiSave()}>保存</Button>
                        <Popconfirm title="确定要提交吗？" okText="确定" cancelText="取消" onConfirm={()=>this.kpiSubmit()}>
                            <Button type="primary">提交</Button>
                        </Popconfirm>
                    </div>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    const { kpiObj} = state.partnerDetail;
    return {
        kpiObj,
        loading: state.loading.models.partnerDetail,
    };
}
export default connect(mapStateToProps)(partnerItem) 