import * as React from 'react'
import * as PropTypes from 'prop-types'
//const PropTypes = require('prop-types')
//import * as hljs from "highlightjs";
import * as hljs from "highlight.js"
//const hljs = window.hljs

interface CodeBlockProps{
    language?: string,
    value: string
}

export class CodeBlock extends React.PureComponent<CodeBlockProps,any> {
    codeEl: any;
    constructor(props) {
        super(props)
       
    }
    static defaultProps = {
        language: ''
    }

    setRef(el) {
        this.codeEl = el
    }

    componentDidMount() {
        this.highlightCode()
    }

    componentDidUpdate() {
        this.highlightCode()
    }

    highlightCode() {
        
        hljs.highlightBlock(this.codeEl)
    }

    render() {
        return (
            <pre>
                <code ref={com => this.codeEl = com} className={`language-${this.props.language}`}>
                    {this.props.value}
                </code>
            </pre>
        )
    }
}

