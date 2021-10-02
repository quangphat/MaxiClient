import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { MarkdownEditor, HeaderPage, RecommendedTag } from '../../components'
import { Button, CreateSVG, Input,   Loading} from '../../CoreComponents'
import * as Models from '../../Models'
import * as Enums from '../../Models/Enums'
import { messagesCode } from '../../infrastructure/messagesCode'
import { ArticleRepository } from '../../repositories/ArticleRepository'
import * as Utils from '../../infrastructure/Utils'
import * as RoutePath from '../../infrastructure/RoutePath'
import * as PropTypes from 'prop-types';
import { CategoryRepository } from '../../repositories/CategoryRepository'
interface UpdateArticleStates {
    categories: Models.ICategory[],
    article: Models.IArticle,
    isLoading: boolean
}
export class UpdateArticle extends React.Component<RouteComponentProps<any>, UpdateArticleStates> {
    ref_pwe: MarkdownEditor;
    constructor(props: any) {
        super(props);
        this.state = {
            categories: [],
            article: null,
            isLoading: true
        };

    }
    static contextTypes = {
        ShowMessage: PropTypes.func
    }
    componentWillMount() {
        //this.getCategories()
    }
    componentDidMount() {
        let id = this.props.match.params.id
        this.getArticle(id)
    }
    private async getArticle(id: string) {
        let response = await ArticleRepository.GetDetail(id)
        if (response == null) {
            this.context.ShowMessage(messagesCode.error, messagesCode.invalid_data)
            this.props.history.push('/')
            return
        }
        if (response.error != null) {
            this.context.ShowMessage(messagesCode.error, response.error.code)
            this.props.history.push('/')
            return
        }
        this.setState({ article: response.data, isLoading: false })
    }
    private async onUpdateArticle() {
        let { article } = this.state
        if (article == null) return
        //if (Utils.isNullOrUndefined(article.category)) return
        article.content = this.ref_pwe.getContent()
        if (Utils.isNullOrWhiteSpace(article.title)) {
            this.context.ShowMessage(messagesCode.error, messagesCode.article_title_must_not_be_empty)
            return
        }
        if (article.title.trim().length > 70) {
            this.context.ShowMessage(messagesCode.error, messagesCode.article_title_max_length_70)
            return
        }
        if (Utils.isNullOrWhiteSpace(article.content)) {
            this.context.ShowMessage(messagesCode.error, messagesCode.article_content_must_not_be_empty)
            return
        }
        if (Utils.isArrNullOrHaveNoItem(article.tags)) {
            this.context.ShowMessage(messagesCode.error, messagesCode.article_need_min_1_tags)
            return
        }
        if (article.tags.length > 3) {
            this.context.ShowMessage(messagesCode.error, messagesCode.article_max_3_tag)
            return
        }
        article.preview = '';
        if (article.preview.length > 300)
            article.preview = article.preview.substring(0, 300);
        article.status = Enums.ArticleStatus.Pending;
        article.friendlyUrl = Utils.NonUnicode(article.friendlyUrl)
        
        let res = await ArticleRepository.UpdateArticle(article)
        if (res != null) {
            if (res.success) {
                this.context.ShowMessage("success", messagesCode.success)
                this.props.history.push("/")
            }
            else {
                this.context.ShowMessage("error", res.error.code)
            }
        }
        else {
            this.context.ShowMessage("error", messagesCode.error)
        }
    }
    public render() {
        let { article, isLoading } = this.state
        if (isLoading)
            return <Loading size="icon" />
        if (article == null)
            return null;
        return <React.Fragment>
            <HeaderPage>
                <Button type='primary' className='ml-3'
                    onClick={() => this.onUpdateArticle()} >
                    <CreateSVG size={12} svgName='#iconCheckmark' className='mr-3' />
                    <span>Lưu</span>
                </Button>
            </HeaderPage>
            <div className="pd-all-20">
            
            <div className="col-sm-12">
                    <div className="form-group">
                        <label>Tiêu đề</label>
                        <Input value={article.title}
                            onChange={(e) => this.setState({ article: { ...this.state.article, title: e.target.value } })} />
                        <label>Tags:</label>
                        <RecommendedTag onChange={(tags) => this.setState({ article: { ...this.state.article, tags: tags } })}
                            tags={article.tags}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nội dung</label>
                        <MarkdownEditor ref={ref_pwe => this.ref_pwe = ref_pwe} content={article.content} />
                    </div>
                    {/*<div className="col-sm-4">
                        <div className="form-group">
                            <label></label>
                            {!Utils.isArrNullOrHaveNoItem(categories) && <Components.CategoryTree categories={this.state.categories}
                                onSelect={(c) => this.setState({ article: { ...this.state.article, category: c } })} />}
                        </div>
                    </div>*/}
            </div>
        </div >
        </React.Fragment>
    }
}
