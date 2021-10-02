import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classnames from 'classnames';
import './index.css';

export declare type arrowType = 'left' | 'center' | 'right';

interface IDropdownMenuProps {
    fullWidth?: boolean,
    width?: number,
    iconArrow?: arrowType,
    renderItems?: any,
    placement?: string

}

interface IDropdownMenuStates {
    isOpen: boolean,
    dropUp: boolean,
    widthCenter : number
}

export class DropdownMenu extends React.Component<IDropdownMenuProps, IDropdownMenuStates> {
    constructor(props: any) {
        super(props)

        this.state = {
            isOpen: false,
            dropUp: false,
            widthCenter : 0
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleOutsideClick = this.handleOutsideClick.bind(this)
        this.determineDropUp = this.determineDropUp.bind(this)
    }

    static defaultProps = {
        fullWidth: false,
        iconArrow: 'center',
        placement: 'left'
    }

    private node
    private ref_dropdownMenu
    private ref_content
    private mounted = false

    componentDidMount() {
        this.mounted = true
        this.node = ReactDOM.findDOMNode(this);
        window.addEventListener('resize', this.determineDropUp);
        window.addEventListener('scroll', this.determineDropUp);
        this.resetWidth()
    }

    componentWillUnmount() {
        this.mounted = false
        window.removeEventListener('resize', this.determineDropUp);
        window.removeEventListener('scroll', this.determineDropUp);
    }

    determineDropUp() {
        if (!this.node) return;

        const windowHeight = window.innerHeight;
        const menuHeight = this.ref_content.offsetHeight
        const instOffsetWithMenu = this.node.getBoundingClientRect().bottom + menuHeight
        if (this.mounted)
            this.setState({
                dropUp: instOffsetWithMenu >= windowHeight,
            });
    }

    public resetWidth() {
        if (this.ref_content) {
            let width = this.props.width
            
            this.ref_content.style.width = width != null && width > 0
                ? width + 'px'
                : this.ref_content.offsetWidth + 10 + 'px'
        }
    }

    public handleClick() {
        if (!this.state.isOpen){
            let widthCenter = this.ref_content.offsetWidth / 2;

            this.setState({
                widthCenter : widthCenter
            })
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        if (this.mounted)
            this.setState(prevState => ({
                isOpen: !prevState.isOpen
            }))
    }

    handleOutsideClick(this, e) {
        if (this.node && this.node.contains(e.target))
            return;

        this.handleClick();
    }

    public render() {
        let classes = classnames({
            'dropdown': true,
            'droup-popover': this.state.dropUp,
            'ui-popover__container--contains-active-popover': this.state.isOpen,
            'ui-popover-full-width': this.props.fullWidth,
            'ui-popover-arrow-left': this.props.iconArrow == 'left',
            'ui-popover-arrow-right': this.props.iconArrow == 'right',
            'ui-popover-placement-right': this.props.placement == 'right',
            'ui-popover-placement-left': this.props.placement == 'left'
        })

        let styleCenter = {
            left : `-${this.state.widthCenter}px`
        }

        return <div className={classes} ref={component => this.ref_dropdownMenu = component}>
            <div onClick={() => this.handleClick()}>{this.props.children}</div>
            <div className={'ui-popover' + (this.state.isOpen ? ' ui-popover--is-active' : '')} style={(this.props.placement == 'center' && this.props.iconArrow == 'center') ? styleCenter : null}>
                <div className='ui-popover__tooltip'></div>
                <div className='ui-popover__content-wrapper'>
                    <div className='ui-popover__content' ref={component => this.ref_content = component}>
                        <div className='ui-popover__pane'>
                            {this.props.renderItems}
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}