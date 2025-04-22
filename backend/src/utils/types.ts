export type SuccessReply = {};

export type ErrorReply = {
  message: string;
  details?: string;
};

export type FReply = ErrorReply | SuccessReply;

export type ResourceType = 'food' | 'wood' | 'stone' | 'gold';

export type Resources = Record<ResourceType, number>;
