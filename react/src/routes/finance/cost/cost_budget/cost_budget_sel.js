/**
 * 作者：李杰双
 * 日期：2017/10/24
 * 邮件：282810545@qq.com
 * 文件说明：项目全成本预算查询
 */
import Styles from '../../../../components/cost/cost_budget.less'
import Cont_budget from './cost_budget'

export default function ({location}) {
  return(
    <div className={Styles.wrap}>
      <Cont_budget location={location}/>
    </div>
  )
}
