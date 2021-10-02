import * as React from 'react';
import * as H from 'history';
import './index.css';
import * as PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import * as Utils from '../../infrastructure/Utils'
import * as RoutePath from '../../infrastructure/RoutePath'
import { IAccount } from '../../Models/IAccount'
import { INotification } from '../../Models/INotification'
import { AccountRepository } from '../../repositories/AccountRepository'
//import * as SignalR from '../../infrastructure/SignalR'
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from 'react-notifications-component';
import * as MessagesCode from '../../infrastructure/messages.json'
import Header from './Header'
import LeftMenu from './LeftMenu';
export interface MainLayoutProps {
    routerHistory?: H.History
}
interface MainLayoutStates {
    account: IAccount
}
export class Layout extends React.Component<MainLayoutProps, MainLayoutStates> {
    notificationDOMRef: any;
    ref_txtSearch: any;
    constructor(props: any) {
        super(props);
        this.state = {
            account: Utils.GetAccount()
        }
        this.notificationDOMRef = React.createRef();
    }
    componentWillMount() {

    }

    componentWillReceiveProps(newProps: MainLayoutProps) {
        if (this.props.routerHistory.location.pathname != newProps.routerHistory.location.pathname) {

        }
    }
    componentDidMount() {
        this.createSignalrConnection()
    }
    private createSignalrConnection() {
        //if (Utils.isLogin()) {
        //    SignalR.createHubConnection();
        //    SignalR.hubConnection.on('Notify', (Notify) => {
        //        this.ShowMessage('success', "Bài viết của bạn đã được xuất bản");
        //    });
        //}
    }


    private _sendCommentNotify(Notify: INotification) {
        //if (Utils.isLogin()) {
        //    SignalR.hubConnection
        //        .invoke('Notify', Notify).then((response) => {
        //        })
        //        .catch(err => console.error(err));
        //}


    }
    static childContextTypes = {
        ShowMessage: PropTypes.func,
        ShowErrorMessage: PropTypes.func,
        ShowSuccessMessage: PropTypes.func,
        ShowSmartMessage: PropTypes.func,
        _sendCommentNotify: PropTypes.func
    }
    getChildContext() {
        return {
            ShowMessage: this.ShowMessage.bind(this),
            ShowErrorMessage: this.ShowErrorMessage.bind(this),
            ShowSuccessMessage: this.ShowSuccessMessage.bind(this),
            ShowSmartMessage: this.ShowSmartMessage.bind(this),
            _sendCommentNotify: this._sendCommentNotify.bind(this)
        }
    }
    private ShowErrorMessage(this: any, messageCode: string) {
        this.ShowMessage('error', messageCode)
    }
    private ShowSuccessMessage(this: any, messageCode: string) {
        this.ShowMessage('success', messageCode)
    }
    private ShowMessage(this, type: string, messageCode: string) {
        let contentMessage = ''
        let objMess = null
        if (type == 'error')
            objMess = MessagesCode.error.find(p => p.value == messageCode)
        else
            objMess = MessagesCode.success.find(p => p.value == messageCode)
        if (objMess == null) {
            objMess = { display_vi: messageCode };
        }
        if (!Utils.isNullOrUndefined(objMess) && !Utils.isNullOrWhiteSpace(objMess.display_vi))
            contentMessage = objMess.display_vi
        let title = type == 'error' ? 'Lỗi' : ''

        this.notificationDOMRef.addNotification({
            title: title,
            message: contentMessage,
            type: type == "error" ? "danger" : type,
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 5000 },
            dismissable: { click: false }
        });
    }
    private ShowSmartMessage(this: any, type: string, content: JSX.Element) {
        let title = type == 'error' ? 'Lỗi' : ''
        this.notificationDOMRef.addNotification({
            title: title,
            content: content,
            type: type == "error" ? "danger" : type,
            insert: "top",
            container: "bottom-left",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 5000 },
            dismissable: { click: true }
        });
    }

    private onSearch(e) {
        if (e.keyCode === 13)
            this.props.routerHistory.push(`/search?query=${e.target.value}`)
    }
    private renderFooter() {
        return <div className="footer pd_lr_110 flex">
            <div className="flex">
                <NavLink className="text-main" to={RoutePath.Path.legal_term}>
                    Điều khoản
                </NavLink>
                <NavLink target="_blank" className="text-main" to={RoutePath.Path.legal_term}>
                    Phản hồi
                </NavLink>
                <NavLink target="_blank" className="text-main" to={RoutePath.Path.legal_term}>
                    Facebook
                </NavLink>
                <div className="copyright">
                    <span>
                        Copyright © 2019 greencode
                        </span>
                </div>
            </div>
        </div>
    }
    public render() {
        return  <div className="wrapper" style={{"height": "auto","minHeight":"100%"}}>
            <ReactNotification />
            <Header />
            <LeftMenu/>
            <div className="content-wrapper" style={{"minHeight":"916px"}}>
            <section className="content">
                <div className="main-content">
                {this.props.children}
                </div>
            </section>
        </div>
        </div>
    }
}

