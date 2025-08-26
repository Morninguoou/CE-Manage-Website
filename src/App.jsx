import { Routes, Route } from 'react-router-dom'
import SubjectListPage from './pages/Subjects/SubjectListPage'
import FacultyMemberListPage from './pages/FacultyMember/FacultyMemberListPage'
import FacultyMemberDetailPage from './pages/FacultyMember/FacultyMemberDetailPage'
import FacultyMemberAddPage from './pages/FacultyMember/FacultyMemberAddPage'
import FacultyMemberEditPage from './pages/FacultyMember/FacultyMemberEditPage'
import LoginPage from './pages/LoginPage'
import EventListPage from './pages/Event/EventListPage'
import CreateEventPage from './pages/Event/EventCreatePage'
import EditEventPage from './pages/Event/EventEditPage'

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/subjectslist" element={<SubjectListPage />} />
        <Route path="/facultymemberslist" element={<FacultyMemberListPage />} />
        <Route path="/facultymember/:id" element={<FacultyMemberDetailPage />} />
        <Route path="/addfacultymember" element={<FacultyMemberAddPage />} />
        <Route path="/editfacultymember/:id" element={<FacultyMemberEditPage />} />
        <Route path="/eventslist" element={<EventListPage />} />
        <Route path="/event/create" element={<CreateEventPage />} />
        <Route path="/event/edit/:id" element={<EditEventPage />} />
      </Routes>
    </div>
  )
}

export default App
