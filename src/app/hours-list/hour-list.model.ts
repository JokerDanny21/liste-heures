import { Day } from './day.model';


export class HourList {
  public month: string;
  public year: number;

  public residency: string;

  public days: Day[];

  constructor(
    month: string,
    year: number,
    residency: string,
    days: Day[]
  ) {
    this.month = month;
    this.year = year;
    this.residency = residency;
    this.days = days;
  }
}
