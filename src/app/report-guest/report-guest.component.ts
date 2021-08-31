import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-report-guest',
  templateUrl: './report-guest.component.html',
  styleUrls: ['./report-guest.component.css']
})
export class ReportGuestComponent implements OnInit {

  @Output() exitShowingGuestsEmitter = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  backToObject(){
    this.exitShowingGuestsEmitter.emit();
  }

}
