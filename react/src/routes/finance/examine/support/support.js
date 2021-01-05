/**
 * 文件说明：组织绩效考核服务评价
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-10-21
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import QuestionnaireRes from '../../../../components/employer/QuestionnaireRes';
import Style from '../../../../components/employer/employer.less';
import supportStyle from './supportStyle.less';
import {Icon, Spin} from 'antd';

class Support extends PureComponent {
    constructor(props) {
        super(props);
    }
    // 获取满意度列表
    getQuestionnaireRes = (list = []) => {
        let questionnaireRes = [];
        const currentYear = new Date().getFullYear();
        for (let i = 2019; i <= currentYear; i++) {
            let pass = false;
            for (let v of list) {
                if (v.year == i) {
                    const item = {
                        key: v.id,
                        year: v.year,
                        state: v.status,
                        cardClickHandle: () => this.cardClickHandle(v.id, v.status)
                    };
                    questionnaireRes.push(<QuestionnaireRes {...item} />);
                    pass = true;
                    break;
                }
            }
            if (!pass) {
                const {loading} = this.props;
                const addElem = (
                    <Spin spinning={loading} key={i + ''}>
                        <div
                            className={supportStyle.addCard}
                            onClick={() => this.addSupport(i)}>
                            <Icon type="plus" />
                            <p>生成{i}年评价项</p>
                        </div>
                    </Spin>
                )
                questionnaireRes.push(addElem);
            }
        }
        return questionnaireRes.sort((a, b) => b.year - a.year);
    }
    // 插入评价项
    addSupport = year => {
        const {dispatch} = this.props;
        dispatch({
            type: 'supportModel/addSupport',
            payload: {
                year
            }
        });
    }
    // 卡片点击
    cardClickHandle = (id, status) => {
        const {dispatch} = this.props;
        dispatch(routerRedux.push({
            pathname: '/financeApp/examine/support/supportDetail',
            query: {
                supportId: id,
                status: status
            }
        }));
    }
        
    render() {
        const {supports} = this.props;
        return (
                <div className={Style.wrap + ' ' + Style.support}>
                    <div className={supportStyle.addCardWrap}>
                        {this.getQuestionnaireRes(supports)}
                    </div>
                </div>
        );
    }
}

const mapStateToProps = ({supportModel, loading}) => ({
    loading: loading.models.supportModel,
    ...supportModel
})
export default connect(mapStateToProps)(Support);
