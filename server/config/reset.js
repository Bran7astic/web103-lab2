import { pool } from "./database.js";
import './dotenv.js'; // configure environment variables
import giftData from '../data/gifts.js'

const createGiftsTable = async () => {
    // IF table exists, do not create, otherwise create empty table with the
    // following properties
    const createTableQuery = `
    DROP TABLE IF EXISTS gifts;

    CREATE TABLE IF NOT EXISTS gifts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        pricePoint VARCHAR(10) NOT NULL,
        audience VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        submittedBy VARCHAR(255) NOT NULL,
        submittedOn TIMESTAMP NOT NULL
    )
    `

    try {
        const res = await pool.query(createTableQuery)
        console.log('🎉 Gifts table created successfully!!')
    } catch (err) {
        console.error('⚠️ Something went wrong creating gifts table...', err)
    }
}

const seedGiftsTable = async () => {
    await createGiftsTable()

    giftData.forEach((gift) => {
        const insertQuery = {
            text: `INSERT INTO GIFTS (name, pricePoint, audience, image, description, submittedBy, submittedOn) VALUES ($1, $2, $3, $4, $5, $6, $7)`
        }

        const values = [
            gift.name,
            gift.pricePoint,
            gift.audience,
            gift.image,
            gift.description,
            gift.submittedBy,
            gift.submittedOn
        ]

        pool.query(insertQuery, values, (err, res) => {
            if (err) {
                console.error('⚠️ error inserting gift', err)
                return
            }

            console.log(`✅ ${gift.name} added succesfully`)
        })
    })
}

seedGiftsTable()