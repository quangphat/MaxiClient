//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import { HubConnection } from '@aspnet/signalr';
//import './index.css';
//import { PersonRepository } from '../../repositories/PersonRepository'
//import * as Utils from '../../infrastructure/Utils';
//import * as Models from '../../Models';
//import { MarkdownEditor, HeaderPage, TagDisplay, Avatar } from '../../components'
//import { Button, CreateSVG, Input, Loading, ITab, Tab } from '../../CoreComponents'
//import { ArticleList, } from './ArticleList'
//import { Experience } from './Experience'
//import { Skill } from './Skill'
//import { Settings } from './Settings'
//interface ProfileStates {
//    person: Models.IAuthor,
//    tabId: string,
//    isProfileOwner: boolean,
//    tabs: ITab[]
//}
//export class Profile extends React.Component<RouteComponentProps<any>, ProfileStates> {
//    account = Utils.GetAccount();
//    tabSettings = { name: "Cài đặt", id: 'settings' } as ITab
//    constructor(props) {
//        super(props);
//        this.state = {
//            person: null,
//            tabId: listTab[0].id,
//            isProfileOwner: false,
//            tabs: listTab
//        };
//    }

//    public componentWillMount() {
//        this.handleProps(this.props, true)
//    }

//    componentWillReceiveProps(newProps) {
//        this.handleProps(newProps)
//    }
//    private getPersonProfile(profileName) {
//        PersonRepository.GetByProfileName(profileName).then(response => {
//            if (response.error == null && response.data != null) {
//                let { isProfileOwner, tabs } = this.state
//                let person = response.data
//                if (Utils.isNullOrUndefined(this.account)
//                    || Utils.isNullOrUndefined(person)
//                    || this.account.personId != person.id) {
//                    isProfileOwner = false
//                }
//                else {
//                    isProfileOwner = true
//                    tabs.push(this.tabSettings)
//                }

//                this.setState({ person: response.data, isProfileOwner: isProfileOwner, tabs })
//            }
//        })
//    }
//    private handleProps(props, isInit: boolean = false) {
//        if (isInit || this.props.location.pathname != props.location.pathname) {
//            let profileName = props.match.params.profileName
//            if (profileName) {
//                this.getPersonProfile(profileName)

//            } 
//        }
//        if (this.props.location.search != props.location.search || isInit) {
//            let tabId = Utils.getParamSingle(props.location.search, 'tab_id')
//            if (Utils.isNullOrWhiteSpace(tabId))
//                tabId = listTab[0].id
//            this.setState({ tabId: tabId })

//        }
//    }

//    public componentDidMount() {

//    };
//    getResult(options) {
//        let x = options;
//    }
//    private resultantImage(this) {
//        let el = this.refs.reactCroppie
//        //el.croppie('result', {
//        //    type: 'rawcanvas',
//        //    circle: true,
//        //    // size: { width: 300, height: 300 },
//        //    format: 'png'
//        //}).then(function (canvas) {

//        //});
//        el.result({ format: 'base64', size: { width: 100, height: 100 } }).then(function (resp) {
//            console.log(resp);
//            var image = new Image();
//            image.src = resp;
//            document.body.appendChild(image);
//        });

//    }

//    private renderLeft(person: Models.IAuthor) {
//        //let { person } = this.state;
//        return <div className="w-18">
//            <div className="box box-primary">
//                <div className="box-body box-profile">
//                    <div className="text-center">
//                        <Avatar displayName={person.displayName}
//                            displayNamePosition="belowAvatar"
//                            profileName={person.profileName}
//                            isBlueText={false}
//                            history={this.props.history}
//                            img={'https://vi.wikipedia.org/wiki/T%E1%BA%ADp_tin:160811_%EB%AA%A8%EB%AA%A8%EB%9E%9C%EB%93%9C_%EC%83%81%EC%95%94_%ED%99%8D%EB%B3%B4._%EB%82%B8%EC%8B%9C_29_pic_(3).png'} size="s100" />
//                    </div>
//                    <div className="block text-right mt-10">
//                        <Button type="thin" className="btn-follow">Theo dõi</Button>
//                    </div>
//                    <ul className="list-group list-group-unbordered mt-10">
//                        <li className="list-group-item">
//                            <b>Followers</b> <a className="pull-right">1,322</a>
//                        </li>
//                        <li className="list-group-item">
//                            <b>Following</b> <a className="pull-right">543</a>
//                        </li>

//                    </ul>
//                </div>
//            </div>
//            <div className="clearfix" />
//            <div className="info_about_yourself_bottom">
//                <div className="info_about_yourself_bottom_tittle">
//                    About Me
//                    </div>
//                <div className="info_about_yourself_bottom_infolist">

//                    <div className="info_about_yourself_bottom_info_item">
//                        <strong><i className="fa fa-book margin-r-5"></i> Education</strong>
//                        <p>Ho Chi Minh City</p>
//                    </div>
//                    <div className="info_about_yourself_bottom_info_item">
//                        <strong><i className="fa fa-map-marker margin-r-5"></i> Location</strong>
//                        <p>Ho Chi Minh City</p>
//                    </div>
//                    <div className="info_about_yourself_bottom_info_item">
//                        <strong><i className="fa fa-pencil margin-r-5"></i> Skills</strong>
//                        <TagDisplay tags={person.skillTags} />
//                    </div>
//                </div>

//            </div>
//        </div>

//    }
//    private renderArticleList() {
//        let { tabId, person, isProfileOwner, tabs } = this.state
//        return <ArticleList isShow={tabId == tabs[0].id} person={person} isShowArticleStatus={isProfileOwner} />
//    }
//    private renderExperiences() {
//        let { tabId, tabs } = this.state
//        return <Experience isShow={tabId == tabs[1].id} person={this.state.person} />
//    }
//    private renderSkill() {
//        let { tabId, tabs } = this.state
//        return <Skill isShow={tabId == tabs[2].id} person={this.state.person} />
//    }
//    private renderSetting() {
//        let { tabId, person, tabs } = this.state
//        if (Utils.isNullOrUndefined(this.account)
//            || Utils.isNullOrUndefined(person)
//            || this.account.personId != person.id
//            || Utils.isNullOrUndefined(tabs[3]))
//            return null
//        return <Settings isShow={tabId == tabs[3].id} person={this.state.person} />
//    }
//    private renderRight() {
//        let { tabs } = this.state
//        return <div className="ml-50 w-60_per">
//            <div className="control_on_content_right">
//                {<Tab tabs={tabs} isKeepSelectedTab={true} onClickTab={(tabId) => this.setState({ tabId: tabId })}
//                    history={this.props.history} location={this.props.location} />}
//                {this.renderArticleList()}
//                {this.renderExperiences()}
//                {this.renderSkill()}
//                {this.renderSetting()}
//            </div>
//        </div>
//    }
//    public render() {
//        let render = null;
//        let person = this.state.person
//        if (Utils.isNullOrUndefined(person)) return null
//        render = <div className="pd_lr_110 ">
//            <div className="inline-flex w-100">
//                {this.renderLeft(person)}
//                {this.renderRight()}
//            </div>

//        </div>
//        return render;
//    }
//}
//const listTab = [
//    { name: "Bài viết", id: 'articles' },
//    { name: "Kinh nghiệm", id: 'exps' },
//    { name: "Kỹ năng", id: 'skills' }
//] as ITab[]