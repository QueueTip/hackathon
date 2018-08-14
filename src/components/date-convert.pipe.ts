import {Pipe} from '@angular/core';

@Pipe({
    name: 'dateConvert'
})
export class DateConvertPipe {
    transform(value, args) {
        if (value.length === 8) return value.substring(4, 6) + "/" + value.substring(6, 8) + "/" + value.substring(0, 4);
        return value;
    }
}