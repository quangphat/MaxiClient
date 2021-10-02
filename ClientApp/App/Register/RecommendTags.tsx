import * as React from "react"
import { RouteComponentProps } from 'react-router';
import * as PropTypes from 'prop-types';
import { MarkdownEditor, HeaderPage, BigTag } from '../../components'
import { Button, CreateSVG, Input, Loading } from '../../CoreComponents'
import * as Utils from '../../infrastructure/Utils'
import * as Models from '../../Models'
import { AccountRepository } from "../../repositories/AccountRepository";
import './index.css'
interface RecommendTagsStates {
    tags:string[]
}
export class RecommendTags extends React.Component<RouteComponentProps,RecommendTagsStates>{
    constructor(props) {
        super(props);
        this.state = {
            tags:[]
        }
    }
    static contextTypes = {
        showLayoutNone: PropTypes.func,
        ShowMessage: PropTypes.func
    }
    componentWillMount() {
        this.context.showLayoutNone(true)
    }
    private onClickFollow(value: string, isFollow: boolean) {
        if (Utils.isNullOrWhiteSpace(value)) return
        let { tags } = this.state
        let index = tags.findIndex(p => p == value)
        if (index < 0) {
            tags.push(value)
            this.setState({ tags })
            return
        }
        if (!isFollow) {
            tags.splice(index, 1);
            this.setState({ tags })
            return
        }
    }
    private async onClickFinish() {
        let { tags } = this.state
        let account = Utils.GetAccount()
        let model = {
            Values: tags
        } as Models.StringModel
        let response = await AccountRepository.SelectTags(model, account.personId)
        if (response == null) {
            this.context.ShowMessage("danger", "error_invalid_data")
            return
        }
        if (response.error != null) {
            this.context.ShowMessage("danger", response.error.code)
            return
        }
        this.context.ShowMessage("success", "success")
        this.props.history.push("/")
    }
    render() {
        return <div><div className="ui page grid headline">
            <div className="center aligned column">
                <div className="ui small steps">
                    <div className="ui disable step">
                        Đăng ký
                    </div>
                    <div className="ui active step">
                        Chủ đề
                    </div>
                </div>
            </div>
        </div>
            <div className="ui page grid content">
                <div className="four wide column left-side"></div>
                <div className="eight wide column center-frame">
                    <br />
                    <h1 className="ui center aligned teal header logo text-green">
                        Green Code
                    </h1>
                    <div className="row">
                        <BigTag display=".NET" value='.net' onChange={(value, isFollow) => this.onClickFollow(value, isFollow)} />
                        <BigTag display="Android" value='android' onChange={(value, isFollow) => this.onClickFollow(value, isFollow)}  />
                        <BigTag display="Java" value='java' onChange={(value, isFollow) => this.onClickFollow(value, isFollow)}  />
                        <BigTag display="Javascript" value='javascript' onChange={(value, isFollow) => this.onClickFollow(value, isFollow)}  />
                        <BigTag display="Hướng dẫn" value='tutorial' onChange={(value, isFollow) => this.onClickFollow(value, isFollow)}  />
                    </div>
                        
                   
                    <div className="form-group">
                        <Button type="primary" onClick={() => this.onClickFinish()} className="pull-right" >Hoàn tất</Button>
                    </div>
                </div>
            </div>
        </div>
    }
}