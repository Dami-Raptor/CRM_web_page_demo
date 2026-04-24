export type Company = {
    id: number;
    nameCompany: string;
}

export type Person = {
    id: number;
    name: string;
    lastname: string;
    email: string;
}

export type Seller = {
    id: number;
    badget: string;
    performance: number;
    commission: number;
    person: number;
    company: number;
    name?: string;
    lastname?: string;
    email?: string;
}

export type Lead = {
    id: number;
    butget: number;
    status: 'Prospecto' | 'Cliente';
    priority: 'Alta' | 'Media' | 'Baja';
    company: number;
    person: number;
    seller: number | null;
    person_name?: string;
    person_lastname?: string;
    email?: string;
}

export type Columnas = {
    [key: string]: Lead[];
}