import "./AreaTable.scss";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TABLE_HEADS = [
  "Subject ID",
  "Message",
  "Message Date",
  " ",
];

const AreaTable = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [subjectIdFilter, setSubjectIdFilter] = useState(""); // Track subject ID filter
  const itemsPerPage = 5; // Number of messages per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/message/all");
        const sortedMessages = response.data.sort((a, b) => new Date(b.messageDate) - new Date(a.messageDate));
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (messageId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8085/api/v1/message/${messageId}`);
          setMessages(messages.filter((message) => message.messageId !== messageId));
          Swal.fire(
            'Deleted!',
            'Your message has been deleted.',
            'success'
          );
        } catch (error) {
          console.error("Error deleting message:", error);
          Swal.fire(
            'Error!',
            'There was a problem deleting your message.',
            'error'
          );
        }
      }
    });
  };

  const handleEdit = async (message) => {
    const { value: newMessage } = await Swal.fire({
      title: 'Edit Message',
      input: 'text',
      inputLabel: 'Message',
      inputValue: message.message,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      }
    });

    if (newMessage) {
      try {
        const response = await axios.put(`http://localhost:8085/api/v1/message/update/${message.messageId}`, {
          message: newMessage,
        });
        setMessages(messages.map((msg) => (msg.messageId === message.messageId ? response.data : msg)));
        Swal.fire(
          'Updated!',
          'Your message has been updated.',
          'success'
        );
      } catch (error) {
        console.error("Error updating message:", error);
        Swal.fire(
          'Error!',
          'There was a problem updating your message.',
          'error'
        );
      }
    }
  };

  const getFilteredMessages = () => {
    return messages.filter((message) => {
      return subjectIdFilter === "" || message.subject.subjectid.toUpperCase().includes(subjectIdFilter.toUpperCase());
    });
  };

  const filteredMessages = getFilteredMessages();
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage); // Calculate total pages

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getVisibleMessages = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredMessages.length);
    return filteredMessages.slice(startIndex, endIndex);
  };

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Messages</h4>
        <div className="filter-container">
          <input
            id="subjectIdFilter"
            type="text"
            placeholder="Filter by Subject ID"
            value={subjectIdFilter}
            onChange={(e) => {
              setSubjectIdFilter(e.target.value.toUpperCase());
              setCurrentPage(1); // Reset to the first page when filter changes
            }}
            style={{
              fontSize: '16px',
              marginRight: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#333',
              padding: '5px'
            }}
          />
        </div>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getVisibleMessages().map((dataItem) => (
              <tr key={dataItem.messageId}>
                <td>{dataItem.subject.subjectid}</td>
                <td>{dataItem.message}</td>
                <td>{new Date(dataItem.messageDate).toLocaleString()}</td>
                <td className="dt-cell-action">
                  <Button
                    style={{width:"130px",margin:5,backgroundColor:"#475be8"}}
                    onClick={() => handleEdit(dataItem)}
                  >
                    Edit
                  </Button>
                  <Button
                    style={{width:"130px",margin:5,backgroundColor:"#d9544f"}}
                    onClick={() => handleDelete(dataItem.messageId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="data-table-navigation">
            <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={handlePrev}>
              Prev
            </Button>
            <span style={{ marginLeft: '10px', marginRight: '10px' }}>
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={handleNext}>
              Next
            </Button>
            <span className="dropnavigation">
              <select
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value))}
                style={{
                  fontSize: '16px',
                  marginLeft: '10px',
                  paddingRight: '10px',
                  width:"50px",
                  paddingBottom: '5px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#333'
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default AreaTable;
