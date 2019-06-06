import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnInit {

  msgPacket = {
    to: [],
    cc: [],
    bcc: [],
    subject: "",
  };

  public EditorTools: object = {
    type: 'MultiRow',
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'Print', '|', 'FullScreen']
  };

  msgToList = [
    { emailId: 'benito.alvares@gmail.com' },
    { emailId: '<benito.alvares@gmail.com>' },
    { emailId: 'pritee@oceantransworld.com' },
    { emailId: 'Sushant <it5@oceantransworld.com>' },
  ]

  _inlineAttachments = [];
  _inlineAttachB64 = [];
  public EditorValue: string = `Hi Sir, <p> Let me know if this example behaviour as desired.</p> <p>Disabled buttons using the <code class="highlighter-rouge">&lt;a&gt;</code> element behave a bit different:</p><ul>
  <li><code class="highlighter-rouge">&lt;a&gt;</code>s don’t support the <code class="highlighter-rouge">disabled</code> attribute, so you must add the <code class="highlighter-rouge">.disabled</code> class to make it visually appear disabled.</li>
  <li>Some future-friendly styles are included to disable all <code class="highlighter-rouge">pointer-events</code> on anchor buttons. In browsers which support that property, you won’t see the disabled cursor at all.</li>
  <li>Disabled buttons should include the <code class="highlighter-rouge">aria-disabled="true"</code> attribute to indicate the state of the element to assistive technologies.</li>
</ul>`;
  constructor(
    private route: ActivatedRoute,
    private emailStore: EmailsStoreService
  ) { }

  ngOnInit() {

    const emlData = {};
    this.initMessagePacket(emlData);

  }

  initMessagePacket(emlData) {
    if (emlData.to != undefined)
      this.msgPacket.to = emlData.to;

    if (emlData.subject != undefined)
      this.msgPacket.subject = emlData.subject;

  }


  actionCompleted(ev: any) {
    console.log(ev);

    if (ev.requestType == "Image") {

      ev.elements.forEach(element => {

        if (element.nodeName == "IMG") {
          this._inlineAttachments.push({
            src: element.src,
            alt: element.alt
          });

        }
      });

    }
  }

  onClick_SendMail() {
    console.log(this.msgPacket);

    //process inline attachments
    this.base64InlineAttachmentsToBody().then(
      (data) => {

        //generate static signature
        let signature = this.fillSignatureTemplate("Shraddha Redkar", "Executive-HR", "+91 7045951608", "hr@oceantransworld.com");
        //then send mail
        this.emailStore.sendNewEmail(this.msgPacket, data + signature, this._inlineAttachB64);

      },
      (err) => {
        console.log('Error Occured while streamlining inline images', err);
        alert('Error OCCURRED: UI-SND-ML-01');

      })

  }

  private base64InlineAttachmentsToBody() {
    let msgBodyCopy = this.EditorValue;
    var self = this;

    return new Promise((reslv, rej) => {

      if (this._inlineAttachments.length == 0) {
        reslv(msgBodyCopy);
      }

      this._inlineAttachments.forEach((img, imgCounter) => {

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
            //(reader.result as string)
            let cid = self.randomCidGenerator(11);
            var newstr = msgBodyCopy.replace(img.src, "cid:" + cid);
            msgBodyCopy = newstr;

            self._inlineAttachB64.push({
              cid: cid,
              filename: img.alt,
              dataUrl: (reader.result as string).split(",")[1]
            });

            if (imgCounter == self._inlineAttachments.length - 1) {
              reslv(msgBodyCopy);
            }
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', img.src);
        xhr.responseType = 'blob';
        xhr.send();

      });

    })
  }


  randomCidGenerator(lengthx) {
    var text = "otwl_-_-_";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < lengthx; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  fillSignatureTemplate(senderName, senderDesgn, senderMobile, senderEmail) {
    return `<div class="container-fluid" style="margin-top: 5px;text-align: right;font-size: 12px;">
    <div style="text-align: right;">
      <span style="font-family: Arial, Helvetica, sans-serif;">
        <span style="color: rgb(47, 84, 150); text-decoration: inherit;">
          <strong><em>`+ senderName + `&nbsp;</em></strong>
        </span>
      </span>
    </div>
    <div style="text-align: right;"><span style="font-family: Arial, Helvetica, sans-serif;"><span
          style="color: rgb(47, 84, 150); text-decoration: inherit;"><strong><em>`+ senderDesgn + `&nbsp;</em></strong></span></span>
      <div style="text-align: right;"><br></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">“Silver Astra” B-503/A, J. B. Nagar,&nbsp;</span></span>
      </div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Andheri (E) Mumbai- 400 099.&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Board : +91 22 62839000-99 (100
            lines)&nbsp;</span></span>
      </div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Direct : +91 22 62839034&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Mobile : `+ senderMobile + `&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Fax : +91 11 22 2830 4386&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">E-Mail : `+ senderEmail + `&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Web : www.oceantransworld.com</span></span></div>

    </div>
    <table style="opacity:0.75;clear:both;margin:25px auto" width="100%" cellspacing="0" cellpadding="5"
      bgcolor="#fafafa" align="center">
      <tbody>
        <tr>
          <td align="center">
            <font size="1" face="Arial, Helvetica, sans-serif" color="#333333">
              <span style="font-size:11px">
                This email was generated & sent by OTWL MAILER. ref:_19950115 </span>
            </font>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;
  }

}
