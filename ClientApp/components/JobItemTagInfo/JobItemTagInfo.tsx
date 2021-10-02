import * as React from 'react';

interface IJobItemTagInfoProps {
className?:string,
display:string,
icon?:boolean
}

interface IJobItemTagInfoStates {

}

export class JobItemTagInfo extends React.Component<IJobItemTagInfoProps, IJobItemTagInfoStates> {
    constructor(props: any) {
        super(props)
       
        this.state = {
            

        }


    }


    static defaultProps = {
        className: '',
        icon:false
    }

    componentWillReceiveProps(newProps: IJobItemTagInfoProps) {

    }



    private renderBody() {
        let{display, icon, className} = this.props
        return <div className={`company-detail d-sm-flex ${className}`}>  
       {icon ==true && this.props.children}
       <span className="comp-address">{this.props.display}</span>
    </div>
    }


    public render() {
        return this.renderBody()

    }
}