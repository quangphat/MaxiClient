import * as React from 'react'
import { Button } from '../../CoreComponents/Button/Button'
import './index.css'
import { ArticleRepository } from '../../repositories/ArticleRepository'
import debounce from 'lodash/debounce';
interface LikeBoxProps {
    likes: number,
    isLiked: boolean,
    comments: number,
    targetId: string,
    className?: string
}
interface LikeBoxStates {
    likes: number,
    isLiked: boolean,
    comments: number
}
export class LikeBox extends React.Component<LikeBoxProps, LikeBoxStates>{
    constructor(props) {
        super(props);
        this.state = {
            likes: this.props.likes,
            comments: this.props.comments,
            isLiked: this.props.isLiked
        }
        this.onLikeDebounce = debounce(this.onLikeDebounce, 500)
    }
    componentWillReceiveProps(newProps: LikeBoxProps) {
        if (this.props.likes != newProps.likes) {
            this.setState({ likes: newProps.likes })
        }
        if (this.props.isLiked != newProps.isLiked) {
            this.setState({ isLiked: newProps.isLiked })
        }
        if (this.props.comments != newProps.comments) {
            this.setState({ comments: newProps.comments })
        }
    }
    componentWillUnmount(this) {
        this.onLikeDebounce.cancel()
    }
    private onLikeDebounce(like: boolean) {
        ArticleRepository.LikeArticle(this.props.targetId, like);
    }
    private onClickLike() {
        let { isLiked, likes } = this.state
        if (isLiked)
            likes -= 1;
        else
            likes += 1
        this.setState({ isLiked: !isLiked, likes: likes }, () => {
            this.onLikeDebounce(this.state.isLiked)
        })
    }

    render() {
        let { likes, comments, isLiked } = this.state
        let textGreen = 'link-black'
        let borderGreen = ''
        if (isLiked) {
            borderGreen = 'btn_none-horder'
            textGreen = 'text-main'
        }
        return <div className={this.props.className}>
            <div className="list-inline ">
                <div>
                    <Button type="thin"
                        onClick={() => this.onClickLike()}
                        className={`text-sm ${borderGreen} ${textGreen}`}>
                        Like
                    </Button>
                </div>
                <span className="pull-right text-muted">
                    {likes > 0 && <span className="link-black">{likes} likes</span>}
                    {comments >0 && <span className="link-black ml-5">{comments} comments</span>}
                </span>
            </div>
        </div>
    }
}