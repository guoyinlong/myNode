/**
 * 文件说明：合作伙伴指标管理页面
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2016-06-14
 */
import React from 'react'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import ListDom from './partnerListDom';

class Support extends React.Component {

  
  render(){
    return (
        <div>
            <ListDom data={this.props.listObj} loading={this.props.loading}/>
        </div>
    )
  }
}

function mapStateToProps (state) {
    const {listObj} = state.partnerManage;
    return {
        loading: state.loading.models.partnerManage,
        listObj
    };
}

export default connect(mapStateToProps)(Support);
