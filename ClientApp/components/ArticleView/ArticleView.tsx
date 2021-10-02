import * as React from 'react'
import { IArticle } from '../../Models/IArticle'
import { HtmlParser } from '../HtmlParser/HtmlParser';
import * as Markdown from 'react-markdown';
import { CodeBlock } from '../CodeBlock/CodeBlock'
import { TagDisplay } from '../TagDisplay/TagDisplay'
import { Avatar } from '../Avatar/Avatar'
import './index.css'
interface ArticleViewProps {
    article: IArticle
}
interface ArticleViewStates {
    article: IArticle
}
export class ArticleView extends React.Component<ArticleViewProps, ArticleViewStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            article: this.props.article
        }
    }
    componentWillReceiveProps(newProps: ArticleViewProps) {
        if (this.props.article.id != newProps.article.id) {
            this.setState({ article: newProps.article })
        }
    }
    render() {
        let { article } = this.state
        return <div className="article">
            <label className='title mb-10'>{article.title}</label>
            <TagDisplay tags={article.tags} className="mb-10" />
            <Avatar displayName={article.author.displayName} profileName={article.author.profileName} isShowName={true} img={article.author.avatar} size="s32" >
                <span className="ml-5"> on Jan 28</span>
            </Avatar>
            <div className="form-group">
                <Markdown source={article.content} escapeHtml={false}
                    renderers={{ code: CodeBlock }}
                    skipHtml={false} />
            </div>
        </div>
    }
}