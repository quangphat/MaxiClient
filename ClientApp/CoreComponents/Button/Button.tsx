import * as React from 'react';
import { NavLink } from 'react-router-dom';
import * as classnames from 'classnames';
import './index.css';
export declare type IElementButtonType = 'submit' | 'button'
export declare type IButtonType = 'primary' | 'secondary' | 'default' | 'danger' | 'link' | 'link-no-pding' | 'clean' | 'thin'
export declare type ITargetType = '_blank' | '_self' | '_parent' | '_top'

interface IButtonProps {
    type?: IButtonType,
    elementType?: IElementButtonType,
    id?: string,
    className?: string,
    href?: any,
    target?: ITargetType,
    isDisabled?: boolean,
    onClick?: Function,
    btnLoading?: boolean
}

interface IButtonStates {
    isDisabled: boolean,
    asyncState: any,
    isUnmounted: boolean
}

export class Button extends React.Component<IButtonProps, IButtonStates> {
    constructor(props: any) {
        super(props)

        this.state = {
            isDisabled: this.props.isDisabled || false,
            asyncState: null,
            isUnmounted: false
        }

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    static defaultProps = {
        elementButtonType: 'button'
    }

    componentWillReceiveProps(newProps) {
        if (this.props.btnLoading != newProps.btnLoading || this.props.isDisabled != newProps.isDisabled) {
            if (this.mounted) {
                this.setState({
                    isDisabled: newProps.isDisabled
                })
            }
        }
    }

    private mounted = false

    componentWillUnmount() {
        this.mounted = false;
        this.hideOverlay()
    }
    componentDidMount() {
        this.mounted = true
    }

    resetState() {
        if (this.mounted) {
            this.setState({
                asyncState: null
            })
        }
    }
    showOverlay() {
        let div = document.createElement('div');
        div.className = 'ui-overlay';

        document.body.appendChild(div);
    }
    hideOverlay() {
        let overlayEl = document.getElementsByClassName('ui-overlay')[0];

        if (document.body.contains(overlayEl) && overlayEl !== null) {
            var element = overlayEl;
            element.parentNode.removeChild(overlayEl);
        }
    }

    handleOnClick(e) {
        let self = this;
        let clickHandler = this.props.onClick;
        if (typeof clickHandler === 'function') {
            if (this.mounted) {
                this.setState({
                    asyncState: 'pending'
                }, () => {
                    self.showOverlay();
                })
            }

            let returnFn = new Promise(resolve => {
                resolve(clickHandler(e))
            })

            if (returnFn && typeof returnFn.then === 'function') {
                returnFn.then(() => {
                    if (this.mounted) {
                        this.setState({
                            asyncState: 'fulfilled'
                        }, () => {
                            self.hideOverlay();
                        });
                    }

                    self.hideOverlay();

                })
                    .catch(error => {
                        if (this.mounted) {
                            this.setState({
                                asyncState: 'rejected',
                            }, () => {
                                self.hideOverlay();
                            });
                        }
                        throw error;
                    });
            } else {
                this.resetState();
                self.hideOverlay();
            }
        }
    }

    public render() {
        let { id, className, type, href, target, children, btnLoading } = this.props
        let { isDisabled, asyncState } = this.state

        let classes = classnames({
            'btn btn-primary': type == 'primary',
            'btn btn-secondary': type == 'secondary',
            'btn btn-default': type == 'default',
            'btn btn-danger': type == 'danger',
            'btn btn-link': type == 'link',
            'btn btn-clean': type == 'clean',
            'btn btn-link no-padding': type == 'link-no-pding',
            'btn btn-thin': type=="thin",
            [className]: className,
            'btn-loading': btnLoading || asyncState === 'pending'
        })

        let element = null
        if (href) {
            if (isDisabled)
                element = <a id={id} className={classes}>{children}</a>
            else
                element = <NavLink exact id={id} className={classes} to={href} target={target}>{children}</NavLink>
        }
        else
            element = <button id={id} className={classes} onClick={e => this.handleOnClick(e)} disabled={isDisabled}>{children}</button>


        return element
    }
}