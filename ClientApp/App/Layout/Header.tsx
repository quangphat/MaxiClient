import * as React from 'react';
import { Avatar } from '../../components';
import * as Utils  from '../../infrastructure/Utils'
import "./header.css";

interface HeaderProps {
}

interface HeaderStates {
    actived: boolean;

}

export default class Header extends React.Component<HeaderProps, HeaderStates> {

    constructor(props: any) {
        super(props)
        this.state = {
            actived: false
        }
    }

    public render() {

        return (
            <header className="main-header">
            <nav className="navbar navbar-static-top">
                <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                    <span className="sr-only">Toggle navigation</span>
                </a>

            </nav>
        </header>
        );
    }
}