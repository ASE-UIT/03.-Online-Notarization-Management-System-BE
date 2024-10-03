const allRoles = {
  user: ['uploadDocuments', 'viewNotarizationHistory','createSession'],
  admin: ['getUsers', 'manageUsers', 'uploadDocuments', 'viewNotarizationHistory', 'manageRoles'],
  notary: ['getDocumentsByRole', 'forwardDocumentStatus'],
  secretary: ['getDocumentsByRole', 'forwardDocumentStatus'],
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
