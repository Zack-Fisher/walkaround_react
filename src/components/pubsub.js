import React, { useEffect } from 'react';
import PubSub from 'pubsub-js';

const Pubsub = () => {
  useEffect(() => {
    const token = PubSub.subscribe('myTopic', (msg, data) => {
      console.log('Received message:', data);
    });

    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  const handleClick = () => {
    PubSub.publish('myTopic', 'Hello, subscribers!');
  };

  return (
    <div>
      <button onClick={handleClick}>Publish</button>
    </div>
  );
}

export default Pubsub;
