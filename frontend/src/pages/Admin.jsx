import { Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar'

function Admin() {
  return (
    <div className='container-fluid overflow-hidden'>
      <div className='row min-vh-100 '>
        <SideBar />
        <div className='col d-flex flex-column h-sm-100'>
          <div className='row'>
            <div className='col'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
