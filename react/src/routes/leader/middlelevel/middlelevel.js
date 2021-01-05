/**
 * 作者：lyq
 * 日期：2020/10/12
 * 邮件：809590923@qq.com
 * 文件说明：综合绩效评价页面
 */
import Evaluation from '../../employer/evaluation/evaluation'
import { connect } from 'dva';
class Middlelevel extends Evaluation{}
function mapStateToProps(state) {return {...state.staffEvaluation}}
export default connect(mapStateToProps)(Middlelevel);
