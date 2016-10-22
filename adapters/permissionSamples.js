import { set } from '../utils/bitop';

export const ACCESS = 0;
export const MODIFY = 1;
export const REMOVE = 2;

export const READER = [ACCESS];
export const EDITOR = [ACCESS, MODIFY];
export const OWNER = [ACCESS, MODIFY, REMOVE];
