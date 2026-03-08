import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { loadData, saveData, saveFileHandleInfo, getFileHandleInfo } from '../utils/storage'
import { createFile, openFile, writeFile, readFile } from '../utils/fileOperations'

const HealthDataContext = createContext()

export function HealthDataProvider({ children }) {
  const [moodEntries, setMoodEntries] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [fileHandle, setFileHandle] = useState(null)
  const [fileStatus, setFileStatus] = useState('none') // 'none', 'saving', 'saved', 'error'
  const fileHandleRef = useRef(null)
  const [waterEntries, setWaterEntries] = useState([])

  // Load data on startup
  useEffect(() => {
    async function initialize() {
      // Load from localStorage first
      const loaded = loadData()
      setMoodEntries(loaded.moodEntries)
      setWaterEntries(loaded.waterEntries)
      setIsLoaded(true)
      
      // Try to set up file auto-save
      const handleInfo = getFileHandleInfo()
      if (handleInfo && 'showOpenFilePicker' in window) {
        const handle = await openFile()
        if (handle) {
          fileHandleRef.current = handle
          setFileHandle(handle)
          
          // Load data from file if it's newer
          const fileData = await readFile(handle)
          if (fileData?.moodEntries || fileData?.waterEntries) {
            setMoodEntries(fileData.moodEntries || [])
            setWaterEntries(fileData.waterEntries || [])
          
            saveData({
              moodEntries: fileData.moodEntries || [],
              waterEntries: fileData.waterEntries || []
            })
          }
        }
      } else {
        // Auto-setup file on first use
        const handle = await createFile()
        if (handle) {
          fileHandleRef.current = handle
          setFileHandle(handle)
          saveFileHandleInfo(handle)
          await writeFile(handle, {
            moodEntries: loaded.moodEntries,
            waterEntries: loaded.waterEntries || [],
            lastSaved: new Date().toISOString()
          })
        }
      }
    }
    
    initialize()
  }, [])

  // Auto-save to localStorage and file when data changes
  useEffect(() => {
    if (isLoaded) {
      saveData({moodEntries, waterEntries})
      saveToFile()
    }
  }, [moodEntries, waterEntries, isLoaded])

  async function saveToFile() {
    const handle = fileHandleRef.current
    if (!handle) return

    setFileStatus('saving')
    const success = await writeFile(handle, {
      moodEntries,
      waterEntries,
      lastSaved: new Date().toISOString()
    })
    
    if (success) {
      setFileStatus('saved')
      setTimeout(() => setFileStatus('none'), 2000)
    } else {
      setFileStatus('error')
      setTimeout(() => setFileStatus('none'), 3000)
    }
  }

  async function setupFileHandle() {
    const handle = await createFile()
    if (handle) {
      fileHandleRef.current = handle
      setFileHandle(handle)
      saveFileHandleInfo(handle)
      await saveToFile()
      return true
    }
    return false
  }

  async function loadFromFile() {
    const handle = await openFile()
    if (handle) {
      fileHandleRef.current = handle
      setFileHandle(handle)
      saveFileHandleInfo(handle)
      
      const data = await readFile(handle)
      if (data?.moodEntries || data?.waterEntries) {
        setMoodEntries(data.moodEntries || [])
        setWaterEntries(data.waterEntries || [])
      
        saveData({
          moodEntries: data.moodEntries || [],
          waterEntries: data.waterEntries || []
        })
      
        return true
      }
    }
    return false
  }

  const addMoodEntry = (entry) => {
    setMoodEntries([...moodEntries, entry])
  }

  const deleteMoodEntry = (id) => {
    setMoodEntries(moodEntries.filter(entry => entry.id !== id))
  }

  const addWaterEntry = (entry) => {
    setWaterEntries(prev => [...prev, entry])
  }

  const setAllData = (moodEntries) => {
    setMoodEntries(moodEntries)
  }

  const exportData = () => {
    const data = {
      moodEntries,
      waterEntries,
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      if (data.moodEntries && Array.isArray(data.moodEntries)) {
        setAllData(data.moodEntries)
        return true
      }
      if (data.waterEntries && Array.isArray(data.waterEntries)) {
        setWaterEntries(data.waterEntries)
        return true
      }
      return false
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  return (
    <HealthDataContext.Provider
      value={{
        moodEntries,
        addMoodEntry,
        deleteMoodEntry,

        waterEntries,
        addWaterEntry,

        exportData,
        importData,
        setAllData,
        setupFileHandle,
        loadFromFile,
        fileHandle,
        fileStatus,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  )
}

export function useHealthData() {
  const context = useContext(HealthDataContext)
  if (!context) {
    throw new Error('useHealthData must be used within HealthDataProvider')
  }
  return context
}
