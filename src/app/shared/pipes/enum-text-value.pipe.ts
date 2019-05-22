import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'enumTextValue' })
export class EnumTextValuePipe implements PipeTransform {
    transform(value: string, enumValues: any): string {
        for (const key in enumValues) {
            if (enumValues.hasOwnProperty(key)) {
                if(value == key)
                    return enumValues[key];
            }
        }
        return '';
    };
}