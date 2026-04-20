export interface Company {
    id: number;
    nameCompany: string;
}
export interface Person {
    id: number;
    name: string;
    lastname: string;
    email: string;
}
export interface Lead {
    id: number;
    email: string;
    butget: number;
    status: 'Prospecto' | 'Cliente';
    priority: 'Alta' | 'Media' | 'Baja';
    person: number;
    company: number;
    seller: number | null;
}
export interface Seller {
    id: number;
    name: string;
    lastname: string
    email: string;
    badget: string;
    performance: number;
    commission: number;
    company: number;
    person: number;
}
export interface AuthTokens {
    access: string;
    refresh: string;
}