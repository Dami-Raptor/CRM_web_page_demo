export interface Person {
    id: number;
    name: string;
    lastname: string;
    email: string;
}

export interface Lead{
    id: number;
    email: string;
    butget: number;
    status: 'Prospecto' | 'Cliente';
    priority: 'Alta' | 'Media' | 'Baja';
}

export interface AuthTokens{
    access: string;
    refresh: string;
}