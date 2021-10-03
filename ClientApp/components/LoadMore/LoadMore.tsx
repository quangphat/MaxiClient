import * as React from 'react';

interface ILoadMoreProps {
    className?: string,
    onClick: Function
}

export class LoadMore extends React.Component<ILoadMoreProps, {}> {
    constructor(props: any) {
        super(props)
    }
    static defaultProps = {
        size: 'icon',
        className: ''
    }

    public render() {

        return <div className={`loadmore-container ${this.props.className}`} onClick={()=>this.props.onClick()}>
            <div className={`btn-loadmore`}>LOAD MORE</div>
        </div>
    }
}