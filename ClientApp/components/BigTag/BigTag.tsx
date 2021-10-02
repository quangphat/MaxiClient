import * as React from "react"
import { RouteComponentProps } from 'react-router';
import { Button } from '../../CoreComponents';
import './index.css'

interface BigTagProps {
    value: string,
    display: string,
    className?: string,
    onChange?: Function
}
interface BigTagStates {
    isActive: boolean
}
export class BigTag extends React.Component<BigTagProps,BigTagStates>{
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        }
    }
    static defaultProps = {
        className: ''
    }
    private onClickFollow() {
        let { isActive } = this.state
        this.setState({ isActive: !isActive }, () => {
            if (this.props.onChange)
                this.props.onChange(this.props.value, this.state.isActive)
        })
    }
    render() {
        let { display, className } = this.props
        let { isActive } = this.state
        className += isActive?'bd-green':''
        return <a className={`btn btn-app ${className}`}>
            <p>{display}</p>
            <Button type="thin" onClick={() => this.onClickFollow()}>
                {isActive ? 'Đang theo dõi' : 'Theo dõi'}
            </Button>
        </a>
    }
}