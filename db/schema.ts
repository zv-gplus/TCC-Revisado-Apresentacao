import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Nenhum nome, IP, URL completa ou conteúdo de montagem é salvo.
export const events = sqliteTable('events', {
  id: integer('id').primaryKey({autoIncrement: true}),
  at: integer('at').notNull(),
  type: text('type').notNull(),
  code: text('code').notNull(),
  origin: text('origin').notNull(),
});

// Chaves temporárias de limitação, descartadas depois de dez minutos.
export const limits = sqliteTable('limits', {
  key: text('key').primaryKey(),
  expires: integer('expires').notNull(),
  hits: integer('hits').notNull(),
});
