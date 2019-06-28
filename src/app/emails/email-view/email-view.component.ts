import { FSDirDialogComponent } from 'src/app/email_fs_dir/fs-dir-dialog/fs-dir-dialog.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { Message } from '../../models/message.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
  refId;
  emailList;
  details = false;

  constructor(
    private route: ActivatedRoute,
    public emailStore: EmailsStoreService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.reqThreadId = this.route.snapshot.paramMap.get('id');

    this.route.queryParams
      .subscribe(params => {
        // console.log(params);
        this.storeSelector = params.q;
        this.refId = params.j;
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

  async fileAction(id, msgId, attachment) {
    if (id === 1) {
      this.emailStore.MessageAttch_DownloadLocal(msgId, attachment.attachmentGId);
    } else {
      await this.emailStore.MessageAttch_RequestFSDir(this.reqThreadId).then(success => {
        const modalRef = this.modalService.open(
          FSDirDialogComponent,
          { size: 'lg', backdrop: 'static', keyboard: false }
        );
        this.emailStore.getFolderList$.subscribe(x => {
          modalRef.componentInstance.storeSelector = this.storeSelector; // should be the id
          modalRef.componentInstance.folderHierarchy = x;
          modalRef.componentInstance.msgId = msgId;
          modalRef.componentInstance.attachmentGId = attachment.attachmentGId;
          modalRef.componentInstance.attachmentName = attachment.fileName;
          modalRef.componentInstance.reqThreadId = this.reqThreadId;
        });

      });

    }
  }

}
