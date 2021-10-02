import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { HubConnection } from '@aspnet/signalr';
//import './index.css';
import * as Utils from '../../infrastructure/Utils';
import { ISearchModel, IPaging } from '../../Models';
import * as Components from '../../components'
import { GlobalRepository } from '../../repositories/GlobalRepository'
import * as PagingHelpers from '../../infrastructure/PagingHelpers'
interface ISearchResultStates {
    datas: ISearchModel[],
    paging: IPaging
}
export class SearchResult extends React.Component<RouteComponentProps<any>, ISearchResultStates> {
    constructor(props) {
        super(props);

        this.state = {
            datas: [],
            paging: { page: 1, limit: 10, totalRecord: 0, hasMore: false } as IPaging,
        };
    }
    static defaultProps = {
    }
    componentWillMount() {
        let pagingUrl = null
        if (this.props.location.search != '') {
            let urlPaging = PagingHelpers.parsePaging(this.props.location.search);
            let { paging } = this.state
            paging.query = urlPaging.query
            this.setState({ paging: paging }, () => this.getFeed())
           
        }
    }
    componentWillReceiveProps(newProps) {
        const newParam = `${newProps.location.search}${newProps.location.hash ? newProps.location.hash : ''}`
        const oldParam = this.props.location.search

        if (newParam != oldParam) {
            let pagingUrl = PagingHelpers.parsePaging(newParam);
            let { paging } = this.state
            paging.page = pagingUrl.page;
            paging.limit = pagingUrl.limit
            paging.query = pagingUrl.query
            this.setState({ paging: paging }, () => {
                this.getFeed()
            })

        }
    }
    private getFeed() {
        let { paging, datas } = this.state
        GlobalRepository.Search(paging.query, paging.page, paging.limit).then(response => {
            if (response != null && response.data != null) {
                paging.totalRecord = response.data.totalRecord
                paging.hasMore = paging.page * paging.limit >= paging.totalRecord ? false : true
                if (datas == null)
                    datas = [];
                if (Utils.isArrNullOrHaveNoItem(response.data.datas))
                    return
                datas = datas.concat(response.data.datas)
                this.setState({ datas: datas, paging: paging })
            }
        })
    }
    private onGetMoreArticle() {
        let { paging } = this.state
        paging.page += 1;
        this.setState({ paging: paging }, () => this.getFeed());
    }
    private renderArticles() {
        let { datas } = this.state
        if (Utils.isArrNullOrHaveNoItem(datas)) return null
        return <div className="text-left">{datas.map(item => {
            return <Components.FeedPreview key={item.id} feed={item} />
        })}
        </div>
    }
    public render() {
        return <React.Fragment>
            <Components.ScrollBottom onBottom={() => this.onGetMoreArticle()} />
            {this.renderArticles()}
        </React.Fragment>
    }
}