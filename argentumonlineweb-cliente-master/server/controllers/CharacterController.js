const tokenAuth = process.env.TOKEN_AUTH || "Bearer token";

class CharacterController {
    constructor(characterService, accountService) {
        this.characterService = characterService;
        this.accountService = accountService;
    }

    async getCharacter(req, res, next) {
        const { idAccount, idCharacter, email } = req.query;
        const { authorization } = req.headers;

        if (authorization != tokenAuth) {
            return res.json({ err: true });
        }

        try {
            const account = await this.accountService.getAccount({
                _id: idAccount,
                email
            });

            let character = {};

            if (idCharacter) {
                character = await this.characterService.getCharacter({
                    _id: idCharacter,
                    idAccount
                });
            }

            res.json({ account, character });
        } catch (e) {
            res.json({ err: true, message: e.message });
        }
    }

    async saveCharacter(req, res) {
        try {
            const { idCharacter } = req.params;

            const character = await this.characterService.updateCharacter(
                idCharacter,
                req.body
            );

            res.json(character);
        } catch (e) {
            res.json({ error: true, message: e.message });
        }
    }

    async getRankingGeneral(req, res, next) {
        try {
            const ranking = await this.characterService.getRankingGeneral();

            res.json(ranking);
        } catch (e) {
            res.json({ error: true, message: e.message });
        }
    }

    async getCharactersByAccountId(req, res, next) {
        try {
            if (req.user) {
                const characters = await this.characterService.getCharactersByAccountId(
                    req.user.accountId
                );

                res.json(characters);
            } else {
                res.json({});
            }
        } catch (e) {
            res.json({ error: true, message: e.message });
        }
    }

    // Crea un personaje PvE nivel 1 para la cuenta logueada.
    // Límite de 10 personajes (la UI del header renderiza 10 slots).
    async createCharacter(req, res) {
        if (!req.user) {
            return res.json({ error: true, message: "No autenticado." });
        }

        const { name, idClase, idRaza, idGenero, idHead } = req.body;

        if (!name || !idClase || !idRaza || !idGenero || !idHead) {
            return res.json({ error: true, message: "Faltan campos por completar." });
        }

        const cleanName = String(name).trim();

        if (cleanName.length < 3 || cleanName.length > 20) {
            return res.json({ error: true, message: "El nombre debe tener entre 3 y 20 caracteres." });
        }

        try {
            const existing = await this.characterService.findCharacterByName(cleanName);

            if (existing) {
                return res.json({ error: true, message: "Ya existe un personaje con ese nombre." });
            }

            const owned = await this.characterService.getCharactersByAccountId(req.user.accountId);

            if (owned && owned.length >= 10) {
                return res.json({ error: true, message: "Llegaste al máximo de 10 personajes." });
            }

            // Cuerpo inicial según raza (misma tabla que el selector del cliente)
            const bodyByRace = { 1: 1, 2: 2, 3: 3, 4: 300, 5: 300 };

            // Ropa inicial (índices en jsons/objs.json) según raza
            const clothesByRace = { 1: 30, 2: 31, 3: 34, 4: 238, 5: 238 };
            const DAGGER_NEWBIE_ID = 458; // "Daga (Newbie)", anim 48
            const MAGIC_MISSILE_ID = 2; // "Dardo Mágico", mana 10

            const idClaseNum = parseInt(idClase);

            // Maná inicial por clase (paladín lo gana al subir a nivel 2,
            // el resto de guerreras/oficios no tiene)
            const manaByClass = {
                1: 100, // mago
                2: 70, // clerigo
                7: 70, // druida
                6: 70, // bardo
                4: 40 // asesino
            };
            const initialMana = manaByClass[idClaseNum] || 0;

            // Kit inicial equipado: ropa según raza + daga de newbie.
            // login.connect lo equipa solo a partir de estos items.
            const initialItems = [
                { idPos: 1, idItem: clothesByRace[idRaza] || 30, cant: 1, equipped: 1 },
                { idPos: 2, idItem: DAGGER_NEWBIE_ID, cant: 1, equipped: 1 }
            ];

            const initialSpells = initialMana > 0
                ? [{ idPos: 1, idSpell: MAGIC_MISSILE_ID }]
                : [];

            const character = await this.characterService.addCharacter({
                idAccount: req.user.accountId,
                name: cleanName,
                idClase: idClaseNum,
                idRaza: parseInt(idRaza),
                idGenero: parseInt(idGenero),
                idHead: parseInt(idHead),
                idBody: bodyByRace[idRaza] || 1,
                idWeapon: 48,
                idShield: 0,
                idHelmet: 0,
                idItemBody: 1,
                idItemWeapon: 2,
                idItemShield: 0,
                idItemHelmet: 0,
                idLastHead: 0,
                idLastBody: 0,
                idLastHelmet: 0,
                idLastWeapon: 0,
                idLastShield: 0,
                map: 1,
                posX: 50,
                posY: 50,
                gold: 0,
                hp: 100,
                maxHp: 100,
                mana: initialMana,
                maxMana: initialMana,
                minHit: 2,
                maxHit: 4,
                attrFuerza: 18,
                attrAgilidad: 18,
                attrInteligencia: 18,
                attrConstitucion: 18,
                privileges: 0,
                spellsAcertados: 0,
                spellsErrados: 0,
                countKilled: 0,
                countDie: 0,
                exp: 0,
                expNextLevel: 300,
                level: 1,
                criminal: false,
                dead: false,
                navegando: false,
                npcMatados: 0,
                ciudadanosMatados: 0,
                criminalesMatados: 0,
                fianza: 0,
                connected: false,
                items: initialItems,
                spells: initialSpells
            });

            res.json(character);
        } catch (e) {
            res.json({ error: true, message: e.message });
        }
    }
}

module.exports = CharacterController;
