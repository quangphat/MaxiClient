import * as React from "react"
import { RouteComponentProps } from 'react-router';
import { Button, InputCheckbox} from '../../CoreComponents';
import { IUSPEmployee } from "../../Models";
import * as FormatHelper from '../../infrastructure/FormatHelper';
import * as Utils from '../../infrastructure/Utils'
import { FormattedMessage } from 'react-intl';
import './MemberItem.css'

import * as RoutPath from '../../infrastructure/RoutePath'
import { NavLink } from "react-router-dom";
interface MemberItemProps {
    member: IUSPEmployee,
    className?: string,
    onSelect?: Function,
    isSelected?:boolean
}
interface MemberItemStates {

}
export class MemberItem extends React.Component<MemberItemProps, MemberItemStates>{
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    static defaultProps = {
        className: '',
        isSelected:false
    }

    render() {
        let { member } = this.props
        if (!this.props.member)
            return null;
        return <div className={`${this.props.className}`}>
            <div className="card-contact">
                <div className="card__side-contact card__side--front-contact card__side--front-2-contact">
                    <div className="card__description-contact">

                        <div className="contact-ha-haravan-container-header">
                            
                            <div className="contact-ha-haravan-username text-capitalize">{member.fullName}</div>
                            <div className="contact-ha-haravan-code">{member.title}</div>
                            <div className="contact-ha-haravan-code">{member.phone}</div>
                            <div className="contact-ha-haravan-email">{member.email}</div>
                        </div>

                    </div>
                    <div className="contact-ha-haravan-footer">
                            <div className="col-12 col-md-12">
                                <div className="row">
                                    <div className="col-6 col-md-6 col-md-6-no-gutter-border-left pr-0">
                                       
                                    </div>
                                    <div className="col-6 col-md-6 col-md-6-no-gutter-border-left pr-0">
                                        {<NavLink to={RoutPath.Path.employee_edit(member.id)} target='_blank'>
                                            <span>Trang cá nhân</span>
                                        </NavLink>}
                                    </div>
                                </div>
                            </div>


                        </div>
                </div>

            </div>
        </div>


    }
}