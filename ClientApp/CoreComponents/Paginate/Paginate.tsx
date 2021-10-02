import * as React from 'react';
import * as H from 'history';
import { NavLink } from 'react-router-dom';
import * as PagingHelpers from '../../infrastructure/PagingHelpers';
import * as Utils from '../../infrastructure/Utils';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import { CreateSVG } from '../CreateSVG/CreateSVG'
import { Button } from '../Button/Button'
import './index.css';

interface IPaginateProps {
    apiPath: string,
    location: H.Location,
    className?: string,
    totalRecord: number,
    margin?: number,
    pageSize?: number,
    listPagesize?: string[],
    screenType?: string
}

interface IPaginateStates {
    page: number,
    limit: number,
    totalRecord: number,
    totalPage: number,
}

export class Paginate extends React.Component<IPaginateProps, IPaginateStates> {
    constructor(props: any) {
        super(props)

        this.state = {
            page: 1,
            limit: this.props.pageSize || 20,
            totalPage: 1,
            totalRecord: this.props.totalRecord
        }
    }

    static defaultProps = {
        totalRecord: 0,
        margin: 2,
        pageSize: 20,
        listPagesize: ['10', '20', '50']
    }

    componentDidMount() {
        this.processPaginate()
    }

    componentWillReceiveProps(newProps) {
        let newParam = newProps.location.search
        let oldParam = this.props.location.search

        if (this.state.totalRecord != newProps.totalRecord || newParam != oldParam) {
            this.setState({
                totalRecord: newProps.totalRecord
            }, () => {
                this.processPaginate()
            })
        }
    }

    processPaginate() {
        let { totalRecord, page, limit } = this.state
        let param = this.props.location.search
        if (param != '') {
            let paging = PagingHelpers.parsePaging(param)
            page = paging.page || page
            limit = paging.limit || limit
        }

        this.setState({
            totalPage: this.getTotalPage(totalRecord, limit),
            page: page || 1,
            limit: limit || 20
        })
    }


    getSearchPath(apiPath, page, limit) {
        let path = '',
            param = this.props.location.search,
            paging = PagingHelpers.parsePaging(param)

        paging.page = page
        paging.limit = limit
        let query = encodeURIComponent(paging.query);
        paging.query = query;
        let searchPath = Utils.joinObject(paging);
        if (searchPath != '')
            return path = apiPath + '?' + searchPath
        return apiPath
    }

    getParams(path) {
        let objURL = {}
        if (path) {
            let params = path.substring(1).split('&')
            for (var i = 0; i <= params.length - 1; i++) {
                let param = params[i].split('=')
                objURL[param[0]] = param[1]
            }
        }
        return objURL
    }

    getTotalPage(totalRecord, limit) {
        return totalRecord > limit ? Math.ceil(totalRecord / limit) : 1
    }

    renderGoFirstPage() {
        let { page, totalPage, limit } = this.state,
            { apiPath } = this.props,
            path = this.getSearchPath(apiPath, '1', limit)

        if (totalPage > 1 && page > 1) {
            return <li className="page-item hidden-mobile page-arrow">
                <NavLink to={path} className="page-link" aria-label="Go First Page">
                    <span aria-hidden="true">
                        <CreateSVG size={10}  rotate={180} svgName='double_next_icon' />
                    </span>
                </NavLink>
            </li>
        } else {
            return null
        }
    }

    renderGoLastPage() {
        let { page, totalPage, limit } = this.state,
            { apiPath } = this.props,
            path = this.getSearchPath(apiPath, totalPage, limit)

        if (totalPage > page) {
            return <li className="page-item hidden-mobile page-arrow">
                <NavLink to={path} className="page-link" aria-label="Go Last Page">
                    <span aria-hidden="true">
                        <CreateSVG size={10} svgName='double_next_icon' />
                    </span>
                </NavLink>
            </li>
        } else {
            return null
        }
    }

    renderGoPreviousPage() {
        let { page, limit } = this.state
        let { apiPath } = this.props
        let newCurrentPage = page
        if (page > 1) {
            newCurrentPage = page - 1
            let path = this.getSearchPath(apiPath, newCurrentPage, limit)

            return <li className="page-item page-arrow">
                <NavLink to={path} className="page-link" aria-label="Previous">
                    <span aria-hidden="true">
                        <CreateSVG size={10} rotate={180} svgName='#iconArrow' />
                    </span>
                </NavLink>
            </li>
        } else {
            return null
        }
    }

    renderGoNextPage() {
        let { page, limit, totalPage } = this.state,
            { apiPath } = this.props,
            newCurrentPage = page;

        if (page < totalPage) {
            newCurrentPage = page + 1
            let path = this.getSearchPath(apiPath, newCurrentPage, limit)

            return <li className="page-item page-arrow">
                <NavLink to={path} className="page-link" aria-label="Next">
                    <span aria-hidden="true">
                        <CreateSVG size={10} svgName='#iconArrow' />
                    </span>
                </NavLink>
            </li>
        } else {
            return null
        }
    }

    renderNumberPage() {
        let { page, totalPage, limit } = this.state,
            { margin, apiPath } = this.props

        let startPage = page > margin ? page - margin : 1,
            endPage = margin + page > totalPage ? totalPage : margin + page,
            pages = []

        for (let i = startPage; i <= endPage; i++) {
            let path = this.getSearchPath(apiPath, i, limit);
            pages.push(<li key={'pagination-' + i} className={'page-item hidden-mobile ' + (page == i ? 'active' : '')}>
                {page == i
                    ? <div className="page-link">{i}</div>
                    : <NavLink to={path} className="page-link">{i}</NavLink>}
            </li>
            )
        }
        return pages;
    }

    ref_dropdownMenu: DropdownMenu | null = null

    renderSelectPageSize() {
        let { apiPath, listPagesize } = this.props
        return <DropdownMenu
            ref={component => this.ref_dropdownMenu = component}
            iconArrow='left'
            renderItems={
                <ul className='ui-action-list'>
                    {(listPagesize && listPagesize.length > 0)
                        ? listPagesize.map((item, index) => {
                            let path = this.getSearchPath(apiPath, '1', item),
                                key = apiPath + '-paginate-' + index

                            return <li key={key} className='ui-action-list__item'>
                                <NavLink to={path} className='ui-action-list-action' onClick={() => this.ref_dropdownMenu.handleClick()}>Hiển thị {item}</NavLink>
                            </li>
                        })
                        : null
                    }
                </ul>
            }
        >
            <Button type='default'>
                <span className='pr-3'>Hiển thị {this.state.limit}</span>
                <CreateSVG size={12} rotate={90} svgName='#iconArrow' />
            </Button>
        </DropdownMenu>
    }

    public render() {
        return <div className={this.props.className}>
            <div className='no-gutters justify-content-between paginate'>
                <div className='col-auto' style={{"float":"left"}}>
                    {this.renderSelectPageSize()}
                </div>
                <div className='col-auto'style={{"float":"right"}}>
                    <div className='row no-gutters align-items-center'>
                        <div className='col-auto mr-3'><b>{this.state.totalRecord} items</b></div>
                        <div className='col'>
                            <ul className="pagination pagination-sm no-margin pull-right">
                                {this.renderGoFirstPage()}
                                {this.renderGoPreviousPage()}
                                {this.renderNumberPage()}
                                {this.renderGoNextPage()}
                                {this.renderGoLastPage()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    }
}