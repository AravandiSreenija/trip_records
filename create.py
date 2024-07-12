import requests
from bs4 import BeautifulSoup
import pandas as pd
import pyarrow.parquet as pq
from pymongo import MongoClient
import io
 
# Define the URL of the NYC TLC trip record data page
url = "https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page"
 
# Send an HTTP request to the URL
response = requests.get(url)
 
if response.status_code == 200:
    # Parse the HTML content of the page
    soup = BeautifulSoup(response.content, 'html.parser')
 
    # Find all links on the page
    links = soup.find_all('a')
 
    # Extract the href attributes of the links that point to Parquet files for February and March 2019
    parquet_links = [link.get('href') for link in links if 'parquet' in link.get('href', '') and ('2019-02' in link.get('href') or '2019-03' in link.get('href'))]
 
    # MongoDB connection settings
    client = MongoClient('mongodb://localhost:27017/')  # Update with your MongoDB connection string
    db = client['records_data']  # Replace 'records_data' with your database name
    collection = db['trip_records']  # Replace 'trip_records' with your collection name
 
    for parquet_link in parquet_links:
        # Complete the URL if it's relative
        if not parquet_link.startswith('http'):
            parquet_link = "https://www.nyc.gov" + parquet_link
 
        # Get Parquet data directly
        parquet_response = requests.get(parquet_link)
 
        if parquet_response.status_code == 200:
            # Read Parquet file directly into a Pandas DataFrame
            parquet_file = io.BytesIO(parquet_response.content)
            parquet_table = pq.read_table(parquet_file)
            df = parquet_table.to_pandas()
 
            # Convert DataFrame to JSON records (list of dictionaries)
            json_records = df.to_dict(orient='records')
 
            # Insert JSON records into MongoDB collection
            collection.insert_many(json_records)
            print(f"Ingested {len(json_records)} records from {parquet_link} into MongoDB collection 'trip_records'")
 
        else:
            print(f"Failed to fetch Parquet data from: {parquet_link}")
 
    # Close MongoDB connection
    client.close()
 
else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")



