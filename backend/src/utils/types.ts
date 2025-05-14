export type SuccessReply = {};

export type ErrorReply = {
  message: string;
  details?: string;
};

export type FReply = ErrorReply | SuccessReply;
