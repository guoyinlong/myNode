/**
 * 文件说明：合作伙伴指标录入
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2018-06-15
 */
import { Row,Collapse,Popconfirm,Button } from 'antd';
import Style from '../partnerItem.less';
import { connect } from 'dva';
import AddDom from '../itemBox';
import ResonModal from './resonModal';

const Panel = Collapse.Panel;

class partnerItem extends React.Component {
    
    handleModalCancelClick = () => {
        const {dispatch} = this.props;
        dispatch({
            type:'checkDetailModels/taskHideModal'
        });

    };
    
    handleReturnClick = () => {
        const {dispatch} = this.props;
        dispatch({
            type:'checkDetailModels/taskShowModal'
        });

    };
    
    handlePassClick = () => {
        const {dispatch} = this.props;
        dispatch({
            type:'checkDetailModels/pass',
            params:{
                arg_user_id:this.props.param.userId,
                arg_kpi_year:this.props.param.year,
                arg_kpi_month:this.props.param.month,
            }
        });

    };
    
    handleModalOkClick = (value) => {
        const {dispatch} = this.props;
        dispatch({
            type:'checkDetailModels/back',
            params:{
                arg_user_id:this.props.param.userId,
                arg_kpi_year:this.props.param.year,
                arg_kpi_month:this.props.param.month,
                arg_reason:value.reson
            }
        });
     
        
    };
    
    render() {
        return (
            <div className={`${Style.KpiTypesBox} ${Style.arr}`}>
                <Collapse  bordered={false} defaultActiveKey={['1']}>
                    <Panel key="1">
                        <Row>
                        {this.props.detail.map((item, index) => {
                            return (
                                <AddDom  checkerName={item.checker_name} checkerId={item.checker_id} data={item} isEdit={false} key={index} itemIndex={index}/>
                            );
                        })}
                        </Row>
                    </Panel>
                </Collapse>
                <div className={Style.submit}>
                    <Button onClick={()=>{this.handleReturnClick()}}>退回</Button>
                    <Popconfirm title="确定要通过吗？" okText="确定" cancelText="取消" onConfirm={()=>this.handlePassClick()}>
                        <Button type="primary">通过</Button>
                    </Popconfirm>
                </div>
                <ResonModal okClick={(value)=>{this.handleModalOkClick(value)}} cancelClick={()=>{this.handleModalCancelClick()}} isShow={this.props.modalVisible}></ResonModal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { modalVisible } = state.checkDetailModels;
    return {
        modalVisible,
        loading: state.loading.models.checkDetailModels
    };
}
export default connect(mapStateToProps)(partnerItem) 