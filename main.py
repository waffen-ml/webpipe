# pip install python-socketio

import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

@sio.event
def message(req):
    data = req['data']
    print('message received', data)
    data['text'] = data['text'] + '!'
    sio.emit('message', {'id': req['id'], 'data': data})

@sio.event
def disconnect():
    print('disconnected from server')


sio.connect('https://web-pipe.onrender.com')
sio.wait()