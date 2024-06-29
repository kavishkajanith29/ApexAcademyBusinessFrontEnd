import  { useState } from 'react';
import axios from 'axios';

const MessageForm = () => {
  const [subjectId, setSubjectId] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8085/api/v1/message/send', {
        subjectId,
        message,
      });
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : 'Error sending message');
      setResponse(null);
    }
  };

  return (
    <div>
      <h2>Send Message</h2>
      <form onSubmit={handleSendMessage}>
        <div>
          <label htmlFor="subjectId">Subject ID:</label>
          <input
            type="text"
            id="subjectId"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
      {response && <div>Message sent successfully: {JSON.stringify(response)}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default MessageForm;
