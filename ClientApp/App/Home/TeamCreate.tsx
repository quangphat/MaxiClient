import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TeamItem } from '../../components/TeamItem/TeamItem'
import { Button, TableList } from '../../CoreComponents'
import * as Models from '../../Models'
import * as Utils from '../../infrastructure/Utils'
import * as PagingHelpers from '../../infrastructure/PagingHelpers'
import * as PropTypes from 'prop-types';
import { TeamRepository } from '../../repositories/TeamRepository';
import { NavLink } from 'react-router-dom';
import { InputDebounce } from '../../components/InputDebounce/InputDebounce';
import { SelectEmployee } from '../../components/SelectionEmployee/SelectionEmployee';
import { SelectTeam } from '../../components/SelectTeam/SelectTeam';
import { MemberItem } from '../../components/MemberItem/MemberItem'
import { IPaging, IUpdateTeamModel } from '../../Models';
import { LoadMore } from '../../components/LoadMore/LoadMore';
import * as RoutPath from '../../infrastructure/RoutePath'
interface TeamCreateStates {
    team: Models.IUpdateTeamModel
}
export class TeamCreate extends React.Component<RouteComponentProps<any>, TeamCreateStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            team: {} as IUpdateTeamModel
        };

    }

    componentWillReceiveProps(newProps) {

    }


    componentDidMount() {
       
    }

    private onUpdateTeam() {
        let { team } = this.state
        if (Utils.isNullOrUndefined(team))
            return
        TeamRepository.CreateTeam(team).then(res => {
            if (res != null && res.success) {

                Utils.ShowSuccess("Thành công")
                this.props.history.push(RoutPath.Path.home)
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
        let { team } = this.state
        if (Utils.isNullOrUndefined(team))
            return null
        return <div className="form-group">

            <div className="row mb-50">

                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >Tên</label>
                        <InputDebounce defaultValue={team.name} onChange={(e) => {
                            this.setState({ team: { ...this.state.team, name: e } })
                        }} />
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >Nhóm cha</label>
                        <SelectTeam

                            selectedItems={[{ value: '0', label: 'Vui lòng chọn' }]}
                            onChange={(selectedItems, item, e) => {
                                if (Utils.isNullOrUndefined(item)) {
                                    this.setState({
                                        team: {
                                            ...this.state.team, parentId: 0,
                                        }
                                    })
                                    return
                                }
                                this.setState({ team: { ...this.state.team, parentId: item.value } })
                            }}
                        />
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label>Leader</label>
                        <SelectEmployee
                            selectedItems={[{ value: '0', label: 'Vui lòng chọn' }]}
                            onChange={(selectedItems, item, e) => {
                                if (Utils.isNullOrUndefined(item)) {
                                    this.setState({
                                        team: {
                                            ...this.state.team, leaderId: 0,
                                        }
                                    })
                                    return
                                }
                                this.setState({ team: { ...this.state.team, leaderId: item.value } })
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>

    }


    public render() {

        return <div>
            <div className="right mb-50"><Button type="primary" onClick={() => { this.onUpdateTeam() }}>Lưu</Button></div>
            <div className="container-md homepage px-md-4">
                {this.renderForm()}
            </div>
        </div>
    }
}
