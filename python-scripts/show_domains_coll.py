from pymongo import MongoClient
from pprint import pprint

DATA_FOLDER = "mock_data/"
client = MongoClient("localhost:27017")

db = client.patent_backend
cursor = db.domains.find({})
for document in cursor:
    pprint(document)