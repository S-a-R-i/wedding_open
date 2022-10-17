import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  message = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {type: string, text: string},
    public matDialogRef: MatDialogRef<MessageComponent>,
  ) { }

  ngOnInit() {
    if (this.data.text) {
      this.message = this.data.text;
    }
  }
}
