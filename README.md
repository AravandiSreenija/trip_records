<h1>NYC Taxi Trip Data Ingestion Script:</h1>
This script automates the process of scraping NYC Taxi Trip Record Data for February and March 2019, storing it in a MongoDB database.

<h2>Functionality:</h2>

<h3>Web Scraping:</h3>

Fetches the NYC TLC trip record data page using requests.
Parses the HTML content with BeautifulSoup.
Extracts links to Parquet files specifically for February and March 2019.

<h3>MongoDB Connection:</h3>

Establishes a connection to a local MongoDB instance using pymongo.
Defines a database and collection for storing the data (modify 'records_data' and 'trip_records' as needed).

</h3>Data Processing and Storage:</h3>

Loops through identified Parquet file links.
Completes relative URLs if necessary.
Retrieves Parquet data directly using requests.
Reads the Parquet file into a pandas DataFrame using pyarrow.
Converts the DataFrame to a list of dictionaries for MongoDB insertion.
Inserts the records into the designated MongoDB collection.

<h2>Requirements:</h2>

Python 3.x
requests library: pip install requests
beautifulsoup4 library: pip install beautifulsoup4
pandas library: pip install pandas
pyarrow library: pip install pyarrow
pymongo library: pip install pymongo

<h2>Instructions:</h2>

Update the MongoDB connection string in client = MongoClient(...) with your actual connection details.
Ensure your MongoDB server is running and accessible.
Run the script: python nyc_taxi_data_ingestion.py (replace with the actual script filename).

<h2>Output:</h2>

The script prints messages indicating success or failure for each Parquet file download and record insertion.

<h1>NYC Taxi Trip Data API</h1>
This project provides a Node.js and Express-based API for accessing and analyzing NYC Taxi Trip Data. It connects to a MongoDB database containing trip records for February and March 2019.

<h2>Features:</h2>

<h3>Retrieve Trips:</h3>
Get all trips (limited to 19 by default, adjust the limit as needed).
Filter trips by VendorID (example provided).
Sort trips by a specific field (example provided).
Get the total number of trips.

<h3>Calculate Statistics:</h3>
Retrieve average fare amount for a specific VendorID.
Calculate total tolls and fares grouped by trip distance (categorized by VendorID).
Calculate total tolls and fares for a specific payment type.

<h3>High Fare Trips:</h3>
Get trips with a fare amount exceeding a specified value (example provided, adjust the limit as needed).

<h3>Date Range:</h3>
Retrieve trips within a specified date range (requires both startDate and endDate query parameters in YYYY-MM-DD format).

<h2>Requirements:</h2>

Node.js and npm
MongoDB instance
express library: npm install express
mongoose library: npm install mongoose
path library: npm install path (included in Node.js)

<h2>Setup:</h2>

Update the mongoURI variable in server.js with your actual MongoDB connection string.
Ensure your MongoDB server is running and the database (records_data) with the trip_records collection exists.
Replace the placeholder schema (tripSchema) in server.js with your actual schema if it differs.
(Optional) Create a frontend application (e.g., using HTML, CSS, and JavaScript) to interact with the API.

<h2>Usage:</h2>

Start the server by running node server.js.
Access the API endpoints using tools like Postman or curl commands. Refer to the endpoint descriptions below for specific URLs and query parameters.

<h2>API Endpoints:</h2>

/api/trips (GET): Retrieves all trips (limited by default).
/api/trips/filter (GET): Filters trips by VendorID (example: /api/trips/filter?VendorID=1).
/api/trips/statistics (GET): Calculates average fare for a VendorID (example: /api/trips/statistics?VendorID=1).
/api/trips/sorted (GET): Sorts trips by a specific field (example: /api/trips/sorted?sortBy=total_amount).
/api/trips/count (GET): Retrieves the total number of trips.
/api/trips/tolls-and-fares/vendor (GET): Calculates total tolls and fares grouped by trip distance for a VendorID (example: /api/trips/tolls-and-fares/vendor?VendorID=1).
/api/trips/tolls-and-fares/payment-type (GET): Calculates total tolls and fares for a specific payment type (example: /api/trips/tolls-and-fares/payment-type?paymentType=1).
/api/trips/high-fare/:amount (GET): Retrieves trips with a fare amount exceeding a specified value (example: /api/trips/high-fare/50).
/api/trips/date-range (GET): Retrieves trips within a specified date range (example: /api/trips/date-range?startDate=2019-02-01&endDate=2019-02-10).
/ (GET): Serves the static HTML page (if a frontend application is built).







