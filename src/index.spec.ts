import { test, Tree } from './index';

describe('GIVEN', () => {

    let test_cases: Tree;

    beforeEach(() => {
        test_cases = test('test1')
            .given('given#1')
            .given('given#2', () => { })
            .given('given#3', () => { }, () => { })
            ;
    });

    it('Test name should be test1', () => {
        expect(test_cases.text).toEqual('test1');
    });

    it('Test should have 4 givens', () => {
        expect(test_cases.__case_givens.length).toEqual(3);
    });

    it('first given should be given#1', () => {
        expect(test_cases.__case_givens[0].text).toEqual('given#1');
    })

    it('second given should be given#2', () => {
        expect(test_cases.__case_givens[1].text).toEqual('given#2');
    })

    it('third given should be given#3', () => {
        expect(test_cases.__case_givens[2].text).toEqual('given#3');
    })

    it('given#1 should have no arrange', () => {
        expect(test_cases.__case_givens[0].beforeEach).toBeUndefined();
    });

    it('given#1 should have no cleanup', () => {
        expect(test_cases.__case_givens[0].afterEach).toBeUndefined();
    });

    it('given#2 should have arrange', () => {
        expect(test_cases.__case_givens[1].beforeEach).not.toBeUndefined();
    });

    it('given#2 should have no cleanup', () => {
        expect(test_cases.__case_givens[1].afterEach).toBeUndefined();
    });

    it('given#3 should have arrange', () => {
        expect(test_cases.__case_givens[2].beforeEach).not.toBeUndefined();
    });

    it('given#3 should have cleanup', () => {
        expect(test_cases.__case_givens[2].afterEach).not.toBeUndefined();
    });

});

describe('AND', () => {

    let test_cases: Tree;

    beforeEach(() => {
        test_cases = test('test 2')
            .given('given#1')
            .and('and#1')
            .and('and#2', () => { })
            .and('and#3', () => { }, () => { })
            ;
    })

    it('should have 4 givens', () => {
        expect(test_cases.__case_givens.length).toEqual(4);
        // expect(test_cases.case_givens[3].text).toEqual('given#3 AND and#4');
    })

    it('1st given should be given#1', () => {
        expect(test_cases.__case_givens[0].text).toEqual('given#1')
    })

    describe('and#1', () => {
        it('given should be given#1 and#1', () => {
            expect(test_cases.__case_givens[1].text).toEqual('given#1 AND and#1')
        })

        it('should not have arrange', () => {
            expect(test_cases.__case_givens[1].beforeEach).toBeUndefined();
        })

        it('should not have cleanup', () => {
            expect(test_cases.__case_givens[1].afterEach).toBeUndefined();
        })
    })

    describe('and#2', () => {

        it('should be given#1 and#1 and#2', () => {
            expect(test_cases.__case_givens[2].text).toEqual('given#1 AND and#1 AND and#2')
        })

        it('should have arrange', () => {
            expect(test_cases.__case_givens[2].beforeEach).not.toBeUndefined();
        })

        it('should not have cleanup', () => {
            expect(test_cases.__case_givens[2].afterEach).toBeUndefined();
        })

    })

    describe('and#3', () => {

        it('should be given#1 and#1 and#2 and#3', () => {
            expect(test_cases.__case_givens[3].text).toEqual('given#1 AND and#1 AND and#2 AND and#3')
        })

        it('should have arrange', () => {
            expect(test_cases.__case_givens[3].beforeEach).not.toBeUndefined();
        })

        it('should have cleanup', () => {
            expect(test_cases.__case_givens[3].afterEach).not.toBeUndefined();
        })

    })

})

describe('WHEN', () => {

    let test_cases: Tree;

    beforeEach(() => {
        test_cases = test('test 3')
            .given('given#1')
            .when('when#1')
            .when('when#2', () => { })
            .when('when#3', () => { }, () => { })
            ;
    })

    it('should have 3 whens', () => {
        expect(test_cases.__case_givens[0].whens.length).toEqual(3);
    })

    describe('when#1', () => {
        it('text should be when#1', () => {
            expect(test_cases.__case_givens[0].whens[0].text).toEqual('when#1')
        })

        it('should not have action', () => {
            expect(test_cases.__case_givens[0].whens[0].beforeEach).toBeUndefined()
        })

        it('should not have cleanup', () => {
            expect(test_cases.__case_givens[0].whens[0].afterEach).toBeUndefined()
        })
    })

    describe('when#2', () => {
        it('text should be when#2', () => {
            expect(test_cases.__case_givens[0].whens[1].text).toEqual('when#2')
        })

        it('should have action', () => {
            expect(test_cases.__case_givens[0].whens[1].beforeEach).not.toBeUndefined()
        })

        it('should not have cleanup', () => {
            expect(test_cases.__case_givens[0].whens[1].afterEach).toBeUndefined()
        })
    })

    describe('when#3', () => {
        it('text should be when#1', () => {
            expect(test_cases.__case_givens[0].whens[2].text).toEqual('when#3')
        })

        it('should have action', () => {
            expect(test_cases.__case_givens[0].whens[2].beforeEach).not.toBeUndefined()
        })

        it('should have cleanup', () => {
            expect(test_cases.__case_givens[0].whens[2].afterEach).not.toBeUndefined()
        })
    })

})

describe('THEN', () => {

    let test_cases: Tree;

    beforeEach(() => {
        test_cases = test('test 4')
            .given('given#1')
            .when('when#1')
            .then('then#1')
            .then('then#2', () => { })
            ;
    })

    it('should have 2 thens', () => {
        expect(test_cases.__case_givens[0].whens[0].thens.length).toEqual(2);
    })

    describe('then#1', () => {
        it('should have text of then#1', () => {
            expect(test_cases.__case_givens[0].whens[0].thens[0].text).toEqual('then#1');
        })

        it('should not have assert', () => {
            expect(test_cases.__case_givens[0].whens[0].thens[0].assert).toBeUndefined();
        })
    })

    describe('then#2', () => {
        it('should have text of then#2', () => {
            expect(test_cases.__case_givens[0].whens[0].thens[1].text).toEqual('then#2');
        })

        it('should have assert', () => {
            expect(test_cases.__case_givens[0].whens[0].thens[1].assert).not.toBeUndefined();
        })
    })

})

xdescribe('RUN', () => {

    let givenBeforeEach = 0;
    let givenAfterEach = 0;
    let whenBeforeEach = 0;
    let whenAfterEach = 0;
    let itAssert = 0;
    let counter = 1;

    beforeEach(() => {
        test('RUN')
            .given('given', () => givenBeforeEach = counter++, () => givenAfterEach = counter++)
            .when('when', () => whenBeforeEach = counter++, () => whenAfterEach = counter++)
            .then('then', () => itAssert = counter++)
            .run()
    })

    it('call back functions should be called in order', () => {
        expect(givenBeforeEach).toEqual(1)
        expect(givenAfterEach).toEqual(2)
        expect(whenBeforeEach).toEqual(3)
        expect(whenAfterEach).toEqual(4)
        expect(itAssert).toEqual(5)
    })

})