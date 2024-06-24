import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})

export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    //3
    this.server.on("connection", (socket) => {
      console.log(socket.id);
      console.log(socket.connected);
    });
  }

  // You can listen to this event
  // Client can send message to me by using the message key/event name
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any) {
    console.log("Message is received from the client");
    console.log(data); //Here we did not send a message back to the server
    // Save the message to the database and return the reply in the response
    // Call the service method to save the record in the DB
  }
}
