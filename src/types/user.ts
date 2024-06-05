export type User = {
    email: string;
    password: string;
    name: string;
    salt: string;
    is_active: boolean;
    role: string;
    created_at: string;
    updated_at: string;
}


export type AuthFields = {
    email:string,
    password:string
}