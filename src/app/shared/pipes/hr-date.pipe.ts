import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';
import "moment/min/locales";

@Pipe ({
    name: 'HRDate'
})
export class HRDatePipe implements PipeTransform {
    constructor(){}

    transform(value: Date, ...args: any[]) {
        if (!value) return "";

        let [format] = args;

        let locale = window.navigator.language;
        return moment
            .utc(value)
            .local()
            .locale(locale)
            .format(format ? format : 'DD MMM yyyy HH:mm:ss')
    }
}
