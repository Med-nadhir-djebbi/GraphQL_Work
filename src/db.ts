export const enum Role {
    Admin = 'Admin',
    User = 'User',
};
export const users =[
    {
        id: 1,
        name: 'Aziz Haddadi',
        email: 'aziz.haddadi@insat.com',
        role : Role.Admin
    },
    {
        id: 2,
        name: 'Malek Tabbabi',
        email: 'malek.tabbabi@insat.com',
        role: Role.User
    },
    {
        id: 3,
        name: 'Fares BenHadj Slimane',
        email: 'fares.benhadjslimane@insat.com',
        role: Role.User
    },
    {
        id: 4,
        name: 'Med Nadhir Djebbi',
        email: 'mednadhir.djebbi@insat.com',
        role: Role.User
    }
];
export const cvs = [
    {
        id: 1,
        userId: 1,
        title: 'aziz haddadi\'s forensics cv',
        age : 21,
        Job : 'Forensics Engineer',
    },
    {
        id: 4,
        userId: 1,
        title: 'aziz haddadi\'s jwe7 cv',
        age : 21,
        Job : 'JAWWE7',
    },
    {
        id: 2,
        userId: 2,
        title: 'malek tabtabi\'s crypto cv',
        age : 22,
        Job : 'Cryptographer',
    },
    {
        id: 3,
        userId: 3,
        title: 'fares benhadj slimane\'s PWN cv',
        age : 21,
        Job : 'PWN Engineer',
    },
    {
        id: 5,
        userId: 4,
        title: 'med nadhir djebbi\'s btala cv',
        age : 22,
        Job : 'BATTAL metrassem',
    }
];
export const skills = [
    {
        id: 1,
        designation: 'Forensics',
    },
    {
        id: 2,
        designation: 'Cryptography',
    },
    {
        id: 3,
        designation: 'PWN',
    },
    {
        id: 4,
        designation: 'JWE7'
    },
    {
        id: 5,
        designation: 'BTALA'
    }
];
export const cvSkills = [
    {
        cvId: 1,
        skillId: 1,
    },
    {
        cvId: 2,
        skillId: 4,
    },
    {
        cvId: 3,
        skillId: 2,
    },
    {
        cvId: 4,
        skillId: 3,
    },
    {
        cvId: 5,
        skillId: 5,
    }   
];
