/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';

export const confirmPasswordHash = (plainPassword:string, hashedPassword:string) => {
    return new Promise(resolve => {
        bcrypt.compare(plainPassword, hashedPassword, function(err:any, res:any) {
            resolve(res);
        });
    })
}


export const bcryptHash = (plainPassword:string, salt=10) => {
    return new Promise(resolve => {
        bcrypt.hash(plainPassword, salt, function(err:any, res:any) {
            resolve(res);
        });
    })
}