const hahowApi = require('../external-services/hahow-api');
const { TaskPool } = require('../utils/task-pool');

exports.getHeroes = async (req, res, next) => {

    try {
        let heroes = await hahowApi.getHeroes();

        if (req.isAuthenticated) {
            const pool = new TaskPool({ limit: 10 });

            heroes.forEach(hero => {
                pool.add(async () => await addHeroProfile(hero));
            });

            let { success: enhancedHeroes, failure } = await pool.await();
            if (failure) throw failure;
            heroes = enhancedHeroes;
        }

        if (!heroes) {
            return res.status(404).send({ error: "Heroes not found" });
        }

        return res.send(heroes);
    } catch (error) {
        return next(error);
    }
};


exports.getHero = async (req, res, next) => {

    try {
        const heroId = req.params.heroId;

        if (!heroId) {
            return res.status(400).send({ error: "Missing heroId parameter" });
        }

        let hero = await hahowApi.getHero(heroId);

        if (req.isAuthenticated) {
            hero = await addHeroProfile(hero);
        }

        if (!hero) {
            return res.status(404).send({ error: "Hero not found" });
        }

        return res.send(hero);
    } catch (error) {
        return next(error);
    }
};

async function addHeroProfile(hero) {
    const profile = await hahowApi.getHeroProfile(hero.id);
    return { ...hero, profile };
}
