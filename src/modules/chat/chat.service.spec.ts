import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { MessagesRepository } from './messages.repository';
import { MessagingService } from '../../messaging/messaging.service';
import { MessageDocument } from './schemas/message.schema';

const messageFactory = (data?: Partial<MessageDocument>): MessageDocument =>
  ({
    id: 'msg-1',
    senderId: 'sender',
    receiverId: 'receiver',
    content: 'hello',
    createdAt: new Date('2020-01-01T00:00:00Z'),
    seen: false,
    ...data,
  } as unknown as MessageDocument);

describe('ChatService', () => {
  let service: ChatService;
  const repoMock = {
    sendMessage: jest.fn(),
    getConversation: jest.fn(),
  } as unknown as MessagesRepository;

  const messagingMock = {
    emit: jest.fn(),
  } as unknown as MessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: MessagesRepository, useValue: repoMock },
        { provide: MessagingService, useValue: messagingMock },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    jest.clearAllMocks();
  });

  it('sendMessage saves and returns message, then emits event', async () => {
    const saved = messageFactory();
    repoMock.sendMessage = jest.fn().mockResolvedValue(saved);

    const result = await service.sendMessage('sender', 'receiver', 'hello');

    expect(repoMock.sendMessage).toHaveBeenCalledWith('sender', 'receiver', 'hello');
    expect(messagingMock.emit).toHaveBeenCalledWith('chat.message.received', expect.objectContaining({
      messageId: saved.id,
      senderId: saved.senderId,
      receiverId: saved.receiverId,
      content: saved.content,
    }));
    expect(result).toEqual(saved);
  });
});
