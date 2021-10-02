import * as React from 'react';
import { MarkdownEditor, HeaderPage, RecommendedTag, JobSkillTag, SelectLocations, InputDebounce, SelectLocation } from '../../components'
import { Button, CreateSVG, Input, Loading, InputCheckbox } from '../../CoreComponents'
import * as Utils from '../../infrastructure/Utils'
import * as ValidateHelper from '../../infrastructure/ValidateHelper'
import { ICompanyRegister } from '../../Models/ICompanyRegister';
import { SelectIndustry } from '../../components/SelectIndustry/SelectIndustry';
import { ISelectItem } from '../../Models';
import { AccountRepository } from '../../repositories/AccountRepository';

interface IEmployerProps {
    className?: string
    onRegisterSucceed?: Function
}

interface IEmployerStates {
    model: ICompanyRegister
}

export class Employer extends React.Component<IEmployerProps, IEmployerStates> {
    constructor(props: any) {
        super(props)

        this.state = {

            model: new Object as ICompanyRegister
        }


    }


    static defaultProps = {
        className: ''
    }


    private async onRegister() {
        let { model } = this.state

        if (!ValidateHelper.IsValidObject(model)) {

            return
        }

        //if (Utils.isNullOrWhiteSpace(model.email)) {
        //    Utils.ShowError("error_email_must_not_be_empty")
        //    return
        //}
        //if (!ValidateHelper.IsValidEmail(model.email)) {
        //    Utils.ShowError("error_invalid_email")
        //    return
        //}
        //if (Utils.isNullOrWhiteSpace(model.displayName)) {
        //    Utils.ShowError("error_display_name_must_not_be_empty")
        //    return
        //}
        //if (!ValidateHelper.isValidPassword(model.password)) {
        //    Utils.ShowError("error_invalid_password")
        //    return
        //}

        //if (model.password != model.confirmPassword) {
        //    Utils.ShowError("error_password_not_match")
        //    return
        //}


        //if (!model.isAcceptPolicy) {
        //    Utils.ShowError("error_accept_policy")
        //    return
        //}
        let response = await AccountRepository.EmployerSignup(model);

        if (response == null) {
            Utils.ShowError("error_invalid_data")
            return
        }
        if (response.error != null) {
            Utils.ShowError(response.error.code)
            return
        }
        Utils.ShowError("sign_up_success")


        document['account'] = response.data
        //this.props.onRegisterSucceed()
        //this.props.history.push(RoutePath.Path.recommend_tags)
    }

    private renderInputAddress() {

        let { model } = this.state
        if (Utils.isNullOrUndefined(model.headquarter))
            return null

        return <div className="el-info" >
            <label><b>Địa chỉ</b></label>
            <div className="w-100 right-el d-flex justify-content-start align-items-center">
                <InputDebounce
                    className="d-inline-block w-100 right-el"
                    onChange={(value) => {
                        model.headquarter.address = value
                        this.setState({ model: { ...this.state.model, headquarter: model.headquarter } })
                    }} />
            </div>
        </div >
    }

