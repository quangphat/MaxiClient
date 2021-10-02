import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as Components from '../../components'
import * as Models from '../../Models'
import * as Markdown from 'react-markdown';
import * as Utils from '../../infrastructure/Utils'
import * as PropTypes from 'prop-types';
import './index.css'
import { ArticleRepository } from '../../repositories/ArticleRepository'
interface TermStates {
    
}
export class Term extends React.Component<RouteComponentProps<any>, TermStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            
        };

    }
    componentWillMount() {
        this.getArticle()
    }
    private getArticle() {
        //let { paging, articles } = this.state
        //ArticleRepository.Search(null, null, null, paging.page, paging.limit).then(response => {
        //    if (response != null && response.data != null) {
        //        paging.totalRecord = response.data.totalRecord
        //        paging.hasMore = paging.page * paging.limit >= paging.totalRecord ? false : true
        //        if (articles == null)
        //            articles = [];
        //        if (Utils.isArrNullOrHaveNoItem(response.data.datas))
        //            return
        //        articles = articles.concat(response.data.datas)
        //        this.setState({ articles: articles, paging: paging })
        //    }
        //})
    }
    private renderTermList() {
        return <ul className="pd-0">
            {Terms.map(item => {
                return <li className="" key={item.id}>{item.display}</li>
            })}
        </ul>
    }
    private renderTermContent() {
        let content = 'hôm nay tôi buồn'
        return <div>
            <Markdown source={content} escapeHtml={false}
                className="pd-10"
                renderers={{ code: Components.CodeBlock }}
                skipHtml={false} />
        </div>
    }
    public render() {
        return <div className="home pd_lr_110">
            <div className="flex">
                <div className="terms bg-white w-400">
                    {this.renderTermList()}
                </div>
                <div className="ml-5 bg-white w-100">
                    {this.renderTermContent()}
                </div>
            </div>
            
        </div>
    }
}
const Terms = [
    { id: '0', display: 'Dịch vụ' },
    { id: '1', display: 'Cách chúng tôi cung cấp dịch vụ' },
] as Models.IOptionSimple[]
