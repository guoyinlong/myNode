/**
 * 文件说明：组织绩效考核配置
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-12-3
 */
import {PureComponent} from 'react';
import {Menu} from 'antd';
import wrapStyle from '../../../../components/finance/finance.less';
import settingStyle from './settingStyle.less';
import AddIndex from './addIndex';
import Applicant from '../allocation/applicant';
import Examiner from '../allocation/examiner';
import AddSupport from './addSupport';
import AddMutual from '../allocation/addMutual';
// import ItExaminer from '../allocation/itExaminer';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

class Setting extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rightContent: <AddIndex />
        }
    }

    itemMenuClick = item => {
        let rightContent = null;
        switch (item.key) {
            case 'addIndex':
                rightContent = <AddIndex />;
                break;
            case 'support':
                rightContent = <AddSupport />;
                break;
            case 'applicant':
                rightContent = <Applicant />;
                break;
            case 'examiner':
                rightContent = <Examiner />;
                break;
            // case 'itExaminer':
            //     rightContent = <ItExaminer />;
            //     break;
            case 'mutual':
                rightContent = <AddMutual />;
                break;
            default:
                rightContent = '';
        }
        this.setState({
            rightContent
        })
    }

    render() {
        return (
            <div className={wrapStyle.wrap} style={{padding: 0}}>
                <div className={settingStyle.title}>组织绩效考核配置</div>
                <div className={settingStyle.content}>
                    <div className={settingStyle.leftContent}>
                        <Menu
                            mode="inline"
                            onClick={this.itemMenuClick}
                            defaultOpenKeys={['add', 'applicant', 'examiner']}
                            defaultSelectedKeys={['addIndex']}
                        >
                            <SubMenu key="add" title="指标生成">
                                <MenuItem key="addIndex">生成年度审核指标</MenuItem>
                                <MenuItem key="support">生成支撑服务满意度评价指标</MenuItem>
                            </SubMenu>
                            <SubMenu key="applicant" title="申请人配置">
                                <MenuItem key="applicant">年度指标申请人</MenuItem>
                            </SubMenu>
                            <SubMenu key="examiner" title="审核人配置">
                                <MenuItem key="examiner">年度考核指标审核人配置</MenuItem>
                                {/* <MenuItem key="itExaminer">月度it专业线审核人配置</MenuItem> */}
                                <MenuItem key="mutual">支撑协同互评审核人配置</MenuItem>
                            </SubMenu>
                        </Menu>
                    </div>
                    <div className={settingStyle.rightContent}>
                        {this.state.rightContent}
                    </div>
                </div>
            </div>
        )
    }
}

export default Setting;
