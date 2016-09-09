from app import app
from app.api.get import *
from app.api.post import *
from app.api.put import *
from app.api.delete import *



@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)