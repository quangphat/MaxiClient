import * as React from 'react';
import * as classnames from 'classnames';
import './index.css';
import * as ReactDOM from 'react-dom';
interface IPopoverProps {
    className?: string,
    isOpen?: boolean,
    renderHeader?: any,
    renderBody?: any,
    renderFooter?: any,
    handleShowPopover?: Function,
    handleClosePopover?: Function,
    fullWidth?: boolean,
    isBackdrop?: boolean
}

interface IPopoverStates {
    isOpen: boolean,
    isDropup: boolean
}

export class Popover extends React.Component<IPopoverProps, IPopoverStates> {

    // private node
    // private mounted = false
    // ref_myRef: HTMLDivElement;
    private myRef = React.createRef<HTMLDivElement>()
    ref_wrapper: HTMLDivElement;
    ref_content_popover: HTMLDivElement;
    constructor(props: any) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen || false,
            isDropup: false
        }
        this.myRef = React.createRef()
        this.determineDropUp = this.determineDropUp.bind(this)
    }

    private mounted = false
    private node

    static defaultProps = {
        fullWidth: true,
        isBackdrop: true
    }

    // componentWillReceiveProps(newProps) {
    //     if (this.props.isOpen != newProps.isOpen) {
    //         this.setState({
    //             isOpen: newProps.isOpen
    //         })
    //         }, () => this.determineDropUp())
    //     }
    // }

    componentWillReceiveProps(newProps) {
        if (this.props.isOpen != newProps.isOpen) {
            this.setState({
                isOpen: newProps.isOpen
            }, () => this.determineDropUp())
        }
    }

    componentDidMount() {
        this.mounted = true
        this.node = ReactDOM.findDOMNode(this);
        window.addEventListener('resize', this.determineDropUp);
        window.addEventListener('scroll', this.determineDropUp);
    }

    componentWillUnmount() {
        this.mounted = false
        window.removeEventListener('resize', this.determineDropUp);
        window.removeEventListener('scroll', this.determineDropUp);
    }

    determineDropUp = () => {
        if (!this.node) return
        // if (this.props.isNoDropUp) return
        const windowHeight = window.innerHeight;
        const menuHeight = this.ref_content_popover.getBoundingClientRect().height;
        const bottom = windowHeight - this.ref_wrapper.getBoundingClientRect().bottom
        if (this.mounted) {
            this.setState({
                isDropup: bottom <= menuHeight
            });
        }
    }


    public handleShowPopover() {
        this.setState({
            isOpen: true
        })

        if (this.props.handleShowPopover)
            this.props.handleShowPopover()
    }

    public handleClosePopover() {
        this.setState({
            isOpen: false
        })

        if (this.props.handleClosePopover)
            this.props.handleClosePopover()
    }

    public render() {
        let classes = classnames({
            'ui-popover-control': true,
            'ui-popover-dropdown--isOpenning': this.state.isOpen,
            'ui-popover-dropdown--fullWidth': this.props.fullWidth,
            [this.props.className]: this.props.className
        })

        return <div className={classes} ref={comp => this.ref_wrapper = comp}>
            {this.props.children && <div className={this.state.isOpen ? 'position-relative z-index-2' : 'position-relative'}>{this.props.children}</div>}
            <div className={`ui-popover-dropdown ${this.state.isDropup && this.state.isOpen ? 'ui-popover-dropdown-scroll' : 'ui-popover-dropdown-bottom'}`} ref={comp => this.ref_content_popover = comp}>
                <div className='ui-popover-header'>{this.props.renderHeader}</div>
                <div className='ui-popover-body' ref={this.myRef}>{this.props.renderBody}</div>
                <div className='ui-popover-footer'>{this.props.renderFooter}</div>
            </div >
            {(this.state.isOpen && this.props.isBackdrop) && <div className='ui-backdrop-control' onClick={() => this.handleClosePopover()}></div>}
        </div >
    }
}
