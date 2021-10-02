import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as RoutePath from '../../infrastructure/RoutePath'
import { Button } from '../../CoreComponents';
import "./login.css";
import * as Utils from '../../infrastructure/Utils'
import { IAccount } from '../../Models/IAccount'
import * as messagesCode from '../../infrastructure/messagesCode'
import * as PropTypes from 'prop-types';
import { AccountRepository } from '../../repositories/AccountRepository'
import * as CoreComponents from '../../CoreComponents'
interface LoginProps {
}

interface LoginStates {
    account: IAccount
}

export class Login extends React.Component<RouteComponentProps, LoginStates> {

    constructor(props: any) {
        super(props)
        this.state = {
            account: Utils.GetAccount(),
        }
    }
    static contextTypes = {
        ShowMessage: PropTypes.func
    }
    private Login() {

        let { account } = this.state
        if (Utils.isNullOrUndefined(account)
            || Utils.isNullOrWhiteSpace(account.email)
            || Utils.isNullOrWhiteSpace(account.password)) {
            this.context.ShowMessage("error", "Email hoặc mật khẩu không đúng")
            return
        }
        AccountRepository.Login({ email: account.email, password: account.password }).then(response => {
            if (response.error != null) {
                Utils.ShowError(response.error.code)
                return
            }
            if (response.data != null) {
                document['account'] = response.data
                Utils.ShowSuccess(messagesCode.messagesCode.success)
                //this.context.ShowMessage("success", me)
                this.props.history.push(RoutePath.Path.home)
            }
            

        })
    }

    public render() {
        let { account } = this.state
        return (
            <div className="container-md px-0 container-grey">

                <div className="login-area px-4">

                    <button className="btn login-google text-left">
                        <img src={'../../images/google-logo.png'} alt="google-logo" className="d-inline mr-3" />
                        <span>Sign in with Google</span>
                    </button>

                    <div className="signin-area pt-4 mt-2">
                        <div className="head-text pb-10x">Hoặc đăng nhập bằng tài khoản của bạn</div>

                        <div className="signin-form pb-4">
                            <fieldset>
                                <div className="pb-4">
                                    <label className="text-black d-block text-black"><b>Email</b></label>
                                    <CoreComponents.Input type="text" name="email" value={account != null ? account.email : ''}
                                        onChange={(e) => this.setState({ account: { ...this.state.account, email: e.target.value } })} 
                                        placeholder="Enter email" className="w-100 d-block" />
                                </div>
                                <div className="pb-4">
                                    <label className="text-black d-block text-black"><b>Mật khẩu</b></label>
                                    <CoreComponents.Input type="password" name="password" placeholder="Password" className="w-100 d-block" value={account != null ? account.password : ''}
                                        onChange={(e) => this.setState({ account: { ...this.state.account, password: e.target.value } })}/>
                                </div>

                                <Button type="primary" className="btn-primary btn w-100 d-block" onClick={() => this.Login()}>Login </Button>

                            </fieldset>
                        </div>

                        <div className="d-flex justify-content-between action-button">
                            <a className="btn btn-link py-0 pl-0">Quên mật khẩu</a>
                            <a className="btn btn-link py-0 pr-0" href="/register">Tạo tài khoản mới</a>
                        </div>
                    </div>
                </div>

                <hr className="hr-line"></hr>

                <div className="text-center px-4 pt-4 policy-text">
                    By signing in, I aagree to JobBridge's <a href="https://">Terms of Service</a> and <a href="https://">Privacy Policy</a>
                </div>

            </div>
        );
    }
}