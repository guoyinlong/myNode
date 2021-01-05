/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：错误页面
 */
import React from 'react'
import {Row, Col, Icon} from 'antd'
import { Link } from 'dva/router';
import config  from '../../utils/config'
import styles from './index.less'
import moment from 'moment';
class Error extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          times: 3
        }
    }
    interval = null;
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({times:this.state.times - 1});
            if (!this.state.times) {
                this.context.router.push('/');
            }
        }, 1000);
    }
    render () {
        return (
            <div className="content-inner">
                <Row className={styles.error}>
                    <Col sm={0} md={8} lg={10} style={{textAlign:'center'}}>
                        <img src={config.img_error}/>
                    </Col>
                    <Col sm={24} md={16} lg={14}>
                        <p>抱歉！页面无法访问... </p>
                        <ul className={styles.reason}>
                            <li></li>
                            <li>可能因为：</li>
                            <li><span>网址有错误</span>  > 请检查地址是否完整或存在多余字符</li>
                            <li></li>
                            <li>》{this.state.times}秒后 <Link className={styles.link} to="/">返回首页</Link></li>
                        </ul>
                    </Col>
                </Row>
            </div>
        )
    }
}
Error.contextTypes = {
    router: React.PropTypes.object
};
export default Error
