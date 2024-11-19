import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { RoomList } from "@/components/room-list";
import { Button } from "@/components/ui/button";
import { useWebsocket } from "@/providers/WebsocketProvider";
import { useCurrentRoom } from '@/hooks/useCurrentRoom';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { send } = useWebsocket();
  const currentRoom = useCurrentRoom();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (send) {
      send(JSON.stringify({ type: "create_room" }));
    }
  }

  useEffect(() => {
    if (currentRoom) {
      navigate({
        to: '/room',
        params: {
          id: currentRoom.id,
        }
      });
    }
  }, [currentRoom, navigate]);



  return (
    <div className="flex p-6 gap-4 flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Quick Type</h1>
      <RoomList />
      <div className="flex gap-2 w-full justify-end">
        <Button onClick={handleCreateRoom}>Create a room</Button>
      </div>
    </div>
  );
}