import * as React from 'react';

//export declare type imageSize = 'pico' | 'icon' | 'thumb' | 'small' | 'compact' | 'medium' | 'large' | 'grande' | '1024x1024' | '2048x2048' | 'master';

interface ImageResizeProps {
    //size: imageSize,
    src: string,
    className?: string,
    alt?: string,
    title?: string,
    imageError?: string
}

interface IImageResizeStates {
    src: string
}

export class ImageResize extends React.Component<ImageResizeProps, IImageResizeStates> {
    constructor(props: any) {
        super(props)
        this.state = {
            src: this.props.src
        }
    }

    img: any

    static defaultProps = {
        imageError: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAIAAAAErfB6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDFERTExOTc2NDVCMTFFNjhFRTc4MjEzODAzNEEwQzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDFERTExOTg2NDVCMTFFNjhFRTc4MjEzODAzNEEwQzkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MURFMTE5NTY0NUIxMUU2OEVFNzgyMTM4MDM0QTBDOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MURFMTE5NjY0NUIxMUU2OEVFNzgyMTM4MDM0QTBDOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PseXvQcAAAgnSURBVHja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'
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.src != nextProps.src) {
            this.setState({ src: nextProps.src })
        }
    }

    changeSizeImage(src: string) {
        const matchs = src.match(/(.+)\.(jpg|jpeg|png|gif)$/i);
        if (!matchs) {
            return src;
        }
        const name = matchs[1].replace('http:', '');
        const ext = matchs[2];
        //const size = this.props.size;
        const size = '';
        return `${name}${size}.${ext}`;
    }

    public render() {
        let src = this.changeSizeImage(this.state.src);

        return <img src={src}
            ref={img => this.img = img}
            alt={this.props.alt}
            title={this.props.title}
            className={this.props.className}
            onError={() => this.img.src = this.props.imageError}
        />;
    }
}