const RolePriority = {
  PRESIDENT: 1,
  VICE_PRESIDENT: 2,
  CHAIRPERSON: 3,
  VICE_CHAIRMAN: 4,
  MEMBER: 5,
};

const penNamePriority = {
  DOCTORATE: 1,
  MASTER: 2,
  PROFESSOR: 3,
  ASSOCIATE: 4,
  LAWYER: 5,
};

const typeMember = {
  EXECUTIVE_BOARD : 'EXECUTIVE_BOARD',
  EXPERT_TEAM : 'EXPERT_TEAM'
}

const typeDetail = {
  EDUCATION : 'EDUCATION',
  WORK_EXPERIENCE : 'WORK_EXPERIENCE',
  CONSULT_EXPERIENCE: 'CONSULT_EXPERIENCE'
}

module.exports = { RolePriority, penNamePriority, typeMember, typeDetail };
