import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { IArticleMeta } from '../../Models/IArticleMeta'
import * as Components from '../../components'
import * as Models from '../../Models'
import { ArticleRepository } from '../../repositories/ArticleRepository'
import * as Utils from '../../infrastructure/Utils'
import * as Markdown from 'react-markdown';

interface TestStates {
    text: string
}
const input = '```c# var x = ff;```'
export class Test extends React.Component<RouteComponentProps<any>, TestStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            text:''
        };

    }
    componentWillMount() {

    }
    private onChangeText(e) {
        this.setState({ text: e.target.value })
    }
    public render() {

        return <Components.MarkdownEditor content={input} />
        
    }
}
const listData = [
    { value: '0', display: 'item1' },
    { value: '1', display: 'item2' },
]