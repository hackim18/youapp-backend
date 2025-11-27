import { Test, TestingModule } from '@nestjs/testing';
import { RmqContext } from '@nestjs/microservices';
import { ChatEventsController } from './chat.events.controller';
import { MessagesRepository } from './messages.repository';
import { MessageReceivedEvent } from './events/message-received.event';

describe('ChatEventsController', () => {
  let controller: ChatEventsController;
  const repoMock = {
    markDelivered: jest.fn(),
  } as unknown as MessagesRepository;

  const ack = jest.fn();
  const context = {
    getChannelRef: () => ({ ack }),
    getMessage: () => ({}),
  } as unknown as RmqContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatEventsController],
      providers: [{ provide: MessagesRepository, useValue: repoMock }],
    }).compile();

    controller = module.get<ChatEventsController>(ChatEventsController);
    jest.clearAllMocks();
  });

  it('marks message as delivered and acknowledges the message', async () => {
    const event: MessageReceivedEvent = {
      messageId: 'msg-1',
      senderId: 'user-a',
      receiverId: 'user-b',
      timestamp: new Date(),
      content: 'hello',
    };

    await controller.handleMessageReceived(event, context);

    expect(repoMock.markDelivered).toHaveBeenCalledWith(event.messageId, event.timestamp);
    expect(ack).toHaveBeenCalled();
  });
});
