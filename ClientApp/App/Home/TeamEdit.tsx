import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TeamItem } from '../../components/TeamItem/TeamItem'
import { Button, Modal, TableList } from '../../CoreComponents'
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
interface TeamEditStates {
    team: Models.IUSPTeam,
    members: Models.IUSPEmployee[],
    paging: IPaging,
    isOpeningPopupDelete: boolean
}
export class TeamEdit extends React.Component<RouteComponentProps<any>, TeamEditStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            team: null,
            isOpeningPopupDelete:false,
            members: [],
            paging: {
                page: 1,
                limit: 10,
                totalRecord: 0,
                hasMore: false
            } as IPaging

        };

    }

    componentWillReceiveProps(newProps) {

    }


    componentDidMount() {
        this.getTeam(this.props.match.params['id'])
        this.getTeamMembers()
    }
    private getTeam(id: number) {
        TeamRepository.GetDetail(id).then(response => {
            if (response != null && response.data != null) {

                this.setState({ team: response.data })
            }
            else
            {
                this.props.history.push(RoutPath.Path.home)
            }
        })
    }

    private onClickGetMore() {
        let { paging } = this.state
        paging.page += 1;
        this.setState({ paging: paging }, () => this.getTeamMembers());
    }

    private getTeamMembers() {
        let { paging, members } = this.state
        TeamRepository.GetTeamMembers(this.props.match.params['id'],
            paging.page,
            paging.limit).then(res => {
                if (res != null && res.success) {
                    paging.totalRecord = res.data.totalRecord
                    paging.hasMore = paging.page * paging.limit >= paging.totalRecord ? false : true
                    if (Utils.isArrNullOrHaveNoItem(members))
                        members = []
                    if (!Utils.isArrNullOrHaveNoItem(res.data.datas)) {
                        members = members.concat(res.data.datas)
                    }
                    this.setState({ members: members })
                }

            })
    }

    private onUpdateTeam() {
        let { team } = this.state
        if (Utils.isNullOrUndefined(team))
            return
        TeamRepository.UpdateTeam({ id: team.id, name: team.name, parentId: team.parentTeamId, leaderId: team.leaderId } as IUpdateTeamModel).then(res => {
            if (res != null && res.success) {

                Utils.ShowSuccess("Thành công")
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

    private onDelete() {
        TeamRepository.Delete(this.state.team.id).then(res => {
            if (res != null && res.success) {

                this.setState({ isOpeningPopupDelete: false })
                Utils.ShowSuccess("Thành công")
                this.props.history.push(RoutPath.Path.home)
            }
            else {
                this.setState({ isOpeningPopupDelete: false })
                if (res) {
                    Utils.ShowError(res.error.code)
                }
                else {
                    Utils.ShowError("Không thành công, vui lòng thử lại")
                }
            }

        })
    }
    renderTeamMember() {
        let { members } = this.state
        if (Utils.isArrNullOrHaveNoItem(members))
            return null

        return <div>
            <div className="mb-20"><b>Thành viên team</b></div>
            <div className="row mt-5">

                {members.map(item => {
                    return <div key={item.id} className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-3">
                        <MemberItem member={item}
                            isSelected={false}
                        />
                    </div>
                })}
                <div className="text-center">{this.state.paging.hasMore && <LoadMore onClick={() => this.onClickGetMore()} />}</div>
            </div>
        </div>
    }

    
    renderDeletePopup() {
        if (this.state.team == null)
            return
        return <Modal isOpen={this.state.isOpeningPopupDelete}
            isBtnClose={false}
            footerDisabledCloseModal={true}
            headerTitle={"Xóa nhóm"}
            onClose={() => this.setState({ isOpeningPopupDelete: false })}
            bodyContent={
                <div className="py-20 px-10 text-secondary">
                    Bạn có chắc chắn muốn xóa nhóm này? Hành động sẽ không thể phục hồi
                </div>
            }
            footerContent={
                <div className="row">
                    <div className="col text-right">
                        <Button onClick={() => this.setState({ isOpeningPopupDelete: false })} type='default' className="mr-3">
                            Hủy
                        </Button>
                        <Button type='danger' onClick={() => this.onDelete()} className='photo-overlay-actions__link'>
                            Xóa
                        </Button>
                    </div>
                </div>
            }
        >

        </Modal>
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

                            selectedItems={[{ value: team.parentTeamId.toString(), label: team.parentName }]}
                            onChange={(selectedItems, item, e) => {
                                if (Utils.isNullOrUndefined(item)) {
                                    this.setState({
                                        team: {
                                            ...this.state.team, parentTeamId: 0,
                                        }
                                    })
                                    return
                                }
                                this.setState({ team: { ...this.state.team, parentTeamId: item.value } })
                            }}
                        />
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <div className="form-group">
                        <label >Leader</label>
                        <SelectEmployee
                            selectedItems={[{ value: team.id.toString(), label: team.leaderName }]}
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
            <div className="right mb-50"></div>
        </div>

    }


    public render() {
        if (Utils.isNullOrUndefined(this.state.team))
            return null
        return <div>
            <div className="right mb-50">
                <Button type="primary" onClick={() => { this.onUpdateTeam() }}>Lưu</Button>
                <Button type="danger" onClick={() => { this.setState({isOpeningPopupDelete:true}) }}>Xóa</Button>
                </div>
            <div className="container-md homepage px-md-4">
                {this.renderForm()}
                
                {this.renderTeamMember()}
                {this.renderDeletePopup()}
            </div>
            
        </div>
    }
}
