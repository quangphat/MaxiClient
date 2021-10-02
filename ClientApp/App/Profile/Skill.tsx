import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { HubConnection } from '@aspnet/signalr';
import './index.css';
import { JobSkillRepository } from '../../repositories/JobSkillRepository'
import { PersonRepository } from '../../repositories/PersonRepository'
import * as Utils from '../../infrastructure/Utils';
import * as Models from '../../Models';
import { MarkdownEditor, HeaderPage, SelectionJobSkill } from '../../components'
import { Button, CreateSVG, Input, Loading, Modal } from '../../CoreComponents'
import { ExperienceItem } from './ExperienceItem'

interface ISkillProps {
    isShow?: boolean,
    person: Models.IAuthor
}
interface ISkillStates {
    isShow?: boolean,
    skills: string[],
    newSkill: Models.IJobSkill,
    isOpenPopupAddSkill: boolean
}
export class Skill extends React.Component<ISkillProps, ISkillStates> {
    constructor(props) {
        super(props);

        this.state = {
            skills: [],
            isShow: this.props.isShow,
            isOpenPopupAddSkill: false,
            newSkill: new Object as Models.IJobSkill
        };
    }
    static defaultProps = {
        isShow: true
    }
    componentWillMount() {
        this.getSkills()
    }
    componentDidMount() {

    }
    componentWillReceiveProps(newProps: ISkillProps) {
        if (this.props.isShow != newProps.isShow) {
            this.setState({ isShow: newProps.isShow })
        }
    }
    private getSkills() {
        let { skills } = this.state
        PersonRepository.GetPersonSkills(this.props.person.id).then(response => {
            if (response == null || response.error != null)
                return
            skills = response.data
            this.setState({ skills: skills })
        })
    }


    private onClickSaveExperience() {
        let { skills } = this.state
        let model = new Object as Models.StringModel
        model.Values = []
        if (Utils.isArrNullOrHaveNoItem(skills))
            model.Values = []
        else {
            skills.map(p => model.Values.push(p))
        }
        PersonRepository.UpdateSkill(model).then(response => {
            if (response.error == null && response.data != null) {
                this.setState({ isOpenPopupAddSkill: false })
            }
            else {
                //this.setState({ isLockButton: false })
            }
        })
        this.setState({ isOpenPopupAddSkill: false })
    }
    private onSelectSkillTag(items: string[]) {

        let { skills } = this.state
        this.setState({ skills: items })
    }

    private renderAddSkillPopupContent() {
        return <div className="modal-content-body">
            <div className="mg-b-20">
                <SelectionJobSkill maxAllowSelected={100} selectedValues={this.state.skills} limit={10} returnType="array"
                    onClickItem={(item) => this.onSelectSkillTag(item)} />
            </div>
        </div>
    }
    private renderAddExperiencePopup() {
        return <Modal isOpen={this.state.isOpenPopupAddSkill}
            headerTitle="Thêm Kỹ năng"
            isBtnClose={false}
            iconClose={true}
            footerDisabledCloseModal={true}
            onClose={() => this.setState({ isOpenPopupAddSkill: !this.state.isOpenPopupAddSkill })}
            size="lg"
            bodyContent={this.renderAddSkillPopupContent()}
            backdrop={true}
            afterCloseModal={() => this.setState({ isOpenPopupAddSkill: false })}
            footerContent={<Button type="primary" className="btn-long" onClick={() => this.onClickSaveExperience()} >
                <span>Lưu</span>
            </Button>}
        >
        </Modal>
    }
    private renderSkills() {
        let { skills } = this.state,
            { person } = this.props
        if (Utils.isArrNullOrHaveNoItem(skills)) return null
        return skills.map(item => {
            return <p key={Utils.getNewGuid()}>{item}</p>
        })
    }
    public render() {
        let { isShow } = this.state
        if (!isShow)
            return null
        return <div className="experience">
            <Button type="link-no-pding" className="experience" onClick={() => this.setState({ isOpenPopupAddSkill: true })}>
                <span>Thêm Kỹ năng</span>
            </Button>
            {this.renderSkills()}
            {this.renderAddExperiencePopup()}
        </div>
    }
}