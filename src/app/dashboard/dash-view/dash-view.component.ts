import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditorComponent } from 'src/app/emails/editor/editor.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-view',
  templateUrl: './dash-view.component.html',
  styleUrls: ['./dash-view.component.scss']
})
export class DashViewComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onClick_SendNewMail() {

    this.router.navigate(['draft/']);


  }

}
