/**
 * 作者：邓广晖
 * 创建日期：2018-07-26
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：圆角形tab组件
 */
import React from 'react';
import styles from './squareTab.less';

class SquareTab extends React.Component {

    /**
     * 作者：邓广晖
     * 创建日期：2018-07-26
     * 功能：tab切换
     */
    clickSquareTab = (key) => {
        this.props.onTabsClick(key);
    };

    render() {
        return (
            <div>
                <div >
                    {
                        React.Children.map(
                            this.props.children.filter(item => (item !== '' && item !== null)),
                            (element) => {
                                let propsA = element.props.className ? element.props.className : '';
                                return (
                                    <span style={{ width: 200}}>
                                            <span
                                                style={{ color: propsA.tab_flag_change==='0'?'#d6d0d0':''}}
                                                onClick={() => this.clickSquareTab(element.props.value)}
                                                className={
                                                    element.props.value === this.props.activeKey
                                                        ?
                                                        propsA.tab_flag_change==='0' // 0没变化  置灰
                                                            ?
                                                            styles.titleGrayActive
                                                            :
                                                            styles.titleStyleActive
                                                        // styles.titleStyleActive
                                                        :
                                                        styles.titleStyle
                                                }
                                            >
                                                 {
                                                     propsA.is_del_pms==='1'?
                                                         <del style={{color: 'red'}}>
                                                             {element.props.name}
                                                         </del>
                                                         :
                                                         element.props.name
                                                 }
                                            </span>
                                        &nbsp;&nbsp;&nbsp;
                                </span>

                                )
                            })
                    }
                </div>
                <div>
                    {
                        React.Children.map(
                            this.props.children.filter(item => (item !== '' && item !== null)),
                            (element) => {
                                return (
                                    <div
                                        className={
                                            element.props.value === this.props.activeKey
                                                ?
                                                styles.display
                                                :
                                                styles.displayNone
                                        }
                                    >
                                        {element}
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
        )
    }
}

export default SquareTab;
