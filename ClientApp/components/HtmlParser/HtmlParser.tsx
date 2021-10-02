import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { IArticleMeta } from '../../Models/IArticleMeta'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
interface CkEditorProps {
    data: any,
    className?: string
}
interface HtmlParserStates {
    data: any
}
export class HtmlParser extends React.Component<CkEditorProps, HtmlParserStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            data: this.props.data
        };

    }
    componentWillReceiveProps(newProps: CkEditorProps) {
        if (this.props.data != newProps.data) {
            this.setState({ data: newProps.data })
        }
    }


    public render() {
        return <div className={this.props.className}>
            {ReactHtmlParser(this.state.data)}
        </div>
    }
}
