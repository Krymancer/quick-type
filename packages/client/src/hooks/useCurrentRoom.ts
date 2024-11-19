import { useQuery } from '@tanstack/react-query';

export const useCurrentRoom = () => {
  const { data: currentRoom } = useQuery({
    queryKey: ['current_room'],
    enabled: false,
    initialData: null,
  });

  return currentRoom as any;
};