/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */
import Style from './basicinfo.less'
import { Checkbox, Row, Col , Tabs, Radio} from 'antd';
const { TabPane } = Tabs;
import HUMAN from '../../../assets/Images/encouragement/pic19.png'

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 功能：2018年首页信息模板
 */
class IndexInfoComponent extends React.Component {

  onChange = (checkedValues) => { 
    // console.log('checked = ', checkedValues);
    let selected = {
      id_card:0,
      birthday:0,
      country:0,
      nation:0,
      birth_place:0,
      unicom_age:0,
      ryy_age:0,
      rank_level:0,
      serve_time:0,
      kinsfolk_relation:0,
    }
    for(let i = 0; i < checkedValues.length; i++){
      selected[checkedValues[i]]  = '1';
    }
    this.setState({
      selected:selected
    })

  }



  state = {
    selected:{
      id_card:0,
      birthday:0,
      country:0,
      nation:0,
      birth_place:0,
      unicom_age:0,
      ryy_age:0,
      rank_level:0,
      serve_time:0,
      kinsfolk_relation:0,
    }
  }

  render(){
    const {info,optionInfo,talentsList,performance,isInternalTrainer}=this.props;
    const {selected}=this.state;
    return(
      <div className={Style.main}>
        <div className={Style.top}>
          <div className={Style.title}>
            <img className={Style.img} src={ localStorage.getItem('avatarUrl') }/>
            <div>
              <p><span className={Style.lable}>姓名：</span>{info.staff_name}</p>
              <p><span className={Style.lable}>员工编号：</span>{info.staff_id}</p>
              <p><span className={Style.lable}>部门：</span>{info.deptname}</p>
              <p><span className={Style.lable}>手机：</span>{info.phone_number}</p>
              <p><span className={Style.lable}>邮箱：</span>{info.email}</p>
            </div>
          </div>
        </div>
{/*1*/}
        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content}>
              <p>基本信息</p>
              <p>员工状态：{info.staff_status}</p>
              <p>性别：{info.gender}</p>
              <p>性格：{info.character|| ''}</p>
              {selected["id_card"] ? <p>身份证号：{optionInfo.id_card}</p> : null}
              {selected["birthday"] ? <p>出生日期：{optionInfo.birthday}</p> : null}
              {selected["country"] ? <p>国籍：{optionInfo.country}</p> : null}
              {selected["nation"] ? <p>民族：{optionInfo.nation}</p> : null}
              {selected["birth_place"] ? <p>籍贯：{optionInfo.birth_place}</p> : null}
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content}>
              <p>岗位职级信息</p>
              <p>职级信息（T职级)：{info.rank_sequence}</p>
              <p>绩效职级(T职级）：
              {
                performance.length ? 
                performance.map((item)=>{
                  return item.target_performance_rank
                })
                :
                info.rank_sequence
              }
              </p>
              <p>岗位信息：{info.post}</p>
              {selected["rank_level"] ? <p>职级信息（22职级）：{optionInfo.rank_level}</p> : null}
              {selected["serve_time"] ? <p>同级岗位任职开始时间：{optionInfo.serve_time}</p> : null}
            </div>
          </div>
        </div>

{/*2*/}
        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content} style={{height:'170px'}}>
              <p>合同信息</p>
              <p>合同编号：{info.contract_id}</p>
              <p>合同关系：{info.contractual_type}</p>
              <p>当前劳动合同签订时间：{info.contract_sign_date}</p>
              <p>合同期限：{info.contract_term}</p>
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content} style={{height:'170px'}}>
              <p>党团政治信息</p>
              <p>政治面貌：{info.politics_status}</p>
              <p>入党时间：{info.party_time}</p>
              <p>党内职务：{info.party_post}</p>
            </div>
          </div>
        </div>



{/*3*/}
        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content} style={{height:'140px'}}>
              <p>户籍档案信息</p>
              <p>户口所在地：{info.regist_location}</p>
              <p>户口类型：{info.regist_type}</p>
              <p>档案存放地点：{info.record_location}</p>
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content} style={{height:'140px'}}>
              <p>五险二金信息</p>
              <p>加入企业年金时间：{info.company_annuity_join_day}</p>
              <p>公积金账号：{info.provident_fund_account}</p>
              <p>公积金联名卡号：{info.provident_fund_card}</p>
            </div>
          </div>
        </div>



{/*4*/}
        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content}>
              <p>学历信息</p>
              <p>最高学位：{info.lastest_degree}</p>
              <p>学位证书编号：{info.degree_certificate_No}</p>
              <p>最高学历：{info.lastest_education}</p>
              <p>毕业院校：{info.graduated_school}</p>
              <p>专业：{info.major}</p>
              <p>学习形式：{info.learning_mode}</p>
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content}>
              <p>工龄司龄信息</p>
              <p>参加工作时间：{info.join_work_day}</p>
              <p>加入联通系统时间：{info.join_unicom_day}</p>
              <p>加入软研院时间：{info.join_ryy_day}</p>
              <p>入职渠道：{info.entry_way}</p>
              <p>入职前单位：{info.pre_company}</p>
              {selected["unicom_age"] ? <p>联通司龄：{optionInfo.unicom_age}</p> : null}
              {selected["ryy_age"] ? <p>软研院司龄：{optionInfo.ryy_age}</p> : null}
            </div>
          </div>
        </div>



