from pymongo import MongoClient
import csv
import os
import io
import pprint

L_EMPTY = -1
L_GOOD = 0
L_IN_CONTEXT = 1
L_BAD = 2
L_SYNONYM = 0
L_HYPERNYM = 1
L_HYPONYM = 2
L_NONE = 3
SAVE_FOLDER = "D:/Projects/MasterThesis/asssessed_topics/"

client = MongoClient("localhost:27017")
db = client.patent_backend

def getPatentUCIDs(db):
  UCIDs = []
  for pdf in db.pdfs.find():
    UCIDs.append(pdf['ucid'])
  return UCIDs

def getTopics(db, ucid):
  topics = []
  for topic in db.patents.find({'ucid': id}):
    topics.append(topic)
  return topics
  
def getAssessments(db, topic):
  assessments = []
  topic_id = topic['_id']
  for asmnt in db.assessments.find({'patent': topic_id}):
    assessments.append(asmnt)
  return assessments

def countValues(dictionary, value):
  if value in dictionary:
    dictionary[value] += 1
  else:
    dictionary[value] = 1
    
def getTermCandidateString(term_candidate):
  line = '\"'+term_candidate['tc_name']+'\"' + ',,'
  tmp = '{:.2f}'
  asmnt = term_candidate['tc_assessment']
  c_empty = asmnt[L_EMPTY]
  c_good = asmnt[L_GOOD]
  c_inContext = asmnt[L_IN_CONTEXT]
  c_bad = asmnt[L_BAD]
  sum = c_good + c_inContext + c_bad
  empty = tmp.format(c_empty / (sum + c_empty))
  full = tmp.format(sum / (sum + c_empty))
  if sum > 0:
    good = tmp.format(c_good / sum)
    inContext = tmp.format(c_inContext / sum)
    bad = tmp.format(c_bad / sum)
  else:
    good = str(0)
    inContext = str(0)
    bad = str(0)
  
  line = line + good + ',' + inContext + ',' + bad + ',,' + full + ',' + empty + '\n'
  return line
  
def getRelatedTermString(term_candidate):
  full_string = ''
  line = '\"'+term_candidate['tc_name']+'\"' + ',,'
  tmp = '{:.2f}'
  related = term_candidate['tc_related_terms']
  for rt in related:
    cur_line = line + '\"'+rt['rt_name']+'\"' + ',,'
    asmnt = rt['rt_assessment']
    c_empty = asmnt[L_EMPTY]
    c_synonym = asmnt[L_SYNONYM]
    c_hypernym = asmnt[L_HYPERNYM]
    c_hyponym = asmnt[L_HYPONYM]
    c_none = asmnt[L_NONE]
    sum = c_synonym + c_hypernym + c_hyponym + c_none
    empty = tmp.format(c_empty / (sum + c_empty))
    full = tmp.format(sum / (sum + c_empty))
    if sum > 0:
      synonym = tmp.format(c_synonym / sum)
      hypernym = tmp.format(c_hypernym / sum)
      hyponym = tmp.format(c_hyponym / sum)
      none = tmp.format(c_none / sum)
    else:
      synonym = str(0)
      hypernym = str(0)
      hyponym = str(0)
      none = str(0)
    full_string = full_string + cur_line + synonym + ',' + hypernym + ',' + hyponym + ',' + none + ',,' + full + ',' + empty + '\n'
  return full_string
    
  

def writeTopicFile(folder, topic):
  fname = topic['topic']+'_'+topic['method']+'.csv'
  r_fname = '[rel]'+topic['topic']+'_'+topic['method']+'.csv'
  with io.open(folder + fname, 'w') as outfile, io.open(folder + r_fname, 'w') as r_outfile:
    outfile.write("Term Candidate,,Good,In Context,Bad,,Evaluated,Not Evaluated\n")
    r_outfile.write("Term Candidate,,Related Term,,Synonym,Hypernym,Hyponym,None,,Evaluated,Not Evaluated\n")
    for tc in topic['term_candidates']:
      outfile.write(getTermCandidateString(tc))
      r_outfile.write(getRelatedTermString(tc))
    outfile.close()
    r_outfile.close()


UCIDs = getPatentUCIDs(db)

#aggregate data
patent = dict()
for id in UCIDs:
  topic_list = getTopics(db, id)
  #each patent consists of multiple topics, each topic belongs to one patent
  patent[id] = []
  for topic in topic_list:
    topic_dict = dict()
    topic_dict['topic'] = topic['topic']
    topic_dict['method'] = topic['method']
    topic_dict['term_candidates'] = []
    assessments = getAssessments(db, topic)
    #combine term candidates with their assessments
    for tc in topic['term_candidates']:
      #-1: not assessed, 0:"good", 1:"in context", 2:"bad"
      assessmentCounts = {-1:0, 0:0, 1:0, 2:0}
      term_candidate_dict = {'tc_name':tc['name'], 'tc_related_terms':[]}
      for asmnt in assessments:
        #get assessments of each term candidate by id
        tc_assessment = asmnt['term_candidates'][tc['id']]
        countValues(assessmentCounts, tc_assessment['search_quality'])
      #combine related terms (of current term candidate) with their assessments
      if 'related_terms' in tc:
        for rt in tc['related_terms']:
          # TODO: update
          rt_assessmentCounts = {-1:0, 0:0, 1:0, 2:0, 3:0}
          related_term_dict = {'rt_name':rt['name']}
          for asmnt in assessments:
            #get assessment of each related term by id
            tc_assessment = asmnt['term_candidates'][tc['id']]
            rt_assessment = tc_assessment['related_terms'][rt['id']]
            countValues(rt_assessmentCounts, rt_assessment['relationship'])
          related_term_dict['rt_assessment'] = rt_assessmentCounts
          term_candidate_dict['tc_related_terms'].append(related_term_dict)
      term_candidate_dict['tc_assessment'] = assessmentCounts
      topic_dict['term_candidates'].append(term_candidate_dict)
    patent[id].append(topic_dict)
    #pprint.pprint(patent[id][0])

#produce output files
for id in UCIDs:
  #for each topic
  for topic in patent[id]:
    writeTopicFile(SAVE_FOLDER, topic)
 

