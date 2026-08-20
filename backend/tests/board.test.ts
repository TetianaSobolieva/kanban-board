import 'reflect-metadata';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { createApp } from '../src/app';
import { AppDataSource } from '../src/data-source';
import { Board } from '../src/entities/Board';
import { Card } from '../src/entities/Card';

const app = createApp();
let dataSource: DataSource;

beforeAll(async () => {
  dataSource = await AppDataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

afterEach(async () => {
  await dataSource.createQueryBuilder().delete().from(Card).execute();
  await dataSource.createQueryBuilder().delete().from(Board).execute();
});

describe('Board API', () => {
  it('creates a board with default empty columns', async () => {
    const res = await request(app).post('/api/boards').send({ name: 'Sprint 1' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Sprint 1');
    expect(res.body.id).toHaveLength(10);
    expect(res.body.columns.todo).toEqual([]);
    expect(res.body.columns.in_progress).toEqual([]);
    expect(res.body.columns.done).toEqual([]);
  });

  it('rejects a board with an empty name', async () => {
    const res = await request(app).post('/api/boards').send({ name: '' });
    expect(res.status).toBe(422);
  });

  it('fetches an existing board by id', async () => {
    const created = await request(app).post('/api/boards').send({ name: 'Fetch me' });
    const res = await request(app).get(`/api/boards/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
  });

  it('returns 404 for a non-existent board', async () => {
    const res = await request(app).get('/api/boards/doesnotexist');
    expect(res.status).toBe(404);
  });

  it('updates a board name', async () => {
    const created = await request(app).post('/api/boards').send({ name: 'Old name' });
    const res = await request(app)
      .patch(`/api/boards/${created.body.id}`)
      .send({ name: 'New name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New name');
  });

  it('deletes a board', async () => {
    const created = await request(app).post('/api/boards').send({ name: 'To delete' });
    const del = await request(app).delete(`/api/boards/${created.body.id}`);
    expect(del.status).toBe(204);

    const fetched = await request(app).get(`/api/boards/${created.body.id}`);
    expect(fetched.status).toBe(404);
  });
});

describe('Card API', () => {
  it('creates a card in the todo column by default', async () => {
    const board = await request(app).post('/api/boards').send({ name: 'Board with cards' });

    const res = await request(app)
      .post(`/api/boards/${board.body.id}/cards`)
      .send({ title: 'My first task', description: 'Details' });

    expect(res.status).toBe(201);
    expect(res.body.column).toBe('todo');
    expect(res.body.order).toBe(0);
  });

  it('moves a card to another column via update', async () => {
    const board = await request(app).post('/api/boards').send({ name: 'Board' });
    const card = await request(app)
      .post(`/api/boards/${board.body.id}/cards`)
      .send({ title: 'Task' });

    const res = await request(app)
      .patch(`/api/boards/${board.body.id}/cards/${card.body.id}`)
      .send({ column: 'in_progress', order: 0 });

    expect(res.status).toBe(200);
    expect(res.body.column).toBe('in_progress');
  });

  it('reorders multiple cards in a single request', async () => {
    const board = await request(app).post('/api/boards').send({ name: 'Board' });
    const cardA = await request(app)
      .post(`/api/boards/${board.body.id}/cards`)
      .send({ title: 'A' });
    const cardB = await request(app)
      .post(`/api/boards/${board.body.id}/cards`)
      .send({ title: 'B' });

    const res = await request(app)
      .patch(`/api/boards/${board.body.id}/cards/reorder`)
      .send({
        cards: [
          { id: cardA.body.id, column: 'done', order: 1 },
          { id: cardB.body.id, column: 'done', order: 0 },
        ],
      });

    expect(res.status).toBe(200);

    const fetched = await request(app).get(`/api/boards/${board.body.id}`);
    expect(fetched.body.columns.done.map((c: { id: string }) => c.id)).toEqual([
      cardB.body.id,
      cardA.body.id,
    ]);
  });

  it('deletes a card', async () => {
    const board = await request(app).post('/api/boards').send({ name: 'Board' });
    const card = await request(app)
      .post(`/api/boards/${board.body.id}/cards`)
      .send({ title: 'To delete' });

    const res = await request(app).delete(`/api/boards/${board.body.id}/cards/${card.body.id}`);
    expect(res.status).toBe(204);
  });
});
