# -*- coding: utf-8 -*-
from asgiref.sync import sync_to_async
import os
from flask import Flask, render_template, request, make_response, jsonify

import json
import logging

import tensorflow
from tensorflow.python.keras import backend as K

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_GPU_ALLOCATOR'] = 'cuda_malloc_async'
import sys
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
from tensorflow.keras.models import load_model
import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer, tokenizer_from_json
from tensorflow.keras.preprocessing import sequence
import pandas as pd
from collections import defaultdict

app = Flask('classifier')

numwords = 10000

keras_models = dict()
classes = dict()
tokenizers = dict()

@app.route('/classifier/prediction', methods = ['POST'])
def classifing():
    for file in os.listdir('./keras_classifier/classifier/keras_models/'):
        if '.h5' in file and file[:-3] not in keras_models:
            keras_models[file[:-3]] = load_model('./keras_classifier/classifier/keras_models/{file}'.format(file=file))
            keras_model_name = file[:-3]
            print(keras_model_name)

        if '.classes' in file and file[:-8] not in classes:
            classes[file[:-8]] = json.loads(open('./keras_classifier/classifier/keras_models/{file}'.format(file=file), 'rt').read())

        if '.tokenizer' in file and file[:-10] not in tokenizers:
            tokenizers[file[:-10]] = tokenizer_from_json(
                open('./keras_classifier/classifier/keras_models/{file}'.format(file=file), 'rt').read())
    msg = request.form.get('msg')
    X_raw_test = [str(msg)]
    x_test = tokenizers[keras_model_name].texts_to_sequences(X_raw_test)
    x_test = sequence.pad_sequences(x_test, maxlen=50)
    try:
        prediction = keras_models[keras_model_name].predict(x_test)
    except Exception as e:
        print(e)
    ret = {classes[keras_model_name][str(i)]: p for i, p in enumerate(prediction[0])}
    return ret

def main():
    app.run(host='0.0.0.0',port='3002')

if __name__ == '__main__':
    main()
