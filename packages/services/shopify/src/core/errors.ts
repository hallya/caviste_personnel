import type { GraphQLError } from './types';

export class GraphQLNetworkError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "GraphQLNetworkError";
  }
}

export class GraphQLErrorResponse extends Error {
  constructor(public errors: GraphQLError[]) {
    super(errors.map((e) => e.message).join(", "));
    this.name = "GraphQLErrorResponse";
  }
}
