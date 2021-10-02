import * as React from 'react'
import * as Markdown from 'react-markdown';
import { CodeBlock } from '../CodeBlock/CodeBlock'
import './index.css'
interface PowerEditorProps {
    content: string,
    className?: string,
    onChange?: Function
}
interface PowerEditorStates {
    content: string,
    isOnPreview: boolean
}
export class MarkdownEditor extends React.Component<PowerEditorProps, PowerEditorStates>{
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            isOnPreview: false
        }
    }
    componentWillReceiveProps(newProps: PowerEditorProps) {
        if (newProps.content != this.props.content) {
            this.setState({ content: newProps.content })
        }
    }

    static defaultProps = {
        className: ''
    }
    public getContent() {
        return this.state.content
    }
    private onChange(e) {
        if (this.props.onChange) {
            this.props.onChange()
        }
        this.setState({ content:e.target.value })
    }
    private onKeyDown(e) {
        if (e.keyCode == 9) {
            console.log(e.keyCode)
        }
        let keyCode = e.keyCode || e.which
        if (keyCode == 9) {
            e.preventDefault();
            var s = e.target.selectionStart;
            e.target.value = e.target.value.substring(0, e.target.selectionStart) + "\t" + e.target.value.substring(e.target.selectionEnd);
            e.target.selectionEnd = s + 1; 
        }
        
    }
    render() {
        let { className } = this.props
        let { content } = this.state
        return <div className={`${className}`} id="main-view">
            <div className='flex'>
                <div className='w-49_per'>
                    <textarea className='w-100 h-600 pd-10' onKeyDown={(e) => this.onKeyDown(e)} value={content} onChange={(e) => this.onChange(e)}>
                    </textarea>
                </div>
                <div className='markdown-border min-h-600 w-49_per ml-10 '>
                    <Markdown source={content} escapeHtml={false}
                        className="markdown-content-preview"
                        renderers={{ code: CodeBlock }}
                        skipHtml={false} />
                </div>
            </div>
            
        </div>
    }
}