import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSpace',
  standalone: true,
})
export class NumberSpacePipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value !== 'number') return value;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
