const allRoles = {
  user: ['uploadDocuments', 'viewNotarizationHistory','createSession','addUserToSession','deleteUserOutOfSession'],
  admin: [
    'getUsers',
    'manageUsers',
    'uploadDocuments',
    'viewNotarizationHistory',
    'manageRoles',
    'manageNotarizationFields',
    'manageNotarizationServices',
    'getAllNotarizations',
  ],
  notary: ['getDocumentsByRole', 'forwardDocumentStatus', 'getApproveHistory'],
  secretary: ['getDocumentsByRole', 'forwardDocumentStatus', 'getApproveHistory'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

const getPermissionsByRoleName = (roleName) => {
  return roleRights.get(roleName);
};

module.exports = {
  roles,
  roleRights,
  getPermissionsByRoleName,
};
