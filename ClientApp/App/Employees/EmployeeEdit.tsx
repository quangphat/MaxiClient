import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TeamItem } from '../../components/TeamItem/TeamItem'
import { Button, Input, Modal, TableList } from '../../CoreComponents'
import * as Models from '../../Models'
import * as Utils from '../../infrastructure/Utils'
import * as PagingHelpers from '../../infrastructure/PagingHelpers'
import * as PropTypes from 'prop-types';
import { TeamRepository } from '../../repositories/TeamRepository';
import { PersonRepository } from '../../repositories/PersonRepository';
import { NavLink } from 'react-router-dom';
import { InputDebounce } from '../../components/InputDebounce/InputDebounce';
import { SelectEmployee } from '../../components/SelectionEmployee/SelectionEmployee';
import { SelectTeam } from '../../components/SelectTeam/SelectTeam';
import { MemberItem } from '../../components/MemberItem/MemberItem'
import { IPaging, IUpdateEmployeeModel, IUpdateTeamModel } from '../../Models';
import * as RoutPath from '../../infrastructure/RoutePath'
import * as ValidateHelpers from '../../infrastructure/ValidateHelper'
interface EmployeeEditStates {
    employee: Models.IUSPEmployee,
    isOpeningPopupDelete: boolean
}
export class EmployeeEdit extends React.Component<RouteComponentProps<any>, EmployeeEditStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            employee: null,
            isOpeningPopupDelete: false

        };

    }

    componentWillReceiveProps(newProps) {

    }


    componentDidMount() {
        this.getEmployee(this.props.match.params['id'])
    }
    private getEmployee(id: number) {
        PersonRepository.GetDetail(id).then(response => {
            if (response != null && response.data != null) {

                this.setState({ employee: response.data })
            }
            else {
                this.props.history.push(RoutPath.Path.employee)
            }
        })
    }



    private onUpdate() {
        let { employee } = this.state
        if (Utils.isNullOrUndefined(employee))
            return

        if (!Utils.isNullOrWhiteSpace(employee.email)) {
            if (!ValidateHelpers.IsValidEmail(employee.email)) {
                Utils.ShowError("Email kh??ng h???p l???")
                return
            }

        }
        PersonRepository.Update({
            id: employee.id,
            fullName: employee.fullName,
            teamId: employee.teamId,
            title: employee.title,
            phone: employee.phone,
            email: employee.email
        } as IUpdateEmployeeModel).then(res => {
            if (res != null && res.success) {

                Utils.ShowSuccess("Th??nh c??ng")
            }
            else {
                if (res) {
                    Utils.ShowError(res.error.code)
                }
                else {
                    Utils.ShowError("Kh??ng th??nh c??ng, vui l??ng th??? l???i")
                }
            }

        })
    }

    private onDelete() {
        PersonRepository.Delete(this.state.employee.id).then(res => {
            if (res != null && res.success) {

                this.setState({ isOpeningPopupDelete: false })
                Utils.ShowSuccess("Th??nh c??ng")
                this.props.history.push(RoutPath.Path.employee)
            }
            else {
                this.setState({ isOpeningPopupDelete: false })
                if (res) {
                    Utils.ShowError(res.error.code)
                }
                else {
                    Utils.ShowError("Kh??ng th??nh c??ng, vui l??ng th??? l???i")
                }
            }

        })
    }

    renderDeletePopup() {
        if (this.state.employee == null)
            return
        return <Modal isOpen={this.state.isOpeningPopupDelete}
            isBtnClose={false}
            footerDisabledCloseModal={true}
            headerTitle={"X??a nh??n vi??n"}
            onClose={() => this.setState({ isOpeningPopupDelete: false })}
            bodyContent={
                <div className="py-20 px-10 text-secondary">
                    B???n c?? ch???c ch???n mu???n x??a nh??n vi??n n??y? H??nh ?????ng s??? kh??ng th??? ph???c h???i
                </div>
            }
            footerContent={
                <div className="row">
                    <div className="col text-right">
                        <Button onClick={() => this.setState({ isOpeningPopupDelete: false })} type='default' className="mr-3">
                            H???y
                        </Button>
                        <Button type='danger' onClick={() => this.onDelete()} className='photo-overlay-actions__link'>
                            X??a
                        </Button>
                    </div>
                </div>
            }
        >

        </Modal>
    }

    private renderForm() {
        let { employee } = this.state
        if (Utils.isNullOrUndefined(employee))
            return null
        return <div className="form-group">

            <div className="row mb-50">

                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >T??n</label>
                        <InputDebounce defaultValue={employee.fullName} onChange={(e) => {
                            this.setState({ employee: { ...this.state.employee, fullName: e } })
                        }} />
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >Nh??m</label>
                        <SelectTeam

                            selectedItems={[{ value: employee.teamId.toString(), label: employee.teamName }]}
                            onChange={(selectedItems, item, e) => {
                                if (Utils.isNullOrUndefined(item)) {
                                    this.setState({
                                        employee: {
                                            ...this.state.employee, teamId: 0,
                                        }
                                    })
                                    return
                                }
                                this.setState({ employee: { ...this.state.employee, teamId: item.value } })
                            }}
                        />
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >M?? nh??n vi??n</label>
                        <Input value={employee.code} isReadOnly={true} onChange={() => { }} />
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >Ch???c danh</label>
                        <InputDebounce defaultValue={employee.title} onChange={(e) => {
                            this.setState({ employee: { ...this.state.employee, title: e } })
                        }} />
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >Email</label>
                        <InputDebounce defaultValue={employee.email} onChange={(e) => {
                            this.setState({ employee: { ...this.state.employee, email: e } })
                        }} />
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >S??? ??i???n tho???i</label>
                        <InputDebounce defaultValue={employee.phone} onChange={(e) => {
                            this.setState({ employee: { ...this.state.employee, phone: e } })
                        }} />
                    </div>
                </div>
            </div>
        </div>

    }


    public render() {
        if (Utils.isNullOrUndefined(this.state.employee))
            return null
        return <div>
            <div className="right mb-50">
                <Button type="primary" onClick={() => { this.onUpdate() }}>L??u</Button>
            </div>
            <div className="container-md homepage px-md-4">
                {this.renderForm()}
            </div>
            <div className="right mb-50">
                <Button type="danger" onClick={() => { this.setState({ isOpeningPopupDelete: true }) }}>X??a</Button>
            </div>
            {this.renderDeletePopup()}
        </div>
    }
}
