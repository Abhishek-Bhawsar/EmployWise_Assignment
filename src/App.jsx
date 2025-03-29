import { BrowserRouter,Route,Routes,Navigate} from 'react-router-dom'

import Login from './components/Login'
import UserList from './components/UserList'
import EditUser from './components/EditUser'
import PrivateRoute from './components/PrivateRoute'

import './App.css';


function App() {

  return (
    <div className="App"> 
            <BrowserRouter>
               <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/users" element={
                    <PrivateRoute>
                      <UserList />
                    </PrivateRoute>
                  } />

                  <Route path="/edituser/:id" element={
                    <PrivateRoute>
                      <EditUser />
                    </PrivateRoute>
                  } />
              </Routes>
            </BrowserRouter>
           
    </div>  
  )
}

export default App
