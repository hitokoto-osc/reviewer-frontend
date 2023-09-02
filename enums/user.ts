export enum UserRole {
  Guest = 'guest',
  Admin = 'admin',
  Reviewer = 'reviewer',
  User = 'user'
}

export enum UserStatus {
  Normal = 1,
  Suspended = -1
}

export enum UserScoreRecordType {
  Increment = 'increment',
  Decrement = 'decrement'
}
