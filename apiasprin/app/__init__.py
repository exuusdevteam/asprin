from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt

app = Flask(__name__)

bcrypt = Bcrypt(app)





