/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：dmp指标查询页面
 */

import Search from './searchUI'

import { connect } from 'dva';


function mapStateToProps(state) {
  const { list,condition,staff_id,staff_name,proj_name_0,season,year,dept_param} = state.search;

  return {
    list,
    loading: state.loading.models.search,
    condition,
    staff_id,
    staff_name,
    proj_name_0,
    season,
    year,
    dept_param
  };
}
export default connect(mapStateToProps)(Search)
