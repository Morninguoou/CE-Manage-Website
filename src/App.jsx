import { Routes, Route } from 'react-router-dom'
import SubjectListPage from './pages/Subjects/SubjectListPage'
import SubjectDetailPage from './pages/Subjects/SubjectDetailPage'
import SubjectEditPage from './pages/Subjects/SubjectEditPage'
import SubjectAddPage from './pages/Subjects/SubjectAddPage'
import FacultyMemberListPage from './pages/FacultyMember/FacultyMemberListPage'
import FacultyMemberDetailPage from './pages/FacultyMember/FacultyMemberDetailPage'
import FacultyMemberAddPage from './pages/FacultyMember/FacultyMemberAddPage'
import FacultyMemberEditPage from './pages/FacultyMember/FacultyMemberEditPage'
import LoginPage from './pages/LoginPage'
import EventListPage from './pages/Event/EventListPage'
import CreateEventPage from './pages/Event/EventCreatePage'
import EditEventPage from './pages/Event/EventEditPage'
import StudentListPage from './pages/Student/StudentListPage'

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Routes>
        // login
        <Route path="/" element={<LoginPage />} />
        // subject
        <Route path="/subjectslist" element={<SubjectListPage />} />
        <Route path="/subjects/:id" element={<SubjectDetailPage />} />
        <Route path="/subjects/:id/edit" element={<SubjectEditPage />} />
        <Route path="/subjects/create" element={<SubjectAddPage />} />
        // facultymember
        <Route path="/facultymemberslist" element={<FacultyMemberListPage />} />
        <Route path="/facultymember/:id" element={<FacultyMemberDetailPage />} />
        <Route path="/addfacultymember" element={<FacultyMemberAddPage />} />
        <Route path="/editfacultymember/:id" element={<FacultyMemberEditPage />} />
        // event
        <Route path="/eventslist" element={<EventListPage />} />
        <Route path="/event/create" element={<CreateEventPage />} />
        <Route path="/event/edit/:id" element={<EditEventPage />} />
        // student
        <Route path="/studentslist" element={<StudentListPage />} />
        {/* <Route path="/students/:id" element={<StudentDetailPage />} />
        <Route path="/students/:id/edit" element={<StudentEditPage />} />
        <Route path="/students/create" element={<StudentAddPage />} /> */}
      </Routes>
    </div>
  )
}

export default App
