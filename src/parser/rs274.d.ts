export interface TreeNode {
  text: string;
  offset: number;
  elements: TreeNode[];
}
export type TreeNodeAction = (input: string, start: number, end: number, elements: TreeNode[]) => any;
export declare function parse<T>(input: string, options?: {
  actions?: { [key: string]: TreeNodeAction };
  types?: { [key: string]: { [key: string]: Function }};
}): T;