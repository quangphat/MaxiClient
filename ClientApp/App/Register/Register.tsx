import * as React from "react"
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import * as PropTypes from 'prop-types';
import { MarkdownEditor, HeaderPage, RecommendedTag} from '../../components'
import { Button, CreateSVG, Input, Loading, InputCheckbox} from '../../CoreComponents'
import * as RoutePath from '../../infrastructure/RoutePath'
import * as Models from '../../Models'
import * as Utils from '../../infrastructure/Utils'

import Select from 'react-select';
import './index.css'
import { AccountRepository } from "../../repositories/AccountRepository";
import { Employee } from './Employee'
import {Employer} from './Employer'
interface RegisterStates {
    account: Models.IRegisterModel,
    tabId: string
}
export class Register extends React.Component<RouteComponentProps, RegisterStates>{
    constructor(props) {
        super(props);
        this.state = {
            account: new Object as Models.IRegisterModel,
            tabId: "employee"
        }
    }
    static contextTypes = {
        showLayoutNone: PropTypes.func,
        ShowMessage: PropTypes.func
    }

        public componentWillMount() {
        this.handleProps(this.props, true)
    }
        componentWillReceiveProps(newProps) {
        this.handleProps(newProps)
    }

    private handleProps(props, isInit: boolean = false) {

        if (this.props.location.search != props.location.search || isInit) {
            let tabId = Utils.getParamSingle(props.location.search, 'tabId')
            if (Utils.isNullOrWhiteSpace(tabId))
                tabId = "employee"
            this.setState({ tabId: tabId })

        }
    }

    private async onRegiterSucceed() {

        this.props.history.push(RoutePath.Path.home)
    }
    setActive(tab: string) {
        this.props.history.push({
            pathname: window.location.pathname,
            search: "tabId=" + tab
        })
    }

    render() {

        let tabId = this.state.tabId;
       

        return <div className="container-md px-0 container-grey pt-4 register">

            <div className="button-action">
                <button onClick={this.setActive.bind(this, "employee")} className={Utils.getClass("employee btn", tabId == "employee" ? "actived" : '')}>Employee</button>
                <button onClick={this.setActive.bind(this, "employer")} className={Utils.getClass("employer btn", tabId == "employer" ? "actived" : '')}>Employer</button>
            </div>

            {tabId == "employer" ?
                <Employer onRegisterSucceed={() => this.onRegiterSucceed()} /> : <Employee onRegisterSucceed={() => this.onRegiterSucceed()} />}



            <hr className="hr-line"></hr>
            <div className="text-center px-4 px-md-0 pt-4 policy-text">
                By signing in, I agree to JobBridge's <a href="https://">Terms of Service</a> and <a href="https://">Privacy Policy</a>
            </div>
        </div>
    }
}


