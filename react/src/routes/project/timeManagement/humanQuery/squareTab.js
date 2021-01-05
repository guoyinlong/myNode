/**
 * 作者：张楠华
 * 创建日期：2018-06-22
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：tab
 */
import React from 'react';
import styles from './squareTab.css';

class SquareTab extends React.Component{

  clickSquareTab = (key) => {
    this.props.onTabsClick(key);
  };

  render(){
    return (
      <div>
        <div >
          {
            React.Children.map(
              this.props.children.filter(item=>(item !== '' && item !== null)),
              (element)=>{
                return(
                  <span style={{width:100}}>
                                    <span
                                      onClick={()=>this.clickSquareTab(element.props.id)}
                                      className={
                                        element.props.id === this.props.activeKey
                                          ?
                                          styles.titleStyleActive
                                          :
                                          styles.titleStyle
                                      }
                                    >
                                        {element.props.name}
                                    </span>&nbsp;&nbsp;&nbsp;
                                </span>
                )
              })
          }
        </div>
        <div>
          {
            React.Children.map(
              this.props.children.filter(item=>(item !== '' && item !== null)),
              (element)=>{
                return(
                  <div
                    className={
                      element.props.id === this.props.activeKey
                        ?
                        styles.display
                        :
                        styles.displayNone
                    }
                  >
                    { element }
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
