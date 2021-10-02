import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as Utils from '../../infrastructure/Utils';
import { Avatar } from '../Avatar/Avatar'
import { CreateSVG } from '../../CoreComponents/CreateSVG/CreateSVG'
import { CommentBox } from '../CommentBox/CommentBox'
import { Button } from '../../CoreComponents/Button/Button'
import { IComment } from '../../Models/IComment'
import * as FormatHelper from '../../infrastructure/FormatHelper';
import { IAuthor } from '../../Models/IAuthor'
import { IArticle } from '../../Models/IArticle'
import * as PropTypes from 'prop-types';
import * as Markdown from 'react-markdown';
import { CodeBlock } from '../CodeBlock/CodeBlock'
import { CommentRepository } from '../../repositories/CommentRepository'
import { ReplyCommentRepository } from '../../repositories/ReplyCommentRepository'
import * as MessagesCode from '../../infrastructure/messages.json'
import { IReplyComment, ICommentRepliesGroup, IPaging } from 'ClientApp/Models';



interface CommentViewBoxMarkdownProps {
    comment: IComment,
    className?: string
}
interface CommentViewBoxMarkdownStates {
    replies: IReplyComment[],
    comment: IComment,
    paging: IPaging,
    isPressGetReply: boolean
}
export class CommentViewBoxMarkdown extends React.Component<CommentViewBoxMarkdownProps, CommentViewBoxMarkdownStates>{
    constructor(props) {
        super(props);
        this.state = {
            replies: [],
            comment: this.props.comment,
            isPressGetReply: false,
            paging: { page: 1, limit: 10, totalRecord: 0, hasMore: false } as IPaging
        }
    }
    public componentDidMount(this) {

    }
    static defaultProps = {
        className:''
    }
    static contextTypes = {
        ShowMessage: PropTypes.func
    }
    private async getReply() {
        let { paging, replies } = this.state
        let response = await ReplyCommentRepository.GetByCommentId(this.props.comment.id, paging.page, paging.limit)
        if (response != null) {
            if (response.error == null) {
                paging.totalRecord = response.data.totalRecord
                paging.hasMore = paging.page * paging.limit >= paging.totalRecord ? false : true
                if (replies == null)
                    replies = []
                if(!Utils.isArrNullOrHaveNoItem(response.data.datas))
                    replies = replies.concat(response.data.datas)
                this.setState({ replies: replies, paging: paging, isPressGetReply: true })
            }
        }
    }
    private onGetMoreReply() {
        let { paging } = this.state
        paging.page += 1;
        this.setState({ paging }, () => this.getReply())
    }
    private onPostReply(reply: IReplyComment) {
        if (Utils.isNullOrUndefined(reply)) return
        let { replies, comment } = this.state
        if (Utils.isArrNullOrHaveNoItem(replies)) {
            replies = []
        }
        replies.push(reply)
        this.setState({ replies, comment: { ...comment, replies: comment.replies += 1 } })
    }
    private renderReplyBox(comment: IComment) {
        let { replies, paging } = this.state
        return <div className="feed-comment-replies mt-10">
            {!Utils.isArrNullOrHaveNoItem(replies) &&
                replies.map(item => {
                    return <div key={item.id} className="comment-item mt-10">
                        <div className="flex">
                            <Avatar img={item.author.avatar} size="s32" wrapperClass="w-80_per"
                                profileName={item.author.profileName} displayName={item.author.displayName} >
                            </Avatar>
                            <div className="right text-right w-20_per text-small">
                                {<a className="comment-options-trigger pull-right">
                                    <span className="svg-icon-wrap">
                                        <CreateSVG size={24} svgName='ellipsisHorizontal' />
                                    </span>
                                </a>}
                            </div>
                        </div>

                        <div className="comment-body pl-40">
                            <div className="comment-content">
                                <Markdown source={item.content} escapeHtml={false}
                                    className="table-break-word markdown_content"
                                    renderers={{ code: CodeBlock }}
                                    skipHtml={false} />
                            </div>
                            <div className="comment-interactive">
                                <div className="comment-view-interactive ">
                                    <Button type="link-no-pding" className="btn-small" >
                                        <span>{item.likes > 0 ? item.likes : ''}</span>
                                        Like
                            </Button>
                                    <span className="ml-5 text-small">{FormatHelper.FormatDateTimeFromDate(item.createdTime, '', '')}</span>
                                </div>
                            </div>
                            {paging.hasMore && <Button type="link-no-pding" className="btn-small mt-10" onClick={() => this.onGetMoreReply()}>Xem thêm phản hồi</Button>}
                        </div>
                    </div>
                })

            }
            
            {(Utils.isLogin() && this.state.isPressGetReply) &&
                <CommentBox boxType="replycomment" articleId={this.props.comment.articleId}
                    commentId={this.props.comment.id} onPostComment={(reply) => this.onPostReply(reply)} />
            }
        </div>
    }
    public render() {
        let { className } = this.props
        let { comment } = this.state
        if (Utils.isNullOrUndefined(comment) || Utils.isNullOrWhiteSpace(comment.content))
            return null
        return <div className={`${className} box-comment mt-20`}>
            <div key={comment.id} className="comment-item mt-10">
                <div className="flex">
                    <Avatar img={comment.author.avatar} size="s32" wrapperClass="w-80_per"
                        profileName={comment.author.profileName} displayName={comment.author.displayName} >
                    </Avatar>
                    <div className="right text-right w-20_per text-small">
                        {<a className="comment-options-trigger pull-right">
                            <span className="svg-icon-wrap">
                                <CreateSVG size={24} svgName='ellipsisHorizontal' />
                            </span>
                        </a>}
                    </div>
                </div>

                <div className="comment-body pl-40">
                    <div className="comment-content">
                        <Markdown source={comment.content} escapeHtml={false}
                            className="table-break-word markdown_content"
                            renderers={{ code: CodeBlock }}
                            skipHtml={false} />
                    </div>
                    <div className="comment-interactive">
                        <div className="comment-view-interactive ">
                            <Button type="link-no-pding" className="btn-small" >
                                <span>{comment.likes > 0 ? comment.likes : ''}</span>
                                Like
                            </Button>
                            <Button type="link-no-pding" className="btn-small ml-5"
                                onClick={async () => this.getReply()}>Reply</Button>
                            <span className="ml-5 text-small">{FormatHelper.FormatDateTimeFromDate(comment.createdTime, '', '')}</span>

                        </div>
                        <div>
                            {(comment.replies > 0 && !this.state.isPressGetReply) && <Button type="link-no-pding" className="btn-small" onClick={async () => this.getReply()}>Xem phản hồi</Button>}
                            {this.renderReplyBox(comment)}
                        </div>
                        
                    </div>
                    
                </div>
            </div>
            
            
        </div>
    }
}