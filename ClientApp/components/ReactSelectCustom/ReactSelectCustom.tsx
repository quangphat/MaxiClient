import * as React from 'react';
import Select from 'react-select';
import { IOptionSimple, ISelectItem } from '../../Models';
import * as Utils from '../../infrastructure/Utils'
import debounce from 'lodash/debounce';

interface IReactSelectCustomProps {
    className?: string,
    onChange?: Function,
    selectedItems: ISelectItem[],
    options: ISelectItem[],
    debounceDelay?: number,
    onInputChange?: Function,
    dataChangeFlag?: number,
    isMultiple?: boolean,
    allowFreeTextSearch?: boolean,
    placeholder?: string,
    maxOption?: number
}

interface IReactSelectCustomStates {
    options: ISelectItem[],
    selectedItems: ISelectItem[],
    dataChangeFlag: number,
    defaultInputValue: string
}

export class ReactSelectCustom extends React.Component<IReactSelectCustomProps, IReactSelectCustomStates> {
    constructor(props: any) {
        super(props)

        let delay = this.props.debounceDelay || 500

        this.state = {
            options: this.props.options,
            selectedItems: Utils.isArrNullOrHaveNoItem(this.props.selectedItems) ? null : this.props.selectedItems,
            dataChangeFlag: this.props.dataChangeFlag || 0,
            defaultInputValue: ''

        }
        this.onInputChangeDebounce = debounce(this.onInputChangeDebounce, delay);
    }


    static defaultProps = {
        className: 'basic-multi-select',
        isMultiple: true,
        allowFreeTextSearch: false,
        placeholder: '',
        maxOption: 5
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

        return <Select
            isMulti={isMultiple}
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
            onChange={(item, reason) => {
                
                if (reason.action == "remove-value" ) {



                    selectedItems = selectedItems.filter(p => p.value != item.value)
                    this.setState({ selectedItems: selectedItems, defaultInputValue: '' }, () => {
                        if (this.props.onChange) {
                            this.props.onChange(selectedItems, item)
                        }
                    })
                }
                else if (reason.action == "select-option") {

                    if (Utils.isArrNullOrHaveNoItem(selectedItems) || !this.props.isMultiple) {
                        selectedItems = []
                    }
                    selectedItems.push(item)

                    this.setState({ selectedItems: selectedItems, defaultInputValue: '' }, () => {
                        
                        if (this.props.onChange) {
                            this.props.onChange(selectedItems, item)
                        }
                    })
                }
                else if (reason.action == "pop-value" || reason.action=="clear") {
                    
                    this.setState({ selectedItems: item, defaultInputValue: '' }, () => {
                        if (this.props.onChange) {
                            this.props.onChange(item, null)
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