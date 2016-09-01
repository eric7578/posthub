import { set } from '../utils/bitop';

export const ACCESS = 0;
export const MODIFY = 1;
export const REMOVE = 2;

export const OWNER = set(0, ACCESS, MODIFY, REMOVE);
export const EDITOR = set(0, ACCESS, MODIFY);
export const READER = set(0, ACCESS);
