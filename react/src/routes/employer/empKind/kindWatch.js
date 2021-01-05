/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：员工类型查看组件
 */

import { connect } from 'dva';
import KindDist from './kindUI'
import styles from '../../../components/employer/employer.less'
function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}
function kindWatch(WrappedComponent) {
  return class Kind extends WrappedComponent {
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`
    tHead=[
      {
        title: '员工编号',
        dataIndex: 'staff_id',
        key: 'staff_id',
        width:100,
        render:text=>`NO.${text}`

      },
      {
        title:'部门',
        dataIndex:'dept_name',
        width:100,
        render:(text)=><div className={styles.tableDeptName}>{text}</div>
      },{
        title: '员工姓名',
        dataIndex: 'staff_name',
        key: 'staff_name',
        width:100,
      }, {
        title: '职位',
        dataIndex: 'post',
        key: 'post',
        width:100,
      }, {
        title: '员工类型',
        key: 'action',
        dataIndex:'emp_type',
        width:100,
        render: (text, record,index) => {
          if(text==='0'){
            return '项目绩效'
          }
          if(text==='1'){
            return '综合绩效'
          }
          return ''
        }
      }];
    render() {

      return super.render(1)
    }
  }
}
function mapStateToProps(state) {
  const { list} = state.kindWatch;

  return {
    list,
    loading: state.loading.models.kindWatch,
  };
}
export default connect(mapStateToProps)(kindWatch(KindDist));
