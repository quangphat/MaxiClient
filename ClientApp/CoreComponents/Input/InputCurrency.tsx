import * as React from 'react';
import * as classnames from 'classnames';
import * as FormatHelpers from '../../infrastructure/FormatHelper'
import * as numeral from 'numeral';
import './index.css';

interface IInputCurrencyProps {
    placeholder?: string,
    name?: string,
    onChange?: Function,
    onFocus?: Function,
    onBlur?: Function,
    OnKeyPress?: Function,
    className?: string,
    prefix?: any,
    suffix?: any,
    value?: any,
    id?: string,
    isDisabled?: boolean,
    isReadOnly?: boolean,
    noneBorder?: boolean,
    pattern?: string,
    alwayResetData?: boolean,
    handleGetValue?: Function,
    formatMoney?: string,
    isSymbol?: boolean,
    allowNull?: boolean,
    isUnderZero?: boolean
}

export interface IInputCurrencyStates {
    value?: any;
    valueStored?: any,
    isFocus: boolean,
    symbolCurrency: string,
    isSymbolInput: boolean
}

export class InputCurrency extends React.Component<IInputCurrencyProps, IInputCurrencyStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: '',
            valueStored: this.props.value,
            isFocus: false,
            symbolCurrency: this.props.suffix,
            isSymbolInput: true
        }

        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    static defaultProps = {
        type: 'number',
        formatMoney: "0,0 $",
        isSymbol: true,
        isUnderZero: false
    }

    componentDidMount() {
        let value = null;
        if (this.props.allowNull == true && !this.props.value)
            value = '';
        else
            value = this.props.isSymbol == true ? FormatHelpers.FormatMoney(this.props.value) : FormatHelpers.FormatNumber(this.props.value);
        this.setState({ value })
    }

    componentWillReceiveProps(newProps) {
        if (this.props.alwayResetData == true) {
            this.setState({
                value: newProps.value
            })
        }
        else {
            if (this.props.value != newProps.value) {
                this.setState({
                    value: newProps.value
                })
            }
            if (this.props.suffix != newProps.suffix) {
                this.setState({
                    symbolCurrency: newProps.suffix
                })
            }
        }
    }

    getValueNumber(event) {
        let value = event.target.value;
        let allowNull = this.props.allowNull;

        value = numeral(value)._value

        if (value == null)
            value = allowNull == true ? '' : 0;
        if (value < 0) {
            value = 0;
        }
        return value;
    }

    getValueUnderZero(event) {
        let value = event.target.value;
        let val = value.replace(/[A-Za-z]/g, '');
        val = val.replace(/(\-)+/g, '$1');
        if (val == null || val == undefined) val = ''
        return val;
    }

    handleOnChange(e) {
        let valueStored = this.props.isUnderZero ? this.getValueUnderZero(e) : this.getValueNumber(e);

        this.setState({
            value: valueStored
        })
        let _event = Object.assign({}, e);
        if (this.props.allowNull == true && !valueStored)
            _event.target.value = null;
        else
            _event.target.value = valueStored;

        if (this.props.onChange) {
            this.props.onChange(_event)
        }
    }

    handleOnFocus(e) {
        let valueStored = this.props.isUnderZero ? this.getValueUnderZero(e) : this.getValueNumber(e);
        // let val = valueStored.match(/[-]{0,1}[\d]*/g).join([])
        // if (val == null) {
        //     val = ''
        // }

        this.setState({
            isFocus: true,
            value: valueStored
        })

        if (this.props.onFocus)
            this.props.onFocus(e)
    }

    handleOnBlur(e) {
        let { formatMoney, isSymbol, allowNull } = this.props,
            valueStored = this.props.isUnderZero ? this.getValueUnderZero(e) : this.getValueNumber(e);
        if (this.validateNumber(valueStored)) {
            this.setState({
                isFocus: false,
                value: isSymbol ? FormatHelpers.FormatMoney(valueStored, formatMoney) : FormatHelpers.FormatNumber(valueStored),
                symbolCurrency: isSymbol ? FormatHelpers.FormatMoney(numeral(valueStored), formatMoney).split(' ')[1] : this.props.suffix
            })
        } else {
            this.setState({
                isFocus: false,
                value: allowNull == true ? '' : FormatHelpers.FormatMoney(0),
                symbolCurrency: isSymbol ? FormatHelpers.FormatMoney(0, formatMoney).split(' ')[1] : this.props.suffix
            })
        }

        if (this.props.onBlur)
            this.props.onBlur(e)
    }

    handleKeyPress(e) {
        if (this.props.OnKeyPress)
            this.props.OnKeyPress(e)

        this.setState({
            isFocus: false
        })
    }

    validateNumber(value) {
        let regex = /\-?[0-9]/;
        if (regex.test(value)) return true
        return false

    }

    render() {
        const { id, placeholder, name, prefix, suffix, className, isDisabled, isReadOnly, pattern } = this.props
        let { value } = this.state

        const classInput = classnames({
            'next-input': true,
            'next-input--invisible': prefix || suffix,
            'text-left min-width-100px': true,
            'border-0': this.props.noneBorder
        });
        const classWrapper = classnames({
            'next-input--stylized': prefix || suffix,
            'next-input--is-focused': this.state.isFocus,
            'next-input--disabled': isDisabled,
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
            <input id={id} className={classInput} placeholder={placeholder} value={value}
                disabled={isDisabled}
                readOnly={isReadOnly} name={name}
                onChange={(e) => this.handleOnChange(e)}
                onFocus={(e) => this.handleOnFocus(e)}
                onBlur={(e) => this.handleOnBlur(e)}
                onKeyPress={(e) => this.handleKeyPress(e)}
                pattern={pattern}
            />
            {
                suffix && <div className={classIconSuffix}>{this.state.symbolCurrency}</div>
            }
        </div>
    }
}
