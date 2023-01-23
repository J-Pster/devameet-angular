export type Meet = {
  id: string;
  name: string;
  color: string;
  link: string;
};

export type MeetObject = {
  name: string;
  x: number;
  y: number;
  zindex: number;
  orientation: string;
};

export type MeetPut = {
  name: string;
  color: string;
  objects: MeetObject[];
};

export type MeetPost = {
  name: string;
  color: string;
};

export type MeetRoom = {
  link: string;
  name: string;
  color: string;
  objects: RoomObject[];
};

export type RoomObject = {
  walkable: boolean;
  _id: string;
  meet: string;
  name: string;
  x: number;
  y: number;
  zindex: number;
  orientation: string;
  __v: number;
};
