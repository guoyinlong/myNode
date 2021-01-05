/**
 * 作者：李杰双
 * 日期：2017/10/15
 * 邮件：282810545@qq.com
 * 文件说明：辅助账汇总组件
 */
import { Collapse } from 'antd';
import Styles from '../../../../components/finance/subsidiaryCollect/subsidiaryCollect.less'
const Panel = Collapse.Panel;
export default function (props) {
  return(
    <div>

      <div>
        <Collapse defaultActiveKey={['1']}>
          <Panel header={`人员人工费用（小计：11,231,235,456.26）`} key="1">
            <SubsidiaryItem />
            <SubsidiaryItem />
            <SubsidiaryItem />
          </Panel>
          <Panel header={`人员人工费用（小计：11,231,235,456.26）`} key="2">
            <SubsidiaryItem />
          </Panel>
          <Panel header={`人员人工费用（小计：11,231,235,456.26）`} key="3">
            <SubsidiaryItem />
          </Panel>
        </Collapse>
      </div>
    </div>
  )
}
function SubsidiaryItem({list}) {
  return (
    <div className={Styles.subsidiaryItem}>
      <span>直接从事研发活动人员工资薪金</span>
      <span>12,332,333.00</span>
      <span>12,332,333.00</span>
      <span>12,332,333.00</span>
      <span>12,332,333.00</span>
      <span>12,332,333.00</span>
      <span>12,332,333.00</span>
    </div>
  )
}
