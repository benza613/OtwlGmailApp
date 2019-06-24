import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { Message } from '../../models/message.model';
import * as moment from 'moment';

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit {

  /// DO NOT DELETE THIS COMMENT
  /// https://github.com/SyncfusionExamples/ej2-angular-7-rich-text-editor
  /// https://www.syncfusion.com/kb/9864/how-to-get-started-easily-with-syncfusion-angular-7-rich-text-editor


  reqThreadId;
  storeSelector;
  emailList;
  details = false;

  constructor(
    private route: ActivatedRoute,
    public emailStore: EmailsStoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.reqThreadId = this.route.snapshot.paramMap.get('id');

    this.route.queryParams
      .subscribe(params => {
        console.log(params);

        this.storeSelector = params.q;
        this.renderMessages();
      });


  }

  renderMessages() {
    if (this.storeSelector === 'unread') {
      this.emailList = this.emailStore.getUnreadMsgList$(this.reqThreadId);
    } else if (this.storeSelector === 'mapped') {
      this.emailList = this.emailStore.getMappedMsgList$(this.reqThreadId);
    }

  }

  draftReply(msg: Message) {
    this.router.navigate(['draft/'], {
      queryParams:
      {
        q: this.storeSelector,
        a: 'r',
        mid: msg.msgid,
        tid: this.reqThreadId
      }
    });
  }

  draftForward(msg: Message) {
    this.router.navigate(['draft/'], {
      queryParams:
      {
        q: this.storeSelector,
        a: 'f',
        mid: msg.msgid,
        tid: this.reqThreadId
      }
    });
  }

}
