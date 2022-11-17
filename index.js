const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

// middle ware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1ndgjy2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const appointmentOptionCollection = client.db('doctorsHome').collection('appointmentOption')
        const bookingsCollection = client.db('doctorsHome').collection('bookings')

        app.get('/appointmentOption', async (req, res) => {
            const date = req.body.date;
            console.log(date);
            const query = {};
            const options = await appointmentOptionCollection.find(query).toArray();

            // get the booking of the provided date 
            const bookingQuery = { appointmentDate: date }
            const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray();
            // options.forEach(option => {
            //     const optionBooked = alreadyBooked.filter( book => book.treatment === option.name )
            //     const bookedSlots = optionBooked.map( book => book.slot)
            //     const remainingSlots = option.slots.filter( slot => !bookedSlots.includes(slot) )
            //     // option.slot = remainingSlots;
            //     // console.log(date, option.name, remainingSlots.length);
            // })
            res.send(options);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })

        /*
        API Naming Convention
        1. app.get('/bookings');
        2. app.get('/bookings/:id')
        3. app.post('/bookings')
        4. app.post('/bookings/:id')
        5. app.delete('/bookings/:id')
        6. app.patch('/bookings/:id') 
        */

    }
    finally {

    }
}
run().catch(console.dir);





app.get('/', async (req, res) => {
    res.send('doctors home server is running');
})

app.listen(port, () => console.log(`doctors portal running on : ${port}`))