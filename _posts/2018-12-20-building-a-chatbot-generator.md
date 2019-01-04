---
layout: post
title:  "We heard you like chatbots - so we built a chatbot generator."
date:   2018-12-19 10:40:37 -0700
categories: artifical intelligence machine learning chatbots
---

Taylor and I have talked about collaborating on a machine learning project for some time, despite my lack of knowledge about machine learning. 

We wanted our project to do something useful for the general public. 

## First ideas

- Build a fantasy football predictor 
- Build a chatbot based on the chat logs from our facebook messenger. 

## Resources 

[https://medium.com/analytics-vidhya/building-a-simple-chatbot-in-python-using-nltk-7c8c8215ac6e]

## GitHub 
[Frontend](https://github.com/ogdenstudios/chatbot-generator)
[Backend](https://github.com/taytayp/chatbot-backend)

Types of chatbots: 

- Rule based
    Bot answers questions based on some rules i'ts been trained on 
    Rules can be simple or complex, although bots tend to fail to manage complex queries. 
- Self learning 
    These bots use machine learning
    Can be either:
    - Retrieval based 
        uses some heuristic to select a response from a library of predefined responses
        Uses message/context to select best response 
        Could use dialog tree, all conversation, variables (like a username). Can use rule based decision trees or machine learning classifiers
    - Generative 
        - generate answers and not always replies with one of the answers from a pre defineed set. They are more intelligent as they can take word by word from the query and generate the answer. 

[NLTK] - a platform for building python programs to work with human language data. 

Easy to use interfacses with a ton of resources for language processing libraries

Terms to know: 

classification
tokenization
stemming
tagging
parsing
semantic rasoning

1. Install NLTK 
    PREREQ: command line 
    PREREQ: virtual env
    REPREQ: package managers, pip 

NLTK and Machine Learning algorithms require a *numerical feature vector* to perform the task. 

We need to pre process data to make it ideal. 

Convert the entire text into uppecase or lowercase, so different cased words don't get treated differently. 

Tokenization: convert normal text strings into a list of word we actually want
    sentence tokenizer can be used to find the list of sentences and word tokenizer can be used to find the list of words in trings. 

Remove noise (everything that isn't a standard number or letter)

REmove stop words (common words that are of little value inselecting what the user wants)

Stemming: reducing inflected (or derived) words to their stem - base or root form. I.e. "stems" "stemming" "stemmed" and "stemtization" results in "stem" 

Lemmatization: variant of stemming. Stemming can sometimes create on existent words, but lemmas are actual words. "better" and "goood" are in the same lemma and are considered the same. 

Bag of words 

- after preprocessing, we transform textinto a vector (or array) of numbers. The bag-of-words is a representation of text that describes the occurrence of words witin a document. Involves: 

    - vocab of known words
    - a measure of th epresence of known words 

The order or structure of the words is discarded and the model is only concerned with whether the known words occur in the docuemtn. Not where they occur in the document. 

- the principle here is that documents are similar if they have similar content, regardless of structure. We can learn something about the meaning of a document from its cnotent alone. 

For example, a dictionary with the words 

{Learning, is, the, not, great} and vectorize text "learning is great", we get the vector: (1, 1, 0, 0, 1)

TF-IDF approach

Bag of words problem: highly frequent words dominate the document with a larger score, but might not contain as much informational content. It also gives more weight to longer documents than shorter documents. 

We could rescale the frequency of words by how often they appear in all documents - words like "the" that are also common across all documents are penalized. 

This approach is called **Term Fequency Inerse Document Frequency** or **TF-IDF**

TF = (number of times term te appears in a document) / (number of terms in the document) 

IDF= 1 + log(N/n), where N is the number of documents and n is the number of docuemtns a term t has appear in. 

You can use Tf-IDF in scikit learn as:

`from sklearn.feature_extraction.text import TfidfVectorizer`

Cosine similarity 

- TF-IDF is a transofrmation applied ot texts to get two real-valued vectorsi n vector space. Then we can obtain the cosine similarity of any pair of vectorys by taking their dot product and dividing that by the product of their norms. 

That gives us the cosine of the angle between the vectors. Cosine similarity is a meausure of similarity between any two documents d1 and d2. 

Cosine similarity (d1, d2) = Dot product(d1, d2) / ||d1|| * ||d2||

On to practical building, so here are some notes about that: 

understand creating files, creating python files and how that's a way of talking to the computer in a way it understands. 

import statements inp ython

had to troubleshoot errors: how to do that

used io to open instead of just open() 

Understand dicts, arrays, etc. 

It'd be good to show the fully completed file, or where to put things like the function definitions and import statements.

Learning how to learn. 

Go through and annotate all the code. 

Troubleshooting errors 