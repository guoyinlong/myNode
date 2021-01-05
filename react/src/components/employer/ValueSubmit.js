/**
 * 文件说明：评价结果展示/保存/提交
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-28
 */
import Style from './employer.less'
import {Button,Popconfirm} from 'antd'
import PageSubmit from './PageSubmit'
/**
 * 功能：评价结果展示/保存/提交按钮组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-28
 */
class ValueSubmit extends React.Component {
  /**
   * 功能：目标分值求和
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   * @param data 数据源
   */
  getTotal(data){
    let res=0
    for(let i of data){
      res+=parseFloat(i.target_score)
    }
    return res.toFixed(2)
  }
  render(){
    //debugger
    const{list,total_score,save,submit,revert,title,subState,donotTips,cancelValue,submitValue} = this.props;
    return(
      <div className={Style.value_foot}>
        <span>总目标分值：{list.length?this.getTotal(list):'0'}</span>
        <span>得分：{total_score}</span>
        {cancelValue
          ?<Popconfirm title="确认撤销当前页面所有的指标评价？" onConfirm={revert}  okText="确定" cancelText="取消">
            <Button size='large' type='danger' >撤销评价</Button>
          </Popconfirm>
          :submitValue?
          <PageSubmit title={title} subState={subState} donotTips={donotTips}
                      save={save} submit={submit}/>
            :null

        }
      </div>
    )
  }
}
export default ValueSubmit;
