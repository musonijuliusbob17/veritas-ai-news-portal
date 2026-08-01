export type RoomType = 'Company Monitoring Room' | 'Government Intelligence Room' | 'Research Room';

export interface IntelligenceRoom {
  roomId: string;
  name: string;
  roomType: RoomType;
  ownerOrg: string;
  createdDate: string;
  trackedEntities: string[];
  sharedNotes: Array<{ author: string; date: string; content: string }>;
  memberEmails: string[];
  activeAlertCount: number;
}

export class IntelligenceRoomService {
  private static rooms: IntelligenceRoom[] = [
    {
      roomId: 'room_001',
      name: 'EAC Sovereign AI & Data Governance Chamber',
      roomType: 'Government Intelligence Room',
      ownerOrg: 'East African Community Secretariat (EAC)',
      createdDate: '2026-07-01',
      trackedEntities: ['Rwanda ICT Ministry', 'Smart Africa Alliance', 'Kigali Innovation City', 'REG Rwanda'],
      sharedNotes: [
        { author: 'Dr. Clare Akamanzi', date: '2026-07-29', content: 'Reviewed Q2 data sovereignty compliance matrix. All EAC nodes verified green.' },
        { author: 'Jean-Paul Nsengimana', date: '2026-08-01', content: 'Initiated background investigation on subsea fiber cable acoustic sensors.' }
      ],
      memberEmails: ['c.akamanzi@eac.int', 'jp.nsengimana@eac.int'],
      activeAlertCount: 2
    },
    {
      roomId: 'room_002',
      name: 'Norrsken Deep Tech VC Portfolio Monitor',
      roomType: 'Company Monitoring Room',
      ownerOrg: 'Norrsken Africa Innovation Fund',
      createdDate: '2026-07-10',
      trackedEntities: ['Norrsken Kigali', 'BioNTech Kigali', 'Ampersand Electric', 'Zipline Drone Logistics'],
      sharedNotes: [
        { author: 'Pascal Murasira', date: '2026-07-28', content: 'Zipline autonomous flight hours passed 500,000 mark in Rwanda.' }
      ],
      memberEmails: ['pascal@norrsken.org', 'elena@norrsken.org'],
      activeAlertCount: 1
    }
  ];

  public static getRooms(): IntelligenceRoom[] {
    return [...this.rooms];
  }

  public static createRoom(name: string, roomType: RoomType, ownerOrg: string, trackedEntities: string[] = []): IntelligenceRoom {
    const newRoom: IntelligenceRoom = {
      roomId: `room_${Date.now()}`,
      name,
      roomType,
      ownerOrg,
      createdDate: new Date().toISOString().split('T')[0],
      trackedEntities: trackedEntities.length > 0 ? trackedEntities : ['Rwanda', 'East Africa', 'Deep Tech'],
      sharedNotes: [{ author: 'System AI', date: new Date().toISOString().split('T')[0], content: `Initialized secure ${roomType} space.` }],
      memberEmails: ['admin@organization.org'],
      activeAlertCount: 0
    };
    this.rooms.unshift(newRoom);
    return newRoom;
  }

  public static addNoteToRoom(roomId: string, author: string, content: string) {
    const rm = this.rooms.find(x => x.roomId === roomId);
    if (rm) {
      rm.sharedNotes.push({ author, date: new Date().toISOString().split('T')[0], content });
    }
  }

  public static addTrackedEntity(roomId: string, entity: string) {
    const rm = this.rooms.find(x => x.roomId === roomId);
    if (rm && !rm.trackedEntities.includes(entity)) {
      rm.trackedEntities.push(entity);
    }
  }
}
