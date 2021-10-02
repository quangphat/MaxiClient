import * as React from 'react';
import debounce from 'lodash/debounce';
import * as PropTypes from 'prop-types';
import * as Utils from '../../infrastructure/Utils';
import { Popover, Loading, Button, CreateSVG, Input } from '../../CoreComponents'
import { IOptionSimple, IPaging } from '../../Models'
import { JobFunctionRepository } from '../../repositories/JobFunctionRepository'
interface ISelectionJobFunctionProps {
    messeageError?: string
    limit?: number,
    onClose?: Function,
    onClickItem?: Function,
    handleClickPrevPage?: Function,
    maxAllowSelected?: number,
    handleClickNextPage?: Function,
    selectedValues?: any[],
    handleOnChange?: Function
}

interface ISelectionJobFunctionStates {
    datas: IOptionSimple[],
    selected: IOptionSimple[],
    isLoading: boolean,
    isOpen: boolean,
    hasNext: boolean,
    hasPrev: boolean,
    paging: IPaging
}

export class SelectionJobFunction extends React.Component<ISelectionJobFunctionProps, ISelectionJobFunctionStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            datas: [],
            isLoading: false,
            isOpen: false,
            hasNext: false,
            hasPrev: false,
            selected: this.props.selectedValues || [],
            paging: { page: 1, limit: this.props.limit || 10, totalRecord: 0, hasMore: false, query: '' } as IPaging
        }

        this.handleDebounceOnChange = debounce(this.handleDebounceOnChange, 500);
    }


    static contextTypes = {
        ShowMessage: PropTypes.func
    }
    static defaultProps = {
        maxAllowSelected: 0
    }
    ref_popover = null as Popover

    componentWillReceiveProps(newProps) {
        // if (this.props.limit != newProps.limit) {
        //     this.setState({ limit: newProps.limit })
        // }
    }

    componentWillUnmount(this) {
        this.handleDebounceOnChange.cancel()
    }

    componentDidMount() {
        this.getJobFunction()
    }
    private async getJobFunction() {
        let { paging, datas, hasPrev, hasNext } = this.state
        let response = await JobFunctionRepository.Search(paging.query, paging.page, paging.limit)
        if (response == null || response.error)
            return
        if (datas == null)
            datas = []
        datas = response.data.datas
        paging.totalRecord = response.data.totalRecord
        hasPrev = paging.page > 1 ? true : false
        hasNext = paging.page * paging.limit < paging.totalRecord ? true : false
        this.setState({ datas: datas, paging, isLoading: false, hasNext: hasNext, hasPrev: hasPrev })
    }
    handleOnFocus() {
        this.setState({
            isOpen: true
        })
    }
    handleOnBlur() {
        this.setState({
            isOpen: false,
            isLoading: false
        })
    }
    handleDebounceOnChange(paging: IPaging) {
        this.getJobFunction()
    }

    handleOnChange(e) {
        let { paging } = this.state,
            self = this,
            valueInput = e.target.value;
        paging.query = valueInput
        this.setState({
            isOpen: true,
            isLoading: true,
            paging: paging
        }, () => {
            self.handleDebounceOnChange(paging)
        })
    }

    public handleClosePopover() {
        this.setState({
            isOpen: false,
            isLoading: false
        })
    }
    private handleClickPrevPage() {
        let { paging } = this.state
        paging.page -= 1;
        this.setState({ paging: paging }, () => this.getJobFunction())
    }
    private handleClickNextPage() {
        let { paging } = this.state
        paging.page += 1;
        this.setState({ paging: paging }, () => this.getJobFunction())
    }
    private onClickItem(item: IOptionSimple) {
        let { selected, datas } = this.state,
            { maxAllowSelected } = this.props
        let index = selected.findIndex(p => p.id == item.id)
        if (maxAllowSelected != 0) {
            if (index < 0 && selected.length < this.props.maxAllowSelected)
                selected.push(item)
        }
        else {
            selected.push(item)
        }
        this.setState({ isOpen: false, selected: selected }, () => {
            if (this.props.onClickItem)
                this.props.onClickItem(item)
        })
    }
    private onRemove(item: IOptionSimple) {
        let { selected } = this.state
        selected = selected.filter(p => p.id != item.id)
        this.setState({ selected: selected })
    }
    renderLoading() {
        return <Loading className='hrv-loading-page' size='icon' />
    }
    private renderSelectedDatas() {
        let { selected } = this.state
        if (Utils.isArrNullOrHaveNoItem(selected))
            return null
        return <div className="table-choose-collections">
            <ul data-bind="foreach: selectedItems" className="list-divided-border mt-2">
                {selected.map(item => {
                    return <li className="p-5 border-bottom" key={item.id}>
                        <div className="row">
                            <div className="">
                                <span data-bind="text:Value">{item.display}</span>
                            </div>
                            <div className="col-auto text-right">

                                <Button className='link-no-pding' isDisabled={false}
                                    type='link-no-pding' onClick={() => this.onRemove(item)}>
                                    <CreateSVG svgName="icontimes" size={12}/>
                                    
                                </Button>

                            </div>
                        </div>
                    </li>
                })}
            </ul>
        </div>
    }
    renderContent() {
        let { datas } = this.state
        let selectedValues = this.props.selectedValues
        if (selectedValues == null) selectedValues = []
        return (datas != null && datas.length > 0) ? <div className='next-token-list__wrapper' >
            <div className='next-token-list'>
                {
                    datas.map((item, index) => {
                        if (Utils.isNullOrWhiteSpace(item.display))
                            return null
                        let isSelected = selectedValues.findIndex(p => p.id == item.id) > -1 ? 'next-token--is-disabled' : ''
                        return <Button key={item.id} type="clean"
                            className={`color-blue combobox-collection--item cursor-pointer ${isSelected}`}
                            onClick={() => this.onClickItem(item)}>
                            <div className="row">
                                <div className="col-auto w-12px">
                                    {
                                        isSelected && <CreateSVG svgName="iconCheckmark" size={12}></CreateSVG>
                                    }
                                </div>
                                <div className="col">
                                    <p className="m-0">
                                        {item.display}
                                    </p>
                                </div>
                            </div>
                        </Button>
                    })
                }
            </div>
        </div> : <div className="text-center p-3">
                <CreateSVG svgName="iconSearch" size={20}></CreateSVG>
                <p className="font-weight-bold text-primary text-center my-3">Không tìm thấy dữ liệu</p>
            </div>

    }
    renderBody() {
        return this.state.isLoading ? this.renderLoading() : this.renderContent()
    }

    renderFooter() {
        return <div className='border-top text-right p-3'>
            <div className='btn-group'>
                <Button type='default' onClick={() => this.handleClickPrevPage()}
                    isDisabled={!this.state.hasPrev}>
                    <CreateSVG size={14} rotate={180} svgName='iconArrow' />
                </Button>
                <Button type='default' className="ml-5" onClick={() => this.handleClickNextPage()}
                    isDisabled={!this.state.hasNext}
                >
                    <CreateSVG size={14} svgName='iconArrow' />
                </Button>
            </div>
        </div>
    }

    public render() {
        let { isOpen, paging, selected } = this.state,
            { maxAllowSelected } = this.props
        return <div>
            {(maxAllowSelected == 0 || (selected.length < maxAllowSelected)) && <Input value={paging.query} placeholder='Tìm kiếm'
                prefix={<CreateSVG size={18} svgName='iconSearch' />}
                onChange={(e) => this.handleOnChange(e)}
                onFocus={() => this.handleOnFocus()}
            />}
            {
                this.state.isOpen && <Popover
                    ref={component => this.ref_popover = component}
                    isOpen={isOpen}
                    isBackdrop={true}
                    renderBody={this.renderBody()}
                    renderFooter={this.renderFooter()}
                    handleClosePopover={() => this.handleClosePopover()}>
                </Popover>
            }
            {this.renderSelectedDatas()}
        </div>

    }
}

interface IPages {
    currentPage: number,
    limit: number,
    totalPage: number
}