/**
 * 作者：张楠华
 * 日期：2018-3-2
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：错误页面
 */
import React from 'react'
import meetingNoData from '../../../../assets/meetingSet/meetingNoData.png'
import styles from './noData.less'
class Error extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        return (
            <div className="content-inner">
                <div className={styles.error}>
                  <img src={ meetingNoData }/>
                  <p>当前处于{this.props.fundingType}阶段</p>
                </div>
            </div>
        )
    }
}
Error.contextTypes = {
    router: React.PropTypes.object
};
export default Error
