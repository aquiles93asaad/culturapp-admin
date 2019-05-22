import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'booelanTextValue' })
export class BooelanTextValuePipe implements PipeTransform {
    transform(value: boolean): string {
        return value == true ? 'Si' : 'No'
    }; 
}