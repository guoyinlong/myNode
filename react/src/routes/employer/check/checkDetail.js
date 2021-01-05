/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：指标审核详细页
 */

import SearchDetail from '../search/searchDetail'
import {Button,Modal,Input,Popconfirm} from  'antd'
import message from '../../../components/commonApp/message'
import * as service from '../../../services/employer/check';

const { TextArea } = Input;

export default class CheckDetail extends SearchDetail{
  disabled={
    totalScore:true
  };
  getTotal(data){
    let res=0
    for(let i of data){
      res+=parseFloat(i.target_score)
    }
    return res
  }

  getTHead=(rowArr)=>{
    return [
      {
        title:'',
        dataIndex:'kpi_type',
        width:'2%',
        render:(text,row,index)=>{

          return {
            children:text,
            props:{
              rowSpan:rowArr[index]
            }
          }
        }
      },
      {
        title:'分项名称',
        dataIndex:'kpi_name',
        width:'10%',
      },
      {
        title:'计算定义/完成目标',
        dataIndex:'kpi_content',
        width:'38%',
        render:(text)=>this.splitEnter(text)
      },
      {
        title:'评价标准/计分办法',
        dataIndex:'formula',
        width:'38%',
        render:(text)=>this.splitEnter(text)
      },
      {
        title:'目标分值',
        dataIndex:'target_score',
      },
      {
        title:'考核人',
        dataIndex:'checker_name',

      },

    ];
  }
  showModal=()=>{
    this.setState({
      visible:true
    })
  }
  handleCancel=()=>{
    this.setState({
      visible:false
    })
  }
  seasonHandle=(e)=>{
    this.setState({
      reason:e.target.value
    })
  }
  revocation=()=>{
    let query=this.props.location.query;
    let reason=this.state.reason||'';
    if(!reason.trim()){
      message.error('请输入不通过理由！');
      return
    }
    service.kpi_score_check_proc({
      ...query,
      reason
    }).then(res=>{
      message.success('不通过成功！')
      this.props.history.goBack()
      this.handleCancel()
    }).catch((err)=>{
      message.error(err.message)
      this.handleCancel()
    })
  }
  passHandle=()=>{
    let query=this.props.location.query;
    service.checknew(query).then(res=>{
      message.success('通过成功！')
      this.props.history.goBack()
    })
  }
  render(){
    const {list,reason=''}=this.state
    const state=list.length?list[0].state:0
    return(
      <div style={{minHeight:'calc(100vh - 231px)'}}>
        {super.render()}
        <div style={{textAlign:'right',backgroundColor:'#fff',width:'100%',padding:'15px'}}>
          <span style={{paddingRight:'60px',fontSize:'16px'}}>总目标分值：{list.length?this.getTotal(list):'0'}</span>

          {state==='1'?
            <span><Popconfirm placement="top" title='确定通过指标？' onConfirm={this.passHandle} okText="确定" cancelText="取消">
              <Button style={{marginRight:'15px'}} size='large' type="primary">通过</Button>
            </Popconfirm><Button size='large' type="danger" onClick={this.showModal}>不通过</Button></span>
            :null}
          {state==='3'?<Button size='large' type="danger" onClick={this.showModal}>审核结果撤销</Button>:null}
        </div>
        <Modal
          title="不通过理由"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onOk={this.revocation}
        >
          <TextArea rows={4} value={reason} onChange={this.seasonHandle}/>
        </Modal>
      </div>
    )
  }
}

