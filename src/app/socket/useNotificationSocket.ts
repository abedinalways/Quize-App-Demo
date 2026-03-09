// useNotificationSocket.ts
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/NotificationSlice';
import Cookies from 'js-cookie';

export function useNotificationSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('token');
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      console.log('Connected to notification socket');
    });
    
    socket.on('message', notification => {
      console.log('Message received: ppppppppppppppp=+++++++++++++++++++', notification);
      dispatch(addNotification(notification)); 
    });

    socket.on('approved', notification => {
      dispatch(addNotification(notification));
    });

    socket.on('rejected', notification => {
      dispatch(addNotification(notification));
    });

    socket.on('Follow', notification => {
      dispatch(addNotification(notification));
    });

    socket.on('conversation', notification => {
      dispatch(addNotification(notification));
    });

    socket.on('user-registered', notification => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return null;
}
