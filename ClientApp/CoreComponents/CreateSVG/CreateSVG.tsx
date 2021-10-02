import * as React from 'react';
import * as classnames from 'classnames';
import './index.css';
import * as listIcon from "./listIcon";

interface ICreateSVGProps {
    svgName: string,
    className?: string,
    size: number,
    rotate?: number,
    style?: any
}

export class CreateSVG extends React.Component<ICreateSVGProps, {}> {
    constructor(props: any) {
        super(props)
    }

    convertNameIcon(linkHref) {
        let nameIcon = linkHref

        nameIcon = nameIcon.replace("#", "");
        let nameIconSplit = nameIcon.split("-")
        return nameIconSplit.join("");
    }

    public render() {
        let { className, size, rotate, style } = this.props
        let classes = classnames({
            'svg-next-icon': true,
            [className]: className,
            [`svg-next-icon-size-${size}`]: size,
            [`svg-next-icon-rotate-${rotate}`]: rotate
        })

        if (this.props.svgName != null) {
            return <svg className={classes} style={style} width={size} height={size}>
                {/* <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref={this.props.linkHref}></use> */}
                {listIcon[this.convertNameIcon(this.props.svgName)]}
            </svg>;
        } else {
            return null;
        }

    }
}