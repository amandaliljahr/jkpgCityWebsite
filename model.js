const { Pool } = require('pg');

const stores = require('./stores.json');

class ModelClass {
  constructor() {
    this.connection = new Pool({
      user: 'postgres',
      host: process.env.DB_HOST || 'localhost', //run locally
      //host: 'host.docker.internal', //run in docker
      database: 'postgres',
      password: '12345',
      port: 5432,
    });
  }

  async connectDatabase() {
    await this.connection.connect();
  }

  /*
  async setupDatabase() {
    await this.connection.query(`
    CREATE TABLE IF NOT EXISTS public.stores
    (
        id SERIAL,
        name text,
        url text,
        district text,
        rating integer,
        CONSTRAINT stores_pkey PRIMARY KEY (id)
    )`);

    await this.connection.query(`
      ALTER TABLE IF EXISTS public.stores
          OWNER to postgres
    `);


    for (const store of stores) {

      const { rows } = await this.connection.query(`
        SELECT * FROM stores WHERE name = $1
      `, [store.name]);

      if (rows.length === 0) {
        console.log(`Inserting ${store.name}`);
        await this.connection.query(`
          INSERT INTO stores (name, url, district)
          VALUES ($1, $2, $3)
        `, [store.name, store.url, store.district]);
      }
    }
  }
  */

  async setupDatabase() {
    await this.connection.query(`
        DELETE FROM stores
    `);

    await this.connection.query(`
        CREATE TABLE IF NOT EXISTS public.stores
        (
            id SERIAL,
            name text,
            url text,
            district text,
            rating integer,
            CONSTRAINT stores_pkey PRIMARY KEY (id)
        )
    `);

    await this.connection.query(`
        ALTER TABLE IF EXISTS public.stores
        OWNER to postgres
    `);

    for (const store of stores) {
        const { rows } = await this.connection.query(`
            SELECT * FROM stores WHERE name = $1
        `, [store.name]);

        if (rows.length === 0) {
            console.log(`Inserting ${store.name}`);
            await this.connection.query(`
                INSERT INTO stores (name, url, district)
                VALUES ($1, $2, $3)
            `, [store.name, store.url, store.district]);
        }
    }
}

  async getStores() {
    const { rows } = await this.connection.query(`
      SELECT * FROM stores
    `);
    return rows;
  }

  async getStoreByID(storeid) {
    const { rows } = await this.connection.query(`
      SELECT * FROM stores WHERE id = $1
    `,[storeid]); //sql escape for sql injection
    return rows;
  }

  async addStore(name, url, district) {
    try {
        await this.connection.query(`
            INSERT INTO stores (name, url, district)
            VALUES ($1, $2, $3)
        `, [name, url, district]);
    } catch (error) {
        console.error('Error adding new store to database:', error);
        throw error;
    }
  }


  async deleteStoreById(storeid) {
    try {
      await this.connection.query(`
      DELETE FROM stores WHERE id = $1
    `, [storeid]);
    } catch (error) {
      console.error('Error deleting store: ', error);
      throw error;
    }
  }


}

module.exports = ModelClass;
