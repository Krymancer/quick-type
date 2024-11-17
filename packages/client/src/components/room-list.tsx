import { useWebsocket } from "@/providers/WebsocketProvider";
import { read } from "fs";
import { useEffect, useState } from "react";

type RoomListProps = React.HTMLAttributes<HTMLDivElement> & {
  rooms: any[];
}

export const RoomList: React.FC<RoomListProps> = (props: RoomListProps) => {
  const [rooms, setRooms] = useState([]);
  const { ready, messages } = useWebsocket();

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) return;

    if (lastMessage.type === "room_list") {
      setRooms(lastMessage.rooms);
    }
  }, [messages]);

  if (!ready) return;

  return (
    <div className="border-2 border-foreground-300 rounded-md w-96 min-h-40 p-2 flex justify-center flex-wrap gap-2">
      {!rooms.length && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p>No room avaliable.</p>
          <p>please create one to start playing!</p>
        </div>
      )}
      {rooms.map((room: any, index) => (<Room key={index} {...room} />))}
    </div>
  );
}

const Room = (props: any) => {
  return (
    <div className="p-2 rounded-md bg-blue-600 flex justify-center items-center w-16 h-10 hover:bg-blue-700">
      <p>{props.name}</p>
    </div>
  )
}