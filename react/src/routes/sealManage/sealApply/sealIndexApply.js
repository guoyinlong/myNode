/**
 * 作者：窦阳春
 * 日期：2019-9-3
 * 邮箱：douyc@itnova.com.cn
 * 功能：印章证照申请
 */
import React from 'react';
import {connect} from 'dva';
import styles from './sealIndexApply.less';
import { routerRedux } from 'dva/router';
class SealIndexrApply extends React.Component {
    state = {


    };
    // 印章使用申请
    useApply = () => {
        this.props.dispatch(routerRedux.push({
            pathname: 'adminApp/sealManage/sealIndexApply/sealComApply'
        }))
    }
    // 营业执照使用申请
    businessLicenseApply = () => {
        this.props.dispatch(routerRedux.push({
            pathname: 'adminApp/sealManage/sealIndexApply/businessLicenseApply'
        }))
    }
    // 院领导名章使用申请
    sealLeaderApply = () => {
        this.props.dispatch(routerRedux.push({
            pathname: 'adminApp/sealManage/sealIndexApply/sealLeaderApply'
        }))
    }
    // 院领导身份证复印件使用申请
    sealLeaderIDApply = () => {
        this.props.dispatch(routerRedux.push({
            pathname: 'adminApp/sealManage/sealIndexApply/sealLeaderIDApply'
        }))
    }
    // 印章外借申请
    borrowSeal = () => {
        this.props.dispatch(routerRedux.push({
            pathname: 'adminApp/sealManage/sealIndexApply/borrowSeal'
        }))
    }
    // 营业执照外借申请
    borrowBusinessJudge = () => { 
        this.props.dispatch(routerRedux.push({
            pathname: 'adminApp/sealManage/sealIndexApply/borrowBusiness'
        }))
    }
    // 院领导名章外借申请
    borrowLeader = () => {
        this.props.dispatch(routerRedux.push({
            pathname: 'adminApp/sealManage/sealIndexApply/borrowLeader'
        }))
    }
  render(){
    return (
        <div className={styles.pageContainer}>
        <section className={styles.apply}>
            <div className={styles.breadNav}>使用申请</div>
            <ul>
                <li>
                    <a onClick={ this.useApply }>印章使用申请</a>
                </li>
                <li>
                    <a onClick={ this.businessLicenseApply }>营业执照复印件使用申请</a>
                </li>
                <li>
                    <a onClick={ this.sealLeaderApply }>院领导名章使用申请</a>
                </li>
                <li>
                    <a onClick={ this.sealLeaderIDApply }>院领导身份证复印件使用申请</a>
                </li>
            </ul>
        </section>
        <section className={`${styles.apply} ${styles.brrowApply}`}>
            <div className={`${styles.breadNav} ${styles.breadRightNav}`}>外借申请</div>
            <ul>
                <li>
                    <a onClick={ this.borrowSeal }>印章外借申请</a>
                </li>
                <li>
                    <a onClick={ this.borrowBusinessJudge }>营业执照外借申请</a>
                </li>
                <li>
                    <a onClick={ this.borrowLeader }>院领导名章外借申请</a>
                </li>
            </ul>
        </section>
    </div>
    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.sealIndexApply,
    ...state.sealIndexApply
  };
}
export default connect(mapStateToProps)(SealIndexrApply);
