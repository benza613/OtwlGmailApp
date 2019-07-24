import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.scss']
})
export class EmailSentComponent implements OnInit {

  @Output() dateSelect = new EventEmitter<NgbDateStruct>();
  sentThreads;
  t_CollectionSize: number;
  t_currentPage = 1;
  t_itemsPerPage = 10;
  filterFrom;
  filterSubject;
  filterDate: NgbDateStruct = null;
  sentFilterArgs = { a: '', b: '', c: '' };
  // optimization, rerenders only threads that change instead of the entire list of threads
  threadTrackFn = (i, thread) => thread.ThreadId;
  constructor(
    public emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private authServ: AuthService,
    private detector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.emailStore.updateSentThreadList();
    this.emailStore.sentThreadsCount$.subscribe(x => {
      this.t_CollectionSize = x;
    });
  }

  getSentThreads() {
    this.spinner.show();
    this.detector.detectChanges();
    this.emailStore.sentThreads$.subscribe(x => {
      for (let i = 0; i < x.length; i++) {
        this.sentThreads = [...this.sentThreads, x[i]];
        this.detector.detectChanges();
      }
    });
    console.log(this.sentThreads);
    this.spinner.hide();
  }

}
