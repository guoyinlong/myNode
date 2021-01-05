/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：合作伙伴评价列表
 */
import { connect } from 'dva';
import { Icon, Table, Select } from 'antd';
import styles from './rateDetail.less';

const Option = Select.Option;
const ratioA = 0.1;  // 评级为A占比
const ratioB = 0.3;  // 评级为B占比
const columns = [{
  title: '',
  dataIndex: 'name',
}, {
  title: 'A',
  dataIndex: 'A',
},{
  title: 'B',
  dataIndex: 'B',
},{
  title: 'C',
  dataIndex: 'C',
},{
  title: 'D',
  dataIndex: 'D',
}];

class Title extends React.Component {
    constructor(props) {
        super(props);
    }
    
    state={
        lastResidue:{A:'--',B:'--',C:'--',D:'--'},  // 上期余数
        suggestNum:{A:'--',B:'--',C:'--',D:'--'}, // 建议数量
        /*num:['--','--','--','--'],        // 实际数量
        thisResidue:['--','--','--','--'],  // 本期余数*/
    }
    
    // 计算建议数量
    getSuggestNum = (scoreObj,detailObj)=> {
        
        const{dispatch}=this.props;
        // 计算A的人数
        let A = 0;
        A = detailObj.length*ratioA + parseFloat(scoreObj[0].kpi_a);
        // 计算B的人数
        let B = 0;
        B = detailObj.length*ratioB + parseFloat(scoreObj[0].kpi_b);
        this.setState({
            suggestNum: Object.assign(this.state.suggestNum,{A,B})
        });
        
        dispatch({
            type:'partnerDetail/r_setSuggestNum', 
            suggestNum: Object.assign(this.state.suggestNum,{A,B})
        });
        
        /*dispatch({
            type:'partnerDetail/r_setThisResidue', 
            thisResidue: Object.assign(this.props.thisResidue,{A,B})
        });*/
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.scoreObj.length > 0) {
            this.setState({
                lastResidue: Object.assign(this.state.lastResidue,{A:nextProps.scoreObj[0].kpi_a,B:nextProps.scoreObj[0].kpi_b})
            });
        }
        if(nextProps.detailObj.length > 0 && nextProps.scoreObj.length>0) {
            this.getSuggestNum(nextProps.scoreObj,nextProps.detailObj);
        }
    }
    
    changeCompany = (value)=> {
        const{dispatch}=this.props;
        dispatch({
            type:'partnerDetail/getDetailScore', 
                 params:{
                    arg_proj_id:this.props.projectID,
                    arg_partner_id:value,
                    arg_kpi_year:this.props.year,
                    arg_kpi_month:this.props.month
                 }
        });
        dispatch({
            type:'partnerDetail/getDetail', 
                 params:{
                    arg_proj_id:this.props.projectID,
                    arg_partner_id:value,
                    arg_kpi_year:this.props.year,
                    arg_kpi_month:this.props.month
                 }
        });
    }
    
    creatSelect = ()=> {
        if(this.props.selectObj.length > 0) {
            return (
                <Select onChange={this.changeCompany} defaultValue={this.props.selectObj[0].partner_name}>
                  {
                      this.props.selectObj.map((item,index)=> {
                          return (
                              <Option key={index} value={item.partner_id}>{item.partner_name}</Option>
                          )
                      })
                  }
                </Select>
            )
        }
    }
    
    creatScoreTable = (scoreData)=> {
        if(this.props.selectObj.length > 0) {
            return (
                <Table columns={columns} pagination={false} dataSource={scoreData} size="small" />
            )
        }
    }
    
    render() {
        const scoreData = [{
          key: '1',
          name: '评级比例',
          A: ratioA,
          B: ratioB,
          C:'--',
          D:'--'
        }, {
          key: '2',
          name: '上期余数',
          ...this.state.lastResidue
        }, {
          key: '3',
          name: '建议数量',
          ...this.state.suggestNum
        }
        ,{
          key: '4',
          name: '实际数量',
          ...this.props.num
        },{
          key: '5',
          name: '本期余数',
          ...this.props.thisResidue
        }
        ];
        return(
            <div className={styles.title}>
                <div>
                    <h1>
                        <div>
                            {this.creatSelect()}
                        </div>
                    </h1>
                    <div>
                        {this.creatScoreTable(scoreData)}
                    </div>
                </div>
                <div>
                  <span><Icon type="clock-circle-o" style={{ paddingRight: '5px'}}/>{`${this.props.year}年 第${this.props.month}月`}</span>
                  <span><Icon type="team" style={{ paddingRight: '5px'}}/>{`成员数量 : ${this.props.detailObj.length} 个`}</span>
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    const { selectObj,projectID,scoreObj,year,month,detailObj,num,thisResidue } = state.partnerDetail;
    return {
        selectObj,
        projectID,
        scoreObj,
        year,
        month,
        detailObj,
        num,
        thisResidue
    };
}

export default connect(mapStateToProps)(Title);