export interface Card {
    text: string;
    name: string;
    icon?: string;
    profiles: string[],
    roles: string[],
    cards?: Card[],
    href?: string,
    faqBody: string
}