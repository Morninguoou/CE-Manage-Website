import { useState, useEffect } from 'react'
import { checkBackendHealth } from '../../services/ocr/api'

export const useBackendStatus = () => {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const checkBackend = async () => {
      const healthStatus = await checkBackendHealth()
      setStatus(healthStatus)
    }

    checkBackend()
  }, [])

  return status
}

