//import * as React from 'react';
//import { LocationRepository } from '../../repositories/LocationRepository'
//import * as Utils from '../../infrastructure/Utils'

//import * as LibHaravan from '@haravan/react-components';

//interface ILocationsProps {
//    countryId?: number,
//    provinceId?: number,
//    hasAll?: boolean,
//    onChanged: Function,
//    isPlaceholder?: boolean
//}

//export class Locations extends React.Component<ILocationsProps, any> {
//    constructor(props: any) {
//        super(props);
//    }

//    static defaultProps = {
//        isPlaceholder: true
//    }

//    async getProvince() {
//        let data = await LocationRepository.Search('',1,10000);
//        return data.data;
//    }

//    public render() {
//        let placeholder = 'Khu vực';
//        if (this.props.hasAll == true && this.props.countryId > 0) {
//            placeholder = 'Tất cả ' + placeholder;
//        } else {
//            if (this.props.isPlaceholder) {
//                placeholder = 'Chọn ' + placeholder;
//            } else {
//                placeholder = '';
//            }
//        }
//        return <LibHaravan.ComboboxSearchAjax key={this.props.countryId} onChange={this.props.onChanged} placeHolder={placeholder}
//            value={this.props.provinceId} callback={() => this.getProvince()} />
//    }
//}