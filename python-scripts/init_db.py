from pymongo import MongoClient
import csv
import os
import io


#DATA_FOLDER = "mock_data/"
DATA_FOLDER = "D:/Projects/MasterThesis/DATAVersion/"

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
db.domains.drop()
#db.users.drop()
#db.assessments.drop()

all_domains = set()

fileList = os.listdir(DATA_FOLDER)
for fname in fileList:
  with io.open(DATA_FOLDER + fname, 'r') as infile:
    reader = csv.reader(infile, delimiter=',')
    patent = dict()
    #method (either nlp or stat)
    if (fname[len(fname)-3:] == "nlp"):
      patent['method'] = "NLP"
    else:
      patent['method'] = "STAT"
    #line 1: topic
    patent['topic'] = next(reader)[0]
    #line 2: patent-ucid
    patent['ucid'] = next(reader)[0]
    #line 3: domains
    patent_domains_data = next(reader)
    patent_domains = []
    for domain in patent_domains_data:
      patent_domains.append(domain)
      all_domains.add(domain)
    patent['domains'] = patent_domains
    #line 4: title
    patent_name = next(reader)[0]
    patent['name'] = patent_name
    #line 5: ipcs
    patent['ipc'] = next(reader)
    #read term candidates
    term_candidates = []
    term_candidate_count = 0
    for row in reader:
      term_candidate = dict()
      related_terms = []
      tc_name = row[0]
      term_candidate['name'] = tc_name
      term_candidate['id'] = term_candidate_count
      #read related terms of term candidate
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
    #insert patent
    patent_id = db.patents.insert_one(patent)

#insert domains
for domain_name in all_domains:
  domain = dict()
  domain['name'] = domain_name
  db.domains.insert_one(domain)
