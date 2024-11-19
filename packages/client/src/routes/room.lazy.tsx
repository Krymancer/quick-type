import { useCurrentRoom } from '@/hooks/useCurrentRoom';
import { useWebsocket } from '@/providers/WebsocketProvider';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createLazyFileRoute('/room')({
  component: Room,
})

function Room() {
  const [isReady, setIsReady] = useState(false);

  const { send } = useWebsocket();
  const currentRoom = useCurrentRoom();
  const navigate = useNavigate();

  const handleLeaveRoom = () => {
    console.log(currentRoom)
    if (send) {
      send(JSON.stringify({ type: 'leave_room', roomId: currentRoom.id }));
    }
  };

  useEffect(() => {
    if (!currentRoom) {
      navigate({ to: '/' });
    }
  }, [currentRoom, navigate]);

  if (!currentRoom) {
    return null;
  }

  return (
    <div className='flex items-center flex-col p-10 gap-4'>
      <div className="p-2 text-2xl font-bold">{currentRoom.name}</div>
      <div className="border-2 border-foreground-300 rounded-md w-1/2 min-h-40 p-2 text-3xl flex items-center justify-center flex-wrap gap-2">
        banana
      </div>
      <div className='flex gap-2 w-1/2'>
        <div className='w-full'>
          <Input placeholder='Type here' />
        </div>
        <div className='gap-2 flex'>
          <Button variant='default' disabled={isReady} onClick={() => setIsReady(true)}>Ready</Button>
          <Button variant='destructive' onClick={handleLeaveRoom}>Leave Room</Button>
        </div>
      </div>
    </div>
  );
}
