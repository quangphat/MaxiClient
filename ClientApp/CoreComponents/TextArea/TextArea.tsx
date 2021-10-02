import * as React from 'react';
import * as autosize from 'autosize';
import './index.css';

interface ITextareaAutoResizeProps {
    rows?: number,
    maxRows?: number,
    value?: string,
    placeholder?: string,
    className?: string,
    onResize?: Function,
    onChange?: Function,
    innerRef?: Function,
    isDisabled?: boolean,
    isReadOnly?: boolean,
    id?: string,
}

interface ITextareaAutoResizeStates {
    value: string,
    isDisabled: boolean,
    isReadOnly: boolean
}

export class TextArea extends React.Component<ITextareaAutoResizeProps, ITextareaAutoResizeStates> {
    constructor(props: ITextareaAutoResizeProps) {
        super(props);
        this.state = {
            value: this.props.value || '',
            isDisabled: this.props.isDisabled,
            isReadOnly: this.props.isReadOnly
        }
    }

    static defaultProps = {
        rows: 1,
        className: ''
    }

    textarea: HTMLTextAreaElement

    componentDidMount() {
        autosize(this.textarea)
    }

    componentWillReceiveProps(newProps: ITextareaAutoResizeProps) {
        if (this.props.value != newProps.value
            || this.props.isDisabled != newProps.isDisabled
            || this.props.isReadOnly != newProps.isReadOnly
        ) {
            this.setState({ value: newProps.value, isDisabled: newProps.isDisabled, isReadOnly: newProps.isReadOnly })
        }
    }

    private saveDOMNodeRef = (ref: HTMLTextAreaElement) => {
        const { innerRef } = this.props;
        if (innerRef) {
            innerRef(ref);
        }
        this.textarea = ref;
    }

    handleOnChangeValue(e) {
        let value = e.target.value
        this.setState({
            value: value
        })

        if (this.props.onChange) {
            this.props.onChange(e)
        }
    }

    public render() {
        let { value, isDisabled, isReadOnly } = this.state
        return (
            <textarea className={`ui-textarea ${this.props.className}`}
                id={this.props.id}
                rows={this.props.rows}
                placeholder={this.props.placeholder}
                ref={this.saveDOMNodeRef}
                onChange={(e) => this.handleOnChangeValue(e)}
                value={value}
                disabled={isDisabled}
                readOnly={isReadOnly}
            >
            </textarea>
        );
    }

}