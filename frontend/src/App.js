import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.rtl.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import Layout from './components/Layout'
import ManageSurahs from './pages/ManageSurahs'
import Admin from './pages/Admin'
import ManageQueriesAll from './pages/ManageQueriesAll'
import ManageQueriesUnanswered from './pages/ManageQueriesUnanswered'
import ManageTags from './pages/ManageTags'
import ManageSurah from './pages/ManageSurah'
import Tafseer from './pages/Tafseer'
import TafseerDetails from './pages/TafseerDetails'
import ManageTafseers from './pages/ManageTafseers'
import ManageTafseer from './pages/ManageTafseer'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import LanguageSelector from './components/LanguageSelector'
import AllQueries from './pages/AllQueries'
import TafseerSearch from './pages/TafseerSearch'
import SubmitNewQuery from './pages/SubmitNewQuery'
import AddAudio from './pages/AddAudio'
import AudioPlayer from './components/audioPlayer/AudioPlayer'
import TestLayout from './pages/TestLayout'
import Register from './pages/Register'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <div className='container-fluid ps-4 pe-4'>
          <LanguageSelector />
        </div>
        <Layout>
          <div className='container-fluid'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/test' element={<TestLayout />} />
              <Route path='/queries/all' element={<AllQueries />} />
              <Route path='/queries/new' element={<SubmitNewQuery />} />
              <Route path='/tafseer/all' element={<Tafseer />} />
              <Route path='/tafseer/search' element={<TafseerSearch />} />
              <Route
                path='/tafseer/all/:surahId'
                element={<TafseerDetails />}
              />
              <Route path='/player' element={<AudioPlayer />} />
              <Route path='/admin' element={<PrivateRoute />}>
                <Route path='/admin' element={<Admin />}>
                  <Route path='manage-surahs' element={<ManageSurahs />} />
                  <Route
                    path='manage-surahs/:surahId'
                    element={<ManageSurah />}
                  />
                  <Route
                    path='manage-tafseers/:surahId'
                    element={<ManageTafseer />}
                  />
                  <Route
                    path='manage-tafseers/:surahId/audio'
                    element={<AddAudio />}
                  />
                  {/* <Route path='manage-queries' element={<ManageQueries />} /> */}
                  <Route
                    path='manage-queries/all'
                    element={<ManageQueriesAll />}
                  />
                  <Route
                    path='manage-queries/unanswered'
                    element={<ManageQueriesUnanswered />}
                  />
                  <Route path='manage-queries/tags' element={<ManageTags />} />
                  <Route path='manage-tafseers' element={<ManageTafseers />} />
                </Route>
              </Route>
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        </Layout>
        <Footer />
      </Router>
    </>
  )
}

export default App
