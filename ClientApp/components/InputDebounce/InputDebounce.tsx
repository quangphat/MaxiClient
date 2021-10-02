import * as React from 'react';
import { Input } from '../../CoreComponents/Input/Input'
import debounce from 'lodash/debounce';
import { CreateSVG } from '../../CoreComponents';


export declare type typeInput = 'text' | 'password'
interface IInputDebounceProps {
    defaultValue?: string,
    onChange: Function,
    placeholder?: string,
    className?: string,
    delay?: number,
    type?: typeInput,
    prefix?: any,
}

interface IInputDebounceStates {
    value: string
}

export class InputDebounce extends React.Component<IInputDebounceProps, IInputDebounceStates> {
    constructor(props: any) {
        super(props)

        let delay = this.props.delay || 500
        this.state = {

            value: this.props.defaultValue || '',

        }

        this.onChangeDebounce = debounce(this.onChangeDebounce, delay);
    }


    static defaultProps = {
        className: '',
        type: "text"
    }

    componentWillReceiveProps(newProps: IInputDebounceProps) {
        if (newProps.defaultValue != this.props.defaultValue) {
            this.setState({ value: newProps.defaultValue })
        }
    }
    componentWillUnmount(this) {
        //this.onAutoSaveDraftDebounce.cancel()

    }

    private onChange(e: any) {
        if (e == null || e == undefined)
            return
        let value = e.target.value
        this.setState({ value: value }, () => {
            
            this.onChangeDebounce(value)
        })
    }
    private onChangeDebounce(value: string) {
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }


    private renderBody() {

        let { value } = this.state
        return <Input value={value} type={this.props.type}
        prefix={this.props.prefix}
            onChange={(e) => this.onChange(e)}
            className={this.props.className}
            placeholder={this.props.placeholder} />;
    }


    public render() {
        return this.renderBody()

    }
}