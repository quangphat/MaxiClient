import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as Utils from '../../infrastructure/Utils';
import * as FormatHelper from '../../infrastructure/FormatHelper';
import { IAuthor } from '../../Models/IAuthor'
import { Avatar } from '../Avatar/Avatar'
import { CreateSVG } from '../../CoreComponents/CreateSVG/CreateSVG'
import { CommentBox } from '../CommentBox/CommentBox'
import { Input } from '../../CoreComponents/Input/Input'
import { IComment } from '../../Models/IComment'

interface CommentViewBoxProps {
    comment: IComment
    className?: string
}
interface CommentViewBoxStates {

}
export class CommentViewBox extends React.Component<CommentViewBoxProps, CommentViewBoxStates>{
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    public componentDidMount(this) {

    }
    public componentWillReceiveProps() {
        //let value = nextProps.defaultValue != null ? nextProps.defaultValue : ''
        //this.setState({value: value})
    }

    public render() {
        let { comment, className } = this.props
        if (Utils.isNullOrUndefined(comment) || Utils.isNullOrWhiteSpace(comment.content))
            return null
        let currentUser = Utils.getAuthor()
        return <div className={`${className} box-comment`}>
            <div key={comment.id} className="feed-item">
                <Avatar img={comment.author.avatar} size="s32" profileName={currentUser.profileName} displayName={comment.author.displayName} />
                <div className="feed-body">
                    <div className="feed-comment-content col-md-8">
                        <p className="feed-comment-text-content">
                            <span className="ember-view">
                                <span>{comment.content}</span>
                            </span>
                        </p>

                    </div>
                    <div className="comment-interactive row">
                        <div className="comment-view-interactive col-md-8 col-xs-8">
                            <span className="user-like">
                                <img src="../../../../assets/images/icon-like.png" alt="" /> {comment.likes > 0 ? comment.likes : ''}
                                <a className="" >Like</a>
                            </span>
                            <a className="feed-comment-interactive-button ml-5">Reply</a>
                        </div>
                        <div className="pull-right">
                            <div className="feed-comment-options row">
                                <div className="feed-comment-time cool">{FormatHelper.FormatDateTimeFromDate(comment.createdTime, '', '')}</div>
                                {<a className="comment-options-trigger pull-right">
                                    <span className="svg-icon-wrap">
                                        <CreateSVG size={24} svgName='ellipsisHorizontal' />
                                    </span>
                                </a>}
                            </div>

                        </div>
                    </div>


                </div>

            </div>
            <div className="feed-comment-replies">
                {Utils.isLogin() && <div>
                    <Avatar img={currentUser.avatar} size="s32" profileName={currentUser.profileName} displayName={currentUser.displayName} />
                    <div className="feed-body">
                        <div className="feed-comment-content col-md-8">
                            <p className="feed-comment-text-content">
                                <span className="ember-view">
                                    <span>{comment.content}</span>
                                </span>
                            </p>

                        </div>
                        <div className="comment-interactive row">
                            <div className="comment-view-interactive col-md-8 col-xs-8">
                                <span className="user-like">
                                    <img src="../../../../assets/images/icon-like.png" alt="" /> {comment.likes > 0 ? comment.likes : ''}
                                    <a className="" >Like</a>
                                </span>
                                <a className="feed-comment-interactive-button ml-5">Reply</a>
                            </div>
                            <div className="pull-right">
                                <div className="feed-comment-options row">
                                    <div className="feed-comment-time cool">{FormatHelper.FormatDateTimeFromDate(comment.createdTime, '', '')}</div>
                                    {<a className="comment-options-trigger pull-right">
                                        <span className="svg-icon-wrap">
                                            <CreateSVG size={24} svgName='ellipsisHorizontal' />
                                        </span>
                                    </a>}
                                </div>

                            </div>
                        </div>


                    </div>
                </div>
                }
                {Utils.isLogin() && <div className="row">
                    <Avatar img={currentUser.avatar} isShowName={false} size="s32" profileName={currentUser.profileName} displayName={currentUser.displayName} />
                        <Input />
                </div>
                }
            </div>
        </div>
    }
}