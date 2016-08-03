from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os


app = Flask(__name__)



###### DATATEBASE INITIALIZATION ##########

db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///asprin.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

#### DATABASE CREATION #####
db.create_all()
