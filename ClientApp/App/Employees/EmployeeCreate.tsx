import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TeamItem } from '../../components/JobItem/TeamItem'
import { Button, TableList } from '../../CoreComponents'
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
import { LoadMore } from '../../components/LoadMore/LoadMore';
import * as RoutPath from '../../infrastructure/RoutePath'
interface EmployeeCreateStates {
    employee: IUpdateEmployeeModel
}
export class EmployeeCreate extends React.Component<RouteComponentProps<any>, EmployeeCreateStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            employee: {} as IUpdateEmployeeModel

        };

    }

    componentWillReceiveProps(newProps) {

    }


    componentDidMount() {
        
    }




    private onUpdate() {
        let { employee } = this.state
        if (Utils.isNullOrUndefined(employee))
            return
        PersonRepository.Create({ id: employee.id, 
            fullName: employee.fullName, 
            teamId: employee.teamId,
            title:employee.title,
            phone:employee.phone,
            email:employee.email
          } as IUpdateEmployeeModel).then(res => {
            if (res != null && res.success) {

                Utils.ShowSuccess("Thành công")
                this.props.history.push(RoutPath.Path.employee)
            }
            else {
                if (res) {
                    Utils.ShowError(res.error.code)
                }
                else {
                    Utils.ShowError("Không thành công, vui lòng thử lại")
                }
            }

        })
    }

    private renderForm() {
        let { employee } = this.state
        if (Utils.isNullOrUndefined(employee))
            return null
        return <div className="form-group">

            <div className="row mb-50">

                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >Tên</label>
                        <InputDebounce defaultValue={employee.fullName} onChange={(e) => {
                            this.setState({ employee: { ...this.state.employee, fullName: e } })
                        }} />
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >Nhóm</label>
                        <SelectTeam

                            selectedItems={[{ value: '0', label: 'Vui lòng chọn' }]}
                            onChange={(selectedItems, item, e) => {
                                if (Utils.isNullOrUndefined(item)) {
                                    this.setState({
                                        employee: {
                                            ...this.state.employee,teamId: 0,
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
                        <label >Chức danh</label>
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
                        <label >Số điện thoại</label>
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
            <div className="right mb-50"><Button type="primary" onClick={() => { this.onUpdate() }}>Lưu</Button></div>
            <div className="container-md homepage px-md-4">
                {this.renderForm()}
            </div>
        </div>
    }
}
