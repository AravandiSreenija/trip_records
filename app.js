// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/records_data'; // Update with your DB name

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model (replace with your actual schema)
const tripSchema = new mongoose.Schema({
    _id: String,
    VendorID: Number,
    tpep_pickup_datetime: Date,
    tpep_dropoff_datetime: Date,
    passenger_count: Number,
    trip_distance: Number,
    RatecodeID: Number,
    store_and_fwd_flag: String,
    PULocationID: Number,
    DOLocationID: Number,
    payment_type: Number,
    fare_amount: Number,
    extra: Number,
    mta_tax: Number,
    tip_amount: Number,
    tolls_amount: Number,
    improvement_surcharge: Number,
    total_amount: Number,
    congestion_surcharge: Number,
    airport_fee: Number
},{collection:"trip_records"});

const Trip = mongoose.model('Trip', tripSchema);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get all trips
app.get('/api/trips', async (req, res) => {
    try {
        const trips = await Trip.find().limit(19);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving trips', error: err });
    }
});



//  Get trips filtered by criteria (e.g., by VendorID)
app.get('/api/trips/filter', async (req, res) => {
    const { VendorID } = req.query; // Example filter
    try {
        const trips = await Trip.find({ VendorID: VendorID }).limit(19);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving trips', error: err });
    }
});

// Get average fare by VendorID
app.get('/api/trips/statistics', async (req, res) => {
    const { VendorID } = req.query; // Get VendorID from query parameters
    try {
        const avgFare = await Trip.aggregate([
            { $match: { VendorID: parseInt(VendorID) } }, // Filter by VendorID
            { $group: { _id: null, averageFare: { $avg: '$fare_amount' } } }
        ]);
        res.json({ averageFare: avgFare[0]?.averageFare || 0 });
    } catch (err) {
        res.status(500).json({ message: 'Error calculating statistics', error: err });
    }
});

//  Get trips sorted by a specific field
app.get('/api/trips/sorted', async (req, res) => {
    const { sortBy } = req.query; // Example: sortBy=total_amount
    try {
        const trips = await Trip.find().sort({ [sortBy]: 1 }).limit(40);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving trips', error: err });
    }
}); 

//  Count total trips
app.get('/api/trips/count', async (req, res) => {
    try {
        const count = await Trip.countDocuments();
        res.json({ totalTrips: count });
    } catch (err) {
        res.status(500).json({ message: 'Error counting trips', error: err });
    }
});
//--------tolls-and-fares and difference

app.get('/api/trips/tolls-and-fares/vendor', async (req, res) => {
    const { VendorID } = req.query;
    try {
        const result = await Trip.aggregate([
            { $match: { VendorID: parseInt(VendorID) } },
            {
                $group: {
                    _id: {
                        trip_distance: "$trip_distance" // Group by trip distance
                    },
                    totalTolls: { $sum: '$tolls_amount' },
                    totalFares: { $sum: '$fare_amount' }
                }
            }
        ]);

        // Format the response to include trip distance and difference
        const formattedResult = result.map(item => ({
            tripDistance: item._id.trip_distance,
            totalTolls: item.totalTolls,
            totalFares: item.totalFares,
            difference: item.totalFares - item.totalTolls // Calculate the difference
        }));

        res.json(formattedResult);
    } catch (err) {
        res.status(500).json({ message: 'Error calculating totals by VendorID', error: err });
    }
});

//payment_type

app.get('/api/trips/tolls-and-fares/payment-type', async (req, res) => {
    const { paymentType } = req.query;
    try {
        const result = await Trip.aggregate([
            { $match: { payment_type: parseInt(paymentType) } },
            {
                $group: {
                    _id: null, // You can group by payment type if needed
                    totalTolls: { $sum: '$tolls_amount' },
                    totalFares: { $sum: '$fare_amount' }
                }
            }
        ]);
        
        // If you want to return the payment type as well
        res.json({
            paymentType: paymentType,
            totalTolls: result[0]?.totalTolls || 0,
            totalFares: result[0]?.totalFares || 0,
            difference: (result[0]?.totalFares || 0) - (result[0]?.totalTolls || 0) // Calculate the difference
        });
    } catch (err) {
        res.status(500).json({ message: 'Error calculating totals by payment type', error: err });
    }
});

app.get('/api/trips/popular-routes', async (req, res) => {
    try {
        // Aggregating trips to find popular pick-up and drop-off locations
        const popularRoutes = await Trip.aggregate([
            {
                $group: {
                    _id: {
                        pickup: '$PULocationID',
                        dropoff: '$DOLocationID'
                    },
                    count: { $sum: 1 },
                    averageDistance: { $avg: '$trip_distance' },
                    averageFare: { $avg: '$fare_amount' }
                }
            },
            { $sort: { count: -1 } }, // Sort by the most common routes
            { $limit: 10 } // Limit to top 10 popular routes
        ]);

        // Aggregating to find peak usage times
        const peakTimes = await Trip.aggregate([
            {
                $group: {
                    _id: { $hour: '$tpep_pickup_datetime' },
                    tripCount: { $sum: 1 }
                }
            },
            { $sort: { tripCount: -1 } },
            { $limit: 5 } // Top 5 peak hours
        ]);

        res.json({ popularRoutes, peakTimes });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving trip patterns', error: err });
    }
});


//Get Trips with High Fare Amount


app.get('/api/trips/high-fare/:amount', async (req, res) => {
    const { amount } = req.params; // e.g., amount=50
    try {
        const trips = await Trip.find({ fare_amount: { $gt: parseFloat(amount) } }).limit(1000);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving trips with high fare', error: err });
    }
});

//Get Trips within a Date Range


app.get('/api/trips/date-range', async (req, res) => {
    const { startDate, endDate } = req.query; // e.g., ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    try {
        const trips = await Trip.find({
            tpep_pickup_datetime: { $gte: new Date(startDate), $lte: new Date(endDate).limit(1000)}
        });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving trips within date range', error: err });
    }
});




// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

