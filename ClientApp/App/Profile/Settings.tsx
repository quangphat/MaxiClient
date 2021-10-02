import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { HubConnection } from '@aspnet/signalr';
import './index.css';
import * as Utils from '../../infrastructure/Utils';
import * as Models from '../../Models';
import { Button, CreateSVG, Input, Loading, Modal } from '../../CoreComponents'
import { AccountRepository } from '../../repositories/AccountRepository';
import * as PropTypes from 'prop-types';
import { messagesCode } from '../../infrastructure/messagesCode'
interface ISettingsProps {
    isShow?: boolean,
    person: Models.IAuthor
}
interface ISettingsStates {
    isShow: boolean,
    person: Models.IAuthor,
    isOpenPopupAddExperience: boolean,
    changePassword: Models.IChangePassword
}
export class Settings extends React.Component<ISettingsProps, ISettingsStates> {
    account = Utils.GetAccount();
    constructor(props) {
        super(props);

        this.state = {
            isShow: this.props.isShow,
            person: { ...this.props.person },
            isOpenPopupAddExperience: false,
            changePassword: { currentPass: '', confirmPass: '', newPass:'' }
        };
    }
    static defaultProps = {
        isShow: true
    }
    componentWillMount() {
    }
    componentDidMount() {

    }
    componentWillReceiveProps(newProps: ISettingsProps) {
        if (this.props.isShow != newProps.isShow) {
            this.setState({ isShow: newProps.isShow })
        }
    }
    static contextTypes = {
        ShowMessage: PropTypes.func
    }
    private onClickChangePass() {
        let { changePassword } = this.state
        if (Utils.isNullOrUndefined(changePassword))
            return
        AccountRepository.ChangePass(changePassword).then(response => {
            if (response.success) {
                this.context.ShowMessage("success",messagesCode.success);
            }
            else {
                this.context.ShowMessage("error",response.error.code)
            }
        })
    }
    private renderChangePasswordPopup() {
        return <Modal isOpen={this.state.isOpenPopupAddExperience}
            headerTitle="Đổi mật khẩu"
            isBtnClose={false}
            iconClose={true}
            footerDisabledCloseModal={true}
            onClose={() => this.setState({ isOpenPopupAddExperience: !this.state.isOpenPopupAddExperience })}
            size="lg"
            bodyContent={this.renderChangePassPopupContent()}
            backdrop={true}
            afterCloseModal={() => this.setState({ isOpenPopupAddExperience: false })}
            footerContent={<Button type="primary" className="btn-long" onClick={() => this.onClickChangePass()} >
                <span>Lưu thay đổi</span>
            </Button>}
        >
        </Modal>
    }
    private renderChangePassPopupContent() {
        let { changePassword } = this.state
        return <div className="modal-content-body">
            <div className="mg-b-20">
                <label className="label-input-group">Mật khẩu hiện tại</label>
                <Input type="password" value={!Utils.isNullOrWhiteSpace(changePassword.currentPass) ? changePassword.currentPass : ''}
                    onChange={(e) => this.setState({ changePassword: { ...changePassword, currentPass: e.target.value } })}
                    />
            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Mật khẩu mới</label>
                <Input type="password" value={!Utils.isNullOrWhiteSpace(changePassword.newPass) ? changePassword.newPass : ''}
                    onChange={(e) => this.setState({ changePassword: { ...changePassword, newPass: e.target.value } })}
                     />
            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Xác nhận mật khẩu mới</label>
                <Input type="password" value={!Utils.isNullOrWhiteSpace(changePassword.confirmPass) ? changePassword.confirmPass : ''}
                    onChange={(e) => this.setState({ changePassword: { ...changePassword, confirmPass: e.target.value } })}
                     />
            </div>
            
        </div>
    }

    public render() {
        let { isShow, person } = this.state
        if (Utils.isNullOrUndefined(this.account) || Utils.isNullOrUndefined(person) || this.account.personId != person.id)
            return null;
        if (!isShow)
            return null
        return <div className="experience w-50_per">
            <div className="mg-b-20">
                <label className="label-input-group">Họ và tên</label>
                <Input value={!Utils.isNullOrWhiteSpace(person.displayName) ? person.displayName : ''}
                    onChange={(e) => this.setState({ person: { ...person, displayName: e.target.value } })}
                    placeholder="Tiêu đề" />
            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Email</label>
                <Input value={!Utils.isNullOrWhiteSpace(person.email) ? person.email : ''}
                    onChange={(e) => this.setState({ person: { ...person, email: e.target.value } })}
                    placeholder="Email" />
            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Tên người dùng</label>
                <Input value={!Utils.isNullOrWhiteSpace(person.profileName) ? person.profileName : ''}
                    onChange={(e) => this.setState({ person: { ...person, profileName: e.target.value } })}
                    prefix={`${window.location.origin}/profile/`}
                    placeholder="" />
            </div>
            <div className="form-group text-right">
                <Button type="link-no-pding" className="mr-10" onClick={() => this.setState({ isOpenPopupAddExperience: true })}>
                    Đổi mật khẩu
                </Button>
                <Button type="primary" className="btn-long" >Cập nhật</Button>
            </div>
            {this.renderChangePasswordPopup()}
        </div>
    }
}