    private renderBody() {
        return <div className={Utils.getClass("login-area px-4 employer-login pb-0 actived", this.props.className)}>
            <div className="signin-area">
                <div className="signin-form pb-4">
                    <div className="heading-text text-center text-md-left">Thông tin đăng nhập</div>
                    <fieldset>
                        <div className="el-info">
                            <label><b>Email</b></label>
                            <InputDebounce placeholder="Vui lòng nhập email công ty" className="d-inline-block w-100 right-el"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, email: val } }) }} />

                        </div>



                        <div className="el-info">
                            <label><b>Mật khẩu</b></label>
                            <InputDebounce placeholder="Vui lòng nhập mật khẩu" type="password" className="d-inline-block w-100 right-el"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, password: val } }) }} />

                        </div>

                        <div className="el-info">
                            <label><b>Xác nhận mật khẩu</b></label>
                            <InputDebounce placeholder="Vui lòng nhập lại mật khẩu" type="password" className="d-inline-block w-100 right-el"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, confirmPassword: val } }) }} />

                        </div>
                    </fieldset>
                    <div className="heading-text text-center text-md-left pt-4 mt-4">Thông tin công ty</div>

                    <fieldset>
                        <div className="el-info">
                            <label><b>Tên công ty</b></label>
                            <InputDebounce placeholder="Vui lòng nhập tên công ty" type="text" className="d-inline-block w-100 right-el"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, displayName: val } }) }} />

                        </div>
                        <div className="el-info">
                            <label><b>Số điện thoại</b></label>
                            <InputDebounce placeholder="Vui lòng nhập số điện thoại công ty" className="d-inline-block w-100 right-el"
                                onChange={(val) => { this.setState({ model: { ...this.state.model, phone: val } }) }} />

                        </div>

                        <div className="el-info">
                            <label><b>Lĩnh vực hoạt động</b></label>
                            <div className="w-100 right-el d-flex justify-content-start align-items-center">
                                <SelectIndustry className="basic-multi-select" onChange={(items: ISelectItem[]) => {
                                    if (!Utils.isNullOrUndefined(items)) {
                                        this.setState({ model: { ...this.state.model, industry: { code: items[0].value, display: items[0].label } } })
                                    }
                                    else {
                                        this.setState({
                                            model: {
                                                ...this.state.model, headquarter: null

                                            }
                                        })
                                    }

                                }} />
                            </div>
                        </div>

                        <div className="el-info">
                            <label><b>Kỹ năng bạn tìm kiếm</b></label>
                            <div className="w-100 right-el d-flex justify-content-start align-items-center">
                                {<JobSkillTag skills={[]} readOnly={false} className="basic-multi-select" onChange={(items: ISelectItem[]) => {
                                    if (!Utils.isNullOrUndefined(items)) {
                                        this.setState({ model: { ...this.state.model, skills: Utils.convertSelectItemsToOptionSimple(items) } })
                                    }

                                }} />}
                            </div>
                        </div>

                        <div className="el-info">
                            <label><b>Trụ sở</b></label>
                            <div className="w-100 right-el d-flex justify-content-start align-items-center">
                                {<SelectLocations selectedLocations={[]} isDataChange={false}
                                    isMulti={false}
                                    showAddress={true}
                                    onChange={(items: ISelectItem[]) => {

                                        if (!Utils.isNullOrUndefined(items)) {
                                            this.setState({
                                                model: {
                                                    ...this.state.model, headquarter:
                                                        { code: items[0].value, display: items[0].label, address: '' }
                                                }
                                            })
                                        }
                                        else {
                                            this.setState({
                                                model: {
                                                    ...this.state.model, headquarter: null

                                                }
                                            })
                                        }

                                    }}
                                    className="basic-multi-select" isSelectSingle={true} />}
                            </div>

                        </div>
                        {this.renderInputAddress()}
                        <div className="el-info">
                            <label></label>
                            <div className="d-inline-block w-100 right-el">
                                <InputCheckbox isChecked={false} nameInput="agreement" classContent='w-100'
                                    onChange={(val) => { this.setState({ model: { ...this.state.model, isAcceptPolicy: val } }) }}
                                    content={<b>Đồng ý với <a href="https://">điều khoản sử dụng</a></b>} />
                            </div>
                        </div>

                    </fieldset>
                    <div className="el-info">
                        <label></label>
                        <div className="d-inline-block w-100 right-el">
                            <Button type="primary" className="w-100 d-block submit-button" onClick={() => this.onRegister()}>Đăng ký</Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    }


    public render() {
        return this.renderBody()

    }
}

const skill_list = [
    { value: '001', label: 'HTML5' },
    { value: '002', label: 'Swift' },
    { value: '003', label: 'Agile' },
    { value: '004', label: 'Scrum master' },
    { value: '005', label: 'React' },
    { value: '006', label: 'React Native' },
    { value: '007', label: 'Angular' },
    { value: '008', label: 'Nodejs' },
    { value: '009', label: 'Hyrid' }
];