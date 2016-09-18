from ...model.models import User
import arrow


def printJobBusiness(json_jobs):
    data = {'PrintJob':[]}
    for item in json_jobs:
        user = User.query.get(item['user_id'])
        item['names'] = user.names
        date = arrow.get(item['regDate'])
        item['regDate'] = date.to('Africa/Kigali').humanize()
        data['PrintJob'].append(item)
    return data