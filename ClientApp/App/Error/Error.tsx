import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Utils from '../../infrastructure/Utils';
import './index.css';

export class Error extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);
    }

    static contextTypes = {
        SetBreadcrumb: PropTypes.func
    }

    componentWillMount() {
        window.scrollTo(0, 0);
    }

    public render() {
        return <div className='wrap'>
            <div className="logo">
                <h1>404</h1>
                <p> Sorry - Page not Found!</p>
                <div className="sub">
                    <p><a href="#"> Back to Home</a></p>
                </div>
            </div>
        </div>
    }
}
