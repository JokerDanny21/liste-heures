import { Component, OnInit, OnDestroy } from '@angular/core';
import { HLService } from './hours-list.service';
import { HourList } from './hour-list.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hours-list',
  templateUrl: './hours-list.component.html',
  styleUrls: ['./hours-list.component.css']
})
export class HoursListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  hourLists: HourList[];

  constructor(private hlService: HLService) { }

  ngOnInit() {
    // local load
    this.hourLists = this.hlService.getHoursList();
    // server load
    this.hlService.getLists();

    this.subscription = this.hlService.hoursListsChanged.subscribe(
      (hourList: HourList[]) => {
        this.hourLists = hourList;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendToServer() {
    this.hlService.storeLists().subscribe(
      (response: Response) => {
        console.log(response);
      }
    );
  }

  WasListEditDeleted() {
    if (this.hlService.ListDetailWasDeleted) {
      return true;
    }
  }
}
