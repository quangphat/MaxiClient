import * as React from 'react';
import * as Models from '../../Models'
import * as Utils from '../../infrastructure/Utils'
import { NavLink } from 'react-router-dom';
import { Avatar, ArticleStatus, TagDisplay } from '..';
import * as RoutPath from '../../infrastructure/RoutePath'
interface FeedPreviewProps {
    feed: Models.ISearchModel,
    isShowStatus?: boolean
}
interface FeedPreviewStates {
    feed: Models.ISearchModel
}
export class FeedPreview extends React.Component<FeedPreviewProps, FeedPreviewStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            feed: this.props.feed
        };

    }
    static defaultProps = {
        isShowStatus: false
    }
    componentWillMount() {
       
    }
    renderBody(data) {
        
    }
    private getPreviewContent(content: string) {
        if (Utils.isNullOrWhiteSpace(content)) return ''
        if (content.length < 200) return content;
        return `${content.substring(0,200)}`
    }
    public render() {
        let { feed } = this.state,
            { isShowStatus } = this.props
        if (Utils.isNullOrUndefined(feed)) return null;
        return <div className="blog-grid-top">
                <div className="">
                <h3>
                    <NavLink to={`/article/${feed.friendlyUrl}`}>{feed.title}</NavLink>
                </h3>
                {<div className="right">
                    <span><i className="bookmark like"></i> {feed.likes} lượt thích</span>
                    <span><i className="bookmark like"></i> {feed.comments} bình luận</span>
                </div>}
            </div>
            <Avatar displayName={feed.author.displayName} profileName={feed.author.profileName}
                isShowName={true} img={feed.author.avatar} size="s32" >
                <span> on Jan 28</span>
            </Avatar>
            <TagDisplay tags={feed.tags} routePath={RoutPath.Path.article_by_tags} />

            <p>{this.getPreviewContent(feed.preview)}...</p>
            
        </div>
    }
}
