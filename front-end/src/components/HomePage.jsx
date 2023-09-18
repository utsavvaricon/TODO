import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Import the CSS file



function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });


    // Define the fetchItems function
    const fetchItems = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // Redirect to login if access token is not found
          navigate('/login');
          return;
        }
        const response = await fetch('http://localhost:8000/api/todo/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data); // Store all items, both completed and incomplete
        }else if (response.status === 401) {
          // Token expired, renew token and try again
          await renewAccessToken();
          fetchItems(); 
        }else {
          setError('Error fetching items.');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('An error occurred while fetching items.');
      }
    };
    
    useEffect(() => {
      fetchItems(); // Call fetchItems here to load items on initial render
    }, []);
  

  const handleLogout = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      const access_token = localStorage.getItem('access_token');
  
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ refresh_token }),
      });
  
      if (response.ok) {
        // Clear local storage and redirect to login page
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');// Redirect to login page
      }else if (response.status === 401) {
        // Token expired, renew token and try again
        await renewAccessToken();
        handleLogout(); 
      }
    } catch (error) {
      console.error('Error logging out:', error);
      setError('An error occurred while logging out.');
    }
  };
  

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewTask({ title: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleAddTask = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');

      const response = await fetch('http://localhost:8000/api/todo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        // Close modal and refetch items
        closeModal();
        fetchItems();
      }else if (response.status === 401) {
        // Token expired, renew token and try again
        await renewAccessToken();
        handleAddTask(); 
      }else {
        console.error('Error adding task:', error);
        setError('Error adding task.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setError('An error occurred while adding task.');
    }
  };
  

  const handleDeleteTask = async (taskId) => {
    try {
      const accessToken = localStorage.getItem('access_token');

      const response = await fetch(`http://localhost:8000/api/todo/${taskId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // Delete task from the items list and update state
        setItems((prevItems) => prevItems.filter((item) => item.id !== taskId));
      }else if (response.status === 401) {
        // Token expired, renew token and try again
        await renewAccessToken();
        handleDeleteTask(); 
      } else {
        setError('Error deleting task.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('An error occurred while deleting task.');
    }
  };


  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const accessToken = localStorage.getItem('access_token');
  
      const existingTask = items.find((item) => item.id === taskId);
      const updatedFields = {
        title: updatedTask.title || existingTask.title,
        description: updatedTask.description || existingTask.description,
        is_completed: updatedTask.is_completed,
      };
  
      const response = await fetch(`http://localhost:8000/api/todo/${taskId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedFields),
      });
  
      if (response.ok) {
        fetchItems(); // Refresh the list after updating
      } else if (response.status === 401) {
        // Token expired, renew token and try again
        await renewAccessToken();
        handleUpdateTask(taskId, updatedTask);
      } else {
        setError('Error updating task.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('An error occurred while updating task.');
    }
  };
  

  const handleCheckboxChange = async (taskId, isCompleted) => {
    const updatedTask = { is_completed: !isCompleted };
    await handleUpdateTask(taskId, updatedTask);
  };

  const renewAccessToken = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');

      const response = await fetch('http://localhost:8000/api/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refresh_token }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('access_token', access_token);
        console.log("OKKKKKK",data.access_token)
      } else {
        setError('Error renewing access token.');
      }
    } catch (error) {
      console.error('Error renewing access token:', error);
      setError('An error occurred while renewing access token.');
    }
  };


  return (
    <section  className=''>
      <div className="container-fluid">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">
              Home
            </a>
          </li>
      
          <li className="nav-item">
            <a className="nav-link justify-content-end" onClick={handleLogout} href="#">
              Log Out
            </a>
          </li>
        </ul>

        <div className="row d-flex justify-content-center align-items-center">
          <div className="col col-lg-12 col-xl-12">
            <div className="card rounded-3">
              <div className="card-body p-4">
                    <p className="mb-2">
                      <span className="h2 me-2">My Todo Lists</span>{' '}
                      <span className="badge bg-danger">checklist</span>
                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button class="btn btn-primary me-md-2" type="button"   onClick={openModal}>Add</button>
                      </div>
                    </p>


                  {/* TODO LIST TABLE */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Is Completed</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr
                          key={item.id}
                          className={item.is_completed ? 'completed' : ''}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={item.is_completed}
                              onChange={() => handleCheckboxChange(item.id, item.is_completed)}
                            />
                          </td>
                          <td className={item.is_completed ? 'completed-text' : ''}>{item.title}</td>
                          <td className={item.is_completed ? 'completed-text' : ''}>{item.description}</td>
                          <td><button className="btn btn-danger" onClick={() => handleDeleteTask(item.id)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                      
                    {/* TODO LIST Add Modal */}    
                  <div className={`modal fade${showModal ? ' show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Add New Task</h5>
                          <button type="button" className="btn-close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                          <form>
                            <div className="mb-3">
                              <label htmlFor="title" className="form-label">Title</label>
                              <input type="text" className="form-control" id="title" name="title" value={newTask.title} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                              <label htmlFor="description" className="form-label">Description</label>
                              <textarea className="form-control" id="description" name="description" rows="3" value={newTask.description} onChange={handleInputChange}></textarea>
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={closeModal}>
                            Cancel
                          </button>
                          <button type="button" className="btn btn-primary" onClick={handleAddTask}>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              </div>
            </div>
          </div>
        </div>
  
   
 
      
    </section>

    
  );
}

export default HomePage;
