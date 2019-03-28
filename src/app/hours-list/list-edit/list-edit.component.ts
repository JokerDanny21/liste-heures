import { Component, OnInit, Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { HourList } from '../hour-list.model';
import { HLService } from '../hours-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.css']
})
export class ListEditComponent implements OnInit {
  // pour cacher le mois et résidence
  DayAdded = false;
  // pour enlever bouton ajouter jour apères avoir Envoyer
  Send = false;
  // pour choisir le dernier jour
  countDays = 0;

  EditEnabled = false;
  // savoir si on est en train de edit
  Edit: false;

  HourMonthStr;
  startDate = new Date(2019, 1, 1);
  listForm: FormGroup;
  listDays = new FormArray([]);
  residencyList = ['Grey', 'Centre', 'Woiwer'];
  months = [
    'janvier', 'février', 'mars', 'avril', 'mai',
    'juin', 'juillet', 'août', 'septembre',
    'octobre', 'novembre', 'décembre'
  ];
  numericMonth;
  DataSaved = false;

  // Time
  timeIn = { hour: 14, minute: 0, second: 0 };
  timeInToString;
  timeOut = { hour: 17, minute: 0, second: 0 };
  timeOutToString;
  timeTotal;
  selectedDay = 1;

  // Array pour hidden les picker
  dayChangeStatus = [];

  hourStep = 1;
  minuteStep = 30;
  secondStep = 30;

  Temporary = [];

  constructor(private hlService: HLService, private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.timeInit();
  }

  // initier Formulaire avec les bon champs(html)
  initForm() {
    const listMonth = '';
    const listYear = '';
    const listResidency = 'Grey';

    this.listForm = new FormGroup({
      'month': new FormControl(listMonth),
      'year': new FormControl(listYear),
      'residency': new FormControl(listResidency),
      'days': this.listDays
    });
  }

  onSubmit() {
    // confirme le dernier jour ajouté
    if (!this.dayChangeStatus[this.countDays - 1].dayPicker) {
      if (this.countDays >= 1) {
        this.temporaryAndPatch(this.countDays - 1);
        this.onSendConfirmLast();
      }

    }

    const newHourList = new HourList(
      this.listForm.value.month,
      this.listForm.value.year,
      this.listForm.value.residency,
      this.listForm.value.days
    );
    console.log('saved list:');
    console.log(newHourList);
    this.Send = true;

    this.hlService.addHoursList(this.listForm.value);
  }

  sendToServer() {
    this.hlService.storeLists().subscribe(
      (response: Response) => {
        console.log(response);
        this.DataSaved = true;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      }
    );
  }

  // lorsque la date est changé => cette fonction:
  // patchValue => changer manuellement le form avec la bonne date choisi
  patchDate(dateChoisi: string) {
    this.listForm.patchValue({
      'month': dateChoisi['month'],
      'year': dateChoisi['year'],
    });

    // quand on change le mois, mettre à jour sur la bonne année/mois dans la section jour
    this.startDate = new Date(+(this.listForm.value.year), this.monthNameToNum(this.listForm.value.month), this.selectedDay);
  }
  // à l'aide de l'array des mois en haut, extraire le numéro du mois
  monthNameToNum(monthname) {
    const month = this.months.indexOf(monthname);
    this.numericMonth = (month ? month : 0) + 1;
    return month ? month : 0;
  }

  dayGotSelected(index) {
    this.selectedDay = this.startDate.getDate();
    this.temporaryAndPatch(index);
  }

  timeInit() {
    this.timeInToString = this.hlService.TimeToMs(this.timeIn.hour + ':' + this.timeIn.minute + ':' + this.timeIn.second);
    this.timeOutToString = this.hlService.TimeToMs(this.timeOut.hour + ':' + this.timeOut.minute + ':' + this.timeOut.second);

    this.timeTotal = this.hlService.msToTime(this.timeOutToString - this.timeInToString);
  }

  timeInChanged(index) {
    if (this.Edit) {

    } else {
      this.timeInit();
      // sauver hourIn dans l'array à l'aide du index
      this.temporaryAndPatch(index);
    }
  }

  timeOutChanged(index) {
    this.timeInit();
    // sauver hourOut dans l'array à l'aide du index
    this.temporaryAndPatch(index);
  }

