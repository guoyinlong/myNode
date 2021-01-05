/**
 * 文件说明：组织绩效考核指标详情指标项
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-17
 */
import {PureComponent} from 'react';
import {connect} from 'dva';
import {Collapse, Table} from 'antd';
import {indexTypeMap} from './mapInformation';
import IndexItem from './IndexItem';
import indexStyle from './indexDetail.less';
import {clearInterval, setInterval} from 'timers';
const {Panel} = Collapse;

class IndexType extends PureComponent {
    constructor(props) {
        super(props);
    }
    // 指标类型
    getPanel = (indexTypes = []) => indexTypes.map((v, i) => {
        const headerData = {
            title: indexTypeMap[v.type],
            indexItems: v.indexItems || []
        }
        return (
            <Panel
                header={this.getHeader(headerData)}
                key={v.id}
                className={indexStyle.indexPanel}
            >
                {this.getIndexItem(i, v.type, v.indexItems)}
            </Panel>
        )
    })
    // 指标类型标题
    getHeader = headerData => {
        return (
            <header className={indexStyle.panelHeader}>
                <h2 className={headerData.indexItems.length < 12 ? indexStyle.shortTableTitle : ''}>{headerData.title}</h2>
                {this.getScoreTable(headerData.indexItems)}
            </header>
        )
    }
    // 数组内数字相加
    sum = scoreArr => {
        let num = 0;
        scoreArr.forEach(v => {
            const float = v.toString().split('.')[1];
            const len = float ? float.length : 0;
            num = len > num ? len : num;
        })
        const weight = Math.pow(10, num);
        let sum = 0;
        scoreArr.forEach(v => {
            sum += v * weight;
        })
        return sum / weight;
    }
    // 指标分数表格
    getScoreTable = (indexItems = []) => {
        let columns = [
            {
                title: '总得分',
                dataIndex: 'scoreTotal',
                key: 'scoreTotal',
                fixed: 'left',
                width: 80
            }
        ];
        let dataSourceItem = {};
        let scoreArr = [];
        indexItems.forEach((v, i) => {
            columns.push({
                title: '指标' + (i + 1),
                dataIndex: `score${i + 1}`,
                key: `score${i + 1}`,
                width: 80
            });
            const score = parseFloat(v.score);
            if (!Number.isNaN(score)) scoreArr.push(score);
            dataSourceItem[`score${i + 1}`] = Number.isNaN(score) ? '--' : score ;
        });
        const dataSource = [
            {
                ...dataSourceItem,
                scoreTotal: scoreArr.length > 0 ? this.sum(scoreArr) : '--',
                key: 'score',
            }
        ]
        return (
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
                className={`${indexStyle.indexTable} ${indexItems.length < 12 ? indexStyle.shortIndexTable : ''}`}
                scroll={{x: columns.length * 75}}
            />
        )
    }
    // 小指标获取
    getIndexItem = (typeIndex, type, indexItem = []) => {
        const {indexShowType, flag, status, tag, location} = this.props;
        return indexItem.map((v, i) => {
            const indexItemData = {
                ...v,
                index: i + 1
            }
            return (
                <IndexItem
                    indexItem={indexItemData}
                    key={indexItemData.index}
                    itemIndex={i}
                    typeIndex={typeIndex}
                    flag={flag}
                    status={status}
                    tag={tag}
                    indexShowType={indexShowType}
                    type={type}
                    location={location}
                />
            )
        });
    }
    // 获取默认打开的面板
    getDefaultActiveKey = (indexTypes = []) => {
        const {dispatch} = this.props;
        const keys = indexTypes.map(v => v.id);
        dispatch({
            type: 'indexModel/save',
            payload: {
                activeKey: keys
            }
        })
        return keys;
    }

    // 折叠栏变化时
    collapseChange = (key) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'indexModel/save',
            payload: {
                activeKey: key
            }
        });
    }

    componentWillMount() {
        const timer = setInterval(() => {
            const {indexTypes, loading} = this.props;
            if (!loading) {
                this.getDefaultActiveKey(indexTypes);
                clearInterval(timer);
            }
        }, 0);
    }

    render() {
        const {indexTypes, loading, activeKey} = this.props;
        return !loading ?
        (
            <Collapse
                activeKey={activeKey}
                className={indexStyle.indexCollapse}
                onChange={this.collapseChange}
            >
                {this.getPanel(indexTypes)}
            </Collapse>
        ) : <div>加载中...</div>
    }
}

const mapStateToProps = ({indexModel}) => ({
    ...indexModel
});

export default connect(mapStateToProps)(IndexType);
