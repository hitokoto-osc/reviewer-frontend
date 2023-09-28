export enum PollMethod {
  Unknown = 0,
  Approve,
  Reject,
  NeedModify,
  NeedCommonUserPoll
}

export enum PolledFilter {
  All = 0,
  Reviewed,
  Unreviewed
}

export enum PollStatus {
  Unknown = -1,
  NotOpen = 0,
  Open = 1,
  Processing = 2,
  Suspended = 100,
  Closed = 101,
  OpenForCommonUser = 102,
  Approved = 200,
  Rejected = 201,
  NeedModify = 202
}

export enum PollMarkLevel {
  Info = 'info',
  Danger = 'danger',
  Warning = 'warning'
}

export enum PollMarkColor {
  Info = 'blue',
  Danger = 'red',
  Warning = 'orange'
}
