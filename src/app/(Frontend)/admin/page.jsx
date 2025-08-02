// Add below imports at the top
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export default function AdminPanel() {
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', description: '', image: '' })
  const [editMode, setEditMode] = useState(false)
  const [editNoteId, setEditNoteId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      router.push('/login')
    } else {
      setUser(loggedInUser)
    }

    const storedNotes = localStorage.getItem('notes')
    if (storedNotes) setNotes(JSON.parse(storedNotes))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    router.push('/login')
  }

  const toggleDone = (noteId) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, done: !note.done } : note
    )
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  const handleUploadToggle = () => {
    setShowUpload(!showUpload)
    setNewNote({ title: '', description: '', image: '' })
    setEditMode(false)
    setEditNoteId(null)
  }

  const handleInputChange = (e) => {
    setNewNote({ ...newNote, [e.target.name]: e.target.value })
  }

  const handleNoteAddOrEdit = (e) => {
    e.preventDefault()

    if (!newNote.title || !newNote.description) {
      alert('Title and description are required')
      return
    }

    let updatedNotes
    if (editMode) {
      // Edit mode: update the note
      updatedNotes = notes.map((note) =>
        note.id === editNoteId ? { ...note, ...newNote } : note
      )
    } else {
      // Add mode: create a new note
      const noteToAdd = {
        id: uuidv4(),
        ...newNote,
        done: false,
      }
      updatedNotes = [noteToAdd, ...notes]
    }

    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    setNewNote({ title: '', description: '', image: '' })
    setShowUpload(false)
    setEditMode(false)
    setEditNoteId(null)
  }

  const handleDelete = (id) => {
    const confirmed = confirm('Are you sure you want to delete this note?')
    if (!confirmed) return

    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  const handleEdit = (note) => {
    setNewNote({ title: note.title, description: note.description, image: note.image })
    setEditNoteId(note.id)
    setEditMode(true)
    setShowUpload(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <nav className="bg-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-wide text-purple-700 select-none cursor-default">
            Admin Panel
          </h1>
          <div className="hidden sm:flex space-x-8 items-center text-gray-600 font-medium text-base">
            <button onClick={() => setShowUpload(false)} className="hover:text-purple-700 transition">Dashboard</button>
            <button onClick={handleUploadToggle} className="hover:text-purple-700 transition">
              {editMode ? 'Cancel Edit' : 'Upload'}
            </button>
            <button onClick={() => alert('Manage Users clicked')} className="hover:text-purple-700 transition">Manage Users</button>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-md text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Upload Form */}
      {showUpload && (
        <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6 border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">
            {editMode ? 'Edit Note' : 'Upload New Note'}
          </h2>
          <form onSubmit={handleNoteAddOrEdit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newNote.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newNote.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
              required
            />
            <input
              type="url"
              name="image"
              placeholder="Image URL (optional)"
              value={newNote.image}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {editMode ? 'Update Note' : 'Add Note'}
            </button>
          </form>
        </div>
      )}

      {/* Notes List */}
      {!showUpload && (
        <main className="flex-grow max-w-7xl mx-auto px-6 py-10 flex flex-col">
          <h2 className="text-5xl font-bold text-center mb-10 text-purple-900 tracking-tight select-none">
            Manage Drawing Notes
          </h2>

          {notes.length === 0 ? (
            <p className="flex-grow flex items-center justify-center text-lg text-gray-400 font-medium italic">
              No notes available
            </p>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 rounded-lg"
              style={{ maxHeight: 'calc(100vh - 180px)' }}
            >
              {notes.map((note) => (
                <article
                  key={note.id}
                  className={`bg-white rounded-3xl border shadow-md flex flex-col ${
                    note.done ? 'border-green-400' : 'border-gray-200'
                  }`}
                  tabIndex={0}
                >
                  <div className="relative h-48 w-full rounded-t-3xl overflow-hidden">
                    <img
                      src={note.image || 'https://via.placeholder.com/400x300.png?text=Drawing+Note'}
                      alt="Drawing thumbnail"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold mb-3 text-gray-900 truncate">{note.title}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed line-clamp-5 flex-grow">
                      {note.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${note.done ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {note.done ? 'Done' : 'Pending'}
                      </span>

                      <button
                        onClick={() => toggleDone(note.id)}
                        className={`px-4 py-2 rounded-lg text-white font-semibold ${
                          note.done ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {note.done ? 'Mark as Pending' : 'Mark as Done'}
                      </button>

                      <button
                        onClick={() => handleEdit(note)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(note.id)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  )
}
