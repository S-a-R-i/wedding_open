import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'change-pw',
  templateUrl: './change-pw.component.html',
  styleUrls: ['./change-pw.component.css']
})
export class ChangePwComponent implements OnInit {
  message = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {user_id: string},
    public matDialogRef: MatDialogRef<ChangePwComponent>,
  ) { }

  ngOnInit() {

  }
}
