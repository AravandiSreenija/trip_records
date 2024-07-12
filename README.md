NYC Taxi Trip Data Ingestion Script:
This script automates the process of scraping NYC Taxi Trip Record Data for February and March 2019, storing it in a MongoDB database.

Functionality:

Web Scraping:

Fetches the NYC TLC trip record data page using requests.
Parses the HTML content with BeautifulSoup.
Extracts links to Parquet files specifically for February and March 2019.
MongoDB Connection:

Establishes a connection to a local MongoDB instance using pymongo.
Defines a database and collection for storing the data (modify 'records_data' and 'trip_records' as needed).
Data Processing and Storage:

Loops through identified Parquet file links.
Completes relative URLs if necessary.
Retrieves Parquet data directly using requests.
Reads the Parquet file into a pandas DataFrame using pyarrow.
Converts the DataFrame to a list of dictionaries for MongoDB insertion.
Inserts the records into the designated MongoDB collection.
Requirements:

Python 3.x
requests library: pip install requests
beautifulsoup4 library: pip install beautifulsoup4
pandas library: pip install pandas
pyarrow library: pip install pyarrow
pymongo library: pip install pymongo
Instructions:

Update the MongoDB connection string in client = MongoClient(...) with your actual connection details.
Ensure your MongoDB server is running and accessible.
Run the script: python nyc_taxi_data_ingestion.py (replace with the actual script filename).
Output:

The script prints messages indicating success or failure for each Parquet file download and record insertion.


NYC Taxi Trip Data API - README
This project provides a Node.js and Express-based API for accessing and analyzing NYC Taxi Trip Data. It connects to a MongoDB database containing trip records for February and March 2019.

Features:

Retrieve Trips:
Get all trips (limited to 19 by default, adjust the limit as needed).
Filter trips by VendorID (example provided).
Sort trips by a specific field (example provided).
Get the total number of trips.
Calculate Statistics:
Retrieve average fare amount for a specific VendorID.
Calculate total tolls and fares grouped by trip distance (categorized by VendorID).
Calculate total tolls and fares for a specific payment type.
High Fare Trips:
Get trips with a fare amount exceeding a specified value (example provided, adjust the limit as needed).
Date Range:
Retrieve trips within a specified date range (requires both startDate and endDate query parameters in YYYY-MM-DD format).
Requirements:

Node.js and npm
MongoDB instance
express library: npm install express
mongoose library: npm install mongoose
path library: npm install path (included in Node.js)
Setup:

Update the mongoURI variable in server.js with your actual MongoDB connection string.
Ensure your MongoDB server is running and the database (records_data) with the trip_records collection exists.
Replace the placeholder schema (tripSchema) in server.js with your actual schema if it differs.
(Optional) Create a frontend application (e.g., using HTML, CSS, and JavaScript) to interact with the API.
Usage:

Start the server by running node server.js.
Access the API endpoints using tools like Postman or curl commands. Refer to the endpoint descriptions below for specific URLs and query parameters.
API Endpoints:

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







