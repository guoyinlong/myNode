/**
 * 作者：任华维
 * 日期：2017-10-21 
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：黑名单查询结果
 */
import React, { Component } from 'react';
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：结果列表组件
 */
class ListModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            list:[]
        }
    }
    componentWillReceiveProps(nextProps) {
        //console.log(nextProps.data);
      if (nextProps.data.id == null ||  nextProps.data.id == 0 ) {
        this.setState({list:[{id:0,error:nextProps.data.error}]});
      } else {
        if (nextProps.data.id !== this.props.data.id) {
            if (this.props.data.id) {
                const list = this.state.list;
                list.push(nextProps.data);
                this.setState({list:list});
            } else {
                const list = [];
                list.push(nextProps.data);
                this.setState({list:list});
            }

        }
      }

    }
    render() {
        //const {list} = this.props
        return (
            <ul style={{fontSize: '14px'}}>
                {this.state.list.map((item, index) => {
                    return (
                        <li key={index} onClick={this.clickHandler.bind(this, item.id)}>
                            {item.id? '用户'+item.id+ (item.ACT_TAG === 0 ? '为正常状态':'已在黑名单范围') : (item.error ?'查询失败！请重试': '暂无查询结果')}

                        </li>
                    )
                })}
            </ul>
        )
    }
    clickHandler(id) {
        console.log(id);
    }
}

export default ListModal
