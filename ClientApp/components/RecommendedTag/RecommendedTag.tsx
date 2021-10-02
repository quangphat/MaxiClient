import * as React from 'react';
import { InputTag } from '../../CoreComponents/InputTag/InputTag'
import { RecommendedTagRepository } from '../../repositories/RecommendedTagRepository'
interface IRecommendedTagProps {
    className?: string,
    onChange?: Function,
    tags?: string[]
}

interface IRecommendedTagStates {
    recommendTags: string[],
    tags: string[]
}

export class RecommendedTag extends React.Component<IRecommendedTagProps, IRecommendedTagStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            recommendTags: [],
            tags: this.props.tags != null ? this.props.tags:[]
        }
    }
    componentWillReceiveProps(newProps: IRecommendedTagProps) {
        if (this.props.tags != newProps.tags) {
            this.setState({ tags: newProps.tags })
        }
    }
    async componentDidMount() {
        await this.getRecommendedTags()
    }
    private async getRecommendedTags() {
        let response = await RecommendedTagRepository.GetAll();
        if (response != null && response.success) {
            this.setState({ recommendTags: response.data })
        }
    }
    private onChange(tags) {
        this.setState({ tags: tags }, () => {
            if (this.props.onChange) {
                this.props.onChange(tags)
            }
        })
    }
    public render() {
        let { recommendTags, tags } = this.state

        return <div className={`${this.props.className}`}>
            <InputTag keyControl="tags"
                listData={recommendTags}
                title="Nhãn đề xuất:"
                handleOnAddItem={(tag, tags) => this.onChange(tags)}
                handleOnDeleteItem={(tag, del) => this.onChange(tags)}
                handleEnterInput={(tag, tags) => this.onChange(tags)}
                value={tags} />
        </div>
    }
}
