import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit {
  @Input() storeSelector: string;

  constructor() { }

  ngOnInit() {
  }

}
