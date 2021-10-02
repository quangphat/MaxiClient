import * as React from 'react'
import * as classnames from 'classnames';
import './index.css'
export declare type IBadgeType = 'blue' | 'aqua' | 'green' | 'red' | 'orrange' |'grey'
interface BadgeProps {
    type?: IBadgeType,
    content: string,
    className?:string
}
interface BadgeStates {
    
}
export class Badge extends React.Component<BadgeProps, BadgeStates>{
    constructor(props) {
        super(props);
        this.state = {}
    }

    static defaultProps = {
        type: 'blue',
        className:''
    }
    render() {
        let { type, content, className } = this.props
        let classes = classnames({
            'bg-blue': type == 'blue',
            'bg-green': type == 'green',
            'bg-aqua': type == 'aqua',
            'bg-red': type == 'red',
            'bg-orrange': type == 'orrange',
            'bg-grey': type == 'grey',
            [className]: className,
        })
        return <span className={`badge ${classes}`}>
            {content}
        </span>
    }
}