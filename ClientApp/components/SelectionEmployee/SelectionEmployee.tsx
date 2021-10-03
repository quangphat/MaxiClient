import * as React from 'react';
import * as Utils from '../../infrastructure/Utils'
import {  IOptionSimple, ISelectItem, IUSPTeam } from '../../Models';
import { ReactSelectCustom } from '../ReactSelectCustom/ReactSelectCustom';
import { PersonRepository } from '../../repositories/PersonRepository';

interface ISelectEmployeeProps {
    selectedItems?: ISelectItem[],
    className?: string,
    onChange?: Function
    readOnly?: boolean,
    isMulti?: boolean
}

interface ISelectEmployeeStates {
    datas: ISelectItem[],
    selectedItems: ISelectItem[],
    dataChangeFlag: number
}

export class SelectEmployee extends React.Component<ISelectEmployeeProps, ISelectEmployeeStates> {
    constructor(props: any) {
        super(props)
        
        this.state = {
            datas: [],
            selectedItems: this.props.selectedItems,
            dataChangeFlag: 0

        }


    }


    static defaultProps = {
        className: '',
        isMulti: false
    }

    componentWillReceiveProps(newProps: ISelectEmployeeProps) {
        
        if (this.props.selectedItems != newProps.selectedItems) {
            this.setState({ selectedItems: Utils.convertOptionSimplesToSelectItems(newProps.selectedItems) })
        }
    }

    componentDidMount() {
        this.onSearch()
    }

    onSearch(freeText: string = '') {
        PersonRepository.Search(freeText, 1, 50).then(response => {
            
            if (response.success && response.data) {
                if (!Utils.isArrNullOrHaveNoItem(response.data.datas)) {
                
                    this.setState({ datas:Utils.convertUspEmployeesToSelectItems(response.data.datas), dataChangeFlag: this.state.dataChangeFlag + 1 })
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

    private onClickItem(item: any) {

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
            name={'select_employee'}
            isMultiple={isMulti}
            className={this.props.className}
            dataChangeFlag={this.state.dataChangeFlag}
            onInputChange={(value) => this.onSearch(value)}
            onChange={(selectedItems, item,e) => {
                
                this.setState({ selectedItems: selectedItems }, () => {
                    if (this.props.onChange)
                    {
                        if(this.props.isMulti)
                        {
                            this.props.onChange(selectedItems,item)
                        }
                        else
                        {
                            this.props.onChange(selectedItems!=null?selectedItems[0]:null,item,e)
                        }
                    }

                    
                })
            }}
        />
    }


    public render() {
        return this.renderBody()

    }
}