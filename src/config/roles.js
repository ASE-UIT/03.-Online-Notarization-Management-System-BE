const allRoles = {
  user: [
    'uploadDocuments',
    'viewNotarizationHistory',
    'createSession',
    'addUserToSession',
    'deleteUserOutOfSession',
    'joinSession',
    'getNotarizationFields',
    'getNotarizationServices',
    'approveSignatureByUser',
    'approveSignatureSessionByUser',
    'searchUserByEmail',
    'getSessionsByUserId',
    'getSessionBySessionId',
    'uploadSessionDocument',
    'sendSessionForNotarization',
    'getSessionStatus',
  ],
  admin: [
    'getUsers',
    'manageUsers',
    'uploadDocuments',
    'viewNotarizationHistory',
    'manageRoles',
    'manageNotarizationFields',
    'manageNotarizationServices',
    'getAllNotarizations',
    'getDocumentCount',
    'getUserCount',
    'getDocumentsByNotaryField',
    'getEmployeeCount',
    'getEmployeeList',
    'getNotarizationFields',
    'getNotarizationServices',
    'getSessions',
    'getSessionCount',
    'searchUserByEmail',
    'createSession',
    'addUserToSession',
    'deleteUserOutOfSession',
    'joinSession',
    'getPaymentTotal',
    'getPaymentTotalByService',
    'approveSignatureByUser',
    'approveSignatureBySecretary',
    'getPaymentTotalByNotarizationField',
    'getSessionStatus',
    'viewNotarizationHistoryByUserId',
  ],
  notary: [
    'getDocumentsByRole',
    'forwardDocumentStatus',
    'getApproveHistory',
    'joinSession',
    'getSessionBySessionId',
    'getSessionStatus',
    'getSessionByRole',
    'forwardSessionStatus',
    'approveSignatureByNotary',
    'approveSignatureSessionNotary',
    'dashboard',
  ],
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
