import { HourList } from './hour-list.model';
import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable()
export class HLService {
  ListDetailWasDeleted = false;

  hoursListsChanged = new Subject<HourList[]>();

  private hoursLists: HourList[] = [];

  constructor(private httpClient: HttpClient) { }

  setHourLists(hourLists: HourList[]) {
    this.hoursLists = hourLists;
    this.hoursListsChanged.next(this.hoursLists.slice());
  }

  getHoursList() {
    return this.hoursLists.slice();
  }

  addHoursList(hourList: HourList) {
    this.hoursLists.push(hourList);
    this.hoursListsChanged.next(this.hoursLists.slice());
  }
  deleteHoursList(index: number) {
    this.hoursLists.splice(index, 1);
    this.hoursListsChanged.next(this.hoursLists.slice());
  }

  // millisecond to Time(hrs:mins)
  msToTime(s) {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return hrs + ':' + mins;
  }

  TimeToMs(str) {
    let p, s, m;
    p = str.split(':'),
      s = 0, m = 1;

    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }
    return s * 1000;
  }

  // FireBase
  storeLists() {
    // enlever le message de confirmation lorsqu'on efface une liste dans le EDIT
    this.ListDetailWasDeleted = false;

    return this.httpClient.put('https://danny-liste-heures.firebaseio.com/lists.json',
      this.getHoursList());

  }

  getLists() {
    this.httpClient.get('https://danny-liste-heures.firebaseio.com/lists.json')
      .subscribe(
        (hourLists: HourList[]) => {
          if (hourLists == null) {
            console.log('error');
          } else {
            this.setHourLists(hourLists);
          }
        }
      );
  }
}
