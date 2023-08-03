import socketio
import time

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

@sio.event
def message(req):
    print('message', req)

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('https://web-pipe.onrender.com')

for i in range(5):
    sio.emit('message', {'text': 'член'})
    time.sleep(1)

sio.wait()