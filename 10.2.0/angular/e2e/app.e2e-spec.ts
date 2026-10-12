import { HuongTemplatePage } from './app.po';

describe('Huong App', function () {
    let page: HuongTemplatePage;

    beforeEach(() => {
        page = new HuongTemplatePage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
