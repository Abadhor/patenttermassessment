from pymongo import MongoClient
import csv
import os
import io
import json

#DATA_FOLDER = "mock_data/"
DATA_FOLDER = "D:/Projects/MasterThesis/DATAVersion/"
PDF_FOLDER = "D:/Projects/MasterThesis/pdfs/"
JSON_FOLDER = "D:/Projects/MasterThesis/jason_assessment_tool/"
#DATA_FOLDER = "/home/tfink/DATAVersion/"
#PDF_FOLDER = "/home/tfink/pdfs/"
#JSON_FOLDER = "/home/tfink/jason_assessment_tool/"

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
db.pdfs.drop()
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

#save pdfs
fileList = os.listdir(PDF_FOLDER)
for fname in fileList:
  with io.open(PDF_FOLDER + fname, 'rb') as infile:
    #get into right format EP-1234567-A1
    ucid = fname[:2]+'-'+fname[2:9]+'-'+fname[10:12]
    pdf_data = infile.read()
    pdf = dict()
    pdf['ucid'] = ucid
    pdf['data'] = pdf_data
    pdf_id = db.pdfs.insert_one(pdf)

fileList = os.listdir(JSON_FOLDER)
for fname in fileList:
  if fname[len(fname)-4:] == 'json':
    with io.open(JSON_FOLDER + fname, 'r') as infile:
      #get into right format EP-1234567-A1
      ucid = fname[:13]
      root = json.load(infile)
      if len(root['data']['bibliographic']['abstract']) == 1:
        abstract = root['data']['bibliographic']['abstract'][0]['text']
      else:
        print("ucid:",ucid,"abstracts:",len(root['data']['bibliographic']['abstract']))
        abstract = None
      if root['data']['claim'] != None:
        claim = root['data']['claim']['text']
      else:
        print("ucid:",ucid,"claim: None")
        claim = None
      if root['data']['description'] != None:
        description = root['data']['description']['text']
      else:
        print("ucid:",ucid,"description: None")
        description = None
      title = None
      for l in root['data']['bibliographic']['title']:
        if l['language'] == 'en':
          title = l['text']
      if title == None:
        print("ucid:",ucid,"title: None")
      db.pdfs.update({'ucid':ucid}, {'$set':{'abstract':abstract,'claim':claim,'description':description,'title':title}}, upsert=False)
      