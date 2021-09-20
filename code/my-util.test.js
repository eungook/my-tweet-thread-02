const { destructDate } = require('./my-util');

describe('my-util.test.js', () => {
  describe('destructDate', () => {
    it(`destructDate(new Date('2021-09-08'))`, () => {
			const date = destructDate(new Date('2021-09-08'));
			const { yyyy, mm, dd } = date;

			expect(yyyy).toEqual(2021);
			expect(mm).toEqual('09');
			expect(dd).toEqual('08');
    });
  });
});