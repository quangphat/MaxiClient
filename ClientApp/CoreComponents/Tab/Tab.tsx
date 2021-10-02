import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as H from 'history';
import * as Utils from '../../infrastructure/Utils';
import * as PagingHelper from '../../infrastructure/PagingHelpers'
import * as Models from '../../Models'
import './index.css'


interface TabProps {
    tabs: ITab[],
    location: H.Location,
    history: H.History,
    isKeepSelectedTab?: boolean,
    className?: string,
    onClickTab?: Function
}
interface TabStates {
    tabs: ITab[],
    tabId: string
    //paging: PagingHelper.IPaging
}
export class Tab extends React.Component<TabProps, TabStates>{
    paging: Models.IPaging = null
    constructor(props) {
        super(props);
        let tab_id = Utils.getParamSingle(window.location.search, 'tab_id') 
        this.state = {
            tabs: this.props.tabs,
            tabId: Utils.isNullOrWhiteSpace(tab_id) ? this.props.tabs[0].id : tab_id 
        }
    }

    static defaultProps = {
        isKeepSelectedTab: true,
        className:''
    }
    componentWillReceiveProps(nextProps: TabProps) {
        if (this.props.location.search != nextProps.location.search) {
            if (nextProps.isKeepSelectedTab) {
                let search = nextProps.location.search
                this.paging = PagingHelper.parsePaging(search)
                let tabId = Utils.isNullOrWhiteSpace(this.paging.tab_id) ? this.state.tabs[0].id : this.paging.tab_id
                this.setState({ tabId: tabId })
            }
            else {
                let { tabs } = this.state
                this.setState({ tabId: tabs[0].id })
            }
        }
        
    }
    private onClickTab(tabId) {
        if (this.props.isKeepSelectedTab) {
            if (this.paging == null) {
                this.paging = new Object as Models.IPaging
            }
            this.paging.tab_id = tabId
            this.props.history.push({
                pathname: window.location.pathname,
                search: Utils.joinObject(this.paging)
            })
            return
        }
        this.setState({ tabId: tabId })
        if (this.props.onClickTab)
            this.props.onClickTab(tabId)
    }
    public render() {
        let { tabs, tabId } = this.state
        return <div className={`${this.props.className} nav-tabs-custom`}>
            <ul className="nav nav-tabs">
                {tabs.map(tab => {
                    let className = tab.id == tabId ? 'active' : ''
                    return <li key={tab.id} className={className} onClick={() => this.onClickTab(tab.id)}><span>{tab.name}</span></li>
                })}
            </ul>
        </div>
    }
}
export interface ITab {
    name: string,
    hash?: string,
    id: string
}