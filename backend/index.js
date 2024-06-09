const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data'); // Correct import for FormData

const uri = "mongodb+srv://root:pan123456@mern.gcco80d.mongodb.net/?retryWrites=true&w=majority&appName=MERN";
const port = 3001;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: false,
  }
});

let db, coll, coll2, coll3;

async function initializeMongoDB() {
  try {
    await client.connect();
    db = client.db("mern");
    coll = db.collection('mern');
    coll2 = db.collection('booking');
    coll3 = db.collection('login');
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

initializeMongoDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(bodyParser.json());

app.get('/search/:place/:checkIn/:checkOut/:people', async (req, res) => {
  try {
    const { place } = req.params;
    const query = { city: place };
    const results = await coll.find(query).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching bookings:', error);
    res.status(500).send('Error occurred during search.');
  }
});

app.post('/booking', async (req, res) => {
  try {
    const { checkIn, checkOut, user, hotel } = req.body;
    const bookingDocument = {
      checkIn,
      checkOut,
      user,
      hotel: ObjectId.isValid(hotel) ? new ObjectId(hotel) : hotel,
      payment:false
    };

    const result = await coll2.insertOne(bookingDocument);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).send('Error occurred during booking.');
  }
});

app.get('/login/:user/:pass', async (req, res) => {
  try {
    const { user, pass } = req.params;
    const query = { username: user, password: pass };
    const results = await coll3.find(query).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error occurred during login.');
  }
});

app.get('/my/:user', async (req, res) => {
  try {
    const { user } = req.params;
    const results = await coll2.aggregate([
      {
        $match: { user: user }
      },
      {
        $lookup: {
          from: 'mern',
          localField: 'hotel',
          foreignField: '_id',
          as: 'hotelDetails'
        }
      },
      {
        $unwind: {
          path: '$hotelDetails',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).send('Error occurred during fetching bookings.');
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/slipok', upload.single('files'), async (req, res) => {
  const file = req.file;
  const formData = new FormData();
  formData.append('files', file.buffer, file.originalname);

  try {
    const response = await axios.post('https://api.slipok.com/api/line/apikey/22739', formData, {
      headers: {
        ...formData.getHeaders(),
        'x-authorization': 'SLIPOKEFR7GFQ',
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error occurred during file upload.');
  }


  

});
app.post('/update-payment', async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).send('Invalid booking ID.');
    }

    const result = await coll2.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { payment: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send('Booking not found or payment status is already set.');
    }

    res.status(200).send('Payment status updated successfully.');
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).send('Error occurred during payment status update.');
  }
});

app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await coll2.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Booking deleted successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});
