import * as React from 'react';
import * as H from 'history';
import './index.css';
import * as PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import * as Utils from '../../infrastructure/Utils'
import * as RoutePath from '../../infrastructure/RoutePath'
import * as Components from '../../components'
import { IAccount } from '../../Models/IAccount'
import { INotification } from '../../Models/INotification'
import { AccountRepository } from '../../repositories/AccountRepository'
//import * as SignalR from '../../infrastructure/SignalR'
import ReactNotification from "react-notifications-component";
import { store } from 'react-notifications-component';
import "react-notifications-component/dist/theme.css";
export interface MainLayoutProps {
    routerHistory?: H.History,
    noneLayout: boolean
}
interface MainLayoutStates {
    account: IAccount
}
export class EmptyLayout extends React.Component<MainLayoutProps, MainLayoutStates> {
    notificationDOMRef: any;
    constructor(props: any) {
        super(props);
        this.state = {
            account: Utils.GetAccount()
        }
        this.notificationDOMRef = React.createRef();

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
    private ShowErrorMessage(this: any, message?: string) {
        this.ShowMessage('danger', message)
    }
    private ShowSuccessMessage(this: any, message?: string) {
        this.ShowMessage('success', message)
    }
    private ShowMessage(this: any, type: string, message?: string) {
        let contentMessage = message
        let title = type == 'danger' ? 'Lỗi' : ''
        if (Utils.isNullOrWhiteSpace(message)) {
            if (type == 'danger')
                contentMessage = 'Không thành công'
            if (type == 'success')
                contentMessage = 'Thành công'
        }
        this.notificationDOMRef.addNotification({
            title: title,
            message: contentMessage,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 5000 },
            dismissable: { click: false }
        });
    }
    private ShowSmartMessage(this: any, type: string, content: JSX.Element) {
        let title = type == 'danger' ? 'Lỗi' : ''
        this.notificationDOMRef.addNotification({
            title: title,
            content: content,
            type: type,
            insert: "top",
            container: "bottom-left",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 5000 },
            dismissable: { click: true }
        });
    }
    private Login() {
        let { account } = this.state
        if (Utils.isNullOrUndefined(account)
            || Utils.isNullOrWhiteSpace(account.email)
            || Utils.isNullOrWhiteSpace(account.password)) {
            this.ShowMessage("error", "Email hoặc mật khẩu không đúng")
            return
        }
        AccountRepository.Login({ email: account.email, password: account.password }).then(response => {
            document['account'] = response
            this.createSignalrConnection()
            this.ShowMessage("success", "Đăng nhập thành công")
        })
    }

    private renderNoneLayout() {
        return <div>
            <ReactNotification ref={com => this.notificationDOMRef = com} />
            {this.props.children}
            
        </div>
    }

    public render() {
        return this.renderNoneLayout() 
    }
}

