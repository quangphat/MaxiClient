import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TeamItem } from '../../components/TeamItem/TeamItem'
import { Button, CreateSVG, TableList } from '../../CoreComponents'
import * as Models from '../../Models'
import * as Utils from '../../infrastructure/Utils'
import * as PagingHelpers from '../../infrastructure/PagingHelpers'
import * as PropTypes from 'prop-types';
import { PersonRepository } from '../../repositories/PersonRepository';
import { NavLink } from 'react-router-dom';
import { InputDebounce } from '../../components/InputDebounce/InputDebounce';
import * as RoutPath from '../../infrastructure/RoutePath'
interface EmployeesStates {
    employees: Models.IUSPEmployee[],
    paging: Models.IPaging,
}
export class Employees extends React.Component<RouteComponentProps<any>, EmployeesStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            employees: [],
            paging: PagingHelpers.parsePaging(this.props.location.search) as Models.IPaging
        };

    }

    componentWillReceiveProps(newProps) {
        console.log(newProps)
        Utils.getParamSingle(newProps.location.search, "page")
        let paging = PagingHelpers.parsePaging(newProps.location.search)
        this.setState({ paging: paging }, () => this.getTeam())
    }

    componentWillMount() {
        this.getTeam()
    }
    private getTeam() {
        let { paging, employees } = this.state
        PersonRepository.Search(paging.query, paging.page, paging.limit).then(response => {
            if (response != null && response.data != null) {
                paging.totalRecord = response.data.totalRecord
                paging.hasMore = paging.page * paging.limit >= paging.totalRecord ? false : true
                if (employees == null)
                    employees = [];
                if (Utils.isArrNullOrHaveNoItem(response.data.datas))
                    return
                employees = response.data.datas
                this.setState({ employees: employees, paging: paging })
            }
        })
    }
    private onChangeQuery(query: string) {
        let freeText = PagingHelpers.parseFreeTextQuery(query)
        let { paging } = this.state
        paging.query = freeText
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: Utils.joinObject(paging)
        })
    }

    private renderArticles() {
        let { employees } = this.state
        if (Utils.isArrNullOrHaveNoItem(employees)) return null
        return employees.map(item => {
            return <tr key={item.id}>
                <td><NavLink to={`/employees/${item.id}`}>{item.fullName}</NavLink></td>
                <td>{item.code}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td><NavLink to={`/employees/${item.leaderId}`}>{item.leaderName}</NavLink></td>
                <td><NavLink to={`/teams/${item.teamId}`}>{item.teamName}</NavLink></td>
                <td>{item.createdAt}</td>
            </tr>


        })
    }

    private renderTable() {
        let { employees, paging } = this.state
        //if (Utils.isArrNullOrHaveNoItem(teams)) return null
        return <TableList
            hasPagination={true}
            totalRecord={paging.totalRecord}
            location={this.props.location}
            listData={employees}
            contentEmpty={null}
            type='table-list'
            pathName={''}
            renderTableBody={() => this.renderArticles()}
            dataTableHeader={[
                { title: "Tên", classes: "table-header--name-pic-incl cursor-pointer" },
                { title: "Mã" }, 
                { title: "Email" }, 
                { title: "Số điện thoại" }, 
             { title: "Leader" }, 
             { title: "Nhóm" }, 
             { title: "Ngày tạo" }]} />
    }

    public render() {
console.log(RoutPath.Path.employee_create)
        return <div className="container-md homepage px-md-4">
            <div className="pb-20 d-inline-flex w-100">
                <InputDebounce
                    prefix={<CreateSVG
                        size={18}
                        svgName="iconSearch"
                    />}
                    defaultValue="" onChange={(e) => {
                        this.onChangeQuery(e)
                    }} />
                <Button type="primary"
                 onClick={() => { this.props.history.push(RoutPath.Path.employee_create) }}>Tạo mới</Button>
            </div>
            {this.renderTable()}

        </div>
    }
}
