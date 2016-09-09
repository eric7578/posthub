import { expect, spy } from 'chai';

import responseTime from '../reponseTime.js';

describe('reponseTime', () => {
  it('should set repsonse header', () => {
    const ctx = { set: spy() };
    const next = spy();
    return responseTime(ctx, next).then(() => {
      expect(ctx.set).to.have.been.called.with('response-time');
    });
  });
});
