import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classnames from 'classnames';
import * as LibComponents from '../../components';
import * as Utils from '../../infrastructure/Utils';
import { Input, CreateSVG, Loading } from '../../CoreComponents'
import _ from 'lodash';
import { func } from 'prop-types';

interface IComboboxSearchProps {
    value: any,
    className?: string,
    onPrepaging?: Function,
    onChange?: Function,
    fieldValue: string,
    fieldLabel: string,
    placeHolder?: string,
    display?: string,
    datas:any[]
}

interface IComboboxSearchStates {
    isOpen: boolean,
    value: any,
    inputSearch: string,
    isPrepaged: boolean,
    dropUp: boolean
}

export class ComboboxSearch extends React.Component<IComboboxSearchProps, IComboboxSearchStates> {

    node = null
    ref_content = null
    mounted = false
    timeoutBlur =null
    constructor(props: any) {
        super(props)
        
        this.state = {
            isOpen: false,
            value: this.props.value,
            inputSearch: null,
            isPrepaged: false,
            dropUp: false
        }
        this.determineDropUp = this.determineDropUp.bind(this);
        this.handleOnDebounce = _.debounce(this.handleOnDebounce.bind(this), 500);
        this.onBlur = this.onBlur.bind(this);

    }
    static defaultProps = {
        className: '',
        placeHolder:''
    }
    componentDidMount() {
        this.mounted = true;
        this.node = ReactDOM.findDOMNode(this);
        window.addEventListener('resize', this.handleOnDebounce);
        window.addEventListener('scroll', this.handleOnDebounce);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleOnDebounce);
        window.removeEventListener('scroll', this.handleOnDebounce);
        this.mounted = false;
        this.node = null;
    }

    private handleOnDebounce() {
        this.determineDropUp();
    };

    private determineDropUp() {
        if (!this.node)
            return;
        let windowHeight = window.innerHeight;
        let menuHeight = this.ref_content ? this.ref_content.offsetHeight + 20 : 0;
        let instOffsetWithMenu = this.node.getBoundingClientRect().bottom + menuHeight;
        if (this.mounted)
            this.setState({
                dropUp: instOffsetWithMenu >= windowHeight
            });
    }

   private onFocus(e) {
        var _this = this;
        if (!this.state.isPrepaged && this.props.onPrepaging) {
            this.props.onPrepaging();
        }
        this.setState({
            isOpen: true,
            inputSearch: null,
            isPrepaged: true
        }, function () { return _this.determineDropUp(); });
    };
    private onBlur(e) {
        var _this = this;
        setTimeout(function () {
            if (_this.mounted)
                _this.setState({
                    isOpen: false,
                    inputSearch: null
                });
        }, 300);
    };

    private onChange(e) {
        var value = e.target.value;
        if (value != null) {
            value = Utils.NonUnicode(value, true);
        }
        this.setState({
            inputSearch: value
        });
    };

    private onClickItem(item) {
        var value = item[this.props.fieldValue];
        this.setState({
            isOpen: false,
            value: value
        });
        if (this.props.onChange) {
            this.props.onChange(value, item);
        }
        clearTimeout(this.timeoutBlur);
    };

    private renderInput() {
        var _this = this;
        var selectedItem = null;
        var display = this.props.placeHolder;
        if (this.state.value) {
            selectedItem = this.props.datas.find(function (item, i) { return item[_this.props.fieldValue] == _this.state.value; });
            if (selectedItem) {
                display = selectedItem[this.props.fieldLabel];
            }
            else
                display = this.props.display;
        }

        //return <div className={this.state.isOpen ? 'focus' : ''}>
        //    <div className={''}>
        //        <div className={''}>
        //            {this.state.isOpen ? <input ref: 
                        
        //        </div>
        //        </div>
        //    </div>
        return React.createElement("div", { className: 'hrv-combobox-search-box' + (this.state.isOpen ? ' is-focusing' : '') },
            React.createElement("div", { className: 'hrv-combobox-search-textbox' },
                React.createElement("div", { className: 'hrv-combobox-search-text' }, this.state.isOpen ?
                    React.createElement("input", {
                        ref: function (e) {
                            if (e)
                                e.focus();
                        }, key: "search", defaultValue: this.state.inputSearch, className: 'hrv-combobox-search-input', onChange: function (e) { return _this.onChange(e); }, onBlur: function (e) { return _this.onBlur(e); }
                    }) :
                    React.createElement("input", { key: "display", defaultValue: display, className: 'hrv-combobox-search-input', onFocus: function (e) { return _this.onFocus(e); } })),
                React.createElement("div", { className: 'hrv-combobox-search-icon', onClick: function (e) { return _this.onFocus(e); } },
                    React.createElement(CreateSVG, { type: 'arrow', size: 10, rotate: 90 }))));
    }

    private renderSuggestList() {
        var _this = this;
        var listSuggest = this.state.inputSearch ? this.props.datas.filter(function (i) {
            return Utils.NonUnicode(i[_this.props.fieldLabel], true).indexOf(_this.state.inputSearch) != -1;
        }) : this.props.datas;
        var nullItem = {};
        var classes = classnames({
            'hrv-popover-container': true,
            'is-openning': this.state.isOpen,
            'hrv-popover-placement-top': this.state.dropUp
        });
        var selectedItem = this.props.datas.find(function (item, i) { return item[_this.props.fieldValue] == _this.state.value; });
        return React.createElement("div", { className: classes }, listSuggest && listSuggest.length > 0
            ? React.createElement("div", { className: 'hrv-popover-list', ref: function (component) { return _this.ref_content = component; } },
                this.props.placeHolder ? React.createElement("div", { onClick: function () { return _this.onClickItem(nullItem); }, key: "null", className: 'hrv-popover-item' }, this.props.placeHolder) : null,
                listSuggest.map(function (item, index) {
                    return (selectedItem && item[_this.props.fieldValue] == selectedItem[_this.props.fieldValue])
                        ? React.createElement("div", { key: item[_this.props.fieldValue], className: 'hrv-popover-item hrv-combobox-search--is-selected' }, item[_this.props.fieldLabel])
                        : React.createElement("div", { key: item[_this.props.fieldValue], onClick: function () { return _this.onClickItem(item); }, className: 'hrv-popover-item' }, item[_this.props.fieldLabel]);
                }))
            : React.createElement("div", { className: 'hrv-popover-empty', ref: function (component) { return _this.ref_content = component; } }, "Kh\u00F4ng t\u00ECm th\u1EA5y d\u1EEF li\u1EC7u"));
    };
  
    public render() {
        return <div className={this.props.className}>
            {this.renderInput()}
            {this.state.isOpen && this.renderSuggestList()}
        </div>

    }
}