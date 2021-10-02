import * as React from 'react';
import * as classnames from 'classnames';
import { CreateSVG } from '../../CoreComponents';
import './index.css';

interface IInputCheckboxProps {
    nameInput: string,
    className?: string,
    content?: any,
    isChecked?: boolean,
    isRequired?: boolean,
    isReadOnly?: boolean,
    isDisabled?: boolean,
    onChange?: Function,
    iconCheck?: string,
    selfHandle?: boolean,
    classContent?: string
}

interface IInputCheckboxStates {
    isChecked: boolean,
    iconCheck: string,
    selfHandle: boolean,
}

export class InputCheckbox extends React.Component<IInputCheckboxProps, IInputCheckboxStates> {
    constructor(props: any) {
        super(props)

        this.state = {
            isChecked: this.props.isChecked || false,
            iconCheck: this.props.iconCheck || 'iconCheckmark',
            selfHandle: props.selfHandle == false ? false : true,
        }
        this.onChange = this.onChange.bind(this)
    }

    static defaultProps = {
        isDisabled: false,
        iconCheck: 'iconCheckmark'
    }

    componentWillReceiveProps(newProps) {
        if (this.props.isChecked != newProps.isChecked || this.props.iconCheck != newProps.iconCheck) {
            this.setState({
                isChecked: newProps.isChecked,
                iconCheck: newProps.iconCheck
            })
        }
    }

    onChange(e) {
        if (this.state.selfHandle) {
            this.setState({
                isChecked: !this.state.isChecked
            }, () => {
                if (this.props.onChange)
                    this.props.onChange(this.state.isChecked)
            })
        } else {
            if (this.props.onChange)
                this.props.onChange(this.state.isChecked)
        }
    }

    public render() {
        let { nameInput, className, content, isRequired, isReadOnly, isDisabled } = this.props;
        let classes = classnames({
            'next-input-checkbox': true,
            [className]: className,
            'input-disabled': isDisabled
        });

        return (
            <div className={classes}>
                <label className={`next-label--switch ${this.props.classContent}`} htmlFor={nameInput} >{content}</label>
                <input className='next-checkbox'
                    type='checkbox' name={nameInput} id={nameInput} checked={this.state.isChecked}
                    disabled={isDisabled} required={isRequired} readOnly={isReadOnly}
                    onChange={(e) => { this.onChange(e) }}
                />
                <span className='next-checkbox--styled'>
                    <CreateSVG size={10} className='checkmark' svgName={this.state.iconCheck} />
                </span>
            </div>
        );
    }
}