//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import { IArticleMeta } from '../../Models/IArticleMeta'
//import { Button, Tab, ITab } from '../../CoreComponents'
//import {
//    ArticleView, JobItem,
//    CommentViewBoxMarkdown,
//    CommentBox,
//    LikeBox
//} from '../../components'
//import * as Models from '../../Models'
//import { ArticleRepository } from '../../repositories/ArticleRepository'
//import { CommentRepository } from '../../repositories/CommentRepository'
//import * as Utils from '../../infrastructure/Utils'

//import * as PropTypes from 'prop-types';
//interface ArticleDetailStates {
//    categories: Models.ICategory[],
//    article: Models.IArticle,
//    comments: Models.IComment[],
//    paging: Models.IPaging,
//    tabId: string,
//    sameAuthorArticles: Models.IArticle[],
//    articlesByTags: Models.IArticle[]
//}
//export class ArticleDetail extends React.Component<RouteComponentProps<any>, ArticleDetailStates> {
//    constructor(props: any) {
//        super(props);
//        this.state = {
//            categories: [],
//            article: null,
//            comments: [],
//            paging: { page: 1, limit: 10, totalRecord: 0, hasMore: false } as Models.IPaging,
//            tabId: '0',
//            sameAuthorArticles: [],
//            articlesByTags: []
//        };

//    }
//    static contextTypes = {
//        ShowMessage: PropTypes.func
//    }
//    componentWillMount() {
//        let friendlyUrl = this.props.match.params.id
//        this.getArticleDetail(friendlyUrl)
//    }
//    componentWillReceiveProps(newProps) {
//        if (this.props.location != newProps.location) {
//            let tabId = Utils.getParamSingle(newProps.location.search, 'tab_id')
//            if (Utils.isNullOrWhiteSpace(tabId))
//                tabId = listTabs[0].id
//            this.setState({ tabId: tabId, sameAuthorArticles: [], articlesByTags: [], comments: [] }, () => {
//                let friendlyUrl = newProps.match.params.id
//                this.getArticleDetail(friendlyUrl)
//            })
//        }

//    }
//    private getArticleDetail(id) {

//        if (Utils.isNullOrUndefined(id))
//            this.props.history.push('/');
//        ArticleRepository.GetByFriendlyUrl(id).then(res => {
//            if (res.data != null) {
//                this.setState({ article: res.data }, async () => await this.getComments(this.state.article.id))
//            }
//        })
//    }
//    private async getComments(articleId) {
//        let { paging, comments } = this.state
//        let response = await CommentRepository.GetByArticleId(articleId, paging.page, paging.limit)
//        if (response != null) {
//            if (response.error == null) {
//                paging.totalRecord = response.data.totalRecord
//                paging.hasMore = paging.page * paging.limit >= paging.totalRecord ? false : true
//                if (comments == null)
//                    comments = []
//                if (!Utils.isArrNullOrHaveNoItem(response.data.datas))
//                    comments = comments.concat(response.data.datas)
//                this.setState({ comments: comments, paging: paging })
//            }
//        }
//    }
//    private renderBody(article: Models.IArticle) {
//        return <ArticleView article={article} />
//    }
//    private renderCommentList() {
//        let { comments } = this.state
//        if (Utils.isArrNullOrHaveNoItem(comments))
//            return null
//        return comments.map(c => {
//            return <CommentViewBoxMarkdown
//                key={c.id}
//                comment={c}

//            />
//        })
//    }
//    private onPostComment(comment: Models.IComment) {
//        if (Utils.isNullOrUndefined(comment)) return
//        let { comments } = this.state
//        if (Utils.isArrNullOrHaveNoItem(comments))
//            comments = []
//        comments.unshift(comment)
//        this.setState({ comments })
//    }
//    private onGetMoreComment() {
//        let { paging } = this.state
//        paging.page += 1;
//        this.setState({ paging: paging },
//            async () => await this.getComments(this.state.article.id))
//    }
//    private async getRelateArtileByAuthor() {
//        let { sameAuthorArticles, article } = this.state
//        if (!Utils.isArrNullOrHaveNoItem(sameAuthorArticles))
//            return;
//        let response = await ArticleRepository.GetTop3ByAuthor(article.author.id, { Values: [article.id] })
//        if (response.success) {
//            this.setState({ sameAuthorArticles: response.data.datas })
//        }
//    }
//    private async getRelateArticleByTags() {
//        let { articlesByTags, article } = this.state
//        if (!Utils.isArrNullOrHaveNoItem(articlesByTags))
//            return;
//        let response = await ArticleRepository.GetRelateByTags(article.author.id, { values1: article.tags, values2: [article.id] })
//        if (response.success) {
//            this.setState({ articlesByTags: response.data.datas })
//        }
//    }
//    private onClickTab(tabId) {
//        this.setState({ tabId: tabId }, () => {
//            if (this.state.tabId == '1') {
//                this.getRelateArtileByAuthor()
//            }
//            else if (this.state.tabId == '2') {
//                this.getRelateArticleByTags()
//            }
//        })
//    }
//    private renderCommentTab() {
//        let { paging } = this.state
//        return <React.Fragment >
//            <CommentBox articleId={this.state.article.id} onPostComment={(comment) => this.onPostComment(comment)} />
//            {this.renderCommentList()}
//            {paging.hasMore && <Button type="link-no-pding"
//                onClick={() => this.onGetMoreComment()}>Xem thêm</Button>}
//        </React.Fragment>
//    }
//    private renderSameAuthorArticle() {
//        let { sameAuthorArticles } = this.state
//        if (Utils.isArrNullOrHaveNoItem(sameAuthorArticles))
//            return null
//        return <div className="bg-main">{sameAuthorArticles.map(item => {
//            return <JobItem key={item.id} article={item} />
//        })}
//        </div>
//    }
//    private renderRelateArticlesByTag() {
//        let { articlesByTags } = this.state
//        if (Utils.isArrNullOrHaveNoItem(articlesByTags))
//            return null
//        return <div className="bg-main">{articlesByTags.map(item => {
//            return <JobItem key={item.id} article={item} />
//        })}
//        </div>
//    }
//    public render() {
//        let { article } = this.state
//        if (Utils.isNullOrUndefined(article)) return null
//        return <div className="article_detail pd_lr_110">
//            <div className="w-55_per">
//                <div className="detail_box">
//                    {this.renderBody(article)}
//                    <LikeBox likes={article.likes}
//                        targetId={article.id}
//                        comments={article.comments} isLiked={article.isLiked} />
//                    <Tab tabs={listTabs} className="mt-20" isKeepSelectedTab={false} onClickTab={(tabId) => this.onClickTab(tabId)}
//                        location={this.props.location} history={this.props.history} />
//                </div>
//                <div >
                    
//                    {this.state.tabId == '0' && this.renderCommentTab()}
//                    {this.state.tabId == '1' && this.renderSameAuthorArticle()}
//                    {this.state.tabId == '2' && this.renderRelateArticlesByTag()}
//                </div>
//            </div>
//        </div>
//    }
//}
//const listTabs = [
//    { name: 'Bình luận', id: "0" },
//    { name: "Cùng tác giả", id: "1" },
//    { name: "Bài viết liên quan", id: "2" }
//] as ITab[]