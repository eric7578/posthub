import { expect } from 'chai';

import BoardService from '../BoardService';

const boardService = new BoardService();

describe('BoardService', () => {

  describe('#create', () => {

    it('should create new board at top of levels', () => {
      return boardService.create()
      .then(boardData => {
        expect(boardData.title).to.be.equal('New Board');
        expect(boardData.level).to.be.equal(0);
        expect(boardData.parentId).to.be.undefined;
      });
    });

  });

});
