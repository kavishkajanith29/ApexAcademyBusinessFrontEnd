import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams } from "react-router-dom";

const AreaProgressChart = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(5);
  const { id:subjectId } = useParams(); 
  
  useEffect(() => {
    
    if (subjectId) {
      // Fetch messages from the API
      axios.get('http://localhost:8085/api/v1/message/all')
        .then(response => {
          // Filter and sort messages by messageDate in descending order
          const filteredMessages = response.data
            .filter(message => message.subject.subjectid === subjectId)
            .sort((a, b) => new Date(b.messageDate) - new Date(a.messageDate));
          
          setMessages(filteredMessages);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    }
  }, []);
  
  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Notification about the Class</h4>
      </div>
      <div className="progress-bar-list">
        {currentMessages.map((message) => (
          <div className="progress-bar-item" key={message.messageId}>
            <div className="bar-item-info" style={{borderBottom:"solid"}}>
              <p className="bar-item-info-name-class">{message.message}({message.subject.day})</p>
              <p className="bar-item-info-value-class">
                {new Date(message.messageDate).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination navigation */}
      {messages.length > messagesPerPage && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(messages.length / messagesPerPage) }, (_, index) => (
              <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default AreaProgressChart;
