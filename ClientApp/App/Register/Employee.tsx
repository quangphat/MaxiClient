import * as React from 'react';
import * as PropTypes from 'prop-types';
import { MarkdownEditor, HeaderPage, RecommendedTag, InputDebounce } from '../../components'
import { Button, CreateSVG, Input, Loading, InputCheckbox } from '../../CoreComponents'
import * as Utils from '../../infrastructure/Utils'
import { IRegisterModel } from '../../Models/IRegisterModel';
import { AccountRepository } from '../../repositories/AccountRepository';
import * as ValidateHelper from '../../infrastructure/ValidateHelper'

interface IEmployeeProps {
    className?: string,
    onRegisterSucceed: Function
}

interface IEmployeeStates {
    model: IRegisterModel
}

export class Employee extends React.Component<IEmployeeProps, IEmployeeStates> {
    constructor(props: any) {
        super(props)

        this.state = {
            model: new Object as IRegisterModel

        }
    }


    static defaultProps = {
        className: ''
    }
    static contextTypes = {
        ShowMessage: PropTypes.func
    }

    private async onRegister() {
        let { model } = this.state

        if (Utils.isNullOrWhiteSpace(model.email)) {
            this.context.ShowMessage("danger", "error_email_must_not_be_empty")
            return
        }
        if (!ValidateHelper.IsValidEmail(model.email)) {
            this.context.ShowMessage("danger", "error_invalid_email")
            return
        }
        if (Utils.isNullOrWhiteSpace(model.displayName)) {
            this.context.ShowMessage("danger", "error_display_name_must_not_be_empty")
            return
        }
        if (!ValidateHelper.isValidPassword(model.password)) {
            this.context.ShowMessage("danger", "error_invalid_password")
            return
        }
        if (model.password != model.confirmPassword) {
            this.context.ShowMessage("danger", "error_password_not_match")
            return
        }
        if (!model.isAcceptPolicy) {
            this.context.ShowMessage("danger", "error_accept_policy")
            return
        }
        let response = await AccountRepository.SignUp(model);

        if (response == null) {
            this.context.ShowMessage("danger", "error_invalid_data")
            return
        }
        if (response.error != null) {
            this.context.ShowMessage("danger", response.error.code)
            return
        }
        this.context.ShowMessage("success", "sign_up_success")

        
        document['account'] = response.data
        this.props.onRegisterSucceed()
        //this.props.history.push(RoutePath.Path.recommend_tags)
    }

    private renderBody() {
        return <div className={Utils.getClass("login-area px-4 employee-login pb-0 actived", this.props.className)}>
            <button className="btn login-google text-left">
                <img src={'../../images/google-logo.png'} alt="google-logo" className="d-inline mr-3" />
                <span>Sign in with Google</span>
            </button>

            <div className="signin-area pt-4 mt-2">
                <div className="signin-form pb-4">
                    <fieldset>
                        <div className="pb-4">
                            <label className="text-black d-block text-black"><b>Họ tên</b></label>
                            <InputDebounce placeholder="Vui lòng nhập họ tên" className="w-100 d-block"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, displayName: val } }) }} />

                        </div>
                        <div className="pb-4">
                            <label className="text-black d-block text-black"><b>Email</b></label>
                            <InputDebounce placeholder="Vui lòng nhập email" className="w-100 d-block"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, email: val } }) }} />

                        </div>

                        <div className="pb-4">
                            <label className="text-black d-block text-black"><b>Mật khẩu</b></label>
                            <InputDebounce placeholder="Vui lòng nhập mật khẩu" className="w-100 d-block" type="password"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, password: val } }) }} />
                           
                        </div>
                        <div className="pb-4">
                            <label className="text-black d-block text-black"><b>Xác nhận mật khẩu</b></label>
                            <InputDebounce placeholder="Xác nhận mật khẩu" className="w-100 d-block" type="password"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, confirmPassword: val } }) }} />
                            
                        </div>
                        <div className="pb-4 cs-color-grey d-flex justify-content-start align-items-center checkbox">
                            <InputCheckbox isChecked={false} nameInput="agreement"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, isAcceptPolicy: val } }) }}
                                content={<b>Đồng ý với <a href="https://">điều khoản sử dụng</a></b>} />
                        </div>

                        <Button type="primary" className="w-100 d-block" onClick={() => this.onRegister()}>Đăng ký</Button>

                    </fieldset>
                </div>
            </div>
        </div>
    }


    public render() {
        return this.renderBody()

    }
}