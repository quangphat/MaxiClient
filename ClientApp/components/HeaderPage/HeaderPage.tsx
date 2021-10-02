import * as React from 'react';
import './index.css'
interface HeaderPageProps {
    body?: JSX.Element
}
interface HeaderPageStates {
   
}
export class HeaderPage extends React.Component<HeaderPageProps, HeaderPageStates> {
    constructor(props: any) {
        super(props);


    }
    componentWillMount() {
       
    }
   
    public render() {
        return <div className='ui-title-bar-container mb-5'>
            <div className='row align-items-start'>
                <div className="col"><div className="row"></div> </div>
                <div className="col-auto">
                    {this.props.children}
                </div>
                
            </div>
        </div>
    }
}
