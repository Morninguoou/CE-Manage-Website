import React,{ useState,} from 'react'
import { useBackendStatus } from '../../hooks/ocr'
import { Header, DocumentManager } from '../../components/ocr'
import Sidebar from '../../components/Sidebar'
import CronScheduleModal from '../../components/CronScheduleModal';

function DocumentManagerPage() {
  const backendStatus = useBackendStatus()
  const [openScheduleModal, setOpenScheduleModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeMenu="cegpt"
        onOpenSchedule={() => setOpenScheduleModal(true)}
      /> {/* Sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col">
          <Header backendStatus={backendStatus} />
          <DocumentManager />
        </div>
      </div>
      <CronScheduleModal
        open={openScheduleModal}
        onClose={() => setOpenScheduleModal(false)}
      />
    </div>
  )
}

export default DocumentManagerPage

