import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classnames from 'classnames';
import * as LibComponents from '../../components';
import * as Utils from '../../infrastructure/Utils';
import {  Input, CreateSVG, Loading } from '../../CoreComponents'
import './index.css';

export declare type ISelectionType = 'InputSearch' | 'Select'

interface ISelectionProps {
    keyControl?: string,
    type?: ISelectionType,
    placeholder?: string,
    getData?: Function,
    dataId: string,
    dataLabel: string,
    value?: any,
    data?: any, // edit listData
    className?: string,
    handleOnClickItem?: Function
    isInputSelect?: boolean
    handleOnChangeInput?: Function,
    handleOnFocusInput?: Function,
    handleOpenDropdown?: Function,
    renderData?: Function,
    hasAddNew?: boolean,
    renderAddNew?: any,
    selectedValues?: any,
    defaultItem?: any,
    isBackdrop?: any
}

interface ISelectionStates {
    initedData: boolean,
    isLoading: boolean,
    isOpenDropdown: boolean,
    value?: any,
    isValueNew?: boolean,
    listData: any,
    listSuggest: any,
    dropUp: boolean,
    isBackdrop: boolean
}

export class Selection extends React.Component<ISelectionProps, ISelectionStates> {
    ref_selectionComponent: HTMLDivElement;
    ref_select_control: HTMLDivElement;
    ref_select_detail: any;
    constructor(props: any) {
        super(props)

        this.state = {
            initedData: false,
            isLoading: false,
            isOpenDropdown: false,
            value: this.props.value ? this.props.value : this.props.defaultItem ? this.props.defaultItem : {
                [this.props.dataId]: '',
                [this.props.dataLabel]: ''
            },
            listData: this.props.data || [],
            listSuggest: this.props.data || [],
            dropUp: false,
            isBackdrop: this.props.isBackdrop
        }

        this.handleClickDropdown = this.handleClickDropdown.bind(this)
        this.handleOnClickItem = this.handleOnClickItem.bind(this)
        this.handleOnChangeInput = this.handleOnChangeInput.bind(this)
        this.determineDropUp = this.determineDropUp.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
    }

    static ref_content

    static defaultProps = {
        ISelectionType: 'Select',
        isBackdrop: true
    }

    componentWillReceiveProps(newProps) {
        if (this.props.data != newProps.data) {
            this.setState({
                listData: newProps.data,
                listSuggest: newProps.data
            })
        }
        if (JSON.stringify(this.props.value) != JSON.stringify(newProps.value)) {
            this.setState({ value: newProps.value })
        }
    }

    componentDidMount(this) {
        this.node = ReactDOM.findDOMNode(this);
        document.addEventListener('keyup', this.handleTabChange);
        window.addEventListener('resize', this.determineDropUp);
        window.addEventListener('scroll', this.determineDropUp);
        document.addEventListener('mousedown', this.handleClickOutside);
        this.determineDropUp();
    }

