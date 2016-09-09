from flask import jsonify, request, send_from_directory
from app import *
from werkzeug import secure_filename
import os

app.config['UPLOAD_FOLDER'] = '../uploads/'
app.config['ALLOWED_EXTENSIONS'] = set(['pdf'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


@app.route('/api/upload/pdf', methods=['POST','GET'])
def upload():
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))


