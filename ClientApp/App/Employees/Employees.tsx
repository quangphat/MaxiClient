import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {  TeamItem } from '../../components/JobItem/TeamItem'
import { Button, TableList } from '../../CoreComponents'
import * as Models from '../../Models'
import * as Utils from '../../infrastructure/Utils'
import * as PagingHelpers from '../../infrastructure/PagingHelpers'
import * as PropTypes from 'prop-types';
import { TeamRepository } from '../../repositories/TeamRepository';
import { NavLink } from 'react-router-dom';
interface EmployeesStates {
    teams: Models.IUSPTeam[],
    paging: Models.IPaging,
}
export class Employees extends React.Component<RouteComponentProps<any>, EmployeesStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            teams: [],
            paging:  PagingHelpers.parsePaging(this.props.location.search) as Models.IPaging
        };

    }

    componentWillReceiveProps(newProps){
        console.log(newProps)
        Utils.getParamSingle(newProps.location.search,"page")
        let paging = PagingHelpers.parsePaging(newProps.location.search)
        this.setState({paging:paging},()=>this.getTeam())
    }

    componentWillMount() {
        this.getTeam()
    }
    private getTeam() {
        let { paging, teams } = this.state
        TeamRepository.Search(null, paging.page, paging.limit).then(response => {
            if (response != null && response.data != null) {
                paging.totalRecord = response.data.totalRecord
                paging.hasMore = paging.page * paging.limit >= paging.totalRecord ? false : true
                if (teams == null)
                teams = [];
                if (Utils.isArrNullOrHaveNoItem(response.data.datas))
                    return
                    teams = response.data.datas
                this.setState({ teams: teams, paging: paging })
            }
        })
    }
    private onClickGetMoreArticle() {
        let { paging } = this.state
        paging.page += 1;
        this.setState({ paging: paging }, () => this.getTeam());
    }
    private renderArticles() {
        let { teams } = this.state
        if (Utils.isArrNullOrHaveNoItem(teams)) return null
        return teams.map(item => {
            return <tr key={item.id}>
                <td><NavLink to={`/teams/${item.id}`}>{item.name}</NavLink></td>
                <td><NavLink to={`/employees/${item.leaderId}`}>{item.leaderName}</NavLink></td>
                <td><NavLink to={`/teams/${item.parentId}`}>{item.parentName}</NavLink></td>
                <td>{item.createdAt}</td>
            </tr>


        })
    }

    private renderTable()
    {
        let { teams,paging } = this.state
        //if (Utils.isArrNullOrHaveNoItem(teams)) return null
        return <TableList
         hasPagination={true} 
         totalRecord={paging.totalRecord}
         location={this.props.location}
         listData={teams}
         contentEmpty={null}
         type='table-list'
         pathName={''}
         renderTableBody={()=>this.renderArticles()}
         dataTableHeader={[{title:"Tên",classes:"table-header--name-pic-incl cursor-pointer"},{title:"Leader"},{title:"Nhóm cha"},{title:"Ngày tạo"}]} />
    }

    public render() {

        return <div className="container-md homepage px-md-4">
           
                    {this.renderTable()}
               
        </div>
    }
}
