import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OpportunityProposal } from '../../../core/models';
import { OpportunityProposalService } from '../../../core/services';

@Component({
    selector: 'app-opportunity-proposal-breakdown',
  templateUrl: './opportunity-proposal-breakdown.component.html',
  styleUrls: ['./opportunity-proposal-breakdown.component.scss']
})
export class OpportunityProposalBreakdownComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    // proposal: OpportunityProposal;
    // opportunity: Opportunity;
    breakdown: any = {};

    constructor(
        public dialogRef: MatDialogRef<OpportunityProposalBreakdownComponent>,
        private proposalService: OpportunityProposalService,
        @Optional() @Inject(MAT_DIALOG_DATA) public proposal: OpportunityProposal
    ) { }

    ngOnInit() {
        this.proposalService.breakdown(this.proposal)
        .subscribe(
            breakdown => {
                this.breakdown = breakdown;
            }
        )
    }

    closeDialog() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}