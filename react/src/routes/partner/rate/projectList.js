/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：合作伙伴项目卡片页面
 */
import { connect } from 'dva';
import { Card, Col, Row, Icon, Spin} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './rateDetail.less';

class ListCard extends React.Component {
    
    toList = (params)=> {
        const{dispatch}=this.props;
        dispatch(routerRedux.push({
            pathname:'/projectApp/purchase/rateDetail',query: {id: params.proj_id}
        }));
    }
    
    creatDom = ()=> {
        if(this.props.listObj.length != 0) {
            return (
                this.props.listObj.map((item,index)=>{
                    return (
                        <Col style={{margin:'5px'}} key={index} span={7}>
                            <Card onClick={()=>this.toList({...item})} className={styles.card}>
                                <h3 style={{marginBottom:'5px',fontWeight:'bold'}}><Icon type="tags" />联通软件研究院</h3>
                                <h4 style={{paddingLeft:'15px'}}>{item.proj_name}</h4>
                                <div style={{paddingLeft:'15px',paddingTop:'5px'}}>{'当前状态：未完成'}</div>
                            </Card>
                        </Col>
                    )
                })
            )
        } else {
            return (
                '暂无数据...'
            )
        }
            
    }
   
    render() {
        return(
            <div className={styles.content}>
                <Spin spinning={this.props.loading} tip="Loading...">
                <Row gutter={16}>
                {this.creatDom()}
                </Row>
                </Spin>
            </div>
        );
    }

}

function mapStateToProps (state) {
    const {listObj} = state.partnerRateList;
    return {
        listObj,
        loading: state.loading.models.partnerRateList
    };
}

export default connect(mapStateToProps)(ListCard);
//export default ListCard;
