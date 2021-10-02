import * as React from 'react';
import * as H from 'history';
import * as classnames from 'classnames';
import { InputCheckbox } from '../InputCheckbox'
import { Paginate } from '../Paginate/Paginate'
import { CreateSVG } from '../CreateSVG/CreateSVG'
import './index.css';

export declare type TableType = 'table-list' | 'table-normal';

interface ITableListProps {
    type?: TableType,
    location: H.Location,
    className?: string,
    dataTableHeader?: IDataTableHeader[],
    renderTableBody?: Function,
    renderTableFooter?: Function,
    showBulkActions?: boolean,
    renderBulkActions?: Function,
    handleCheckAllList?: Function,
    triggerSortTable?: Function,
    listData: Object[],
    pathName: string,
    hasPagination?: boolean,
    totalRecord: number,
    marginPagination?: number,
    listPagination?: string[],
    contentEmpty?: any,
    isCheckAll?: boolean
}

interface ITableListStates {
    showBulkActions: boolean,
    listData: Object[]
}

export class TableList extends React.Component<ITableListProps, ITableListStates> {
    constructor(props: any) {
        super(props)

        this.state = {
            listData: this.props.listData || [],
            showBulkActions: this.props.showBulkActions || false
        }
    }

    static defaultProps = {
        type: 'table-normal',
        hasPagination: true
    }

    componentWillReceiveProps(newProps) {
        if (this.props.listData != newProps.listData || this.props.showBulkActions != newProps.showBulkActions) {
            this.setState({
                listData: newProps.listData,
                showBulkActions: newProps.showBulkActions
            })
        }
    }

    handleCheckAllList(checked) {
        this.setState({
            showBulkActions: checked
        }, () => {
            if (this.props.handleCheckAllList) {
                this.props.handleCheckAllList(checked)
            }
        })
    }

    handleTriggerSort(item: IDataTableHeader) {
        if (item.sortFieldName && this.props.triggerSortTable)
            this.props.triggerSortTable(item)
    }

    handleCheckSortField(sortName) {
        if (this.props.location == null) return
        //let param = this.props.location.search,
        //    paging = PagingHelpers.parsePaging(param)

        //if (paging.order == sortName) {
        //    if (paging.direction == Enum.SortDirection.asc.toString()) {
        //        return <LibComponents.CreateSVG className='ml-3' size={10} rotate={-90} linkHref='#next-icon-arrow' />
        //    } else if (paging.direction == Enum.SortDirection.desc.toString()) {
        //        return <LibComponents.CreateSVG className='ml-3' size={10} rotate={90} linkHref='#next-icon-arrow' />
        //    }
        //}

        return null
    }

    renderTableHeader() {
        let { dataTableHeader, renderBulkActions, isCheckAll } = this.props,
            { showBulkActions } = this.state
        return <thead>
            <tr>
                {(dataTableHeader && dataTableHeader.length > 0) && dataTableHeader.map((item, index) => {
                    const key = 'product-list-head' + index
                    if (item.hasCheckAll)
                        return <th key={key} className={'has-bulk-actions ' + (item.classes ? item.classes : '')} colSpan={item.colSpan}>
                            <InputCheckbox nameInput='check-all' className='z-index-20'
                                onChange={null} isChecked={isCheckAll} />
                            {showBulkActions && renderBulkActions()}
                        </th>

                    return <th key={key} className={item.classes} colSpan={item.colSpan} onClick={() => this.handleTriggerSort(item)}>
                        <span>{item.title}</span>
                        {this.handleCheckSortField(item.sortFieldName)}
                    </th>
                })}
            </tr>
        </thead>
    }
    private renderEmpty()
    {
        return <div className='wrapper-content'>
       <div className='row no-gutters align-items-center justify-content-center min-height-200px'>
                <div className='col flex-column text-center'>
                    <CreateSVG className='mb-5 color-heather' size={80} svgName='#iconSearch' />
                    <div className='text-center font-size-20px mb-3'>Không tìm thấy dữ liệu</div>
                    <div className='text-center text-secondary'>Hãy thay đổi bộ lọc hoặc điều kiện tìm kiếm</div>
                </div>
            </div>
    </div>
    }

    public render() {
        const { type, className, location, renderTableBody, pathName,
            hasPagination, totalRecord, marginPagination, listPagination } = this.props,
            { listData } = this.state

        let classes = classnames({
            'ui-table-listing-container': type == 'table-list',
            'ui-table-normal-container': type == 'table-normal'
        })

        return <div className={className}>
            {(listData && listData.length > 0)
                ? <div>
                    <div className={classes}>
                        <table className='ui-table'>
                            {this.renderTableHeader()}
                            {renderTableBody && <tbody>{renderTableBody(listData)}</tbody>}
                        </table>
                    </div>
                    {hasPagination && <Paginate apiPath={pathName} location={location}
                        totalRecord={totalRecord} margin={marginPagination} listPagesize={listPagination} />}
                </div>
                :this.renderEmpty()}
        </div>
    }
}

interface IDataTableHeader {
    hasCheckAll?: boolean,
    title: string,
    classes?: string,
    typeSort?: string,
    sortFieldName?: string,
    sortType?: string,
    colSpan?: number
}