{/*5*/}
        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content} style={{height:'180px'}}>
              <p>人才信息</p>
              {
                  talentsList.length ? 
                  <div>
                    <Radio.Group style={{ marginBottom: 8 }}>
                    </Radio.Group>
                    <Tabs defaultActiveKey="1" style={{ height: 220 }}>
                      {talentsList.map((item,index) => (
                        <TabPane tab={`所属专业线：${item.profession_line}`} key={index+1}>
                          <p style={{paddingLeft:'40px',paddingRight:'40px'}}>人才标识：{item.name}</p>
                          <p style={{paddingLeft:'40px'}}>人才任命时间：{item.select_time}</p>
                        </TabPane>
                      ))}
                    </Tabs>
                  </div>
                  :
                  ''
                }           
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content} style={{height:'180px'}}>
              <p style={{fontSize:'20px',marginBottom:'10px'}}>讲师信息：</p>
              <p style={{float:'left'}}>是否为讲师：</p>
              {
                isInternalTrainer && isInternalTrainer.length >= 1 ? 
                <p>是</p>
                :
                <p>否</p>
              }
              {
                isInternalTrainer && isInternalTrainer.length >= 1 ?
                <div>
                  <p>讲师等级：{isInternalTrainer[0].teacher_rank}</p>
                  <p>任职时间：{isInternalTrainer[0].valid_time}</p>
                  <p>任期：{isInternalTrainer[0].comment}</p>
                </div>
                :
                ''
              }
            </div>
          </div>
        </div>

{/*6*/}

        <div className={Style.middle} style={{marginTop:'10px',background: 'white', overflow:'hidden'}}>
          <div className={Style.left + ' ' + Style.threeColumn}>
            <div className={Style.content}>
              <p>专业技术资格</p>
              <p>专业技术资格名称：{info.certificate_name}</p>
              <p>专业技术资格证书编号：{info.certificate_No}</p>
              <p>获得职称时间：{info.certificate_date}</p>
            </div>
          </div>
          <div className={Style.left + ' ' + Style.threeColumn}>
            <div className={Style.content}>
              <p>职称信息</p>
              <p>职称系列：{info.title_type}</p>
              <p>职称等级：{info.title_level}</p>
              <p>获得职称时间：{info.title_date}</p>
            </div>
          </div>
          {info.staff_status == '在职' ?
            <div className={Style.left + ' ' + Style.threeColumn}>
              <div className={Style.content}>
                <p>借调信息</p>
                <p>借调开始时间：{info.secondment_start}</p>
                <p>借调结束日期：{info.secondment_end}</p>
                <p>借调单位：{info.secondment_company}</p>
              </div>
            </div>
            :null}
          {selected["kinsfolk_relation"] ?
          <div className={Style.right + ' ' + Style.threeColumn}>
            <div className={Style.content}>
              <p>亲属信息</p>
              <p>亲属员工编号：{info.kinsfolk_id}</p>
              <p>亲属员工姓名：{info.kinsfolk_name}</p>
              <p>联系电话：{info.kinsfolk_phone}</p>
            </div>
          </div>
            : null}
        </div>


        <div className={Style.bottom}>
          <div className={Style.title}>
            <div>可选字段</div>
            <Checkbox.Group style={{ width: '100%'}} onChange={this.onChange}>
              <Row>
                <Col span={3}><Checkbox value="id_card">身份证号</Checkbox></Col>
                <Col span={3}><Checkbox value="birthday">出生日期</Checkbox></Col>
                <Col span={2}><Checkbox value="country">国籍</Checkbox></Col>
                <Col span={2}><Checkbox value="nation">民族</Checkbox></Col>
                <Col span={2}><Checkbox value="birth_place">籍贯</Checkbox></Col>
                <Col span={3}><Checkbox value="unicom_age">联通司龄</Checkbox></Col>
                <Col span={3}><Checkbox value="ryy_age">软研院司龄</Checkbox></Col>
                <Col span={4}><Checkbox value="rank_level">职级信息（22职级）</Checkbox></Col>
                <Col span={5}><Checkbox value="serve_time">同级岗位任职开始时间</Checkbox></Col>
                <Col span={5}><Checkbox value="kinsfolk_relation">是否有亲属在联通系统内</Checkbox></Col>
              </Row>
            </Checkbox.Group>
          </div>
        </div>
      </div>
    )
  }
}
export default IndexInfoComponent;