  onAddDay() {
    // faire mois et résidennce invisible
    this.DayAdded = true;
    // onAddDay appelle ça pour ajouter une ligne/index = nouveau jour
    this.newTemporaryDay();

    // onAddDay appelle ça pour initier les checkers sur false
    this.dayChangeCompleted();

    (<FormArray>this.listForm.get('days')).push(
      new FormGroup({
        'day': new FormControl(null, [Validators.min(1), Validators.max(31)]),
        'hourIn': new FormControl(null),
        'hourOut': new FormControl(null),
        'hourDay': new FormControl(null),
      })
    );

    if (this.countDays >= 1) {
      this.temporaryAndPatch(this.countDays - 1);
    }

    this.countDays++;
    // pour ajouter au total lorsqu'on ajoute un nouveau jour les valeurs initial
    this.calcule();
    if (this.countDays > 1) {
      this.onAddDayConfirmed();
    }

    setTimeout(() => {
      this.scrollEndPage();
    });
  }
  scrollEndPage() {
    const elmnt = document.getElementById('scrollThis');
    elmnt.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  temporaryAndPatch(index) {
    this.Temporary[index].day = this.selectedDay;
    this.listDays.at(index).patchValue({
      'day': this.selectedDay,
    });

    this.Temporary[index].hourIn = this.hlService.msToTime(this.timeInToString);
    this.listDays.at(index).patchValue({
      'hourIn': this.hlService.msToTime(this.timeInToString),
    });

    this.Temporary[index].hourOut = this.hlService.msToTime(this.timeOutToString);
    this.listDays.at(index).patchValue({
      'hourOut': this.hlService.msToTime(this.timeOutToString),
    });

    this.Temporary[index].hourDay = this.timeTotal;
    this.listDays.at(index).patchValue({
      'hourDay': this.timeTotal,
    });
    this.calcule();
  }

  editDay(index) {
    const stringIn = this.Temporary[index].hourIn;
    console.log(stringIn.substring(0, stringIn.lastIndexOf(':')));
    console.log(stringIn.substring(stringIn.lastIndexOf(':') + 1));

    const stringOut = this.Temporary[index].hourOut;
    console.log(stringOut);
    // this.startDate = new Date(2019, 1, this.Temporary[index].day);
    this.timeIn = {
      hour: +(stringIn.substring(0, stringIn.lastIndexOf(':'))),
      minute: +(stringIn.substring(stringIn.lastIndexOf(':') + 1)),
      second: 0
    };
    this.timeOut = {
      hour: +(stringOut.substring(0, stringOut.lastIndexOf(':'))),
      minute: +(stringOut.substring(stringOut.lastIndexOf(':') + 1)),
      second: 0
    };
    this.dayChangeStatus[index].dayPicker = false;
    this.dayChangeStatus[index].hourInPicker = false;
    this.dayChangeStatus[index].hourOutPicker = false;
    this.dayChangeStatus[index].hourDay = false;
  }

  saveEditDay(index) {
    this.dayChangeStatus[index].dayPicker = true;
    this.dayChangeStatus[index].hourInPicker = true;
    this.dayChangeStatus[index].hourOutPicker = true;
    this.dayChangeStatus[index].hourDay = true;
    this.temporaryAndPatch(index);
    this.Send = false;
    this.Edit = false;
  }

  getControls() {
    return (<FormArray>this.listForm.get('days')).controls;
  }

  // onAddDay appelle ça pour ajouter une ligne/index = nouveau jour
  newTemporaryDay() {
    this.Temporary.push({
      'day': 0,
      'hourIn': 0,
      'hourOut': 0,
      'hourDay': 0,
    });
  }
  // onAddDay appelle ça pour initier les checkers sur false
  dayChangeCompleted() {
    this.dayChangeStatus.push({
      'dayPicker': false,
      'hourInPicker': false,
      'hourOutPicker': false,
      'hourDay': false
    });
  }
  // lorsqu'on ajoute nouveau jour, on confirme le dernier jour; pour hidden les Picker
  onAddDayConfirmed() {
    this.dayChangeStatus[this.countDays - 2].dayPicker = true;
    this.dayChangeStatus[this.countDays - 2].hourInPicker = true;
    this.dayChangeStatus[this.countDays - 2].hourOutPicker = true;
    this.dayChangeStatus[this.countDays - 2].hourDay = true;

    this.Temporary[this.countDays - 2].hourDay = this.timeTotal;
    this.listDays.at(this.countDays - 2).patchValue({
      'hourDay': this.timeTotal,
    });
  }
  onSendConfirmLast() {
    this.dayChangeStatus[this.countDays - 1].dayPicker = true;
    this.dayChangeStatus[this.countDays - 1].hourInPicker = true;
    this.dayChangeStatus[this.countDays - 1].hourOutPicker = true;
    this.dayChangeStatus[this.countDays - 1].hourDay = true;
  }

  calcule() {
    if (!this.EditEnabled) {
      if (this.countDays >= 1) {
        this.Temporary[this.countDays - 1].day = this.selectedDay;
        this.Temporary[this.countDays - 1].hourIn = this.hlService.msToTime(this.timeInToString);
        this.Temporary[this.countDays - 1].hourOut = this.hlService.msToTime(this.timeOutToString);
        this.Temporary[this.countDays - 1].hourDay = this.timeTotal;
        this.calculateDayTotal();
      }
    } else {
      this.calculateDayTotal();
    }
  }
  calculateDayTotal() {
    let HourMonth = 0;
    this.Temporary.forEach(element => {
      HourMonth = HourMonth + this.hlService.TimeToMs(element.hourDay + ':' + 0);
    });
    this.HourMonthStr = this.hlService.msToTime(HourMonth);
  }

  onDelete(index) {
    (<FormArray>this.listForm.get('days')).removeAt(index);
    this.countDays--;
    this.Temporary.splice(index, 1);
    this.dayChangeStatus.splice(index, 1);
    this.calcule();
    this.Send = false;
  }
  enableEditHere() {
    this.EditEnabled = !(this.EditEnabled);
    console.log(this.EditEnabled);
  }
}
