from pymongo import MongoClient
import csv
import os
import io


DATA_FOLDER = "mock_data/"

#client = MongoClient("mongodb://mongodb0.example.net:27017")
client = MongoClient("localhost:27017")
#db = client['test']
#coll = db['restaurants']
#cursor = db.restaurants.find()
#for doc in cursor:
#  print(doc)
#client.database_names()
#db.collection_names()
#db.restaurants.drop()

db = client.patent_backend
db.patents.drop()

fileList = os.listdir(DATA_FOLDER)
for fname in fileList:
  with io.open(DATA_FOLDER + fname, 'r') as infile:
    reader = csv.reader(infile, delimiter=';')
    patent = dict()
    patent_name = next(reader)[0]
    patent['name'] = patent_name
    term_candidates = []
    term_candidate_count = 0
    for row in reader:
      term_candidate = dict()
      related_terms = []
      tc_name = row[0]
      term_candidate['name'] = tc_name
      term_candidate['id'] = term_candidate_count
      related_term_count = 0
      rt_data = row[1:]
      for entry in rt_data:
        related_term = dict()
        related_term['name'] = entry
        related_term['id'] = related_term_count
        related_terms.append(related_term)
        related_term_count += 1
      if len(related_terms) > 0:
        term_candidate['related_terms'] = related_terms
      term_candidates.append(term_candidate)
      term_candidate_count += 1
    if len(term_candidates) > 0:
      patent['term_candidates'] = term_candidates
    patent_id = db.patents.insert_one(patent)
