import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { IArticleMeta } from '../../Models/IArticleMeta'
import { HeaderPage } from '../../components'
import { TableList, Button, CreateSVG} from '../../CoreComponents'
import * as Models from '../../Models'
import { ArticleRepository } from '../../repositories/ArticleRepository'
import * as Utils from '../../infrastructure/Utils'
import { NavLink } from 'react-router-dom';
interface ArticleListStates {
    articles: Models.IArticle[]
}
export class ArticleList extends React.Component<RouteComponentProps<any>, ArticleListStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            articles: []
        };

    }
    componentWillMount() {
        this.getArticle()
    }
    private getArticle() {
        ArticleRepository.Search(null, null, null, 1, 10).then(res => {
            if (res.data != null) {
                this.setState({ articles: res.data.datas })
            }
        })
    }
    renderTableBody(data: Models.IArticle[]) {
        return data.map((item) => {
            return <tr key={item.id}>
                <td className='text-right text-normal'>
                    <div className="table-break-word">
                        <NavLink to={'/admin/article/' + item.id} className="d-inline-block">
                            <div className="font-weight-bold">{item.title}</div>
                        </NavLink>
                    </div>
                </td>
                <td>
                    <span>{item.author.email}</span>
                </td>
                <td className='text-center'>
                    {item.views}
                </td>
                <td className='text-center'>
                    {item.likes}
                </td>
                <td className='text-center'>
                    {item.comments}
                </td>
                <td>
                    Đã duyệt
                    </td>
            </tr>
        })
    }
    private renderArticleTable() {
        let { articles } = this.state
        if (Utils.isArrNullOrHaveNoItem(articles)) return null;
        let tableHeader = [
            { title: 'Tiêu đề', classes: 'table-header--id cursor-pointer text-uppercase font-weight-bold', sortFieldName: 'transfer_number' },
            { title: 'Tác giả', classes: 'table-header--datetime cursor-pointer text-uppercase font-weight-bold', sortFieldName: 'receive_date' },
            { title: 'Lượt xem', classes: 'min-width-250px table-header--25per text-uppercase font-weight-bold', sortFieldName: '' },
            { title: 'Lượt thích', classes: 'text-center cursor-pointer text-uppercase font-weight-bold', sortFieldName: 'input_location_id' },
            { title: 'Bình luận', classes: 'min-width-250px table-header--25per', sortFieldName: '' },
            { title: 'Tình trạng', classes: 'table-header--status cursor-pointer text-uppercase font-weight-bold', sortFieldName: 'status' }
        ]
        return <TableList listData={articles}
            dataTableHeader={tableHeader}
            location={this.props.location}
            pathName={'/admin/article'}
            totalRecord={articles.length}
            hasPagination={true}
            renderTableBody={() => this.renderTableBody(articles)} >

        </TableList>
    }
    public render() {

        return <React.Fragment>
            <HeaderPage>
                <Button type='primary' className='ml-3'
                    onClick={() => { this.props.history.push('/admin/article_create', true) }} >
                    <CreateSVG size={12} svgName='#iconCheckmark' className='mr-3' />
                    <span>Tạo bài viết mới</span>
                </Button>
            </HeaderPage>
            <div className="pd-all-20">
                <div className="col-sm-12">
                    {this.renderArticleTable()}
                </div>
            </div>
        </React.Fragment>
    }
}
const listData = [
    { value: '0', display: 'item1' },
    { value: '1', display: 'item2' },
]