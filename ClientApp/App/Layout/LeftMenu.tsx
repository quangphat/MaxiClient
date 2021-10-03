import * as React from 'react';
import { NavLink } from 'react-router-dom';


interface LeftMenuProps {
}

interface LeftMenuStates {
    actived: boolean;

}

export default class LeftMenu extends React.Component<LeftMenuProps, LeftMenuStates> {

    constructor(props: any) {
        super(props)
        this.state = {
            actived: false
        }
    }

    toggleMenu = (evt) => {
        let isToggled = this.state.actived;
        this.setState({ actived: !isToggled });
    }

    public render() {
        return (
            <aside className="main-sidebar">
            <section className="sidebar" style={{"height":"auto;"}}>

                <ul className="sidebar-menu tree" data-widget="tree">
                    <li className="header">MAIN NAVIGATION</li>
                    <li className="active treeview menu-open">
                        <a href="#">
                            <i className="fa fa-dashboard"></i> <span>Dashboard</span>
                            <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                            </span>
                        </a>
                        <ul className="treeview-menu">
                            <li className="active"><NavLink to="/"><i className="fa fa-circle-o"></i> Teams</NavLink></li>
                            <li><NavLink to="/employees"><i className="fa fa-circle-o"></i>Nhân viên</NavLink></li>
                        </ul>
                    </li>

                  
                </ul>
            </section>
        </aside>
        );
    }
}