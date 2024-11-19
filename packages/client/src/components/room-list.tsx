import { useWebsocket } from "@/providers/WebsocketProvider";
import { useQuery } from '@tanstack/react-query';

export const RoomList: React.FC = () => {
  const { ready } = useWebsocket();

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    enabled: false,
    initialData: [],
  });

  if (!ready) return;

  return (
    <div className="border-2 border-foreground-300 rounded-md w-1/2 min-h-40 p-2 flex justify-center flex-wrap gap-2">
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
  const { send } = useWebsocket();

  const handleJoinRoom = () => {
    if (send) {
      send(JSON.stringify({ type: 'join_room', roomId: props.id }));
    }
  }

  return (
    <div className="p-2 rounded-md bg-blue-600 flex justify-center items-center w-32 h-10 hover:bg-blue-700"
      onClick={handleJoinRoom}
    >
      <p>{props.name}</p>
    </div>
  )
}