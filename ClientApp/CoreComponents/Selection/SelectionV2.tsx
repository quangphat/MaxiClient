import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classnames from 'classnames';
import * as LibComponents from '../../components';
import * as Utils from '../../infrastructure/Utils';
import { Input, CreateSVG, Loading } from '../../CoreComponents'

import './index.css';
import { element } from 'prop-types';

export declare type ISelectionType = 'InputSearch' | 'Select'
export declare type IReturnType ='Object' | 'ID'
interface ISelectionProps {
    datas: any[]
    dataId: string,
    dataLabel: string,
    defaultItem?: any,
    selectedId?: any,
    hasAddNew?: boolean,
    className?: string,
    disable?: boolean,
    onClickItem?: Function,
    returnType?: IReturnType
}

interface ISelectionStates {
    datas: any[],
    selectedItem: any,
    disable?: boolean
}

export class SelectionV2 extends React.Component<ISelectionProps, ISelectionStates> {
   
    constructor(props: any) {
        super(props)
        let datas = [ ...this.props.datas ]
        if (datas == null)
            datas=[]

        
        let selectedItem = null
        if (!Utils.isArrNullOrHaveNoItem(datas) && !Utils.isNullOrUndefined(this.props.selectedId)) {
            selectedItem = this.findItemInListById(this.props.selectedId, datas, this.props.dataId) 
        }
        this.state = {
            datas: datas,
            selectedItem: selectedItem,
            disable: this.props.disable || false
            
        }

      
    }

    static ref_content

    static defaultProps = {
        className: '',
        returnType:'Object'
    }

    componentWillReceiveProps(newProps: ISelectionProps) {
        if (this.props.datas != newProps.datas) {
            
            let datas = [ ...newProps.datas ]
            
            this.setState({
                datas: datas,
                selectedItem: this.findItemInListById(newProps.selectedId, newProps.datas, this.props.dataId) 
            })
        }
        if (this.props.disable != newProps.disable) {
            this.setState({
                disable: newProps.disable
            })
        }
        if (this.props.selectedId != newProps.selectedId) {
            
            this.setState({
                selectedItem: this.findItemInListById(newProps.selectedId, newProps.datas, this.props.dataId) 
            })
        }
    }

    private findItemInListById(selectedId,datas,dataId) {
        
        let item = datas.find((r, i) => {
            return r[dataId] === selectedId
        })

        return item
    }
    private handleChange(e) {
        if (Utils.isNullOrUndefined(e.target.value))
            return
        let { datas, selectedItem } = this.state,
            { defaultItem, dataId } = this.props
        selectedItem = this.findItemInListById(e.target.value, datas, this.props.dataId)
        if (selectedItem == null && defaultItem != null && e.target.value == defaultItem[dataId])
            selectedItem = defaultItem
        if (selectedItem == null) {
            this.setState({ selectedItem: selectedItem })
            return
        }
        this.setState({ selectedItem: selectedItem }, () => {
            if (this.props.onClickItem) {
                if (this.props.returnType == 'ID')
                    this.props.onClickItem(selectedItem[this.props.dataId])
                else
                    this.props.onClickItem(selectedItem)
            }          
        })
    }
    private renderBody() {
        let { selectedItem, datas, disable } = this.state,
            {  dataId, dataLabel, className, defaultItem } = this.props

        return <select className={className}
            disabled={disable}
            value={!Utils.isNullOrUndefined(selectedItem) ? selectedItem[dataId] : !Utils.isNullOrUndefined(defaultItem) ? defaultItem[dataId] : ''}
            onChange={(e) => this.handleChange(e)}>
            {!Utils.isNullOrUndefined(defaultItem) && <option value={defaultItem[dataId]} defaultValue={defaultItem[dataId]}>{defaultItem[dataLabel]}</option>}
            {!Utils.isArrNullOrHaveNoItem(datas) &&
                datas.map((item) => {
                    return <option key={item[dataId]} value={item[dataId]}>{item[dataLabel]}</option>
                })
            }
        </select>
    }
   

    public render() {
        return this.renderBody()
        
    }
}