    componentWillUnmount(this) {
        document.removeEventListener('keyup', this.handleTabChange);
        window.removeEventListener('resize', this.determineDropUp);
        window.removeEventListener('scroll', this.determineDropUp);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    determineDropUp(this) {
        if (!this.node) return;
        const windowHeight = window.innerHeight;
        const menuHeight = this.ref_content.offsetHeight;
        const instOffsetWithMenu = this.node.getBoundingClientRect().bottom + menuHeight;
        this.setState({
            dropUp: instOffsetWithMenu >= windowHeight
        });
    }

    handleClickOutside(event) {
        if (this.ref_selectionComponent && !this.ref_selectionComponent.contains(event.target)) {
            this.setState({
                isOpenDropdown: false
            }, () => console.log("outside"))
        }
    }

    getDataAPI() {
        if (this.props.getData) {
            this.setState({
                isLoading: true
            }, () => {
                this.props.getData().then(rsp => {
                    let listData = (rsp.data && rsp.data.length > 0) ? rsp.data : []
                    this.setState({
                        listData: listData,
                        listSuggest: listData,
                        isLoading: false,
                        initedData: true
                    })
                }).catch(() => {
                    this.setState({ isLoading: false })
                });
            })
        }
    }

    handleClickDropdown() {
        if (!this.state.initedData) {
            this.getDataAPI()
        }
        if (this.props.handleOpenDropdown)
            this.props.handleOpenDropdown()

        this.setState(prevState => ({
            isOpenDropdown: !prevState.isOpenDropdown
        }), () => {
                this.determineDropUp(),
                    console.log(this.state.isOpenDropdown)
        });
    }

    handleOnClickItem(item?) {
        let { dataId, dataLabel } = this.props,
            { value } = this.state
        if (item) {
            value = {
                [dataId]: item[dataId],
                [dataLabel]: item[dataLabel]
            }
        } else {
            value = {
                [dataId]: value[dataLabel],
                [dataLabel]: value[dataLabel]
            }
        }
        this.setState({
            isOpenDropdown: false,
            value: value,
            isValueNew: false
        }, () => {
            if (this.props.handleOnClickItem)
                this.props.handleOnClickItem(this.state.value)
        })
    }

    handleOnFocusInput(e) {
        if (this.props.handleOnFocusInput)
            this.props.handleOnFocusInput(e)

        this.handleClickDropdown()
    }

    handleOnChangeInput(e) {
        let { dataId, dataLabel } = this.props,
            { listData, listSuggest, isValueNew } = this.state
        let listAfterSuggest = false
        const value = e.target.value
        let listExist = listData.filter(item => { return item[dataLabel].toLowerCase() == value.toLowerCase() })
        if (listExist && listExist.length == 0 && value != '') {
            isValueNew = true
        } else {
            isValueNew = false
        }
        listSuggest = listData.filter(item => { return Utils.NonUnicode(item[dataLabel]).indexOf(Utils.NonUnicode(value)) != -1 })
        if (listSuggest) {
            listAfterSuggest = listSuggest.find((r, i) => {
                return r.name === value
            })
        }

        this.setState({
            value: {
                [dataId]: value,
                [dataLabel]: value
            },
            listSuggest: listSuggest,
            isValueNew: isValueNew
        }, () => {
            this.props.handleOnClickItem(listAfterSuggest ? { id: listSuggest[0][dataId], name: listSuggest[0][dataLabel] } : { id: '', name: value })
        })

        if (this.props.handleOnChangeInput)
            this.props.handleOnChangeInput(e)
    }

    handleTabChange(e) {
        let tab = e.which || e.keyCode;
        if (tab == 9) {
            this.setState({
                isOpenDropdown: false
            })
        }
    }

    renderAddNew() {
        let { dataLabel, hasAddNew } = this.props,
            { value, isValueNew } = this.state
        const valueNew = value ? value[dataLabel] : ''

        return (hasAddNew && isValueNew) &&
            <li className='row no-gutters d-flex align-items-center' onClick={() => this.handleOnClickItem()}>
            <div className='col-auto mr-2 d-flex'>
                <CreateSVG size={12} svgName='#next-icon-plus-circle' />
                </div>
                <div className='col'>
                    <span className='word-break-selection'>Thêm "{valueNew}"</span>
                </div>
            </li>
    }

    renderTypeControl(type: string) {
        let render = null

        switch (type) {
            case 'InputSearch':
                render = <div onClick={() => this.handleClickDropdown()} ref={comp => this.ref_select_control = comp}>
                    <Input value={this.state.value ? this.state.value[this.props.dataLabel] : ''}
                        placeholder={this.props.placeholder}
                        suffix={
                            <CreateSVG size={10} rotate={90} svgName='#next-icon-arrow' />
                        }
                        onChange={(e) => this.handleOnChangeInput(e)}
                        onFocus={(e) => this.handleOnFocusInput(e)}
                    />
                </div>
                break;

            default:
                render = <div className='ui-select-control' tabIndex={0} onClick={() => this.handleClickDropdown()} ref={comp => this.ref_select_control = comp}>
                    <div className='ui-select-cell'>
                        <div className='ui-select-value text-truncate'>{this.state.value[this.props.dataLabel] ? this.state.value[this.props.dataLabel] : ''}</div>
                        <div className='ui-select-arrow'>
                            <CreateSVG size={10} rotate={90} svgName='#next-icon-arrow' />
                        </div>
                    </div>
                </div>

                break;
        }

        return render
    }

    renderDropdownSelect(this) {
        let { keyControl, defaultItem, renderAddNew } = this.props,
            { listSuggest, value } = this.state
        const compareClass = value ? value[this.props.dataId] : '';
        return <div className='select-menu-outer' ref={component => this.ref_content = component}>
            {
                this.state.isLoading
                    ? <Loading size='icon' />
                    : <ul>
                        {this.renderAddNew()}
                        {
                            renderAddNew ? renderAddNew : null
                        }
                        {
                            defaultItem &&
                            <li key={defaultItem[this.props.dataLabel]}
                                onClick={() => this.handleOnClickItem(defaultItem)}>
                                {defaultItem[this.props.dataLabel]}
                            </li>
                        }
                        {
                            (listSuggest && listSuggest.length > 0) &&
                            listSuggest.map((item, index) => {
                                const key = keyControl + index
                                if (this.props.selectedValues != null && this.props.selectedValues.includes(item[this.props.dataId])) return
                                return <li key={key}
                                    onClick={() => this.handleOnClickItem(item)}
                                    className={(compareClass === item[this.props.dataId]) ? "active-selection--component" : ''}
                                    ref={comp => this.ref_select_detail = comp}
                                >
                                    <p className="talbe-break-word mb-0">{item[this.props.dataLabel]}</p>
                                </li>
                            })}

                    </ul>}
        </div>
    }

    public render() {
        const { className, type } = this.props
        const clasesWrapper = classnames({
            'ui-selectbox': true,
            'ui-selectbox--openning': this.state.isOpenDropdown,
            'ui-dropup': this.state.dropUp,
            [className]: className
        });

        return <div className={clasesWrapper} ref={component => this.ref_selectionComponent = component}>
            {this.renderTypeControl(type)}
            {this.renderDropdownSelect()}
            {(this.state.isOpenDropdown && this.state.isBackdrop) && <div className='ui-backdrop-control' tabIndex={0} onClick={() => this.handleClickDropdown()}></div>}
        </div>
    }
}