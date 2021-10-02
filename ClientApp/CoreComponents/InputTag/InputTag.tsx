import * as React from 'react';
import { Button } from '../Button/Button'
import './index.css';

interface IInputTagProps {
    keyControl: string,
    value?: any[],
    listData?: any[],
    handleEnterInput?: Function,
    handleBlurInput?: Function,
    handleOnAddItem?: Function,
    handleOnDeleteItem?: Function,
    placeHolder?: string,
    title?: string
}

interface IInputTagStates {
    listValue: any[],
    listData: any[],
    value: string,
    listAddNewOnKey: any[]
}

export class InputTag extends React.Component<IInputTagProps, IInputTagStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            listValue: this.props.value || [],
            listData: this.props.listData || [],
            value: '',
            listAddNewOnKey: []
        }
    }

    ref_inputTags = null
    static defaultProps = {
        title: ''
    }
    componentWillReceiveProps(newProps) {
        if (this.props.value != newProps.value || this.props.listData != newProps.listData) {
            this.setState({
                listValue: newProps.value,
                listData: newProps.listData
            })
        }
    }

    handleOnChangeValue(e) {
        let { listAddNewOnKey } = this.state
        let value = e.target.value,
            arr_listNew = value.trim().split(',')

        listAddNewOnKey = []
        arr_listNew.map((item, index) => {
            const value = item.trim()
            if (value != '') {
                listAddNewOnKey.push(value)
            }
        })

        this.setState({
            value: value,
            listAddNewOnKey: listAddNewOnKey
        })
    }

    handleOnBlur(e) {
        if (e && e != undefined) {
            const value = e.target.value.trim()
            this.handleProcessData(value)
        }
    }

    handleOnKeyPress(e) {
        if (e && e != undefined) {
            const keyPress = e.which
            if (keyPress == 13) {
                const value = e.target.value.trim()
                this.handleProcessData(value)
            }
        }
    }

    handleProcessData(value) {
        let { listValue, listData, listAddNewOnKey } = this.state
        if (listValue == null) listValue = []
        if (value == '') {
            return false
        }

        if (listAddNewOnKey.length > 0) {
            listAddNewOnKey.map(item => {
                if (listValue.indexOf(item) == -1) {
                    listValue.push(item)
                }
            })
        }

        this.setState({
            listValue: listValue,
            listData: listData,
            value: ''
        }, () => {
            if (this.props.handleEnterInput) {
                this.props.handleEnterInput(this.state.listAddNewOnKey, this.state.listValue)
            }
            if (this.props.handleBlurInput) {
                this.props.handleBlurInput(this.state.listAddNewOnKey, this.state.listValue)
            }
            this.setState({
                listAddNewOnKey: []
            })
        })
    }

    handleOnFocusInput() {
        if (this.ref_inputTags)
            this.ref_inputTags.focus()
    }

    handleOnAddItem(item) {
        let { listValue } = this.state
        let news = [item]
        if (listValue.indexOf(item) == -1) {
            listValue.push(item)
            this.setState({
                listValue: listValue
            }, () => {
                if (this.props.handleOnAddItem) {
                    this.props.handleOnAddItem(news, this.state.listValue)
                }
            })
        }
    }

    handleOnDeleteItem(item) {
        let { listValue } = this.state
        listValue = listValue.filter((it) => { return it !== item })

        this.setState({
            listValue: listValue
        }, () => {
            if (this.props.handleOnDeleteItem) {
                this.props.handleOnDeleteItem(item, this.state.listValue)
            }
        })
    }

    renderTags(item, index, action) {
        let { listValue } = this.state
        let render = null, isActive = false
        if (listValue == null) return

        switch (action) {
            case 'add':
                if (listValue.indexOf(item) != -1)
                    isActive = true

                render = <li key={'input-tags' + index} className={'tagit-choice table-break-word' + (isActive ? ' next-token--is-disabled' : '')}>
                    <Button type='link-no-pding' className='tagit-label' onClick={() => this.handleOnAddItem(item)}>
                        <span>{item}</span>
                    </Button>
                </li>
                break;

            default:
                render = <li key={'input-tags' + index} className='tagit-choice table-break-word'>
                    <span className='tagit-label'>{item}</span>
                    <Button type='link-no-pding' className='tagit-close' onClick={() => this.handleOnDeleteItem(item)}>
                        <span className='ui-icon ui-icon-close'>×</span>
                    </Button>
                </li>
                break;
        }

        return render
    }

    public render() {
        let { listValue, listData } = this.state

        return <div className='next-token-list__wrapper'>
            <ul className='next-token-list next-token-list--is-input' onClick={() => this.handleOnFocusInput()}>
                {(listValue && listValue.length > 0) && listValue.map((item, index) => {
                    return this.renderTags(item, index, 'delete')
                })}
                <li className='tagit-choice input-tags--insert'>
                    <input ref={component => this.ref_inputTags = component}
                        className='tagit-input' type='text' value={this.state.value}
                        onChange={(e) => this.handleOnChangeValue(e)}
                        onKeyPress={(e) => this.handleOnKeyPress(e)}
                        onBlur={(e) => this.handleOnBlur(e)}
                        placeholder={this.props.placeHolder}
                    />
                </li>
            </ul>
            {
                (listData && listData.length > 0) && <div className='mt-3'>
                    {this.props.title !='' && <div className='mb-2'>{this.props.title}</div>}
                    <div className='next-token-list__wrapper'>
                        <ul className='next-token-list'>
                            {listData.map((item, index) => {
                                return this.renderTags(item, index, 'add')
                            })}
                        </ul>
                    </div>
                </div>
            }

        </div>
    }
}
