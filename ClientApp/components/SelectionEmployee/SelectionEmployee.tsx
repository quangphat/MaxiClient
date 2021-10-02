import * as React from 'react';
import * as Utils from '../../infrastructure/Utils'
import { TagDisplay } from '..'
import { IOptionSimple, ISelectItem } from '../../Models';
import { IndustryRepository } from '../../repositories/IndustryRepository'
import { ReactSelectCustom } from '../ReactSelectCustom/ReactSelectCustom';

interface ISelectIndustryProps {
    selectedItems?: IOptionSimple[],
    className?: string,
    onChange?: Function
    readOnly?: boolean,
    isMulti?: boolean
}

interface ISelectIndustryStates {
    datas: ISelectItem[],
    selectedItems: ISelectItem[],
    dataChangeFlag: number
}

export class SelectIndustry extends React.Component<ISelectIndustryProps, ISelectIndustryStates> {
    constructor(props: any) {
        super(props)

        this.state = {
            datas: [],
            selectedItems: Utils.convertOptionSimplesToSelectItems(this.props.selectedItems),
            dataChangeFlag: 0

        }


    }


    static defaultProps = {
        className: '',
        isMulti: false
    }

    componentWillReceiveProps(newProps: ISelectIndustryProps) {
        if (this.props.selectedItems != newProps.selectedItems) {
            this.setState({ selectedItems: Utils.convertOptionSimplesToSelectItems(newProps.selectedItems) })
        }
    }

    componentDidMount() {
        this.onSearch()
    }

    onSearch(freeText: string = '') {
        IndustryRepository.Search(freeText, 1, 30).then(response => {
            
            if (response.success && response.data) {
                if (!Utils.isArrNullOrHaveNoItem(response.data.datas)) {
                    this.setState({ datas: response.data.datas, dataChangeFlag: this.state.dataChangeFlag + 1 })
                }
                else {
                    this.setState({ datas: [], dataChangeFlag: this.state.dataChangeFlag + 1 })
                }

            }
            else {
                this.setState({ datas: [], dataChangeFlag: this.state.dataChangeFlag + 1 })
            }
        })
    }

    private onClickItem(item: ISelectItem) {

        if (item == null)
            return;
        let { selectedItems } = this.state
        if (Utils.isArrNullOrHaveNoItem(selectedItems) || !this.props.isMulti) {
            selectedItems = []
        }
        selectedItems.push(item)
        this.setState({ selectedItems: selectedItems }, () => {

            if (this.props.onChange)
                this.props.onChange(selectedItems)
        })
    }
    private onRemoveItem(item) {
        if (item == null)
            return;
        let { selectedItems } = this.state

        selectedItems = selectedItems.filter(p => p.value != item.value)
        this.setState({ selectedItems: selectedItems }, () => {

            if (this.props.onChange)
                this.props.onChange(selectedItems)
        })
    }


    private renderBody() {
        let { selectedItems, datas } = this.state,
            { readOnly, isMulti } = this.props


        return <ReactSelectCustom selectedItems={selectedItems}
            options={datas}
            isMultiple={isMulti}
            placeholder={'Vui lòng chọn'}
            className={this.props.className}
            dataChangeFlag={this.state.dataChangeFlag}
            onInputChange={(value) => this.onSearch(value)}
            onChange={(selectedItems, item) => {
                
                this.setState({ selectedItems: selectedItems }, () => {
                    if (this.props.onChange)
                    this.props.onChange(selectedItems)
                })
            }}
        />
    }


    public render() {
        return this.renderBody()

    }
}