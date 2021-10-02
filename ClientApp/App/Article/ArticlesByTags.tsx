//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import { IArticleMeta } from '../../Models/IArticleMeta'
//import * as Components from '../../components'
//import * as Models from '../../Models'
//import { ArticleRepository } from '../../repositories/ArticleRepository'
//import * as PagingHelpers from '../../infrastructure/PagingHelpers'
//import * as Utils from '../../infrastructure/Utils'
//import { NavLink } from 'react-router-dom';
//interface ArticlesByTagsStates {
//    articles: Models.IArticle[],
//    paging: Models.IPaging
//}
//export class ArticlesByTags extends React.Component<RouteComponentProps<any>, ArticlesByTagsStates> {
//    constructor(props: any) {
//        super(props);
//        this.state = {
//            articles: [],
//            paging: { page: 1, limit: 10, totalRecord: 0, hasMore: false } as Models.IPaging,
//        };

//    }
//    componentWillMount() {
//        let pagingUrl = null
//        if (this.props.location.search != '') {
//            pagingUrl = this.getUrlPaging(this.props.location.search)
//            this.getArticles(pagingUrl.tags)
//        }
//    }
//    componentWillReceiveProps(newProps) {
//        const newParam = `${newProps.location.search}${newProps.location.hash ? newProps.location.hash : ''}`
//        const oldParam = this.props.location.search

//        if (newParam != oldParam) {
//            let pagingUrl = this.getUrlPaging(newParam)
//            let { paging } = this.state
//            paging.page = pagingUrl.page;
//            paging.limit = pagingUrl.limit
//            this.setState({ paging: paging }, () => {
//                this.getArticles(pagingUrl.tags)
//            })

//        }
//    }
//    private getUrlPaging(params: string) {
//        let paging = PagingHelpers.parsePaging(params);
//        return paging
//    }
//    private getArticles(tags: string) {
//        let { paging, articles } = this.state
//        ArticleRepository.GetArticlesByTags(tags, paging.page, paging.limit).then(res => {
//            if (res.data != null) {
//                if (articles == null)
//                    articles = []
//                articles = res.data.datas
//                paging.totalRecord = res.data.totalRecord
//                this.setState({ articles: res.data.datas, paging: paging })
//            }
//        })
//    }


//    public render() {
//        let { articles } = this.state
//        if (Utils.isArrNullOrHaveNoItem(articles))
//            return null
//        return <div className="pd_lr_110">
//            <div className="article_list">
//                {articles.map(item => {
//                    return <Components.JobItem article={item} key={item.id} />
//                })}
//            </div>
//        </div>
//    }
//}
