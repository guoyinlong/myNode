/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：指标评价页面
 */

import React from 'react'
import { connect } from 'dva';
import CheckUI from '../../../components/employer/checkUI'


function mapStateToProps(state) {
  const { list} = state.empCheck;

  return {
    list,
    loading: state.loading.models.empCheck,
  };
}
export default connect(mapStateToProps)(CheckUI)
