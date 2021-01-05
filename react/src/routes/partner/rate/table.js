/**
 * 作者：王超
 * 创建日期：2018-10-11
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：合作伙伴正态分布页面
 */
import { connect } from 'dva';
import styles from './rateDetail.less';
import { Table, Button, InputNumber, Input, Select, message } from 'antd';

const Option = Select.Option;

class table extends React.Component {
    constructor(props) {
        super(props);
    }
    
    // 保存初始数据
    localData = []
    thisResidueA = 0
    thisResidueB = 0
    
    // table结构
    columns = [{
      title: '排名',
      dataIndex: 'index'
    }, {
      title: '所属公司',
      dataIndex: 'partner_name'
    }, {
      title: '姓名',
      dataIndex: 'staff_name'
    },{
      title: '得分',
      dataIndex: 'score'
    },{
      title: '贡献度',
      dataIndex: 'contribution',
      render:(text, record) => {
          let disabled = false;
          let myValue = text;
          if(record.state == 5) {
              disabled = true;
              myValue = record.contribution;
          }
          return (
              <InputNumber disabled={disabled} min={0.1} formatter={value => value.replace(/^(\d+\.?\d?).*/g, '$1')} parser={value => value.replace(/^(\d+\.?\d?).*/g, '$1')} step={0.1} onChange={(value)=>{this.changeDom(value,record.key,'contribution')}} value={myValue}/>
          )
      }
    },{
      title: '贡献度调整说明',
      dataIndex: 'explain',
      render:(text, record) => {
          let disabled = false;
          let myValue = text;
          if(record.state == 5) {
              disabled = true;
              myValue = record.adjust_reason;
          }
          return (
              <Input disabled={disabled} onChange={(e)=>{this.changeDom(e,record.key,'explain')}}  style={{width:'70%'}} value={myValue}/>
          )
      }
    },{
      title: '总分',
      dataIndex: 'totalPoints'
    },{
      title: '评级',
      dataIndex: 'level',
      render:(text, record) => {
        
          if(text === '' || text === undefined) {
              text = '请选择';
          }
          
          let disabled = false;
          let myValue = text;
          if(record.state == 5) {
              disabled = true;
              myValue = record.rank;
          }
          if(record.score >= 95) {
              
              return (
                  <Select disabled={disabled} value={myValue} onChange={(value)=>{this.changeDom(value,record.key,'level')}} style={{ width: 80 }}>
                      <Option value="A">A</Option>
                      <Option value="B">B</Option>
                      <Option value="C">C</Option>
                      <Option value="D">D</Option>
                  </Select>
              )
          } else if(record.score >= 88 && record.score < 95) {
              return (
                  <Select disabled={disabled} value={myValue} onChange={(value)=>{this.changeDom(value,record.key,'level')}} style={{ width: 80 }}>
                      <Option value="A" disabled>A</Option>
                      <Option value="B">B</Option>
                      <Option value="C">C</Option>
                      <Option value="D">D</Option>
                  </Select>
              )
          } else {
              return (
                  <Select disabled={disabled} value={myValue} onChange={(value)=>{this.changeDom(value,record.key,'level')}} style={{ width: 80 }}>
                      <Option value="A" disabled>A</Option>
                      <Option value="B" disabled>B</Option>
                      <Option value="C">C</Option>
                      <Option value="D">D</Option>
                  </Select>
              )
          }
      }
    }];
    
    state={
        detailData:[],        // table内容
        totalContribution:'' // 总贡献度
    }
    
    // 重新计算评级的实际数量
    setNum = (paraObj)=> {
        
        const{dispatch}=this.props;
        let aNum = 0,bNum = 0,cNum = 0,dNum = 0;
        
        paraObj.map((item,index)=>{
            switch(item.level) {
                case 'A':
                  aNum++
                  break;
                case 'B':
                  bNum++
                  break;
                case 'C':
                  cNum++
                  break;
                case 'D':
                  dNum++
                  break;
            }
            dispatch({
                type:'partnerDetail/r_setNum', 
                num: {A:aNum,B:bNum,C:cNum,D:dNum}
            });
        })
        
        this.thisResidueA = this.props.suggestNum.A - aNum;
        this.thisResidueB = this.props.suggestNum.B - bNum;
        
        dispatch({
            type:'partnerDetail/r_setThisResidue', 
            thisResidue: {A:this.thisResidueA,B:this.thisResidueB,C:'--',D:'--'}
        });
    }
    
