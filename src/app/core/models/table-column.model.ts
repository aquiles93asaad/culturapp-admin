export interface TableColumn {
    name: string;
    subName?: string;
    alternateName?: string;
    subSubName?: string;
    label: string;
    type: string;
    roles: string[],
    enumValues?: any,
    condition?: any,
}