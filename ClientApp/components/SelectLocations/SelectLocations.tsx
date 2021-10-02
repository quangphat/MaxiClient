import * as React from 'react'
import * as classnames from 'classnames';
import * as H from 'history';
import * as Utils from '../../infrastructure/Utils'
import * as  RoutePath from '../../infrastructure/RoutePath'
import { ILocationSimple, IOptionSimple, ISelectItem } from '../../Models'
import { LocationRepository } from '../../repositories/LocationRepository';
import { messagesCode } from '../../infrastructure/messagesCode'
import { Button, CreateSVG, Input, InputCheckbox, SelectionV2, Selection, InputCurrency } from '../../CoreComponents'
import { ReactSelectCustom } from '../ReactSelectCustom/ReactSelectCustom';
import { InputDebounce } from '../InputDebounce/InputDebounce';

interface SelectLocationsProps {
    selectedLocations: ILocationSimple[],
    isDataChange: boolean,
    className?: string,
    onChange?: Function,
    history?: H.History,
    isSelectSingle?: boolean,
    isMulti?: boolean,
    showAddress?: boolean
}
interface SelectLocationsStates {
    selectedLocations: ISelectItem[],
    locations: ISelectItem[],
    isDataChange: boolean,
    dataChangeFlag: number
}
export class SelectLocations extends React.Component<SelectLocationsProps, SelectLocationsStates>
{
    constructor(props) {
        super(props);
        this.state = {
            selectedLocations: Utils.convertOptionSimplesToSelectItems(this.props.selectedLocations, false, 'Vui lòng chọn một khu vực'),
            isDataChange: this.props.isDataChange,
            locations: [],
            dataChangeFlag: 0
        }
    }
    static defaultProps = {
        className: '',
        isMulti: false
    }


    componentWillReceiveProps(newProps: SelectLocationsProps) {
        if (this.props.isDataChange != newProps.isDataChange) {
            this.setState({ selectedLocations: Utils.convertOptionSimplesToSelectItems(newProps.selectedLocations), isDataChange: newProps.isDataChange })
        }
    }

    async componentDidMount() {
        await this.getLocations();
    }

    private async getLocations(freeText: string = '') {
        let res = await LocationRepository.Search(freeText, 1, 10000)
        if (res != null) {
            if (res.success) {
                let datas = Utils.isArrNullOrHaveNoItem(res.data.datas) ? [] : res.data.datas
                //datas.unshift({ value: '0', label: 'Chọn khu vực' })
                this.setState({ locations: datas, dataChangeFlag: this.state.dataChangeFlag + 1 })
            }
            else {
                this.setState({ locations: [], dataChangeFlag: this.state.dataChangeFlag + 1 })
            }
        }
        else {
            this.setState({ locations: [], dataChangeFlag: this.state.dataChangeFlag + 1 })
        }
    }



    private onSelectLocation(item: ISelectItem, currentItem: ISelectItem = null) {
        let { selectedLocations } = this.state
        if (Utils.isNullOrUndefined(item))
            return
        if (Utils.isNullOrUndefined(selectedLocations)) {

            selectedLocations = []
        }


        if (currentItem != null) {
            let index = selectedLocations.findIndex(p => p.value == currentItem.value)

            if (index < 0) {
                selectedLocations.push(item)

            }
            else {
                selectedLocations[index] = item
            }
        }


        this.setState({ selectedLocations: selectedLocations }, () => {
            if (this.props.onChange) {
                this.props.onChange(selectedLocations)
            }
        })
    }
    private onAddMoreLocation() {
        let { selectedLocations } = this.state
        if (selectedLocations.length > 2)
            return
        selectedLocations.push({ label: '-Location-', value: Utils.getNewGuid() })
        this.setState({ selectedLocations: selectedLocations });
    }

    private onRemoveLocation(code: string) {
        let { selectedLocations } = this.state
        let index = selectedLocations.findIndex(p => p.value == code)

        selectedLocations.splice(index, 1);
        this.setState({ selectedLocations: selectedLocations }, () => {
            if (this.props.onChange) {
                this.props.onChange(selectedLocations)
            }
        })

    }

    private onChangeLocationAddress(item: ISelectItem, value) {

        if (Utils.isNullOrUndefined(item))
            return
        let { selectedLocations } = this.state

        let location = selectedLocations.find(p => p.value == item.value)
        location.address = value
        this.setState({ selectedLocations: selectedLocations }, () => {
            if (this.props.onChange) {
                this.props.onChange(selectedLocations)
            }
        })
    }

    private renderLocations() {
        let { locations, selectedLocations } = this.state

        if (Utils.isNullOrUndefined(locations) || Utils.isArrNullOrHaveNoItem(locations)) {
            return null;
        }
        return <div className={this.props.className}>
            {selectedLocations.map(item => {
                return <div className="mg-b-20">
                    <label className="label-input-groups">Location:</label>
                    {<SelectionV2 key={item.value} datas={this.state.locations} selectedId={item.value}
                        dataId={'value'} dataLabel='label' onClickItem={(location) => this.onSelectLocation(location, item)}
                    />}

                    {selectedLocations.length > 1 && < Button className='link-no-pding' isDisabled={false}
                        type='link-no-pding' onClick={() => this.onRemoveLocation(item.value)}>
                        <CreateSVG svgName="icontimes" size={12} />
                    </Button>}
                    {selectedLocations.length < 3 && <Button type="link-no-pding" className="experience" onClick={() => this.onAddMoreLocation()}>
                        <span>Thêm khu vực</span>
                    </Button>}

                    <label className="label-input-groups">Address</label>
                    <Input value={item.address}
                        onChange={(e) => this.onChangeLocationAddress(item, e.target.value)} />


                </div>
            })}
        </div>
    }
    private renderSingleLocation() {

        let { locations, selectedLocations } = this.state


        return <ReactSelectCustom options={locations}
                    placeholder={'Vui lòng chọn'}
                    selectedItems={selectedLocations}
                    isMultiple={this.props.isMulti}
                    className={this.props.className}
                    onInputChange={async (value) => {
                        await this.getLocations(value)
                    }}
                    onChange={(selectedItems, item) => {
                        this.setState({ selectedLocations: selectedItems }, () => {
                            if (this.props.onChange) {
                                this.props.onChange(selectedItems)
                            }

                        })
                    }}
                    dataChangeFlag={locations.length} />

    }

   


    render() {
        return this.props.isSelectSingle ? this.renderSingleLocation() : this.renderLocations()
    }
}