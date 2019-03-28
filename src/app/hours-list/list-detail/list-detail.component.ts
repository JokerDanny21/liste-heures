import { Component, OnInit, Input } from '@angular/core';
import { HourList } from '../hour-list.model';
import { HLService } from '../hours-list.service';

import * as jspdf from 'jspdf';

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements OnInit {
  @Input() hourList: HourList;
  @Input() index: number;
  HourMonthStr;
  months = [
    'janvier', 'février', 'mars', 'avril', 'mai',
    'juin', 'juillet', 'août', 'septembre',
    'octobre', 'novembre', 'décembre'
  ];
  numericMonth;

  isExpanded = false;
  constructor(private hlService: HLService) { }

  ngOnInit() {
    this.calculateMonthTotal();
  }

  monthNameToNum(monthname) {
    const month = this.months.indexOf(monthname);
    this.numericMonth = (month ? month : 0) + 1;
    return month ? month : 0;
  }
  onDelete(index) {
    this.hlService.deleteHoursList(index);
    this.hlService.ListDetailWasDeleted = true;

    setTimeout(() => {
      this.scrollEndPage();
    });
  }
  scrollEndPage() {
    const elmnt = document.getElementById('scrollHere');
    elmnt.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  calculateMonthTotal() {
    let HourMonth = 0;
    this.hourList.days.forEach(element => {
      HourMonth = HourMonth + this.hlService.TimeToMs(element.hourDay + ':' + 0);
    });
    this.HourMonthStr = this.hlService.msToTime(HourMonth);
  }

  // Collapse
  collapse(index) {
    const data = document.getElementById('collapseMe' + index);

    if (data.classList.contains('active')) {
      data.classList.remove('active');
    } else {
      data.classList.add('active');
    }
    this.isExpanded = !this.isExpanded;
  }

  // print
  captureScreen(index) {
    const data = document.getElementById('contentToConvert' + index);
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }
}
