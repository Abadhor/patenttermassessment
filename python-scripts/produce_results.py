from pymongo import MongoClient
import csv
import os
import io
import pprint

tc_labels = {'empty':-1, 'keyphrase':0, 'term':1,'none':2}
rt_labels = {'empty':-1, 'synonym':0, 'hyponym':1,'hypernym':2, 'acronym':3, 'antonym':4, 'form':5, 'part':6, 'none':7}
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
  c_dict = {}
  for key in tc_labels.keys():
    c_dict[key] = asmnt[tc_labels[key]]
  c_sum = sum([x[1] for x in c_dict.items() if x[0] != 'empty'])
  empty = tmp.format(c_dict['empty'] / (c_sum + c_dict['empty']))
  full = tmp.format(c_sum / (c_sum + c_dict['empty']))
  if c_sum > 0:
    str = [tmp.format(c_dict['keyphrase'] / c_sum), tmp.format(c_dict['term'] / c_sum), tmp.format(c_dict['none'] / c_sum)]
  else:
    str = ['0','0','0']
  
  line = line + ','.join(str) + ',,' + full + ',' + empty + '\n'
  return line
  
def getRelatedTermString(term_candidate):
  full_string = ''
  line = '\"'+term_candidate['tc_name']+'\"' + ',,'
  tmp = '{:.2f}'
  related = term_candidate['tc_related_terms']
  for rt in related:
    cur_line = line + '\"'+rt['rt_name']+'\"' + ',,'
    asmnt = rt['rt_assessment']
    c_dict = {}
    for key in rt_labels.keys():
      c_dict[key] = asmnt[rt_labels[key]]
    c_sum = sum([x[1] for x in c_dict.items() if x[0] != 'empty'])
    empty = tmp.format(c_dict['empty'] / (c_sum + c_dict['empty']))
    full = tmp.format(c_sum / (c_sum + c_dict['empty']))
    if c_sum > 0:
      str = [tmp.format(c_dict['synonym'] / c_sum), tmp.format(c_dict['hyponym'] / c_sum), tmp.format(c_dict['hypernym'] / c_sum),
      tmp.format(c_dict['acronym'] / c_sum),tmp.format(c_dict['antonym'] / c_sum),tmp.format(c_dict['form'] / c_sum),
      tmp.format(c_dict['part'] / c_sum),tmp.format(c_dict['none'] / c_sum)]
    else:
      str = ['0','0','0','0','0','0','0','0']
    full_string = full_string + cur_line + ','.join(str) + ',,' + full + ',' + empty + '\n'
  return full_string
    
  

def writeTopicFile(folder, topic):
  fname = topic['topic']+'_'+topic['method']+'.csv'
  r_fname = '[rel]'+topic['topic']+'_'+topic['method']+'.csv'
  with io.open(folder + fname, 'w') as outfile, io.open(folder + r_fname, 'w') as r_outfile:
    outfile.write("Term Candidate,,keyphrase,term,none,,Evaluated,Not Evaluated\n")
    r_outfile.write("Term Candidate,,Related Term,,synonym,hyponym,hypernym,acronym,antonym,form,part,none,,Evaluated,Not Evaluated\n")
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
      #see labels
      assessmentCounts = {}
      for key in tc_labels.values():
        assessmentCounts[key] = 0
      term_candidate_dict = {'tc_name':tc['name'], 'tc_related_terms':[]}
      for asmnt in assessments:
        #get assessments of each term candidate by id
        tc_assessment = asmnt['term_candidates'][tc['id']]
        countValues(assessmentCounts, tc_assessment['search_quality'])
      #combine related terms (of current term candidate) with their assessments
      if 'related_terms' in tc:
        for rt in tc['related_terms']:
          #see labels
          rt_assessmentCounts = {}
          for key in rt_labels.values():
            rt_assessmentCounts[key] = 0
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
 

