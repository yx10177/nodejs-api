const HOST = process.env.HEROES_API_HOST;
const fetch = require('node-fetch');
const { retry } = require('../utils/retry');
const retryCondition = (r) => r.code == 1000 || (r.message && r.message.includes('error'));

exports.getHeroes = async () => {
    const resource = await retry(async () => {
        const resp = await fetch(`${HOST}/heroes`);
        return resp.json();
    }, { retryCondition });

    return resource;
};

exports.getHero = async (heroId) => {
    const resource = await retry(async () => {
        const resp = await fetch(`${HOST}/heroes/${heroId}`);
        return resp.json();
    }, { retryCondition });

    return resource;
};

exports.getHeroProfile = async (heroId) => {
    const resource = await retry(async () => {
        const resp = await fetch(`${HOST}/heroes/${heroId}/profile`);
        return resp.json();
    }, { retryCondition });

    return resource;
};

exports.getAuthenticated = async (body) => {

    const response = await fetch(`${HOST}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
    return response;
}


