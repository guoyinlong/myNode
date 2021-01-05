/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-28
 * 文件说明：审核结果展示/保存/提交
 */
import {Button,Popconfirm,Modal,Input} from 'antd'
import Style from './employer.less'
const { TextArea } = Input;
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-28
 * 功能：审核结果展示/保存/提交按钮组件
 */
class CheckSubmit extends React.Component {
  state={
    visible:false
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   * 功能：目标分值求和
   * @param data 数据源
   */
  getTotal(data){
    let res=0
    for(let i of data){
      res+=parseFloat(i.target_score)
    }
    return res
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   * 功能：显示模态框，填写审核不通过理由
   */
  showModal=()=>{
    this.setState({
      visible:true
    })
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   * 功能：隐藏模态框
   */
  handleCancel=()=>{
    this.setState({
      visible:false
    })
  }

  render(){
    //debugger
    const{list,passHandle,revocation,seasonHandle,title,subState,total_score,reason} = this.props;
    return(
      <div className={Style.value_foot}>
          <span>总目标分值：{list.length?this.getTotal(list):'0'}</span>
          <span>得分：{total_score}</span>
          {subState==='0'?
            <div><Popconfirm placement="top" title={title} onConfirm={passHandle} okText="确定" cancelText="取消">
              <Button style={{marginRight:'15px'}} size='large' type="primary">通过</Button>
            </Popconfirm>
              <Button size='large' type="danger" onClick={this.showModal}>不通过</Button></div>
            :null}
          {subState==='1'?<Button size='large' type="danger" onClick={this.showModal}>审核结果撤销</Button>:null}
        <Modal
          title="不通过理由"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onOk={revocation}
        >
          <TextArea rows={4} value={reason} onChange={seasonHandle}/>
        </Modal>
      </div>
    )
  }
}
export default CheckSubmit;
