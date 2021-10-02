import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TeamItem } from '../../components/JobItem/TeamItem'
import { Button, TableList } from '../../CoreComponents'
import * as Models from '../../Models'
import * as Utils from '../../infrastructure/Utils'
import * as PagingHelpers from '../../infrastructure/PagingHelpers'
import * as PropTypes from 'prop-types';
import { TeamRepository } from '../../repositories/TeamRepository';
import { NavLink } from 'react-router-dom';
import { InputDebounce } from '../../components/InputDebounce/InputDebounce';
interface TeamEditStates {
    team: Models.IUSPTeam
}
export class TeamEdit extends React.Component<RouteComponentProps<any>, TeamEditStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            team: null
        };

    }

    componentWillReceiveProps(newProps) {

    }


    componentDidMount() {
        this.getTeam(this.props.match.params['id'])
    }
    private getTeam(id: number) {
        TeamRepository.GetDetail(id).then(response => {
            if (response != null && response.data != null) {

                this.setState({ team: response.data })
            }
        })
    }

    private renderForm() {
        let { team } = this.state
        if (Utils.isNullOrUndefined(team))
            return null
        return <div className="form-group">
            <div className="row">

                    <div className="col-sm-6 col-12">
                        <div className="form-group">
                            <label >Tên</label>
                            <InputDebounce defaultValue={team.name} onChange={(e) => { }} />
                        </div>
                    </div>
                    <div className="col-sm-6 col-12">
                        <div className="form-group">
                            <label >Leader</label>
                            <InputDebounce defaultValue={team.leaderName} onChange={(e) => { }} />
                        </div>
                    </div>

                </div>
        </div>
    }


    public render() {
        if (Utils.isNullOrUndefined(this.state.team))
            return null
        return <div className="container-md homepage px-md-4">
            {this.renderForm()}
        </div>
    }
}
