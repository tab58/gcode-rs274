import { TreeNode } from './rs274';

/**
 * Joins the elements' text fields into one string.
 * @param {TreeNode[]} elements The TreeNode elements.
 */
export const joinElementText = (elements: TreeNode[]): string => {
  if (!elements) {
    return '';
  }
  const textFrags = elements.reduce((acc: string[], el: TreeNode): string[] => {
    const t = el.text;
    if (t !== '') {
      acc.push(t);
    }
    return acc;
  }, []);
  return textFrags.join('');
};

export const isTreeNode = (el: any): boolean => {
  return (el) &&
    (el.hasOwnProperty('text') && typeof el.text === 'string') &&
    (el.hasOwnProperty('offset') && typeof el.offset === 'number') &&
    (el.hasOwnProperty('elements') && Array.isArray(el.elements));
};

/**
 * Tests if the node is blank. Returns true if yes, false if no.
 * @param el The test node.
 */
export const isBlankTreeNode = (el: any): boolean => {
  return isTreeNode(el) &&
    (el.text === '') &&
    (el.elements.length === 0);
};

/**
 * Tests if node is blank, and returns null if yes. Returns the node if no.
 * @param el The test node.
 */
export const ifBlankTreeNodeSetNull = <T extends object>(node: T): T => {
  return isBlankTreeNode(node) ? null : node;
};