import {MyUtils} from "./my_util";

export class GetFormatDate {

    static async format(startDate: any, endDate: any) {

        let searchStartDate = MyUtils.startOfDate(new Date("01/01/2000"));

        let searchEndDate = MyUtils.endOfDate(new Date());

        try {

            if (startDate) {
                try {
                    if (typeof startDate === 'string') {
                        let date = MyUtils.stringToDate(startDate, "dd/MM/yyyy", "/");
                        searchStartDate = MyUtils.startOfDate(date);
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            if (endDate) {
                try {
                    if (typeof endDate === 'string') {
                        let date = MyUtils.stringToDate(endDate, "dd/MM/yyyy", "/");
                        searchEndDate = MyUtils.endOfDate(date);
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            return {searchStartDate, searchEndDate };

        } catch (e) {

            console.log(e);
            return {searchStartDate, searchEndDate };
        }
    }
}
