import * as t from "drizzle-orm/sqlite-core";
import {defineRelations} from "drizzle-orm";

export const players = t.sqliteTable("players", {
    id: t.int().notNull().primaryKey({autoIncrement: true}),
})

export const games = t.sqliteTable("games", {
    id: t.int().notNull().primaryKey({autoIncrement: true}),
})

export const rounds = t.sqliteTable("rounds", {
    id: t.int().notNull().primaryKey({autoIncrement: true}),
    gameId: t.int().notNull().references(() => games.id)
})
export const moves = t.sqliteTable("moves", {
    id: t.int().notNull().primaryKey({autoIncrement: true}),
    roundId: t.int().notNull().references(() => rounds.id),
    playerId: t.int("player_id").notNull().references(() => players.id),
    action: t.int().notNull(),
})
export const gamesToPlayers = t.sqliteTable("games_to_players", {
    playerId: t.int().notNull().references(() => players.id),
    gameId: t.int().notNull().references(() => games.id),
}, (table) => [t.primaryKey({columns: [table.playerId, table.gameId]})]);

export const relations = defineRelations({players, games, rounds, moves, gamesToPlayers}, (r) => ({
    players: {
        games: r.many.games({
            from: r.players.id.through(r.gamesToPlayers.playerId),
            to: r.games.id.through(r.gamesToPlayers.gameId),
        })

    },
    games: {
        players: r.many.players(),
        rounds: r.many.rounds()
    },
    rounds: {
        game: r.one.games({
            from: r.rounds.gameId,
            to: r.games.id
        }),
        moves: r.many.moves(),
    },
    moves: {
        player: r.one.players({
            from: r.moves.playerId,
            to: r.players.id
        }),
        round: r.one.rounds({
            from: r.moves.roundId,
            to: r.rounds.id
        })
    }

}));