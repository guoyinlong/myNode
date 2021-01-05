/**
 * 作者：王超
 * 创建日期：2018-10-11
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：合作伙伴正态分布页面
 */
import { connect } from 'dva';
import styles from './rateDetail.less';
import { Spin } from 'antd';
import Title from './title'
import Table from './table'

class rateList extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <div className={styles.content}>
                <Spin spinning={this.props.loading} tip="Loading...">
                    <Title/>
                    <Table/>
                </Spin>
            </div>
            
        );
    }
}

function mapStateToProps (state) {
    const { selectObj } = state.partnerDetail;
    return {
        selectObj,
        loading: state.loading.models.partnerDetail
    };
}

export default connect(mapStateToProps)(rateList);