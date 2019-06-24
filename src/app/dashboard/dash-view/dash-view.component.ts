import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditorComponent } from 'src/app/emails/editor/editor.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dash-view',
  templateUrl: './dash-view.component.html',
  styleUrls: ['./dash-view.component.scss']
})
export class DashViewComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private authService : AuthService
  ) { }

  ngOnInit() {
    this.authService.login();
  }

  onClick_SendNewMail() {

    this.router.navigate(['draft/']);
  }

  onClick_getUrgentEmails() {
    alert('This section is not available at the moment.')
  }

}