    changeDom = (value,key,type)=> {
        
        let objArr = this.state.detailData;
        
        // 将选中的评级赋值给组件
        for(let i=0; i<objArr.length; i++) {
            if(i == key) {
                if(type == 'explain') {
                    objArr[i][type] = value.target.value;
                } else {
                    objArr[i][type] = value;
                }
                
                if(type == 'contribution') {
                    objArr[i].totalPoints = (value*objArr[i].score).toFixed(1);
                }
            }
        }
        this.setNum(objArr);
        this.setState({
            detailData: objArr
        })
    }
    
    componentWillReceiveProps(nextProps) {
        
        let newDetailObj = {};
        let newDetailArr = [];
        let totalContribution = 0;
        
        if(nextProps.detailObj == '') {
            return;
        }
        nextProps.detailObj.map((item,index)=>{
            // assign为浅复制
            newDetailObj = Object.assign({index:index+1},{key:index},{totalPoints:(item.score*item.contribution)},item);
            newDetailArr.push(newDetailObj);
            totalContribution += parseInt(item.contribution);
        })
        
        this.setState({
            detailData: newDetailArr,
            totalContribution
        })
        // 用JSON转换方式实现深度复制
        this.localData = JSON.parse(JSON.stringify(newDetailArr));
    }
   
    createDetailTable = ()=> {
        if(this.props.detailObj.length > 0) {
            return(
                <Table pagination={false} columns={this.columns} dataSource={this.state.detailData} bordered/>
            )
        }
    }
    
    reset = ()=> {
        this.setState({
            detailData: JSON.parse(JSON.stringify(this.localData))
        })
    }
    
    // 按降序排序
    sortFun = (a,b)=> {
        return b.totalPoints - a.totalPoints
    }
    
    sort = ()=> {
        let sortArr = [];
        sortArr = this.state.detailData.sort(this.sortFun);
        sortArr.map((item,index)=>{
            sortArr[index] = Object.assign(sortArr[index],{index:index+1},{key:index});
        })
        this.setState({
            detailData: sortArr
        })
    }
    
    submit = ()=> {
        
        const{dispatch}=this.props;
        let aNum = 0;
        let bNum = 0;
        let parArr = [];
        
        for(let i=0; i<this.state.detailData.length; i++) {
            if(this.state.detailData[i].level === undefined) {
                message.error('还有未评级人员！');
                return;
            } else {
                if(this.state.detailData[i].level == 'A') {
                    aNum++;
                }
                if(this.state.detailData[i].level == 'B') {
                    bNum++;
                }
            }
            parArr.push({
                arg_kpi_staff_id:this.state.detailData[i].staff_id,
                arg_kpi_contribution:this.state.detailData[i].contribution,
                arg_kpi_rank:this.state.detailData[i].level,
                arg_kpi_adjust_reason:this.state.detailData[i].explain || ''
            })
        }
        
        if (aNum > this.props.suggestNum['A'] || bNum > this.props.suggestNum['B']) {
            message.error('评级为A的人员数量已超！');
            return;
        }
        
        if (bNum > this.props.suggestNum['B']) {
            message.error('评级为B的人员数量已超！');
            return;
        }
        
        let paramsObj = {
            arg_proj_id:this.state.detailData[0].proj_id,
            arg_partner_id:this.state.detailData[0].partner_id,
            arg_kpi_year:this.state.detailData[0].kpi_year,
            arg_kpi_month:this.state.detailData[0].kpi_month,
            arg_kpi_a:this.thisResidueA,
            arg_kpi_b:this.thisResidueB,
            arg_info:JSON.stringify(parArr)
        }
      
        dispatch({
            type:'partnerDetail/dataSubmit', 
            params: paramsObj
        });
    }
    
    render() {
        return(
            <div className={styles.listTable}>
                <div className={styles.dist}>
                    <div>
                        <span>贡献度总权重：{this.state.totalContribution}</span>
                        <Button onClick={this.reset}>重置</Button>
                        <Button onClick={this.sort} style={{marginRight: '15px'}}>排序</Button>
                    </div>
                </div>
                {this.createDetailTable()}
                <div style={{float:'right',marginTop:'15px'}}>
                    <Button onClick={this.submit} className={styles.submint}>提交</Button>
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    const { detailObj,suggestNum} = state.partnerDetail;
    return {
        detailObj,
        suggestNum
    };
}

export default connect(mapStateToProps)(table);