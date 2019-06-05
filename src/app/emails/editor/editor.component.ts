import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
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
  public EditorValue: string = "";
  constructor(
    private route: ActivatedRoute
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

}
