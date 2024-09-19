export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    is_admin: boolean;
    created: Date;
    modified: Date;
    deleted: Date | null;

    constructor(id: number, name: string, email: string, password: string, is_admin: boolean, created: Date, modified: Date, deleted: Date | null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.is_admin = is_admin;
        this.created = created;
        this.modified = modified;
        this.deleted = deleted;
    }
}