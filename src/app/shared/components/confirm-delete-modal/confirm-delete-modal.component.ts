import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-confirm-delete-modal',
    templateUrl: './confirm-delete-modal.component.html',
    styleUrls: ['./confirm-delete-modal.component.scss']
})
export class ConfirmDeleteModalComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ConfirmDeleteModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public message: any
    ) { }
    
    ngOnInit() {
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    closeDialog(result) {
        this.dialogRef.close(result);
    }
}
