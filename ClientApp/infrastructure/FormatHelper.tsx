import * as moment from 'moment';
import * as numeral from 'numeral';
import { number } from 'prop-types';

let localeCurrency = "VND",
    localeCulture = "vi-VN";

const isNullOrWhiteSpace = (str: string): boolean => {
    if (str == null || str === '' || str == undefined)
        return true
    return false;
}
numeral.register('locale', 'vi', {
    delimiters: {
        thousands: ',',
        decimal: '.'
    },
    abbreviations: {
        thousand: ' nghìn',
        million: ' triệu',
        billion: ' tỷ',
        trillion: ' nghìn tỷ'
    },
    ordinal: function () {
        return '.';
    },
    currency: {
        symbol: '₫'
    }
});
numeral.locale('vi');
export const formatMoney = "0,0.[00] $"
export const FormatPercent = (value: any, format: string = '0,0'): string => {
    return numeral(value).format(format) + ' %';
}
export const moneyToNumber = (value: any, allowNegative: boolean = true): number => {
    let result = numeral(value).value()
    if (allowNegative == false && result < 0) {
        result *= -1
    }
    return result
}
export const MomentLocaleCalendar = (date: Date = new Date(), format?: string, calendarFormatChange?: string): string => {
    let nowTime = new Date();

    moment.relativeTimeThreshold('s', 60);
    moment.relativeTimeThreshold('m', 60);
    moment.relativeTimeThreshold('h', 24);

    moment.updateLocale('vi', {
        months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        weekdays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
        longDateFormat: {
            LT: "hh:mm A",
            LTS: "hh:mm:ss A",
            L: "DD/MM/YYYY",
            LL: "Do MMMM YYYY",
            LLL: "Do MMMM YYYY LT",
            LLLL: "dddd, Do MMMM YYYY LT"
        },
        calendar: {
            sameDay: calendarFormatChange ? `[Hôm nay] ${calendarFormatChange}` : "[Hôm nay] LT",
            nextDay: calendarFormatChange ? `[Ngày mai] ${calendarFormatChange}` : "[Ngày mai] LT",
            nextWeek: `L LT`,
            lastDay: calendarFormatChange ? `[Hôm qua] ${calendarFormatChange}` : "[Hôm qua] LT",
            lastWeek: `L LT`,
            sameElse: `L LT`
        },
        relativeTime: {
            future: "trong %s",
            past: "%s trước",
            s: 'vài giây',
            ss: '%d giây',
            m: "1 phút",
            mm: "%d phút",
            h: "một giờ",
            hh: "%d giờ",
            d: "một ngày",
            dd: "%d ngày",
            M: "một tháng",
            MM: "%d tháng",
            y: "một năm",
            yy: "%d năm"
        },
        meridiem: function (hour, minute, isLowercase) {
            return hour < 12 ? 'SA' : 'CH';
        },
        invalidDate: "Ngày không hợp lệ"
    });
    if (format) {
        return moment(new Date(date)).format(format);
    }

    let inOneHour = moment(nowTime).diff(moment(date), 'minutes');
    if (inOneHour >= 0 && inOneHour < 60) {
        return moment(date).fromNow();
    }

    return moment(date).calendar();
}
export const FormatDateTime = (inputDate: any, format: string = ""): string => {
    if (isNullOrWhiteSpace(format)) {
        return MomentLocaleCalendar(inputDate);
    }
    else {
        return MomentLocaleCalendar(inputDate);
    }
}
export const getDateFromUnix = (unix: number): Date => {
    return new Date(unix * 1000)
}
export const getDateInUtc = (inputDate: Date): Date => {
    return moment(inputDate, "YYYY-MM-DD").utc().toDate()
}
export const FormatDateTimeFromDate = (inputDate: Date, format: string = "DD/MM/YYYY hh:mm A", calendarFormatChange?: string): string => {
    return MomentLocaleCalendar(inputDate, format, calendarFormatChange);
}
export const FormatDateTimeFromTimespan = (inputDate: number, format: string = "DD/MM/YYYY hh:mm A", calendarFormatChange?: string): string => {
    let d = getDateFromUnix(inputDate)
    return MomentLocaleCalendar(d, format, calendarFormatChange);
}
export const getDuration = (fromDate: Date, toDate: Date, type: string = 'months'): string => {
    let start = moment(toDate)
    let end = moment(fromDate)
    let value = start.diff(end, 'months')
    let result = ''
    if (value > 12) {

        let month = value % 12
        let year = (value - month) / 12
        if (year > 0)
            result = `${year} năm ${month} tháng`
        else
            result = `${month} tháng`
    }
    else
        result = `${value} tháng`
    return result
}
export const getDurationV2 = (fromYear: number, fromMonth: number, toYear: number, toMonth: number): string => {
    if (toYear == null) {
        let now = new Date();
        toYear = now.getFullYear();
        toMonth = now.getMonth()+1
    }
    if (fromYear > toYear)
        return "undefined";
    
    let diffYear = toYear - fromYear;
    let diffMonth = 12 - fromMonth + 1 + toMonth;
    let months = diffMonth
    if (diffMonth > 12) {
        months = diffMonth % 12;
        let years = (diffMonth - months) / 12
        diffYear += years
    }
    if (months < 12 && diffYear <= 1)
        return `${months} tháng`;
    if (months < 12 && diffYear > 1)
        return `${diffYear - 1} năm ${months} tháng`;
    if (months == 12 && diffYear == 1)
        return `$1 năm`;
    
    return "undefined";
}
export const FormatMoney = (value: any, format?: string): string => {

    switch (localeCurrency) {
        case "VND":

            if (format) {
                numeral.locale('vi');
                return numeral(value).format(format)
            } else {
                numeral.locale('vi');
                format = "0,0 $"
                return numeral(value).format(format)
            }
        default:
            if (format) {
                return numeral(value).format(format)
            } else {
                format = "$ 0,0"
                return numeral(value).format(format)
            }
    }
}
//export const FormatMoney = (value: any, format: string = '0,0 $'): string => {
//    console.log(value)
//    console.log(numeral(value))
//    return numeral(value).format(format)
//}
export const FormatNumber = (value: any, format: string = '0,0'): string => {
    return numeral(value).format(format)
}
