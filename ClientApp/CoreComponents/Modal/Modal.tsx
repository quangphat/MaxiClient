import * as React from 'react';
import { Modal as ModalStrap } from 'reactstrap';
import { Button, CreateSVG } from '../../CoreComponents'
import './index.css';

export declare type optionSize = 'lg' | 'md' | 'sm';

interface IModalProps {
    isOpen?: boolean,
    size?: optionSize,
    className?: string,
    iconClose?: boolean,
    headerTitle?: any,
    bodyContent?: any,
    footerContent?: any,
    footerDisabledCloseModal?: boolean,
    isBtnClose?: boolean,
    beforeShowModal?: Function,
    afterCloseModal?: Function,
    onClose?: Function,
    backdrop?: any // true, false, 'static'
}

interface IModalStates {
    isOpen: boolean
}

export class Modal extends React.Component<IModalProps, IModalStates> {
    constructor(props: any) {
        super(props)

        this.state = {
            isOpen: this.props.isOpen || false
        }

        this.handleClick = this.handleClick.bind(this)
    }

    static defaultProps = {
        isOpen: false,
        size: 'md',
        iconClose: true,
        isBtnClose: true,
        backdrop: true
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.isOpen != nextProps.isOpen) {
            this.setState({ isOpen: nextProps.isOpen })
        }
    }
    public handleClick() {
        this.setState({
            isOpen: !this.state.isOpen
        }, () => {
            if (this.props.onClose)
                this.props.onClose()
        })
    }

    public render() {
        return <div className="test">
            <ModalStrap isOpen={this.state.isOpen} toggle={this.handleClick} size={this.props.size}
                className={this.props.className} backdrop={this.props.backdrop} modalTransition={{ timeout: 50 }}>
                <div className='modal-header'>
                    <h4 className='modal-title'>{this.props.headerTitle}</h4>
                    {this.props.iconClose &&
                        <Button type='link-no-pding' className='close' onClick={this.handleClick}>
                            <CreateSVG size={14} svgName='icontimes' />
                        </Button>
                    }
                </div>
                <div className='modal-body'>{this.props.bodyContent}</div>
                {
                    (this.props.footerContent || this.props.isBtnClose) &&
                    <div className='modal-footer'>
                        {this.props.isBtnClose && <Button type='default' onClick={this.handleClick}>Hủy</Button>}
                        {this.props.footerDisabledCloseModal ?
                            <div className='col-auto 1'>{this.props.footerContent}</div> :
                            <div className='col-auto 2' onClick={this.handleClick}>{this.props.footerContent}</div>}
                    </div>
                }
            </ModalStrap>
            <div onClick={this.handleClick}>{this.props.children}</div>
        </div>
    }
}