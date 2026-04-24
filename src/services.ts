import {db} from './db';
export function getCvService(id: number) {
    return db.cvs.find((c)=>c.id==id);
}