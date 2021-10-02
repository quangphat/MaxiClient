import * as React from 'react';
import './index.css';

export class ImageEmpty extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props)
    }

    public render() {
        return <div className="img-empty"></div>;
    }
}