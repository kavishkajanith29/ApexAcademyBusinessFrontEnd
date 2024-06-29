import  { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import AreaTable from './AreaTable';
import { useNavigate } from "react-router-dom";

const MessageForm = () => {
  const [subjectId, setSubjectId] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const teacherId = localStorage.getItem('teacherId');
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/subject/all`);
        const filteredSubjects = response.data.filter(subject => 
          subject.teacher.teacherid === teacherId
        );
        setSubjects(filteredSubjects);
      } catch (error) {
        console.error('Error fetching subjects', error);
      }
    };

    fetchSubjects();
  }, [teacherId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8085/api/v1/message/send', {
        subjectId,
        message,
      });
      setResponse(res.data);
      setError(null);
      

      // Show success message using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Your message has been sent successfully.',
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.reload(); // Refresh the page
      });
    } catch (err) {
      setError(err.response ? err.response.data : 'Error sending message');
      setResponse(null);
    }
  };

  return (
    <section className="msgsend">
      <form onSubmit={handleSendMessage}>
        <div className='flex'>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          >
            <option value="">Select a Subject</option>
            {subjects.map(subject => (
              <option key={subject.subjectid} value={subject.subjectid}>
                {subject.subjectname} ({subject.subjectid})
              </option>
            ))}
          </select>
          <textarea
  
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder='Enter message here...'
          ></textarea>
        </div>
        <button className='msgbtn' type="submit">Send</button>
      </form>
      <div style={{marginTop:50}}>
      <AreaTable/>
      </div>
    </section>
  );
};

export default MessageForm;
