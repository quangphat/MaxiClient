import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { IArticleMeta } from '../../Models/IArticleMeta'
import CKEditor from "react-ckeditor-component";
interface CkEditorProps {
    data: any,
    onChange: Function
}
interface CkEditorStates {
    data:any
}
export class CkEditor extends React.Component<CkEditorProps, CkEditorStates> {
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
    onChange(evt) {
        let data = evt.editor.getData();
        this.props.onChange(data)
    }

    onBlur(evt) {
        
    }

    afterPaste(evt) {
        
    }

    public render() {
        return (
            <CKEditor
                activeClass="p10"
                content={this.state.data}
                onChange={(event, editor) => this.onChange( event)}
                events={{
                    blur: this.onBlur,
                    afterPaste: this.afterPaste,
                    change: this.onChange.bind(this)
                }}
            />
        )
    }
}
