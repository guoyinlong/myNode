/**
 * 作者：卢美娟
 * 日期：2018-3-5
 * 邮箱：lumj14@chinaunicom.cn
 * 功能：错误页面
 */
import React from 'react'
import meetingNoData from './../../../assets/meetingSet/meetingNoData.png'
import styles from './index.less'
class Error extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        return (
            <div className="content-inner">
                <div className={styles.error}>
                  <img style={{marginLeft:'-15px'}} src={ meetingNoData }/>
                  <p>暂时还没有数据</p>
                  <div>上午、下午等时间片未配置，请联系管理员... </div>
                </div>
            </div>
        )
    }
}
Error.contextTypes = {
    router: React.PropTypes.object
};
export default Error
