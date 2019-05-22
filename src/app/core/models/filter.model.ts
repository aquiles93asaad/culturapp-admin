export interface Filter {
    name: string,
    type: string,
    placeholder: string,
    advanceSearch: boolean,
    condition: string,
    options?: any,
    hint?: string,
}