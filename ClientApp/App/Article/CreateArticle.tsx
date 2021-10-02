import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { IArticleMeta } from '../../Models/IArticleMeta'
import { MarkdownEditor, HeaderPage, RecommendedTag, CkEditor } from '../../components'
import {  Button, CreateSVG, Input, InputCheckbox, SelectionV2 } from '../../CoreComponents'
import * as Models from '../../Models'
import * as Enums from '../../Models/Enums'
import { messagesCode } from '../../infrastructure/messagesCode'
import { ArticleRepository } from '../../repositories/ArticleRepository'
import * as Utils from '../../infrastructure/Utils'
import * as PropTypes from 'prop-types';
import './index.css'
import * as RoutePath from '../../infrastructure/RoutePath'
import debounce from 'lodash/debounce';

enum screenStatus {
    onCreate = 1,
    onDraft = 2
}
interface CreateArticleStates {
    article: Models.IArticle,
    articleSeries: Models.IArticle[]
}
export class CreateArticle extends React.Component<RouteComponentProps<any>, CreateArticleStates> {
    ref_pwe: MarkdownEditor;
    articleId: string = null;
    constructor(props: any) {
        super(props);
        let model = new Object as Models.IArticle
        model.tags = []
        this.state = {
            article: model,

            articleSeries: []
        };
        this.onAutoSaveDraftDebounce = debounce(this.onAutoSaveDraftDebounce, 2000);
    }
    static contextTypes = {
        ShowMessage: PropTypes.func
    }
    componentWillUnmount(this) {
        this.onAutoSaveDraftDebounce.cancel()

    }
    componentWillMount() {
        //this.getCategories()
    }
    async componentDidMount() {
        this.articleId = this.props.match.params.id
        if (Utils.isNullOrWhiteSpace(this.articleId))
            await this.onGetDraftId()
        else {
            this.getArticleDraft(this.articleId)
        }
    }
    private async onGetDraftId() {
        let response = await ArticleRepository.CreateArticleDraft();
        if (response == null) {
            this.context.ShowMessage("error", "error");
            return
        }
        if (response.error != null) {
            this.context.ShowMessage("error", response.error.code);
            return
        }
        this.articleId = response.data
        this.props.history.push(RoutePath.Path.article_draft(response.data))
    }
    private getArticleDraft(id: string) {
        ArticleRepository.GetDraftById(id).then(response => {
            if (response == null || response.error) {
                this.context.ShowMessage("error", response.error.code)
                return
            }
            else {
                this.setState({ article: response.data })
            }
        })
    }
    private async handleAutoSave() {
        if (Utils.isNullOrWhiteSpace(this.articleId)) return
        this.onAutoSaveDraftDebounce()
    }
    private async onAutoSaveDraftDebounce() {
        let { article } = this.state
        if (article == null) return
        article.id = this.articleId
        article.content = this.ref_pwe.getContent()
        if (Utils.isNullOrWhiteSpace(article.content))
            return;
        let res = await ArticleRepository.SaveArticleDraft(article)
        if (res != null) {
            if (res.success) {
                this.context.ShowMessage("success", messagesCode.auto_save_success)

            }
            else {
                this.context.ShowMessage("error", res.error.code)
            }
        }
        else {
            this.context.ShowMessage("error", messagesCode.error)
        }
    }
    private async onCreateArticle() {
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
        article.id = this.articleId
        let res = await ArticleRepository.CreateArticle(article)
        if (res != null) {
            if (res.success) {
                this.context.ShowMessage("success", messagesCode.success)
                this.props.history.push(RoutePath.Path.article_detail(res.data))
            }
            else {
                this.context.ShowMessage("error", res.error.code)
            }
        }
        else {
            this.context.ShowMessage("error", messagesCode.error)
        }
    }
    private async onGetSeries() {
        let { articleSeries } = this.state
        if (!Utils.isArrNullOrHaveNoItem(articleSeries)) return
        let response = await ArticleRepository.GetSeriesByAuthor(null, Utils.getAuthor().id, 1, 10);
        if (response == null) {
            this.context.ShowMessage("error", "error")
            return
        }
        if (response.error != null) {
            this.context.ShowMessage("error", response.error.code)
            return
        }

        if (articleSeries == null)
            articleSeries = []
        articleSeries = articleSeries.concat(response.data.datas)
        this.setState({ articleSeries })
    }
    private onCheckIsSerie(e) {
        let { article } = this.state
        this.setState({ article: { ...article, isSerie: !article.isSerie } },
            async () => {
                if (this.state.article.isSerie)
                    await this.onGetSeries()
            })
    }
    public render() {
        let { article } = this.state
        if (Utils.isNullOrUndefined(article))
            return null
        return <div className="article_create pd-20">

            <HeaderPage>
                <Button type='primary' className='ml-3'
                    onClick={() => this.onCreateArticle()} >
                    <CreateSVG size={12} svgName='#iconCheckmark' className='mr-3' />
                    <span>Lưu</span>
                </Button>
            </HeaderPage>
            <div className="">
                <div className="mg-b-20">
                    <label className="label-input-groups">Tiêu đề</label>
                    <Input value={article.title}
                        onChange={(e) => this.setState({ article: { ...this.state.article, title: e.target.value } })} />
                </div>
                <div className="mg-b-20">
                    <label className="label-input-groups">Tags:</label>
                    {<RecommendedTag tags={article.tags}
                        onChange={(tags) => this.setState({ article: { ...this.state.article, tags: tags } })} />}
                </div>
                {/*<MarkdownEditor ref={ref_pwe => this.ref_pwe = ref_pwe} content={article.content} onChange={() => this.handleAutoSave()} />*/}
                <CkEditor data={null} onChange={null} />
                <div className="">
                    <InputCheckbox nameInput='isSerie' content="Bài viết này có nhiều phần"
                        onChange={(e) => this.onCheckIsSerie(e)} />

                    {article.isSerie &&
                        <SelectionV2 dataId='id' dataLabel='display'
                            className='form-control'
                            selectedId={article.lastPartId}
                            onClickItem={(item) => this.setState({ article: { ...article, lastPartId: item } })}
                            returnType="ID"
                            defaultItem={{ id: '0', display: 'Đây là phần đầu tiên' }}
                            datas={this.state.articleSeries}

                        />}
                </div>

            </div >

        </div>
    }
}
