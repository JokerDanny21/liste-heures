import { Component, Input, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MMMM/YYYY',
  },
  display: {
    dateInput: 'MMMM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/** @title Datepicker emulating a Year and month picker */
@Component({
  selector: 'app-date-selector',
  templateUrl: 'date-selector.html',
  styleUrls: ['date-selector.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DateSelectorComponent implements OnInit {
  // export class DateSelectorComponent implements AfterContentInit {
  // pour faire le lien du listForm du parent avec le child
  @Input() listForm: FormGroup;

  // passe mois et année par EvenEmitter pour que le fomulaire dans le component parent "comprenne la valeur" sinon toujours null
  @Output() dateChange = new EventEmitter<object>();
  monthInput: string;
  yearInput: string;

  // ViewChild pour connecter à la variable local dans le template #dateValue
  @ViewChild('dateValue') dateValue;

  date = new FormControl(moment());

  // heure en français
  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('fr');
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normlizedMonth.month());
    this.date.setValue(ctrlValue);

    datepicker.close();
    this.emitDate();
  }

  emitDate() {
    // éxrtraie le mois et l'année de la chaine :mois/année:
    this.monthInput = this.dateValue.nativeElement.value.substring(0, this.dateValue.nativeElement.value.indexOf('/'));
    // console.log('mois:' + this.monthInput);
    this.yearInput = this.dateValue.nativeElement.value.substring(this.dateValue.nativeElement.value.indexOf('/') + 1);
    // console.log('année:' + this.yearInput);

    // émeteur
    this.dateChange.emit({ month: this.monthInput, year: this.yearInput });
  }

  // hook pour emit la date qui apprait automatiquement au début
  ngOnInit() {
    setTimeout(() => {
      this.emitDate();
    });

  }
}
