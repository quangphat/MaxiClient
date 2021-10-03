import * as React from 'react';
import Select from 'react-select';
import { IOptionSimple, ISelectItem } from '../../Models';
import * as Utils from '../../infrastructure/Utils'
import debounce from 'lodash/debounce';


interface IReactSelectCustomProps {
    className?: string,
    onChange?: Function,
    selectedItems: any[],
    findByValue?:boolean,
    options: any[],
    debounceDelay?: number,
    onInputChange?: Function,
    dataChangeFlag?: number,
    isMultiple?: boolean,
    allowFreeTextSearch?: boolean,
    placeholder?: any,
    maxOption?: number,
    name?:string,
    customOption?:any,
    defaultInputValue?:string
}

interface IReactSelectCustomStates {
    options: any[],
    selectedItems: any[],
    dataChangeFlag: number,
    defaultInputValue: string
}

export class ReactSelectCustom extends React.Component<IReactSelectCustomProps, IReactSelectCustomStates> {
    constructor(props: any) {
        super(props)

        let delay = this.props.debounceDelay || 500

        this.state = {
            options: this.props.options,
            selectedItems:this.getSelectedItemsFromValues(this.props.options,this.props.selectedItems),
            dataChangeFlag: this.props.dataChangeFlag || 0,
            defaultInputValue: this.props.defaultInputValue ||''

        }
        this.onInputChangeDebounce = debounce(this.onInputChangeDebounce, delay);
    }

    private getSelectedItemsFromValues(options: any[], values: any[]) {
        if (Utils.isArrNullOrHaveNoItem(values))
            return []
        if (Utils.isArrNullOrHaveNoItem(options))
            options = []

       
        if(this.props.findByValue)
        {
            let selectedItems = []
            values.map(item => {
                if(!Utils.isNullOrUndefined(item))
                {
                    let index = options.findIndex(p => p.value == item.toString())
                    if (index >= 0)
                        selectedItems.push(options[index])
                }
               
    
            })
            return selectedItems
        }
        return values
    }


    static defaultProps = {
        className: 'basic-multi-select',
        isMultiple: true,
        allowFreeTextSearch: false,
        placeholder: '',
        maxOption: 5,
        findByValue:false,
        name:Utils.getNewGuid()
    }
    private onInputChange(value, reason) {

        if (this.props.allowFreeTextSearch) {
            if (reason.action === "set-value" ||
                reason.action === "input-blur" ||
                reason.action === "menu-close") {
                return;
            }
        }

        this.setState({ defaultInputValue: value });
        this.onInputChangeDebounce(value, reason.action === "input-change")

    }

    private onInputChangeDebounce(value: string, allowSearch: boolean = false) {


        if (Utils.isNullOrWhiteSpace(value) && !allowSearch)
            return


        if (this.props.onInputChange) {

            this.props.onInputChange(value)
        }

    }

    componentWillReceiveProps(newProps: IReactSelectCustomProps) {
        if (this.props.dataChangeFlag != newProps.dataChangeFlag) {

            this.setState({

                options: newProps.options,
                dataChangeFlag: newProps.dataChangeFlag
            })
        }
    }



    private renderBody() {
        let { selectedItems, options } = this.state,
            { className, isMultiple, maxOption } = this.props

        if (Utils.isArrNullOrHaveNoItem(selectedItems)) {
            selectedItems = []
        }

        let isMaxOption = Object.keys(selectedItems).length < maxOption ? false : true
        //menuIsOpen={true}
        return <Select

            isMulti={isMultiple}
            inputId={this.props.name}
            components ={this.props.customOption ? {Option:this.props.customOption}:null}
            noOptionsMessage={(data) => {
                // if(Utils.isArrNullOrHaveNoItem(selectedItems))
                // {
                //     selectedItems = []
                // }
                // let newObj = {value:Utils.getNewGuid(),label:data.inputValue}
                // options.push(newObj)
                // selectedItems.push(newObj)
                return null
            }}
            onChange={(items, reason, xxx) => {
                if (reason.action == 'clear') {
                    this.setState({ selectedItems: [], defaultInputValue: '' }, () => {
                        if (this.props.onChange) {
                            this.props.onChange([], null, 'clear', this.state.defaultInputValue)
                        }
                    })
                    return
                }
                let item = null
                let removeItem = null
                if (Utils.isArrNullOrHaveNoItem(selectedItems) || !this.props.isMultiple) {
                    selectedItems = []
                }

                if (!this.props.isMultiple) {
                    selectedItems.push(items)
                }
                if (this.props.isMultiple) {
                    selectedItems = items
                    if (items == null || items == undefined) {
                        items = []
                    }
                    if (!Utils.isArrNullOrHaveNoItem(items)) {
                        item = items[items.length - 1];
                        removeItem = selectedItems.filter(x => !items.includes(x));
                    }
                    else {
                        selectedItems = []
                    }

                }
                else {
                    item = items
                    removeItem = item

                }

                if (reason.action == "remove-value") {
                    removeItem = reason.removedValue
                    this.setState({ selectedItems: selectedItems, defaultInputValue: '' }, () => {
                        if (this.props.onChange) {
                            this.props.onChange(selectedItems, removeItem, 'remove', this.state.defaultInputValue)
                        }
                    })
                }
                else if (reason.action == "select-option") {
                    this.setState({ selectedItems: selectedItems, defaultInputValue: '' }, () => {

                        if (this.props.onChange) {
                            this.props.onChange(selectedItems, item, 'add', this.state.defaultInputValue)
                        }
                    })
                }
                else if (reason.action == "pop-value" || reason.action == "clear") {

                    this.setState({ selectedItems: item, defaultInputValue: '' }, () => {
                        if (this.props.onChange) {
                            this.props.onChange(items, removeItem, 'remove', this.state.defaultInputValue)
                        }
                    })
                }

            }}
            inputValue={this.state.defaultInputValue}
            onInputChange={(value, reason) => {
                this.onInputChange(value, reason)
            }}
            isClearable={true}

            isSearchable={true}
            defaultValue={selectedItems}
            delimiter=','
            options={!isMaxOption ? options : []}
            className={this.props.className}
            placeholder={this.props.placeholder}
        />;
    }


    public render() {
        return this.renderBody()

    }
}