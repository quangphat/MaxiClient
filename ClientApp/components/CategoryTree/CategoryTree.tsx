import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { IArticleMeta } from '../../Models/IArticleMeta'
import { Button, InputCheckbox, CreateSVG, Modal, Input } from '../../CoreComponents';
import { AutoModal } from '..';
import * as Models from '../../Models'
import * as Utils from '../../infrastructure/Utils'
import { CategoryRepository } from '../../repositories/CategoryRepository'
import './index.css'

interface TreeProps {
    categories: Models.ICategory[],
    onSelect: Function
}
interface TreeStates {
    categories: Models.ICategory[],
    newCate: Models.ICategory,
    isOpenPopup: boolean
}
export class CategoryTree extends React.Component<TreeProps, TreeStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            categories: this.props.categories,
            isOpenPopup: false,
            newCate: new Object as Models.ICategory
        };

    }
    componentWillMount() {

    }
    private setSwithOpen(c: Models.ICategory, clickItem: Models.ICategory) {
        c.subCategories.forEach(p => {
            if (clickItem.level == p.level) {
                if (clickItem.id == p.id)
                    p.isOpen = !p.isOpen
            }
            else if (p.subCategories != null) {
                this.setSwithOpen(p, clickItem)
            }
        })
    }
    private onSwitchOpen(item: Models.ICategory) {
        let { categories } = this.state
        categories.forEach(p => {
            if (item.level == p.level) {
                if (item.id == p.id)
                    p.isOpen = !p.isOpen
            }
            else if (p.subCategories != null) {
                this.setSwithOpen(p, item)
            }
        })
        this.setState({ categories: categories })
    }
    private setCheck(c: Models.ICategory, checkItem: Models.ICategory, value: boolean) {
        c.subCategories.forEach(p => {
            if (checkItem.id == p.id)
                p.isCheck = value
            else p.isCheck = false

            if (p.subCategories != null) {
                this.setCheck(p, checkItem, value)
            }
        })
    }
    private onCheck(item: Models.ICategory, value: boolean) {
        let { categories } = this.state
        categories.forEach(p => {
            if (item.id == p.id)
                p.isCheck = value
            else
                p.isCheck = false

            if (p.subCategories != null) {
                this.setCheck(p, item, value)
            }
        })
        this.setState({ categories: categories }, () => this.props.onSelect(item))
    }
    private async getCategories() {
        let res = await CategoryRepository.GetAll()
        return res
    }
    private onOpenPopupAddSub(parentCate: Models.ICategory) {
        let newCate = this.state.newCate
        newCate.parentCategoryId = parentCate.id
        newCate.isRoot = false
        newCate.level = parentCate.level + 1
        if (Utils.isArrNullOrHaveNoItem(newCate.categoryIds)) {
            newCate.categoryIds = []
        }
        if (Utils.isArrNullOrHaveNoItem(newCate.categoryNames)) {
            newCate.categoryNames = []
        }
        if (!parentCate.isRoot) {
            newCate.categoryIds = parentCate.categoryIds
            newCate.categoryIds.push(parentCate.id.toString())
            newCate.categoryNames = parentCate.categoryNames
            newCate.categoryNames.push(parentCate.categoryName)
        }
       
        this.setState({ newCate: newCate, isOpenPopup: true })
    }
    private async onCreateRootCategory() {
        let { newCate, categories } = this.state
        if (Utils.isNullOrUndefined(newCate)) return
        let res = await CategoryRepository.CreateCategory(newCate)
        if (res != null) {
            if (res.error == null) {
                let result = await this.getCategories()
                if (result != null && result.error == null) {
                    this.setState({ categories: result.data, newCate: null, isOpenPopup: false })
                }

            }
        }
    }
    private isHasChild(c: Models.ICategory) {
        if (Utils.isArrNullOrHaveNoItem(c.subCategories)) return false;
        return true
    }
    private renderItem(cate: Models.ICategory) {
        return <div className='col-md-12'>
            <span className="treeview-node-name node-active boder-none pd-l13 background-none box-shadow-none">
                {!this.isHasChild(cate) && <InputCheckbox nameInput='category'
                    isChecked={cate.isCheck} onChange={(e) => this.onCheck(cate, e)} />}
                <span className="text-left" onClick={() => this.onSwitchOpen(cate)} >
                    {cate.categoryName}
                </span>
            </span>
            <a className="treeview-note-collapse ml-3 cursor-pointer" onClick={() => this.onSwitchOpen(cate)}
                style={{ "position": "absolute", "left": "-8px", "top": "10px" }}>
                {cate.level < 2 && <CreateSVG svgName='#iconArrow' rotate={cate.isOpen ? 90 : 0} size={12} />}
            </a>
        </div>
    }
    private renderNode(cate: Models.ICategory) {
        let content = cate.subCategories.map(c => {
            return <div key={c.id} className='treeview-node-container'>
                {this.renderItem(c)}
                {c.subCategories != null && <div className={c.isOpen ? 'treeview-node-childs open-node' : 'treeview-node-childs'}>
                    {this.renderNode(c)}
                </div>}
            </div>
        })
        let button = cate.level < 2 && <Button type='link-no-pding' key={1} className=''
            onClick={() => this.onOpenPopupAddSub(cate)}>
            Thêm mới
            </Button>
        return [
            button,
            content
        ]
    }
    private renderAddNewSubCatePopup() {
        let newCate = this.state.newCate
        if (Utils.isNullOrUndefined(newCate)) return null
        return <Modal
            headerTitle={'Tạo danh mục mới'}
            iconClose={true}
            isOpen={this.state.isOpenPopup}
            isBtnClose={true}
            bodyContent={
                <div className="pd-all-20">
                    <p className="my-2 font-weight-bold">Tên</p>
                    <Input value={newCate.categoryName}
                        onChange={(e) => this.setState({ newCate: { ...this.state.newCate, categoryName: e.target.value, isRoot: false } })} />
                </div>
            }
            footerContent={
                         <div className="row">
                    <div className="col text-right">
                        <Button onClick={() => this.setState({ isOpenPopup: false, newCate: null })} type='default' className="mr-3">
                            <span>Hủy</span>
                        </Button>
                        <Button type='danger' onClick={() => this.onCreateRootCategory()}
                            className='photo-overlay-actions__link' isDisabled={false}>
                            <span>Tạo mới</span>
                        </Button>
                    </div>
                </div>
            }
        >
        </Modal>

    }
    private renderTree(categories: Models.ICategory[]) {
        //if (category == null) return null
        return categories.map(c => {
            return <div key={c.id} className='treeview-node-container'>
                {this.renderItem(c)}
                <div className={c.isOpen ? 'treeview-node-childs open-node' : 'treeview-node-childs'}>
                    {c.subCategories != null && this.renderNode(c)}
                </div>
            </div>
        })

    }

    private renderAddNewRootPopup() {
        let newCate = this.state.newCate
        return <AutoModal
            headerTitle={'Tạo danh mục mới'}
            iconClose={true}
            onPositiveClick={() => this.onCreateRootCategory()}
            bodyContent={
                <div className="pd-all-20">
                    <p className="my-2 font-weight-bold">Tên</p>
                    <Input value={newCate.categoryName}
                        onChange={(e) => this.setState({ newCate: { ...this.state.newCate, categoryName: e.target.value } })} />
                </div>
            }>

            <Button type='link-no-pding' key={1} className=''>
                Thêm mới danh mục
            </Button>
        </AutoModal>
    }
    public render() {
        let categories = this.state.categories
        if (categories == null || categories.length == 0)
            return this.renderAddNewRootPopup()
        return <div className="treeview">
            {this.renderTree(categories)}
            {this.renderAddNewSubCatePopup()}
        </div>
    }
}
