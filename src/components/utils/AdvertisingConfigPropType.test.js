import checkPropTypes from 'check-prop-types';
import React from 'react';
import AdvertisingConfigPropType from './AdvertisingConfigPropType';

function MyComponent() {
    return <h1>Hello!</h1>;
}

MyComponent.propTypes = {
    config: AdvertisingConfigPropType
};

const config = {
    path: '/ad/unit/path',
    prebid: {
        bidderTimeout: 666,
        bidderSequence: 'fixed'
    },
    slots: [],
    customEvents: {
        foo: {
            eventMessagePrefix: 'fasel',
            divIdPrefix: 'baz'
        }
    },
    targeting: {
        baz: 'fred'
    }
};

describe('When I check the prop types for a valid config with no slots', () => {
    let result;
    beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config })));
    describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
});
describe('When I check the prop types for a valid config with a valid slot', () => {
    let result;
    beforeEach(
        () =>
            (result = checkPropTypes(MyComponent.propTypes, {
                config: {
                    ...config,
                    slots: [
                        {
                            id: 'foo',
                            sizes: ['bar'],
                            prebid: [
                                {
                                    mediaTypes: {
                                        banner: {
                                            sizes: [[666]]
                                        }
                                    },
                                    bids: [
                                        {
                                            bidder: 'qux'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }))
    );
    describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
});
describe('When I check the prop types for a valid config with an invalid slot', () => {
    let result;
    beforeEach(
        () =>
            (result = checkPropTypes(MyComponent.propTypes, {
                config: {
                    ...config,
                    slots: {
                        bla: 'blub'
                    }
                }
            }))
    );
    describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
});
describe('When I check the prop types for an invalid config', () => {
    describe('for the path', () => {
        let result;
        beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config: { path: 666 } })));
        describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
    });
    describe('for the targeting', () => {
        let result;
        beforeEach(() => (result = checkPropTypes(MyComponent.propTypes, { config: { targeting: 'baz' } })));
        describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
    });
});

describe('When I check the prop types with a price granularity', () => {
    const testCases = [
        { priceGranularity: 'low', expectToPass: true },
        { priceGranularity: 'medium', expectToPass: true },
        { priceGranularity: 'high', expectToPass: true },
        { priceGranularity: 'auto', expectToPass: true },
        { priceGranularity: 'dense', expectToPass: true },
        { priceGranularity: 'mumpitz', expectToPass: false },
        { priceGranularity: {}, expectToPass: false },
        { priceGranularity: { buckets: [{ precision: 1, min: 2, max: 3, increment: 4 }] }, expectToPass: true },
        { priceGranularity: { buckets: [{ min: 2, max: 3, increment: 4 }] }, expectToPass: true },
        { priceGranularity: { buckets: [{ max: 3, increment: 4 }] }, expectToPass: false },
        { priceGranularity: { buckets: [{ min: 2, increment: 4 }] }, expectToPass: false },
        { priceGranularity: { buckets: [{ min: 2, max: 3 }] }, expectToPass: false }
    ];
    for (const { priceGranularity, expectToPass } of testCases) {
        describe(`${
            typeof priceGranularity === 'object' ? JSON.stringify(priceGranularity) : priceGranularity
        }`, () => {
            let result;
            beforeEach(
                () =>
                    (result = checkPropTypes(MyComponent.propTypes, {
                        config: {
                            prebid: {
                                priceGranularity
                            }
                        }
                    }))
            );
            if (expectToPass) {
                describe('the prop type validation', () => it('passes', () => void expect(result).toBeUndefined()));
            } else {
                describe('the prop type validation', () => it('fails', () => void expect(result).toBeTruthy()));
            }
        });
    }
});
