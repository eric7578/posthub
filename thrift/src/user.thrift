include "error.thrift"

struct User {
  1: i32 userId;
  2: string username;
  3: string token;
}

struct RegistIdentity {
  1: string mail;
  2: string password;
}

service Regist {
  User regist(1: RegistIdentity identity) throws (1: error.Error registError);
  User loginRegist(1: RegistIdentity identity) throws (1: error.Error registError);
}
