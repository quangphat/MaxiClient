import * as React from 'react';
import * as classnames from 'classnames';
import './index.css';

export declare type iconSize = 'pico' | 'icon' | 'thumb' | 'small' | 'compact' | 'medium' | 'large' | 'grande' | '1024x1024' | '2048x2048';

interface ILoadingProps {
    size?: iconSize,
    className?: string
}

export class Loading extends React.Component<ILoadingProps, {}> {
    constructor(props: any) {
        super(props)
    }

    static defaultProps = {
        size: 'icon',
        className:''
    }

    renderClassname() {
        let { className } = this.props

        let classBtn = classnames({
            'loading-box': true,
            'loading-pico': this.props.size == 'pico',
            'loading-icon': this.props.size == 'icon',
            'loading-thumb': this.props.size == 'thumb',
            'loading-small': this.props.size == 'small',
            'loading-compact': this.props.size == 'compact',
            'loading-medium': this.props.size == 'medium',
            'loading-large': this.props.size == 'large',
            'loading-grande': this.props.size == 'grande',
            'loading-1024x1024': this.props.size == '1024x1024',
            'loading-2048x2048': this.props.size == '2048x2048'
        });

        if (className)
            classBtn = classnames(classBtn, className)

        return classBtn;
    }

    public render() {
        let classnames = this.renderClassname()

        return <div className={classnames} >
            <div className='loading-main'></div>
        </div>
    }
}