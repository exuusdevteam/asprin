from app import app
from app.api.get import *



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)