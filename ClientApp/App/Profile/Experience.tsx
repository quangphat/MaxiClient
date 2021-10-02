import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { HubConnection } from '@aspnet/signalr';
import './index.css';
import { ExperienceRepository } from '../../repositories/ExperienceRepository'
import * as Utils from '../../infrastructure/Utils';
import * as Models from '../../Models';
import { SelectionJobFunction, SelectLocation } from '../../components'
import { Button, CreateSVG, Input, Loading, SelectionV2, InputCheckbox, TextArea, Modal} from '../../CoreComponents'
import { ExperienceItem } from './ExperienceItem'

interface IExperienceProps {
    isShow?: boolean,
    person: Models.IAuthor
}
interface IExperienceStates {
    isShow?: boolean,
    experiences: Models.IExperience[],
    newExperience: Models.IExperience,
    isOpenPopupAddExperience: boolean
}
export class Experience extends React.Component<IExperienceProps, IExperienceStates> {
    constructor(props) {
        super(props);

        this.state = {
            experiences: [],
            isShow: this.props.isShow,
            isOpenPopupAddExperience: false,
            newExperience: new Object as Models.IExperience
        };
    }
    static defaultProps = {
        isShow: true
    }
    componentWillMount() {
        this.getExperiences()
    }
    componentDidMount() {

    }
    componentWillReceiveProps(newProps: IExperienceProps) {
        if (this.props.isShow != newProps.isShow) {
            this.setState({ isShow: newProps.isShow })
        }
    }
    private getExperiences() {
        let { experiences } = this.state
        ExperienceRepository.GetExperiencesByPersonId(this.props.person.id).then(response => {
            if (response != null && response.data != null) {
                if (experiences == null)
                    experiences = [];
                if (Utils.isArrNullOrHaveNoItem(response.data))
                    return
                experiences = experiences.concat(response.data)
                this.setState({ experiences: experiences })
            }
        })
    }
    private onChangeYear(e, type: string) {
        if (e == null) return
        let { newExperience } = this.state
        if (newExperience == null) newExperience = new Object as Models.IExperience
        let value = Number(e)
        if (type == 'from')
            newExperience.startYear = value
        else {
            newExperience.endYear = value
        }
        this.setState({ newExperience: newExperience })
    }
    private onChangeMonth(e, type: string) {
        if (e == null) return
        let { newExperience } = this.state
        if (newExperience == null) newExperience = new Object as Models.IExperience
        let value = Number(e)
        if (type == 'from')
            newExperience.startMonth = value
        else {
            newExperience.endMonth = value
        }
        this.setState({ newExperience: newExperience })
    }
    private onClickSaveExperience() {
        let { newExperience } = this.state
        if (newExperience == null) return
        //this.setState({ isLockButton: true })

        if (newExperience.isPresent) {
            newExperience.endYear = null
        }
        else if (newExperience.endYear == null) {
            newExperience.isPresent = true
        }
        ExperienceRepository.CreateExperience(newExperience).then(response => {
            if (response.error == null && response.data != null) {
                newExperience = response.data
                this.setState({ newExperience: new Object as Models.IExperience, isOpenPopupAddExperience: false })
            }
            else {
                //this.setState({ isLockButton: false })
            }
        })
    }
    private onSelectJobFunction(item: Models.IOptionSimple) {
        if (item == null)
            return
        let { newExperience } = this.state
        let jobFunction = {
            id: item.id,
            code: item.code,
            displayName: item.display
        } as Models.IJobFunction
        newExperience.jobFunction = jobFunction
        this.setState({ newExperience: newExperience })
    }
    private onSelectLocation(item: Models.IOptionSimple) {
        if (item == null)
            return
        let { newExperience } = this.state
        let loc = {
            id: item.id,
            code: item.code,
            displayName: item.display
        } as Models.ILocation
        newExperience.location = loc
        this.setState({ newExperience: newExperience })
    }
    private renderAddExperiencePopupContent() {
        let { newExperience } = this.state
        return <div className="modal-content-body">
            <div className="mg-b-20">
                <label className="label-input-group">Job title</label>
                <Input value={!Utils.isNullOrWhiteSpace(newExperience.title) ? newExperience.title : ''}
                    onChange={(e) => this.setState({ newExperience: { ...newExperience, title: e.target.value } })}
                    placeholder="Tiêu đề" />
            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Company name</label>
                <Input value={!Utils.isNullOrWhiteSpace(newExperience.companyName) ? newExperience.companyName : ''}
                    onChange={(e) => this.setState({ newExperience: { ...newExperience, companyName: e.target.value } })}
                    placeholder="Công ty" />
            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Địa điểm</label>
                <SelectLocation maxAllowSelected={2} limit={10}
                    onClickItem={(item) => this.onSelectLocation(item)} />
            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Job Function</label>
                <SelectionJobFunction maxAllowSelected={1} limit={10}
                    onClickItem={(item) => this.onSelectJobFunction(item)} />
            </div>
            <div className="mg-b-20" >
                <label className="label-input-group">Từ</label>
                <div className="flex w-50_per">
                    <SelectionV2
                        datas={Utils.ListMonth}
                        defaultItem={{ value: '0', display: 'Chọn tháng' }}
                        selectedId={newExperience.startMonth}
                        dataId='value'
                        returnType="ID"
                        dataLabel='display'
                        onClickItem={(e) => this.onChangeMonth(e, 'from')}
                        className="form-control" />
                    <SelectionV2
                        datas={Utils.getListYear()}
                        selectedId={newExperience.startYear}
                        defaultItem={{ value: '0', display: 'Chọn năm' }}
                        dataId='value'
                        dataLabel='display'
                        returnType="ID"
                        onClickItem={(e) => this.onChangeYear(e, 'from')}
                        className="form-control ml-20" />
                </div>

            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Đến</label>
                <div className="flex w-50_per">
                    <SelectionV2
                        datas={Utils.ListMonth}
                        selectedId={newExperience.endMonth}
                        defaultItem={{ value: '0', display: 'Chọn tháng' }}
                        dataId='value'
                        dataLabel='display'
                        returnType="ID"
                        disable={newExperience.isPresent}
                        onClickItem={(e) => this.onChangeMonth(e, 'to')}
                        className="form-control" />
                    <SelectionV2
                        datas={Utils.getListYear()}
                        selectedId={newExperience.endYear}
                        defaultItem={{ value: '0', display: 'Chọn năm' }}
                        dataId='value'
                        dataLabel='display'
                        disable={newExperience.isPresent}
                        returnType="ID"
                        onClickItem={(e) => this.onChangeYear(e, 'to')}
                        className="form-control ml-20" />
                </div>
            </div>

            <div className="mg-b-20">
                <InputCheckbox content="Tôi vẫn đang làm ở đây" isChecked={newExperience.isPresent}
                    onChange={(e) => this.setState({ newExperience: { ...newExperience, isPresent: !newExperience.isPresent } })}
                    nameInput='currentlyworkhere' />
            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Work As</label>
                <Input value={newExperience.workAs} onChange={(e) => this.setState({ newExperience: { ...newExperience, workAs: e.target.value } })}
                    placeholder="Vai trò"
                />
            </div>
            <div className="mg-b-20">
                <label className="label-input-group">Mô tả</label>
                <TextArea value={newExperience.description}
                    onChange={(e) => this.setState({ newExperience: { ...newExperience, description: e.target.value } })}
                />
            </div>
        </div>
    }
    private renderAddExperiencePopup() {
        return <Modal isOpen={this.state.isOpenPopupAddExperience}
            headerTitle="Thêm kinh nghiệm"
            isBtnClose={false}
            iconClose={true}
            footerDisabledCloseModal={true}
            onClose={() => this.setState({ isOpenPopupAddExperience: !this.state.isOpenPopupAddExperience })}
            size="lg"
            bodyContent={this.renderAddExperiencePopupContent()}
            backdrop={true}
            afterCloseModal={() => this.setState({ isOpenPopupAddExperience: false })}
            footerContent={<Button type="primary" className="btn-long" onClick={() => this.onClickSaveExperience()} >
                <span>Lưu</span>
            </Button>}
        >
        </Modal>
    }
    private renderExperiences() {
        let { experiences } = this.state,
            { person } = this.props
        if (Utils.isArrNullOrHaveNoItem(experiences)) return null
        return <div className="timeline">{experiences.map(item => {
            return <ExperienceItem person={person} experience={item} key={item.id} />
        })}
        </div>
    }
    public render() {
        let { isShow } = this.state
        if (!isShow)
            return null
        return <div className="experience">
            <Button type="link-no-pding" className="" onClick={() => this.setState({ isOpenPopupAddExperience: true })}>
                Thêm kinh nghiệm
            </Button>
            {this.renderExperiences()}
            {this.renderAddExperiencePopup()}
        </div>
    }
}