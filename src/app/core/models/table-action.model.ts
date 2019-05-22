export interface TableAction {
    name: string;
    label: string;
    color?: string;
    icon?: string;
    // conditions will have 1 or multiple condition and each condition will have a key of the element shown in the table and will ask for a specific value for that key in order to show the action
    conditions?: {
        key: string,
        element: string,
        min?: number,
        max?: number,
        hasValue?: boolean,
        values?: string[]
    }[];
}