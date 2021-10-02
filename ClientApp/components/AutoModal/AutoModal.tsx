import * as React from 'react';
import { Button, Modal } from '../../CoreComponents';

export declare type optionSize = 'lg' | 'md' | 'sm';

interface IAutoModalProps {
    size?: optionSize,
    className?: string,
    iconClose?: boolean,
    headerTitle?: any,
    bodyContent?: any,
    backdrop?: any // true, false, 'static'
    onPositiveClick?: Function,
    onNegetiveClick?: Function,
    contentDisplay?: any
}

interface IAutoModalStates {
    isOpen: boolean
}

export class AutoModal extends React.Component<IAutoModalProps, IAutoModalStates> {
    constructor(props: any) {
        super(props)

        this.state = {
            isOpen: false
        }

    }

    static defaultProps = {
        size: 'md',
        iconClose: true,
        isBtnClose: true,
        backdrop: true,
        headerTitle: '',
        bodyContent: ''
    }
    componentWillReceiveProps(nextProps) {

    }
    private setSwitchPopup(value: boolean) {
        this.setState({ isOpen: value })
    }
    private async onPositiveClick() {
        if (this.props.onPositiveClick) {
            let response = await this.props.onPositiveClick()
            if (response.isSuccess) {
                this.setState({ isOpen: false })
            }
        }
        else {
            this.setState({ isOpen: false })
        }
    }
    private renderModal() {
        return <Modal
            headerTitle={this.props.headerTitle}
            isOpen={this.state.isOpen}
            className="text-left"
            iconClose={true}
            isBtnClose={false}
            afterCloseModal={() => this.setSwitchPopup(false)}
            footerDisabledCloseModal={true}
            bodyContent={
                this.props.bodyContent
            }
            footerContent={
                <div className="row">
                    <div className="col text-right">
                        <Button onClick={() => this.setSwitchPopup(false)} type='default' className="mr-3">
                            <span>Hủy</span>
                        </Button>
                        <Button type='danger' onClick={() => this.onPositiveClick()} className='photo-overlay-actions__link' isDisabled={false}>
                            <span>Xác nhận</span>
                        </Button>
                    </div>
                </div>
            }>
            {this.props.children}
        </Modal>
    }
    public render() {
        return this.state.isOpen ? this.renderModal() : <div onClick={() => this.setSwitchPopup(true)}>{this.props.children}</div>
    }
}