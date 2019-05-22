import { OpportunityDemo } from './opportunity-demo.model';
import { OpportunityProposal } from './opportunity-proposal.model';
import { User } from './user.model';
import { Company } from './company.model';

export interface Opportunity {
    _id?: string,
    name: string,
    description: string,
    estimatedTotal?: number,
    automation: Boolean,
    docManager: Boolean,
    digitization: Boolean,
    hardware: Boolean,
    assignedTo: User,
    state: string,
    companyClient: Company,
    opportunityDemo?: OpportunityDemo,
    opportunityProposals?: OpportunityProposal[],
    createdAt: Date,
    createdBy: User,
    modifiedAt?: Date,
    modifiedBy?: User
}