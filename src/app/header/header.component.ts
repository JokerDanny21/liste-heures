import { Component } from '@angular/core';
import { HLService } from '../hours-list/hours-list.service';
import { ListEditComponent } from '../hours-list/list-edit/list-edit.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isExpanded = false;
  element: HTMLElement;

  toggleActive(event: any) {
    event.preventDefault();
    if (this.element !== undefined) {
      this.element.style.backgroundColor = '#D1C4E9';
    }
    const target = event.currentTarget;
    target.style.backgroundColor = '#FFC107';
    this.element = target;
  }
}
