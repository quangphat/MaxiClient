import * as React from 'react';
import * as classnames from 'classnames';
import './index.css';

export declare type typeInput = 'text' | 'number' | 'password';
export declare type typeClass = 'string' | 'money' | 'number';

interface IInputProps {
    placeholder?: string,
    name?: string,
    onChange?: Function,
    onFocus?: Function,
    onBlur?: Function,
    OnKeyPress?: Function,
    onKeyUp?: Function,
    type?: typeInput,
    className?: string,
    prefix?: any,
    suffix?: any,
    value?: any,
    id?: string,
    isReadOnly?: boolean,
    noneBorder?: boolean,
    pattern?: string,
    min?: number,
    max?: number,
    step?: number,
}

export interface IInputStates {
    value?: any;
    isFocus: boolean;
}

export class Input extends React.Component<IInputProps, IInputStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            value: this.props.value || '',
            isFocus: false,
        }

        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    static defautlProps = {
        type: 'text'
    }

    componentWillReceiveProps(newProps: IInputProps) {
        if (newProps.value != this.props.value) {
            this.setState({ value: newProps.value })
        }
    }

    handleOnChange(e) {
        let value = e.target.value
        this.setState({
            value: value
        })

        if (this.props.onChange)
            this.props.onChange(e)
    }

    handleOnFocus(e) {
        this.setState({
            isFocus: true
        })

        if (this.props.onFocus)
            this.props.onFocus(e)
    }

    handleOnBlur(e) {
        this.setState({
            isFocus: false
        })

        if (this.props.onBlur)
            this.props.onBlur(e)
    }

    handleKeyPress(e) {
        if (this.props.OnKeyPress)
            this.props.OnKeyPress(e)

        //this.setState({
        //    isFocus: false,
        //})
    }
    handleKeyUp(e) {
        if (this.props.onKeyUp)
            this.props.onKeyUp(e)
    }
    render() {
        const { id, placeholder, name, prefix, suffix, className, isReadOnly, type, pattern, min, max, step } = this.props
        const classInput = classnames({
            'next-input': true,
            'next-input--invisible': prefix || suffix,
            'min-width-150px': true,
            'border-0': this.props.noneBorder
        });
        const classWrapper = classnames({
            'next-input--stylized': prefix || suffix,
            'next-input--is-focused': this.state.isFocus,
            'next-input--readonly': isReadOnly,
            [className]: className,
        });
        const classIconPrefix = classnames({
            'next-input-add-on': true,
            'next-input__add-on--before': prefix
        })
        const classIconSuffix = classnames({
            'next-input-add-on': true,
            'next-input__add-on--after': suffix
        })
        return <div className={classWrapper}>
            {prefix && <div className={classIconPrefix}>{prefix}</div>}
            <input
                type={type}
                id={id}
                className={classInput}
                placeholder={placeholder}
                value={this.state.value}
                readOnly={isReadOnly} name={name}
                onChange={(e) => this.handleOnChange(e)}
                onFocus={(e) => this.handleOnFocus(e)}
                onBlur={(e) => this.handleOnBlur(e)}
                onKeyPress={(e) => this.handleKeyPress(e)}
                onKeyUp={(e) => this.handleKeyUp(e)}
                pattern={pattern}
                min={min != undefined ? min : null}
                max={max != undefined ? max : null}
                step={step ? step : 1}
            />
            {suffix && <div className={classIconSuffix}>{suffix}</div>}
        </div>
        
    }
}
