const ROLES = {
    VOLUNTARIO : {level : 1 , permissions : ['read_inventory']},
    COLABORADOR : {level : 2 , permissions: ['modify_inventory', 'read_volunteers']},
    GERENTE : {level : 3 , permissions : ['read_beneficiaries', 'modify_volunteers','read_stadistics']},
    ADMIN : {level: 4 , permissions : ['modify_beneficiaries']},
    SUPER_ADMIN : {level : 5 , permissions : ['modify_users']}
}

//Function to get the role level

const getPermissions = (role)=>{

    const roleKeys = Object.keys(ROLES);
    const selectedRole = ROLES[role];

    if(!selectedRole){
        return null;
    }

    return roleKeys
        .filter(key => ROLES[key].level <= selectedRole.level)
        .flatMap(key => ROLES[key].permissions);
};


module.exports = {ROLES, getPermissions};