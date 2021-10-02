import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as Utils from '../../infrastructure/Utils';
import * as Enums from '../../Models/Enums'
import { IOptionSimple } from '../../Models'
import { IBadgeType, Badge } from '../../CoreComponents/Badge/Badge';
//import './index.css'


interface ArticleStatusProps {
    status: number
}
export class ArticleStatus extends React.Component<ArticleStatusProps, {}>{
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentWillReceiveProps(nextProps: ArticleStatusProps) {
    }
    private getDisplay(status) {
        let statusObj = new Object as IArticleStatus
        if (status == Enums.ArticleStatus.Draft)
            return { type: "aqua", display: "Nháp" } as IArticleStatus
        if (status == Enums.ArticleStatus.Pending)
            return { type: "orrange", display: "Chờ duyệt" } as IArticleStatus
        if (status == Enums.ArticleStatus.Approved)
            return { type: "green", display: "Đã xuất bản" } as IArticleStatus
        if (status == Enums.ArticleStatus.Reject)
            return { type: "grey", display: "Bị từ chối" } as IArticleStatus
        return statusObj
    }
    public render() {
        let { status } = this.props
        let objStatus = this.getDisplay(status);
        return <Badge type={objStatus.type} content={objStatus.display} ></Badge>
    }

}
interface IArticleStatus {
    type: IBadgeType,
    display: string
}