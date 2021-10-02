import * as React from 'react';
import * as Utils from '../../infrastructure/Utils'
import { TagDisplay } from '..'
import { IOptionSimple, ISelectItem } from '../../Models';
import { JobSkillRepository } from '../../repositories/JobSkillRepository'
import Select from 'react-select';
import { ReactSelectCustom } from '../ReactSelectCustom/ReactSelectCustom';

interface JobSkillTagProps {
    skills: ISelectItem[],
    routePath?: string,
    className?: string,
    onChange?: Function,
    readOnly?: boolean
}
interface JobSkillTagStates {
    skills: ISelectItem[],
    datas: ISelectItem[],
    dataChangeFlag: number
}
export class JobSkillTag extends React.Component<JobSkillTagProps, JobSkillTagStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            skills: Utils.isArrNullOrHaveNoItem(this.props.skills) ? null : this.props.skills,
            datas: [],
            dataChangeFlag: 0
        };

    }
    static defaultProps = {
        className: ''
    }
    componentWillReceiveProps(newProps: JobSkillTagProps) {
        if (this.props.skills != newProps.skills) {
            this.setState({ skills: newProps.skills })
        }
    }

    componentDidMount() {
        this.onSearchJobSkill()
    }

    onSearchJobSkill(freeText: string = '') {
        JobSkillRepository.Search(freeText, 1, 30).then(response => {
            if (response.success && response.data) {
                this.setState({ datas: response.data, dataChangeFlag: this.state.dataChangeFlag + 1 })
            }
        })
    }

    private onRemoveItem(item: ISelectItem) {
        if (item == null)
            return;
        let { skills } = this.state
        skills = skills.filter(p => p.value != item.value)
        this.setState({ skills: skills }, () => {

            if (this.props.onChange)
                this.props.onChange(skills)
        })
    }

    private onClickItem(item: ISelectItem) {
        if (item == null)
            return;
        let { skills } = this.state
        if (Utils.isArrNullOrHaveNoItem(skills)) {
            skills = []
        }
        skills.push(item)
        this.setState({ skills: skills }, () => {

            if (this.props.onChange)
                this.props.onChange(skills)
        })

    }
    public render() {
        let { skills, datas } = this.state,
            { readOnly } = this.props

        if (readOnly) {
            if (Utils.isNullOrUndefined(skills)) return null;

            return <div className={`${this.props.className} next-token-list__wrapper`}>
                <ul className='next-token-list'>
                    {skills.map(item => {
                        return <li key={'input-tags' + item.value} className='tagit-choice table-break-word' onClick={() => this.onRemoveItem(item)}>
                            <span className='tagit-label'>{item.label}</span>
                        </li>
                    })}
                </ul>
            </div>
        }
        else {
            //if (Utils.isArrNullOrHaveNoItem(datas))
            //    return null;

            return <ReactSelectCustom selectedItems={skills} options={datas}
                className={this.props.className}
                placeholder={'Vui lòng chọn'}
                dataChangeFlag={this.state.dataChangeFlag}
                onInputChange={(value) => this.onSearchJobSkill(value)}
                onChange={(selectedItems, item) => {
                    this.setState({ skills: selectedItems }, () => {
                        if (this.props.onChange)
                        this.props.onChange(selectedItems)
                    })
                }}
            />


        }

    }
}
