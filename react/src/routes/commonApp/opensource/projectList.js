/*
    @author:zhulei
    @date:2017/11/9
    @email:xiangzl3@chinaunicom.cn
    @description:GitLab-项目列表
*/

import React from 'react';
import {connect} from 'dva';
import {Icon} from 'antd';
import styles from './basicInfo.less';
import Cookie from 'js-cookie';

const auth_username = Cookie.get('loginname');

//定义服务列表
class List extends React.PureComponent {
  sigin = (url) => {
    this.props.signin(url);
  }
  render() {

    let dataList = this.props.dataSource;
    let name = this.props.name;


    if (name == "starList") { //点赞排名
      return (
        <ul>
          {
            dataList.map(function (i) {
              return (
                <li className={styles.letterStyle}>
                  <div style={{display: 'inline-block', width: '90%'}}>
                    {i["name"]}
                  </div>
                  <div style={{display: 'inline-block', width: '10%', lineHeight: '2'}}>
                    <Icon type='star' style={{color: '#6D6D6D'}}></Icon>&nbsp;&nbsp;
                    {i["star_count"]}
                  </div>
                </li>
              );
            })
          }
        </ul>
      );
    } else if (name == "commitList") { //更新排名
      return (
        <ul>
          {
            dataList.map(function (i) {
              return (
                <li className={styles.letterStyle}>
                  <div style={{display: 'inline-block', width: '90%'}}>
                    {i["name"]}
                  </div>
                  <div style={{display: 'inline-block', width: '10%', lineHeight: '2'}}>
                    <Icon type='clock-circle-o' style={{color: '#6D6D6D'}}></Icon>&nbsp;&nbsp;
                    {i["commit_count"]}
                  </div>
                </li>
              )
            })
          }
        </ul>
      );
    } else if (name == "classList") { //目录
      return (
        <ul>
          {
            dataList.map(function (i) {

              return (
                <li className={styles.letterStyle}>
                  <div style={{display: 'inline-block', width: '90%'}}>
                    {i["class_name"]}
                  </div>
                  <div style={{display: 'inline-block', width: '10%', lineHeight: '2'}}>
                    &nbsp;&nbsp;({i["gccount"]})
                  </div>
                </li>
              )

            })
          }
        </ul>
      );
    } else if (name == "langList") { //项目语言
      return (
        <ul>
          {
            dataList.map(function (i) {
              return (
                <li className={styles.letterStyle}>
                  <div style={{display: 'inline-block', width: '90%'}}>
                    {i["main_language"]}
                  </div>
                  <div style={{display: 'inline-block', width: '10%', lineHeight: '2'}}>
                    ({i["pcount"]})
                  </div>
                </li>
              )
            })
          }
        </ul>
      );
    }
    else if (name == "projList") { //开源项目
      return (
        <ul>
          {
            dataList.map((key, index) => {

                return (
                  <div key={index} style={{float: "left", width: '18%', marginRight: "2%"}}>
                    {
                      key.map((item, index2) => {
                          return (
                            (item["zhBookHeader"] != null) ?
                              <li className={styles.letterTitle} key={index2}>
                                {item["zhBookHeader"]}
                              </li>
                              :
                              <li className={styles.letterStyle}  key={index2}
                                  style={{display: 'online-block', width: '100%', lineHeight: '2'}}>

                                <a  onClick={()=>this.sigin(item["gitlab_proj_url"])}  > {item["zhname"]} </a>

                              </li>
                          )
                        }
                      )
                    }
                  </div>
                )
              }
            )
          }
        </ul>
      );


    }


  }


};


class projectList extends React.Component {

  constructor(props) {
    super(props);

  }

  signin = (url) => {

    let arg_params = {};
    arg_params["argusername"] = auth_username;
    arg_params["url"] = url;
    const {dispatch} = this.props;
    dispatch({
      type: 'projectList/signin',
      arg_param: arg_params
    });
  }



  render() {

    const {starList, commitList, classList, langList, projList} = this.props;

    return (
      <div>
        <div>
          {/*点赞排名*/}
          <div style={{width: '50%', display: 'inline-block'}}>
            <div style={{width: '20%', display: 'inline-block', verticalAlign: 'top'}}>
              <div className={styles.numStyle} style={{textAlign: 'right'}}>
                01
              </div>
            </div>
            <div style={{width: '80%', display: 'inline-block'}}>
              <div className={styles.titleStyle}>
                点赞排名
              </div>
              <div>
                <List name={"starList"} dataSource={starList}/>
              </div>
            </div>
          </div>
          {/*更新排名*/}
          <div style={{width: '50%', display: 'inline-block'}}>
            <div style={{width: '20%', display: 'inline-block', verticalAlign: 'top'}}>
              <div className={styles.numStyle} style={{textAlign: 'right'}}>
                02
              </div>
            </div>
            <div style={{width: '80%', display: 'inline-block'}}>
              <div className={styles.titleStyle}>
                更新排名
              </div>
              <div>
                <List name={"commitList"} dataSource={commitList}/>
              </div>
            </div>
          </div>
        </div>
        {/*目录*/}
        <div>
          <div style={{width: '50%', display: 'inline-block'}}>
            <div style={{width: '20%', display: 'inline-block', verticalAlign: 'top'}}>
              <div className={styles.numStyle1} style={{textAlign: 'right'}}>
                01
              </div>
            </div>
            <div style={{width: '80%', display: 'inline-block'}}>
              <div className={styles.titleStyle1}>
                目录
              </div>
              <div>
                <List name={"classList"} dataSource={classList}/>
              </div>
            </div>
          </div>
          {/*项目语言*/}
          <div style={{width: '50%', display: 'inline-block', verticalAlign: 'top'}}>
            <div style={{width: '20%', display: 'inline-block', verticalAlign: 'top'}}>
              <div className={styles.numStyle1} style={{textAlign: 'right'}}>
                02
              </div>
            </div>
            <div style={{width: '80%', display: 'inline-block'}}>
              <div className={styles.titleStyle1}>
                项目语言
              </div>
              <div>
                <List name={"langList"} dataSource={langList}/>
              </div>
            </div>
          </div>
        </div>
        {/*开源项目*/}
        <div style={{width: '100%', display: 'inline-block'}}>
          <div style={{width: '10%', display: 'inline-block', verticalAlign: 'top'}}>
            <div className={styles.numStyle1} style={{textAlign: 'right'}}>
              03
            </div>
          </div>
          <div style={{width: '90%', display: 'inline-block'}}>
            <div className={styles.titleStyle1}>
              开源项目
            </div>
            <div>
              <List name={"projList"} dataSource={projList} signin={this.signin}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.projectList,
    ...state.projectList
  }
}

export default connect(mapStateToProps)(projectList);
