import * as React from 'react';
import * as PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { ReactElement } from 'react';


interface BottomScrollProps {
    onBottom: Function,
    debounce?: number,
    offset?: number,
    children?: any,
};

export class ScrollBottom extends React.Component<BottomScrollProps, {}> {
    constructor(props) {
        super(props);

        if (props.debounce) {
            this.handleOnScroll = debounce(this.handleOnScroll.bind(this), props.debounce, { trailing: true });
        } else {
            this.handleOnScroll = this.handleOnScroll.bind(this);
        }
    }
    static defaultProps = {
        debounce: 200,
        offset: 0,
        children: null,
    }
    componentDidMount() {
        document.addEventListener('scroll', this.handleOnScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.handleOnScroll);
    }

    handleOnScroll() {
        const scrollNode = document.scrollingElement || document.documentElement;

        if (scrollNode.scrollHeight - this.props.offset <= scrollNode.scrollTop + window.innerHeight) {
            this.props.onBottom();
        }
    }

    render() {
        return !this.props.children ? null : <div>{this.props.children}</div>;
    }
}

