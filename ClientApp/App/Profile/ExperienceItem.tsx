import * as React from 'react';
import * as Utils from '../../infrastructure/Utils';
import * as FormatHelper from '../../infrastructure/FormatHelper';
import { IExperience, IAuthor } from '../../Models'
import { Avatar } from '../../components'
interface ExperienceItemProps {
    experience: IExperience,
    person: IAuthor
}
interface ExperienceItemStates {
    experience: IExperience
}
export class ExperienceItem extends React.Component<ExperienceItemProps, ExperienceItemStates>{
    constructor(props) {
        super(props);

        this.state = {
            experience: this.props.experience
        }
    }
    public componentDidMount() {

    }
    public componentWillReceiveProps(nextProps: ExperienceItemProps) {
        if (this.props.experience != nextProps.experience) {
            this.setState({ experience: nextProps.experience })
        }
    }

    public render() {
        let { experience } = this.state,
            { person } = this.props
        let display = ''
        let elapsed = FormatHelper.getDurationV2(experience.startYear, experience.startMonth, experience.endYear, experience.endMonth)
        if (experience.isPresent || experience.endYear == null) {
            display = 'Hiện tại'
        }
        else {
            display = `${experience.endMonth} ${experience.endYear}`
        }
        return <div className="timeline-event">
            <div className="worktime">
                {`${experience.startMonth} ${experience.startYear}  - ${display}. ${elapsed}`}
            </div>
            <div className="event-point"></div>
            <div className="event-box">
                <div className="timeline-event-title">
                    <a className="btn-timeline-edit" href="#"><i className="fa fa-pencil"></i></a>
                    <Avatar img={person.avatar} displayName={person.displayName} profileName={person.profileName} size="s32" />
                    <span className="company_item_name">
                        {experience.companyName}
                    </span>

                    {experience.location && <span className="user-info-location">
                        {experience.location.displayName}
                     </span>}
                    <div className="clearfix"></div>
                </div>
                <div className="event-box-main">
                    <a href="#">Thêm mô tả</a>
                    {!Utils.isNullOrWhiteSpace(experience.description) && <ul className="nav-list-description">
                        <li>
                            {experience.description}
                            <a className="ml10"><i className="fa fa-pencil"></i></a>
                        </li>
                        <li>
                            {experience.description}
                            <a className="ml10"><i className="fa fa-pencil"></i></a>
                        </li>
                    </ul>}
                </div>
            </div>
        </div>
    }
}