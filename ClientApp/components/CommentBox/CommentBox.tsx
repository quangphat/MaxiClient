import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as Utils from '../../infrastructure/Utils';
import { Avatar } from '../Avatar/Avatar'
import * as Markdown from 'react-markdown';
import { CodeBlock } from '../CodeBlock/CodeBlock'
import { TextArea } from '../../CoreComponents/TextArea/TextArea'
import { Button } from '../../CoreComponents/Button/Button'
import * as Models from '../../Models'
import * as PropTypes from 'prop-types';
import { CommentRepository } from '../../repositories/CommentRepository'
import { ReplyCommentRepository } from '../../repositories/ReplyCommentRepository'
import * as MessagesCode from '../../infrastructure/messages.json'
import './index.css'

export declare type IBoxType = 'comment' | 'replycomment'
interface CommentBoxProps {
    //onChange: Function,
    onPostComment: Function,
    articleId: string,
    defaultValue?: string,
    commentId?: string,
    boxType?: IBoxType
}
interface CommentBoxStates {
    value: string,
    isOnPreview: boolean
}
export class CommentBox extends React.Component<CommentBoxProps, CommentBoxStates>{
    author: Models.IAuthor = Utils.getAuthor();
    commentBox: any = null;
    constructor(props) {
        super(props);
        let defaultValue = this.props.defaultValue != null ? this.props.defaultValue : ''
        this.state = {
            value: defaultValue,
            isOnPreview: false
        }
    }
    public componentDidMount(this) {
        let commentBox = this.refs.commentBox;
        if (commentBox != null) {
            commentBox.focus();
        }
    }
    static contextTypes = {
        ShowMessage: PropTypes.func
    }
    static defaultProps = {
        boxType: 'comment'
    }
    private async postComment(comment) {
        let response = null
        if (this.props.boxType == "comment")
            response = await CommentRepository.CreateComment(comment)
        else
            response = await ReplyCommentRepository.CreateReplyComment(comment)
        if (response != null) {
            if (response.error == null) {
                comment = response.data
                this.props.onPostComment(comment)
                //this.context.ShowMessage("success", "success")
            }
            else {
                this.context.ShowMessage("error", "error")
            }
        }
        else {
            this.context.ShowMessage("error", "error")
        }
    }
    private onChange(e) {
        let text = e.target.value;
        if (Utils.isNullOrWhiteSpace(text)) return
        this.setState({ value: text });
    }
    private async onPostHandle() {
        let { articleId } = this.props
        let model = null
        if (this.props.boxType == "comment") {
            model = {
                articleId: articleId,
                author: this.author,
                content: this.state.value,
                createdTime: new Date()
            } as Models.IComment
        }
        else {
            model = {
                articleId: articleId,
                author: this.author,
                commentId: this.props.commentId,
                content: this.state.value,
                createdTime: new Date()
            } as Models.IReplyComment
        }

        await this.postComment(model)
        this.setState({ value: '', isOnPreview: false });

    }
    private renderOnTypingBox() {
        let { isOnPreview } = this.state
        if (isOnPreview)
            return <div className="on-previewing-box">
                <div className="flex">
                    <Avatar displayName={Utils.JoinFullName(this.author.lastName, this.author.firstName)}
                        isShowName={false}
                        profileName={this.author.profileName} size='s32' img={this.author.avatar} />
                    <Markdown source={this.state.value} escapeHtml={false}
                        renderers={{ code: CodeBlock }}
                        className="table-break-word markdown_comment_preview"
                        skipHtml={false} />
                </div>
                <div className="function-button mt-5">
                    <Button type="primary" className="btn-small" onClick={() => this.onPostHandle()}>Đăng</Button>
                    <Button type="link-no-pding" className="ml-5 btn-small" onClick={() => this.setState({ isOnPreview: false })}>Sửa</Button>
                </div>
            </div>

        return <div className="on-typing-box">
            <div className="flex">
                <Avatar displayName={Utils.JoinFullName(this.author.lastName, this.author.firstName)}
                    isShowName={false}
                    profileName={this.author.profileName} size='s32' img={this.author.avatar} />
                <TextArea className="ml-5" onChange={(e) => this.onChange(e)} value={this.state.value} />
                <div className="comment-box-icon">
                    <a className="comment-box-camera" href="#"><i className="fa fa-camera"></i></a>
                    <a className="comment-box-emoji" href="#"><i className="fa fa-smile-o"></i></a>
                </div>
            </div>
            <div className="function-button mt-5">
                <Button type="primary" className="btn-small" onClick={() => this.onPostHandle()}>Đăng</Button>
                <Button type="link-no-pding" className="ml-5 btn-small" onClick={() => this.setState({ isOnPreview: true })}>Xem thử</Button>
            </div>
        </div>
    }

    public render() {
        let render = null;

        if (!Utils.isLogin()) return null
        render = <div className="comment-box">
            {this.renderOnTypingBox()}
        </div>
        return render;
    }
}