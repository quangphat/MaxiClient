import * as React from 'react';
import * as Models from '../../Models'
import * as Utils from '../../infrastructure/Utils'
import { NavLink } from 'react-router-dom';
import { Avatar, ArticleStatus, TagDisplay } from '..';
import * as RoutPath from '../../infrastructure/RoutePath'
import * as FormatHelper from '../../infrastructure/FormatHelper';
import * as Markdown from 'react-markdown';
import { CodeBlock } from '../CodeBlock/CodeBlock'
import "./index.css";
import { BoolMark, CreateSVG } from '../../CoreComponents';
import { JobItemTagInfo } from '../JobItemTagInfo/JobItemTagInfo';
interface TeamItemProps {
    team: Models.IUSPTeam,
    isShowStatus?: boolean
}
interface TeamItemStates {
    team: Models.IUSPTeam
}
export class TeamItem extends React.Component<TeamItemProps, TeamItemStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            team: this.props.team
        };

    }
    static defaultProps = {
        isShowStatus: false
    }
    componentWillMount() {

    }
    renderBody(data) {

    }




    public render() {
        let { team } = this.state
        if (Utils.isNullOrUndefined(team))
            return null;
        return <div data-geist-entity="" className="team-item">
            <div className="team-item-container  geist-container md-row lg-row" >
                <div className="team-item-first sm-row md-row lg-row entity_first__rsxZo" >
                    <div className="team-item-first-container geist-container entity_content__1CIHp" >
                        <p className="geist-themed geist-default geist-ellipsis entity_title__3oVEs geist-text geist-text-no-margin body-2 w-600">
                            <a className="link_link__2vTGP" href={`/teams/${team.id}`}>{team.name}</a></p>
                        <p className="geist-themed geist-secondary entity_description__3EVcD geist-ellipsis geist-text geist-text-no-margin body-2" title="">{team.leaderName}</p>
                    </div>
                </div>
                <div className="team-item--leader geist-container sm-row md-row lg-row entity_field__1fUAw" >
                    <div className="jsx-2797361110 geist-container entity_content__1CIHp" >
                        <p className="geist-themed geist-default geist-ellipsis entity_title__3oVEs geist-text geist-text-no-margin body-2 w-600">
                            <p className="text_wrapper__gz--Y text_s-14__Pte76 text_w-500__3GD8V text_truncate__1ckSa" ><a href="https://github.com/quangphat/job-bridge-client/commit/9c4f7b6ad7fcca2c84d1c565f26cd542498958a3" target="_blank" rel="noopener" title="Merge branch 'develop' into staging" className="link_link__2vTGP link_secondary__2oupT">
                                Merge branch 'develop' into staging</a>
                            </p>
                        </p>
                        <p className="geist-themed geist-secondary entity_description__3EVcD geist-ellipsis geist-text geist-text-no-margin body-2" title="">
                            <span title="develop" >

                                &nbsp;<span className="geist-ellipsis" >
                                    
                                </span>
                            </span>
                        </p>
                    </div>
                </div>
                <div className="jsx-2797361110 geist-container sm-row md-row lg-row entity_field__1fUAw entity_last__2eEkZ" >
                    <div className="jsx-2797361110 geist-container entity_content__1CIHp entity_rightAligned__33jjR">
                        <div className="entity_descriptionWithAvatar__1UyCv">
                            <p className="geist-themed geist-secondary entity_description__3EVcD geist-ellipsis geist-text geist-text-no-margin body-2" title="22:41:43 GMT+7, 27 thg 9, 2021">5d ago</p>
                            <span aria-hidden="true" className="geist-spacer ml-2"></span>
                        </div>
                    </div>
                    <div data-geist-entity-menu="" className="entity_menu__2q-ng">
                        <button aria-haspopup="true" aria-expanded="false" aria-controls="menu-8" type="submit" id="menu-button-9" data-geist-menu-button="" className="button_base__1XhUB reset_reset__3ht6- dots-menu_button__3YcWh" data-geist-button="">
                            <span className="button_content__2muyb">
                                <span className="dots-menu_container__2_YBj" data-geist-dots-menu="">
                                    <span className="dots-menu_menu__1v2wS">
                                        <CreateSVG size={14} svgName="three_dot_icon" />
                                    </span>
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}
