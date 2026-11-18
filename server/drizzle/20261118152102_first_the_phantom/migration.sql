CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT
);
--> statement-breakpoint
CREATE TABLE `games_to_players` (
	`playerId` integer NOT NULL,
	`gameId` integer NOT NULL,
	CONSTRAINT `games_to_players_pk` PRIMARY KEY(`playerId`, `gameId`),
	CONSTRAINT `fk_games_to_players_playerId_players_id_fk` FOREIGN KEY (`playerId`) REFERENCES `players`(`id`),
	CONSTRAINT `fk_games_to_players_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`)
);
--> statement-breakpoint
CREATE TABLE `moves` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`roundId` integer NOT NULL,
	`player_id` integer NOT NULL,
	`action` integer NOT NULL,
	CONSTRAINT `fk_moves_roundId_rounds_id_fk` FOREIGN KEY (`roundId`) REFERENCES `rounds`(`id`),
	CONSTRAINT `fk_moves_player_id_players_id_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` integer PRIMARY KEY AUTOINCREMENT
);
--> statement-breakpoint
CREATE TABLE `rounds` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`gameId` integer NOT NULL,
	CONSTRAINT `fk_rounds_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`)
);
