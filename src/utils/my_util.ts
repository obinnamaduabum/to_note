import * as fs from "fs";
import axios, {AxiosRequestConfig} from "axios";
import {Sequelize} from "sequelize";

export class MyUtils {

    static formatString(str: string, ...val: string[]) {
        for (let index = 0; index < val.length; index++) {
            str = str.replace(`{${index}}`, val[index]);
        }
        return str;
    }

    static dateFormat(date, fstr, utc) {
        utc = utc ? 'getUTC' : 'get';
        return fstr.replace (/%[YmdHMS]/g, function (m) {
            switch (m) {
                case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
                case '%m': m = 1 + date[utc + 'Month'] (); break;
                case '%d': m = date[utc + 'Date'] (); break;
                case '%H': m = date[utc + 'Hours'] (); break;
                case '%M': m = date[utc + 'Minutes'] (); break;
                case '%S': m = date[utc + 'Seconds'] (); break;
                default: return m.slice (1); // unknown code, remove %
            }
            // add leading zero if required
            return ('0' + m).slice (-2);
        });
    }

    static removeWhiteSpace(input: string) {
        return input.replace(/\s+/g, '');
    }

    static numberWithCommas(x) {
        let parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    static async emailValidator(value: string) {
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(String(value).toLowerCase());
    }

    static removeSpace(value: string) {
        return value.replace(/\s+/g, '');
    }

    static nairaTokobo(value: number) {
        return value * 100;
    }

    static koboToNaira(value: number) {
        return value / 100;
    }


    static startOfDate (date: Date) {
        date.setHours(0,0,0,0);
        return date;
    }

    static endOfDate(date: Date) {
        date.setHours(23,59,59,999);
        return date;
    }

    static stringDateConversion(dateString: string) {
        const date = new Date(dateString);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return [day, month, date.getFullYear()].join("/");

    }

    static stringToDate(date: string, format: string, delimiter: string) {

        try {

            let formatLowerCase = format.toLowerCase();
            let formatItems = formatLowerCase.split(delimiter);
            let dateItems = date.split(delimiter);
            let monthIndex = formatItems.indexOf("mm");
            let dayIndex = formatItems.indexOf("dd");
            let yearIndex = formatItems.indexOf("yyyy");
            let month = parseInt(dateItems[monthIndex]);
            let year = parseInt(dateItems[yearIndex]);
            let day = parseInt(dateItems[dayIndex]);
            month -= 1;
            let formattedDate = new Date(year, month, day);
            return formattedDate;
        } catch (e) {
            throw e;
        }
    }


    static toTimeStamp(date: string) {
        const datum: Date = new Date(date);
        return datum.getTime();
    }


    static dateToTimeStamp(date: Date): number {
        return date.getTime();
    }

    static pageNumber(pageNumber: number, pageSize: number, index: number) {
        if (pageNumber == 0) {
           return  (index + 1);
        } else {
            return (index + pageSize + pageNumber);
        }
    }

    static validateIPaddress(ipaddress: string) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return true;
        }
        // alert("You have entered an invalid IP address!");
        return false;
    }


    static addMinutesToDate(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes*60000);
    }


    static addHoursToDate(date: Date, hours: number) {
        return new Date(date.getTime() + (hours*60*60*1000));
    }

    static removeHoursToDate(date: Date, hours: number) {
        return new Date(date.getTime() - (hours*60*60*1000));
    }


    static checkIfObjectIsEmpty(obj) {

        for(let prop in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false;
            }
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    static addDaysToDate(days: number) {
        const date = new Date();
        return date.setDate(date.getDate() + days);

    }


    static randomString(length: number) {
        const chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }


    static randomStringOfNumbers(length: number) {
        const chars: string = '0123456789';
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }




    static pageOffsetCalculator(pageNumber: number, pageSize: number, index: number) {
        try {
            let result = pageNumber * pageSize + index + 1;
            return result;
        } catch (e) {
            return  0;
        }
    }

    static async toObject(array: any[]) {
        array.reduce((obj, item) => {
            obj[item.type] = item['data'];
            return obj
        }, {})
    }

    static readImageForPuppeteer(path: string) {

        try {
            return `data:image/jpeg;base64,${fs.readFileSync(path).toString('base64')}`;
        }catch (e) {
            console.log(e);
            return "";
        }
    }

    static roundOffToNearestTen(value) {
        return Math.ceil(value / 10) * 10;
    }

    static capitalizeWord(inputData: string) {
        try {

            const value = inputData.toLowerCase();
            return value.charAt(0).toUpperCase() + value.slice(1);
        } catch (e) {
            return '';
        }
    }

    static capitalizeWordWithSpace(inputData: string) {
        try {
            const words = inputData.split(" ");
            return words.map((word) => {
                return word[0].toUpperCase() + word.substring(1);
            }).join(" ");
        } catch (e) {
            return '';
        }
    }


    static dbLowerCaseSearch(column, inputString) {
        return Sequelize.where(
            Sequelize.fn('lower', Sequelize.col(column)),
            Sequelize.fn('lower', inputString)
        )
    }

    static stringOrArray(stringInput: any, array: any){
        if (stringInput) {
            if (typeof stringInput === 'string' || stringInput instanceof String) {
                array = stringInput.toString();
            } else if (stringInput instanceof Array) {
                if(stringInput.length > 0){
                    array = stringInput;
                } else {
                    array = null;
                }
            }
        } else {
            return  null;
        }

        return array;
    }

    static getCount(count: any): number {
        try {
            return parseInt(count[0]['count']);
        } catch (e) {
            return 0;
        }
    }


    //Sql injection prevention
    static escapeString(input: any) {
       // return SqlString.escapeId(input);
        return input;
    }


    static myParseInt(input: any): number {
        try {
            return parseInt(input);
        } catch (e) {
            throw e;
        }
    }


    static myParseIntWithValidator(input: any): number | null {

        try {
            if(input !== null && input !== 'undefined'){
                return parseInt(input);
            }

            return null;

        } catch (e) {
            return null;
        }
    }

    static truncateString(str, num) {
        if (str.length > num) {
            return str.slice(0, num - 3) + "...";
        } else {
            return str;
        }
    }
}
