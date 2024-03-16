import Backend from './apiConfig';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketService = {
    stompClient: null,
    connected: false,

    connect: function(callback) {
        // Проверяем, существует ли уже соединение и активно ли оно
        if (this.stompClient && this.connected) {
            if(callback) callback();
            return; // Выходим из функции, если соединение уже установлено
        }

        let socket = new SockJS(Backend.websocketBase);
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, () => {
            this.connected = true; // Устанавливаем флаг подключения
            if(callback) callback();
        });
    },
    subscribe: function(topic, callback) {
        this.throwIfNotConnected();
        this.stompClient.subscribe(topic, (message) => {
            if(callback) callback(message);
        });
    },
    disconnect: function() {
        this.throwIfNotConnected();
        if (this.stompClient) {
            this.stompClient.disconnect(() => {
                this.connected = false; // Сбрасываем флаг подключения после отключения
                this.stompClient = null; // Очищаем ссылку на stompClient
            });
        }
    }, 
    send: function(topic, message) {
        this.throwIfNotConnected();
        this.stompClient.send(topic, {}, message);
    },
    throwIfNotConnected: function() {
        if (!this.stompClient || !this.connected) {
            throw new Error('You are not connected to the server');
        }
    }
}

export default WebSocketService;
