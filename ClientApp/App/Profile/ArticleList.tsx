//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import { HubConnection } from '@aspnet/signalr';
//import './index.css';
//import { PersonRepository } from '../../repositories/PersonRepository'
//import * as Utils from '../../infrastructure/Utils';
//import * as Models from '../../Models';
//import * as Components from '../../components'
//import { ArticleRepository } from '../../repositories/ArticleRepository'

//interface IArticleListProps {
//    isShow?: boolean,
//    isShowArticleStatus: boolean,
//    person: Models.IAuthor
//}
//interface IArticleListStates {
//    isShow?: boolean,
//    articles: Models.IArticle[],
//    paging: Models.IPaging
//}
//export class ArticleList extends React.Component<IArticleListProps, IArticleListStates> {
//    constructor(props) {
//        super(props);
        
//        this.state = {
//            articles: [],
//            paging: { page: 1, limit: 10, totalRecord: 0, hasMore: false } as Models.IPaging,
//            isShow: this.props.isShow
//        };
//    }
//    static defaultProps = {
//        isShow: true
//    }
//    componentWillMount() {
//        this.getArticle()
//    }
//    componentWillReceiveProps(newProps: IArticleListProps) {
//        if (this.props.isShow != newProps.isShow) {
//            this.setState({ isShow: newProps.isShow })
//        }
//    }
//    private getArticle() {
//        let { paging, articles } = this.state
//        ArticleRepository.GetArticlesByAuthor(this.props.person.id,  paging.page, paging.limit).then(response => {
//            if (response != null && response.data != null) {
//                paging.totalRecord = response.data.totalRecord
//                paging.hasMore = paging.page * paging.limit >= paging.totalRecord ? false : true
//                if (articles == null)
//                    articles = [];
//                if (Utils.isArrNullOrHaveNoItem(response.data.datas))
//                    return
//                articles = articles.concat(response.data.datas)
//                this.setState({ articles: articles, paging: paging })
//            }
//        })
//    }
//    private onGetMoreArticle() {
//        let { paging } = this.state
//        paging.page += 1;
//        this.setState({ paging: paging }, () => this.getArticle());
//    }
//    private renderArticles() {
//        let { articles } = this.state
//        if (Utils.isArrNullOrHaveNoItem(articles)) return null
//        return <div className="text-left">{articles.map(item => {
//            return <Components.JobItem key={item.id} article={item} isShowStatus={this.props.isShowArticleStatus} />
//        })}
//        </div>
//    }
//    public render() {
//        let { isShow } = this.state
//        if (!isShow)
//            return null
//        return <React.Fragment>
//            <Components.ScrollBottom onBottom={() => this.onGetMoreArticle()} />
//            {this.renderArticles()}
//        </React.Fragment>
//    }
//}